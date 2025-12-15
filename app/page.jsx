































































// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// import PharmacyCard from '../src/components/ui/PharmacyCard';
// import { useVoice } from '../src/hooks/useVoice';
// import { useLocation } from '../src/hooks/useLocation';
// import { hybridPharmacySearch, analyzeQuery } from '../src/lib/pharmacies';

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
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchType, setSearchType] = useState(null); // 'local' | 'ai' | 'fallback'
//   const [aiResponse, setAiResponse] = useState(null);

//   const { isListening, transcript, startListening, error: voiceError } = useVoice();
//   const { location, loading: locationLoading, error: locationError } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

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

//   const performSearch = async (query) => {
//     setIsLoading(true);
//     setAiResponse(null);
//     setSearchType(null);

//     const queryInfo = analyzeQuery(query);
//     const city = queryInfo.ville || userCity || 'Yaoundé';

//     try {
//       // Utilisation du nouveau système hybride
//       const searchResult = await hybridPharmacySearch(query, city, location);

//       if (searchResult.type === 'local_database') {
//         // Résultats locaux
//         setSearchType('local');
//         setSearchResults(searchResult.results || []);
//       }
//       else if (searchResult.type === 'ai_assisted') {
//         // Réponse IA
//         setSearchType('ai');
//         setAiResponse(searchResult);
//         setSearchResults([]); // Pas de résultats locaux
//       }
//       else if (searchResult.type === 'fallback') {
//         // Fallback
//         setSearchType('fallback');
//         setAiResponse(searchResult);
//         setSearchResults([]);
//       }

//     } catch (error) {
//       console.error('Erreur recherche:', error);
//       // Fallback à l'ancienne méthode pour compatibilité
//       const oldResults = require('../src/lib/pharmacies').searchPharmacies(query, city, location);
//       setSearchType('local');
//       setSearchResults(oldResults);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTextSearch = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       performSearch(searchQuery);
//     }
//   };

//   const handleOnboardingComplete = () => {
//     setShowOnboarding(false);
//   };

//   // Composant pour afficher la réponse IA
//   const AIResponseDisplay = ({ response }) => {
//     if (!response) return null;

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto mb-8"
//       >
//         <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-6">
//           {/* En-tête réponse IA */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
//               <span className="text-white font-bold text-lg">🤖</span>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-white">Suggestion</h3>
//               <p className="text-sm text-yellow-400/80">Basée sur la connaissance des pharmacies camerounaises</p>
//             </div>
//           </div>

//           {/* Réponse texte */}
//           <div className="prose prose-invert max-w-none mb-6">
//             <p className="text-gray-200 text-lg whitespace-pre-line leading-relaxed">
//               {response.ai_response || response.message}
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-wrap gap-3">
//             {response.actions?.map((action, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   if (action.id === 'call_1510') {
//                     window.open('tel:1510');
//                   } else if (action.id === 'open_maps') {
//                     const query = encodeURIComponent(`pharmacie ${searchQuery}`);
//                     window.open(`https://maps.google.com/?q=${query}`, '_blank');
//                   }
//                 }}
//                 className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 touch-target"
//               >
//                 {action.label}
//               </button>
//             ))}

//             {/* Boutons par défaut */}
//             <button
//               onClick={() => window.open('tel:1510')}
//               className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex items-center gap-2 touch-target"
//             >
//               <Phone size={16} />
//               Appeler 1510 (ONPC)
//             </button>

//             <button
//               onClick={() => {
//                 const query = encodeURIComponent(`pharmacie de garde ${userCity || ''}`);
//                 window.open(`https://maps.google.com/?q=${query}`, '_blank');
//               }}
//               className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 touch-target"
//             >
//               <MapPin size={16} />
//               Chercher sur Maps
//             </button>
//           </div>

//           {/* Disclaimer */}
//           {response.disclaimer && (
//             <div className="mt-4 pt-4 border-t border-yellow-500/20">
//               <p className="text-sm text-yellow-500/80 italic">
//                 {response.disclaimer}
//               </p>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     );
//   };

//   // Composant pour afficher le fallback
//   const FallbackDisplay = ({ response }) => {
//     if (!response) return null;

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto mb-8"
//       >
//         <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <AlertCircle className="text-orange-500" size={24} />
//             <h3 className="text-xl font-bold text-white">Conseils de recherche</h3>
//           </div>

//           <p className="text-gray-200 mb-4">
//             {response.message}
//           </p>

//           {response.advice && (
//             <ul className="space-y-2 mb-6">
//               {response.advice.map((item, idx) => (
//                 <li key={idx} className="text-gray-300 flex items-start gap-2">
//                   <span className="text-orange-500 mt-1">•</span>
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>
//           )}

//           {response.emergency_contacts && (
//             <div className="space-y-3">
//               <h4 className="font-semibold text-white">Contacts d'urgence :</h4>
//               {response.emergency_contacts.map((contact, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => window.open(`tel:${contact.number}`)}
//                   className="block w-full text-left px-4 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition touch-target"
//                 >
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-200">{contact.name}</span>
//                     <span className="text-orange-500 font-semibold">{contact.number}</span>
//                   </div>
//                   {contact.description && (
//                     <p className="text-sm text-gray-400 mt-1">{contact.description}</p>
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     );
//   };

//   if (showOnboarding) {
//     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
//   }

//   return (
//     <div className="pt-4 pb-24 md:py-20 bg-gradient-to-b from-secondary to-black min-h-screen">
//       {/* Header avec glassmorphism */}
//       <header className="sticky top-0 z-50 backdrop-blur-lg bg-secondary/80 border-b border-gray-800/50 safe-area-padding">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center glow-border">
//                   <Shield className="text-white w-5 h-5 md:w-6 md:h-6" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-accent-green rounded-full flex items-center justify-center">
//                   <Zap size={8} className="text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
//                   Allo237
//                 </h1>
//                 {userCity && (
//                   <div className="flex items-center space-x-1">
//                     <MapPin size={10} className="text-primary" />
//                     <p className="text-xs text-gray-400">{userCity}</p>
//                     {locationLoading && (
//                       <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="hidden md:flex items-center space-x-3">
//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 rounded-lg bg-secondary-light hover:bg-gray-800 transition touch-target"
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>
//               <button className="px-4 py-2 bg-secondary-light rounded-lg text-gray-300 hover:bg-gray-800 transition flex items-center space-x-2 touch-target">
//                 <Bell size={18} />
//                 <span className="text-sm">Alerte</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-6">
//         <div className='pt-4 pb-32 md:py-[4em]'>
//           {/* Hero Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-8 md:mb-10"
//           >
//             <div className="inline-flex items-center space-x-2 mb-3 md:mb-4 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full border border-primary/20">
//               <Sparkles size={14} className="text-primary" />
//               <span className="text-xs md:text-sm text-primary font-medium">Urgence 24h/24</span>
//             </div>

//             <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
//               <span className="text-white">Trouvez une pharmacie</span>
//               <br />
//               <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
//                 en parlant
//               </span>
//             </h2>

//             <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base px-4">
//               Dites ce que vous cherchez, nous trouvons la pharmacie ouverte la plus proche.
//             </p>
//           </motion.div>

//           {/* Search Section */}
//           <div className="max-w-2xl mx-auto mb-8 md:mb-12">
//             {/* Barre de recherche texte */}
//             <div className="relative mb-6 md:mb-8">
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 <Search size={18} className="md:w-5 md:h-5" />
//               </div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleTextSearch}
//                 placeholder="Ex: 'Pharmacie de garde Bastos Yaoundé'"
//                 className="w-full pl-12 pr-28 py-3 md:py-4 bg-secondary-light border border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-sm md:text-base"
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={() => searchQuery.trim() && performSearch(searchQuery)}
//                 disabled={isLoading || !searchQuery.trim()}
//                 className="absolute right-2 top-2 bg-gradient-to-r from-primary to-primary-dark text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg hover:opacity-90 transition flex items-center space-x-2 disabled:opacity-50 text-sm md:text-base touch-target"
//               >
//                 {isLoading ? (
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <Search size={16} />
//                     <span>Chercher</span>
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Microphone Section */}
//             <div className="text-center">
//               <div className="relative inline-block mb-6 scale-110 md:scale-100">
//                 <MicrophoneButton
//                   isListening={isListening}
//                   onClick={startListening}
//                   disabled={isLoading}
//                 />

//                 {/* Effets visuels autour du microphone */}
//                 {isListening && (
//                   <>
//                     <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
//                     <div className="absolute -inset-6 bg-primary/10 rounded-full blur-xl" />
//                   </>
//                 )}
//               </div>

//               <p className="text-base md:text-lg mb-2">
//                 {isListening ? (
//                   <span className="flex items-center justify-center space-x-2 text-primary animate-pulse">
//                     <Mic size={18} />
//                     <span>PARLEZ MAINTENANT...</span>
//                   </span>
//                 ) : (
//                   <span className="text-gray-300">Appuyez pour parler</span>
//                 )}
//               </p>

//               <p className="text-xs md:text-sm text-gray-500 px-4">
//                 Dites: "Pharmacie", "Garde", "Urgence", "Lac", "Bastos", etc.
//               </p>
//             </div>
//           </div>

//           {/* Loading State */}
//           {isLoading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="max-w-4xl mx-auto text-center py-8 md:py-12"
//             >
//               <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
//               <p className="text-lg md:text-xl text-gray-300">Recherche en cours...</p>
//               <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">Consultation de notre base de données</p>
//             </motion.div>
//           )}

