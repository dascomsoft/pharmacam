// import pharmaciesData from '../data/pharmacies.json';

// /**
//  * Recherche des pharmacies par ville
//  * @param {string} ville - 'Yaoundé' ou 'Douala'
//  * @returns {Array} Liste des pharmacies
//  */
// export function getPharmaciesByCity(ville) {
//   return pharmaciesData.filter(pharmacy => 
//     pharmacy.ville.toLowerCase() === ville.toLowerCase()
//   );
// }

// /**
//  * Trouve les pharmacies les plus proches
//  * @param {number} lat - Latitude utilisateur
//  * @param {number} lng - Longitude utilisateur
//  * @param {number} limit - Nombre max de résultats
//  * @returns {Array} Pharmacies triées par distance
//  */
// export function getNearbyPharmacies(lat, lng, limit = 5) {
//   return pharmaciesData
//     .map(pharmacy => {
//       const distance = calculateDistance(lat, lng, pharmacy.lat, pharmacy.lng);
//       return { ...pharmacy, distance };
//     })
//     .sort((a, b) => a.distance - b.distance)
//     .slice(0, limit);
// }

// /**
//  * Calcule la distance entre deux points (en mètres)
//  * Formule de Haversine
//  */
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371000; // Rayon de la Terre en mètres
//   const φ1 = lat1 * Math.PI / 180;
//   const φ2 = lat2 * Math.PI / 180;
//   const Δφ = (lat2 - lat1) * Math.PI / 180;
//   const Δλ = (lon2 - lon1) * Math.PI / 180;

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return Math.round(R * c); // Distance en mètres
// }

// /**
//  * Analyse une requête vocale
//  * @param {string} query - Requête utilisateur
//  * @returns {Object} Informations extraites
//  */
// export function analyzeQuery(query) {
//   const queryLower = query.toLowerCase();
  
//   return {
//     ville: queryLower.includes('douala') ? 'Douala' : 
//            queryLower.includes('yaoundé') || queryLower.includes('yaounde') ? 'Yaoundé' : null,
//     quartier: extractQuartier(queryLower),
//     type: queryLower.includes('garde') || queryLower.includes('nuit') ? 'urgence' : 'normal',
//     medicament: extractMedicament(queryLower)
//   };
// }

// function extractQuartier(query) {
//   const quartiers = ['bastos', 'mendong', 'nsam', 'akwa', 'bonamoussadi', 'bonabéri'];
//   return quartiers.find(quartier => query.includes(quartier)) || null;
// }

// function extractMedicament(query) {
//   const medicaments = ['paracétamol', 'aspirine', 'doliprane', 'ibuprofène', 'sirop'];
//   return medicaments.find(med => query.includes(med)) || null;
// }





























































// // src/lib/pharmacies.js
// import pharmaciesData from '../data/pharmacies.json';

// /**
//  * Recherche des pharmacies par ville
//  */
// export function getPharmaciesByCity(ville) {
//   return pharmaciesData.filter(pharmacy => 
//     pharmacy.ville.toLowerCase() === ville.toLowerCase()
//   );
// }

// /**
//  * Trouve les pharmacies les plus proches
//  */
// export function getNearbyPharmacies(lat, lng, limit = 5) {
//   return pharmaciesData
//     .map(pharmacy => {
//       const distance = calculateDistance(lat, lng, pharmacy.lat, pharmacy.lng);
//       return { ...pharmacy, distance };
//     })
//     .sort((a, b) => a.distance - b.distance)
//     .slice(0, limit);
// }

// /**
//  * Calcule la distance entre deux points (en mètres)
//  */
// export function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371000; // Rayon de la Terre en mètres
//   const φ1 = lat1 * Math.PI / 180;
//   const φ2 = lat2 * Math.PI / 180;
//   const Δφ = (lat2 - lat1) * Math.PI / 180;
//   const Δλ = (lon2 - lon1) * Math.PI / 180;

