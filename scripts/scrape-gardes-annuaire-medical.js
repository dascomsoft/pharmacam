// // scripts/scrape-gardes-annuaire-medical.js
// import axios from 'axios';
// import * as cheerio from 'cheerio';

// export async function scrapeAnnuaireMedical() {
//   console.log('📡 Scraping Annuaire Médical - TOUTES LES VILLES ET PHARMACIES');
//   console.log('='.repeat(60));
  
//   const pharmacies = [];
  
//   // Liste des régions avec leurs URLs principales
//   const regions = {
//     'Centre': 'centre',
//     'Littoral': 'littoral',
//     'Ouest': 'ouest',
//     'Nord-Ouest': 'nord-ouest',
//     'Sud-Ouest': 'sud-ouest',
//     'Adamaoua': 'adamaoua',
//     'Est': 'est',
//     'Extrême-Nord': 'extreme-nord',
//     'Nord': 'nord',
//     'Sud': 'sud'
//   };

//   // Fonction pour nettoyer le nom de la pharmacie
//   const cleanPharmacyName = (text) => {
//     if (!text) return 'Pharmacie';
    
//     // Enlever les numéros de téléphone
//     let clean = text.replace(/\d{2,3}[\s-]?\d{2,3}[\s-]?\d{2,3}[\s-]?\d{2,3}/g, '');
    
//     // Enlever les adresses courantes
//     clean = clean.replace(/yaoundé|douala|bafoussam|bamenda|buea|ngaoundéré|bertoua|maroua|garoua|ebolowa|:|\|/gi, '');
    
//     // Enlever les mots courants
//     clean = clean.replace(/face|carrefour|route|rue|avenue|quartier|non précisé|non listé/gi, '');
    
//     // Nettoyer les espaces multiples
//     clean = clean.replace(/\s+/g, ' ').trim();
    
//     // Si le nom est trop court, garder l'original tronqué
//     if (clean.length < 5) {
//       return text.substring(0, 50).trim();
//     }
    
//     return clean.substring(0, 80);
//   };

//   // Fonction pour extraire le téléphone
//   const extractPhone = (text) => {
//     // Patterns pour les numéros camerounais (6, 2, 9 au début)
//     const patterns = [
//       /(6[5-9]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/,  // 6xxxxxxx
//       /(2[2-3]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/,  // 22xxxxxx, 23xxxxxx
//       /(9[7-8]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/   // 97xxxxxx, 98xxxxxx
//     ];
    
//     for (const pattern of patterns) {
//       const match = text.match(pattern);
//       if (match) {
//         return match[0].replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
//       }
//     }
    
//     // Fallback: chercher n'importe quelle suite de 9 chiffres
//     const fallbackMatch = text.match(/(\d{3}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})/);
//     if (fallbackMatch) {
//       return fallbackMatch[0].replace(/\D/g, '').replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
//     }
    
//     return 'Non listé';
//   };

//   // Fonction pour extraire les villes d'une page de région
//   const extractCitiesFromRegion = ($, baseUrl, regionSlug) => {
//     const cities = [];
    
//     // Chercher les liens vers les villes dans la navigation
//     $('a[href*="pharmacies-de-garde"]').each((i, el) => {
//       const href = $(el).attr('href');
//       const text = $(el).text().trim();
      
//       if (href && href.includes(regionSlug) && href.includes('pharmacies-de-garde-')) {
//         // Extraire le nom de la ville depuis le lien
//         let cityName = text;
//         if (cityName.length < 3) {
//           // Si le texte est trop court, essayer d'extraire depuis l'URL
//           cityName = href.split('pharmacies-de-garde-').pop().replace(/-/g, ' ');
//         }
        
//         // Capitaliser la première lettre
//         cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        
//         // Construire l'URL complète
//         const cityUrl = href.startsWith('http') ? href : `https://www.annuaire-medical.cm${href}`;
        
//         if (!cities.find(c => c.name === cityName)) {
//           cities.push({
//             name: cityName,
//             url: cityUrl
//           });
//         }
//       }
//     });
    
//     return cities;
//   };

//   // Fonction pour scraper une ville spécifique
//   const scrapeCity = async (city, regionName) => {
//     const cityPharmacies = [];
    
//     try {
//       console.log(`    🔍 Ville: ${city.name} (${city.url})`);
      
//       const { data } = await axios.get(city.url, {
//         timeout: 15000,
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//           'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
//         }
//       });
      
//       const $ = cheerio.load(data);
      