//           {/* Results Section */}
//           <AnimatePresence>
//             {!isLoading && (
//               <>
//                 {/* Affichage réponse IA */}
//                 {searchType === 'ai' && aiResponse && (
//                   <AIResponseDisplay response={aiResponse} />
//                 )}

//                 {/* Affichage fallback */}
//                 {searchType === 'fallback' && aiResponse && (
//                   <FallbackDisplay response={aiResponse} />
//                 )}

//                 {/* Résultats locaux (comme avant) */}
//                 {searchResults.length > 0 ? (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="max-w-4xl mx-auto"
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
//                       <div>
//                         <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
//                           {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
//                         </h3>
//                         <p className="text-gray-400 text-sm md:text-base">
//                           Pour "{transcript || searchQuery}"
//                         </p>
//                       </div>

//                       <div className="flex items-center space-x-3">
//                         <button
//                           onClick={() => {
//                             setSearchResults([]);
//                             setSearchQuery('');
//                             setAiResponse(null);
//                             setSearchType(null);
//                           }}
//                           className="px-3 py-2 md:px-4 md:py-2 bg-secondary-light rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm md:text-base touch-target"
//                         >
//                           Nouvelle recherche
//                         </button>
//                         <button className="px-3 py-2 md:px-4 md:py-2 bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition flex items-center space-x-2 text-sm md:text-base touch-target">
//                           <MapPin size={16} />
//                           <span>Voir sur carte</span>
//                         </button>
//                       </div>
//                     </div>

//                     <div className="grid gap-4 md:gap-6">
//                       {searchResults.map((pharmacy, index) => (
//                         <PharmacyCard
//                           key={pharmacy.id}
//                           pharmacy={pharmacy}
//                           distance={pharmacy.distance}
//                           isRecommended={index === 0}
//                         />
//                       ))}
//                     </div>
//                   </motion.div>
//                 ) : searchQuery && !aiResponse ? (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-center py-12 md:py-16"
//                   >
//                     <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-secondary-light rounded-full flex items-center justify-center">
//                       <AlertCircle size={32} className="text-gray-500" />
//                     </div>
//                     <p className="text-lg md:text-xl text-gray-300 mb-2 md:mb-3">Aucune pharmacie trouvée</p>
//                     <p className="text-gray-500 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base px-4">
//                       Essayez: "pharmacie de garde à Yaoundé", "pharmacie Bastos", "pharmacie du lac"
//                     </p>
//                     <button
//                       onClick={() => {
//                         setSearchQuery('');
//                         setSearchResults([]);
//                         setAiResponse(null);
//                         setSearchType(null);
//                       }}
//                       className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:opacity-90 transition text-sm md:text-base touch-target"
//                     >
//                       Nouvelle recherche
//                     </button>
//                   </motion.div>
//                 ) : !searchQuery && !isLoading ? (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="text-center py-8 md:py-12"
//                   >
//                     <div className="max-w-2xl mx-auto">
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
//                         {[
//                           { icon: <Zap className="text-primary w-5 h-5 md:w-6 md:h-6" />, text: 'Rapide' },
//                           { icon: <ShieldCheck className="text-accent-green w-5 h-5 md:w-6 md:h-6" />, text: 'Sécurisé' },
//                           { icon: <Users className="text-accent-blue w-5 h-5 md:w-6 md:h-6" />, text: 'Communautaire' },
//                           { icon: <Clock className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />, text: '24h/24' },
//                           { icon: <Heart className="text-red-400 w-5 h-5 md:w-6 md:h-6" />, text: 'Urgence' },
//                           { icon: <Crosshair className="text-purple-400 w-5 h-5 md:w-6 md:h-6" />, text: 'Précis' },
//                         ].map((feature, idx) => (
//                           <div key={idx} className="bg-secondary-light rounded-xl p-3 md:p-4 card-hover">
//                             <div className="flex flex-col items-center space-y-1 md:space-y-2">
//                               {feature.icon}
//                               <span className="text-xs md:text-sm text-gray-300">{feature.text}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
//                         {locationLoading ? (
//                           <span className="flex items-center justify-center space-x-2">
//                             <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
//                             <span>Détection de votre position...</span>
//                           </span>
//                         ) : (
//                           'Parlez ou écrivez pour commencer la recherche'
//                         )}
//                       </div>

//                       {userCity && (
//                         <div className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full mb-6 md:mb-8">
//                           <MapPin size={14} className="text-primary" />
//                           <span className="text-xs md:text-sm">
//                             Recherche automatique à <span className="text-primary font-semibold">{userCity}</span>
//                           </span>
//                         </div>
//                       )}

//                       {/* Suggestions rapides */}
//                       <div className="mt-6 md:mt-8">
//                         <p className="text-gray-500 mb-3 md:mb-4 text-sm md:text-base">Suggestions rapides:</p>
//                         <div className="flex flex-wrap justify-center gap-2 md:gap-3">
//                           {[
//                             'Pharmacie de garde',
//                             'À côté de moi',
//                             'Pharmacie Bastos',
//                             'Pharmacie du lac',
//                             'Douala nuit',
//                             'Yaoundé centre'
//                           ].map((suggestion) => (
//                             <button
//                               key={suggestion}
//                               onClick={() => {
//                                 setSearchQuery(suggestion);
//                                 performSearch(suggestion);
//                               }}
//                               className="px-3 py-1.5 md:px-5 md:py-2.5 bg-secondary-light border border-gray-700 rounded-full text-gray-300 hover:border-primary hover:text-primary transition text-xs md:text-sm touch-target"
//                             >
//                               {suggestion}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ) : null}
//               </>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-secondary/95 border-t border-gray-800/50 safe-area-padding">
//         <div className="container mx-auto px-2">
//           <div className="flex justify-around py-2">
//             {[
//               { icon: <Mic size={20} className="md:w-6 md:h-6" />, label: 'Parler', active: true },
//               { icon: <MapPin size={20} className="md:w-6 md:h-6" />, label: 'Carte' },
//               { icon: <Clock size={20} className="md:w-6 md:h-6" />, label: 'Historique' },
//               { icon: <Heart size={20} className="md:w-6 md:h-6" />, label: 'Urgences' },
//               { icon: <Users size={20} className="md:w-6 md:h-6" />, label: 'Communauté' },
//             ].map((item, index) => (
//               <button
//                 key={index}
//                 className={`flex flex-col items-center transition-all ${item.active
//                   ? 'text-primary'
//                   : 'text-gray-500 hover:text-gray-300'
//                   } touch-target`}
//               >
//                 <div className={`p-1.5 md:p-2 rounded-lg ${item.active
//                   ? 'bg-primary/10'
//                   : 'hover:bg-gray-800/50'
//                   }`}>
//                   {item.icon}
//                 </div>
//                 <span className="text-[10px] md:text-xs mt-0.5">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* Watermark */}
//       <div className="fixed bottom-16 md:bottom-20 right-3 md:right-4 text-[10px] md:text-xs text-gray-600">
//         v1.0 • Pharmacam
//       </div>
//     </div>
//   );
// }













































































// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// import PharmacyCard from '../src/components/ui/PharmacyCard';
// import { useVoice } from '../src/hooks/useVoice';
// import { useLocation } from '../src/hooks/useLocation';
// import { hybridPharmacySearch, analyzeQuery } from '../src/lib/pharmacies';

// // Icônes Lucide React
// import {
//   Mic, MapPin, Phone, Clock, Shield,
//   Search, AlertCircle, Star, Zap, Users,
//   Sparkles, Moon, Sun, Heart, ShieldCheck, Bell
// } from 'lucide-react';

// export default function Home() {
//   const [showOnboarding, setShowOnboarding] = useState(true);
//   const [searchResults, setSearchResults] = useState([]);
//   const [userCity, setUserCity] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchType, setSearchType] = useState(null);
//   const [aiResponse, setAiResponse] = useState(null);

//   // Pharmacies de garde du jour
//   const [gardesDuJour, setGardesDuJour] = useState(null);
//   const [loadingGardes, setLoadingGardes] = useState(true);

//   const { isListening, transcript, startListening, error: voiceError } = useVoice();
//   const { location, loading: locationLoading } = useLocation();