//   const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return Math.round(R * c); // Distance en mètres
// }

// /**
//  * Analyse une requête vocale
//  */
// export function analyzeQuery(query) {
//   const queryLower = query.toLowerCase();
  
//   return {
//     ville: queryLower.includes('douala') ? 'Douala' : 
//            queryLower.includes('yaoundé') || queryLower.includes('yaounde') ? 'Yaoundé' : null,
//     quartier: extractQuartier(queryLower),
//     type: queryLower.includes('garde') || queryLower.includes('nuit') ? 'urgence' : 'normal',
//     medicament: extractMedicament(queryLower),
//     keywords: extractKeywords(queryLower)
//   };
// }

// function extractQuartier(query) {
//   const quartiers = [
//     'bastos', 'mendong', 'nsam', 'akwa', 'bonamoussadi', 'bonabéri',
//     'essomba', 'eleveurs', 'awae', 'tsinga', 'nkolndongo', 'briqueterie',
//     'mvog-mbi', 'obili', 'mvolyé', 'essos', 'madagascar', 'etoudi',
//     'ngousso', 'ahala', 'emombo', 'odza', 'emana', 'santa barbara',
//     'centre-ville', 'lac', 'messa', 'mballa', 'biteng', 'deido',
//     'logbessou', 'new bell', 'cite sic', 'bali', 'logpom', 'ndogbong',
//     'makepe', 'bassa'
//   ];
  
//   for (const quartier of quartiers) {
//     if (query.includes(quartier)) {
//       return quartier;
//     }
//   }
//   return null;
// }

// function extractMedicament(query) {
//   const medicaments = [
//     'paracétamol', 'aspirine', 'doliprane', 'ibuprofène', 'sirop',
//     'antibiotique', 'vitamine', 'antidouleur', 'fièvre', 'toux',
//     'diabète', 'tension', 'asthme', 'allergie'
//   ];
  
//   for (const med of medicaments) {
//     if (query.includes(med)) {
//       return med;
//     }
//   }
//   return null;
// }

// function extractKeywords(query) {
//   const keywords = [
//     'lac', 'centre', 'carrefour', 'marché', 'stade', 'cathédrale',
//     'mosquée', 'hôpital', 'clinique', 'urgence', 'nuit', 'soir',
//     'ouverte', 'fermé', 'proche', 'près', 'distance'
//   ];
  
//   const found = [];
//   for (const keyword of keywords) {
//     if (query.includes(keyword)) {
//       found.push(keyword);
//     }
//   }
//   return found;
// }

// /**
//  * Recherche intelligente dans les pharmacies
//  */
// export function searchPharmacies(query, city, userLocation = null) {
//   const queryLower = query.toLowerCase();
//   const cityPharmacies = getPharmaciesByCity(city);
  
//   if (cityPharmacies.length === 0) {
//     return [];
//   }
  
//   let results = [...cityPharmacies];
  
//   // 1. Filtrer par quartier
//   const quartier = extractQuartier(queryLower);
//   if (quartier) {
//     results = results.filter(p => 
//       p.quartier.toLowerCase().includes(quartier) ||
//       p.adresse.toLowerCase().includes(quartier) ||
//       p.nom.toLowerCase().includes(quartier)
//     );
//   }
  
//   // 2. Filtrer par mot-clé dans le nom/adresse
//   const keywords = extractKeywords(queryLower);
//   if (keywords.length > 0 && results.length > 10) {
//     results = results.filter(p => {
//       const searchText = (p.nom + ' ' + p.adresse + ' ' + p.quartier).toLowerCase();
//       return keywords.some(keyword => searchText.includes(keyword));
//     });
//   }
  
//   // 3. Filtrer par "garde" ou "nuit"
//   if (queryLower.includes('garde') || queryLower.includes('nuit')) {
//     results = results.filter(p => p.garde_24h === true);
//   }
  
