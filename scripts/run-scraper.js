// scripts/run-scraper.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement IMMÉDIATEMENT
dotenv.config({ path: '.env.local' });

console.log('🔍 Vérification des variables:');
console.log('URL:', process.env.TURSO_DATABASE_URL ? '✅' + process.env.TURSO_DATABASE_URL.substring(0, 20) + '...' : '❌');
console.log('Token:', process.env.TURSO_AUTH_TOKEN ? '✅' + process.env.TURSO_AUTH_TOKEN.substring(0, 10) + '...' : '❌');

// Vérifier que les variables existent
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ ERREUR: Variables TURSO manquantes dans .env.local');
  console.log('📁 Crée un fichier .env.local avec:');
  console.log('TURSO_DATABASE_URL=libsql://allo237-godgives.aws-eu-west-1.turso.io');
  console.log('TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIs...');
  process.exit(1);
}

// Maintenant importer et lancer le scraper
import('./scrape-with-db.js')
  .then(module => {
    console.log('✅ Scraper chargé, exécution...');
  })
  .catch(error => {
    console.error('❌ Erreur chargement scraper:', error);
    process.exit(1);
  });