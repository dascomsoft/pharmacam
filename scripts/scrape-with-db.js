// // scripts/scrape-with-db.js
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createRequire } from 'module';
// import { db } from '../src/lib/db/client.js';
// import { pharmacies, gardes, scraping_logs } from '../src/lib/db/schema.js';
// import { sql } from 'drizzle-orm';
// import fs from 'fs';

// // Charger les variables d'environnement
// dotenv.config({ path: '.env.local' });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const require = createRequire(import.meta.url);

// // Vérifier que les variables sont chargées
// console.log('🔍 Vérification des variables d\'environnement:');
// console.log(`📌 TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL ? '✅ Présent' : '❌ Manquant'}`);
// console.log(`📌 TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? '✅ Présent' : '❌ Manquant'}`);

// // Charger les modules CommonJS
// console.log('📦 Chargement des scrapers...');
// const dochelpModule = require('./scrape-gardes-optimized.js');
// const annuaireModule = require('./scrape-gardes-annuaire-medical.js');

// // Fonction pour scraper DocHelp
// async function scrapeDochelp() {
//   console.log('📡 Scraping DocHelp-CM...');
//   try {
//     // Exécuter le script DocHelp - il s'auto-exécute, donc on lit le fichier JSON qu'il génère
//     const jsonPath = path.join(process.cwd(), 'public/data/gardes_du_jour.json');
//     if (fs.existsSync(jsonPath)) {
//       const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
//       return {
//         pharmacies: data.pharmacies || [],
//         periode: data.periode || ''
//       };
//     }
//     return { pharmacies: [], periode: '' };
//   } catch (error) {
//     console.error('❌ Erreur DocHelp:', error.message);
//     return { pharmacies: [], periode: '' };
//   }
// }

// // Fonction pour scraper Annuaire Médical
// async function scrapeAnnuaireMedical() {
//   console.log('📡 Scraping Annuaire Médical...');
//   try {
//     const result = await annuaireModule.scrapeAnnuaireMedical?.() || annuaireModule();
//     return result;
//   } catch (error) {
//     console.error('❌ Erreur Annuaire:', error.message);
//     return { pharmacies: [], periode: '' };
//   }
// }

// async function scrapeAndStore() {
//   const startTime = Date.now();
//   const logId = `scrape_${startTime}`;
  
//   let stats = {
//     nouvelles: 0,
//     misesAJour: 0,
//     total: 0
//   };
  
//   try {
//     console.log('\n🚀 Début du scraping multi-sources...');
//     console.log('='.repeat(50));
    
//     // Scraper les deux sources
//     const [dochelpData, annuaireData] = await Promise.allSettled([
//       scrapeDochelp(),
//       scrapeAnnuaireMedical()
//     ]);
    
//     console.log('\n📊 RÉSULTATS DU SCRAPING:');
//     console.log('-'.repeat(30));
    
//     // Afficher les résultats DocHelp
//     if (dochelpData.status === 'fulfilled') {
//       const count = dochelpData.value?.pharmacies?.length || 0;
//       console.log(`✅ DocHelp-CM: ${count} pharmacies trouvées`);
//     } else {
//       console.log(`❌ DocHelp-CM: ${dochelpData.reason?.message || 'Échec'}`);
//     }
    
//     // Afficher les résultats Annuaire
//     if (annuaireData.status === 'fulfilled') {
//       const count = annuaireData.value?.pharmacies?.length || 0;
//       console.log(`✅ Annuaire Médical: ${count} pharmacies trouvées`);
//     } else {
//       console.log(`❌ Annuaire Médical: ${annuaireData.reason?.message || 'Échec'}`);
//     }
    
//     // Fusionner les données
//     const allPharmacies = [];
    
//     if (dochelpData.status === 'fulfilled' && dochelpData.value?.pharmacies) {
//       allPharmacies.push(...dochelpData.value.pharmacies);
//     }
    
//     if (annuaireData.status === 'fulfilled' && annuaireData.value?.pharmacies) {
//       allPharmacies.push(...annuaireData.value.pharmacies);
//     }
    
//     console.log(`\n📊 TOTAL: ${allPharmacies.length} pharmacies à traiter`);
//     console.log('='.repeat(50));
    