//   // Chargement des gardes
//   useEffect(() => {
//     fetch('/data/gardes_du_jour.json')
//       .then(res => {
//         if (!res.ok) throw new Error('Fichier non trouvé');
//         return res.json();
//       })
//       .then(data => {
//         setGardesDuJour(data);
//         setLoadingGardes(false);
//       })
//       .catch(err => {
//         console.error('Erreur chargement gardes:', err);
//         setLoadingGardes(false);
//       });
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     if (location) {
//       setTimeout(() => {
//         setUserCity(location.lat > 4.0 ? 'Douala' : 'Yaoundé');
//       }, 1000);
//     }
//   }, [location]);

//   // Recherche vocale → déclenche la recherche
//   useEffect(() => {
//     if (transcript) {
//       setSearchQuery(transcript);
//       performSearch(transcript);
//     }
//   }, [transcript]);

//   const performSearch = async (query) => {
//     setIsLoading(true);
//     setAiResponse(null);
//     setSearchType(null);

//     const lowerQuery = query.toLowerCase();
//     const isGardeQuery = lowerQuery.includes('garde') || lowerQuery.includes('nuit') || lowerQuery.includes('urgence') || lowerQuery.includes('24h') || lowerQuery.includes('ouvert');

//     // Priorité : pharmacies de garde
//     if (isGardeQuery && gardesDuJour && !loadingGardes) {
//       const regionKey = userCity === 'Douala' ? 'Littoral' : 'Centre';
//       let gardes = gardesDuJour.regions[regionKey] || [];

//       // Si pas dans la ville principale, chercher dans toutes
//       if (gardes.length === 0) {
//         gardes = Object.values(gardesDuJour.regions).flat();
//       }

//       if (gardes.length > 0) {
//         setSearchType('garde_du_jour');
//         setSearchResults(gardes.map((ph, i) => ({
//           ...ph,
//           id: `garde_${i}`,
//           distance: null,
//           isGarde: true
//         })));
//         setIsLoading(false);
//         return;
//       }
//     }

//     // Sinon : recherche générale
//     const queryInfo = analyzeQuery(query);
//     const city = queryInfo.ville || userCity || 'Yaoundé';

//     try {
//       const searchResult = await hybridPharmacySearch(query, city, location);

//       if (searchResult.type === 'local_database') {
//         setSearchType('local');
//         setSearchResults(searchResult.results || []);
//       } else if (searchResult.type === 'ai_assisted') {
//         setSearchType('ai');
//         setAiResponse(searchResult);
//         setSearchResults([]);
//       } else if (searchResult.type === 'fallback') {
//         setSearchType('fallback');
//         setAiResponse(searchResult);
//         setSearchResults([]);
//       }
//     } catch (error) {
//       console.error('Erreur recherche:', error);
//       const oldResults = require('../src/lib/pharmacies').searchPharmacies(query, city, location);
//       setSearchType('local');
//       setSearchResults(oldResults);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTextSearch = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       performSearch(searchQuery);
//     }
//   };

//   const handleOnboardingComplete = () => {
//     setShowOnboarding(false);
//   };

//   // Composants AI et Fallback (inchangés)
//   const AIResponseDisplay = ({ response }) => { /* ... ton code existant ... */ };
//   const FallbackDisplay = ({ response }) => { /* ... ton code existant ... */ };

//   if (showOnboarding) {
//     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
//   }

//   return (
//     <div className="relative pt-4 pb-32 md:pb-24 md:py-20 bg-gradient-to-b from-secondary to-black min-h-screen">
//       {/* Header */}
//       <header className="sticky top-0 z-50 backdrop-blur-lg bg-secondary/80 border-b border-gray-800/50 safe-area-padding">
//         {/* ... ton header inchangé ... */}
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-6">
//         <div className="pt-4 md:py-[4em]">

//           {/* Pharmacies de garde du jour (quand pas de recherche) */}
//           {!searchQuery && gardesDuJour && !loadingGardes && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="max-w-4xl mx-auto mb-12"
//             >
//               <div className="bg-gradient-to-r from-red-600/20 to-transparent border border-red-600/30 rounded-2xl p-6">
//                 <div className="flex items-center gap-4 mb-6">
//                   <Clock className="text-red-500" size={32} />
//                   <div>
//                     <h3 className="text-2xl font-bold text-white">Pharmacies de garde aujourd'hui</h3>
//                     <p className="text-red-400 text-lg">{gardesDuJour.periode}</p>
//                     <p className="text-gray-400 text-sm">
//                       Mis à jour le {new Date(gardesDuJour.maj).toLocaleDateString('fr-FR')}
//                     </p>
//                   </div>
//                 </div>

//                 {['Centre', 'Littoral', 'Ouest', 'Adamaoua'].map(region => {
//                   const pharmacies = gardesDuJour.regions[region] || [];
//                   if (pharmacies.length === 0) return null;

//                   return (
//                     <div key={region} className="mb-8 last:mb-0">
//                       <h4 className="text-xl font-semibold text-primary mb-4">
//                         {region === 'Centre' ? 'Yaoundé et environs' : 
//                          region === 'Littoral' ? 'Douala et environs' : region} 
//                         ({pharmacies.length})
//                       </h4>
//                       <div className="grid gap-4">
//                         {pharmacies.slice(0, 8).map((ph, i) => (
//                           <PharmacyCard
//                             key={i}
//                             pharmacy={ph}
//                             isGarde={true}
//                             isRecommended={i === 0}
//                           />
//                         ))}
//                       </div>
//                       {pharmacies.length > 8 && (
//                         <p className="text-center text-gray-500 mt-3">
//                           + {pharmacies.length - 8} autres
//                         </p>
//                       )}
//                     </div>
//                   );
//                 })}

//                 <div className="text-center mt-8">
//                   <a
//                     href="/gardes"
//                     className="inline-flex items-center gap-3 px-8 py-4 bg-primary/20 border-2 border-primary rounded-2xl text-primary font-bold text-lg hover:bg-primary/30 transition touch-target"
//                   >
//                     <Clock size={24} />
//                     Voir toutes les pharmacies de garde
//                   </a>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Hero Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-8 md:mb-10"
//           >
//             <div className="inline-flex items-center space-x-2 mb-3 md:mb-4 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full border border-primary/20">
//               <Sparkles size={14} className="text-primary" />
//               <span className="text-xs md:text-sm text-primary font-medium">Urgence 24h/24</span>
//             </div>

//             <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
//               <span className="text-white">Trouvez une pharmacie</span>
//               <br />
//               <span className="bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
//                 en parlant
//               </span>
//             </h2>

//             <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base px-4">
//               Dites "pharmacie de garde", "ouverte maintenant", "près de Bastos", etc.
//             </p>
//           </motion.div>

//           {/* Barre de recherche texte */}
//           <div className="max-w-2xl mx-auto mb-12">
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//                 <Search size={18} />
//               </div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleTextSearch}
//                 placeholder="Ex: 'Pharmacie de garde Bastos' ou 'ouverte maintenant'"
//                 className="w-full pl-12 pr-28 py-4 bg-secondary-light border border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-base"
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={() => searchQuery.trim() && performSearch(searchQuery)}
//                 disabled={isLoading || !searchQuery.trim()}
//                 className="absolute right-2 top-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 text-base touch-target"
//               >
//                 {isLoading ? (
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <>
//                     <Search size={18} />
//                     Chercher
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Loading, résultats, AI, fallback */}
//           {isLoading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="max-w-4xl mx-auto text-center py-12"
//             >
//               <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
//               <p className="text-xl text-gray-300">Recherche en cours...</p>
//             </motion.div>
//           )}

//           <AnimatePresence>
//             {!isLoading && (
//               <>
//                 {searchType === 'ai' && aiResponse && <AIResponseDisplay response={aiResponse} />}
//                 {searchType === 'fallback' && aiResponse && <FallbackDisplay response={aiResponse} />}

//                 {searchResults.length > 0 ? (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
//                     <div className="flex justify-between items-center mb-8">
//                       <div>
//                         <h3 className="text-2xl font-bold text-white">
//                           {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
//                         </h3>
//                         {searchType === 'garde_du_jour' && (
//                           <p className="text-red-400 text-lg font-semibold mt-1">Pharmacies de garde ouvertes maintenant</p>
//                         )}
//                         <p className="text-gray-400">Pour "{transcript || searchQuery}"</p>
//                       </div>
//                       <button
//                         onClick={() => {
//                           setSearchResults([]);
//                           setSearchQuery('');
//                           setSearchType(null);
//                         }}
//                         className="px-6 py-3 bg-secondary-light rounded-xl text-gray-300 hover:bg-gray-800 transition"
//                       >
//                         Nouvelle recherche
//                       </button>
//                     </div>

//                     <div className="grid gap-4">
//                       {searchResults.map((pharmacy, index) => (
//                         <PharmacyCard
//                           key={pharmacy.id}
//                           pharmacy={pharmacy}
//                           distance={pharmacy.distance}
//                           isRecommended={index === 0}
//                           isGarde={searchType === 'garde_du_jour'}
//                         />
//                       ))}
//                     </div>
//                   </motion.div>
//                 ) : searchQuery && !aiResponse ? (
//                   // Message aucune trouvée
//                   <div className="text-center py-16">
//                     <AlertCircle size={64} className="text-gray-500 mx-auto mb-4" />
//                     <p className="text-xl text-gray-300">Aucune pharmacie trouvée</p>
//                     <p className="text-gray-500 mt-2">Essayez "pharmacie de garde" ou "près de moi"</p>
//                   </div>
//                 ) : !searchQuery && !isLoading ? (
//                   // Suggestions quand pas de recherche
//                   <div className="text-center py-12">
//                     <p className="text-gray-300 text-lg mb-8">
//                       Appuyez sur le bouton vocal et dites ce que vous cherchez
//                     </p>
//                     <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
//                       {['Pharmacie de garde', 'Ouverte maintenant', 'Près de moi', 'Bastos', 'Akwa', 'Urgence'].map(s => (
//                         <button
//                           key={s}
//                           onClick={() => performSearch(s)}
//                           className="px-5 py-3 bg-secondary-light border border-gray-700 rounded-full text-gray-300 hover:border-primary hover:text-primary transition"
//                         >
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ) : null}
//               </>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>

//       {/* Bouton vocal unique flottant central */}
//       <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
//         <div className="relative">
//           <MicrophoneButton
//             isListening={isListening}
//             onClick={startListening}
//             disabled={isLoading}
//             size="extra-large" // ou ajuste la taille dans le composant
//           />

//           {/* Effet pulse quand on écoute */}
//           {isListening && (
//             <>
//               <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
//               <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
//               <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-xl animate-pulse" />
//             </>
//           )}
//         </div>

//         {/* Texte sous le bouton */}
//         <p className="text-center mt-3 text-sm text-gray-400">
//           {isListening ? 'ÉCOUTE...' : 'Appuyez et parlez'}
//         </p>
//       </div>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-secondary/95 border-t border-gray-800/50 safe-area-padding">
//         {/* ... ta bottom nav inchangée ... */}
//       </nav>

