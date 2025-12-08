


// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// import PharmacyCard from '../src/components/ui/PharmacyCard';
// import { useVoice } from '../src/hooks/useVoice';
// import { useLocation } from '../src/hooks/useLocation';
// import { searchPharmacies, analyzeQuery } from '../src/lib/pharmacies';

// // Icônes Lucide React
// import {
//   Mic, MapPin, Phone, Navigation, Clock, Shield,
//   Search, AlertCircle, Star, Zap, Crosshair, Users,
//   Sparkles, Moon, Sun, Heart, ShieldCheck, Bell
// } from 'lucide-react';

// export default function Home() {
//   const [showOnboarding, setShowOnboarding] = useState(true);
//   const [searchResults, setSearchResults] = useState([]);
//   const [userCity, setUserCity] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   const { isListening, transcript, startListening, error: voiceError } = useVoice();
//   const { location, loading: locationLoading, error: locationError } = useLocation();

//   useEffect(() =>{
//     window.scrollTo(0, 0); 
//    },[])

//   useEffect(() => {
//     if (location) {
//       setTimeout(() => {
//         setUserCity(location.lat > 4.0 ? 'Douala' : 'Yaoundé');
//       }, 1000);
//     }
//   }, [location]);

//   useEffect(() => {
//     if (transcript) {
//       setSearchQuery(transcript);
//       performSearch(transcript);
//     }
//   }, [transcript]);

//   const performSearch = (query) => {
//     const queryInfo = analyzeQuery(query);
//     const city = queryInfo.ville || userCity || 'Yaoundé';

//     const results = searchPharmacies(query, city, location);
//     setSearchResults(results);
//   };

//   const handleTextSearch = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       performSearch(searchQuery);
//     }
//   };

//   const handleOnboardingComplete = () => {
//     setShowOnboarding(false);
//   };

//   if (showOnboarding) {
//     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
//   }

//   return (
//     <div className="py-20 bg-gradient-to-b from-secondary to-black">
//       {/* Header avec glassmorphism */}
//       <header className="sticky top-0 z-50 backdrop-blur-lg bg-secondary/80 border-b border-gray-800/50">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center glow-border">
//                   <Shield className="text-white" size={24} />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-green rounded-full flex items-center justify-center">
//                   <Zap size={10} className="text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
//                   Pharmacam
//                 </h1>
//                 {userCity && (
//                   <div className="flex items-center space-x-1">
//                     <MapPin size={12} className="text-primary" />
//                     <p className="text-xs text-gray-400">{userCity}</p>
//                     {locationLoading && (
//                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 rounded-lg bg-secondary-light hover:bg-gray-800 transition"
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>
//               <button className="px-4 py-2 bg-secondary-light rounded-lg text-gray-300 hover:bg-gray-800 transition flex items-center space-x-2">
//                 <Bell size={18} />
//                 <span className="text-sm">Alerte</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-6">
//       <div className='py-[4em]'>
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-10"
//         >
//           <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
//             <Sparkles size={16} className="text-primary" />
//             <span className="text-sm text-primary font-medium">Urgence 24h/24</span>
//           </div>

//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             <span className="text-white">Trouvez une pharmacie</span>
//             <br />
//             <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
//               en parlant
//             </span>
//           </h2>

//           <p className="text-gray-400 max-w-md mx-auto">
//             Dites ce que vous cherchez, nous trouvons la pharmacie ouverte la plus proche.
//           </p>
//         </motion.div>

//         {/* Search Section */}
//         <div className="max-w-2xl mx-auto mb-12">
//           {/* Barre de recherche texte */}
//           <div className="relative mb-8">
//             <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//               <Search size={20} />
//             </div>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={handleTextSearch}
//               placeholder="Ex: 'Pharmacie de garde Bastos Yaoundé'"
//               className="w-full pl-12 pr-24 py-4 bg-secondary-light border border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
//             />
//             <button
//               onClick={() => searchQuery.trim() && performSearch(searchQuery)}
//               className="absolute right-2 top-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center space-x-2"
//             >
//               <Search size={18} />
//               <span>Chercher</span>
//             </button>
//           </div>

//           {/* Microphone Section */}
//           <div className="text-center">
//             <div className="relative inline-block mb-6">
//               <MicrophoneButton
//                 isListening={isListening}
//                 onClick={startListening}
//               />

//               {/* Effets visuels autour du microphone */}
//               {isListening && (
//                 <>
//                   <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
//                   <div className="absolute -inset-6 bg-primary/10 rounded-full blur-xl" />
//                 </>
//               )}
//             </div>

