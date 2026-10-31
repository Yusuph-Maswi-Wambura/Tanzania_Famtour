import { app } from './app';
import { env } from './config/env';
import { initializeDatabase, pool } from './db/pool';

const startServer = async (): Promise<void> => {
  if (!env.PREVIEW_MODE) {
    await initializeDatabase();
  } else {
    console.warn('PREVIEW_MODE is enabled; PostgreSQL initialization is skipped.');
  }

  app.listen(env.PORT, () => {
    console.log(`Tanzania Famtour listening on http://localhost:${env.PORT}`);
  });
};

startServer()
  .catch(async (error: unknown) => {
    console.error('Database initialization failed', error);
    await pool.end();
    process.exitCode = 1;
  });
