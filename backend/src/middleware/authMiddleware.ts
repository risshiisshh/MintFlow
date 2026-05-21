import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../auth/auth';
import { db, firebaseAuth } from '../firebase/firebase';
import { Wallet } from 'ethers';

export interface AuthenticatedRequest extends Request {
  user?: {
    address: string;
  };
}

/**
 * Authentication middleware that validates the JWT session token in the header
 * Supports both SIWE custom JWTs and Firebase Auth ID tokens.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authentication token is required.' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Token format must be: Bearer <token>' });
    return;
  }

  const token = parts[1];

  try {
    // Attempt 1: Try custom SIWE JWT
    const decoded = verifyJWT(token);
    req.user = { address: decoded.address.toLowerCase() };
    next();
    } catch (siweError: any) {
      // Attempt 2: Fallback to Firebase ID Token
      let decodedFirebase;
      try {
        decodedFirebase = await firebaseAuth.verifyIdToken(token);
      } catch (firebaseError: any) {
        console.error("Firebase ID Token verification error:", firebaseError);
        res.status(401).json({ error: 'Unauthorized session. Invalid token.' });
        return;
      }
      
      try {
        // Map Firebase UID to an Ethereum address
        const uid = decodedFirebase.uid;
        const mappingRef = db.collection('firebase_mappings').doc(uid);
        const mappingDoc = await mappingRef.get();
        
        let userAddress: string;
        if (!mappingDoc.exists) {
          // Generate a random EOA as their primary identifier
          const randomWallet = Wallet.createRandom();
          userAddress = randomWallet.address.toLowerCase();
          await mappingRef.set({
            uid,
            address: userAddress,
            createdAt: new Date().toISOString()
          });
        } else {
          userAddress = mappingDoc.data()?.address;
        }

        req.user = { address: userAddress };
        next();
      } catch (dbError: any) {
        console.error("Firestore database error:", dbError);
        res.status(500).json({ 
          error: 'Internal Server Error', 
          details: 'Failed to access Firestore. Make sure Firestore Database is created and enabled in your Firebase Console.' 
        });
      }
    }
}