//       <div className="fixed bottom-16 right-4 text-xs text-gray-600">
//         v1.0 • Pharmacam
//       </div>
//     </div>
//   );
// } 





























































































// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// import PharmacyCard from '../src/components/ui/PharmacyCard';
// import { useVoice } from '../src/hooks/useVoice';
// import { useLocation } from '../src/hooks/useLocation';
// import { hybridPharmacySearch, analyzeQuery, searchNormalPharmacies } from '../src/lib/pharmacies';

// // Icônes Lucide React
// import {
//   Mic, MapPin, Phone, Clock, Shield,
//   Search, AlertCircle, Star, Zap, Users,
//   Sparkles, Moon, Sun, Heart, ShieldCheck, Bell,
//   Building2, Crosshair, ChevronLeft, Filter, X, Navigation,
//   Info, Mail, Globe, ExternalLink
// } from 'lucide-react';

// export default function Home() {
//   const [showOnboarding, setShowOnboarding] = useState(true);
//   const [searchResults, setSearchResults] = useState([]);
//   const [userCity, setUserCity] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchType, setSearchType] = useState(null);
//   const [aiResponse, setAiResponse] = useState(null);
  
//   // États pour la nouvelle approche
//   const [showRegionSelection, setShowRegionSelection] = useState(false);
//   const [selectedRegion, setSelectedRegion] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [gardesData, setGardesData] = useState(null);
//   const [loadingGardes, setLoadingGardes] = useState(false);
//   const [selectedPharmacy, setSelectedPharmacy] = useState(null);
//   const [viewMode, setViewMode] = useState('home'); // 'home', 'region', 'city', 'results'

//   const { isListening, transcript, startListening, error: voiceError } = useVoice();
//   const { location, loading: locationLoading } = useLocation();

//   // Variables de couleur
//   const REGION_COLORS = {
//     'Centre': 'from-green-500 to-green-700',
//     'Littoral': 'from-blue-500 to-blue-700',
//     'Ouest': 'from-purple-500 to-purple-700',
//     'Adamaoua': 'from-orange-500 to-orange-700',
//     'Est': 'from-red-500 to-red-700',
//     'Nord': 'from-yellow-500 to-yellow-700',
//     'Sud': 'from-teal-500 to-teal-700'
//   };

//   // Chargement initial des données
//   useEffect(() => {
//     loadGardesData();
    
//     // Déterminer la ville par défaut selon la localisation
//     if (location) {
//       const city = location.lat > 4.0 ? 'Douala' : 'Yaoundé';
//       setUserCity(city);
//     }
//   }, [location]);

//   const loadGardesData = async () => {
//     setLoadingGardes(true);
//     try {
//       // const response = await fetch('/data/gardes_du_jour.json');
//       const response = await fetch('/data/gardes_du_jour_clean.json');
//       if (!response.ok) throw new Error('Fichier non trouvé');
//       const data = await response.json();
//       setGardesData(data);
//     } catch (error) {
//       console.error('Erreur chargement gardes:', error);
//       // Données de secours
//       setGardesData({
//         periode: "Aujourd'hui",
//         maj: new Date().toISOString(),
//         regions: {
//           'Centre': [],
//           'Littoral': [],
//           'Ouest': [],
//           'Adamaoua': []
//         }
//       });
//     } finally {
//       setLoadingGardes(false);
//     }
//   };

//   // Recherche vocale
//   useEffect(() => {
//     if (transcript) {
//       setSearchQuery(transcript);
//       handleVoiceCommand(transcript);
//     }
//   }, [transcript]);

//   const handleVoiceCommand = (command) => {
//     const lowerCommand = command.toLowerCase();
    
//     if (lowerCommand.includes('pharmacie de garde') || lowerCommand.includes('garde')) {
//       handleGardeSearch();
//     } else if (lowerCommand.includes('pharmacie normale') || lowerCommand.includes('pharmacie')) {
//       performSearch(command, 'normal');
//     } else {
//       performSearch(command);
//     }
//   };

//   const handleGardeSearch = () => {
//     setShowRegionSelection(true);
//     setViewMode('region');
//     setSearchType('garde');
//     setSearchResults([]);
//   };

//   const handleRegionSelect = (region) => {
//     setSelectedRegion(region);
//     setViewMode('city');
    
//     // Récupérer les villes uniques pour cette région
//     if (gardesData?.regions[/app/page.jsxregion]) {
//       const pharmacies = gardesData.regions[region];
//       const villes = [...new Set(pharmacies.map(p => p.ville || p.localisation?.split(',')[0] || 'Ville inconnue'))];
//       setSelectedCity({ region, villes });
//     }
//   };

//   const handleCitySelect = (cityName) => {
//     if (!selectedRegion || !gardesData) return;
    
//     const pharmacies = gardesData.regions[selectedRegion].filter(pharmacy => {
//       const pharmacyCity = pharmacy.ville || pharmacy.localisation?.split(',')[0] || '';
//       return pharmacyCity.includes(cityName) || cityName.includes(pharmacyCity);
//     });
    
//     setSearchResults(pharmacies.map((ph, i) => ({
//       ...ph,
//       id: `garde_${selectedRegion}_${cityName}_${i}`,
//       type: 'garde',
//       isGarde: true
//     })));
    
//     setViewMode('results');
//     setSearchType('garde_city');
//   };

//   const handlePharmacySelect = (pharmacy) => {
//     setSelectedPharmacy(pharmacy);
//     // Créer un modal pour afficher les détails
//     showPharmacyDetails(pharmacy);
//   };

//   const showPharmacyDetails = (pharmacy) => {
//     // Fonction pour afficher les détails dans un modal
//     const detailsModal = document.createElement('div');
//     detailsModal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80';
//     detailsModal.innerHTML = `
//       <div class="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
//         <div class="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
//           <h3 class="text-xl font-bold text-white">Détails de la pharmacie</h3>
//           <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
//             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         <div class="p-6">
//           <div class="flex items-start gap-4 mb-6">
//             <div class="w-16 h-16 bg-gradient-to-br ${pharmacy.type === 'garde' ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700'} rounded-xl flex items-center justify-center">
//               <Building2 class="text-white" size={32} />
//             </div>
//             <div class="flex-1">
//               <h4 class="text-2xl font-bold text-white mb-2">${pharmacy.nom}</h4>
//               ${pharmacy.type === 'garde' ? 
//                 '<div class="inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full mb-2"><Clock size={16} class="text-green-400" /><span class="text-green-400 font-medium">Pharmacie de garde</span></div>' : 
//                 '<div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 rounded-full mb-2"><Building2 size={16} class="text-blue-400" /><span class="text-blue-400 font-medium">Pharmacie normale</span></div>'
//               }
//             </div>
//           </div>
          
//           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div class="space-y-4">
//               <div>
//                 <h5 class="text-sm text-gray-400 mb-2">Adresse</h5>
//                 <div class="flex items-start gap-2">
//                   <MapPin class="text-green-500 mt-0.5" size={18} />
//                   <p class="text-white">${pharmacy.adresse || pharmacy.localisation || 'Non spécifiée'}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <h5 class="text-sm text-gray-400 mb-2">Téléphone</h5>
//                 <div class="flex items-center gap-2">
//                   <Phone class="text-green-500" size={18} />
//                   <a href="tel:${pharmacy.telephone || ''}" class="text-green-400 hover:text-green-300">${pharmacy.telephone || 'Non disponible'}</a>
//                 </div>
//               </div>
              
//               <div>
//                 <h5 class="text-sm text-gray-400 mb-2">Horaires</h5>
//                 <div class="flex items-center gap-2">
//                   <Clock class="text-green-500" size={18} />
//                   <span class="text-white">${pharmacy.horaires || (pharmacy.type === 'garde' ? '24h/24 - Service de garde' : 'Horaires standards')}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div class="space-y-4">
//               ${pharmacy.services ? `
//                 <div>
//                   <h5 class="text-sm text-gray-400 mb-2">Services</h5>
//                   <p class="text-white">${pharmacy.services}</p>
//                 </div>
//               ` : ''}
              
//               ${pharmacy.notes ? `
//                 <div>
//                   <h5 class="text-sm text-gray-400 mb-2">Notes</h5>
//                   <p class="text-white">${pharmacy.notes}</p>
//                 </div>
//               ` : ''}
              
//               ${pharmacy.type === 'garde' ? `
//                 <div class="p-4 bg-green-600/10 border border-green-600/20 rounded-xl">
//                   <div class="flex items-center gap-2 mb-2">
//                     <Shield class="text-green-500" size={20} />
//                     <span class="text-green-400 font-semibold">Service d'urgence</span>
//                   </div>
//                   <p class="text-green-300 text-sm">Cette pharmacie assure le service de garde. Ouverte 24h/24 pour les urgences.</p>
//                 </div>
//               ` : ''}
//             </div>
//           </div>
          
//           <div class="flex gap-3 mt-8 pt-6 border-t border-gray-800">
//             <button onclick="window.open('tel:${pharmacy.telephone || ''}', '_self')" 
//                     class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${!pharmacy.telephone ? 'opacity-50 cursor-not-allowed' : ''}"
//                     ${!pharmacy.telephone ? 'disabled' : ''}>
//               <Phone size={20} />
//               Appeler
//             </button>
//             <button onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(pharmacy.adresse || pharmacy.localisation || '')}', '_blank')"
//                     class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2">
//               <Navigation size={20} />
//               Itinéraire
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(detailsModal);
    
