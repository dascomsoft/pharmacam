export class PharmacyAIService {
  constructor() {
    this.baseURL = typeof window !== 'undefined' 
      ? window.location.origin
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  async searchWithAI(userQuery, city = null) {
    try {
      console.log('Calling AI API for:', userQuery);
      
      const response = await fetch(`${this.baseURL}/api/groq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userQuery,
          city: city
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        type: 'ai_assisted',
        success: data.success,
        response: data.response,
        model: data.model,
        timestamp: data.timestamp,
        disclaimer: 'Réponse basée sur la connaissance générale des pharmacies au Cameroun (2025)'
      };
      
    } catch (error) {
      console.error('Pharmacy AI search error:', error);
      
      return {
        type: 'ai_assisted',
        success: false,
        response: this.getFallbackResponse(userQuery, city),
        error: error.message,
        isFallback: true
      };
    }
  }

  getFallbackResponse(query, city) {
    const fallbacks = {
      'Yaoundé': `Pour "${query}" à Yaoundé, essaie :
• Pharmacie Centrale (Bastos)
• Pharmacie du Lac
• Pharmacie Biyem-Assi

Ou appelle directement le 1510 pour la pharmacie de garde ce soir.`,

      'Douala': `Pour "${query}" à Douala, cherche :
• Pharmacie Akwa Palace
• Pharmacie Bonanjo
• Pharmacie Deïdo

Vérifie aussi sur Google Maps ou annuaire-medical.cm !`
    };

    return fallbacks[city] || 
           `Cherche "${query}" sur Google Maps ou appelle le 1510 (ONPC) pour la pharmacie de garde.`;
  }
}
