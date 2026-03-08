

// // src/lib/gardeService.js
// import { EMERGENCY_NUMBERS } from './regions';

// class GardeService {
//   constructor() {
//     this.cacheKey = 'pharmacam_gardes_cache';
//     this.cacheDuration = 2 * 60 * 60 * 1000; // 2 heures
//   }

//   // MÉTHODE MODIFIÉE POUR LIRE LE FICHIER CLEAN 
//   async loadGardesData() {
//     // Vérifier le cache
//     const cached = this.getFromCache();
//     if (cached) return cached;

//     try {
//       // CHANGEMENT ICI : Utiliser le fichier clean avec la nouvelle structure
//       const response = await fetch('/data/gardes_du_jour_clean.json', {
//         headers: {
//           'Cache-Control': 'no-cache'
//         }
//       });

//       if (!response.ok) throw new Error('Données non disponibles');

//       const data = await response.json();
      
//       // TRANSFORMER LA NOUVELLE STRUCTURE POUR COMPATIBILITÉ 
//       const transformedData = this.transformCleanData(data);
      
//       // Enrichir les données (votre code existant)
//       const enrichedData = this.enrichData(transformedData);
      
//       // Mettre en cache
//       this.saveToCache(enrichedData);
      
//       return enrichedData;
//     } catch (error) {
//       console.error('Erreur chargement données:', error);
//       return this.getFallbackData();
//     }
//   }

//   // NOUVELLE MÉTHODE : TRANSFORMATION DE LA STRUCTURE 
//   transformCleanData(cleanData) {
//     console.log('🔄 Transformation de la structure des données...');
    
//     const allPharmacies = [];
    
//     // Parcourir chaque région
//     Object.entries(cleanData.regions || {}).forEach(([regionName, cities]) => {
//       // cities est un tableau d'objets : [{ ville: "Yaoundé", pharmacies: [...] }, ...]
//       cities.forEach(cityData => {
//         const cityPharmacies = cityData.pharmacies || [];
        
//         // Pour chaque pharmacie de cette ville
//         cityPharmacies.forEach(pharmacy => {
//           // S'assurer que les champs région et ville sont corrects
//           pharmacy.region = pharmacy.region || regionName;
//           pharmacy.ville = pharmacy.ville || cityData.ville;
          
//           allPharmacies.push(pharmacy);
//         });
//       });
//     });
    
//     console.log(`✅ Transformation terminée : ${allPharmacies.length} pharmacies organisées`);
    
//     // Retourner la structure attendue par votre code existant
//     return {
//       ...cleanData,
//       pharmacies: allPharmacies,  // Tableau plat pour compatibilité
//       total: allPharmacies.length
//     };
//   }

//   // ⭐⭐ NOUVELLE MÉTHODE : OBTENIR LES VILLES PAR RÉGION ⭐⭐
//   async getCitiesByRegion(region = null) {
//     try {
//       const data = await this.loadGardesData();
      
//       // Si on a accès aux données brutes (non transformées)
//       if (data._rawRegions) {
//         if (region && data._rawRegions[region]) {
//           return data._rawRegions[region].map(city => ({
//             name: city.ville,
//             count: city.pharmacies?.length || 0,
//             pharmacies: city.pharmacies || []
//           }));
//         }
//       }
      
//       // Fallback : méthode originale
//       const cities = new Set();
//       data.pharmacies.forEach(p => {
//         if (!region || p.region === region) {
//           cities.add(p.ville);
//         }
//       });
      
//       return Array.from(cities).sort();
//     } catch (error) {
//       console.error('Erreur getCitiesByRegion:', error);
//       return [];
//     }
//   }

//   // ⭐⭐ NOUVELLE MÉTHODE : STATISTIQUES PAR RÉGION ⭐⭐
//   async getRegionStats() {
//     try {
//       const data = await this.loadGardesData();
//       const stats = {};
      
