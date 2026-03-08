// scripts/migrate-json-to-db.js
import { db } from '../src/lib/db/client';
import { pharmacies, gardes } from '../src/lib/db/schema';
import fs from 'fs';
import path from 'path';

async function migrateData() {
  console.log('🚀 Migration des données JSON vers Turso...');
  
  // Lire le fichier JSON
  const dataPath = path.join(process.cwd(), 'public/data/gardes_du_jour_clean.json');
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  let count = 0;
  let errors = 0;
  
  // Parcourir toutes les pharmacies
  for (const regionName in jsonData.regions) {
    const cities = jsonData.regions[regionName];
    
    for (const city of cities) {
      for (const pharmacy of city.pharmacies) {
        try {
          // Vérifier si la pharmacie existe déjà
          const existing = await db.select()
            .from(pharmacies)
            .where(sql`nom = ${pharmacy.nom} AND ville = ${pharmacy.ville}`)
            .limit(1);
          
          if (existing.length === 0) {
            // Insérer nouvelle pharmacie
            await db.insert(pharmacies).values({
              id: pharmacy.id,
              nom: pharmacy.nom,
              adresse: pharmacy.adresse,
              quartier: pharmacy.quartier,
              ville: pharmacy.ville,
              region: pharmacy.region,
              tel: pharmacy.tel,
              latitude: pharmacy.coordinates?.lat,
              longitude: pharmacy.coordinates?.lng,
              en_garde: pharmacy.en_garde,
              horaires: pharmacy.horaires,
              services: JSON.stringify(pharmacy.services),
              note: pharmacy.note,
              source: pharmacy.source,
              source_url: pharmacy.source_url,
              scraped_at: pharmacy.scraped_at
            });
            
            // Ajouter l'entrée de garde
            await db.insert(gardes).values({
              id: `garde_${Date.now()}_${count}`,
              pharmacie_id: pharmacy.id,
              date_debut: new Date().toISOString().split('T')[0],
              date_fin: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              periode_texte: jsonData.periode,
              source: pharmacy.source
            });
            
            count++;
          }
        } catch (error) {
          console.error(`❌ Erreur pour ${pharmacy.nom}:`, error.message);
          errors++;
        }
      }
    }
  }
  
  console.log(`✅ Migration terminée: ${count} pharmacies ajoutées, ${errors} erreurs`);
}

migrateData().catch(console.error);