//     // Ajouter l'event listener pour le bouton de fermeture
//     detailsModal.querySelector('button').onclick = () => detailsModal.remove();
//   };

//   const performSearch = async (query, type = 'all') => {
//     setIsLoading(true);
//     setAiResponse(null);
//     setSearchType(null);
//     setShowRegionSelection(false);
//     setViewMode('results');

//     const queryInfo = analyzeQuery(query);
//     const city = queryInfo.ville || userCity || 'Yaoundé';

//     try {
//       if (type === 'normal') {
//         // Recherche uniquement les pharmacies normales
//         const normalResults = searchNormalPharmacies(query, city, location);
//         setSearchResults(normalResults.map((ph, i) => ({
//           ...ph,
//           id: `normal_${i}`,
//           type: 'normal',
//           isGarde: false
//         })));
//         setSearchType('normal');
//       } else {
//         // Recherche hybride
//         const searchResult = await hybridPharmacySearch(query, city, location);

//         if (searchResult.type === 'local_database') {
//           setSearchType('local');
//           setSearchResults((searchResult.results || []).map((ph, i) => ({
//             ...ph,
//             id: `hybrid_${i}`,
//             type: ph.isGarde ? 'garde' : 'normal',
//             isGarde: ph.isGarde || false
//           })));
//         } else if (searchResult.type === 'ai_assisted') {
//           setSearchType('ai');
//           setAiResponse(searchResult);
//           setSearchResults([]);
//         } else if (searchResult.type === 'fallback') {
//           setSearchType('fallback');
//           setAiResponse(searchResult);
//           setSearchResults([]);
//         }
//       }
//     } catch (error) {
//       console.error('Erreur recherche:', error);
//       setSearchType('error');
//       setSearchResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTextSearch = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       const lowerQuery = searchQuery.toLowerCase();
//       if (lowerQuery.includes('garde')) {
//         handleGardeSearch();
//       } else {
//         performSearch(searchQuery);
//       }
//     }
//   };

//   const handleOnboardingComplete = () => {
//     setShowOnboarding(false);
//   };

//   const goBack = () => {
//     switch(viewMode) {
//       case 'results':
//         if (searchType === 'garde_city') {
//           setViewMode('city');
//           setSearchResults([]);
//         } else {
//           setViewMode('home');
//           setSearchResults([]);
//           setSearchType(null);
//         }
//         break;
//       case 'city':
//         setViewMode('region');
//         setSelectedCity(null);
//         break;
//       case 'region':
//         setViewMode('home');
//         setShowRegionSelection(false);
//         setSelectedRegion(null);
//         break;
//       default:
//         setViewMode('home');
//     }
//   };

//   const handleQuickAction = (action) => {
//     switch(action) {
//       case 'garde':
//         handleGardeSearch();
//         break;
//       case 'normal':
//         performSearch('pharmacies', 'normal');
//         break;
//       case 'urgence':
//         performSearch('pharmacie urgence 24h');
//         break;
//       case 'near':
//         performSearch('pharmacie près de moi');
//         break;
//       default:
//         performSearch(action);
//     }
//   };

//   // Composants d'affichage
//   const AIResponseDisplay = ({ response }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-4xl mx-auto mb-8"
//     >
//       <div className="bg-gradient-to-r from-green-600/20 to-transparent border border-green-600/30 rounded-2xl p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <Sparkles className="text-green-500" size={24} />
//           <h3 className="text-xl font-bold text-white">Réponse IA</h3>
//         </div>
//         <p className="text-gray-200 mb-4">{response.message}</p>
//         {response.suggestions && (
//           <div className="mt-4">
//             <p className="text-sm text-gray-400 mb-2">Suggestions :</p>
//             <div className="flex flex-wrap gap-2">
//               {response.suggestions.map((sugg, i) => (
//                 <button
//                   key={i}
//                   onClick={() => performSearch(sugg)}
//                   className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-full text-green-300 text-sm hover:bg-green-600/30 transition"
//                 >
//                   {sugg}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );

//   const FallbackDisplay = ({ response }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-4xl mx-auto mb-8"
//     >
//       <div className="bg-gradient-to-r from-yellow-600/20 to-transparent border border-yellow-600/30 rounded-2xl p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <AlertCircle className="text-yellow-500" size={24} />
//           <h3 className="text-xl font-bold text-white">Recherche étendue</h3>
//         </div>
//         <p className="text-gray-200">{response.message}</p>
//       </div>
//     </motion.div>
//   );

//   if (showOnboarding) {
//     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
//   }

//   return (
//     <div className="relative pt-4 pb-32 md:pb-24 bg-gradient-to-b from-gray-900 to-black min-h-screen">
//       {/* Header */}
//       <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50 safe-area-padding">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             {viewMode !== 'home' ? (
//               <button
//                 onClick={goBack}
//                 className="flex items-center gap-2 text-gray-300 hover:text-white transition"
//               >
//                 <ChevronLeft size={24} />
//                 <span className="hidden md:inline">Retour</span>
//               </button>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
//                   <Crosshair className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-white">Pharmacam</h1>
//                   <p className="text-xs text-gray-400">Trouvez votre pharmacie</p>
//                 </div>
//               </div>
//             )}
            
//             <div className="flex items-center gap-4">
//               {viewMode === 'home' && userCity && (
//                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
//                   <MapPin size={16} className="text-green-500" />
//                   <span className="text-sm text-gray-300">{userCity}</span>
//                 </div>
//               )}
              
//               <button 
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-6">
//         <AnimatePresence mode="wait">
//           {viewMode === 'home' && (
//             <motion.div
//               key="home"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="pt-4 md:pt-8"
//             >
//               {/* Hero Section */}
//               <div className="text-center mb-8 md:mb-12">
//                 <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-green-600/10 rounded-full border border-green-600/20">
//                   <Sparkles size={16} className="text-green-400" />
//                   <span className="text-sm md:text-base text-green-400 font-medium">Recherche Vocale</span>
//                 </div>

//                 <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
//                   <span className="text-white">Trouvez votre</span>
//                   <br />
//                   <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                     pharmacie
//                   </span>
//                 </h1>

//                 <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4 mb-8">
//                   Dites "pharmacie de garde" ou "pharmacie normale" pour commencer
//                 </p>

//                 {/* Quick Actions */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto mb-8">
//                   <button
//                     onClick={() => handleQuickAction('garde')}
//                     className="bg-gradient-to-br from-green-600 to-green-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition group"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <Clock size={28} className="md:size-12" />
//                       <span className="font-semibold text-sm md:text-base">De garde</span>
//                       <span className="text-xs text-green-200">Urgence 24h/24</span>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleQuickAction('normal')}
//                     className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <Building2 size={28} className="md:size-12" />
//                       <span className="font-semibold text-sm md:text-base">Normales</span>
//                       <span className="text-xs text-blue-200">Horaires réguliers</span>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleQuickAction('urgence')}
//                     className="bg-gradient-to-br from-red-600 to-red-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <Zap size={28} className="md:size-12" />
//                       <span className="font-semibold text-sm md:text-base">Urgence</span>
//                       <span className="text-xs text-red-200">Besoin immédiat</span>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleQuickAction('near')}
//                     className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <Navigation size={28} className="md:size-12" />
//                       <span className="font-semibold text-sm md:text-base">Proche</span>
//                       <span className="text-xs text-purple-200">À côté de moi</span>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Barre de recherche */}
//               <div className="max-w-3xl mx-auto mb-8">
//                 <div className="relative">
//                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
//                     <Search size={20} />
//                   </div>
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={handleTextSearch}
//                     placeholder="Tapez ou dites 'pharmacie de garde' ou 'pharmacie normale'..."
//                     className="w-full pl-12 pr-32 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition text-base md:text-lg"
//                     disabled={isLoading}
//                   />
//                   <button
//                     onClick={() => searchQuery.trim() && performSearch(searchQuery)}
//                     disabled={isLoading || !searchQuery.trim()}
//                     className="absolute right-2 top-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 text-base"
//                   >
//                     {isLoading ? (
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <>
//                         <Search size={18} />
//                         Chercher
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Quick suggestions */}
//                 <div className="flex flex-wrap justify-center gap-2 mt-4">
//                   {['Pharmacie de garde Yaoundé', 'Pharmacie normale Douala', 'Urgence 24h', 'Près de Bastos'].map((s, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setSearchQuery(s)}
//                       className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:border-green-500 hover:text-green-400 transition text-xs md:text-sm"
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Stats ou informations */}
//               <div className="max-w-3xl mx-auto text-center">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
//                     <p className="text-2xl font-bold text-green-400">24h/24</p>
//                     <p className="text-gray-400 text-sm">Service d'urgence</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
//                     <p className="text-2xl font-bold text-blue-400">200+</p>
//                     <p className="text-gray-400 text-sm">Pharmacies</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
//                     <p className="text-2xl font-bold text-purple-400">10+</p>
//                     <p className="text-gray-400 text-sm">Régions</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
//                     <p className="text-2xl font-bold text-yellow-400">100%</p>
//                     <p className="text-gray-400 text-sm">Gratuit</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {viewMode === 'region' && (
//             <motion.div
//               key="region"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="pt-4"
//             >
//               <div className="max-w-4xl mx-auto">
//                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
//                   Sélectionnez une région
//                 </h2>
//                 <p className="text-gray-400 mb-8">
//                   Choisissez la région pour voir les pharmacies de garde disponibles
//                 </p>

