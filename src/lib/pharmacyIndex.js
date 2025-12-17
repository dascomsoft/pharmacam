// src/lib/pharmacyIndex.js
'use client';

let pharmaciesIndex = null;

export const initPharmacyIndex = (pharmaciesData) => {
  const index = {
    parNom: new Map(),     // "tongolo" → [pharmacie]
    parVille: new Map(),   // "yaoundé" → [toutes pharmacies de yaoundé]
    nomsSimplifies: new Map() // "saint victor dessomba" → nom original
  };

  pharmaciesData.forEach(pharma => {
    // 1. INDEX PAR NOM SIMPLIFIÉ
    const nomSimple = pharma.nom
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève accents
      .replace(/pharmacie\s*/gi, '') // Enlève "pharmacie"
      .replace(/[^a-z0-9\s]/g, ' ') // Enlève caractères spéciaux
      .replace(/\s+/g, ' ') // Un seul espace
      .trim();

    if (!index.parNom.has(nomSimple)) {
      index.parNom.set(nomSimple, []);
    }
    index.parNom.get(nomSimple).push(pharma);
    index.nomsSimplifies.set(nomSimple, pharma.nom);

    // 2. INDEX PAR VILLE
    if (pharma.ville) {
      const villeClean = pharma.ville
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .trim();
      
      if (!index.parVille.has(villeClean)) {
        index.parVille.set(villeClean, []);
      }
      index.parVille.get(villeClean).push(pharma);
    }
  });

  pharmaciesIndex = index;
  console.log(`✅ Index: ${index.parVille.size} villes, ${index.parNom.size} noms`);
  return index;
};

// RECHERCHE PAR NOM (ultra-rapide)
export const searchPharmacyByName = (query) => {
  if (!pharmaciesIndex) return null;
  
  const queryClean = query
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/pharmacie\s*/gi, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  // 1. Recherche exacte
  if (pharmaciesIndex.parNom.has(queryClean)) {
    return pharmaciesIndex.parNom.get(queryClean);
  }

  // 2. Recherche partielle (pour "tongolo" dans "pharmacie tongolo")
  for (const [nom, pharmacies] of pharmaciesIndex.parNom) {
    // Soit le nom contient la requête, soit la requête contient le nom
    if (nom.includes(queryClean) || queryClean.includes(nom)) {
      return pharmacies;
    }
  }

  return null;
};

// RECHERCHE PAR VILLE (ultra-rapide)
export const searchPharmacyByCity = (villeQuery) => {
  if (!pharmaciesIndex) return [];
  
  const villeClean = villeQuery
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Recherche exacte
  if (pharmaciesIndex.parVille.has(villeClean)) {
    return pharmaciesIndex.parVille.get(villeClean);
  }

  // Recherche approximative (yaounde → yaoundé)
  for (const [ville, pharmacies] of pharmaciesIndex.parVille) {
    if (ville.includes(villeClean) || villeClean.includes(ville)) {
      return pharmacies;
    }
  }

  return []; // Ville non trouvée
};

// LISTE DES VILLES DISPONIBLES
export const getAvailableCities = () => {
  if (!pharmaciesIndex) return [];
  return Array.from(pharmaciesIndex.parVille.keys()).sort();
};