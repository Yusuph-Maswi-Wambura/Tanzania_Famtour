import { app } from './app';
import { env } from './config/env';
import { initializeDatabase, pool } from './db/pool';

initializeDatabase()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Tanzania Famtour listening on port ${env.PORT}`);
    });
  })
  .catch(async (error: unknown) => {
    console.error('Database initialization failed', error);
    await pool.end();
    process.exitCode = 1;
  });