//                 {loadingGardes ? (
//                   <div className="text-center py-12">
//                     <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
//                     <p className="text-gray-300">Chargement des régions...</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.keys(gardesData?.regions || {}).map((region) => {
//                       const pharmacyCount = gardesData.regions[region]?.length || 0;
//                       const colorClass = REGION_COLORS[region] || 'from-green-500 to-green-700';
                      
//                       return (
//                         <button
//                           key={region}
//                           onClick={() => handleRegionSelect(region)}
//                           className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl text-white hover:opacity-90 transition text-left relative overflow-hidden group`}
//                         >
//                           <div className="relative z-10">
//                             <h3 className="text-xl font-bold mb-2">{region}</h3>
//                             <p className="text-sm opacity-90">
//                               {pharmacyCount} pharmacie{pharmacyCount > 1 ? 's' : ''} de garde
//                             </p>
//                             {region === 'Centre' && (
//                               <p className="text-xs opacity-75 mt-1">Yaoundé et environs</p>
//                             )}
//                             {region === 'Littoral' && (
//                               <p className="text-xs opacity-75 mt-1">Douala et environs</p>
//                             )}
//                           </div>
                          
//                           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20 group-hover:opacity-30 transition">
//                             <Building2 size={64} />
//                           </div>
                          
//                           <div className="absolute bottom-0 right-0 left-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}

