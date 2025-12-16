const fs = require('fs');
const path = require('path');

function cleanGardesData(inputPath, outputPath) {
  console.log(`📦 Nettoyage des données de garde...`);
  console.log(`📁 Source: ${inputPath}`);
  
  // Vérifier si le fichier source existe
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ ERREUR: Fichier source introuvable: ${inputPath}`);
    process.exit(1);
  }
  
  const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  // Vérifier la structure des données
  if (!rawData.regions) {
    console.error('❌ ERREUR: Structure "regions" manquante dans les données');
    process.exit(1);
  }
  
  console.log(`✅ Données chargées: ${rawData.total || 0} pharmacies, ${Object.keys(rawData.regions).length} régions`);
  
  // Créer la nouvelle structure
  const cleanedData = {
    id: rawData.id,
    maj: rawData.maj,
    periode: rawData.periode,
    total: rawData.total || 0,
    regions: {}
  };
  
  let totalCities = 0;
  
  // Organiser les données par région et ville
  for (const [regionName, pharmacies] of Object.entries(rawData.regions)) {
    if (!pharmacies || pharmacies.length === 0) {
      cleanedData.regions[regionName] = [];
      continue;
    }
    
    console.log(`📍 Traitement de la région: ${regionName} (${pharmacies.length} pharmacies)`);
    
    // Grouper par ville
    const pharmaciesByCity = {};
    
    pharmacies.forEach(pharma => {
      // ⭐⭐ PARTIE CRITIQUE : LOGIQUE D'EXTRACTION DES VILLES ⭐⭐
      const address = pharma.adresse || '';
      let realVille = pharma.ville || 'Inconnue';
      
      // Logique d'extraction de ville
      if (address.includes('Mbalmayo :')) realVille = 'Mbalmayo';
      else if (address.includes('Obala :')) realVille = 'Obala';
      else if (address.includes('Sa\'a :') || address.includes('SA\'A')) realVille = 'Sa\'a';
      else if (address.includes('Bafia :')) realVille = 'Bafia';
      else if (address.includes('Mbandjock :')) realVille = 'Mbandjock';
      else if (address.includes('Mbankomo :')) realVille = 'Mbankomo';
      else if (address.includes('Bafoussam :')) realVille = 'Bafoussam';
      else if (address.includes('Banyo :')) realVille = 'Banyo';
      else if (regionName === 'Adamaoua' && (address.includes('Ngaoundéré') || address.includes('Ngaoundere'))) {
          realVille = 'Ngaoundéré';
      }
      else if (regionName === 'Littoral' && address.includes('Douala :')) {
          realVille = 'Douala';
      }
      else if (regionName === 'Littoral' && address.includes('Loum')) {
          realVille = 'Loum';
      }
      else if (regionName === 'Centre') {
          realVille = 'Yaoundé';
      }
      
      // Nettoyer l'adresse
      let cleanAdresse = address;
      const corruptPatterns = [
        'AdamaouaBanyoNgaoundéré',
        'EXTREME NORDKOUSSERIMAGAMAROUA',
        'NORD OUESTBAMENDA'
      ];
      
      corruptPatterns.forEach(pattern => {
        const index = cleanAdresse.indexOf(pattern);
        if (index !== -1) {
          cleanAdresse = cleanAdresse.substring(0, index).trim();
        }
      });
      
      // Extraire le quartier
      let quartier = pharma.quartier || 'Non précisé';
      if (quartier === 'Non précisé' && cleanAdresse.includes(':')) {
        const parts = cleanAdresse.split(':');
        if (parts.length > 1) {
          const afterColon = parts[1].trim();
          const quartierParts = afterColon.split(/\s+/);
          if (quartierParts.length > 1) {
            quartier = quartierParts.slice(0, 2).join(' ');
          } else {
            quartier = afterColon;
          }
        }
      }
      
      // Mettre à jour les données
      pharma.ville = realVille;
      pharma.adresse = cleanAdresse;
      pharma.quartier = quartier;
      
      // Grouper par ville
      if (!pharmaciesByCity[realVille]) {
        pharmaciesByCity[realVille] = [];
      }
      
      pharmaciesByCity[realVille].push(pharma);
    });
    
    // Convertir l'objet en tableau d'objets { ville: string, pharmacies: [] }
    const citiesArray = Object.entries(pharmaciesByCity).map(([city, pharmas]) => ({
      ville: city,
      pharmacies: pharmas
    }));
    
    cleanedData.regions[regionName] = citiesArray;
    totalCities += citiesArray.length;
    
    console.log(`   ✅ Région ${regionName}: ${citiesArray.length} villes organisées`);
  }
  
  // Mettre à jour le total
  cleanedData.total = Object.values(cleanedData.regions)
    .flatMap(cities => cities.flatMap(city => city.pharmacies))
    .length;
  
  // Sauvegarder
  fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));
  
  console.log(`
🎉 NETTOYAGE TERMINÉ !
📊 Résultats:
   • ${cleanedData.total} pharmacies
   • ${Object.keys(cleanedData.regions).length} régions
   • ${totalCities} villes distinctes
   • Fichier créé: ${outputPath}
  `);
  
  return cleanedData;
}

// Exécution directe si appelé depuis la ligne de commande
if (require.main === module) {
  const inputPath = path.join(__dirname, '../public/data/gardes_du_jour.json');
  const outputPath = path.join(__dirname, '../public/data/gardes_du_jour_clean.json');
  
  // Créer le dossier backups s'il n'existe pas
  const backupDir = path.join(__dirname, '../public/data/backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Créer un backup avec timestamp
  if (fs.existsSync(inputPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `gardes_backup_${timestamp}.json`);
    fs.copyFileSync(inputPath, backupPath);
    console.log(`📦 Backup créé: ${backupPath}`);
  }
  
  // Exécuter le nettoyage
  cleanGardesData(inputPath, outputPath);
}

module.exports = { cleanGardesData };