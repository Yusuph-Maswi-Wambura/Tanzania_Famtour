import { Pool } from 'pg';

import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trip_requests (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL,
      nationality VARCHAR(100),
      phone VARCHAR(40),
      arrival_date VARCHAR(30),
      duration VARCHAR(30),
      travellers VARCHAR(30),
      budget VARCHAR(50),
      destination VARCHAR(100),
      style VARCHAR(50),
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS quote_requests (
      id UUID PRIMARY KEY,
      tour_id INTEGER NOT NULL,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL,
      travel_date VARCHAR(30),
      travellers VARCHAR(30),
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) NOT NULL,
      subject VARCHAR(120),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS trip_requests_created_at_idx ON trip_requests (created_at DESC);
    CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx ON quote_requests (created_at DESC);
    CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);
  `);
}
