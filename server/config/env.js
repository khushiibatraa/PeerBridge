import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'peerbridge_fallback_dev_secret_key_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};