//       // Vérifier si on a les régions originales
//       if (data._rawRegions) {
//         Object.entries(data._rawRegions).forEach(([regionName, cities]) => {
//           let total = 0;
//           cities.forEach(city => {
//             total += city.pharmacies?.length || 0;
//           });
//           stats[regionName] = {
//             total,
//             cities: cities.length
//           };
//         });
//       } else {
//         // Ancienne méthode
//         data.pharmacies.forEach(pharmacy => {
//           const region = pharmacy.region || 'Non spécifié';
//           stats[region] = (stats[region] || 0) + 1;
//         });
//       }
      
//       return stats;
//     } catch (error) {
//       console.error('Erreur getRegionStats:', error);
//       return {};
//     }
//   }

//   //  NOUVELLE MÉTHODE : OBTENIR LES PHARMACIES PAR RÉGION ET VILLE 
//   async getPharmaciesByRegionAndCity(region, city = null) {
//     try {
//       const data = await this.loadGardesData();
      
//       // Filtrer les pharmacies
//       let filtered = data.pharmacies.filter(p => p.region === region);
      
//       if (city) {
//         filtered = filtered.filter(p => p.ville === city);
//       }
      
//       return filtered;
//     } catch (error) {
//       console.error('Erreur getPharmaciesByRegionAndCity:', error);
//       return [];
//     }
//   }

//   // MÉTHODE AMÉLIORÉE POUR GARDER LA STRUCTURE ORIGINALE 
//   enrichData(data) {
//     if (!data.pharmacies) return data;

//     // Sauvegarder la structure originale si elle existe
//     if (data.regions && typeof data.regions === 'object') {
//       data._rawRegions = data.regions;  // Sauvegarde pour les méthodes de ville
//     }

//     const pharmacies = data.pharmacies.map(pharmacy => {
//       // Ajouter des métadonnées (votre code existant)
//       return {
//         ...pharmacy,
//         coordinates: pharmacy.coordinates || {
//           lat: getCityLat(pharmacy.ville),
//           lng: getCityLng(pharmacy.ville)
//         },
//         services: pharmacy.services || [
//           'Garde nocturne',
//           'Urgences',
//           'Conseil pharmaceutique',
//           'Médicaments essentiels'
//         ],
//         note: pharmacy.note || (3.5 + Math.random() * 1.5).toFixed(1),
//         horaires: pharmacy.horaires || {
//           garde: "20h00 - 08h00",
//           standard: "08h00 - 20h00"
//         },
//         isOpenNow: this.checkIfOpenNow(pharmacy)
//       };
//     });

//     return {
//       ...data,
//       pharmacies,
//       stats: {
//         total: pharmacies.length,
//         byRegion: this.groupByRegion(pharmacies),
//         withPhone: pharmacies.filter(p => p.tel && p.tel !== 'Non listé').length,
//         emergencyNumbers: EMERGENCY_NUMBERS
//       }
//     };
//   }

//   // MÉTHODE EXISTANTE AMÉLIORÉE 
//   groupByRegion(pharmacies) {
//     const stats = {};
    
//     Object.entries(this.getRegionStatsSync(pharmacies)).forEach(([region, count]) => {
//       stats[region] = count;
//     });
    
//     return stats;
//   }

//   // NOUVELLE MÉTHODE SYNC POUR LES STATS 
//   getRegionStatsSync(pharmacies) {
//     const stats = {};
    
//     pharmacies.forEach(pharmacy => {
//       const region = pharmacy.region || 'Non spécifié';
//       stats[region] = (stats[region] || 0) + 1;
//     });
    
//     return stats;
//   }

//   // MÉTHODE POUR OBTENIR LE NOMBRE PAR RÉGION (RAPIDE) 
//   async getRegionCount(regionName) {
//     try {
//       const stats = await this.getRegionStats();
//       return stats[regionName]?.total || 0;
//     } catch (error) {
//       console.error('Erreur getRegionCount:', error);
//       return 0;
//     }
//   }

//   //  MÉTHODES EXISTANTES (NE PAS MODIFIER) 
//   checkIfOpenNow(pharmacy) {
//     const now = new Date();
//     const hours = now.getHours();
    