//           {viewMode === 'city' && selectedCity && (
//             <motion.div
//               key="city"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="pt-4"
//             >
//               <div className="max-w-4xl mx-auto">
//                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
//                   {selectedRegion}
//                 </h2>
//                 <p className="text-gray-400 mb-8">
//                   Sélectionnez une ville pour voir les pharmacies de garde
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                   {selectedCity.villes.map((ville, index) => {
//                     const villePharmacies = gardesData.regions[selectedRegion]?.filter(p => {
//                       const pharmacyCity = p.ville || p.localisation?.split(',')[0] || '';
//                       return pharmacyCity.includes(ville) || ville.includes(pharmacyCity);
//                     }) || [];
                    
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => handleCitySelect(ville)}
//                         className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 hover:bg-gray-800/50 transition text-left group"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-semibold text-white text-lg">{ville}</h3>
//                           <div className="px-2 py-1 bg-green-600/20 rounded-full">
//                             <span className="text-green-400 text-sm font-medium">
//                               {villePharmacies.length}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-gray-400 text-sm">
//                           {villePharmacies.length} pharmacie{villePharmacies.length > 1 ? 's' : ''} de garde
//                         </p>
//                         <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
//                           <Clock size={14} />
//                           <span>Service 24h/24</span>
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {viewMode === 'results' && (
//             <motion.div
//               key="results"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="pt-4"
//             >
//               {isLoading ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
//                   <p className="text-gray-300">Recherche en cours...</p>
//                 </div>
//               ) : (
//                 <>
//                   {searchType === 'ai' && aiResponse && <AIResponseDisplay response={aiResponse} />}
//                   {searchType === 'fallback' && aiResponse && <FallbackDisplay response={aiResponse} />}

//                   {searchResults.length > 0 ? (
//                     <div className="max-w-6xl mx-auto">
//                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//                         <div>
//                           <h2 className="text-2xl font-bold text-white">
//                             {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
//                           </h2>
//                           {searchType === 'garde_city' && selectedRegion && (
//                             <p className="text-green-400 text-lg">
//                               Pharmacies de garde à {selectedRegion}
//                             </p>
//                           )}
//                           <p className="text-gray-400">
//                             {searchType === 'garde' ? 'Pharmacies de garde' : 
//                              searchType === 'normal' ? 'Pharmacies normales' : 
//                              'Résultats de recherche'}
//                           </p>
//                         </div>

//                         <div className="flex gap-3">
//                           {searchType === 'garde_city' && (
//                             <button
//                               onClick={() => setViewMode('city')}
//                               className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition"
//                             >
//                               Changer de ville
//                             </button>
//                           )}
//                           <button
//                             onClick={() => {
//                               setViewMode('home');
//                               setSearchResults([]);
//                               setSearchQuery('');
//                             }}
//                             className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
//                           >
//                             Nouvelle recherche
//                           </button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         {searchResults.map((pharmacy, index) => (
//                           <div key={pharmacy.id || index} onClick={() => handlePharmacySelect(pharmacy)}>
//                             <PharmacyCard
//                               pharmacy={pharmacy}
//                               distance={pharmacy.distance}
//                               isRecommended={index === 0}
//                               isGarde={pharmacy.type === 'garde'}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-12">
//                       <AlertCircle size={64} className="text-gray-500 mx-auto mb-4" />
//                       <p className="text-xl text-gray-300">Aucun résultat trouvé</p>
//                       <p className="text-gray-500 mt-2">Essayez une autre recherche</p>
//                       <button
//                         onClick={() => setViewMode('home')}
//                         className="mt-6 px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
//                       >
//                         Retour à l'accueil
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>

//       {/* Bouton vocal (visible uniquement sur home et results) */}
//       {(viewMode === 'home' || viewMode === 'results') && (
//         <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
//           <div className="relative">
//             <MicrophoneButton
//               isListening={isListening}
//               onClick={startListening}
//               disabled={isLoading}
//               size="extra-large"
//             />

//             {isListening && (
//               <>
//                 <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping" />
//                 <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
//               </>
//             )}
//           </div>

//           <p className="text-center mt-3 text-sm text-gray-400">
//             {isListening ? 'PARLEZ MAINTENANT...' : 'Appuyez et parlez'}
//           </p>
//         </div>
//       )}

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-gray-900/95 border-t border-gray-800/50 safe-area-padding">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex justify-around">
//             <button
//               onClick={() => setViewMode('home')}
//               className={`flex flex-col items-center gap-1 p-2 ${viewMode === 'home' ? 'text-green-500' : 'text-gray-500'}`}
//             >
//               <Search size={22} />
//               <span className="text-xs">Accueil</span>
//             </button>
            
//             <button
//               onClick={() => handleQuickAction('garde')}
//               className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-500 transition"
//             >
//               <Clock size={22} />
//               <span className="text-xs">Garde</span>
//             </button>
            
//             <button
//               onClick={() => handleQuickAction('normal')}
//               className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-500 transition"
//             >
//               <Building2 size={22} />
//               <span className="text-xs">Normales</span>
//             </button>
            
//             <button className="flex flex-col items-center gap-1 p-2 text-gray-500">
//               <Heart size={22} />
//               <span className="text-xs">Favoris</span>
//             </button>
//           </div>
//         </div>
//       </nav>
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
import { hybridPharmacySearch, analyzeQuery, searchNormalPharmacies } from '../src/lib/pharmacies';
import Image from "next/image";

// IMPORT DIRECT DU FICHIER JSON
import pharmaciesData from '../src/data/pharmacies.json';

// Icônes Lucide React
import {
  Mic, MapPin, Phone, Clock, Shield,
  Search, AlertCircle, Star, Zap, Users,
  Sparkles, Moon, Sun, Heart, ShieldCheck, Bell,
  Building2, Crosshair, ChevronLeft, Filter, X, Navigation,
  Info, Mail, Globe, ExternalLink
} from 'lucide-react';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [userCity, setUserCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  
  // États pour la nouvelle approche
  const [showRegionSelection, setShowRegionSelection] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [gardesData, setGardesData] = useState(null);
  const [loadingGardes, setLoadingGardes] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [viewMode, setViewMode] = useState('home'); // 'home', 'region', 'city', 'results'

  const { isListening, transcript, startListening, error: voiceError } = useVoice();
  const { location, loading: locationLoading } = useLocation();

  // Variables de couleur
  const REGION_COLORS = {
    'Centre': 'from-green-500 to-green-700',
    'Littoral': 'from-blue-500 to-blue-700',
    'Ouest': 'from-purple-500 to-purple-700',
    'Adamaoua': 'from-orange-500 to-orange-700',
    'Est': 'from-red-500 to-red-700',
    'Nord': 'from-yellow-500 to-yellow-700',
    'Sud': 'from-teal-500 to-teal-700'
  };

  // ==================== FONCTION GÉOLOCALISATION ====================
  const findNearbyPharmacies = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        try {
          // UTILISATION DIRECTE DES DONNÉES IMPORTÉES
          const allPharmacies = pharmaciesData;
          
          // Calculer les distances
          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371e3;
            const φ1 = lat1 * Math.PI / 180;
            const φ2 = lat2 * Math.PI / 180;
            const Δφ = (lat2 - lat1) * Math.PI / 180;
            const Δλ = (lon2 - lon1) * Math.PI / 180;
            
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                      Math.cos(φ1) * Math.cos(φ2) *
                      Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            
            return R * c;
          };
          
          const pharmaciesWithDistance = allPharmacies.map(pharmacy => {
            if (!pharmacy.lat || !pharmacy.lng) {
              return { ...pharmacy, distance: Infinity };
            }
            
            const distance = calculateDistance(
              userLat,
              userLng,
              parseFloat(pharmacy.lat),
              parseFloat(pharmacy.lng)
            );
            
            return { ...pharmacy, distance };
          });
          
          // Filtrer et trier par distance
          const nearbyPharmacies = pharmaciesWithDistance
            .filter(p => p.distance < 10000 && p.distance !== Infinity)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 20);
          
          // Afficher les résultats
          setSearchResults(nearbyPharmacies.map((ph, i) => ({
            ...ph,
            id: `nearby_${i}`,
            type: 'normal',
            isGarde: false
          })));
          
          setSearchType('nearby');
          setViewMode('results');
          
        } catch (error) {
          console.error('Erreur recherche pharmacies proches:', error);
          alert("Erreur lors de la recherche des pharmacies proches");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        if (error.code === 1) {
          alert("Activez la localisation pour trouver les pharmacies proches de vous");
        } else {
          alert("Impossible d'obtenir votre position. Vérifiez votre connexion GPS.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Chargement initial des données
  useEffect(() => {
    loadGardesData();
    
    // Déterminer la ville par défaut selon la localisation
    if (location) {
      const city = location.lat > 4.0 ? 'Douala' : 'Yaoundé';
      setUserCity(city);
    }
  }, [location]);

  const loadGardesData = async () => {
    setLoadingGardes(true);
    try {
      const response = await fetch('/data/gardes_du_jour_clean.json');
      if (!response.ok) throw new Error('Fichier non trouvé');
      const data = await response.json();
      setGardesData(data);
    } catch (error) {
      console.error('Erreur chargement gardes:', error);
      setGardesData({
        periode: "Aujourd'hui",
        maj: new Date().toISOString(),
        regions: {
          'Centre': [],
          'Littoral': [],
          'Ouest': [],
          'Adamaoua': []
        }
      });
    } finally {
      setLoadingGardes(false);
    }
  };

  // Recherche vocale
  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('pharmacie de garde') || lowerCommand.includes('garde')) {
      handleGardeSearch();
    } else if (lowerCommand.includes('pharmacie normale') || lowerCommand.includes('pharmacie')) {
      performSearch(command, 'normal');
    } else {
      performSearch(command);
    }
  };

  const handleGardeSearch = () => {
    setShowRegionSelection(true);
    setViewMode('region');
    setSearchType('garde');
    setSearchResults([]);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setViewMode('city');
    
    if (gardesData?.regions[region]) {
      const pharmacies = gardesData.regions[region];
      const villes = [...new Set(pharmacies.map(p => p.ville || p.localisation?.split(',')[0] || 'Ville inconnue'))];
      setSelectedCity({ region, villes });
    }
  };

  const handleCitySelect = (cityName) => {
    if (!selectedRegion || !gardesData) return;
    
    const pharmacies = gardesData.regions[selectedRegion].filter(pharmacy => {
      const pharmacyCity = pharmacy.ville || pharmacy.localisation?.split(',')[0] || '';
      return pharmacyCity.includes(cityName) || cityName.includes(pharmacyCity);
    });
    
    setSearchResults(pharmacies.map((ph, i) => ({
      ...ph,
      id: `garde_${selectedRegion}_${cityName}_${i}`,
      type: 'garde',
      isGarde: true
    })));
    
    setViewMode('results');
    setSearchType('garde_city');
  };

  const handlePharmacySelect = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    showPharmacyDetails(pharmacy);
  };

  const showPharmacyDetails = (pharmacy) => {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80';
    detailsModal.innerHTML = `
      <div class="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">Détails de la pharmacie</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-16 h-16 bg-gradient-to-br ${pharmacy.type === 'garde' ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700'} rounded-xl flex items-center justify-center">
              <Building2 class="text-white" size={32} />
            </div>
            <div class="flex-1">
              <h4 class="text-2xl font-bold text-white mb-2">${pharmacy.nom}</h4>
              ${pharmacy.type === 'garde' ? 
                '<div class="inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full mb-2"><Clock size={16} class="text-green-400" /><span class="text-green-400 font-medium">Pharmacie de garde</span></div>' : 
                '<div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 rounded-full mb-2"><Building2 size={16} class="text-blue-400" /><span class="text-blue-400 font-medium">Pharmacie normale</span></div>'
              }
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h5 class="text-sm text-gray-400 mb-2">Adresse</h5>
                <div class="flex items-start gap-2">
                  <MapPin class="text-green-500 mt-0.5" size={18} />
                  <p class="text-white">${pharmacy.adresse || pharmacy.localisation || 'Non spécifiée'}</p>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm text-gray-400 mb-2">Téléphone</h5>
                <div class="flex items-center gap-2">
                  <Phone class="text-green-500" size={18} />
                  <a href="tel:${pharmacy.telephone || ''}" class="text-green-400 hover:text-green-300">${pharmacy.telephone || 'Non disponible'}</a>
                </div>
              </div>
              
              <div>
                <h5 class="text-sm text-gray-400 mb-2">Horaires</h5>
                <div class="flex items-center gap-2">
                  <Clock class="text-green-500" size={18} />
                  <span class="text-white">${pharmacy.horaires || (pharmacy.type === 'garde' ? '24h/24 - Service de garde' : 'Horaires standards')}</span>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              ${pharmacy.services ? `
                <div>
                  <h5 class="text-sm text-gray-400 mb-2">Services</h5>
                  <p class="text-white">${pharmacy.services}</p>
                </div>
              ` : ''}
              
              ${pharmacy.notes ? `
                <div>
                  <h5 class="text-sm text-gray-400 mb-2">Notes</h5>
                  <p class="text-white">${pharmacy.notes}</p>
                </div>
              ` : ''}
              
              ${pharmacy.type === 'garde' ? `
                <div class="p-4 bg-green-600/10 border border-green-600/20 rounded-xl">
                  <div class="flex items-center gap-2 mb-2">
                    <Shield class="text-green-500" size={20} />
                    <span class="text-green-400 font-semibold">Service d'urgence</span>
                  </div>
                  <p class="text-green-300 text-sm">Cette pharmacie assure le service de garde. Ouverte 24h/24 pour les urgences.</p>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="flex gap-3 mt-8 pt-6 border-t border-gray-800">
            <button onclick="window.open('tel:${pharmacy.telephone || ''}', '_self')" 
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${!pharmacy.telephone ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!pharmacy.telephone ? 'disabled' : ''}>
              <Phone size={20} />
              Appeler
            </button>
            <button onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(pharmacy.adresse || pharmacy.localisation || '')}', '_blank')"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2">
              <Navigation size={20} />
              Itinéraire
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(detailsModal);
    
    detailsModal.querySelector('button').onclick = () => detailsModal.remove();
  };

  const performSearch = async (query, type = 'all') => {
    setIsLoading(true);
    setAiResponse(null);
    setSearchType(null);
    setShowRegionSelection(false);
    setViewMode('results');

    const queryInfo = analyzeQuery(query);
    const city = queryInfo.ville || userCity || 'Yaoundé';

    try {
      if (type === 'normal') {
        // UTILISATION DIRECTE DES DONNÉES IMPORTÉES
        const allPharmacies = pharmaciesData;
        
        // Filtrer par ville
        const cityPharmacies = allPharmacies.filter(pharmacy => 
          pharmacy.ville === city
        );
        
        // Si pas de résultat dans cette ville, prendre toutes les pharmacies
        const results = cityPharmacies.length > 0 
          ? cityPharmacies 
          : allPharmacies.slice(0, 20);
        
        setSearchResults(results.map((ph, i) => ({
          ...ph,
          id: `normal_${city}_${i}`,
          type: 'normal',
          isGarde: false,
          ville: ph.ville
        })));
        setSearchType('normal');
      } else {
        // Recherche hybride
        const searchResult = await hybridPharmacySearch(query, city, location);

        if (searchResult.type === 'local_database') {
          setSearchType('local');
          setSearchResults((searchResult.results || []).map((ph, i) => ({
            ...ph,
            id: `hybrid_${i}`,
            type: ph.isGarde ? 'garde' : 'normal',
            isGarde: ph.isGarde || false
          })));
        } else if (searchResult.type === 'ai_assisted') {
          setSearchType('ai');
          setAiResponse(searchResult);
          setSearchResults([]);
        } else if (searchResult.type === 'fallback') {
          setSearchType('fallback');
          const lowerQuery = query.toLowerCase();
          let customMessage = searchResult.message;
          
          if (lowerQuery.includes('palais') || 
              lowerQuery.includes('spécifique') || 
              lowerQuery.includes('nom exact')) {
            customMessage = "Cette pharmacie spécifique n'est pas dans notre base. Consultez l'annuaire médical officiel.";
          } else if (searchResult.results && searchResult.results.length === 0) {
            customMessage = `Aucune pharmacie trouvée pour "${query}". Essayez avec un nom plus simple ou consultez l'annuaire médical.`;
          }
          
          searchResult.message = customMessage;
          setAiResponse(searchResult);
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchType('error');
      setAiResponse({
        type: 'error',
        message: "Erreur de recherche. Veuillez réessayer ou consulter l'annuaire médical.",
        suggestions: ['Recharger la page', 'Vérifier votre connexion']
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      if (lowerQuery.includes('garde')) {
        handleGardeSearch();
      } else {
        performSearch(searchQuery);
      }
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const goBack = () => {
    switch(viewMode) {
      case 'results':
        if (searchType === 'garde_city') {
          setViewMode('city');
          setSearchResults([]);
        } else {
          setViewMode('home');
          setSearchResults([]);
          setSearchType(null);
        }
        break;
      case 'city':
        setViewMode('region');
        setSelectedCity(null);
        break;
      case 'region':
        setViewMode('home');
        setShowRegionSelection(false);
        setSelectedRegion(null);
        break;
      default:
        setViewMode('home');
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'garde':
        handleGardeSearch();
        break;
      case 'normal':
        performSearch('pharmacies normales', 'normal');
        break;
      case 'near':
        findNearbyPharmacies();
        break;
      default:
        performSearch(action);
    }
  };

  // Composants d'affichage
  const AIResponseDisplay = ({ response }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mb-8"
    >
      <div className="bg-gradient-to-r from-green-600/20 to-transparent border border-green-600/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          {/* <Sparkles className="text-green-500" size={24} /> */}
          <h3 className="text-xl font-bold text-white">Bien vouloir faire une autre  recherche dans la barre de recherche</h3>
        </div>
        <p className="text-gray-200 mb-4">{response.message}</p>
        {response.suggestions && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {response.suggestions.map((sugg, i) => (
                <button
                  key={i}
                  onClick={() => performSearch(sugg)}
                  className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-full text-green-300 text-sm hover:bg-green-600/30 transition"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const FallbackDisplay = ({ response }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mb-8"
    >
      <div className="bg-gradient-to-r from-yellow-600/20 to-transparent border border-yellow-600/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-yellow-500" size={24} />
          <h3 className="text-xl font-bold text-white">Recherche étendue</h3>
        </div>
        <p className="text-gray-200">{response.message}</p>
      </div>
    </motion.div>
  );

  if (showOnboarding) {
    return <OnboardingSteps onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative pt-4 pb-32 md:pb-24 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50 safe-area-padding">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {viewMode !== 'home' ? (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <ChevronLeft size={24} />
                <span className="hidden md:inline">Retour</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                 <Image src="/allo237logo.jpg" alt="Logo" width={400} height={400} className="rounded-full object-cover"/>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Allo237</h1>
                  <p className="text-xs text-gray-400">Trouvez votre pharmacie</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {viewMode === 'home' && userCity && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
                  <MapPin size={16} className="text-green-500" />
                  <span className="text-sm text-gray-300">{userCity}</span>
                </div>
              )}
              
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {viewMode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-4 md:pt-8"
            >
              {/* Hero Section */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-green-600/10 rounded-full border border-green-600/20">
                  <Sparkles size={16} className="text-green-400" />
                  <span className="text-sm md:text-base text-green-400 font-medium">Recherche Vocale</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                  <span className="text-white">Trouvez votre</span>
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    pharmacie
                  </span>
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4 mb-8">
                  Dites "pharmacie de garde" ou "pharmacie normale" pour commencer
                </p>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-8">
                  <button
                    onClick={() => handleQuickAction('garde')}
                    className="bg-gradient-to-br from-green-600 to-green-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition group"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Clock size={28} className="md:size-12" />
                      <span className="font-semibold text-sm md:text-base">De garde</span>
                      <span className="text-xs text-green-200">Urgence 24h/24</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('normal')}
                    className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Building2 size={28} className="md:size-12" />
                      <span className="font-semibold text-sm md:text-base">Normales</span>
                      <span className="text-xs text-blue-200">Horaires réguliers</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('near')}
                    className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Navigation size={28} className="md:size-12" />
                      <span className="font-semibold text-sm md:text-base">Proche</span>
                      <span className="text-xs text-purple-200">À côté de moi</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleTextSearch}
                    placeholder="Tapez ou dites 'pharmacie de garde' ou 'pharmacie normale'..."
                    className="w-full pl-12 pr-32 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition text-base md:text-lg"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => searchQuery.trim() && performSearch(searchQuery)}
                    disabled={isLoading || !searchQuery.trim()}
                    className="absolute right-2 top-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 text-base"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search size={18} />
                        Chercher
                      </>
                    )}
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {['Pharmacie de garde Yaoundé', 'Pharmacie normale Douala', 'Urgence 24h', 'Près de Bastos'].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(s)}
                      className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:border-green-500 hover:text-green-400 transition text-xs md:text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats ou informations */}
              <div className="max-w-3xl mx-auto text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <p className="text-2xl font-bold text-green-400">24h/24</p>
                    <p className="text-gray-400 text-sm">Service d'urgence</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <p className="text-2xl font-bold text-blue-400">200+</p>
                    <p className="text-gray-400 text-sm">Pharmacies</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <p className="text-2xl font-bold text-purple-400">10+</p>
                    <p className="text-gray-400 text-sm">Régions</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    <p className="text-2xl font-bold text-yellow-400">100%</p>
                    <p className="text-gray-400 text-sm">Gratuit</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'region' && (
            <motion.div
              key="region"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-4"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Sélectionnez une région
                </h2>
                <p className="text-gray-400 mb-8">
                  Choisissez la région pour voir les pharmacies de garde disponibles
                </p>

                {loadingGardes ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                    <p className="text-gray-300">Chargement des régions...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(gardesData?.regions || {}).map((region) => {
                      const pharmacyCount = gardesData.regions[region]?.length || 0;
                      const colorClass = REGION_COLORS[region] || 'from-green-500 to-green-700';
                      
                      return (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl text-white hover:opacity-90 transition text-left relative overflow-hidden group`}
                        >
                          <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">{region}</h3>
                            <p className="text-sm opacity-90">
                              {pharmacyCount} pharmacie{pharmacyCount > 1 ? 's' : ''} de garde
                            </p>
                            {region === 'Centre' && (
                              <p className="text-xs opacity-75 mt-1">Yaoundé et environs</p>
                            )}
                            {region === 'Littoral' && (
                              <p className="text-xs opacity-75 mt-1">Douala et environs</p>
                            )}
                          </div>
                          
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20 group-hover:opacity-30 transition">
                            <Building2 size={64} />
                          </div>
                          
                          <div className="absolute bottom-0 right-0 left-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {viewMode === 'city' && selectedCity && (
            <motion.div
              key="city"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-4"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedRegion}
                </h2>
                <p className="text-gray-400 mb-8">
                  Sélectionnez une ville pour voir les pharmacies de garde
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCity.villes.map((ville, index) => {
                    const villePharmacies = gardesData.regions[selectedRegion]?.filter(p => {
                      const pharmacyCity = p.ville || p.localisation?.split(',')[0] || '';
                      return pharmacyCity.includes(ville) || ville.includes(pharmacyCity);
                    }) || [];
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleCitySelect(ville)}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 hover:bg-gray-800/50 transition text-left group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-white text-lg">{ville}</h3>
                          <div className="px-2 py-1 bg-green-600/20 rounded-full">
                            <span className="text-green-400 text-sm font-medium">
                              {villePharmacies.length}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {villePharmacies.length} pharmacie{villePharmacies.length > 1 ? 's' : ''} de garde
                        </p>
                        <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
                          <Clock size={14} />
                          <span>Service 24h/24</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pt-4"
            >
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                  <p className="text-gray-300">Recherche en cours...</p>
                </div>
              ) : (
                <>
                  {searchType === 'ai' && aiResponse && <AIResponseDisplay response={aiResponse} />}
                  {searchType === 'fallback' && aiResponse && <FallbackDisplay response={aiResponse} />}

                  {searchResults.length > 0 ? (
                    <div className="max-w-6xl mx-auto">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                          </h2>
                          {searchType === 'garde_city' && selectedRegion && (
                            <p className="text-green-400 text-lg">
                              Pharmacies de garde à {selectedRegion}
                            </p>
                          )}
                          {searchType === 'nearby' && (
                            <p className="text-purple-400 text-lg">
                              Pharmacies proches de votre position
                            </p>
                          )}
                          <p className="text-gray-400">
                            {searchType === 'garde' ? 'Pharmacies de garde' : 
                             searchType === 'normal' ? 'Pharmacies normales' : 
                             searchType === 'nearby' ? 'À proximité' :
                             'Résultats de recherche'}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          {searchType === 'garde_city' && (
                            <button
                              onClick={() => setViewMode('city')}
                              className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                            >
                              Changer de ville
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setViewMode('home');
                              setSearchResults([]);
                              setSearchQuery('');
                            }}
                            className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
                          >
                            Nouvelle recherche
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {searchResults.map((pharmacy, index) => (
                          <div key={pharmacy.id || index} onClick={() => handlePharmacySelect(pharmacy)}>
                            <PharmacyCard
                              pharmacy={pharmacy}
                              distance={pharmacy.distance}
                              isRecommended={index === 0}
                              isGarde={pharmacy.type === 'garde'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle size={64} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-xl text-gray-300">Aucun résultat trouvé</p>
                      <p className="text-gray-500 mt-2">Essayez une autre recherche</p>
                      <button
                        onClick={() => setViewMode('home')}
                        className="mt-6 px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
                      >
                        Retour à l'accueil
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bouton vocal */}
      {(viewMode === 'home' || viewMode === 'results') && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="relative">
            <MicrophoneButton
              isListening={isListening}
              onClick={startListening}
              disabled={isLoading}
              size="extra-large"
            />

            {isListening && (
              <>
                <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping" />
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
              </>
            )}
          </div>

          <p className="text-center mt-3 text-sm text-gray-400">
            {isListening ? 'PARLEZ MAINTENANT...' : 'Appuyez et parlez'}
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-gray-900/95 border-t border-gray-800/50 safe-area-padding">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => setViewMode('home')}
              className={`flex flex-col items-center gap-1 p-2 ${viewMode === 'home' ? 'text-green-500' : 'text-gray-500'}`}
            >
              <Search size={22} />
              <span className="text-xs">Accueil</span>
            </button>
            
            <button
              onClick={() => handleQuickAction('garde')}
              className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-500 transition"
            >
              <Clock size={22} />
              <span className="text-xs">Garde</span>
            </button>
            
            <button
              onClick={() => handleQuickAction('normal')}
              className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-500 transition"
            >
              <Building2 size={22} />
              <span className="text-xs">Normales</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 p-2 text-gray-500">
              <Heart size={22} />
              <span className="text-xs">Favoris</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}