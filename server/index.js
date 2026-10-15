import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';
import { ENV } from './config/env.js';

async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Auto-seed initial demo personas and missions if empty
    await seedDatabase(false);

    // 3. Start listening
    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 PeerBridge API server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${ENV.PORT}/api`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('Server and database connections terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('Fatal error starting PeerBridge backend server:', error);
    process.exit(1);
  }
}

startServer();
