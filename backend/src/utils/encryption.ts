import crypto from 'crypto';
import config from './config';

const ALGORITHM = 'aes-256-gcm';
// Convert hex string config back to buffer for encryption
const ENCRYPTION_KEY = Buffer.from(config.WALLET_ENCRYPTION_KEY, 'hex');

export interface EncryptedData {
  iv: string;
  ciphertext: string;
  authTag: string;
}

export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let ciphertext = cipher.update(text, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    ciphertext,
    authTag,
  };
}

export function decrypt(encryptedData: EncryptedData): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(encryptedData.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
