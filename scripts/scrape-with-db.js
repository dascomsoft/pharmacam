// scripts/scrape-with-db.js
import { db } from '../src/lib/db/client';
import { pharmacies, gardes, scraping_logs } from '../src/lib/db/schema';
import { scrapeDochelp } from './scrape-gardes-optimized.js';
import { scrapeAnnuaireMedical } from './scrape-gardes-annuaire-medical.js';
import { sql } from 'drizzle-orm';

async function scrapeAndStore() {
  const startTime = Date.now();
  const logId = `scrape_${startTime}`;
  
  let stats = {
    nouvelles: 0,
    misesAJour: 0,
    total: 0
  };
  
  try {
    console.log('🚀 Début du scraping multi-sources...');
    
    // Scraper les deux sources
    const [dochelpData, annuaireData] = await Promise.allSettled([
      scrapeDochelp(),
      scrapeAnnuaireMedical()
    ]);
    
    // Fusionner les données
    const allPharmacies = [];
    
    if (dochelpData.status === 'fulfilled') {
      allPharmacies.push(...dochelpData.value.pharmacies);
    }
    
    if (annuaireData.status === 'fulfilled') {
      allPharmacies.push(...annuaireData.value.pharmacies);
    }
    
    console.log(`📊 ${allPharmacies.length} pharmacies trouvées au total`);
    
    // Pour chaque pharmacie
    for (const pharma of allPharmacies) {
      // Vérifier si existe déjà
      const existing = await db.select()
        .from(pharmacies)
        .where(sql`nom = ${pharma.nom} AND ville = ${pharma.ville}`)
        .limit(1);
      
      if (existing.length === 0) {
        // Nouvelle pharmacie
        await db.insert(pharmacies).values({
          id: pharma.id,
          nom: pharma.nom,
          adresse: pharma.adresse,
          quartier: pharma.quartier,
          ville: pharma.ville,
          region: pharma.region,
          tel: pharma.tel,
          latitude: pharma.coordinates?.lat,
          longitude: pharma.coordinates?.lng,
          en_garde: pharma.en_garde,
          horaires: pharma.horaires,
          services: JSON.stringify(pharma.services),
          note: pharma.note,
          source: pharma.source,
          source_url: pharma.source_url,
          scraped_at: pharma.scraped_at
        });
        stats.nouvelles++;
      } else {
        // Mise à jour si nécessaire
        const existingPharma = existing[0];
        const updates = {};
        
        // Mettre à jour le téléphone si meilleur
        if (pharma.tel && pharma.tel !== 'Non listé' && 
            (!existingPharma.tel || existingPharma.tel === 'Non listé')) {
          updates.tel = pharma.tel;
        }
        
        if (Object.keys(updates).length > 0) {
          await db.update(pharmacies)
            .set({ ...updates, updated_at: new Date().toISOString() })
            .where(sql`id = ${existingPharma.id}`);
          stats.misesAJour++;
        }
      }
      
      // Ajouter l'entrée de garde
      await db.insert(gardes).values({
        id: `garde_${Date.now()}_${stats.total}`,
        pharmacie_id: existing[0]?.id || pharma.id,
        date_debut: new Date().toISOString().split('T')[0],
        date_fin: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        periode_texte: dochelpData.value?.periode || annuaireData.value?.periode,
        source: pharma.source
      });
      
      stats.total++;
    }
    
    // Journaliser le scraping
    await db.insert(scraping_logs).values({
      id: logId,
      source: 'multi',
      pharmacies_trouvees: allPharmacies.length,
      pharmacies_nouvelles: stats.nouvelles,
      pharmacies_mises_a_jour: stats.misesAJour,
      status: 'success',
      duree_secondes: Math.floor((Date.now() - startTime) / 1000)
    });
    
    console.log(`✅ Scraping réussi: ${stats.nouvelles} nouvelles, ${stats.misesAJour} mises à jour`);
    
    // Générer JSON de fallback
    await generateJsonBackup();
    
  } catch (error) {
    console.error('❌ Erreur scraping:', error);
    
    await db.insert(scraping_logs).values({
      id: logId,
      source: 'multi',
      status: 'error',
      erreur: error.message,
      duree_secondes: Math.floor((Date.now() - startTime) / 1000)
    });
    
    throw error;
  }
}

async function generateJsonBackup() {
  // Garder un backup JSON pour fallback
  const allPharmacies = await db.select().from(pharmacies);
  
  const backup = {
    id: `backup_${Date.now()}`,
    maj: new Date().toISOString(),
    total: allPharmacies.length,
    pharmacies: allPharmacies
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'public/data/backups', `backup_${Date.now()}.json`),
    JSON.stringify(backup, null, 2)
  );
}

scrapeAndStore().catch(console.error);