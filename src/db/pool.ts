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
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(254) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash CHAR(64) PRIMARY KEY,
      admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    );
    CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at);
    CREATE TABLE IF NOT EXISTS business_settings (
      id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
      public_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      sensitive_data TEXT,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `);
}
