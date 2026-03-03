import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.DB.HOST,
  port: env.DB.PORT,
  database: env.DB.NAME,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
});

export async function pingPostgres() {
  const r = await pool.query('select 1 as ok');
  return r.rows?.[0]?.ok === 1;
}