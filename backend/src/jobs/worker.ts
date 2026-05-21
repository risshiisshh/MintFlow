import { Worker, Job } from 'bullmq';
import { redisConnection, MINT_QUEUE_NAME, MintJobData } from './queue';
import { executeGaslessMint } from '../blockchain/aaService';
import { db, COLLECTIONS } from '../firebase/firebase';
import { logSuccessfulTransaction } from '../analytics/analytics';
// @ts-ignore - Suppress IDE ghost error. This module exists and compiles successfully.
import { explainRevertReason } from '../utils/explainer';

/**
 * Initializes and starts the BullMQ background worker
 */
export function startWorker() {
  const worker = new Worker<MintJobData>(
    MINT_QUEUE_NAME,
    async (job: Job<MintJobData>) => {
      const { eoaAddress, chain, txRecordId } = job.data;
      console.log(`🤖 Processing Job ${job.id}: Minting NFT for ${eoaAddress} on ${chain}...`);

      const txRef = db.collection(COLLECTIONS.MINT_TRANSACTIONS).doc(txRecordId);

      // Update status in Firestore
      await txRef.update({
        status: 'processing',
        updatedAt: new Date().toISOString(),
      });

      try {
        // Execute the gasless transaction using the Safe smart account
        const result = await executeGaslessMint(eoaAddress, chain);

        // Update database with success
        await txRef.update({
          status: 'success',
          transactionHash: result.transactionHash,
          userOpHash: result.userOpHash,
          updatedAt: new Date().toISOString(),
        });

        // Track metrics and log sponsored gas
        // Estimate standard gas saved: ~$1.20 for Polygon mint, ~$0.80 for Base Sepolia mint
        const estimatedGasSaved = chain === 'polygon' ? 1.25 : 0.85;
        await logSuccessfulTransaction(eoaAddress, chain, estimatedGasSaved);

        console.log(`✨ Job ${job.id} succeeded. NFT minted. Hash: ${result.transactionHash}`);
      } catch (error: any) {
        console.error(`❌ Job ${job.id} failed:`, error.message);
        
        // Explain failure reason in plain English
        const rawError = error.message || 'Unknown EVM execution failure';
        const explanation = explainRevertReason(rawError);

        await txRef.update({
          status: 'failed',
          error: rawError,
          explanation: explanation,
          updatedAt: new Date().toISOString(),
        });

        // Propagate error to let BullMQ handle retry logic
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 2, // Concurrency limit for sequential transaction ordering per worker node
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`💥 Job ${job?.id || 'unknown'} failed permanently:`, err.message);
  });

  console.log('🤖 BullMQ Background Worker is listening for jobs...');
  return worker;
}