//   // 4. Ajouter les distances si localisation disponible
//   if (userLocation) {
//     results = results.map(p => ({
//       ...p,
//       distance: calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng)
//     }));
//   }
  
//   // 5. Trier (garde 24h > distance > note)
//   results.sort((a, b) => {
//     // Priorité 1: pharmacies de garde 24h
//     if (a.garde_24h && !b.garde_24h) return -1;
//     if (!a.garde_24h && b.garde_24h) return 1;
    
//     // Priorité 2: distance (si disponible)
//     if (a.distance && b.distance) return a.distance - b.distance;
    
//     // Priorité 3: note (si disponible)
//     if (a.note && b.note) return b.note - a.note;
    
//     return 0;
//   });
  
//   return results.slice(0, 5); // Retourner max 5 résultats
// }

































































































// src/lib/pharmacies.js - VERSION COMPLÈTE AVEC IMPORT JSON

import { PharmacyAIService } from './pharmacyAI';

// ==================== PARTIE 1 : IMPORT DE VOTRE BASE DE DONNÉES ====================

// IMPORTANT : Importez votre fichier JSON réel
import pharmaciesData from '../data/pharmacies.json';

// Vérification que l'import fonctionne
console.log('📊 Chargement de la base de données pharmacies...');
console.log(`✅ ${pharmaciesData.length} pharmacies chargées depuis JSON`);

// ==================== PARTIE 2 : FONCTIONS DE RECHERCHE LOCALE ====================

/**
 * Recherche dans la base JSON locale
 * @param {string} query - Terme de recherche
 * @param {string} city - Ville (Yaoundé/Douala)
 * @param {object} userLocation - Position GPS {lat, lng}
 * @returns {Array} Liste des pharmacies trouvées
 */
export function searchInLocalDatabase(query, city = null, userLocation = null) {
  console.log('🔍 Recherche locale pour:', { 
    query, 
    city: city || 'toutes villes',
    hasLocation: !!userLocation 
  });
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // 1. Filtrer les pharmacies
  let results = pharmaciesData.filter(pharmacy => {
    // Vérifier que la pharmacie a les champs requis
    if (!pharmacy.nom || !pharmacy.ville) return false;
    
    // Recherche dans nom ET quartier
    const matchesName = pharmacy.nom.toLowerCase().includes(normalizedQuery);
    const matchesQuartier = pharmacy.quartier?.toLowerCase().includes(normalizedQuery) || false;
    const matchesServices = pharmacy.services?.some(service => 
      service.toLowerCase().includes(normalizedQuery)
    ) || false;
    
    // Filtrer par ville si spécifiée
    const matchesCity = city ? pharmacy.ville === city : true;
    
    return (matchesName || matchesQuartier || matchesServices) && matchesCity;
  });
  
  // 2. Trier par pertinence si on a des résultats
  if (results.length > 0) {
    results = sortPharmaciesByRelevance(results, normalizedQuery, userLocation);
    
    // Limiter à 5 résultats max
    results = results.slice(0, 5);
  }
  
  console.log(`✅ Trouvé ${results.length} résultat(s) localement`);
  return results;
}

/**
 * Trie les pharmacies par pertinence
 */
