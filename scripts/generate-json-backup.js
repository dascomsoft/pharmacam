import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function generateBackup() {
  try {
    const pharmacies = await client.execute('SELECT * FROM pharmacies');
    const data = {
      id: `backup_${Date.now()}`,
      maj: new Date().toISOString(),
      total: pharmacies.rows.length,
      pharmacies: pharmacies.rows
    };
    
    const outputPath = path.join(__dirname, '../public/data/gardes_du_jour.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log('✅ Backup JSON généré');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

generateBackup();