//     if (pharmacy.en_garde) {
//       return hours >= 20 || hours < 8;
//     }
    
//     return false;
//   }

//   getFromCache() {
//     if (typeof window === 'undefined') return null;

//     try {
//       const cached = localStorage.getItem(this.cacheKey);
//       if (!cached) return null;

//       const { data, timestamp } = JSON.parse(cached);
      
//       if (Date.now() - timestamp < this.cacheDuration) {
//         return data;
//       }
//     } catch (error) {
//       console.warn('Erreur lecture cache:', error);
//     }

//     return null;
//   }

//   saveToCache(data) {
//     if (typeof window === 'undefined') return;

//     try {
//       localStorage.setItem(this.cacheKey, JSON.stringify({
//         data,
//         timestamp: Date.now()
//       }));
//     } catch (error) {
//       console.warn('Erreur écriture cache:', error);
//     }
//   }

//   getFallbackData() {
//     return {
//       scraped_at: new Date().toISOString(),
//       periode: "Données locales",
//       pharmacies: [],
//       total: 0,
//       stats: {
//         total: 0,
//         byRegion: {},
//         withPhone: 0,
//         emergencyNumbers: EMERGENCY_NUMBERS
//       }
//     };
//   }

//   async search(options = {}) {
//     const data = await this.loadGardesData();
//     let results = data.pharmacies || [];

//     // Filtrage (votre code existant)
//     if (options.query) {
//       const query = options.query.toLowerCase();
//       results = results.filter(p =>
//         p.nom.toLowerCase().includes(query) ||
//         p.ville.toLowerCase().includes(query) ||
//         p.quartier.toLowerCase().includes(query) ||
//         (p.adresse && p.adresse.toLowerCase().includes(query))
//       );
//     }

//     if (options.region && options.region !== 'all') {
//       results = results.filter(p => p.region === options.region);
//     }

//     if (options.ville && options.ville !== 'all') {
//       results = results.filter(p => p.ville === options.ville);
//     }

//     if (options.garde24h) {
//       results = results.filter(p => p.garde_24h === true);
//     }

//     if (options.openNow) {
//       results = results.filter(p => p.isOpenNow === true);
//     }

//     // Tri (votre code existant)
//     if (options.sortBy) {
//       results.sort((a, b) => {
//         switch (options.sortBy) {
//           case 'name':
//             return a.nom.localeCompare(b.nom);
//           case 'city':
//             return a.ville.localeCompare(b.ville);
//           case 'rating':
//             return (b.note || 0) - (a.note || 0);
//           case 'distance':
//             if (options.userLocation && a.coordinates && b.coordinates) {
//               const distA = this.calculateDistance(
//                 options.userLocation.lat,
//                 options.userLocation.lng,
//                 a.coordinates.lat,
//                 a.coordinates.lng
//               );
//               const distB = this.calculateDistance(
//                 options.userLocation.lat,
//                 options.userLocation.lng,
//                 b.coordinates.lat,
//                 b.coordinates.lng
//               );
//               return distA - distB;
//             }
//             return 0;
//           default:
//             return 0;
//         }
//       });
//     }

//     return {
//       results,
//       total: results.length,
//       periode: data.periode,
//       lastUpdate: data.scraped_at,
//       stats: data.stats
//     };
//   }

//   calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371;
//     const dLat = this.toRad(lat2 - lat1);
//     const dLon = this.toRad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   }

//   toRad(degrees) {
//     return degrees * (Math.PI / 180);
//   }

//   getPharmacyDetails(id) {
//     return this.loadGardesData().then(data => {
//       return data.pharmacies.find(p => p.id === id) || null;
//     });
//   }

//   getRegions() {
//     return ['Centre', 'Littoral', 'Ouest', 'Adamaoua', 'Nord', 'Extrême-Nord', 'Sud', 'Est', 'Nord-Ouest', 'Sud-Ouest'];
//   }