//       // Chercher les pharmacies dans différents sélecteurs
//       const selectors = [
//         '.views-row',
//         '.pharmacy-item',
//         '.listing-item',
//         '.node-pharmacy',
//         '.views-field-title',
//         '.views-field'
//       ];
      
//       let items = [];
//       for (const selector of selectors) {
//         items = $(selector);
//         if (items.length > 0) {
//           console.log(`      📊 ${items.length} éléments trouvés`);
//           break;
//         }
//       }
      
//       if (items.length > 0) {
//         // Traiter les éléments structurés
//         items.each((i, el) => {
//           const $el = $(el);
//           const text = $el.text().trim();
          
//           // Vérifier que c'est bien une pharmacie
//           if (text.toLowerCase().includes('pharmacie')) {
            
//             // Extraire le nom
//             let nom = $el.find('h3, h2, .title, a').first().text().trim();
//             if (!nom || nom.length < 5) {
//               nom = text.split('\n')[0].trim();
//             }
            
//             // Extraire le téléphone
//             const tel = extractPhone(text);
            
//             cityPharmacies.push({
//               id: `ph_annuaire_${regionName.toLowerCase()}_${city.name.toLowerCase()}_${i}_${Date.now()}`,
//               nom: cleanPharmacyName(nom),
//               adresse: text.substring(0, 150),
//               quartier: 'Non précisé',
//               ville: city.name,
//               region: regionName,
//               tel: tel,
//               en_garde: true,
//               horaires: '20h00 - 08h00',
//               services: ['Urgences', 'Médicaments', 'Conseil pharmaceutique'],
//               note: (3.5 + Math.random() * 1.5).toFixed(1),
//               coordinates: getApproxCoordinates(city.name),
//               source: 'Annuaire-Médical',
//               source_url: city.url,
//               scraped_at: new Date().toISOString()
//             });
//           }
//         });
//       } else {
//         // Fallback: chercher dans le texte
//         const bodyText = $('body').text();
//         const lines = bodyText.split('\n')
//           .map(line => line.trim())
//           .filter(line => line.toLowerCase().includes('pharmacie') && line.length > 15);
        
//         lines.forEach((line, i) => {
//           const tel = extractPhone(line);
          
//           cityPharmacies.push({
//             id: `ph_annuaire_${regionName.toLowerCase()}_${city.name.toLowerCase()}_fallback_${i}_${Date.now()}`,
//             nom: cleanPharmacyName(line.substring(0, 80)),
//             adresse: line.substring(0, 150),
//             quartier: 'Non précisé',
//             ville: city.name,
//             region: regionName,
//             tel: tel,
//             en_garde: true,
//             horaires: '20h00 - 08h00',
//             services: ['Urgences', 'Médicaments', 'Conseil pharmaceutique'],
//             note: (3.5 + Math.random() * 1.5).toFixed(1),
//             coordinates: getApproxCoordinates(city.name),
//             source: 'Annuaire-Médical',
//             source_url: city.url,
//             scraped_at: new Date().toISOString()
//           });
//         });
//       }
      
//       console.log(`      ✅ ${cityPharmacies.length} pharmacies trouvées à ${city.name}`);
      
//     } catch (error) {
//       console.log(`      ❌ Erreur pour ${city.name}: ${error.message}`);
//     }
    
//     return cityPharmacies;
//   };

//   try {
//     // Parcourir chaque région
//     for (const [regionName, regionSlug] of Object.entries(regions)) {
//       console.log(`\n📍 RÉGION: ${regionName}`);
      
//       // URL principale de la région
//       const regionUrl = `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}`;
      
//       try {
//         // Récupérer la page de la région pour trouver les villes
//         console.log(`   🌐 Page région: ${regionUrl}`);
        
//         const { data: regionData } = await axios.get(regionUrl, {
//           timeout: 15000,
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
//           }
//         });
        
//         const $region = cheerio.load(regionData);
        
//         // Extraire la liste des villes
//         let cities = extractCitiesFromRegion($region, regionUrl, regionSlug);
        
//         // Si aucune ville trouvée, ajouter la ville principale par défaut
//         if (cities.length === 0) {
//           const defaultCity = getVilleForRegion(regionName);
//           cities = [{
//             name: defaultCity,
//             url: `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}/pharmacies-de-garde-${defaultCity.toLowerCase()}`
//           }];
//           console.log(`   ⚠️ Aucune ville détectée, utilisation de ${defaultCity} par défaut`);
//         } else {
//           console.log(`   🏙️ Villes trouvées: ${cities.map(c => c.name).join(', ')}`);
//         }
        