function sortPharmaciesByRelevance(pharmacies, query, userLocation) {
  return pharmacies.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // 1. Priorité aux pharmacies de garde 24h/24
    if (a.garde_24h) scoreA += 30;
    if (b.garde_24h) scoreB += 30;
    
    // 2. Priorité aux correspondances EXACTES dans le nom
    if (a.nom.toLowerCase() === query.toLowerCase()) scoreA += 25;
    if (b.nom.toLowerCase() === query.toLowerCase()) scoreB += 25;
    
    // 3. Priorité aux correspondances dans le nom (partielles)
    if (a.nom.toLowerCase().includes(query.toLowerCase())) scoreA += 20;
    if (b.nom.toLowerCase().includes(query.toLowerCase())) scoreB += 20;
    
    // 4. Distance (si localisation disponible)
    if (userLocation && a.lat && a.lng) {
      const distanceA = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        parseFloat(a.lat), 
        parseFloat(a.lng)
      );
      // +20 points si moins de 1km, décroissant ensuite
      scoreA += Math.max(0, 20 - (distanceA / 1000));
    }
    if (userLocation && b.lat && b.lng) {
      const distanceB = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        parseFloat(b.lat), 
        parseFloat(b.lng)
      );
      scoreB += Math.max(0, 20 - (distanceB / 1000));
    }
    
    // 5. Note/évaluation (si disponible)
    scoreA += (a.note || 0) * 3;
    scoreB += (b.note || 0) * 3;
    
    // 6. Services (si la recherche concerne un service spécifique)
    if (a.services && a.services.length > 0) scoreA += 5;
    if (b.services && b.services.length > 0) scoreB += 5;
    
    return scoreB - scoreA; // Tri décroissant (meilleur score d'abord)
  });
}

/**
 * Calcule la distance entre deux points GPS (en mètres)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance en mètres
}

// ==================== PARTIE 3 : SYSTÈME HYBRIDE IA ====================

/**
 * RECHERCHE HYBRIDE PRINCIPALE
 * 1. Cherche dans votre JSON local
 * 2. Si trouvé → retourne résultats
 * 3. Si PAS trouvé → appelle l'IA Groq
 */
export async function hybridPharmacySearch(query, city = null, userLocation = null) {
  console.log('🚀 Recherche hybride lancée:', { 
    query, 
    city: city || 'auto-détection',
    timestamp: new Date().toISOString() 
  });
  
  // Étape 1 : Recherche dans VOTRE base JSON
  const localResults = searchInLocalDatabase(query, city, userLocation);
  
  // Étape 2 : Si trouvé localement → retourner immédiatement
  if (localResults.length > 0) {
    console.log('✅ Pharmacie trouvée dans votre base JSON');
    
    return {
      type: 'local_database',
      source: 'votre_base_json',
      results: localResults,
      count: localResults.length,
      confidence: 'high',
      message: `🏥 ${localResults.length} pharmacie(s) trouvée(s) dans notre base`,
      timestamp: new Date().toISOString(),
      
      // Métadonnées pour l'UI
      ui: {
        icon: '✅',
        color: 'green',
        title: 'Pharmacies vérifiées',
        badge: `📊 ${localResults.length} résultat(s)`
      }
    };
  }
  
  // Étape 3 : Si PAS trouvé localement → Appeler l'IA Groq
  console.log('🔍 Aucun résultat dans votre JSON, appel à l\'IA Groq...');
  
  try {
    const aiService = new PharmacyAIService();
    
    // Détecter la ville automatiquement
    const detectedCity = city || detectCityFromQuery(query);
    
    // Appeler l'IA Groq
    const aiResult = await aiService.searchWithAI(query, detectedCity);
    
    // Étape 4 : Si l'IA réussit
    if (aiResult.success && aiResult.response) {
      console.log('🤖 Réponse IA reçue avec succès');
      
      // Extraire les infos structurées de la réponse IA
      const parsedInfo = extractPharmacyInfoFromAIResponse(aiResult.response);
      
      return {
        type: 'ai_assisted',
        source: 'groq_ai',
        ai_response: aiResult.response,
        parsed_info: parsedInfo,
        confidence: 'medium',
        disclaimer: 'Réponse basée sur la connaissance générale des pharmacies au Cameroun. À vérifier avant utilisation.',
        timestamp: new Date().toISOString(),
        
        // Actions recommandées
        actions: [
          { 
            id: 'verify',
            label: '✅ Confirmer cette pharmacie',
            icon: 'check',
            description: 'Aidez-nous à enrichir notre base'
          },
          { 
            id: 'call_1510',
            label: '📞 Appeler 1510 (ONPC)',
            icon: 'phone',
            description: 'Service officiel des pharmaciens'
          },
          { 
            id: 'open_maps',
            label: '🗺️ Chercher sur Maps',
            icon: 'map-pin',
            description: 'Vérifier localisation exacte'
          }
        ],
        
        // Métadonnées UI
        ui: {
          icon: '🤖',
          color: 'yellow',
          title: 'Suggestion IA',
          badge: 'Nouveau'
        }
      };
    }
    
    // Étape 5 : Si l'IA échoue (pas de réponse ou erreur)
    console.log('⚠️ IA non disponible, fallback activé');
    return createFallbackResponse(query, detectedCity, 'IA non disponible');
    
  } catch (error) {
    // Étape 6 : Erreur générale
    console.error('💥 Erreur recherche hybride:', error);
    return createFallbackResponse(query, city, error.message);
  }
}

