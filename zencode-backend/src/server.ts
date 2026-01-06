import dotenv from 'dotenv';
dotenv.config();

import app from './app'; 
import { connectDatabase } from '@shared/config/database';
import redisClient from '@shared/config/redis';
import logger from '@shared/utils/logger.util';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();
    await redisClient.connect();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Server startup failed', err);
    process.exit(1);
  }
})();