//   async getCities(region = null) {
//     return this.getCitiesByRegion(region);
//   }

//   getGoogleMapsUrl(pharmacy) {
//     if (!pharmacy.coordinates) return null;
    
//     const { lat, lng } = pharmacy.coordinates;
//     return `https://www.google.com/maps?q=${lat},${lng}`;
//   }

//   getGoogleDirectionsUrl(pharmacy) {
//     if (!pharmacy.coordinates) return null;
    
//     const { lat, lng } = pharmacy.coordinates;
//     return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
//   }

//   formatPhoneNumber(phone) {
//     if (!phone || phone === 'Non listé') return null;
    
//     const cleaned = phone.replace(/\D/g, '');
//     if (cleaned.length === 9) {
//       return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
//     }
    
//     return phone;
//   }

//   getCallablePhone(phone) {
//     if (!phone || phone === 'Non listé') return null;
    
//     const cleaned = phone.replace(/\D/g, '');
//     if (cleaned.length >= 9) {
//       return `+237${cleaned}`;
//     }
    
//     return phone;
//   }

//   getEmergencyContacts() {
//     return EMERGENCY_NUMBERS;
//   }
// }

// // Fonctions utilitaires (votre code existant)
// function getCityLat(ville) {
//   const lats = {
//     'Yaoundé': 3.8480,
//     'Douala': 4.0511,
//     'Bafoussam': 5.4778,
//     'Bamenda': 5.9630,
//     'Ngaoundéré': 7.3169,
//     'Garoua': 9.3077,
//     'Maroua': 10.5953,
//     'Bertoua': 4.5792,
//     'Ebolowa': 2.9000,
//     'Buea': 4.1550
//   };
//   return lats[ville] || 5.9630;
// }

// function getCityLng(ville) {
//   const lngs = {
//     'Yaoundé': 11.5021,
//     'Douala': 9.7679,
//     'Bafoussam': 10.4176,
//     'Bamenda': 10.1591,
//     'Ngaoundéré': 13.5833,
//     'Garoua': 13.3988,
//     'Maroua': 14.3247,
//     'Bertoua': 13.6769,
//     'Ebolowa': 11.1500,
//     'Buea': 9.2430
//   };
//   return lngs[ville] || 12.3547;
// }

// // Export singleton
// export const gardeService = new GardeService();
// export default gardeService;








































































































































































































// // src/lib/gardeService.js - VERSION AMÉLIORÉE AVEC API
// class GardeService {
//   constructor() {
//     this.cacheKey = 'pharmacam_gardes_cache';
//     this.cacheDuration = 5 * 60 * 1000; // 5 minutes (réduit car API rapide)
//     this.apiBase = '/api';
//   }

//   async search(options = {}) {
//     // Construire l'URL avec les paramètres
//     const params = new URLSearchParams();
    
//     if (options.query) params.append('query', options.query);
//     if (options.region && options.region !== 'all') params.append('region', options.region);
//     if (options.ville && options.ville !== 'all') params.append('ville', options.ville);
//     if (options.enGarde) params.append('en_garde', 'true');
//     if (options.hasPhone) params.append('avec_tel', 'true');
//     if (options.page) params.append('page', options.page);
//     if (options.limit) params.append('limit', options.limit);
//     if (options.sortBy) params.append('sort_by', options.sortBy);
    
//     try {
//       const response = await fetch(`${this.apiBase}/pharmacies?${params}`);
//       const data = await response.json();
      
//       if (!data.success) throw new Error(data.error);
      
//       // Transformer pour compatibilité avec votre UI existante
//       return {
//         results: data.data,
//         total: data.pagination.total,
//         page: data.pagination.page,
//         totalPages: data.pagination.totalPages,
//         limit: data.pagination.limit,
//         lastUpdate: data.timestamp,
//         stats: await this.getStats() // stats séparées
//       };
//     } catch (error) {
//       console.error('Search error:', error);
//       return { results: [], total: 0, error: error.message };
//     }
//   }

//   async getCities(region = null) {
//     const params = new URLSearchParams();
//     if (region) params.append('region', region);
    
