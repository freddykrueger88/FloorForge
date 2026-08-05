/**
 * OpenFloorball – Redis Client
 * Für Token-Blacklist (Logout) und späteres Rate-Limiting
 */
import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis: Max reconnect attempts reached');
        return new Error('Max Redis reconnect attempts');
      }
      return Math.min(retries * 100, 3000);
    },
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('error', (err) => logger.error('Redis error:', err));
redisClient.on('reconnecting', () => logger.warn('Redis reconnecting...'));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export default redisClient;