// ==================== PARTIE 4 : EXTRACTION D'INFOS DEPUIS L'IA ====================

/**
 * Extrait les informations structurées de la réponse IA
 */
function extractPharmacyInfoFromAIResponse(aiText) {
  try {
    const patterns = {
      nom: /(?:Pharmacie\s+)?([A-ZÉÈÊËÀÂÄÔÖÛÜÇ][a-zéèêëàâäôöûüç\s-]+?(?=\s+(?:à|au|dans|est|fait)|\.|$))/i,
      quartier: /(?:à|au|dans|quartier)\s+([A-ZÉÈÊËÀÂÄÔÖÛÜÇ][a-zéèêëàâäôöûüç\s-]+?(?=\s|,|\.|$))/i,
      telephone: /(?:(?:téléphone|tel|tél)[:\s]*)?(\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2})/i,
      adresse: /(?:rue|avenue|boulevard|face|près|carrefour|à côté de)\s+([^.,;]+?(?=[.,;]|\s+(?:téléphone|tel)|$))/i,
      ville: /(?:à|au|dans)\s+(Yaoundé|Douala|Yaounde)/i
    };

    const result = {};
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = aiText.match(pattern);
      if (match) {
        result[key] = (match[1] || match[0]).trim();
      }
    }
    
    // Nettoyage supplémentaire
    if (result.nom && result.nom.includes('Pharmacie')) {
      result.nom = result.nom.replace(/^Pharmacie\s+/i, '').trim();
      result.nom = `Pharmacie ${result.nom}`;
    }
    
    return {
      ...result,
      raw_text: aiText,
      extracted_at: new Date().toISOString(),
      extraction_method: 'regex_patterns'
    };
    
  } catch (error) {
    console.warn('⚠️ Impossible d\'extraire les infos IA:', error);
    return {
      raw_text: aiText,
      error: 'extraction_failed',
      extracted_at: new Date().toISOString()
    };
  }
}

// ==================== PARTIE 5 : DÉTECTION DE VILLE & FALLBACK ====================

/**
 * Détecte la ville depuis la requête
 */
export function detectCityFromQuery(query) {
  if (!query) return null;
  
  const queryLower = query.toLowerCase();
  
  const yaoundeKeywords = [
    'yaoundé', 'yaounde', 'bastos', 'biyem-assi', 'nkolbisson',
    'mvan', 'mendong', 'emana', 'odza', 'nkolmesseng', 'ngoa-ekélé',
    'ngoa ekélé', 'cite verte', 'cite-verte', 'essos', 'mfoundi'
  ];
  
  const doualaKeywords = [
    'douala', 'akwa', 'bonapriso', 'bonanjo', 'deïdo', 'deido',
    'new bell', 'makepe', 'kotto', 'logbaba', 'bonaberi',
    'bassa', 'kumba', 'manoka', 'ndogbong'
  ];
  
  // Vérifier Yaoundé d'abord (plus spécifique)
  for (const keyword of yaoundeKeywords) {
    if (queryLower.includes(keyword)) {
      return 'Yaoundé';
    }
  }
  
  // Puis Douala
  for (const keyword of doualaKeywords) {
    if (queryLower.includes(keyword)) {
      return 'Douala';
    }
  }
  
  return null;
}