//     // Pour chaque pharmacie
//     for (let i = 0; i < allPharmacies.length; i++) {
//       const pharma = allPharmacies[i];
      
//       try {
//         // Vérifier si existe déjà
//         const existing = await db.select()
//           .from(pharmacies)
//           .where(sql`nom = ${pharma.nom} AND ville = ${pharma.ville}`)
//           .limit(1);
        
//         if (existing.length === 0) {
//           // Nouvelle pharmacie
//           await db.insert(pharmacies).values({
//             id: pharma.id || `ph_${Date.now()}_${i}`,
//             nom: pharma.nom,
//             adresse: pharma.adresse || null,
//             quartier: pharma.quartier || null,
//             ville: pharma.ville,
//             region: pharma.region,
//             tel: pharma.tel === 'Non listé' ? null : pharma.tel,
//             latitude: pharma.coordinates?.lat || null,
//             longitude: pharma.coordinates?.lng || null,
//             en_garde: pharma.en_garde ? 1 : 0,
//             horaires: pharma.horaires || null,
//             services: JSON.stringify(pharma.services || []),
//             note: pharma.note || null,
//             source: pharma.source || 'DocHelp-CM',
//             source_url: pharma.source_url || null,
//             scraped_at: pharma.scraped_at || new Date().toISOString()
//           });
//           stats.nouvelles++;
//           console.log(`✅ NOUVELLE: ${pharma.nom.substring(0, 30)}... (${pharma.ville})`);
//         } else {
//           // Mise à jour si nécessaire
//           const existingPharma = existing[0];
//           const updates = {};
          
//           if (pharma.tel && pharma.tel !== 'Non listé' && 
//               (!existingPharma.tel || existingPharma.tel === 'Non listé')) {
//             updates.tel = pharma.tel;
//             console.log(`📞 MISE À JOUR TÉLÉPHONE: ${pharma.nom.substring(0, 30)}...`);
//           }
          
//           if (Object.keys(updates).length > 0) {
//             await db.update(pharmacies)
//               .set({ ...updates, updated_at: new Date().toISOString() })
//               .where(sql`id = ${existingPharma.id}`);
//             stats.misesAJour++;
//           }
//         }
        
//         // Ajouter l'entrée de garde
//         await db.insert(gardes).values({
//           id: `garde_${Date.now()}_${i}`,
//           pharmacie_id: existing[0]?.id || pharma.id,
//           date_debut: new Date().toISOString().split('T')[0],
//           date_fin: new Date(Date.now() + 86400000).toISOString().split('T')[0],
//           periode_texte: dochelpData.value?.periode || annuaireData.value?.periode || 'Garde du jour',
//           source: pharma.source || 'DocHelp-CM'
//         });
        
//         stats.total++;
        
//       } catch (pharmaError) {
//         console.error(`❌ Erreur pour ${pharma.nom?.substring(0, 30)}...:`, pharmaError.message);
//       }
//     }
    
//     console.log('\n' + '='.repeat(50));
//     console.log('🎉 SCRAPING TERMINÉ !');
//     console.log('='.repeat(50));
//     console.log(`📊 Nouvelles pharmacies: ${stats.nouvelles}`);
//     console.log(`📊 Mises à jour: ${stats.misesAJour}`);
//     console.log(`📊 Total traité: ${stats.total}`);
    
//     // Journaliser le scraping - VERSION CORRIGÉE (sans duree_secondes)
//     await db.insert(scraping_logs).values({
//       id: logId,
//       source: 'multi',
//       pharmacies_trouvees: allPharmacies.length,
//       pharmacies_nouvelles: stats.nouvelles,
//       pharmacies_mises_a_jour: stats.misesAJour,
//       status: 'success'
//     });
    
//     // Générer JSON de fallback
//     await generateJsonBackup();
    
//   } catch (error) {
//     console.error('\n❌ ERREUR GLOBALE:', error);
    
//     try {
//       // Journaliser l'erreur - VERSION CORRIGÉE (sans duree_secondes)
//       await db.insert(scraping_logs).values({
//         id: logId,
//         source: 'multi',
//         status: 'error',
//         erreur: error.message
//       });
//     } catch (logError) {
//       console.error('❌ Erreur journalisation:', logError);
//     }
    
