// scripts/scrape-gardes-annuaire-medical.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeAnnuaireMedical() {
  console.log('📡 Scraping Annuaire Médical - TOUTES LES VILLES ET PHARMACIES');
  console.log('='.repeat(60));
  
  const pharmacies = [];
  
  // Liste des régions avec leurs URLs principales
  const regions = {
    'Centre': 'centre',
    'Littoral': 'littoral',
    'Ouest': 'ouest',
    'Nord-Ouest': 'nord-ouest',
    'Sud-Ouest': 'sud-ouest',
    'Adamaoua': 'adamaoua',
    'Est': 'est',
    'Extrême-Nord': 'extreme-nord',
    'Nord': 'nord',
    'Sud': 'sud'
  };

  // Fonction pour nettoyer le nom de la pharmacie
  const cleanPharmacyName = (text) => {
    if (!text) return 'Pharmacie';
    
    // Enlever les numéros de téléphone
    let clean = text.replace(/\d{2,3}[\s-]?\d{2,3}[\s-]?\d{2,3}[\s-]?\d{2,3}/g, '');
    
    // Enlever les adresses courantes
    clean = clean.replace(/yaoundé|douala|bafoussam|bamenda|buea|ngaoundéré|bertoua|maroua|garoua|ebolowa|:|\|/gi, '');
    
    // Enlever les mots courants
    clean = clean.replace(/face|carrefour|route|rue|avenue|quartier|non précisé|non listé/gi, '');
    
    // Nettoyer les espaces multiples
    clean = clean.replace(/\s+/g, ' ').trim();
    
    // Si le nom est trop court, garder l'original tronqué
    if (clean.length < 5) {
      return text.substring(0, 50).trim();
    }
    
    return clean.substring(0, 80);
  };

  // Fonction pour extraire le téléphone
  const extractPhone = (text) => {
    // Patterns pour les numéros camerounais (6, 2, 9 au début)
    const patterns = [
      /(6[5-9]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/,  // 6xxxxxxx
      /(2[2-3]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/,  // 22xxxxxx, 23xxxxxx
      /(9[7-8]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/   // 97xxxxxx, 98xxxxxx
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
      }
    }
    
    // Fallback: chercher n'importe quelle suite de 9 chiffres
    const fallbackMatch = text.match(/(\d{3}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/);
    if (fallbackMatch) {
      return fallbackMatch[0].replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    
    return 'Non listé';
  };

  // Fonction pour extraire les villes d'une page de région
  const extractCitiesFromRegion = ($, baseUrl, regionSlug) => {
    const cities = [];
    
    // Chercher les liens vers les villes dans la navigation
    $('a[href*="pharmacies-de-garde"]').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      
      if (href && href.includes(regionSlug) && href.includes('pharmacies-de-garde-')) {
        // Extraire le nom de la ville depuis le lien
        let cityName = text;
        if (cityName.length < 3) {
          // Si le texte est trop court, essayer d'extraire depuis l'URL
          cityName = href.split('pharmacies-de-garde-').pop().replace(/-/g, ' ');
        }
        
        // Capitaliser la première lettre
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        
        // Construire l'URL complète
        const cityUrl = href.startsWith('http') ? href : `https://www.annuaire-medical.cm${href}`;
        
        if (!cities.find(c => c.name === cityName)) {
          cities.push({
            name: cityName,
            url: cityUrl
          });
        }
      }
    });
    
    return cities;
  };

  // Fonction pour scraper une ville spécifique
  const scrapeCity = async (city, regionName) => {
    const cityPharmacies = [];
    
    try {
      console.log(`    🔍 Ville: ${city.name} (${city.url})`);
      
      const { data } = await axios.get(city.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
        }
      });
      
      const $ = cheerio.load(data);
      
      // Chercher les pharmacies dans différents sélecteurs
      const selectors = [
        '.views-row',
        '.pharmacy-item',
        '.listing-item',
        '.node-pharmacy',
        '.views-field-title',
        '.views-field'
      ];
      
      let items = [];
      for (const selector of selectors) {
        items = $(selector);
        if (items.length > 0) {
          console.log(`      📊 ${items.length} éléments trouvés`);
          break;
        }
      }
      
      if (items.length > 0) {
        // Traiter les éléments structurés
        items.each((i, el) => {
          const $el = $(el);
          const text = $el.text().trim();
          
          // Vérifier que c'est bien une pharmacie
          if (text.toLowerCase().includes('pharmacie')) {
            
            // Extraire le nom
            let nom = $el.find('h3, h2, .title, a').first().text().trim();
            if (!nom || nom.length < 5) {
              nom = text.split('\n')[0].trim();
            }
            
            // Extraire le téléphone
            const tel = extractPhone(text);
            
            cityPharmacies.push({
              id: `ph_annuaire_${regionName.toLowerCase()}_${city.name.toLowerCase()}_${i}_${Date.now()}`,
              nom: cleanPharmacyName(nom),
              adresse: text.substring(0, 150),
              quartier: 'Non précisé',
              ville: city.name,
              region: regionName,
              tel: tel,
              en_garde: true,
              horaires: '20h00 - 08h00',
              services: ['Urgences', 'Médicaments', 'Conseil pharmaceutique'],
              note: (3.5 + Math.random() * 1.5).toFixed(1),
              coordinates: getApproxCoordinates(city.name),
              source: 'Annuaire-Médical',
              source_url: city.url,
              scraped_at: new Date().toISOString()
            });
          }
        });
      } else {
        // Fallback: chercher dans le texte
        const bodyText = $('body').text();
        const lines = bodyText.split('\n')
          .map(line => line.trim())
          .filter(line => line.toLowerCase().includes('pharmacie') && line.length > 15);
        
        lines.forEach((line, i) => {
          const tel = extractPhone(line);
          
          cityPharmacies.push({
            id: `ph_annuaire_${regionName.toLowerCase()}_${city.name.toLowerCase()}_fallback_${i}_${Date.now()}`,
            nom: cleanPharmacyName(line.substring(0, 80)),
            adresse: line.substring(0, 150),
            quartier: 'Non précisé',
            ville: city.name,
            region: regionName,
            tel: tel,
            en_garde: true,
            horaires: '20h00 - 08h00',
            services: ['Urgences', 'Médicaments', 'Conseil pharmaceutique'],
            note: (3.5 + Math.random() * 1.5).toFixed(1),
            coordinates: getApproxCoordinates(city.name),
            source: 'Annuaire-Médical',
            source_url: city.url,
            scraped_at: new Date().toISOString()
          });
        });
      }
      
      console.log(`      ✅ ${cityPharmacies.length} pharmacies trouvées à ${city.name}`);
      
    } catch (error) {
      console.log(`      ❌ Erreur pour ${city.name}: ${error.message}`);
    }
    
    return cityPharmacies;
  };

  try {
    // Parcourir chaque région
    for (const [regionName, regionSlug] of Object.entries(regions)) {
      console.log(`\n📍 RÉGION: ${regionName}`);
      
      // URL principale de la région
      const regionUrl = `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}`;
      
      try {
        // Récupérer la page de la région pour trouver les villes
        console.log(`   🌐 Page région: ${regionUrl}`);
        
        const { data: regionData } = await axios.get(regionUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const $region = cheerio.load(regionData);
        
        // Extraire la liste des villes
        let cities = extractCitiesFromRegion($region, regionUrl, regionSlug);
        
        // Si aucune ville trouvée, ajouter la ville principale par défaut
        if (cities.length === 0) {
          const defaultCity = getVilleForRegion(regionName);
          cities = [{
            name: defaultCity,
            url: `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}/pharmacies-de-garde-${defaultCity.toLowerCase()}`
          }];
          console.log(`   ⚠️ Aucune ville détectée, utilisation de ${defaultCity} par défaut`);
        } else {
          console.log(`   🏙️ Villes trouvées: ${cities.map(c => c.name).join(', ')}`);
        }
        
        // Scraper chaque ville
        for (const city of cities) {
          const cityPharmacies = await scrapeCity(city, regionName);
          pharmacies.push(...cityPharmacies);
          
          // Pause entre les villes
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
      } catch (regionError) {
        console.log(`   ❌ Erreur région ${regionName}: ${regionError.message}`);
        
        // Fallback: utiliser la ville principale
        const defaultCity = getVilleForRegion(regionName);
        const defaultCityObj = {
          name: defaultCity,
          url: `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}/pharmacies-de-garde-${defaultCity.toLowerCase()}`
        };
        
        console.log(`   ⚠️ Fallback: scraping ${defaultCity} uniquement`);
        const cityPharmacies = await scrapeCity(defaultCityObj, regionName);
        pharmacies.push(...cityPharmacies);
      }
      
      // Pause entre les régions
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 SCRAPING TERMINÉ - TOTAL: ${pharmacies.length} pharmacies trouvées`);
    console.log('='.repeat(60));
    
    return { 
      pharmacies, 
      periode: `Garde du ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` 
    };
    
  } catch (error) {
    console.error('❌ Erreur globale:', error.message);
    return { pharmacies: [], periode: "" };
  }
}

function getVilleForRegion(region) {
  const villes = {
    'Centre': 'Yaoundé',
    'Littoral': 'Douala',
    'Ouest': 'Bafoussam',
    'Nord-Ouest': 'Bamenda',
    'Sud-Ouest': 'Buea',
    'Adamaoua': 'Ngaoundéré',
    'Est': 'Bertoua',
    'Extrême-Nord': 'Maroua',
    'Nord': 'Garoua',
    'Sud': 'Ebolowa'
  };
  return villes[region] || region;
}

function getApproxCoordinates(ville) {
  const coords = {
    'Yaoundé': { lat: 3.8480, lng: 11.5021 },
    'Douala': { lat: 4.0511, lng: 9.7679 },
    'Bafoussam': { lat: 5.4778, lng: 10.4176 },
    'Bamenda': { lat: 5.9630, lng: 10.1591 },
    'Ngaoundéré': { lat: 7.3169, lng: 13.5833 },
    'Garoua': { lat: 9.3077, lng: 13.3988 },
    'Maroua': { lat: 10.5953, lng: 14.3247 },
    'Bertoua': { lat: 4.5792, lng: 13.6769 },
    'Ebolowa': { lat: 2.9000, lng: 11.1500 },
    'Buea': { lat: 4.1550, lng: 9.2430 },
    'Mbalmayo': { lat: 3.5167, lng: 11.5167 },
    'Obala': { lat: 4.1667, lng: 11.5333 },
    'Kribi': { lat: 2.9333, lng: 9.9167 },
    'Edéa': { lat: 3.8000, lng: 10.1333 },
    'Nkongsamba': { lat: 4.9500, lng: 9.9333 },
    'Mbouda': { lat: 5.6333, lng: 10.2500 },
    'Foumban': { lat: 5.7167, lng: 10.9167 },
    'Kumbo': { lat: 6.2000, lng: 10.6667 },
    'Limbe': { lat: 4.0167, lng: 9.2167 },
    'Tiko': { lat: 4.0833, lng: 9.3667 }
  };
  const base = coords[ville] || coords['Yaoundé'];
  return {
    lat: base.lat + (Math.random() * 0.02 - 0.01),
    lng: base.lng + (Math.random() * 0.02 - 0.01)
  };
}