/**
 * Crée une réponse de fallback
 */
function createFallbackResponse(query, city = null, error = null) {
  const cityPart = city ? ` à ${city}` : '';
  const suggestions = getSearchSuggestions(query, city);
  
  return {
    type: 'fallback',
    source: 'system',
    message: `Je n'ai pas trouvé "${query}"${cityPart} dans notre base.`,
    suggestions: suggestions,
    advice: [
      '🔍 Essayez avec un nom plus précis (ex: "Pharmacie Centrale Bastos")',
      '📍 Ajoutez le quartier (ex: "pharmacie de garde Biyem-Assi")',
      '📞 En urgence : appelez le 1510 (ONPC - Ordre National des Pharmaciens)',
      '🗺️ Vérifiez sur Google Maps avec "pharmacie de garde" + votre quartier',
      '🌐 Consultez annuaire-medical.cm pour les pharmacies officielles'
    ],
    emergency_contacts: [
      { name: 'ONPC (Pharmacies de garde)', number: '1510', description: 'Service officiel' },
      { name: 'Urgences médicales', number: '112', description: 'Numéro d\'urgence' },
      { name: 'SAMU Cameroun', number: '119', description: 'Service d\'aide médicale' }
    ],
    timestamp: new Date().toISOString(),
    
    ui: {
      icon: '⚠️',
      color: 'orange',
      title: 'Conseils de recherche',
      badge: 'Aide'
    },
    
    // Debug en développement
    ...(process.env.NODE_ENV === 'development' && {
      debug: { query, city, error, suggestions_count: suggestions.length }
    })
  };
}

/**
 * Génère des suggestions de recherche alternatives
 */
function getSearchSuggestions(query, city) {
  const suggestions = [];
  const queryLower = query.toLowerCase();
  
  // Si recherche vague
  if (queryLower.includes('pharmacie') && !queryLower.includes('garde')) {
    suggestions.push(`${query} de garde`);
  }
  
  // Si pas de ville spécifiée
  if (!city && !detectCityFromQuery(query)) {
    suggestions.push(`${query} Yaoundé`, `${query} Douala`);
  }
  
  // Suggestions basées sur les pharmacies populaires
  const popularPharmacies = [
    'Pharmacie Centrale',
    'Pharmacie du Lac', 
    'Pharmacie Bastos',
    'Pharmacie Akwa',
    'Pharmacie Bonanjo'
  ];
  
  for (const pharma of popularPharmacies) {
    if (city) {
      suggestions.push(`${pharma} ${city}`);
    } else {
      suggestions.push(`${pharma} Yaoundé`, `${pharma} Douala`);
    }
  }
  
  return [...new Set(suggestions)].slice(0, 5); // Éliminer les doublons
}

// ==================== PARTIE 6 : COMPATIBILITÉ AVEC VOTRE CODE EXISTANT ====================

/**
 * Fonction existante pour compatibilité
 * @deprecated Utilisez hybridPharmacySearch() pour l'IA
 */
export function searchPharmacies(query, city = null, userLocation = null) {
  console.warn('ℹ️ searchPharmacies() - Utilisez hybridPharmacySearch() pour bénéficier de l\'IA');
  return searchInLocalDatabase(query, city, userLocation);
}

/**
 * Fonction existante pour compatibilité
 */
export function analyzeQuery(query) {
  const city = detectCityFromQuery(query);
  const queryLower = query.toLowerCase();
  
  return {
    ville: city,
    urgence: queryLower.includes('urgence') || 
             queryLower.includes('nuit') ||
             queryLower.includes('maintenant') ||
             queryLower.includes('vite'),
    garde: queryLower.includes('garde') || queryLower.includes('24h'),
    specialite: extractSpecialty(queryLower),
    keywords: extractKeywords(queryLower)
  };
}

