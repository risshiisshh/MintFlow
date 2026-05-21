import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  handleGetNonce,
  handleVerifySIWE,
  handleGetSmartWallet,
  handleRequestMint,
  handleGetTransactionStatus,
  handleGetAnalytics,
} from './mintController';

const router = Router();

// Authentication endpoints
router.get('/auth/nonce', handleGetNonce);
router.post('/auth/verify', handleVerifySIWE);

// Smart account details (Protected)
router.get('/wallet', requireAuth, handleGetSmartWallet);

// Gasless transaction pipeline (Protected)
router.post('/mint', requireAuth, handleRequestMint);
router.get('/mint/status/:id', requireAuth, handleGetTransactionStatus);

// Public telemetry dashboard
router.get('/analytics', handleGetAnalytics);

export default router;
