import mongoose from 'mongoose';
import logger from '@shared/utils/logger.util';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connection options for production-ready setup
    const options = {
      maxPoolSize: 10, // Maximum 10 connections in pool
      minPoolSize: 2,  // Keep 2 connections always ready
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close socket after 45s
    };

    await mongoose.connect(mongoUri, options);

    logger.info('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1); 
  }
};


export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};