//         // Scraper chaque ville
//         for (const city of cities) {
//           const cityPharmacies = await scrapeCity(city, regionName);
//           pharmacies.push(...cityPharmacies);
          
//           // Pause entre les villes
//           await new Promise(resolve => setTimeout(resolve, 1500));
//         }
        
//       } catch (regionError) {
//         console.log(`   ❌ Erreur région ${regionName}: ${regionError.message}`);
        
//         // Fallback: utiliser la ville principale
//         const defaultCity = getVilleForRegion(regionName);
//         const defaultCityObj = {
//           name: defaultCity,
//           url: `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}/pharmacies-de-garde-${defaultCity.toLowerCase()}`
//         };
        
//         console.log(`   ⚠️ Fallback: scraping ${defaultCity} uniquement`);
//         const cityPharmacies = await scrapeCity(defaultCityObj, regionName);
//         pharmacies.push(...cityPharmacies);
//       }
      
//       // Pause entre les régions
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     }
    
//     console.log('\n' + '='.repeat(60));
//     console.log(`🎉 SCRAPING TERMINÉ - TOTAL: ${pharmacies.length} pharmacies trouvées`);
//     console.log('='.repeat(60));
    
//     return { 
//       pharmacies, 
//       periode: `Garde du ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` 
//     };
    
//   } catch (error) {
//     console.error('❌ Erreur globale:', error.message);
//     return { pharmacies: [], periode: "" };
//   }
// }

// function getVilleForRegion(region) {
//   const villes = {
//     'Centre': 'Yaoundé',
//     'Littoral': 'Douala',
//     'Ouest': 'Bafoussam',
//     'Nord-Ouest': 'Bamenda',
//     'Sud-Ouest': 'Buea',
//     'Adamaoua': 'Ngaoundéré',
//     'Est': 'Bertoua',
//     'Extrême-Nord': 'Maroua',
//     'Nord': 'Garoua',
//     'Sud': 'Ebolowa'
//   };
//   return villes[region] || region;
// }

// function getApproxCoordinates(ville) {
//   const coords = {
//     'Yaoundé': { lat: 3.8480, lng: 11.5021 },
//     'Douala': { lat: 4.0511, lng: 9.7679 },
//     'Bafoussam': { lat: 5.4778, lng: 10.4176 },
//     'Bamenda': { lat: 5.9630, lng: 10.1591 },
//     'Ngaoundéré': { lat: 7.3169, lng: 13.5833 },
//     'Garoua': { lat: 9.3077, lng: 13.3988 },
//     'Maroua': { lat: 10.5953, lng: 14.3247 },
//     'Bertoua': { lat: 4.5792, lng: 13.6769 },
//     'Ebolowa': { lat: 2.9000, lng: 11.1500 },
//     'Buea': { lat: 4.1550, lng: 9.2430 },
//     'Mbalmayo': { lat: 3.5167, lng: 11.5167 },
//     'Obala': { lat: 4.1667, lng: 11.5333 },
//     'Kribi': { lat: 2.9333, lng: 9.9167 },
//     'Edéa': { lat: 3.8000, lng: 10.1333 },
//     'Nkongsamba': { lat: 4.9500, lng: 9.9333 },
//     'Mbouda': { lat: 5.6333, lng: 10.2500 },
//     'Foumban': { lat: 5.7167, lng: 10.9167 },
//     'Kumbo': { lat: 6.2000, lng: 10.6667 },
//     'Limbe': { lat: 4.0167, lng: 9.2167 },
//     'Tiko': { lat: 4.0833, lng: 9.3667 }
//   };
//   const base = coords[ville] || coords['Yaoundé'];
//   return {
//     lat: base.lat + (Math.random() * 0.02 - 0.01),
//     lng: base.lng + (Math.random() * 0.02 - 0.01)
//   };
// }









































































































// scripts/scrape-gardes-annuaire-medical.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import fs from 'fs';

// ============================================
// CONFIGURATION
// ============================================

const REGIONS_VILLES = {
  'adamaoua': ['banyo', 'ngaoundere'],
  'centre': ['bafia', 'mbalmayo', 'mbandjock', 'mbankomo', 'obala', 'sa-a', 'yaounde'],
  'est': ['abong-mbang', 'batouri', 'bertoua', 'garoua-boulai'],
  'extreme-nord': ['kousseri', 'maga', 'maroua', 'yagoua'],
  'littoral': ['douala', 'edea', 'loum', 'mbanga', 'melong', 'nkongsamba'],
  'nord': ['figuil', 'garoua', 'guider', 'touboro'],
  'nord-ouest': ['bamenda', 'mbengwy'],
  'ouest': ['bafang', 'bafoussam', 'bagangte', 'dschang', 'foumban', 'foumbot', 'mbouda'],
  'sud': ['ebolowa', 'kribi', 'sangmelima'],
  'sud-ouest': ['buea', 'kumba', 'likomba', 'limbe', 'mutengene', 'muyuka']
};

