import redisClient from '../../config/redis';

export const CacheService = {
  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      console.error('Redis SET failed:', err);
      throw err;
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (err) {
      console.error('Redis GET failed:', err);
      return null;
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error('Redis DEL failed:', err);
    }
  },
};