import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
import app from "./app";
import redisClient from './config/redis';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
     console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`);
});

const gracefulShutdown = async (signal: string) => {
     console.log(`\n${signal} received. Shutting down gracefully...`);

     try {
          server.close(async () => {
               console.log('HTTP server closed.');

               if (redisClient.status === 'ready') {
                    await redisClient.quit();
                    console.log('REDIS CLIENT DISCONNECTED');
               }

               await mongoose.disconnect();
               console.log(`\nMONGODB CONNECTION CLOSED`);

               console.log('GRACEFUL SHUTDOWN COMPLETE');
               process.exit(0);
          });
     } catch (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
     }
};


process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));