//     const response = await fetch(`${this.apiBase}/cities?${params}`);
//     const data = await response.json();
//     return data.data || [];
//   }

//   async getStats() {
//     // Version mise en cache des stats
//     const cached = this.getFromCache('stats');
//     if (cached) return cached;
    
//     const response = await fetch(`${this.apiBase}/stats`);
//     const data = await response.json();
    
//     if (data.success) {
//       this.saveToCache('stats', data.data);
//     }
    
//     return data.data || {};
//   }

//   async getPharmacyDetails(id) {
//     const response = await fetch(`${this.apiBase}/pharmacies/${id}`);
//     const data = await response.json();
//     return data.data || null;
//   }

//   async trackClick(pharmacyId) {
//     // Tracking anonyme pour améliorer les stats
//     await fetch(`${this.apiBase}/pharmacies`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ pharmacie_id: pharmacyId, action: 'click' })
//     });
//   }

//   // Utilitaires existants (inchangés)
//   formatPhoneNumber(phone) { /* ... */ }
//   getCallablePhone(phone) { /* ... */ }
//   getGoogleMapsUrl(pharmacy) { /* ... */ }
// }


































































































































































































































































// src/lib/gardeService.js - Version avec API Turso
import { EMERGENCY_NUMBERS } from './regions';

class GardeService {
  constructor() {
    this.cacheKey = 'pharmacam_gardes_cache';
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    this.apiBase = '/api';
  }

