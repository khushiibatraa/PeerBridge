import mongoose from 'mongoose';
import { ENV } from './env.js';

let mongoMemoryServerInstance = null;

export async function connectDB() {
  try {
    let uri = ENV.MONGODB_URI;

    if (!uri) {
      console.log('ℹ️  No MONGODB_URI specified. Initializing embedded in-memory MongoDB instance for development/testing...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      uri = mongoMemoryServerInstance.getUri();
      console.log('✅ Embedded in-memory MongoDB instance initialized.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // If external URI failed in development mode, try in-memory fallback
    if (ENV.NODE_ENV === 'development' && !mongoMemoryServerInstance) {
      console.log('⚠️ Falling back to embedded in-memory MongoDB instance...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServerInstance = await MongoMemoryServer.create();
        const fallbackUri = mongoMemoryServerInstance.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ MongoDB Connected via in-memory fallback: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error('❌ Failed to start in-memory MongoDB fallback:', fallbackError.message);
        throw fallbackError;
      }
    }
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServerInstance) {
      await mongoMemoryServerInstance.stop();
      mongoMemoryServerInstance = null;
    }
    console.log('MongoDB disconnected cleanly.');
  } catch (error) {
    console.error('Error during MongoDB disconnect:', error.message);
  }
}