//     throw error;
//   }
// }

// async function generateJsonBackup() {
//   try {
//     console.log('\n📁 Génération du backup JSON...');
    
//     const allPharmacies = await db.select().from(pharmacies);
    
//     const backup = {
//       id: `backup_${Date.now()}`,
//       maj: new Date().toISOString(),
//       total: allPharmacies.length,
//       pharmacies: allPharmacies
//     };
    
//     const backupDir = path.join(process.cwd(), 'public/data/backups');
//     if (!fs.existsSync(backupDir)) {
//       fs.mkdirSync(backupDir, { recursive: true });
//     }
    
//     const backupPath = path.join(backupDir, `backup_${Date.now()}.json`);
//     fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
//     // Copier vers gardes_du_jour.json pour compatibilité
//     const mainPath = path.join(process.cwd(), 'public/data/gardes_du_jour.json');
//     fs.writeFileSync(mainPath, JSON.stringify(backup, null, 2));
    
//     console.log(`✅ Backup JSON créé: ${backupPath}`);
//     console.log(`✅ Fichier principal mis à jour: ${mainPath}`);
    
//   } catch (error) {
//     console.error('❌ Erreur génération backup:', error.message);
//   }
// }

// // Lancement
// scrapeAndStore().catch(console.error);































// // scripts/scrape-with-db.js
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { createRequire } from 'module';
// import fs from 'fs';
// import { sql } from 'drizzle-orm';

// // Charger les variables d'environnement
// dotenv.config({ path: '.env.local' });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const require = createRequire(import.meta.url);

// // IMPORT DYNAMIQUE - solution pour GitHub Actions
// console.log('📦 Chargement des modules DB...');
// const { db } = await import('../src/lib/db/index.js');
// const { pharmacies, gardes, scraping_logs } = await import('../src/lib/db/index.js');


// // Vérifier que les variables sont chargées
// console.log('🔍 Vérification des variables d\'environnement:');
// console.log(`📌 TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL ? '✅ Présent' : '❌ Manquant'}`);
// console.log(`📌 TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? '✅ Présent' : '❌ Manquant'}`);

// // Charger les modules CommonJS
// console.log('📦 Chargement des scrapers...');
// const dochelpModule = require('./scrape-gardes-optimized.js');
// const annuaireModule = require('./scrape-gardes-annuaire-medical.js');

// // Fonction pour scraper DocHelp
// async function scrapeDochelp() {
//   console.log('📡 Scraping DocHelp-CM...');
//   try {
//     const jsonPath = path.join(process.cwd(), 'public/data/gardes_du_jour.json');
//     if (fs.existsSync(jsonPath)) {
//       const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
//       return {
//         pharmacies: data.pharmacies || [],
//         periode: data.periode || ''
//       };
//     }
//     return { pharmacies: [], periode: '' };
//   } catch (error) {
//     console.error('❌ Erreur DocHelp:', error.message);
//     return { pharmacies: [], periode: '' };
//   }
// }

// // Fonction pour scraper Annuaire Médical
// async function scrapeAnnuaireMedical() {
//   console.log('📡 Scraping Annuaire Médical...');
//   try {
//     const result = await annuaireModule.scrapeAnnuaireMedical?.() || annuaireModule();
//     return result;
//   } catch (error) {
//     console.error('❌ Erreur Annuaire:', error.message);
//     return { pharmacies: [], periode: '' };
//   }
// }

// async function scrapeAndStore() {
//   const startTime = Date.now();
//   const logId = `scrape_${startTime}`;
  
//   let stats = {
//     nouvelles: 0,
//     misesAJour: 0,
//     total: 0
//   };
  
//   try {
//     console.log('\n🚀 Début du scraping multi-sources...');
//     console.log('='.repeat(50));
    
//     const [dochelpData, annuaireData] = await Promise.allSettled([
//       scrapeDochelp(),
//       scrapeAnnuaireMedical()
//     ]);
    
//     console.log('\n📊 RÉSULTATS DU SCRAPING:');
//     console.log('-'.repeat(30));
    