//             <p className="text-lg mb-2">
//               {isListening ? (
//                 <span className="flex items-center justify-center space-x-2 text-primary animate-pulse">
//                   <Mic size={20} />
//                   <span>PARLEZ MAINTENANT...</span>
//                 </span>
//               ) : (
//                 <span className="text-gray-300">Appuyez pour parler</span>
//               )}
//             </p>

//             <p className="text-sm text-gray-500">
//               Dites: "Pharmacie", "Garde", "Urgence", "Lac", "Bastos", etc.
//             </p>
//           </div>
//         </div>

//         {/* Results Section */}
//         <AnimatePresence>
//           {searchResults.length > 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="max-w-4xl mx-auto"
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
//                   </h3>
//                   <p className="text-gray-400">
//                     Pour "{transcript || searchQuery}"
//                   </p>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => {
//                       setSearchResults([]);
//                       setSearchQuery('');
//                     }}
//                     className="px-4 py-2 bg-secondary-light rounded-lg text-gray-300 hover:bg-gray-800 transition"
//                   >
//                     Nouvelle recherche
//                   </button>
//                   <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition flex items-center space-x-2">
//                     <MapPin size={18} />
//                     <span>Voir sur carte</span>
//                   </button>
//                 </div>
//               </div>

//               <div className="grid gap-6">
//                 {searchResults.map((pharmacy, index) => (
//                   <PharmacyCard
//                     key={pharmacy.id}
//                     pharmacy={pharmacy}
//                     distance={pharmacy.distance}
//                     isRecommended={index === 0}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           ) : searchQuery ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-16"
//             >
//               <div className="w-20 h-20 mx-auto mb-6 bg-secondary-light rounded-full flex items-center justify-center">
//                 <AlertCircle size={40} className="text-gray-500" />
//               </div>
//               <p className="text-xl text-gray-300 mb-3">Aucune pharmacie trouvée</p>
//               <p className="text-gray-500 mb-8 max-w-md mx-auto">
//                 Essayez: "pharmacie de garde à Yaoundé", "pharmacie Bastos", "pharmacie du lac"
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchQuery('');
//                   setSearchResults([]);
//                 }}
//                 className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:opacity-90 transition"
//               >
//                 Nouvelle recherche
//               </button>
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-12"
//             >
//               <div className="max-w-2xl mx-auto">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
//                   {[
//                     { icon: <Zap className="text-primary" size={24} />, text: 'Rapide' },
//                     { icon: <ShieldCheck className="text-accent-green" size={24} />, text: 'Sécurisé' },
//                     { icon: <Users className="text-accent-blue" size={24} />, text: 'Communautaire' },
//                     { icon: <Clock className="text-yellow-500" size={24} />, text: '24h/24' },
//                     { icon: <Heart className="text-red-400" size={24} />, text: 'Urgence' },
//                     { icon: <Crosshair className="text-purple-400" size={24} />, text: 'Précis' },
//                   ].map((feature, idx) => (
//                     <div key={idx} className="bg-secondary-light rounded-xl p-4 card-hover">
//                       <div className="flex flex-col items-center space-y-2">
//                         {feature.icon}
//                         <span className="text-sm text-gray-300">{feature.text}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <p className="text-gray-400 mb-8">
//                   {locationLoading ? (
//                     <span className="flex items-center justify-center space-x-2">
//                       <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
//                       <span>Détection de votre position...</span>
//                     </span>
//                   ) : (
//                     'Parlez ou écrivez pour commencer la recherche'
//                   )}
//                 </p>

//                 {userCity && (
//                   <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
//                     <MapPin size={16} className="text-primary" />
//                     <span className="text-sm">
//                       Recherche automatique à <span className="text-primary font-semibold">{userCity}</span>
//                     </span>
//                   </div>
//                 )}

