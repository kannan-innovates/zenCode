import Redis from 'ioredis';
import logger from '@shared/utils/logger.util';


class RedisClient {
  private client: Redis | null = null;

  //Initialise Redis Connection
  async connect(): Promise<void> {
    try {
      this.client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          // Reconnection logic: wait time increases with each retry
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      this.client.on('connect', () => {
        logger.info('✅ Redis connected successfully');
      });

      this.client.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

    } catch (error) {
      logger.error('❌ Redis connection failed:', error);
    }
  }

  // Get Redis client instance

  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client;
  }

  //Store OTP with auto-expiry

  async setWithExpiry(
    key: string,
    value: string,
    expirySeconds: number,
  ): Promise<void> {
    if (!this.client) return;
    await this.client.setex(key, expirySeconds, value);
  }

  //Get value from Redis

  async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    return await this.client.get(key);
  }

  //Delete key from Redis

  async delete(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  //Close Redis connection
  
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis connection closed');
    }
  }
}

export default new RedisClient();