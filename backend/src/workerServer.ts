import express, { Request, Response } from 'express';
import { startWorker } from './jobs/worker';

const app = express();
const WORKER_PORT = process.env.WORKER_PORT || 8081;

// Initialize BullMQ worker
startWorker();

// Health Check Endpoint (Required by Cloud Run for instance health)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    role: 'worker',
    timestamp: new Date().toISOString(),
  });
});

const server = app.listen(WORKER_PORT, () => {
  console.log(`🛠️ MintFlow Background Worker running on port ${WORKER_PORT}`);
});

const gracefulShutdown = () => {
  console.log('🔄 Worker shutdown signal received...');
  server.close(() => {
    console.log('💤 Worker server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