//                 {/* Suggestions rapides */}
//                 <div className="mt-8">
//                   <p className="text-gray-500 mb-4">Suggestions rapides:</p>
//                   <div className="flex flex-wrap justify-center gap-3">
//                     {[
//                       'Pharmacie de garde',
//                       'À côté de moi',
//                       'Pharmacie Bastos',
//                       'Pharmacie du lac',
//                       'Douala nuit',
//                       'Yaoundé centre'
//                     ].map((suggestion) => (
//                       <button
//                         key={suggestion}
//                         onClick={() => {
//                           setSearchQuery(suggestion);
//                           performSearch(suggestion);
//                         }}
//                         className="px-5 py-2.5 bg-secondary-light border border-gray-700 rounded-full text-gray-300 hover:border-primary hover:text-primary transition"
//                       >
//                         {suggestion}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Erreurs */}
//         {(voiceError || locationError) && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-md mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
//           >
//             <div className="flex items-start space-x-3">
//               <AlertCircle className="text-red-400 mt-0.5" size={20} />
//               <div>
//                 <p className="text-red-300 font-medium mb-1">Avertissement</p>
//                 <p className="text-red-400/80 text-sm">
//                   {voiceError || locationError}. La recherche fonctionne mais certaines fonctionnalités sont limitées.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//         </div>
//       </main>
//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-secondary/90 border-t border-gray-800/50">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-around py-4">
//             {[
//               { icon: <Mic size={24} />, label: 'Parler', active: true },
//               { icon: <MapPin size={24} />, label: 'Carte' },
//               { icon: <Clock size={24} />, label: 'Historique' },
//               { icon: <Heart size={24} />, label: 'Urgences' },
//               { icon: <Users size={24} />, label: 'Communauté' },
//             ].map((item, index) => (
//               <button
//                 key={index}
//                 className={`flex flex-col items-center transition-all ${item.active
//                     ? 'text-primary'
//                     : 'text-gray-500 hover:text-gray-300'
//                   }`}
//               >
//                 <div className={`p-2 rounded-lg ${item.active
//                     ? 'bg-primary/10'
//                     : 'hover:bg-gray-800/50'
//                   }`}>
//                   {item.icon}
//                 </div>
//                 <span className="text-xs mt-1">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* Watermark */}
//       <div className="fixed bottom-20 right-4 text-xs text-gray-600">
//         v1.0 • Pharmacam
//       </div>
//     </div>
//   );
// }

































































































'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
import MicrophoneButton from '../src/components/voice/MicrophoneButton';
import PharmacyCard from '../src/components/ui/PharmacyCard';
import { useVoice } from '../src/hooks/useVoice';
import { useLocation } from '../src/hooks/useLocation';
import { hybridPharmacySearch, analyzeQuery } from '../src/lib/pharmacies';

