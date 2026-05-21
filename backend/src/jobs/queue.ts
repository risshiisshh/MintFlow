import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import config from '../utils/config';
import { SupportedChain } from '../blockchain/aaService';

// Setup Redis Connection (lazy — tolerates missing Redis for local dev)
let redisAvailable = false;

export const redisConnection = new IORedis(config.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.warn('⚠️ Redis not available. Running in fallback (no-Redis) mode.');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true,
});

// Attempt connection but don't crash if it fails
(async () => {
  try {
    await redisConnection.connect();
    redisAvailable = true;
    console.log('🔌 Connected to Redis for BullMQ successfully.');
  } catch (err) {
    redisAvailable = false;
    console.warn('⚠️ Redis connection failed. BullMQ queue disabled — using in-process fallback mode.');
  }
})();

redisConnection.on('error', (err) => {
  if (redisAvailable) {
    console.error('❌ Redis connection error:', err.message);
  }
  redisAvailable = false;
});

redisConnection.on('connect', () => {
  redisAvailable = true;
});

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

export const MINT_QUEUE_NAME = 'mint-transactions';

// Initialize BullMQ Queue (will only work if Redis is available)
let mintQueue: Queue | null = null;

function getMintQueue(): Queue {
  if (!mintQueue) {
    mintQueue = new Queue(MINT_QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
  }
  return mintQueue;
}

export interface MintJobData {
  eoaAddress: string;
  chain: SupportedChain;
  txRecordId: string;
}

/**
 * Enqueues a gasless mint request for async background execution.
 * Returns null if Redis is not available (caller should handle in-process fallback).
 */
export async function enqueueMintJob(
  eoaAddress: string,
  chain: SupportedChain,
  txRecordId: string
) {
  if (!redisAvailable) {
    return null; // Signal caller to use in-process fallback
  }

  const queue = getMintQueue();
  const job = await queue.add(
    'mint-nft',
    { eoaAddress, chain, txRecordId },
    { jobId: txRecordId }
  );
  return job;
}
