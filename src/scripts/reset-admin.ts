import { pool } from '../db/pool';

async function main(): Promise<void> {
  console.error('For safety, admin reset is not automated. Delete the admin_users row only through an authenticated database administration process.');
  await pool.end();
}

main().catch(async (error: unknown) => {
  console.error(error);
  await pool.end();
  process.exitCode = 1;
});
