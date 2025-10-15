import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

const connectionString = process.env.DATABASE_URL;
// Ensure a single pool instance in development
let pool;

if (!global.pgPool) {
  global.pgPool = new Pool({
    connectionString,
  });
}

pool = global.pgPool;

export const db = drizzle(pool, { schema });
export {pool};
