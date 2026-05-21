import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, { message: 'JWT_SECRET must be at least 32 characters' }),
  JWT_EXPIRES_IN: z.string().default('24h'),
  REDIS_URL: z.string().url().default('redis://127.0.0.1:6379'),
  
  WALLET_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/, { message: 'WALLET_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)' }),

  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().transform((val) => val.replace(/\\n/g, '\n')),

  POLYGON_RPC_URL: z.string().url(),
  POLYGON_BUNDLER_RPC_URL: z.string().url(),
  POLYGON_PAYMASTER_RPC_URL: z.string().url(),
  POLYGON_NFT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),

  BASE_RPC_URL: z.string().url(),
  BASE_BUNDLER_RPC_URL: z.string().url(),
  BASE_PAYMASTER_RPC_URL: z.string().url(),
  BASE_NFT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),

  SPONSOR_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
});

let config: z.infer<typeof envSchema>;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  } else {
    console.error('❌ Failed to parse environment variables', error);
    process.exit(1);
  }
}

export default config;
