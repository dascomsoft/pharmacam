// src/lib/db/client.js
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Fonction utilitaire pour les requêtes
export async function query(sql, args = []) {
  try {
    const result = await client.execute({ sql, args });
    return result.rows;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}