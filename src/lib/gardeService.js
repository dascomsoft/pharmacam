// src/lib/gardeService.js
import { EMERGENCY_NUMBERS } from './regions';

class GardeService {
  constructor() {
    this.cacheKey = 'pharmacam_gardes_cache';
    this.cacheDuration = 2 * 60 * 60 * 1000; // 2 heures
  }

  async loadGardesData() {
    // Vérifier le cache
    const cached = this.getFromCache();
    if (cached) return cached;

    try {
      // Charger depuis l'API
      const response = await fetch('/data/gardes_du_jour.json', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) throw new Error('Données non disponibles');

      const data = await response.json();
      
      // Enrichir les données
      const enrichedData = this.enrichData(data);
      
      // Mettre en cache
      this.saveToCache(enrichedData);
      
      return enrichedData;
    } catch (error) {
      console.error('Erreur chargement données:', error);
      return this.getFallbackData();
    }
  }

  enrichData(data) {
    if (!data.pharmacies) return data;

    const pharmacies = data.pharmacies.map(pharmacy => {
      // Ajouter des métadonnées
      return {
        ...pharmacy,
        // Assurer que coordinates existe
        coordinates: pharmacy.coordinates || {
          lat: getCityLat(pharmacy.ville),
          lng: getCityLng(pharmacy.ville)
        },
        // Services par défaut
        services: pharmacy.services || [
          'Garde nocturne',
          'Urgences',
          'Conseil pharmaceutique',
          'Médicaments essentiels'
        ],
        // Note par défaut
        note: pharmacy.note || (3.5 + Math.random() * 1.5).toFixed(1),
        // Horaires
        horaires: pharmacy.horaires || {
          garde: "20h00 - 08h00",
          standard: "08h00 - 20h00"
        },
        // Vérifier si ouvert maintenant
        isOpenNow: this.checkIfOpenNow(pharmacy)
      };
    });

    return {
      ...data,
      pharmacies,
      // Statistiques
      stats: {
        total: pharmacies.length,
        byRegion: this.groupByRegion(pharmacies),
        withPhone: pharmacies.filter(p => p.tel && p.tel !== 'Non listé').length,
        emergencyNumbers: EMERGENCY_NUMBERS
      }
    };
  }

  groupByRegion(pharmacies) {
    return pharmacies.reduce((acc, pharmacy) => {
      const region = pharmacy.region || 'Non spécifié';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});
  }

  checkIfOpenNow(pharmacy) {
    const now = new Date();
    const hours = now.getHours();
    
    // Si c'est une pharmacie de garde, supposer ouverte de 20h à 8h
    if (pharmacy.en_garde) {
      return hours >= 20 || hours < 8;
    }
    
    return false;
  }

  getFromCache() {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      if (Date.now() - timestamp < this.cacheDuration) {
        return data;
      }
    } catch (error) {
      console.warn('Erreur lecture cache:', error);
    }

    return null;
  }

  saveToCache(data) {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Erreur écriture cache:', error);
    }
  }

  getFallbackData() {
    return {
      scraped_at: new Date().toISOString(),
      periode: "Données locales",
      pharmacies: [],
      total: 0,
      stats: {
        total: 0,
        byRegion: {},
        withPhone: 0,
        emergencyNumbers: EMERGENCY_NUMBERS
      }
    };
  }

  async search(options = {}) {
    const data = await this.loadGardesData();
    let results = data.pharmacies || [];

    // Filtrage
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(p =>
        p.nom.toLowerCase().includes(query) ||
        p.ville.toLowerCase().includes(query) ||
        p.quartier.toLowerCase().includes(query) ||
        (p.adresse && p.adresse.toLowerCase().includes(query))
      );
    }

    if (options.region && options.region !== 'all') {
      results = results.filter(p => p.region === options.region);
    }

    if (options.ville && options.ville !== 'all') {
      results = results.filter(p => p.ville === options.ville);
    }

    if (options.garde24h) {
      results = results.filter(p => p.garde_24h === true);
    }

    if (options.openNow) {
      results = results.filter(p => p.isOpenNow === true);
    }

    // Tri
    if (options.sortBy) {
      results.sort((a, b) => {
        switch (options.sortBy) {
          case 'name':
            return a.nom.localeCompare(b.nom);
          case 'city':
            return a.ville.localeCompare(b.ville);
          case 'rating':
            return (b.note || 0) - (a.note || 0);
          case 'distance':
            if (options.userLocation && a.coordinates && b.coordinates) {
              const distA = this.calculateDistance(
                options.userLocation.lat,
                options.userLocation.lng,
                a.coordinates.lat,
                a.coordinates.lng
              );
              const distB = this.calculateDistance(
                options.userLocation.lat,
                options.userLocation.lng,
                b.coordinates.lat,
                b.coordinates.lng
              );
              return distA - distB;
            }
            return 0;
          default:
            return 0;
        }
      });
    }

    return {
      results,
      total: results.length,
      periode: data.periode,
      lastUpdate: data.scraped_at,
      stats: data.stats
    };
  }

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

  getPharmacyDetails(id) {
    return this.loadGardesData().then(data => {
      return data.pharmacies.find(p => p.id === id) || null;
    });
  }

  getRegions() {
    return ['Centre', 'Littoral', 'Ouest', 'Adamaoua', 'Nord', 'Extrême-Nord', 'Sud', 'Est', 'Nord-Ouest', 'Sud-Ouest'];
  }

  async getCities(region = null) {
    const data = await this.loadGardesData();
    const cities = new Set();
    
    data.pharmacies.forEach(p => {
      if (!region || p.region === region) {
        cities.add(p.ville);
      }
    });
    
    return Array.from(cities).sort();
  }

  getGoogleMapsUrl(pharmacy) {
    if (!pharmacy.coordinates) return null;
    
    const { lat, lng } = pharmacy.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  getGoogleDirectionsUrl(pharmacy) {
    if (!pharmacy.coordinates) return null;
    
    const { lat, lng } = pharmacy.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  formatPhoneNumber(phone) {
    if (!phone || phone === 'Non listé') return null;
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    
    return phone;
  }

  getCallablePhone(phone) {
    if (!phone || phone === 'Non listé') return null;
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `+237${cleaned}`;
    }
    
    return phone;
  }

  getEmergencyContacts() {
    return EMERGENCY_NUMBERS;
  }
}

// Fonctions utilitaires
function getCityLat(ville) {
  const lats = {
    'Yaoundé': 3.8480,
    'Douala': 4.0511,
    'Bafoussam': 5.4778,
    'Bamenda': 5.9630,
    'Ngaoundéré': 7.3169,
    'Garoua': 9.3077,
    'Maroua': 10.5953,
    'Bertoua': 4.5792,
    'Ebolowa': 2.9000,
    'Buea': 4.1550
  };
  return lats[ville] || 5.9630;
}

function getCityLng(ville) {
  const lngs = {
    'Yaoundé': 11.5021,
    'Douala': 9.7679,
    'Bafoussam': 10.4176,
    'Bamenda': 10.1591,
    'Ngaoundéré': 13.5833,
    'Garoua': 13.3988,
    'Maroua': 14.3247,
    'Bertoua': 13.6769,
    'Ebolowa': 11.1500,
    'Buea': 9.2430
  };
  return lngs[ville] || 12.3547;
}

// Export singleton
export const gardeService = new GardeService();
export default gardeService;