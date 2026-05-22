import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import apiRouter from './api/routes';
import config from './utils/config';
import { isRedisAvailable, redisConnection } from './jobs/queue';

const app = express();

// 2. Global CORS Setup
app.use(
  cors({
    origin: '*', // Customize to frontend domain in production
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2.5 Security Headers for OAuth popups
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// 3. Request Body Parser
app.use(express.json());

// 4. Rate Limiter (Protects endpoints from spam / Denial-of-Wallet-Fund attacks)
// Uses Redis-backed store when available, falls back to in-memory store otherwise
async function createRateLimiter() {
  if (isRedisAvailable()) {
    try {
      const { RedisStore } = await import('rate-limit-redis');
      return rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests. Please try again after 15 minutes.' },
        store: new RedisStore({
          sendCommand: async (...args: string[]) => {
            const result = await redisConnection.call(args[0], ...args.slice(1));
            return result as any;
          },
        }),
      });
    } catch (err) {
      console.warn('⚠️ Redis rate-limiter failed to initialize, using in-memory fallback.');
    }
  }

  console.log('📝 Using in-memory rate limiter (no Redis).');
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again after 15 minutes.' },
  });
}

// Apply rate limiter after async initialization
createRateLimiter().then((limiter) => {
  app.use('/api', limiter);
});

// 5. Mount REST Router
app.use('/api', apiRouter);

// 6. Health Check Endpoint (Required by Cloud Run for instance provisioning and container health)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
    redis: isRedisAvailable() ? 'connected' : 'unavailable (fallback mode)',
  });
});

// 7. Serve Static Frontend Files & Fallback route handler (404)
const frontendDistPath = path.join(__dirname, '../frontend-dist');
app.use(express.static(frontendDistPath));

app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Endpoint not found' });
  } else {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  }
});

// 8. Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Unhandled Exception caught by gateway:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server execution error';

  res.status(statusCode).json({
    error: config.NODE_ENV === 'development' ? message : 'Internal server error',
    details: config.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 9. Startup Listener
const server = app.listen(config.PORT, () => {
  console.log(`🚀 MintFlow backend gateway listening at http://localhost:${config.PORT}`);
  console.log(`🌍 Active Environment: ${config.NODE_ENV}`);
});

// Graceful Shutdown handling
const gracefulShutdown = () => {
  console.log('🔄 Shutdown signal received. Closing servers...');
  server.close(() => {
    console.log('💤 Express server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