// Icônes Lucide React
import {
  Mic, MapPin, Phone, Navigation, Clock, Shield,
  Search, AlertCircle, Star, Zap, Crosshair, Users,
  Sparkles, Moon, Sun, Heart, ShieldCheck, Bell
} from 'lucide-react';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [userCity, setUserCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState(null); // 'local' | 'ai' | 'fallback'
  const [aiResponse, setAiResponse] = useState(null);

  const { isListening, transcript, startListening, error: voiceError } = useVoice();
  const { location, loading: locationLoading, error: locationError } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location) {
      setTimeout(() => {
        setUserCity(location.lat > 4.0 ? 'Douala' : 'Yaoundé');
      }, 1000);
    }
  }, [location]);

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
      performSearch(transcript);
    }
  }, [transcript]);

  const performSearch = async (query) => {
    setIsLoading(true);
    setAiResponse(null);
    setSearchType(null);

    const queryInfo = analyzeQuery(query);
    const city = queryInfo.ville || userCity || 'Yaoundé';

    try {
      // Utilisation du nouveau système hybride
      const searchResult = await hybridPharmacySearch(query, city, location);

      if (searchResult.type === 'local_database') {
        // Résultats locaux
        setSearchType('local');
        setSearchResults(searchResult.results || []);
      }
      else if (searchResult.type === 'ai_assisted') {
        // Réponse IA
        setSearchType('ai');
        setAiResponse(searchResult);
        setSearchResults([]); // Pas de résultats locaux
      }
      else if (searchResult.type === 'fallback') {
        // Fallback
        setSearchType('fallback');
        setAiResponse(searchResult);
        setSearchResults([]);
      }

    } catch (error) {
      console.error('Erreur recherche:', error);
      // Fallback à l'ancienne méthode pour compatibilité
      const oldResults = require('../src/lib/pharmacies').searchPharmacies(query, city, location);
      setSearchType('local');
      setSearchResults(oldResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Composant pour afficher la réponse IA
  const AIResponseDisplay = ({ response }) => {
    if (!response) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-6">
          {/* En-tête réponse IA */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Suggestion</h3>
              <p className="text-sm text-yellow-400/80">Basée sur la connaissance des pharmacies camerounaises</p>
            </div>
          </div>

          {/* Réponse texte */}
          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-gray-200 text-lg whitespace-pre-line leading-relaxed">
              {response.ai_response || response.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {response.actions?.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (action.id === 'call_1510') {
                    window.open('tel:1510');
                  } else if (action.id === 'open_maps') {
                    const query = encodeURIComponent(`pharmacie ${searchQuery}`);
                    window.open(`https://maps.google.com/?q=${query}`, '_blank');
                  }
                }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                {action.label}
              </button>
            ))}

            {/* Boutons par défaut */}
            <button
              onClick={() => window.open('tel:1510')}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex items-center gap-2"
            >
              <Phone size={16} />
              Appeler 1510 (ONPC)
            </button>

            <button
              onClick={() => {
                const query = encodeURIComponent(`pharmacie de garde ${userCity || ''}`);
                window.open(`https://maps.google.com/?q=${query}`, '_blank');
              }}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <MapPin size={16} />
              Chercher sur Maps
            </button>
          </div>

          {/* Disclaimer */}
          {response.disclaimer && (
            <div className="mt-4 pt-4 border-t border-yellow-500/20">
              <p className="text-sm text-yellow-500/80 italic">
                {response.disclaimer}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Composant pour afficher le fallback
  const FallbackDisplay = ({ response }) => {
    if (!response) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-white">Conseils de recherche</h3>
          </div>

          <p className="text-gray-200 mb-4">
            {response.message}
          </p>

          {response.advice && (
            <ul className="space-y-2 mb-6">
              {response.advice.map((item, idx) => (
                <li key={idx} className="text-gray-300 flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {response.emergency_contacts && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Contacts d'urgence :</h4>
              {response.emergency_contacts.map((contact, idx) => (
                <button
                  key={idx}
                  onClick={() => window.open(`tel:${contact.number}`)}
                  className="block w-full text-left px-4 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">{contact.name}</span>
                    <span className="text-orange-500 font-semibold">{contact.number}</span>
                  </div>
                  {contact.description && (
                    <p className="text-sm text-gray-400 mt-1">{contact.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (showOnboarding) {
    return <OnboardingSteps onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="py-20 bg-gradient-to-b from-secondary to-black">
      {/* Header avec glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-secondary/80 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center glow-border">
                  <Shield className="text-white" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-green rounded-full flex items-center justify-center">
                  <Zap size={10} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                  Pharmacam
                </h1>
                {userCity && (
                  <div className="flex items-center space-x-1">
                    <MapPin size={12} className="text-primary" />
                    <p className="text-xs text-gray-400">{userCity}</p>
                    {locationLoading && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-secondary-light hover:bg-gray-800 transition"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="px-4 py-2 bg-secondary-light rounded-lg text-gray-300 hover:bg-gray-800 transition flex items-center space-x-2">
                <Bell size={18} />
                <span className="text-sm">Alerte</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className='py-[4em]'>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">Urgence 24h/24</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Trouvez une pharmacie</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                en parlant
              </span>
            </h2>

            <p className="text-gray-400 max-w-md mx-auto">
              Dites ce que vous cherchez, nous trouvons la pharmacie ouverte la plus proche.
            </p>
          </motion.div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            {/* Barre de recherche texte */}
            <div className="relative mb-8">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleTextSearch}
                placeholder="Ex: 'Pharmacie de garde Bastos Yaoundé'"
                className="w-full pl-12 pr-24 py-4 bg-secondary-light border border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                disabled={isLoading}
              />
              <button
                onClick={() => searchQuery.trim() && performSearch(searchQuery)}
                disabled={isLoading || !searchQuery.trim()}
                className="absolute right-2 top-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    <span>Chercher</span>
                  </>
                )}
              </button>
            </div>

            {/* Microphone Section */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <MicrophoneButton
                  isListening={isListening}
                  onClick={startListening}
                  disabled={isLoading}
                />

                {/* Effets visuels autour du microphone */}
                {isListening && (
                  <>
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -inset-6 bg-primary/10 rounded-full blur-xl" />
                  </>
                )}
              </div>

              <p className="text-lg mb-2">
                {isListening ? (
                  <span className="flex items-center justify-center space-x-2 text-primary animate-pulse">
                    <Mic size={20} />
                    <span>PARLEZ MAINTENANT...</span>
                  </span>
                ) : (
                  <span className="text-gray-300">Appuyez pour parler</span>
                )}
              </p>

              <p className="text-sm text-gray-500">
                Dites: "Pharmacie", "Garde", "Urgence", "Lac", "Bastos", etc.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xl text-gray-300">Recherche en cours...</p>
              <p className="text-gray-500 mt-2">Consultation de notre base </p>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {!isLoading && (
              <>
                {/* Affichage réponse IA */}
                {searchType === 'ai' && aiResponse && (
                  <AIResponseDisplay response={aiResponse} />
                )}

                {/* Affichage fallback */}
                {searchType === 'fallback' && aiResponse && (
                  <FallbackDisplay response={aiResponse} />
                )}

                {/* Résultats locaux (comme avant) */}
                {searchResults.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                        </h3>
                        <p className="text-gray-400">
                          Pour "{transcript || searchQuery}"
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setSearchResults([]);
                            setSearchQuery('');
                            setAiResponse(null);
                            setSearchType(null);
                          }}
                          className="px-4 py-2 bg-secondary-light rounded-lg text-gray-300 hover:bg-gray-800 transition"
                        >
                          Nouvelle recherche
                        </button>
                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition flex items-center space-x-2">
                          <MapPin size={18} />
                          <span>Voir sur carte</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {searchResults.map((pharmacy, index) => (
                        <PharmacyCard
                          key={pharmacy.id}
                          pharmacy={pharmacy}
                          distance={pharmacy.distance}
                          isRecommended={index === 0}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : searchQuery && !aiResponse ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-secondary-light rounded-full flex items-center justify-center">
                      <AlertCircle size={40} className="text-gray-500" />
                    </div>
                    <p className="text-xl text-gray-300 mb-3">Aucune pharmacie trouvée</p>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Essayez: "pharmacie de garde à Yaoundé", "pharmacie Bastos", "pharmacie du lac"
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setAiResponse(null);
                        setSearchType(null);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:opacity-90 transition"
                    >
                      Nouvelle recherche
                    </button>
                  </motion.div>
                ) : !searchQuery && !isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="max-w-2xl mx-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                        {[
                          { icon: <Zap className="text-primary" size={24} />, text: 'Rapide' },
                          { icon: <ShieldCheck className="text-accent-green" size={24} />, text: 'Sécurisé' },
                          { icon: <Users className="text-accent-blue" size={24} />, text: 'Communautaire' },
                          { icon: <Clock className="text-yellow-500" size={24} />, text: '24h/24' },
                          { icon: <Heart className="text-red-400" size={24} />, text: 'Urgence' },
                          { icon: <Crosshair className="text-purple-400" size={24} />, text: 'Précis' },
                        ].map((feature, idx) => (
                          <div key={idx} className="bg-secondary-light rounded-xl p-4 card-hover">
                            <div className="flex flex-col items-center space-y-2">
                              {feature.icon}
                              <span className="text-sm text-gray-300">{feature.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-gray-400 mb-8">
                        {locationLoading ? (
                          <span className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                            <span>Détection de votre position...</span>
                          </span>
                        ) : (
                          'Parlez ou écrivez pour commencer la recherche'
                        )}
                      </div>

                      {userCity && (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
                          <MapPin size={16} className="text-primary" />
                          <span className="text-sm">
                            Recherche automatique à <span className="text-primary font-semibold">{userCity}</span>
                          </span>
                        </div>
                      )}

                      {/* Suggestions rapides */}
                      <div className="mt-8">
                        <p className="text-gray-500 mb-4">Suggestions rapides:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {[
                            'Pharmacie de garde',
                            'À côté de moi',
                            'Pharmacie Bastos',
                            'Pharmacie du lac',
                            'Douala nuit',
                            'Yaoundé centre'
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => {
                                setSearchQuery(suggestion);
                                performSearch(suggestion);
                              }}
                              className="px-5 py-2.5 bg-secondary-light border border-gray-700 rounded-full text-gray-300 hover:border-primary hover:text-primary transition"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-secondary/90 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            {[
              { icon: <Mic size={24} />, label: 'Parler', active: true },
              { icon: <MapPin size={24} />, label: 'Carte' },
              { icon: <Clock size={24} />, label: 'Historique' },
              { icon: <Heart size={24} />, label: 'Urgences' },
              { icon: <Users size={24} />, label: 'Communauté' },
            ].map((item, index) => (
              <button
                key={index}
                className={`flex flex-col items-center transition-all ${item.active
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <div className={`p-2 rounded-lg ${item.active
                  ? 'bg-primary/10'
                  : 'hover:bg-gray-800/50'
                  }`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Watermark */}
      <div className="fixed bottom-20 right-4 text-xs text-gray-600">
        v1.0 • Pharmacam
      </div>
    </div>
  );
}