//     if (dochelpData.status === 'fulfilled') {
//       const count = dochelpData.value?.pharmacies?.length || 0;
//       console.log(`✅ DocHelp-CM: ${count} pharmacies trouvées`);
//     } else {
//       console.log(`❌ DocHelp-CM: ${dochelpData.reason?.message || 'Échec'}`);
//     }
    
//     if (annuaireData.status === 'fulfilled') {
//       const count = annuaireData.value?.pharmacies?.length || 0;
//       console.log(`✅ Annuaire Médical: ${count} pharmacies trouvées`);
//     } else {
//       console.log(`❌ Annuaire Médical: ${annuaireData.reason?.message || 'Échec'}`);
//     }
    
//     const allPharmacies = [];
    
//     if (dochelpData.status === 'fulfilled' && dochelpData.value?.pharmacies) {
//       allPharmacies.push(...dochelpData.value.pharmacies);
//     }
    
//     if (annuaireData.status === 'fulfilled' && annuaireData.value?.pharmacies) {
//       allPharmacies.push(...annuaireData.value.pharmacies);
//     }
    
//     console.log(`\n📊 TOTAL: ${allPharmacies.length} pharmacies à traiter`);
//     console.log('='.repeat(50));
    
//     for (let i = 0; i < allPharmacies.length; i++) {
//       const pharma = allPharmacies[i];
      
//       try {
//         const existing = await db.select()
//           .from(pharmacies)
//           .where(sql`nom = ${pharma.nom} AND ville = ${pharma.ville}`)
//           .limit(1);
        
//         if (existing.length === 0) {
//           await db.insert(pharmacies).values({
//             id: pharma.id || `ph_${Date.now()}_${i}`,
//             nom: pharma.nom,
//             adresse: pharma.adresse || null,
//             quartier: pharma.quartier || null,
//             ville: pharma.ville,
//             region: pharma.region,
//             tel: pharma.tel === 'Non listé' ? null : pharma.tel,
//             latitude: pharma.coordinates?.lat || null,
//             longitude: pharma.coordinates?.lng || null,
//             en_garde: pharma.en_garde ? 1 : 0,
//             horaires: pharma.horaires || null,
//             services: JSON.stringify(pharma.services || []),
//             note: pharma.note || null,
//             source: pharma.source || 'DocHelp-CM',
//             source_url: pharma.source_url || null,
//             scraped_at: pharma.scraped_at || new Date().toISOString()
//           });
//           stats.nouvelles++;
//           console.log(`✅ NOUVELLE: ${pharma.nom.substring(0, 30)}... (${pharma.ville})`);
//         } else {
//           const existingPharma = existing[0];
//           const updates = {};
          
//           if (pharma.tel && pharma.tel !== 'Non listé' && 
//               (!existingPharma.tel || existingPharma.tel === 'Non listé')) {
//             updates.tel = pharma.tel;
//             console.log(`📞 MISE À JOUR TÉLÉPHONE: ${pharma.nom.substring(0, 30)}...`);
//           }
          
//           if (Object.keys(updates).length > 0) {
//             await db.update(pharmacies)
//               .set({ ...updates, updated_at: new Date().toISOString() })
//               .where(sql`id = ${existingPharma.id}`);
//             stats.misesAJour++;
//           }
//         }
        
//         await db.insert(gardes).values({
//           id: `garde_${Date.now()}_${i}`,
//           pharmacie_id: existing[0]?.id || pharma.id,
//           date_debut: new Date().toISOString().split('T')[0],
//           date_fin: new Date(Date.now() + 86400000).toISOString().split('T')[0],
//           periode_texte: dochelpData.value?.periode || annuaireData.value?.periode || 'Garde du jour',
//           source: pharma.source || 'DocHelp-CM'
//         });
        
//         stats.total++;
        
//       } catch (pharmaError) {
//         console.error(`❌ Erreur pour ${pharma.nom?.substring(0, 30)}...:`, pharmaError.message);
//       }
//     }
    
