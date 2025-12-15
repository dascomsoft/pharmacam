// scripts/clean-gardes-data.js
const fs = require('fs');
const path = require('path');

function cleanGardesData() {
    console.log('🧹 Nettoyage des données des pharmacies de garde...');

    const rawData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../public/data/gardes_du_jour.json'), 'utf8')
    );

    // 1. Supprimer la liste redondante "pharmacies" si elle existe
    const cleanedData = {
        id: rawData.id,
        maj: rawData.maj,
        periode: rawData.periode,
        total: rawData.total,
        regions: {}
    };

    // 2. Pour chaque région, nettoyer les données
    Object.keys(rawData.regions).forEach(region => {
        if (rawData.regions[region] && rawData.regions[region].length > 0) {
            cleanedData.regions[region] = rawData.regions[region].map(pharmacy => {
                // Extraire la VRAIE ville depuis l'adresse
                const address = pharmacy.adresse || '';
                let realVille = pharmacy.ville || 'Inconnue';

                // Logique d'extraction de ville
                // if (address.includes('Mbalmayo :')) realVille = 'Mbalmayo';
                // else if (address.includes('Obala :')) realVille = 'Obala';
                // else if (address.includes('Sa\'a :') || address.includes('SA\'A')) realVille = 'Sa\'a';
                // else if (address.includes('Bafia :')) realVille = 'Bafia';
                // else if (address.includes('Mbandjock :')) realVille = 'Mbandjock';
                // else if (address.includes('Mbankomo :')) realVille = 'Mbankomo';
                // else if (address.includes('Bafoussam :')) realVille = 'Bafoussam';
                // else if (address.includes('Ngaoundéré') || address.includes('Ngaoundere')) realVille = 'Ngaoundéré';
                // else if (address.includes('Banyo :')) realVille = 'Banyo';
                // else if (address.includes('Douala :')) realVille = 'Douala';
                // else if (address.includes('Loum')) realVille = 'Loum';
                // else if (region === 'Centre' && !address.includes('Yaoundé :')) {
                //   // Si c'est le Centre mais pas Yaoundé dans l'adresse, c'est probablement Yaoundé
                //   realVille = 'Yaoundé';
                // }

                if (address.includes('Mbalmayo :')) realVille = 'Mbalmayo';
                else if (address.includes('Obala :')) realVille = 'Obala';
                else if (address.includes('Sa\'a :') || address.includes('SA\'A')) realVille = 'Sa\'a';
                else if (address.includes('Bafia :')) realVille = 'Bafia';
                else if (address.includes('Mbandjock :')) realVille = 'Mbandjock';
                else if (address.includes('Mbankomo :')) realVille = 'Mbankomo';
                else if (address.includes('Bafoussam :')) realVille = 'Bafoussam';
                else if (address.includes('Banyo :')) realVille = 'Banyo';
                // CORRECTION : Ngaoundéré seulement si c'est dans Adamaoua
                else if (region === 'Adamaoua' && (address.includes('Ngaoundéré') || address.includes('Ngaoundere'))) {
                    realVille = 'Ngaoundéré';
                }
                // CORRECTION : Douala seulement si c'est dans Littoral
                else if (region === 'Littoral' && address.includes('Douala :')) {
                    realVille = 'Douala';
                }
                else if (region === 'Littoral' && address.includes('Loum')) {
                    realVille = 'Loum';
                }
                // Par défaut pour Centre : Yaoundé
                else if (region === 'Centre') {
                    realVille = 'Yaoundé';
                }

                // Nettoyer l'adresse (supprimer les données corrompues)
                let cleanAdresse = address;
                // Supprimer les données corrompues à la fin
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

                // Extraire le quartier si possible
                let quartier = pharmacy.quartier || 'Non précisé';
                if (quartier === 'Non précisé' && cleanAdresse.includes(':')) {
                    const parts = cleanAdresse.split(':');
                    if (parts.length > 1) {
                        const afterColon = parts[1].trim();
                        // Prendre les premiers mots comme quartier
                        const quartierParts = afterColon.split(/\s+/);
                        if (quartierParts.length > 1) {
                            quartier = quartierParts.slice(0, 2).join(' ');
                        } else {
                            quartier = afterColon;
                        }
                    }
                }

                return {
                    ...pharmacy,
                    ville: realVille,
                    adresse: cleanAdresse,
                    quartier: quartier,
                    coordinates: pharmacy.coordinates || { lat: null, lng: null }
                };
            });
        } else {
            cleanedData.regions[region] = [];
        }
    });

    // 3. Calculer le vrai total
    const totalPharmacies = Object.values(cleanedData.regions)
        .reduce((sum, pharmacies) => sum + pharmacies.length, 0);
    cleanedData.total = totalPharmacies;

    // 4. Sauvegarder
    fs.writeFileSync(
        path.join(__dirname, '../public/data/gardes_du_jour_clean.json'),
        JSON.stringify(cleanedData, null, 2)
    );

    console.log('✅ Données nettoyées et sauvegardées dans gardes_du_jour_clean.json');
    console.log(`📊 Total pharmacies: ${totalPharmacies}`);

    // Afficher les statistiques par région
    console.log('\n📈 Statistiques par région:');
    Object.keys(cleanedData.regions).forEach(region => {
        const pharmacies = cleanedData.regions[region];
        if (pharmacies.length > 0) {
            const villes = [...new Set(pharmacies.map(p => p.ville))];
            console.log(`📍 ${region}: ${pharmacies.length} pharmacies, ${villes.length} villes`);
            console.log(`   Villes: ${villes.join(', ')}`);
        }
    });
}

// Exécuter
cleanGardesData();