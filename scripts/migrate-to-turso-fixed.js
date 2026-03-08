// scripts/migrate-to-turso-fixed.js
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérifier les variables d'environnement
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Erreur: Variables TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN manquantes dans .env.local');
  console.log('📝 Assurez-vous que .env.local contient:');
  console.log('TURSO_DATABASE_URL=libsql://allo237-godgives.turso.io');
  console.log('TURSO_AUTH_TOKEN=votre-token-ici');
  process.exit(1);
}

console.log('🔌 Connexion à Turso...');
console.log(`📌 URL: ${process.env.TURSO_DATABASE_URL}`);
console.log(`🔑 Token: ${process.env.TURSO_AUTH_TOKEN.substring(0, 20)}...`);

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function testConnection() {
  try {
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Connexion à Turso réussie !');
    return true;
  } catch (error) {
    console.error('❌ Échec de connexion à Turso:', error.message);
    return false;
  }
}

async function migrateData() {
  console.log('🚀 Début de la migration des données vers Turso...');
  
  try {
    // Tester la connexion d'abord
    const connected = await testConnection();
    if (!connected) {
      console.log('\n🔧 Solutions:');
      console.log('1. Vérifiez que votre token est valide: turso db tokens create allo237');
      console.log('2. Vérifiez que la base existe: turso db list');
      console.log('3. Assurez-vous que .env.local est dans le bon dossier');
      return;
    }
    
    // Lire le fichier JSON
    const jsonPath = path.join(__dirname, '../public/data/gardes_du_jour_clean.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ Fichier JSON non trouvé: ${jsonPath}`);
      return;
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📊 Fichier JSON chargé: ${jsonData.total} pharmacies trouvées`);
    
    // Récupérer les IDs des services
    const servicesResult = await client.execute('SELECT id, nom FROM services');
    const servicesMap = {};
    servicesResult.rows.forEach(s => {
      servicesMap[s.nom] = s.id;
    });
    console.log('🔧 Services disponibles:', servicesMap);
    
    let count = 0;
    let errors = 0;
    
    // Parcourir toutes les régions
    for (const regionName in jsonData.regions) {
      const cities = jsonData.regions[regionName];
      
      for (const city of cities) {
        for (const pharmacy of city.pharmacies) {
          try {
            // Vérifier si la pharmacie existe déjà
            const existing = await client.execute({
              sql: 'SELECT id FROM pharmacies WHERE id = ?',
              args: [pharmacy.id]
            });
            
            if (existing.rows.length === 0) {
              // 1. Insérer la pharmacie
              await client.execute({
                sql: `INSERT INTO pharmacies (
                  id, nom, adresse, quartier, ville, region,
                  tel, latitude, longitude, en_garde, horaires,
                  services, note, source, source_url, scraped_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [
                  pharmacy.id,
                  pharmacy.nom,
                  pharmacy.adresse || null,
                  pharmacy.quartier || null,
                  pharmacy.ville,
                  pharmacy.region,
                  pharmacy.tel === 'Non listé' ? null : pharmacy.tel,
                  pharmacy.coordinates?.lat || null,
                  pharmacy.coordinates?.lng || null,
                  pharmacy.en_garde ? 1 : 0,
                  pharmacy.horaires || null,
                  JSON.stringify(pharmacy.services || []),
                  pharmacy.note || null,
                  pharmacy.source || 'DocHelp-CM',
                  pharmacy.source_url || null,
                  pharmacy.scraped_at || new Date().toISOString()
                ]
              });
              
              // 2. Ajouter la garde du jour
              await client.execute({
                sql: `INSERT INTO gardes (
                  id, pharmacie_id, date_debut, date_fin, periode_texte, source
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                args: [
                  `garde_${Date.now()}_${count}`,
                  pharmacy.id,
                  new Date().toISOString().split('T')[0],
                  new Date(Date.now() + 86400000).toISOString().split('T')[0],
                  jsonData.periode || 'Garde du jour',
                  pharmacy.source || 'DocHelp-CM'
                ]
              });
              
              // 3. Initialiser les stats
              await client.execute({
                sql: `INSERT INTO stats_pharmacies (
                  pharmacie_id, total_gardes, derniere_garde
                ) VALUES (?, 1, ?)`,
                args: [
                  pharmacy.id,
                  new Date().toISOString().split('T')[0]
                ]
              });
              
              // 4. Lier les services
              if (pharmacy.services && pharmacy.services.length > 0) {
                for (const serviceName of pharmacy.services) {
                  const serviceId = servicesMap[serviceName];
                  if (serviceId) {
                    await client.execute({
                      sql: `INSERT OR IGNORE INTO pharmacie_services (pharmacie_id, service_id) VALUES (?, ?)`,
                      args: [pharmacy.id, serviceId]
                    });
                  }
                }
              }
              
              count++;
              if (count % 10 === 0) {
                console.log(`✅ ${count} pharmacies migrées...`);
              }
            } else {
              // Pharmacie déjà existante
              count++;
            }
            
          } catch (error) {
            console.error(`❌ Erreur pour ${pharmacy.nom}:`, error.message);
            errors++;
          }
        }
      }
    }
    
    console.log('\n🎉 MIGRATION TERMINÉE !');
    console.log(`📊 Total: ${count} pharmacies migrées`);
    console.log(`❌ Erreurs: ${errors}`);
    
    // Vérification finale
    const result = await client.execute('SELECT COUNT(*) as total FROM pharmacies');
    console.log(`🏥 Pharmacies en base: ${result.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

migrateData();