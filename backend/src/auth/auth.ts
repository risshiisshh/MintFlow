import { SiweMessage, generateNonce } from 'siwe';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import { db, COLLECTIONS } from '../firebase/firebase';

export interface JWTPayload {
  address: string;
}

/**
 * Generate a cryptographically secure nonce for SIWE and save it to Firestore
 * with a short expiry time (5 minutes) to prevent replay attacks.
 */
export async function createSIWENonce(): Promise<string> {
  const nonce = generateNonce();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

  await db.collection('nonces').doc(nonce).set({
    nonce,
    expiresAt: expiresAt.toISOString(),
    used: false,
  });

  return nonce;
}

/**
 * Verifies the SIWE signature, checks nonce validity, and signs a JWT session
 */
export async function verifySIWESignature(
  message: string,
  signature: string
): Promise<{ token: string; address: string }> {
  try {
    const siweMessage = new SiweMessage(message);
    
    // Verify SIWE signature on the network
    const verification = await siweMessage.verify({ signature });
    if (!verification.success) {
      throw new Error('SIWE signature verification failed.');
    }

    const { nonce, address } = siweMessage;

    // Check nonce in Firestore
    const nonceDoc = await db.collection('nonces').doc(nonce).get();
    if (!nonceDoc.exists) {
      throw new Error('Nonce not found.');
    }

    const nonceData = nonceDoc.data();
    if (!nonceData || nonceData.used || new Date(nonceData.expiresAt) < new Date()) {
      throw new Error('Nonce has already been used or expired.');
    }

    // Invalidate the nonce immediately
    await db.collection('nonces').doc(nonce).update({ used: true });

    // Ensure user profile exists in Firestore
    const userRef = db.collection(COLLECTIONS.USERS).doc(address.toLowerCase());
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        address: address.toLowerCase(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    } else {
      await userRef.update({
        lastLogin: new Date().toISOString(),
      });
    }

    // Generate JWT session
    const payload: JWTPayload = { address: address.toLowerCase() };
    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN as any,
    });

    return { token, address: address.toLowerCase() };
  } catch (error: any) {
    console.error('❌ Authentication failed:', error.message);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

/**
 * Validates standard JWT session token
 */
export function verifyJWT(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired authentication token.');
  }
}
