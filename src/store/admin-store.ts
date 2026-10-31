import { randomUUID } from 'node:crypto';

import { pool } from '../db/pool';
import { decrypt, encrypt, hashPassword, hashSessionToken, newSessionToken, verifyPassword } from '../security/crypto';
import { AdminUser, BusinessSettings } from '../types/admin';

const sessionDurationMs = 8 * 60 * 60 * 1000;

export class AdminStore {
  async hasAdmin(): Promise<boolean> {
    const result = await pool.query('SELECT 1 FROM admin_users LIMIT 1');
    return result.rowCount === 1;
  }

  async createAdmin(name: string, email: string, password: string): Promise<AdminUser> {
    const passwordHash = await hashPassword(password);
    const id = randomUUID();
    const now = new Date().toISOString();
    const result = await pool.query(
      'INSERT INTO admin_users (id, name, email, password_hash, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$5) RETURNING id, name, email',
      [id, name, email.toLowerCase(), passwordHash, now],
    );
    return result.rows[0] as AdminUser;
  }

  async login(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
    const result = await pool.query('SELECT id, name, email, password_hash FROM admin_users WHERE email = $1', [email.toLowerCase()]);
    const row = result.rows[0] as (AdminUser & { password_hash: string }) | undefined;
    if (!row || !(await verifyPassword(password, row.password_hash))) return null;
    const token = newSessionToken();
    await pool.query(
      'INSERT INTO admin_sessions (token_hash, admin_id, expires_at, created_at) VALUES ($1,$2,$3,$4)',
      [hashSessionToken(token), row.id, new Date(Date.now() + sessionDurationMs), new Date()],
    );
    return { user: { id: row.id, name: row.name, email: row.email }, token };
  }

  async findByToken(token: string): Promise<AdminUser | null> {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
      [hashSessionToken(token)],
    );
    return (result.rows[0] as AdminUser | undefined) ?? null;
  }

  async logout(token: string): Promise<void> {
    await pool.query('DELETE FROM admin_sessions WHERE token_hash = $1', [hashSessionToken(token)]);
  }

  async getSettings(): Promise<BusinessSettings> {
    const result = await pool.query('SELECT public_data, sensitive_data FROM business_settings WHERE id = TRUE');
    const row = result.rows[0] as { public_data: BusinessSettings; sensitive_data?: string } | undefined;
    if (!row) return {};
    return row.sensitive_data ? { ...row.public_data, ...JSON.parse(decrypt(row.sensitive_data)) } : row.public_data;
  }

  async saveSettings(settings: BusinessSettings): Promise<BusinessSettings> {
    const sensitiveKeys: (keyof BusinessSettings)[] = ['bankName', 'accountName', 'accountNumber', 'swiftCode', 'paymentInstructions'];
    const sensitive: BusinessSettings = {};
    const publicData: BusinessSettings = {};
    for (const [key, value] of Object.entries(settings) as [keyof BusinessSettings, string | undefined][]) {
      (sensitiveKeys.includes(key) ? sensitive : publicData)[key] = value;
    }
    await pool.query(
      `INSERT INTO business_settings (id, public_data, sensitive_data, updated_at)
       VALUES (TRUE, $1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET public_data = $1, sensitive_data = $2, updated_at = $3`,
      [publicData, Object.keys(sensitive).length ? encrypt(JSON.stringify(sensitive)) : null, new Date()],
    );
    return { ...publicData, ...sensitive };
  }
}

export const adminStore = new AdminStore();