//     console.log('\n' + '='.repeat(50));
//     console.log('🎉 SCRAPING TERMINÉ !');
//     console.log('='.repeat(50));
//     console.log(`📊 Nouvelles pharmacies: ${stats.nouvelles}`);
//     console.log(`📊 Mises à jour: ${stats.misesAJour}`);
//     console.log(`📊 Total traité: ${stats.total}`);
    
//     await db.insert(scraping_logs).values({
//       id: logId,
//       source: 'multi',
//       pharmacies_trouvees: allPharmacies.length,
//       pharmacies_nouvelles: stats.nouvelles,
//       pharmacies_mises_a_jour: stats.misesAJour,
//       status: 'success'
//     });
    
//     await generateJsonBackup();
    
//   } catch (error) {
//     console.error('\n❌ ERREUR GLOBALE:', error);
    
//     try {
//       await db.insert(scraping_logs).values({
//         id: logId,
//         source: 'multi',
//         status: 'error',
//         erreur: error.message
//       });
//     } catch (logError) {
//       console.error('❌ Erreur journalisation:', logError);
//     }
    
//     throw error;
//   }
// }

// async function generateJsonBackup() {
//   try {
//     console.log('\n📁 Génération du backup JSON...');
    
//     const allPharmacies = await db.select().from(pharmacies);
    
//     const backup = {
//       id: `backup_${Date.now()}`,
//       maj: new Date().toISOString(),
//       total: allPharmacies.length,
//       pharmacies: allPharmacies
//     };
    
//     const backupDir = path.join(process.cwd(), 'public/data/backups');
//     if (!fs.existsSync(backupDir)) {
//       fs.mkdirSync(backupDir, { recursive: true });
//     }
    
//     const backupPath = path.join(backupDir, `backup_${Date.now()}.json`);
//     fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
//     const mainPath = path.join(process.cwd(), 'public/data/gardes_du_jour.json');
//     fs.writeFileSync(mainPath, JSON.stringify(backup, null, 2));
    
//     console.log(`✅ Backup JSON créé: ${backupPath}`);
//     console.log(`✅ Fichier principal mis à jour: ${mainPath}`);
    
//   } catch (error) {
//     console.error('❌ Erreur génération backup:', error.message);
//   }
// }

// scrapeAndStore().catch(console.error);


























































// scripts/scrape-with-db.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import fs from 'fs';
import { sql } from 'drizzle-orm';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// IMPORT DYNAMIQUE
console.log('📦 Chargement des modules DB...');
const { db, pharmacies, gardes, scraping_logs } = await import('../src/lib/db/index.js');

// Vérifier que les variables sont chargées
console.log('🔍 Vérification des variables d\'environnement:');
console.log(`📌 TURSO_DATABASE_URL: ${process.env.TURSO_DATABASE_URL ? '✅ Présent' : '❌ Manquant'}`);
console.log(`📌 TURSO_AUTH_TOKEN: ${process.env.TURSO_AUTH_TOKEN ? '✅ Présent' : '❌ Manquant'}`);

// Charger UNIQUEMENT DocHelp (source fiable)
console.log('📦 Chargement du scraper DocHelp-CM...');
const dochelpModule = require('./scrape-gardes-optimized.js');

// Fonction pour scraper DocHelp
async function scrapeDochelp() {
  console.log('📡 Scraping DocHelp-CM (source unique et fiable)...');
  try {
    const jsonPath = path.join(process.cwd(), 'public/data/gardes_du_jour.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      return {
        pharmacies: data.pharmacies || [],
        periode: data.periode || ''
      };
    }
    return { pharmacies: [], periode: '' };
  } catch (error) {
    console.error('❌ Erreur DocHelp:', error.message);
    return { pharmacies: [], periode: '' };
  }
}