  // Récupérer toutes les pharmacies avec filtres
  async search(options = {}) {
    const params = new URLSearchParams();
    
    if (options.query) params.append('query', options.query);
    if (options.region && options.region !== 'all') params.append('region', options.region);
    if (options.ville && options.ville !== 'all') params.append('ville', options.ville);
    if (options.enGarde) params.append('en_garde', 'true');
    if (options.hasPhone) params.append('avec_tel', 'true');
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sort_by', options.sortBy);
    
    // Vérifier le cache
    const cacheKey = `search_${params.toString()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await fetch(`${this.apiBase}/pharmacies?${params}`);
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error);
      
      // Enrichir les données
      const enrichedData = {
        results: data.data.map(p => this.enrichPharmacy(p)),
        total: data.pagination.total,
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        limit: data.pagination.limit,
        lastUpdate: new Date().toISOString()
      };
      
      // Mettre en cache
      this.saveToCache(cacheKey, enrichedData);
      
      return enrichedData;
      
    } catch (error) {
      console.error('Search error:', error);
      return { results: [], total: 0, error: error.message };
    }
  }

  // Enrichir une pharmacie avec des données calculées
  enrichPharmacy(pharmacy) {
    return {
      ...pharmacy,
      coordinates: {
        lat: pharmacy.latitude,
        lng: pharmacy.longitude
      },
      services: pharmacy.services ? JSON.parse(pharmacy.services) : [],
      isOpenNow: this.checkIfOpenNow(pharmacy),
      phoneFormatted: this.formatPhoneNumber(pharmacy.tel),
      callablePhone: this.getCallablePhone(pharmacy.tel),
      mapsUrl: this.getGoogleMapsUrl(pharmacy),
      directionsUrl: this.getGoogleDirectionsUrl(pharmacy)
    };
  }

  // Récupérer les détails d'une pharmacie
  async getPharmacyDetails(id) {
    const cached = this.getFromCache(`pharmacy_${id}`);
    if (cached) return cached;
    
    try {
      const response = await fetch(`${this.apiBase}/pharmacies/${id}`);
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error);
      
      const enriched = this.enrichPharmacy(data.data);
      this.saveToCache(`pharmacy_${id}`, enriched);
      
      return enriched;
      
    } catch (error) {
      console.error('Get pharmacy details error:', error);
      return null;
    }
  }

  // Récupérer les villes disponibles
  async getCities(region = null) {
    const cacheKey = `cities_${region || 'all'}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    try {
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      
      const response = await fetch(`${this.apiBase}/villes?${params}`);
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error);
      
      this.saveToCache(cacheKey, data.data);
      return data.data;
      
    } catch (error) {
      console.error('Get cities error:', error);
      return [];
    }
  }

  // Récupérer les statistiques
  async getStats() {
    const cached = this.getFromCache('stats');
    if (cached) return cached;
    
    try {
      const response = await fetch(`${this.apiBase}/stats`);
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error);
      
      this.saveToCache('stats', data.data);
      return data.data;
      
    } catch (error) {
      console.error('Get stats error:', error);
      return {
        total: 0,
        avecTel: 0,
        enGarde: 0,
        parRegion: [],
        topVilles: []
      };
    }
  }

  // Récupérer les régions disponibles
  getRegions() {
    return ['Centre', 'Littoral', 'Ouest', 'Adamaoua', 'Nord', 
            'Extrême-Nord', 'Sud', 'Est', 'Nord-Ouest', 'Sud-Ouest'];
  }

  // Recherche par géolocalisation
  async searchNearby(lat, lng, maxDistance = 50, limit = 10) {
    try {
      // Note: Cette fonctionnalité nécessiterait une extension de l'API
      // Pour l'instant, on récupère toutes les pharmacies et on calcule la distance
      const response = await fetch(`${this.apiBase}/pharmacies?limit=500`);
      const data = await response.json();
      
      if (!data.success) throw new Error(data.error);
      
      const pharmacies = data.data.map(p => this.enrichPharmacy(p));
      
      // Calculer les distances
      const withDistance = pharmacies.map(p => ({
        ...p,
        distance: this.calculateDistance(
          lat, lng,
          p.latitude, p.longitude
        )
      }));
      
      // Filtrer et trier
      const nearby = withDistance
        .filter(p => p.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
      
      return {
        results: nearby,
        total: nearby.length,
        userLocation: { lat, lng }
      };
      
    } catch (error) {
      console.error('Search nearby error:', error);
      return { results: [], total: 0 };
    }
  }

  // Vérifier si une pharmacie est ouverte maintenant
  checkIfOpenNow(pharmacy) {
    const now = new Date();
    const hours = now.getHours();
    
    if (pharmacy.en_garde) {
      return hours >= 20 || hours < 8;
    }
    
    return false;
  }

  // Formater le numéro de téléphone
  formatPhoneNumber(phone) {
    if (!phone || phone === 'Non listé') return null;
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    
    return phone;
  }

  // Obtenir le numéro appelable
  getCallablePhone(phone) {
    if (!phone || phone === 'Non listé') return null;
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `+237${cleaned.slice(-9)}`;
    }
    
    return phone;
  }

  // URLs Google Maps
  getGoogleMapsUrl(pharmacy) {
    if (!pharmacy.latitude || !pharmacy.longitude) return null;
    return `https://www.google.com/maps?q=${pharmacy.latitude},${pharmacy.longitude}`;
  }

  getGoogleDirectionsUrl(pharmacy) {
    if (!pharmacy.latitude || !pharmacy.longitude) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
  }

  // Calculer la distance entre deux points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Gestion du cache
  getFromCache(key) {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(`${this.cacheKey}_${key}`);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      
      if (Date.now() - timestamp < this.cacheDuration) {
        return data;
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    
    return null;
  }

  saveToCache(key, data) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`${this.cacheKey}_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  // Fallback en cas d'erreur
  getFallbackData() {
    return {
      results: [],
      total: 0,
      lastUpdate: new Date().toISOString()
    };
  }

  // Contacts d'urgence
  getEmergencyContacts() {
    return EMERGENCY_NUMBERS;
  }

  // Track un clic (pour les stats)
  async trackClick(pharmacyId) {
    try {
      await fetch(`${this.apiBase}/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pharmacie_id: pharmacyId, action: 'click' })
      });
    } catch (error) {
      console.warn('Track click error:', error);
    }
  }
}

// Export singleton
export const gardeService = new GardeService();
export default gardeService;