import * as admin from 'firebase-admin';
import config from '../utils/config';

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.FIREBASE_PROJECT_ID,
      clientEmail: config.FIREBASE_CLIENT_EMAIL,
      privateKey: config.FIREBASE_PRIVATE_KEY,
    }),
  });
  console.log('🔥 Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  process.exit(1);
}

export const db = admin.firestore();
export const firebaseAuth = admin.auth();
export const firebaseAdmin = admin;

// Constants for collections
export const COLLECTIONS = {
  USERS: 'users',
  WALLETS: 'wallets',
  MINT_TRANSACTIONS: 'mint_transactions',
  ANALYTICS: 'analytics',
};