async function generateJsonBackup() {
  try {
    console.log('\n📁 Génération du backup JSON...');
    const allPharmacies = await db.select().from(pharmacies);
    
    const backup = {
      id: `backup_${Date.now()}`,
      maj: new Date().toISOString(),
      total: allPharmacies.length,
      pharmacies: allPharmacies
    };
    
    const backupDir = path.join(process.cwd(), 'public/data/backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    
    const backupPath = path.join(backupDir, `backup_${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    const mainPath = path.join(process.cwd(), 'public/data/gardes_du_jour.json');
    fs.writeFileSync(mainPath, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup créé: ${backupPath}`);
  } catch (error) {
    console.error('❌ Erreur backup:', error.message);
  }
}

async function scrapeAndStore() {
  const startTime = Date.now();
  const logId = `scrape_${startTime}`;
  
  let stats = { nouvelles: 0, misesAJour: 0, total: 0 };
  
  try {
    console.log('\n🚀 Début du scraping (source: DocHelp-CM uniquement)');
    console.log('='.repeat(50));
    
    // Scraper UNIQUEMENT DocHelp
    const dochelpData = await scrapeDochelp();
    const allPharmacies = dochelpData.pharmacies || [];
    
    console.log(`\n📊 TOTAL: ${allPharmacies.length} pharmacies à traiter`);
    console.log('='.repeat(50));
    
    for (let i = 0; i < allPharmacies.length; i++) {
      const pharma = allPharmacies[i];
      
      try {
        const existing = await db.select()
          .from(pharmacies)
          .where(sql`nom = ${pharma.nom} AND ville = ${pharma.ville}`)
          .limit(1);
        
        if (existing.length === 0) {
          await db.insert(pharmacies).values({
            id: pharma.id || `ph_${Date.now()}_${i}`,
            nom: pharma.nom,
            adresse: pharma.adresse || null,
            quartier: pharma.quartier || null,
            ville: pharma.ville,
            region: pharma.region,
            tel: pharma.tel === 'Non listé' ? null : pharma.tel,
            latitude: pharma.coordinates?.lat || null,
            longitude: pharma.coordinates?.lng || null,
            en_garde: pharma.en_garde ? 1 : 0,
            horaires: pharma.horaires || null,
            services: JSON.stringify(pharma.services || []),
            note: pharma.note || null,
            source: 'DocHelp-CM',
            source_url: pharma.source_url || null,
            scraped_at: pharma.scraped_at || new Date().toISOString()
          });
          stats.nouvelles++;
          console.log(`✅ NOUVELLE: ${pharma.nom.substring(0, 40)} (${pharma.ville})`);
        } else {
          const existingPharma = existing[0];
          const updates = {};
          
          if (pharma.tel && pharma.tel !== 'Non listé' && 
              (!existingPharma.tel || existingPharma.tel === 'Non listé')) {
            updates.tel = pharma.tel;
            console.log(`📞 MISE À JOUR: ${pharma.nom.substring(0, 30)}...`);
          }
          
          if (Object.keys(updates).length > 0) {
            await db.update(pharmacies)
              .set({ ...updates, updated_at: new Date().toISOString() })
              .where(sql`id = ${existingPharma.id}`);
            stats.misesAJour++;
          }
        }
        
        await db.insert(gardes).values({
          id: `garde_${Date.now()}_${i}`,
          pharmacie_id: existing[0]?.id || pharma.id,
          date_debut: new Date().toISOString().split('T')[0],
          date_fin: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          periode_texte: dochelpData.periode || 'Garde du jour',
          source: 'DocHelp-CM'
        });
        
        stats.total++;
        
      } catch (pharmaError) {
        console.error(`❌ Erreur pour ${pharma.nom?.substring(0, 30)}:`, pharmaError.message);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 SCRAPING TERMINÉ !');
    console.log('='.repeat(50));
    console.log(`📊 Nouvelles pharmacies: ${stats.nouvelles}`);
    console.log(`📊 Mises à jour: ${stats.misesAJour}`);
    console.log(`📊 Total traité: ${stats.total}`);
    
    await db.insert(scraping_logs).values({
      id: logId,
      source: 'DocHelp-CM',
      pharmacies_trouvees: allPharmacies.length,
      pharmacies_nouvelles: stats.nouvelles,
      pharmacies_mises_a_jour: stats.misesAJour,
      status: 'success'
    });
    
    await generateJsonBackup();
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    
    try {
      await db.insert(scraping_logs).values({
        id: logId,
        source: 'DocHelp-CM',
        status: 'error',
        erreur: error.message
      });
    } catch (logError) {}
    
    throw error;
  }
}

scrapeAndStore().catch(console.error);