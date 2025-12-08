# 🏥 Pharmacam - Digitalisation des Pharmacies de Garde au Cameroun

> Solution à un problème **réel et non-digitalisé** : trouver une pharmacie ouverte la nuit sans devoir parcourir les rues pour lire les affiches manuelles

## 🎯 **Problème Réel (Contexte Camerounais)**
### **La Situation Actuelle :**
À 2h du matin, pour trouver une pharmacie ouverte au Cameroun :
1. 🚶‍♂️ **Sortir dans les rues** (insécurité potentielle)
2. 🔍 **Chercher sur les murs** les affiches manuscrites des pharmacies de garde
3. 📞 **Appeler au hasard** les numéros trouvés (si lisibles)
4. ⏱️ **Perdre 30-60 minutes** dans ce processus précaire

### **Notre Solution :**
- 🎤 **Parler** dans son téléphone : "Pharmacie de garde près de moi"
- ⚡ **Obtenir en 0.3s** : Liste des pharmacies ouvertes avec contacts vérifiés
- 📱 **Tout depuis chez soi** : Sécurité, rapidité, fiabilité

## ✨ **Ce Que Pharmacam Résout Vraiment**
| **Problème Terrain** | **Notre Solution Digitale** |
|----------------------|----------------------------|
| Affiches manuscrites illisibles/absentes | **Base de données centralisée et vérifiée** |
| Numéros téléphoniques incorrects | **Contacts validés et mis à jour** |
| Dangers de circuler la nuit | **Recherche 100% depuis son domicile** |
| Manque d'information centralisée | **Application unique de référence** |
| Processus lent (>30min) | **Réponse instantanée (0.3s)** |

## 🛠️ **Architecture Technique (Pragmatique)**
### **Choix Déliberés Basés sur les Contraintes Réelles :**
```javascript
// POURQUOI nous n'avons PAS utilisé l'IA cloud :
const problem = {
  internet: "instable/nocturne au Cameroun",
  coût: "API Groq = $ après quota gratuit",
  pertinence: "IA générique ne connaît pas les quartiers camerounais",
  solution: "Base locale + algorithmes custom adaptés"
};

// NOTRE solution :
const pharmacam = {
  baseDonnees: "JSON local de 100+ pharmacies vérifiées",
  recherche: "Algorithmes de matching spécifiques Cameroun",
  voix: "Web Speech API (gratuit, offline-capable)",
  performance: "0.3s vs 5min avec solutions cloud",
  fiabilité: "Fonctionne même sans internet"
};

## Stack Technique :
-Frontend : Next.js 15 + React 19 (performance optimale)

-UI/UX : Tailwind CSS + Framer Motion (mobile-first)

-Données : Base JSON locale (pas de dépendance serveur)

-Voix : Web Speech API native (pas d'envoi de données)

-Géolocalisation : API navigateur avec fallback manuel

-Déploiement : Vercel (global CDN pour l'Afrique)