const REGION_NAMES = {
  'adamaoua': 'Adamaoua',
  'centre': 'Centre',
  'est': 'Est',
  'extreme-nord': 'Extrême-Nord',
  'littoral': 'Littoral',
  'nord': 'Nord',
  'nord-ouest': 'Nord-Ouest',
  'ouest': 'Ouest',
  'sud': 'Sud',
  'sud-ouest': 'Sud-Ouest'
};

// ============================================
// ID GÉNÉRATION (stable, résistant collisions)
// ============================================

function generateId(nom, villeSlug, adresse = '') {
  return crypto
    .createHash('md5')
    .update(`${nom}|${villeSlug}|${adresse}`.toLowerCase().trim())
    .digest('hex');
}

// ============================================
// FORMATAGE TÉLÉPHONE (100% Cameroun)
// ============================================

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 9) {
    return digits.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  if (digits.length === 12 && digits.startsWith('237')) {
    const local = digits.slice(3);
    return local.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  return phone;
}

// ============================================
// COORDONNÉES
// ============================================

function getCoordinates(villeSlug) {
  const coords = {
    'yaounde': { lat: 3.8480, lng: 11.5021 },
    'douala': { lat: 4.0511, lng: 9.7679 },
    'bafoussam': { lat: 5.4778, lng: 10.4176 },
    'bamenda': { lat: 5.9630, lng: 10.1591 },
    'buea': { lat: 4.1550, lng: 9.2430 },
    'ngaoundere': { lat: 7.3169, lng: 13.5833 },
    'garoua': { lat: 9.3077, lng: 13.3988 },
    'maroua': { lat: 10.5953, lng: 14.3247 },
    'bertoua': { lat: 4.5792, lng: 13.6769 },
    'ebolowa': { lat: 2.9000, lng: 11.1500 },
    'bafia': { lat: 4.6333, lng: 11.2333 },
    'obala': { lat: 4.1667, lng: 11.5333 },
    'mbalmayo': { lat: 3.5167, lng: 11.5167 },
    'mbandjock': { lat: 4.4500, lng: 11.9000 },
    'mbankomo': { lat: 3.7833, lng: 11.3833 },
    'sa-a': { lat: 4.1667, lng: 11.5333 },
    'edea': { lat: 3.8000, lng: 10.1333 },
    'loum': { lat: 4.7167, lng: 9.7333 },
    'mbanga': { lat: 4.5000, lng: 9.5667 },
    'melong': { lat: 5.1167, lng: 9.9500 },
    'nkongsamba': { lat: 4.9500, lng: 9.9333 },
    'figuil': { lat: 9.7667, lng: 13.9500 },
    'guider': { lat: 9.9333, lng: 13.9500 },
    'touboro': { lat: 7.7667, lng: 15.3667 },
    'kousseri': { lat: 12.0833, lng: 15.0333 },
    'maga': { lat: 10.5167, lng: 14.9333 },
    'yagoua': { lat: 10.3333, lng: 15.2333 },
    'abong-mbang': { lat: 3.9833, lng: 13.1667 },
    'batouri': { lat: 4.4333, lng: 14.3667 },
    'garoua-boulai': { lat: 5.8833, lng: 14.5500 },
    'bafang': { lat: 5.1667, lng: 10.1833 },
    'bagangte': { lat: 5.1333, lng: 10.5167 },
    'dschang': { lat: 5.4500, lng: 10.0667 },
    'foumban': { lat: 5.7167, lng: 10.9167 },
    'foumbot': { lat: 5.5167, lng: 10.6333 },
    'mbouda': { lat: 5.6333, lng: 10.2500 },
    'kribi': { lat: 2.9333, lng: 9.9167 },
    'sangmelima': { lat: 2.9333, lng: 11.9833 },
    'kumba': { lat: 4.6333, lng: 9.4500 },
    'likomba': { lat: 4.0833, lng: 9.2500 },
    'limbe': { lat: 4.0167, lng: 9.2167 },
    'mutengene': { lat: 4.0833, lng: 9.3167 },
    'muyuka': { lat: 4.2833, lng: 9.4000 },
    'mbengwy': { lat: 6.0167, lng: 10.2500 }
  };
  return coords[villeSlug] || { lat: 5.0, lng: 12.0 };
}

// ============================================
// EXTRACTION
// ============================================

function extractPharmacies(html, regionSlug, regionName, villeSlug, url) {
  const $ = cheerio.load(html);
  const pharmacies = [];

  const villeNom = villeSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  const bodyText = $('body').text();

  const periodeMatch = bodyText.match(/Pharmacies de garde du .*? au .*? 8h00/i);
  const periode = periodeMatch
    ? periodeMatch[0]
    : 'Garde 24h (8h00 - 8h00)';

  const lines = bodyText
    .split(/\n|\r\n|\r/)
    .map(l => l.trim())
    .filter(l => l.length > 8);

  let current = null;

  for (const line of lines) {
    // ✅ Détection pharmacie plus fiable (début de ligne)
    const isPharmacy =
      /^(pharmacie|phcie)\b/i.test(line) &&
      !/pharmacies de garde/i.test(line) &&
      line.length < 130;
    
    if (isPharmacy) {
      if (current && current.nom) pharmacies.push(current);

      current = {
        nom: line.replace(/^PHARMACIE\s+/i, 'PHARMACIE ').replace(/\s+/g, ' ').trim(),
        tel: [],
        adresse: ''
      };
      continue;
    }

    if (!current) continue;

    // ✅ Téléphones avec formatage correct
    const phones = line.match(/(\+237)?\s?[2369]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/g);
    if (phones) {
      current.tel.push(...phones.map(formatPhone));
    }

    // ✅ Adresse avec limite de taille
    if (
      line.includes(villeNom) ||
      /face|quartier|montée|carrefour|boulevard|route|mobil|oil|lybia|immeuble|derrière|entrée/i.test(line)
    ) {
      if (current.adresse.length < 120) {
        current.adresse += ' ' + line.trim();
      }
    }
  }

  if (current && current.nom) pharmacies.push(current);

  return pharmacies.map((ph, i) => ({
    id: generateId(ph.nom, villeSlug, ph.adresse),
    nom: ph.nom,
    adresse: ph.adresse.trim() || 'Adresse non précisée',
    quartier: ph.adresse.trim() || 'Non précisé',
    ville: villeNom,
    region: regionName,
    tel: ph.tel.length ? [...new Set(ph.tel)].join(' / ') : 'Non listé',
    en_garde: true,
    horaires: periode,
    services: ['Urgences', 'Médicaments', 'Conseil pharmaceutique'],
    note: (3.5 + Math.random() * 1.5).toFixed(1),
    coordinates: getCoordinates(villeSlug),
    source: 'Annuaire-Médical',
    source_url: url,
    scraped_at: new Date().toISOString()
  }));
}

// ============================================
// SCRAPING PRINCIPAL
// ============================================

export async function scrapeAnnuaireMedical() {
  console.log('📡 Scraping Annuaire Médical (ULTIME PRO)...');

  const allPharmacies = [];

  for (const [regionSlug, villes] of Object.entries(REGIONS_VILLES)) {
    const regionName = REGION_NAMES[regionSlug];

    for (const villeSlug of villes) {
      const url = `https://www.annuaire-medical.cm/fr/pharmacies-de-garde/${regionSlug}/pharmacies-de-garde-${villeSlug}`;

      console.log(`📍 ${regionName} → ${villeSlug}`);

      try {
        const { data } = await axios.get(url, {
          timeout: 15000,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml'
          }
        });

        const pharmaciesVille = extractPharmacies(
          data,
          regionSlug,
          regionName,
          villeSlug,
          url
        );

        if (pharmaciesVille.length === 0) {
          console.log(`   ⚠️ Aucune pharmacie détectée`);
          if (process.env.DEBUG === 'true') {
            fs.writeFileSync(`debug-${regionSlug}-${villeSlug}.html`, data);
          }
        }

        console.log(`   ✅ ${pharmaciesVille.length} pharmacies`);
        allPharmacies.push(...pharmaciesVille);

        await new Promise(r => setTimeout(r, 1500));

      } catch (error) {
        console.log(`   ❌ ${error.message}`);
      }
    }
  }

  // ✅ Déduplication finale (par sécurité)
  const unique = new Map();
  for (const ph of allPharmacies) {
    if (!unique.has(ph.id)) {
      unique.set(ph.id, ph);
    }
  }

  const finalList = Array.from(unique.values());

  console.log(`\n🎉 TOTAL → ${finalList.length} pharmacies (${allPharmacies.length} avant déduplication)`);

  return {
    pharmacies: finalList,
    periode: `Garde du ${new Date().toLocaleDateString('fr-FR')}`
  };
}