/**
 * Extrait la spécialité médicale de la requête
 */
function extractSpecialty(text) {
  const specialties = {
    pediatrie: ['bébé', 'enfant', 'pédiatrie', 'nourrisson', 'bebe'],
    diabete: ['diabète', 'diabete', 'insuline', 'glycémie'],
    grossesse: ['grossesse', 'enceinte', 'maternité', 'accouchement'],
    chronique: ['chronique', 'tension', 'cardiaque', 'asthme', 'hypertension']
  };
  
  for (const [specialty, keywords] of Object.entries(specialties)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return specialty;
    }
  }
  
  return null;
}

/**
 * Extrait les mots-clés importants
 */
function extractKeywords(text) {
  const stopWords = ['de', 'à', 'la', 'le', 'les', 'du', 'des', 'une', 'un', 'pour', 'sur'];
  return text.split(/[\s.,!?]+/)
    .filter(word => word.length > 2 && !stopWords.includes(word.toLowerCase()))
    .slice(0, 8);
}

// ==================== PARTIE 7 : STATISTIQUES ET UTILITAIRES ====================

/**
 * Obtient des statistiques sur la base de données
 */
export function getDatabaseStats() {
  const stats = {
    total: pharmaciesData.length,
    byCity: {},
    with24h: 0,
    withPhone: 0,
    withCoordinates: 0
  };
  
  pharmaciesData.forEach(pharmacy => {
    // Par ville
    stats.byCity[pharmacy.ville] = (stats.byCity[pharmacy.ville] || 0) + 1;
    
    // 24h/24
    if (pharmacy.garde_24h) stats.with24h++;
    
    // Téléphone
    if (pharmacy.contact && pharmacy.contact.trim().length > 5) stats.withPhone++;
    
    // Coordonnées
    if (pharmacy.lat && pharmacy.lng) stats.withCoordinates++;
  });
  
  return stats;
}

/**
 * Recherche les pharmacies ouvertes maintenant
 */
export function findOpenPharmaciesNow(city = null, userLocation = null) {
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour < 8 || hour > 20;
  
  let results = pharmaciesData.filter(pharmacy => {
    const matchesCity = city ? pharmacy.ville === city : true;
    
    if (isNight) {
      // La nuit : uniquement les pharmacies de garde
      return matchesCity && pharmacy.garde_24h === true;
    } else {
      // Le jour : toutes les pharmacies
      return matchesCity;
    }
  });
  
  // Trier par distance si localisation disponible
  if (userLocation && results.length > 0) {
    results = results.sort((a, b) => {
      if (!a.lat || !a.lng) return 1;
      if (!b.lat || !b.lng) return -1;
      
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    });
  }
  
  return results.slice(0, 10); // Limiter à 10 résultats
}

// ==================== PARTIE 8 : EXPORT FINAL ====================

export default {
  // NOUVEAU : Système hybride avec IA
  hybridSearch: hybridPharmacySearch,
  
  // Fonctions de recherche
  searchLocal: searchInLocalDatabase,
  searchOpenNow: findOpenPharmaciesNow,
  detectCity: detectCityFromQuery,
  
  // Fonctions existantes (compatibilité)
  search: searchPharmacies,
  analyze: analyzeQuery,
  
  // Statistiques et infos
  getStats: getDatabaseStats,
  databaseInfo: {
    name: 'Pharmacam Database',
    version: '2.0.0',
    description: 'Base de données pharmacie + IA Groq',
    recordCount: pharmaciesData.length,
    lastUpdated: '2024-12-08',
    features: ['recherche_locale', 'ia_groq', 'geolocalisation', 'detection_ville']
  }
};