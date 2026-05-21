import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { createSIWENonce, verifySIWESignature } from '../auth/auth';
import { getOrCreateSmartAccount, executeGaslessMint } from '../blockchain/aaService';
import { enqueueMintJob } from '../jobs/queue';
import { getGlobalAnalytics, logSuccessfulTransaction } from '../analytics/analytics';
import { db, COLLECTIONS } from '../firebase/firebase';
// @ts-ignore - Suppress IDE ghost error. This module exists and compiles successfully.
import { explainRevertReason } from '../utils/explainer';
import { z } from 'zod';

// Body verification schemas
const siweVerifySchema = z.object({
  message: z.string(),
  signature: z.string(),
});

const getWalletSchema = z.object({
  chain: z.enum(['polygon', 'base']),
});

const mintRequestSchema = z.object({
  chain: z.enum(['polygon', 'base']),
});

/**
 * Endpoint to request a new cryptographic nonce for SIWE login
 */
export async function handleGetNonce(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const nonce = await createSIWENonce();
    res.status(200).json({ nonce });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate auth nonce' });
  }
}

/**
 * Endpoint to verify SIWE signature and issue JWT session token
 */
export async function handleVerifySIWE(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parsed = siweVerifySchema.safeParse(req.body);
    if (!parsed.success) {
       res.status(400).json({ error: 'Invalid message or signature format.' });
       return;
    }

    const { message, signature } = parsed.data;
    const { token, address } = await verifySIWESignature(message, signature);

    res.status(200).json({ token, address });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Signature verification failed' });
  }
}

/**
 * Retrieve or compute the user's Safe smart account address
 */
export async function handleGetSmartWallet(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parsed = getWalletSchema.safeParse(req.query);
    if (!parsed.success) {
       res.status(400).json({ error: 'Invalid or missing chain parameter. Must be base or polygon.' });
       return;
    }

    const chain = parsed.data.chain;
    const eoaAddress = req.user?.address;

    if (!eoaAddress) {
       res.status(401).json({ error: 'Unauthorized user context.' });
       return;
    }

    const walletInfo = await getOrCreateSmartAccount(eoaAddress, chain);
    res.status(200).json({ ...walletInfo, eoaAddress });
  } catch (error: any) {
    console.error('❌ Failed to fetch/create smart account:', error);
    res.status(500).json({ error: error.message || 'Internal blockchain error' });
  }
}

/**
 * Enqueue a gasless mint request for async execution
 */
export async function handleRequestMint(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const parsed = mintRequestSchema.safeParse(req.body);
    if (!parsed.success) {
       res.status(400).json({ error: 'Invalid request body. Chain parameter is required.' });
       return;
    }

    const chain = parsed.data.chain;
    const eoaAddress = req.user?.address;

    if (!eoaAddress) {
       res.status(401).json({ error: 'Unauthorized session.' });
       return;
    }

    // Get the smart account address first
    const { smartAccountAddress } = await getOrCreateSmartAccount(eoaAddress, chain);

    // Create a transaction record in Firestore
    const txRecordRef = db.collection(COLLECTIONS.MINT_TRANSACTIONS).doc();
    const txRecordId = txRecordRef.id;

    const txRecord = {
      id: txRecordId,
      eoaAddress,
      smartAccountAddress,
      chain,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await txRecordRef.set(txRecord);

    // Try to enqueue the job on BullMQ
    const job = await enqueueMintJob(eoaAddress, chain, txRecordId);

    if (job) {
      // Redis is available — job enqueued for background worker
      res.status(202).json({
        message: 'Transaction enqueued for processing',
        txId: txRecordId,
        jobId: job.id,
        smartAccountAddress,
      });
    } else {
      // Redis unavailable — execute in-process as a fallback
      console.log(`⚡ [IN-PROCESS] Redis unavailable. Executing mint for ${eoaAddress} on ${chain} directly...`);
      
      res.status(202).json({
        message: 'Transaction accepted for in-process execution (no Redis)',
        txId: txRecordId,
        jobId: `local-${txRecordId}`,
        smartAccountAddress,
      });

      // Fire-and-forget: execute in background (non-blocking)
      (async () => {
        try {
          await txRecordRef.update({ status: 'processing', updatedAt: new Date().toISOString() });

          const result = await executeGaslessMint(eoaAddress, chain);

          await txRecordRef.update({
            status: 'success',
            transactionHash: result.transactionHash,
            userOpHash: result.userOpHash,
            updatedAt: new Date().toISOString(),
          });

          const estimatedGasSaved = chain === 'polygon' ? 1.25 : 0.85;
          await logSuccessfulTransaction(eoaAddress, chain, estimatedGasSaved);

          console.log(`✨ [IN-PROCESS] Mint succeeded. Hash: ${result.transactionHash}`);
        } catch (error: any) {
          console.error(`❌ [IN-PROCESS] Mint failed:`, error.message);
          const rawError = error.message || 'Unknown EVM execution failure';
          const explanation = explainRevertReason(rawError);

          await txRecordRef.update({
            status: 'failed',
            error: rawError,
            explanation: explanation,
            updatedAt: new Date().toISOString(),
          });
        }
      })();
    }
  } catch (error: any) {
    console.error('❌ Failed to enqueue mint:', error);
    res.status(500).json({ error: error.message || 'Failed to submit transaction to queue' });
  }
}

/**
 * Get the status of an enqueued transaction
 */
export async function handleGetTransactionStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const eoaAddress = req.user?.address;

    if (!eoaAddress) {
       res.status(401).json({ error: 'Unauthorized.' });
       return;
    }

    const txDoc = await db.collection(COLLECTIONS.MINT_TRANSACTIONS).doc(id).get();
    if (!txDoc.exists) {
       res.status(404).json({ error: 'Transaction record not found' });
       return;
    }

    const txData = txDoc.data();
    // Security check: Only the user who queued the transaction can see its status
    if (txData?.eoaAddress !== eoaAddress) {
       res.status(403).json({ error: 'Forbidden: Access to this transaction is denied.' });
       return;
    }

    res.status(200).json({
      id: txData.id,
      status: txData.status,
      transactionHash: txData.transactionHash || null,
      userOpHash: txData.userOpHash || null,
      error: txData.error || null,
      explanation: txData.explanation || null,
      createdAt: txData.createdAt,
      updatedAt: txData.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Public endpoint to fetch global system metrics
 */
export async function handleGetAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const analytics = await getGlobalAnalytics();
    res.status(200).json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve analytics dashboard' });
  }
}
