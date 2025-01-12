import 'dotenv/config';

export const SECRET_KEY = process.env.SECRET_KEY || 'a1b2c3d4e5f6g7h8i9j0';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/local-video-player';
export const MONGO_TEST_URL = process.env.MONGO_TEST_URL || 'mongodb://localhost:27017/local-video-player-test';
export const CORS_WHITELIST_URL = process.env.CORS_WHITELIST_URL || 'http://localhost:5173';
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
