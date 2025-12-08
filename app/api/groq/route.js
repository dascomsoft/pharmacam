export async function POST(request) {
  console.log('⚡ API Pharmacam - Mode LOCAL ULTRA-RAPIDE');
  const startTime = Date.now();
  
  try {
    const { query, city = 'Yaoundé' } = await request.json();
    
    if (!query || query.trim().length < 2) {
      return Response.json({
        success: false,
        response: "Veuillez entrer un nom de pharmacie valide (ex: 'Pharmacie Centrale')"
      });
    }
    
    // SIMULATION : 300ms max (rapide)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // BASE DE DONNÉES LOCALE
    const pharmacies = [
      { name: "Pharmacie Centrale", city: "Yaoundé", phone: "222 22 22 22", address: "Centre-ville" },
      { name: "Pharmacie Bonas", city: "Douala", phone: "233 44 55 66", address: "Carrefour Bonas" },
      { name: "Pharmacie du Marché", city: "Yaoundé", phone: "677 88 99 00", address: "Marché Central" },
      { name: "Pharmacie Biyem-Assi", city: "Yaoundé", phone: "699 11 22 33", address: "Biyem-Assi" },
      { name: "Pharmacie Ngoa-Ekelle", city: "Yaoundé", phone: "655 44 33 22", address: "Ngoa-Ekelle" },
      { name: "Pharmacie Mendong", city: "Yaoundé", phone: "622 11 33 44", address: "Mendong" },
      { name: "Pharmacie Nkolbisson", city: "Yaoundé", phone: "677 55 66 77", address: "Nkolbisson" },
      { name: "Pharmacie Odza", city: "Yaoundé", phone: "699 88 77 66", address: "Odza" },
      { name: "Pharmacie Ekounou", city: "Yaoundé", phone: "633 22 11 00", address: "Ekounou" },
      { name: "Pharmacie Bastos", city: "Yaoundé", phone: "622 99 88 77", address: "Bastos" }
    ];
    
    // Recherche intelligente
    const queryLower = query.toLowerCase().trim();
    const cityLower = city.toLowerCase();
    
    // 1. Recherche exacte
    const exactMatch = pharmacies.find(p => 
      p.name.toLowerCase().includes(queryLower) && 
      p.city.toLowerCase().includes(cityLower)
    );
    
    if (exactMatch) {
      return Response.json({
        success: true,
        response: `🏥 ${exactMatch.name}\n📍 ${exactMatch.address}, ${exactMatch.city}\n📞 ${exactMatch.phone}`,
        found: true,
        response_time: Date.now() - startTime
      });
    }
    
    // 2. Recherche partielle
    const partialMatch = pharmacies.find(p => 
      (p.name.toLowerCase().includes(queryLower) || queryLower.includes(p.name.toLowerCase().split(' ')[1])) &&
      p.city.toLowerCase().includes(cityLower)
    );
    
    if (partialMatch) {
      return Response.json({
        success: true,
        response: `🏥 ${partialMatch.name}\n📍 ${partialMatch.address}, ${partialMatch.city}\n📞 ${partialMatch.phone}`,
        found: true,
        response_time: Date.now() - startTime
      });
    }
    
    // 3. Si non trouvé : pharmacies de la ville
    const cityPharmacies = pharmacies.filter(p => 
      p.city.toLowerCase().includes(cityLower)
    ).slice(0, 3); // 3 premières
    
    if (cityPharmacies.length > 0) {
      const suggestions = cityPharmacies.map(p => `• ${p.name} - ${p.phone}`).join('\n');
      
      return Response.json({
        success: true,
        response: `❌ "${query}" non trouvé à ${city}.\n\n📋 Suggestions :\n${suggestions}\n\n📞 Ou appelez le 1510`,
        found: false,
        suggestions: cityPharmacies.length,
        response_time: Date.now() - startTime
      });
    }
    
    // 4. Fallback général
    return Response.json({
      success: true,
      response: `🔍 Pour "${query}" à ${city} :\n📞 Composez le 1510 (ONPC)\n🗺️ Cherchez sur Google Maps\n👥 Demandez à vos voisins`,
      found: false,
      response_time: Date.now() - startTime
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      response: "📞 URGENCE : Appelez le 1510 pour une pharmacie de garde",
      emergency: true,
      response_time: Date.now() - startTime
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ready',
    mode: 'local_database',
    pharmacies_count: 10,
    response_time: '300ms max'
  });
}