// // src/lib/db/client.js
// import { createClient } from '@libsql/client';
// import { drizzle } from 'drizzle-orm/libsql';
// import * as schema from './schema.js';

// const client = createClient({
//   url: process.env.TURSO_DATABASE_URL,
//   authToken: process.env.TURSO_AUTH_TOKEN,
// });

// export const db = drizzle(client, { schema });

// // Fonction utilitaire pour les requêtes
// export async function query(sql, args = []) {
//   try {
//     const result = await client.execute({ sql, args });
//     return result.rows;
//   } catch (error) {
//     console.error('DB Error:', error);
//     throw error;
//   }
// }






































































// src/lib/db/client.js
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

// Vérifier que les variables sont définies
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ ERREUR: Variables TURSO non définies dans client.js');
  console.error('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? '✅' : '❌');
  console.error('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '✅' : '❌');
  throw new Error('Variables TURSO manquantes');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export async function query(sql, args = []) {
  try {
    const result = await client.execute({ sql, args });
    return result.rows;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}