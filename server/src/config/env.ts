import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (works for both tsx dev and node dist/)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  CLIENT_URL: string;
  DATABASE_PATH: string;
}

function getEnvConfig(): EnvConfig {
  return {
    PORT: parseInt(process.env.PORT || '3001', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    DATABASE_PATH: process.env.DATABASE_PATH || './data/database.sqlite',
  };
}

export const env = getEnvConfig();
