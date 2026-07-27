import app from './app';
import { env } from './config/env';
import { getDatabase, closeDatabase } from './config/database';

async function startServer(): Promise<void> {
  // Initialize database on startup
  await getDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`
  🚑 Emergency Services
  ────────────────────────────────────
  Environment: ${env.NODE_ENV}
  Server:      http://localhost:${env.PORT}
  Health:      http://localhost:${env.PORT}/api/health
  API:         http://localhost:${env.PORT}/api/services
  Client_URL:  ${env.CLIENT_URL}
  ────────────────────────────────────
    `);
  });

  // Graceful shutdown — persist database and close connections
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    closeDatabase();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
