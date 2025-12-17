

// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// // import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// // import PharmacyCard from '../src/components/ui/PharmacyCard';
// // import { useVoice } from '../src/hooks/useVoice';
// // import { useLocation } from '../src/hooks/useLocation';
// // import { hybridPharmacySearch, analyzeQuery, searchNormalPharmacies } from '../src/lib/pharmacies';
// // import Image from "next/image";

// // // IMPORT DIRECT DU FICHIER JSON
// // import pharmaciesData from '../src/data/pharmacies.json';

// // // Icônes Lucide React
// // import {
// //   Mic, MapPin, Phone, Clock, Shield,
// //   Search, AlertCircle, Star, Zap, Users,
// //   Sparkles, Moon, Sun, Heart, ShieldCheck, Bell,
// //   Building2, Crosshair, ChevronLeft, Filter, X, Navigation,
// //   Info, Mail, Globe, ExternalLink
// // } from 'lucide-react';

// // export default function Home() {
// //   const [showOnboarding, setShowOnboarding] = useState(true);
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [userCity, setUserCity] = useState(null);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [isDarkMode, setIsDarkMode] = useState(true);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [searchType, setSearchType] = useState(null);
// //   const [aiResponse, setAiResponse] = useState(null);

// //   // États pour la nouvelle approche
// //   const [showRegionSelection, setShowRegionSelection] = useState(false);
// //   const [selectedRegion, setSelectedRegion] = useState(null);
// //   const [selectedCity, setSelectedCity] = useState(null);
// //   const [gardesData, setGardesData] = useState(null);
// //   const [loadingGardes, setLoadingGardes] = useState(false);
// //   const [selectedPharmacy, setSelectedPharmacy] = useState(null);
// //   const [viewMode, setViewMode] = useState('home'); // 'home', 'region', 'city', 'results'

// //   const { isListening, transcript, startListening, error: voiceError } = useVoice();
// //   const { location, loading: locationLoading } = useLocation();

// //   // Variables de couleur
// //   const REGION_COLORS = {
// //     'Centre': 'from-green-500 to-green-700',
// //     'Littoral': 'from-blue-500 to-blue-700',
// //     'Ouest': 'from-purple-500 to-purple-700',
// //     'Adamaoua': 'from-orange-500 to-orange-700',
// //     'Est': 'from-red-500 to-red-700',
// //     'Nord': 'from-yellow-500 to-yellow-700',
// //     'Sud': 'from-teal-500 to-teal-700'
// //   };

// //   // ==================== FONCTION GÉOLOCALISATION ====================
// //   const findNearbyPharmacies = () => {
// //     if (!navigator.geolocation) {
// //       alert("La géolocalisation n'est pas supportée par votre navigateur");
// //       return;
// //     }

// //     setIsLoading(true);

// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         const userLat = position.coords.latitude;
// //         const userLng = position.coords.longitude;

// //         try {
// //           // UTILISATION DIRECTE DES DONNÉES IMPORTÉES
// //           const allPharmacies = pharmaciesData;

// //           // Calculer les distances
// //           const calculateDistance = (lat1, lon1, lat2, lon2) => {
// //             const R = 6371e3;
// //             const φ1 = lat1 * Math.PI / 180;
// //             const φ2 = lat2 * Math.PI / 180;
// //             const Δφ = (lat2 - lat1) * Math.PI / 180;
// //             const Δλ = (lon2 - lon1) * Math.PI / 180;

// //             const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
// //               Math.cos(φ1) * Math.cos(φ2) *
// //               Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
// //             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

// //             return R * c;
// //           };

// //           const pharmaciesWithDistance = allPharmacies.map(pharmacy => {
// //             if (!pharmacy.lat || !pharmacy.lng) {
// //               return { ...pharmacy, distance: Infinity };
// //             }

// //             const distance = calculateDistance(
// //               userLat,
// //               userLng,
// //               parseFloat(pharmacy.lat),
// //               parseFloat(pharmacy.lng)
// //             );

// //             return { ...pharmacy, distance };
// //           });

// //           // Filtrer et trier par distance
// //           const nearbyPharmacies = pharmaciesWithDistance
// //             .filter(p => p.distance < 10000 && p.distance !== Infinity)
// //             .sort((a, b) => a.distance - b.distance)
// //             .slice(0, 20);

// //           // Afficher les résultats
// //           setSearchResults(nearbyPharmacies.map((ph, i) => ({
// //             ...ph,
// //             id: `nearby_${i}`,
// //             type: 'normal',
// //             isGarde: false
// //           })));

// //           setSearchType('nearby');
// //           setViewMode('results');

// //         } catch (error) {
// //           console.error('Erreur recherche pharmacies proches:', error);
// //           alert("Erreur lors de la recherche des pharmacies proches");
// //         } finally {
// //           setIsLoading(false);
// //         }
// //       },
// //       (error) => {
// //         setIsLoading(false);
// //         if (error.code === 1) {
// //           alert("Activez la localisation pour trouver les pharmacies proches de vous");
// //         } else {
// //           alert("Impossible d'obtenir votre position. Vérifiez votre connexion GPS.");
// //         }
// //       },
// //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
// //     );
// //   };

// //   // Chargement initial des données
// //   useEffect(() => {
// //     loadGardesData();

// //     // Déterminer la ville par défaut selon la localisation
// //     if (location) {
// //       const city = location.lat > 4.0 ? 'Douala' : 'Yaoundé';
// //       setUserCity(city);
// //     }
// //   }, [location]);

// //   const loadGardesData = async () => {
// //     setLoadingGardes(true);
// //     try {
// //       const response = await fetch('/data/gardes_du_jour_clean.json');
// //       if (!response.ok) throw new Error('Fichier non trouvé');
// //       const data = await response.json();
// //       setGardesData(data);
// //     } catch (error) {
// //       console.error('Erreur chargement gardes:', error);
// //       setGardesData({
// //         periode: "Aujourd'hui",
// //         maj: new Date().toISOString(),
// //         regions: {
// //           'Centre': [],
// //           'Littoral': [],
// //           'Ouest': [],
// //           'Adamaoua': []
// //         }
// //       });
// //     } finally {
// //       setLoadingGardes(false);
// //     }
// //   };

// //   //scroller vers le haut
// //   useEffect(() =>{
// //     window.scrollTo(0,0)
// //   },[])

// //   // Recherche vocale
// //   useEffect(() => {
// //     if (transcript) {
// //       setSearchQuery(transcript);
// //       handleVoiceCommand(transcript);
// //     }
// //   }, [transcript]);

// //   const handleVoiceCommand = (command) => {
// //     const lowerCommand = command.toLowerCase();

// //     if (lowerCommand.includes('pharmacie de garde') || lowerCommand.includes('garde')) {
// //       handleGardeSearch();
// //     } else if (lowerCommand.includes('pharmacie normale') || lowerCommand.includes('pharmacie')) {
// //       performSearch(command, 'normal');
// //     } else {
// //       performSearch(command);
// //     }
// //   };

// //   const handleGardeSearch = () => {
// //     setShowRegionSelection(true);
// //     setViewMode('region');
// //     setSearchType('garde');
// //     setSearchResults([]);
// //   };

// //   const handleRegionSelect = (region) => {
// //     setSelectedRegion(region);
// //     setViewMode('city');

// //     if (gardesData?.regions[region]) {
// //       const pharmacies = gardesData.regions[region];
// //       const villes = [...new Set(pharmacies.map(p => p.ville || p.localisation?.split(',')[0] || 'Ville inconnue'))];
// //       setSelectedCity({ region, villes });
// //     }
// //   };

// //   const handleCitySelect = (cityName) => {
// //     if (!selectedRegion || !gardesData) return;

// //     const pharmacies = gardesData.regions[selectedRegion].filter(pharmacy => {
// //       const pharmacyCity = pharmacy.ville || pharmacy.localisation?.split(',')[0] || '';
// //       return pharmacyCity.includes(cityName) || cityName.includes(pharmacyCity);
// //     });

// //     setSearchResults(pharmacies.map((ph, i) => ({
// //       ...ph,
// //       id: `garde_${selectedRegion}_${cityName}_${i}`,
// //       type: 'garde',
// //       isGarde: true
// //     })));

// //     setViewMode('results');
// //     setSearchType('garde_city');
// //   };

// //   const handlePharmacySelect = (pharmacy) => {
// //     setSelectedPharmacy(pharmacy);
// //     showPharmacyDetails(pharmacy);
// //   };

// //   const showPharmacyDetails = (pharmacy) => {
// //     const detailsModal = document.createElement('div');
// //     detailsModal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80';
// //     detailsModal.innerHTML = `
// //       <div class="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
// //         <div class="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
// //           <h3 class="text-xl font-bold text-white">Détails de la pharmacie</h3>
// //           <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
// //             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
// //             </svg>
// //           </button>
// //         </div>
// //         <div class="p-6">
// //           <div class="flex items-start gap-4 mb-6">
// //             <div class="w-16 h-16 bg-gradient-to-br ${pharmacy.type === 'garde' ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700'} rounded-xl flex items-center justify-center">
// //               <Building2 class="text-white" size={32} />
// //             </div>
// //             <div class="flex-1">
// //               <h4 class="text-2xl font-bold text-white mb-2">${pharmacy.nom}</h4>
// //               ${pharmacy.type === 'garde' ?
// //         '<div class="inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full mb-2"><Clock size={16} class="text-green-400" /><span class="text-green-400 font-medium">Pharmacie de garde</span></div>' :
// //         '<div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 rounded-full mb-2"><Building2 size={16} class="text-blue-400" /><span class="text-blue-400 font-medium">Pharmacie normale</span></div>'
// //       }
// //             </div>
// //           </div>

// //           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div class="space-y-4">
// //               <div>
// //                 <h5 class="text-sm text-gray-400 mb-2">Adresse</h5>
// //                 <div class="flex items-start gap-2">
// //                   <MapPin class="text-green-500 mt-0.5" size={18} />
// //                   <p class="text-white">${pharmacy.adresse || pharmacy.localisation || 'Non spécifiée'}</p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <h5 class="text-sm text-gray-400 mb-2">Téléphone</h5>
// //                 <div class="flex items-center gap-2">
// //                   <Phone class="text-green-500" size={18} />
// //                   <a href="tel:${pharmacy.telephone || ''}" class="text-green-400 hover:text-green-300">${pharmacy.telephone || 'Non disponible'}</a>
// //                 </div>
// //               </div>

// //               <div>
// //                 <h5 class="text-sm text-gray-400 mb-2">Horaires</h5>
// //                 <div class="flex items-center gap-2">
// //                   <Clock class="text-green-500" size={18} />
// //                   <span class="text-white">${pharmacy.horaires || (pharmacy.type === 'garde' ? '24h/24 - Service de garde' : 'Horaires standards')}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div class="space-y-4">
// //               ${pharmacy.services ? `
// //                 <div>
// //                   <h5 class="text-sm text-gray-400 mb-2">Services</h5>
// //                   <p class="text-white">${pharmacy.services}</p>
// //                 </div>
// //               ` : ''}

// //               ${pharmacy.notes ? `
// //                 <div>
// //                   <h5 class="text-sm text-gray-400 mb-2">Notes</h5>
// //                   <p class="text-white">${pharmacy.notes}</p>
// //                 </div>
// //               ` : ''}

// //               ${pharmacy.type === 'garde' ? `
// //                 <div class="p-4 bg-green-600/10 border border-green-600/20 rounded-xl">
// //                   <div class="flex items-center gap-2 mb-2">
// //                     <Shield class="text-green-500" size={20} />
// //                     <span class="text-green-400 font-semibold">Service d'urgence</span>
// //                   </div>
// //                   <p class="text-green-300 text-sm">Cette pharmacie assure le service de garde. Ouverte 24h/24 pour les urgences.</p>
// //                 </div>
// //               ` : ''}
// //             </div>
// //           </div>

// //           <div class="flex gap-3 mt-8 pt-6 border-t border-gray-800">
// //             <button onclick="window.open('tel:${pharmacy.telephone || ''}', '_self')" 
// //                     class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${!pharmacy.telephone ? 'opacity-50 cursor-not-allowed' : ''}"
// //                     ${!pharmacy.telephone ? 'disabled' : ''}>
// //               <Phone size={20} />
// //               Appeler
// //             </button>
// //             <button onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(pharmacy.adresse || pharmacy.localisation || '')}', '_blank')"
// //                     class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2">
// //               <Navigation size={20} />
// //               Itinéraire
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     `;
// //     document.body.appendChild(detailsModal);

// //     detailsModal.querySelector('button').onclick = () => detailsModal.remove();
// //   };

// //   const performSearch = async (query, type = 'all') => {
// //     setIsLoading(true);
// //     setAiResponse(null);
// //     setSearchType(null);
// //     setShowRegionSelection(false);
// //     setViewMode('results');

// //     const queryInfo = analyzeQuery(query);
// //     const city = queryInfo.ville || userCity || 'Yaoundé';

// //     try {
// //       if (type === 'normal') {
// //         // UTILISATION DIRECTE DES DONNÉES IMPORTÉES
// //         const allPharmacies = pharmaciesData;

// //         // Filtrer par ville
// //         const cityPharmacies = allPharmacies.filter(pharmacy =>
// //           pharmacy.ville === city
// //         );

// //         // Si pas de résultat dans cette ville, prendre toutes les pharmacies
// //         const results = cityPharmacies.length > 0
// //           ? cityPharmacies
// //           : allPharmacies.slice(0, 20);

// //         setSearchResults(results.map((ph, i) => ({
// //           ...ph,
// //           id: `normal_${city}_${i}`,
// //           type: 'normal',
// //           isGarde: false,
// //           ville: ph.ville
// //         })));
// //         setSearchType('normal');
// //       } else {
// //         // Recherche hybride
// //         const searchResult = await hybridPharmacySearch(query, city, location);

// //         if (searchResult.type === 'local_database') {
// //           setSearchType('local');
// //           setSearchResults((searchResult.results || []).map((ph, i) => ({
// //             ...ph,
// //             id: `hybrid_${i}`,
// //             type: ph.isGarde ? 'garde' : 'normal',
// //             isGarde: ph.isGarde || false
// //           })));
// //         } else if (searchResult.type === 'ai_assisted') {
// //           setSearchType('ai');
// //           setAiResponse(searchResult);
// //           setSearchResults([]);
// //         } else if (searchResult.type === 'fallback') {
// //           setSearchType('fallback');
// //           const lowerQuery = query.toLowerCase();
// //           let customMessage = searchResult.message;

// //           if (lowerQuery.includes('palais') ||
// //             lowerQuery.includes('spécifique') ||
// //             lowerQuery.includes('nom exact')) {
// //             customMessage = "Cette pharmacie spécifique n'est pas dans notre base. Consultez l'annuaire médical officiel.";
// //           } else if (searchResult.results && searchResult.results.length === 0) {
// //             customMessage = `Aucune pharmacie trouvée pour "${query}". Essayez avec un nom plus simple ou consultez l'annuaire médical.`;
// //           }

// //           searchResult.message = customMessage;
// //           setAiResponse(searchResult);
// //           setSearchResults([]);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Erreur recherche:', error);
// //       setSearchType('error');
// //       setAiResponse({
// //         type: 'error',
// //         message: "Erreur de recherche. Veuillez réessayer ou consulter l'annuaire médical.",
// //         suggestions: ['Recharger la page', 'Vérifier votre connexion']
// //       });
// //       setSearchResults([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleTextSearch = (e) => {
// //     if (e.key === 'Enter' && searchQuery.trim()) {
// //       const lowerQuery = searchQuery.toLowerCase();
// //       if (lowerQuery.includes('garde')) {
// //         handleGardeSearch();
// //       } else {
// //         performSearch(searchQuery);
// //       }
// //     }
// //   };

// //   const handleOnboardingComplete = () => {
// //     setShowOnboarding(false);
// //   };

// //   const goBack = () => {
// //     switch (viewMode) {
// //       case 'results':
// //         if (searchType === 'garde_city') {
// //           setViewMode('city');
// //           setSearchResults([]);
// //         } else {
// //           setViewMode('home');
// //           setSearchResults([]);
// //           setSearchType(null);
// //         }
// //         break;
// //       case 'city':
// //         setViewMode('region');
// //         setSelectedCity(null);
// //         break;
// //       case 'region':
// //         setViewMode('home');
// //         setShowRegionSelection(false);
// //         setSelectedRegion(null);
// //         break;
// //       default:
// //         setViewMode('home');
// //     }
// //   };

// //   const handleQuickAction = (action) => {
// //     switch (action) {
// //       case 'garde':
// //         handleGardeSearch();
// //         break;
// //       case 'normal':
// //         performSearch('pharmacies normales', 'normal');
// //         break;
// //       case 'near':
// //         findNearbyPharmacies();
// //         break;
// //       default:
// //         performSearch(action);
// //     }
// //   };

// //   // Composants d'affichage
// //   const AIResponseDisplay = ({ response }) => (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="max-w-4xl mx-auto mb-8"
// //     >
// //       <div className="bg-gradient-to-r from-green-600/20 to-transparent border border-green-600/30 rounded-2xl p-6">
// //         <div className="flex items-center gap-3 mb-4">
// //           {/* <Sparkles className="text-green-500" size={24} /> */}
// //           <h3 className="text-xl font-bold text-white">Bien vouloir faire une autre  recherche dans la barre de recherche</h3>
// //         </div>
// //         <p className="text-gray-200 mb-4">{response.message}</p>
// //         {response.suggestions && (
// //           <div className="mt-4">
// //             <p className="text-sm text-gray-400 mb-2">Suggestions :</p>
// //             <div className="flex flex-wrap gap-2">
// //               {response.suggestions.map((sugg, i) => (
// //                 <button
// //                   key={i}
// //                   onClick={() => performSearch(sugg)}
// //                   className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-full text-green-300 text-sm hover:bg-green-600/30 transition"
// //                 >
// //                   {sugg}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </motion.div>
// //   );

// //   const FallbackDisplay = ({ response }) => (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="max-w-4xl mx-auto mb-8"
// //     >
// //       <div className="bg-gradient-to-r from-yellow-600/20 to-transparent border border-yellow-600/30 rounded-2xl p-6">
// //         <div className="flex items-center gap-3 mb-4">
// //           <AlertCircle className="text-yellow-500" size={24} />
// //           <h3 className="text-xl font-bold text-white">Recherche étendue</h3>
// //         </div>
// //         <p className="text-gray-200">{response.message}</p>
// //       </div>
// //     </motion.div>
// //   );

// //   if (showOnboarding) {
// //     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
// //   }

// //   return (
// //     <div className="relative pt-4 pb-32 md:pb-24 bg-gradient-to-b from-gray-900 to-black min-h-screen">
// //       {/* Header */}
// //       <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50 safe-area-padding">
// //         <div className="container mx-auto px-4 py-4">
// //           <div className="flex items-center justify-between">
// //             {viewMode !== 'home' ? (
// //               <button
// //                 onClick={goBack}
// //                 className="flex items-center gap-2 text-gray-300 hover:text-white transition"
// //               >
// //                 <ChevronLeft size={24} />
// //                 <span className="hidden md:inline">Retour</span>
// //               </button>
// //             ) : (
// //               <div className="flex items-center gap-3">
// //                 <div className="w-20 h-20 rounded-xl flex items-center justify-center">
// //                   <Image src="/allo237logo.jpg" alt="Logo" width={400} height={400} className="rounded-full object-cover" />
// //                 </div>
// //                 <div>
// //                   <h1 className="text-xl font-bold text-white">Allo237</h1>
// //                   <p className="text-xs text-gray-400">Trouvez votre pharmacie</p>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="flex items-center gap-4">
// //               {viewMode === 'home' && userCity && (
// //                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
// //                   <MapPin size={16} className="text-green-500" />
// //                   <span className="text-sm text-gray-300">{userCity}</span>
// //                 </div>
// //               )}

// //               <button
// //                 onClick={() => setIsDarkMode(!isDarkMode)}
// //                 className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
// //               >
// //                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="container mx-auto px-4 py-6">
// //         <AnimatePresence mode="wait">
// //           {viewMode === 'home' && (
// //             <motion.div
// //               key="home"
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -20 }}
// //               className="pt-4 md:pt-8"
// //             >
// //               {/* Hero Section */}
// //               <div className="text-center mb-8 md:mb-12">
// //                 <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-green-600/10 rounded-full border border-green-600/20">
// //                   <Sparkles size={16} className="text-green-400" />
// //                   <span className="text-sm md:text-base text-green-400 font-medium">Recherche Vocale</span>
// //                 </div>

// //                 <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
// //                   <span className="text-white">Trouvez votre</span>
// //                   <br />
// //                   <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
// //                     pharmacie
// //                   </span>
// //                 </h1>

// //                 <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4 mb-8">
// //                   Dites "pharmacie de garde" ou "pharmacie normale" pour commencer
// //                 </p>

// //                 {/* Quick Actions */}
// //                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-8">
// //                   <button
// //                     onClick={() => handleQuickAction('garde')}
// //                     className="bg-gradient-to-br from-green-600 to-green-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition group"
// //                   >
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Clock size={28} className="md:size-12" />
// //                       <span className="font-semibold text-sm md:text-base">De garde</span>
// //                       <span className="text-xs text-green-200">Urgence 24h/24</span>
// //                     </div>
// //                   </button>

// //                   <button
// //                     onClick={() => handleQuickAction('normal')}
// //                     className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
// //                   >
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Building2 size={28} className="md:size-12" />
// //                       <span className="font-semibold text-sm md:text-base">Normales</span>
// //                       <span className="text-xs text-blue-200">Horaires réguliers</span>
// //                     </div>
// //                   </button>

// //                   <button
// //                     onClick={() => handleQuickAction('near')}
// //                     className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
// //                   >
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Navigation size={28} className="md:size-12" />
// //                       <span className="font-semibold text-sm md:text-base">Proche</span>
// //                       <span className="text-xs text-purple-200">À côté de moi</span>
// //                     </div>
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Barre de recherche */}
// //               <div className="max-w-3xl mx-auto mb-8">
// //                 <div className="relative">
// //                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
// //                     <Search size={20} />
// //                   </div>
// //                   <input
// //                     type="text"
// //                     value={searchQuery}
// //                     onChange={(e) => setSearchQuery(e.target.value)}
// //                     onKeyPress={handleTextSearch}
// //                     placeholder="Tapez ou dites 'pharmacie de garde' ou 'pharmacie normale'..."
// //                     className="w-full pl-12 pr-32 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition text-base md:text-lg"
// //                     disabled={isLoading}
// //                   />
// //                   <button
// //                     onClick={() => searchQuery.trim() && performSearch(searchQuery)}
// //                     disabled={isLoading || !searchQuery.trim()}
// //                     className="absolute right-2 top-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 text-base"
// //                   >
// //                     {isLoading ? (
// //                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                     ) : (
// //                       <>
// //                         <Search size={18} />
// //                         Chercher
// //                       </>
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Stats ou informations */}
// //               <div className="max-w-3xl mx-auto text-center">
// //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-green-400">24h/24</p>
// //                     <p className="text-gray-400 text-sm">Service d'urgence</p>
// //                   </div>
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-blue-400">200+</p>
// //                     <p className="text-gray-400 text-sm">Pharmacies</p>
// //                   </div>
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-purple-400">10+</p>
// //                     <p className="text-gray-400 text-sm">Régions</p>
// //                   </div>
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-yellow-400">100%</p>
// //                     <p className="text-gray-400 text-sm">Gratuit</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           )}

// //           {viewMode === 'region' && (
// //             <motion.div
// //               key="region"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="pt-4"
// //             >
// //               <div className="max-w-4xl mx-auto">
// //                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
// //                   Sélectionnez une région
// //                 </h2>
// //                 <p className="text-gray-400 mb-8">
// //                   Choisissez la région pour voir les pharmacies de garde disponibles
// //                 </p>

// //                 {loadingGardes ? (
// //                   <div className="text-center py-12">
// //                     <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
// //                     <p className="text-gray-300">Chargement des régions...</p>
// //                   </div>
// //                 ) : (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     {Object.keys(gardesData?.regions || {}).map((region) => {
// //                       const pharmacyCount = gardesData.regions[region]?.length || 0;
// //                       const colorClass = REGION_COLORS[region] || 'from-green-500 to-green-700';

// //                       return (
// //                         <button
// //                           key={region}
// //                           onClick={() => handleRegionSelect(region)}
// //                           className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl text-white hover:opacity-90 transition text-left relative overflow-hidden group`}
// //                         >
// //                           <div className="relative z-10">
// //                             <h3 className="text-xl font-bold mb-2">{region}</h3>
// //                             <p className="text-sm opacity-90">
// //                               {pharmacyCount} pharmacie{pharmacyCount > 1 ? 's' : ''} de garde
// //                             </p>
// //                             {region === 'Centre' && (
// //                               <p className="text-xs opacity-75 mt-1">Yaoundé et environs</p>
// //                             )}
// //                             {region === 'Littoral' && (
// //                               <p className="text-xs opacity-75 mt-1">Douala et environs</p>
// //                             )}
// //                           </div>

// //                           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20 group-hover:opacity-30 transition">
// //                             <Building2 size={64} />
// //                           </div>

// //                           <div className="absolute bottom-0 right-0 left-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
// //                         </button>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </div>
// //             </motion.div>
// //           )}

// //           {viewMode === 'city' && selectedCity && (
// //             <motion.div
// //               key="city"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="pt-4"
// //             >
// //               <div className="max-w-4xl mx-auto">
// //                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
// //                   {selectedRegion}
// //                 </h2>
// //                 <p className="text-gray-400 mb-8">
// //                   Sélectionnez une ville pour voir les pharmacies de garde
// //                 </p>

// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
// //                   {selectedCity.villes.map((ville, index) => {
// //                     const villePharmacies = gardesData.regions[selectedRegion]?.filter(p => {
// //                       const pharmacyCity = p.ville || p.localisation?.split(',')[0] || '';
// //                       return pharmacyCity.includes(ville) || ville.includes(pharmacyCity);
// //                     }) || [];

// //                     return (
// //                       <button
// //                         key={index}
// //                         onClick={() => handleCitySelect(ville)}
// //                         className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 hover:bg-gray-800/50 transition text-left group"
// //                       >
// //                         <div className="flex justify-between items-start mb-2">
// //                           <h3 className="font-semibold text-white text-lg">{ville}</h3>
// //                           <div className="px-2 py-1 bg-green-600/20 rounded-full">
// //                             <span className="text-green-400 text-sm font-medium">
// //                               {villePharmacies.length}
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <p className="text-gray-400 text-sm">
// //                           {villePharmacies.length} pharmacie{villePharmacies.length > 1 ? 's' : ''} de garde
// //                         </p>
// //                         <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
// //                           <Clock size={14} />
// //                           <span>Service 24h/24</span>
// //                         </div>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </motion.div>
// //           )}

// //           {viewMode === 'results' && (
// //             <motion.div
// //               key="results"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="pt-4"
// //             >
// //               {isLoading ? (
// //                 <div className="text-center py-12">
// //                   <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
// //                   <p className="text-gray-300">Recherche en cours...</p>
// //                 </div>
// //               ) : (
// //                 <>
// //                   {searchType === 'ai' && aiResponse && <AIResponseDisplay response={aiResponse} />}
// //                   {searchType === 'fallback' && aiResponse && <FallbackDisplay response={aiResponse} />}

// //                   {searchResults.length > 0 ? (
// //                     <div className="max-w-6xl mx-auto">
// //                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
// //                         <div>
// //                           <h2 className="text-2xl font-bold text-white">
// //                             {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
// //                           </h2>
// //                           {searchType === 'garde_city' && selectedRegion && (
// //                             <p className="text-green-400 text-lg">
// //                               Pharmacies de garde à {selectedRegion}
// //                             </p>
// //                           )}
// //                           {searchType === 'nearby' && (
// //                             <p className="text-purple-400 text-lg">
// //                               Pharmacies proches de votre position
// //                             </p>
// //                           )}
// //                           <p className="text-gray-400">
// //                             {searchType === 'garde' ? 'Pharmacies de garde' :
// //                               searchType === 'normal' ? 'Pharmacies normales' :
// //                                 searchType === 'nearby' ? 'À proximité' :
// //                                   'Résultats de recherche'}
// //                           </p>
// //                         </div>

// //                         <div className="flex gap-3">
// //                           {searchType === 'garde_city' && (
// //                             <button
// //                               onClick={() => setViewMode('city')}
// //                               className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition"
// //                             >
// //                               Changer de ville
// //                             </button>
// //                           )}
// //                           <button
// //                             onClick={() => {
// //                               setViewMode('home');
// //                               setSearchResults([]);
// //                               setSearchQuery('');
// //                             }}
// //                             className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
// //                           >
// //                             Nouvelle recherche
// //                           </button>
// //                         </div>
// //                       </div>

// //                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //                         {searchResults.map((pharmacy, index) => (
// //                           <div key={pharmacy.id || index} onClick={() => handlePharmacySelect(pharmacy)}>
// //                             <PharmacyCard
// //                               pharmacy={pharmacy}
// //                               distance={pharmacy.distance}
// //                               isRecommended={index === 0}
// //                               isGarde={pharmacy.type === 'garde'}
// //                             />
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="text-center py-12">
// //                       <AlertCircle size={64} className="text-gray-500 mx-auto mb-4" />
// //                       <p className="text-xl text-gray-300">Aucun résultat trouvé</p>
// //                       <p className="text-gray-500 mt-2">Essayez une autre recherche</p>
// //                       <button
// //                         onClick={() => setViewMode('home')}
// //                         className="mt-6 px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
// //                       >
// //                         Retour à l'accueil
// //                       </button>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </main>

// //       {/* Bouton vocal */}
// //       {(viewMode === 'home' || viewMode === 'results') && (
// //         <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
// //           <div className="relative">
// //             <MicrophoneButton
// //               isListening={isListening}
// //               onClick={startListening}
// //               disabled={isLoading}
// //               size="extra-large"
// //             />

// //             {isListening && (
// //               <>
// //                 <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping" />
// //                 <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
// //               </>
// //             )}
// //           </div>

// //           <p className="text-center mt-3 text-sm text-gray-400">
// //             {isListening ? 'PARLEZ MAINTENANT...' : 'Appuyez et parlez'}
// //           </p>
// //         </div>
// //       )}

// //       {/* Bottom Navigation */}
// //       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-gray-900/95 border-t border-gray-800/50 safe-area-padding">
// //         <div className="container mx-auto px-4 py-3">
// //           <div className="flex justify-around">
// //             <button
// //               onClick={() => setViewMode('home')}
// //               className={`flex flex-col items-center gap-1 p-2 ${viewMode === 'home' ? 'text-green-500' : 'text-gray-500'}`}
// //             >
// //               <Search size={22} />
// //               <span className="text-xs">Accueil</span>
// //             </button>

// //             <button
// //               onClick={() => handleQuickAction('garde')}
// //               className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-500 transition"
// //             >
// //               <Clock size={22} />
// //               <span className="text-xs">Garde</span>
// //             </button>

// //             <button
// //               onClick={() => handleQuickAction('normal')}
// //               className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-500 transition"
// //             >
// //               <Building2 size={22} />
// //               <span className="text-xs">Normales</span>
// //             </button>

// //             <button className="flex flex-col items-center gap-1 p-2 text-gray-500">
// //               <Heart size={22} />
// //               <span className="text-xs">Favoris</span>
// //             </button>
// //           </div>
// //         </div>
// //       </nav>
// //     </div>
// //   );
// // }







































































































































































































// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// // import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// // import PharmacyCard from '../src/components/ui/PharmacyCard';
// // import { useVoice } from '../src/hooks/useVoice';
// // import { useLocation } from '../src/hooks/useLocation';
// // import { hybridPharmacySearch, analyzeQuery, searchNormalPharmacies } from '../src/lib/pharmacies';
// // import Image from "next/image";

// // // IMPORT DIRECT DU FICHIER JSON
// // import pharmaciesData from '../src/data/pharmacies.json';

// // // Icônes Lucide React
// // import {
// //   Mic, MapPin, Phone, Clock, Shield,
// //   Search, AlertCircle, Star, Zap, Users,
// //   Sparkles, Moon, Sun, Heart, ShieldCheck, Bell,
// //   Building2, Crosshair, ChevronLeft, Filter, X, Navigation,
// //   Info, Mail, Globe, ExternalLink
// // } from 'lucide-react';

// // export default function Home() {
// //   const [showOnboarding, setShowOnboarding] = useState(true);
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [userCity, setUserCity] = useState(null);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [isDarkMode, setIsDarkMode] = useState(true);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [searchType, setSearchType] = useState(null);
// //   const [aiResponse, setAiResponse] = useState(null);

// //   // États pour la nouvelle approche
// //   const [showRegionSelection, setShowRegionSelection] = useState(false);
// //   const [selectedRegion, setSelectedRegion] = useState(null);
// //   const [selectedCity, setSelectedCity] = useState(null);
// //   const [gardesData, setGardesData] = useState(null);
// //   const [loadingGardes, setLoadingGardes] = useState(false);
// //   const [selectedPharmacy, setSelectedPharmacy] = useState(null);
// //   const [viewMode, setViewMode] = useState('home'); // 'home', 'region', 'city', 'results'

// //   const { isListening, transcript, startListening, error: voiceError } = useVoice();
// //   const { location, loading: locationLoading } = useLocation();

// //   // Variables de couleur
// //   const REGION_COLORS = {
// //     'Centre': 'from-green-500 to-green-700',
// //     'Littoral': 'from-blue-500 to-blue-700',
// //     'Ouest': 'from-purple-500 to-purple-700',
// //     'Adamaoua': 'from-orange-500 to-orange-700',
// //     'Est': 'from-red-500 to-red-700',
// //     'Nord': 'from-yellow-500 to-yellow-700',
// //     'Sud': 'from-teal-500 to-teal-700'
// //   };

// //   // ==================== FONCTION GÉOLOCALISATION ====================
// //   const findNearbyPharmacies = () => {
// //     if (!navigator.geolocation) {
// //       alert("La géolocalisation n'est pas supportée par votre navigateur");
// //       return;
// //     }

// //     setIsLoading(true);

// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         const userLat = position.coords.latitude;
// //         const userLng = position.coords.longitude;

// //         try {
// //           // UTILISATION DIRECTE DES DONNÉES IMPORTÉES
// //           const allPharmacies = pharmaciesData;

// //           // Calculer les distances
// //           const calculateDistance = (lat1, lon1, lat2, lon2) => {
// //             const R = 6371e3;
// //             const φ1 = lat1 * Math.PI / 180;
// //             const φ2 = lat2 * Math.PI / 180;
// //             const Δφ = (lat2 - lat1) * Math.PI / 180;
// //             const Δλ = (lon2 - lon1) * Math.PI / 180;

// //             const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
// //               Math.cos(φ1) * Math.cos(φ2) *
// //               Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
// //             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

// //             return R * c;
// //           };

// //           const pharmaciesWithDistance = allPharmacies.map(pharmacy => {
// //             if (!pharmacy.lat || !pharmacy.lng) {
// //               return { ...pharmacy, distance: Infinity };
// //             }

// //             const distance = calculateDistance(
// //               userLat,
// //               userLng,
// //               parseFloat(pharmacy.lat),
// //               parseFloat(pharmacy.lng)
// //             );

// //             return { ...pharmacy, distance };
// //           });

// //           // Filtrer et trier par distance
// //           const nearbyPharmacies = pharmaciesWithDistance
// //             .filter(p => p.distance < 10000 && p.distance !== Infinity)
// //             .sort((a, b) => a.distance - b.distance)
// //             .slice(0, 20);

// //           // Afficher les résultats
// //           setSearchResults(nearbyPharmacies.map((ph, i) => ({
// //             ...ph,
// //             id: `nearby_${i}`,
// //             type: 'normal',
// //             isGarde: false
// //           })));

// //           setSearchType('nearby');
// //           setViewMode('results');

// //         } catch (error) {
// //           console.error('Erreur recherche pharmacies proches:', error);
// //           alert("Erreur lors de la recherche des pharmacies proches");
// //         } finally {
// //           setIsLoading(false);
// //         }
// //       },
// //       (error) => {
// //         setIsLoading(false);
// //         if (error.code === 1) {
// //           alert("Activez la localisation pour trouver les pharmacies proches de vous");
// //         } else {
// //           alert("Impossible d'obtenir votre position. Vérifiez votre connexion GPS.");
// //         }
// //       },
// //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
// //     );
// //   };

// //   // Chargement initial des données
// //   useEffect(() => {
// //     loadGardesData();

// //     // Déterminer la ville par défaut selon la localisation
// //     if (location) {
// //       const city = location.lat > 4.0 ? 'Douala' : 'Yaoundé';
// //       setUserCity(city);
// //     }
// //   }, [location]);

// //   // ⭐⭐ CORRECTION : Fonction loadGardesData utilisant le fichier clean ⭐⭐
// //   const loadGardesData = async () => {
// //     setLoadingGardes(true);
// //     try {
// //       const response = await fetch('/data/gardes_du_jour_clean.json');
// //       if (!response.ok) throw new Error('Fichier non trouvé');
// //       const data = await response.json();
// //       setGardesData(data);
// //     } catch (error) {
// //       console.error('Erreur chargement gardes:', error);
// //       setGardesData({
// //         periode: "Aujourd'hui",
// //         maj: new Date().toISOString(),
// //         regions: {
// //           'Centre': [],
// //           'Littoral': [],
// //           'Ouest': [],
// //           'Adamaoua': []
// //         }
// //       });
// //     } finally {
// //       setLoadingGardes(false);
// //     }
// //   };

// //   //scroller vers le haut
// //   useEffect(() =>{
// //     window.scrollTo(0,0)
// //   },[])

// //   // Recherche vocale
// //   useEffect(() => {
// //     if (transcript) {
// //       setSearchQuery(transcript);
// //       handleVoiceCommand(transcript);
// //     }
// //   }, [transcript]);

// //   const handleVoiceCommand = (command) => {
// //     const lowerCommand = command.toLowerCase();

// //     if (lowerCommand.includes('pharmacie de garde') || lowerCommand.includes('garde')) {
// //       handleGardeSearch();
// //     } else if (lowerCommand.includes('pharmacie normale') || lowerCommand.includes('pharmacie')) {
// //       performSearch(command, 'normal');
// //     } else {
// //       performSearch(command);
// //     }
// //   };

// //   const handleGardeSearch = () => {
// //     setShowRegionSelection(true);
// //     setViewMode('region');
// //     setSearchType('garde');
// //     setSearchResults([]);
// //   };

// //   // ⭐⭐ CORRECTION : handleRegionSelect pour nouvelle structure ⭐⭐
// //   const handleRegionSelect = (region) => {
// //     setSelectedRegion(region);
// //     setViewMode('city');

// //     if (gardesData?.regions[region]) {
// //       // NOUVELLE STRUCTURE : gardesData.regions[region] = [{ ville, pharmacies: [...] }, ...]
// //       const citiesData = gardesData.regions[region];
      
// //       // Extraire les noms de ville
// //       const villes = citiesData.map(city => city.ville);
      
// //       setSelectedCity({ 
// //         region, 
// //         villes,
// //         citiesData // Garder les données complètes pour plus tard
// //       });
// //     }
// //   };

// //   // ⭐⭐ CORRECTION : handleCitySelect pour nouvelle structure ⭐⭐
// //   const handleCitySelect = (cityName) => {
// //     if (!selectedRegion || !gardesData) return;

// //     // Chercher la ville dans la structure organisée
// //     const regionData = gardesData.regions[selectedRegion];
// //     const cityData = regionData.find(city => city.ville === cityName);
    
// //     // Si trouvé, prendre les pharmacies de cette ville
// //     const pharmacies = cityData ? cityData.pharmacies : [];

// //     setSearchResults(pharmacies.map((ph, i) => ({
// //       ...ph,
// //       id: `garde_${selectedRegion}_${cityName}_${i}`,
// //       type: 'garde',
// //       isGarde: true
// //     })));

// //     setViewMode('results');
// //     setSearchType('garde_city');
// //   };

// //   const handlePharmacySelect = (pharmacy) => {
// //     setSelectedPharmacy(pharmacy);
// //     showPharmacyDetails(pharmacy);
// //   };

// //   const showPharmacyDetails = (pharmacy) => {
// //     const detailsModal = document.createElement('div');
// //     detailsModal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80';
// //     detailsModal.innerHTML = `
// //       <div class="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
// //         <div class="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
// //           <h3 class="text-xl font-bold text-white">Détails de la pharmacie</h3>
// //           <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
// //             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
// //             </svg>
// //           </button>
// //         </div>
// //         <div class="p-6">
// //           <div class="flex items-start gap-4 mb-6">
// //             <div class="w-16 h-16 bg-gradient-to-br ${pharmacy.type === 'garde' ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700'} rounded-xl flex items-center justify-center">
// //               <Building2 class="text-white" size={32} />
// //             </div>
// //             <div class="flex-1">
// //               <h4 class="text-2xl font-bold text-white mb-2">${pharmacy.nom}</h4>
// //               ${pharmacy.type === 'garde' ?
// //         '<div class="inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full mb-2"><Clock size={16} class="text-green-400" /><span class="text-green-400 font-medium">Pharmacie de garde</span></div>' :
// //         '<div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 rounded-full mb-2"><Building2 size={16} class="text-blue-400" /><span class="text-blue-400 font-medium">Pharmacie normale</span></div>'
// //       }
// //             </div>
// //           </div>

// //           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div class="space-y-4">
// //               <div>
// //                 <h5 class="text-sm text-gray-400 mb-2">Adresse</h5>
// //                 <div class="flex items-start gap-2">
// //                   <MapPin class="text-green-500 mt-0.5" size={18} />
// //                   <p class="text-white">${pharmacy.adresse || pharmacy.localisation || 'Non spécifiée'}</p>
// //                 </div>
// //               </div>

// //               <div>
// //                 <h5 class="text-sm text-gray-400 mb-2">Téléphone</h5>
// //                 <div class="flex items-center gap-2">
// //                   <Phone class="text-green-500" size={18} />
// //                   <a href="tel:${pharmacy.telephone || ''}" class="text-green-400 hover:text-green-300">${pharmacy.telephone || 'Non disponible'}</a>
// //                 </div>
// //               </div>

// //               <div>
// //                 <h5 class="text-sm text-gray-400 mb-2">Horaires</h5>
// //                 <div class="flex items-center gap-2">
// //                   <Clock class="text-green-500" size={18} />
// //                   <span class="text-white">${pharmacy.horaires || (pharmacy.type === 'garde' ? '24h/24 - Service de garde' : 'Horaires standards')}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div class="space-y-4">
// //               ${pharmacy.services ? `
// //                 <div>
// //                   <h5 class="text-sm text-gray-400 mb-2">Services</h5>
// //                   <p class="text-white">${pharmacy.services}</p>
// //                 </div>
// //               ` : ''}

// //               ${pharmacy.notes ? `
// //                 <div>
// //                   <h5 class="text-sm text-gray-400 mb-2">Notes</h5>
// //                   <p class="text-white">${pharmacy.notes}</p>
// //                 </div>
// //               ` : ''}

// //               ${pharmacy.type === 'garde' ? `
// //                 <div class="p-4 bg-green-600/10 border border-green-600/20 rounded-xl">
// //                   <div class="flex items-center gap-2 mb-2">
// //                     <Shield class="text-green-500" size={20} />
// //                     <span class="text-green-400 font-semibold">Service d'urgence</span>
// //                   </div>
// //                   <p class="text-green-300 text-sm">Cette pharmacie assure le service de garde. Ouverte 24h/24 pour les urgences.</p>
// //                 </div>
// //               ` : ''}
// //             </div>
// //           </div>

// //           <div class="flex gap-3 mt-8 pt-6 border-t border-gray-800">
// //             <button onclick="window.open('tel:${pharmacy.telephone || ''}', '_self')" 
// //                     class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${!pharmacy.telephone ? 'opacity-50 cursor-not-allowed' : ''}"
// //                     ${!pharmacy.telephone ? 'disabled' : ''}>
// //               <Phone size={20} />
// //               Appeler
// //             </button>
// //             <button onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(pharmacy.adresse || pharmacy.localisation || '')}', '_blank')"
// //                     class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2">
// //               <Navigation size={20} />
// //               Itinéraire
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     `;
// //     document.body.appendChild(detailsModal);

// //     detailsModal.querySelector('button').onclick = () => detailsModal.remove();
// //   };

// //   const performSearch = async (query, type = 'all') => {
// //     setIsLoading(true);
// //     setAiResponse(null);
// //     setSearchType(null);
// //     setShowRegionSelection(false);
// //     setViewMode('results');

// //     const queryInfo = analyzeQuery(query);
// //     const city = queryInfo.ville || userCity || 'Yaoundé';

// //     try {
// //       if (type === 'normal') {
// //         // UTILISATION DIRECTE DES DONNÉES IMPORTÉES
// //         const allPharmacies = pharmaciesData;

// //         // Filtrer par ville
// //         const cityPharmacies = allPharmacies.filter(pharmacy =>
// //           pharmacy.ville === city
// //         );

// //         // Si pas de résultat dans cette ville, prendre toutes les pharmacies
// //         const results = cityPharmacies.length > 0
// //           ? cityPharmacies
// //           : allPharmacies.slice(0, 20);

// //         setSearchResults(results.map((ph, i) => ({
// //           ...ph,
// //           id: `normal_${city}_${i}`,
// //           type: 'normal',
// //           isGarde: false,
// //           ville: ph.ville
// //         })));
// //         setSearchType('normal');
// //       } else {
// //         // Recherche hybride
// //         const searchResult = await hybridPharmacySearch(query, city, location);

// //         if (searchResult.type === 'local_database') {
// //           setSearchType('local');
// //           setSearchResults((searchResult.results || []).map((ph, i) => ({
// //             ...ph,
// //             id: `hybrid_${i}`,
// //             type: ph.isGarde ? 'garde' : 'normal',
// //             isGarde: ph.isGarde || false
// //           })));
// //         } else if (searchResult.type === 'ai_assisted') {
// //           setSearchType('ai');
// //           setAiResponse(searchResult);
// //           setSearchResults([]);
// //         } else if (searchResult.type === 'fallback') {
// //           setSearchType('fallback');
// //           const lowerQuery = query.toLowerCase();
// //           let customMessage = searchResult.message;

// //           if (lowerQuery.includes('palais') ||
// //             lowerQuery.includes('spécifique') ||
// //             lowerQuery.includes('nom exact')) {
// //             customMessage = "Cette pharmacie spécifique n'est pas dans notre base. Consultez l'annuaire médical officiel.";
// //           } else if (searchResult.results && searchResult.results.length === 0) {
// //             customMessage = `Aucune pharmacie trouvée pour "${query}". Essayez avec un nom plus simple ou consultez l'annuaire médical.`;
// //           }

// //           searchResult.message = customMessage;
// //           setAiResponse(searchResult);
// //           setSearchResults([]);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Erreur recherche:', error);
// //       setSearchType('error');
// //       setAiResponse({
// //         type: 'error',
// //         message: "Erreur de recherche. Veuillez réessayer ou consulter l'annuaire médical.",
// //         suggestions: ['Recharger la page', 'Vérifier votre connexion']
// //       });
// //       setSearchResults([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleTextSearch = (e) => {
// //     if (e.key === 'Enter' && searchQuery.trim()) {
// //       const lowerQuery = searchQuery.toLowerCase();
// //       if (lowerQuery.includes('garde')) {
// //         handleGardeSearch();
// //       } else {
// //         performSearch(searchQuery);
// //       }
// //     }
// //   };

// //   const handleOnboardingComplete = () => {
// //     setShowOnboarding(false);
// //   };

// //   const goBack = () => {
// //     switch (viewMode) {
// //       case 'results':
// //         if (searchType === 'garde_city') {
// //           setViewMode('city');
// //           setSearchResults([]);
// //         } else {
// //           setViewMode('home');
// //           setSearchResults([]);
// //           setSearchType(null);
// //         }
// //         break;
// //       case 'city':
// //         setViewMode('region');
// //         setSelectedCity(null);
// //         break;
// //       case 'region':
// //         setViewMode('home');
// //         setShowRegionSelection(false);
// //         setSelectedRegion(null);
// //         break;
// //       default:
// //         setViewMode('home');
// //     }
// //   };

// //   const handleQuickAction = (action) => {
// //     switch (action) {
// //       case 'garde':
// //         handleGardeSearch();
// //         break;
// //       case 'normal':
// //         performSearch('pharmacies normales', 'normal');
// //         break;
// //       case 'near':
// //         findNearbyPharmacies();
// //         break;
// //       default:
// //         performSearch(action);
// //     }
// //   };

// //   // Composants d'affichage
// //   const AIResponseDisplay = ({ response }) => (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="max-w-4xl mx-auto mb-8"
// //     >
// //       <div className="bg-gradient-to-r from-green-600/20 to-transparent border border-green-600/30 rounded-2xl p-6">
// //         <div className="flex items-center gap-3 mb-4">
// //           {/* <Sparkles className="text-green-500" size={24} /> */}
// //           <h3 className="text-xl font-bold text-white">Bien vouloir faire une autre  recherche dans la barre de recherche</h3>
// //         </div>
// //         <p className="text-gray-200 mb-4">{response.message}</p>
// //         {response.suggestions && (
// //           <div className="mt-4">
// //             <p className="text-sm text-gray-400 mb-2">Suggestions :</p>
// //             <div className="flex flex-wrap gap-2">
// //               {response.suggestions.map((sugg, i) => (
// //                 <button
// //                   key={i}
// //                   onClick={() => performSearch(sugg)}
// //                   className="px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-full text-green-300 text-sm hover:bg-green-600/30 transition"
// //                 >
// //                   {sugg}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </motion.div>
// //   );

// //   const FallbackDisplay = ({ response }) => (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className="max-w-4xl mx-auto mb-8"
// //     >
// //       <div className="bg-gradient-to-r from-yellow-600/20 to-transparent border border-yellow-600/30 rounded-2xl p-6">
// //         <div className="flex items-center gap-3 mb-4">
// //           <AlertCircle className="text-yellow-500" size={24} />
// //           <h3 className="text-xl font-bold text-white">Recherche étendue</h3>
// //         </div>
// //         <p className="text-gray-200">{response.message}</p>
// //       </div>
// //     </motion.div>
// //   );

// //   if (showOnboarding) {
// //     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
// //   }

// //   return (
// //     <div className="relative pt-4 pb-32 md:pb-24 bg-gradient-to-b from-gray-900 to-black min-h-screen">
// //       {/* Header */}
// //       <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50 safe-area-padding">
// //         <div className="container mx-auto px-4 py-4">
// //           <div className="flex items-center justify-between">
// //             {viewMode !== 'home' ? (
// //               <button
// //                 onClick={goBack}
// //                 className="flex items-center gap-2 text-gray-300 hover:text-white transition"
// //               >
// //                 <ChevronLeft size={24} />
// //                 <span className="hidden md:inline">Retour</span>
// //               </button>
// //             ) : (
// //               <div className="flex items-center gap-3">
// //                 <div className="w-20 h-20 rounded-xl flex items-center justify-center">
// //                   <Image src="/allo237logo.jpg" alt="Logo" width={400} height={400} className="rounded-full object-cover" />
// //                 </div>
// //                 <div>
// //                   <h1 className="text-xl font-bold text-white">Allo237</h1>
// //                   <p className="text-xs text-gray-400">Trouvez votre pharmacie</p>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="flex items-center gap-4">
// //               {viewMode === 'home' && userCity && (
// //                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
// //                   <MapPin size={16} className="text-green-500" />
// //                   <span className="text-sm text-gray-300">{userCity}</span>
// //                 </div>
// //               )}

// //               <button
// //                 onClick={() => setIsDarkMode(!isDarkMode)}
// //                 className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
// //               >
// //                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="container mx-auto px-4 py-6">
// //         <AnimatePresence mode="wait">
// //           {viewMode === 'home' && (
// //             <motion.div
// //               key="home"
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -20 }}
// //               className="pt-4 md:pt-8"
// //             >
// //               {/* Hero Section */}
// //               <div className="text-center mb-8 md:mb-12">
// //                 <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 bg-green-600/10 rounded-full border border-green-600/20">
// //                   <Sparkles size={16} className="text-green-400" />
// //                   <span className="text-sm md:text-base text-green-400 font-medium">Recherche Vocale</span>
// //                 </div>

// //                 <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
// //                   <span className="text-white">Trouvez votre</span>
// //                   <br />
// //                   <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
// //                     pharmacie
// //                   </span>
// //                 </h1>

// //                 <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4 mb-8">
// //                   Dites "pharmacie de garde" ou "pharmacie normale" pour commencer
// //                 </p>

// //                 {/* Quick Actions */}
// //                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mb-8">
// //                   <button
// //                     onClick={() => handleQuickAction('garde')}
// //                     className="bg-gradient-to-br from-green-600 to-green-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition group"
// //                   >
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Clock size={28} className="md:size-12" />
// //                       <span className="font-semibold text-sm md:text-base">De garde</span>
// //                       <span className="text-xs text-green-200">Urgence 24h/24</span>
// //                     </div>
// //                   </button>

// //                   <button
// //                     onClick={() => handleQuickAction('normal')}
// //                     className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
// //                   >
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Building2 size={28} className="md:size-12" />
// //                       <span className="font-semibold text-sm md:text-base">Normales</span>
// //                       <span className="text-xs text-blue-200">Horaires réguliers</span>
// //                     </div>
// //                   </button>

// //                   <button
// //                     onClick={() => handleQuickAction('near')}
// //                     className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 md:p-6 rounded-2xl text-white hover:opacity-90 transition"
// //                   >
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Navigation size={28} className="md:size-12" />
// //                       <span className="font-semibold text-sm md:text-base">Proche</span>
// //                       <span className="text-xs text-purple-200">À côté de moi</span>
// //                     </div>
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Barre de recherche */}
// //               <div className="max-w-3xl mx-auto mb-8">
// //                 <div className="relative">
// //                   <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
// //                     <Search size={20} />
// //                   </div>
// //                   <input
// //                     type="text"
// //                     value={searchQuery}
// //                     onChange={(e) => setSearchQuery(e.target.value)}
// //                     onKeyPress={handleTextSearch}
// //                     placeholder="Tapez ou dites 'pharmacie de garde' ou 'pharmacie normale'..."
// //                     className="w-full pl-12 pr-32 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition text-base md:text-lg"
// //                     disabled={isLoading}
// //                   />
// //                   <button
// //                     onClick={() => searchQuery.trim() && performSearch(searchQuery)}
// //                     disabled={isLoading || !searchQuery.trim()}
// //                     className="absolute right-2 top-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 "
// //                   >
// //                     {isLoading ? (
// //                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                     ) : (
// //                       <>
// //                         <Search size={10} />
// //                         Chercher
// //                       </>
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Stats ou informations */}
// //               <div className="max-w-3xl mx-auto text-center">
// //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-green-400">24h/24</p>
// //                     <p className="text-gray-400 text-sm">Service d'urgence</p>
// //                   </div>
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-blue-400">200+</p>
// //                     <p className="text-gray-400 text-sm">Pharmacies</p>
// //                   </div>
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-purple-400">10+</p>
// //                     <p className="text-gray-400 text-sm">Régions</p>
// //                   </div>
// //                   <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
// //                     <p className="text-2xl font-bold text-yellow-400">100%</p>
// //                     <p className="text-gray-400 text-sm">Gratuit</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </motion.div>
// //           )}

// //           {viewMode === 'region' && (
// //             <motion.div
// //               key="region"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="pt-4"
// //             >
// //               <div className="max-w-4xl mx-auto">
// //                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
// //                   Sélectionnez une région
// //                 </h2>
// //                 <p className="text-gray-400 mb-8">
// //                   Choisissez la région pour voir les pharmacies de garde disponibles
// //                 </p>

// //                 {loadingGardes ? (
// //                   <div className="text-center py-12">
// //                     <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
// //                     <p className="text-gray-300">Chargement des régions...</p>
// //                   </div>
// //                 ) : (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                     {Object.keys(gardesData?.regions || {}).map((region) => {
// //                       // ⭐⭐ CORRECTION : Calculer le vrai nombre de pharmacies ⭐⭐
// //                       const regionData = gardesData.regions[region] || [];
// //                       let pharmacyCount = 0;
                      
// //                       // Nouvelle structure : chaque ville a un tableau pharmacies
// //                       if (regionData.length > 0 && regionData[0].pharmacies) {
// //                         pharmacyCount = regionData.reduce((total, city) => {
// //                           return total + (city.pharmacies?.length || 0);
// //                         }, 0);
// //                       } else {
// //                         // Ancienne structure (fallback)
// //                         pharmacyCount = regionData.length;
// //                       }
                      
// //                       const colorClass = REGION_COLORS[region] || 'from-green-500 to-green-700';

// //                       return (
// //                         <button
// //                           key={region}
// //                           onClick={() => handleRegionSelect(region)}
// //                           className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl text-white hover:opacity-90 transition text-left relative overflow-hidden group`}
// //                         >
// //                           <div className="relative z-10">
// //                             <h3 className="text-xl font-bold mb-2">{region}</h3>
// //                             <p className="text-sm opacity-90">
// //                               {pharmacyCount} pharmacie{pharmacyCount > 1 ? 's' : ''} de garde
// //                             </p>
// //                             {region === 'Centre' && (
// //                               <p className="text-xs opacity-75 mt-1">Yaoundé et environs</p>
// //                             )}
// //                             {region === 'Littoral' && (
// //                               <p className="text-xs opacity-75 mt-1">Douala et environs</p>
// //                             )}
// //                           </div>

// //                           <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-20 group-hover:opacity-30 transition">
// //                             <Building2 size={64} />
// //                           </div>

// //                           <div className="absolute bottom-0 right-0 left-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
// //                         </button>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </div>
// //             </motion.div>
// //           )}

// //           {viewMode === 'city' && selectedCity && (
// //             <motion.div
// //               key="city"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="pt-4"
// //             >
// //               <div className="max-w-4xl mx-auto">
// //                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
// //                   {selectedRegion}
// //                 </h2>
// //                 <p className="text-gray-400 mb-8">
// //                   Sélectionnez une ville pour voir les pharmacies de garde
// //                 </p>

// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
// //                   {selectedCity.villes.map((ville, index) => {
// //                     // ⭐⭐ CORRECTION : Trouver le nombre de pharmacies par ville ⭐⭐
// //                     let villePharmaciesCount = 0;
                    
// //                     if (selectedCity.citiesData) {
// //                       // Nouvelle structure : chercher dans citiesData
// //                       const cityData = selectedCity.citiesData.find(city => city.ville === ville);
// //                       villePharmaciesCount = cityData ? cityData.pharmacies?.length || 0 : 0;
// //                     } else if (gardesData?.regions[selectedRegion]) {
// //                       // Ancienne structure (fallback)
// //                       const regionData = gardesData.regions[selectedRegion];
// //                       villePharmaciesCount = regionData.filter(p => {
// //                         const pharmacyCity = p.ville || p.localisation?.split(',')[0] || '';
// //                         return pharmacyCity.includes(ville) || ville.includes(pharmacyCity);
// //                       }).length;
// //                     }

// //                     return (
// //                       <button
// //                         key={index}
// //                         onClick={() => handleCitySelect(ville)}
// //                         className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500 hover:bg-gray-800/50 transition text-left group"
// //                       >
// //                         <div className="flex justify-between items-start mb-2">
// //                           <h3 className="font-semibold text-white text-lg">{ville}</h3>
// //                           <div className="px-2 py-1 bg-green-600/20 rounded-full">
// //                             <span className="text-green-400 text-sm font-medium">
// //                               {villePharmaciesCount}
// //                             </span>
// //                           </div>
// //                         </div>
// //                         <p className="text-gray-400 text-sm">
// //                           {villePharmaciesCount} pharmacie{villePharmaciesCount > 1 ? 's' : ''} de garde
// //                         </p>
// //                         <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
// //                           <Clock size={14} />
// //                           <span>Service 24h/24</span>
// //                         </div>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </motion.div>
// //           )}

// //           {viewMode === 'results' && (
// //             <motion.div
// //               key="results"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="pt-4"
// //             >
// //               {isLoading ? (
// //                 <div className="text-center py-12">
// //                   <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
// //                   <p className="text-gray-300">Recherche en cours...</p>
// //                 </div>
// //               ) : (
// //                 <>
// //                   {searchType === 'ai' && aiResponse && <AIResponseDisplay response={aiResponse} />}
// //                   {searchType === 'fallback' && aiResponse && <FallbackDisplay response={aiResponse} />}

// //                   {searchResults.length > 0 ? (
// //                     <div className="max-w-6xl mx-auto">
// //                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
// //                         <div>
// //                           <h2 className="text-2xl font-bold text-white">
// //                             {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
// //                           </h2>
// //                           {searchType === 'garde_city' && selectedRegion && (
// //                             <p className="text-green-400 text-lg">
// //                               Pharmacies de garde à {selectedRegion}
// //                             </p>
// //                           )}
// //                           {searchType === 'nearby' && (
// //                             <p className="text-purple-400 text-lg">
// //                               Pharmacies proches de votre position
// //                             </p>
// //                           )}
// //                           <p className="text-gray-400">
// //                             {searchType === 'garde' ? 'Pharmacies de garde' :
// //                               searchType === 'normal' ? 'Pharmacies normales' :
// //                                 searchType === 'nearby' ? 'À proximité' :
// //                                   'Résultats de recherche'}
// //                           </p>
// //                         </div>

// //                         <div className="flex gap-3">
// //                           {searchType === 'garde_city' && (
// //                             <button
// //                               onClick={() => setViewMode('city')}
// //                               className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition"
// //                             >
// //                               Changer de ville
// //                             </button>
// //                           )}
// //                           <button
// //                             onClick={() => {
// //                               setViewMode('home');
// //                               setSearchResults([]);
// //                               setSearchQuery('');
// //                             }}
// //                             className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
// //                           >
// //                             Nouvelle recherche
// //                           </button>
// //                         </div>
// //                       </div>

// //                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //                         {searchResults.map((pharmacy, index) => (
// //                           <div key={pharmacy.id || index} onClick={() => handlePharmacySelect(pharmacy)}>
// //                             <PharmacyCard
// //                               pharmacy={pharmacy}
// //                               distance={pharmacy.distance}
// //                               isRecommended={index === 0}
// //                               isGarde={pharmacy.type === 'garde'}
// //                             />
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="text-center py-12">
// //                       <AlertCircle size={64} className="text-gray-500 mx-auto mb-4" />
// //                       <p className="text-xl text-gray-300">Aucun résultat trouvé</p>
// //                       <p className="text-gray-500 mt-2">Essayez une autre recherche</p>
// //                       <button
// //                         onClick={() => setViewMode('home')}
// //                         className="mt-6 px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-700 transition"
// //                       >
// //                         Retour à l'accueil
// //                       </button>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </main>

// //       {/* Bouton vocal */}
// //       {(viewMode === 'home' || viewMode === 'results') && (
// //         <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
// //           <div className="relative">
// //             <MicrophoneButton
// //               isListening={isListening}
// //               onClick={startListening}
// //               disabled={isLoading}
// //               size="extra-large"
// //             />

// //             {isListening && (
// //               <>
// //                 <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping" />
// //                 <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
// //               </>
// //             )}
// //           </div>

// //           <p className="text-center mt-3 text-sm text-gray-400">
// //             {isListening ? 'PARLEZ MAINTENANT...' : 'Appuyez et parlez'}
// //           </p>
// //         </div>
// //       )}

// //       {/* Bottom Navigation */}
// //       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-gray-900/95 border-t border-gray-800/50 safe-area-padding">
// //         <div className="container mx-auto px-4 py-3">
// //           <div className="flex justify-around">
// //             <button
// //               onClick={() => setViewMode('home')}
// //               className={`flex flex-col items-center gap-1 p-2 ${viewMode === 'home' ? 'text-green-500' : 'text-gray-500'}`}
// //             >
// //               <Search size={22} />
// //               <span className="text-xs">Accueil</span>
// //             </button>

// //             <button
// //               onClick={() => handleQuickAction('garde')}
// //               className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-green-500 transition"
// //             >
// //               <Clock size={22} />
// //               <span className="text-xs">Garde</span>
// //             </button>

// //             <button
// //               onClick={() => handleQuickAction('normal')}
// //               className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-blue-500 transition"
// //             >
// //               <Building2 size={22} />
// //               <span className="text-xs">Normales</span>
// //             </button>

// //             <button className="flex flex-col items-center gap-1 p-2 text-gray-500">
// //               <Heart size={22} />
// //               <span className="text-xs">Favoris</span>
// //             </button>
// //           </div>
// //         </div>
// //       </nav>
// //     </div>
// //   );
// // }















































// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import OnboardingSteps from '../src/components/onboarding/OnboardingSteps';
// import MicrophoneButton from '../src/components/voice/MicrophoneButton';
// import PharmacyCard from '../src/components/ui/PharmacyCard';
// import { useVoice } from '../src/hooks/useVoice';
// import { useLocation } from '../src/hooks/useLocation';
// import { hybridPharmacySearch, analyzeQuery } from '../src/lib/pharmacies';
// import Image from "next/image";

// // IMPORT DIRECT DU FICHIER JSON
// import pharmaciesData from '../src/data/pharmacies.json';

// // Icônes Lucide React
// import {
//   MapPin, Phone, Clock, Shield,
//   Search, AlertCircle,
//   Sparkles, Moon, Sun, Heart,
//   Building2, ChevronLeft, X,
//   Mic, Volume2
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
//   const [viewMode, setViewMode] = useState('home');
//   const [showVoiceHelper, setShowVoiceHelper] = useState(false);

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

//   // ==================== FONCTION GÉOLOCALISATION ====================
//   const findNearbyPharmacies = () => {
//     if (!navigator.geolocation) {
//       alert("La géolocalisation n'est pas supportée par votre navigateur");
//       return;
//     }

//     setIsLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const userLat = position.coords.latitude;
//         const userLng = position.coords.longitude;

//         try {
//           const allPharmacies = pharmaciesData;

//           const calculateDistance = (lat1, lon1, lat2, lon2) => {
//             const R = 6371e3;
//             const φ1 = lat1 * Math.PI / 180;
//             const φ2 = lat2 * Math.PI / 180;
//             const Δφ = (lat2 - lat1) * Math.PI / 180;
//             const Δλ = (lon2 - lon1) * Math.PI / 180;

//             const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//               Math.cos(φ1) * Math.cos(φ2) *
//               Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//             return R * c;
//           };

//           const pharmaciesWithDistance = allPharmacies.map(pharmacy => {
//             if (!pharmacy.lat || !pharmacy.lng) {
//               return { ...pharmacy, distance: Infinity };
//             }

//             const distance = calculateDistance(
//               userLat,
//               userLng,
//               parseFloat(pharmacy.lat),
//               parseFloat(pharmacy.lng)
//             );

//             return { ...pharmacy, distance };
//           });

//           const nearbyPharmacies = pharmaciesWithDistance
//             .filter(p => p.distance < 10000 && p.distance !== Infinity)
//             .sort((a, b) => a.distance - b.distance)
//             .slice(0, 20);

//           setSearchResults(nearbyPharmacies.map((ph, i) => ({
//             ...ph,
//             id: `nearby_${i}`,
//             type: 'normal',
//             isGarde: false
//           })));

//           setSearchType('nearby');
//           setViewMode('results');

//         } catch (error) {
//           console.error('Erreur recherche pharmacies proches:', error);
//           alert("Erreur lors de la recherche des pharmacies proches");
//         } finally {
//           setIsLoading(false);
//         }
//       },
//       (error) => {
//         setIsLoading(false);
//         if (error.code === 1) {
//           alert("Activez la localisation pour trouver les pharmacies proches de vous");
//         } else {
//           alert("Impossible d'obtenir votre position. Vérifiez votre connexion GPS.");
//         }
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   // Chargement initial des données
//   useEffect(() => {
//     loadGardesData();

//     if (location) {
//       const city = location.lat > 4.0 ? 'Douala' : 'Yaoundé';
//       setUserCity(city);
//     }
//   }, [location]);

//   const loadGardesData = async () => {
//     setLoadingGardes(true);
//     try {
//       const response = await fetch('/data/gardes_du_jour_clean.json');
//       if (!response.ok) throw new Error('Fichier non trouvé');
//       const data = await response.json();
//       setGardesData(data);
//     } catch (error) {
//       console.error('Erreur chargement gardes:', error);
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

//   // Scroller vers le haut
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // Recherche vocale
//   useEffect(() => {
//     if (transcript) {
//       setSearchQuery(transcript);
//       handleVoiceCommand(transcript);
//     }
//   }, [transcript]);

//   // Gestion du bouton vocal
//   const handleVoiceButtonClick = () => {
//     setShowVoiceHelper(true);
//     startListening();
//   };

//   const handleVoiceCommand = (command) => {
//     const lowerCommand = command.toLowerCase();

//     if (lowerCommand.includes('pharmacie de garde') || lowerCommand.includes('garde')) {
//       handleGardeSearch();
//     } else if (lowerCommand.includes('pharmacie normale') || lowerCommand.includes('pharmacie')) {
//       performSearch(command, 'normal');
//     } else {
//       performSearch(command);
//     }
    
//     setTimeout(() => setShowVoiceHelper(false), 2000);
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

//     if (gardesData?.regions[region]) {
//       const citiesData = gardesData.regions[region];
//       const villes = citiesData.map(city => city.ville);
//       setSelectedCity({ 
//         region, 
//         villes,
//         citiesData
//       });
//     }
//   };

//   const handleCitySelect = (cityName) => {
//     if (!selectedRegion || !gardesData) return;

//     const regionData = gardesData.regions[selectedRegion];
//     const cityData = regionData.find(city => city.ville === cityName);
//     const pharmacies = cityData ? cityData.pharmacies : [];

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
//     showPharmacyDetails(pharmacy);
//   };

//   // MODALE PHARMACIE SANS BOUTON ITINÉRAIRE
//   const showPharmacyDetails = (pharmacy) => {
//     const detailsModal = document.createElement('div');
//     detailsModal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80';
//     detailsModal.innerHTML = `
//       <div class="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
//         <div class="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
//           <h3 class="text-xl font-bold text-white">Détails</h3>
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
//         '<div class="inline-flex items-center gap-2 px-3 py-1 bg-green-600/20 rounded-full mb-2"><Clock size={16} class="text-green-400" /><span class="text-green-400 font-medium">Pharmacie de garde</span></div>' :
//         '<div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 rounded-full mb-2"><Building2 size={16} class="text-blue-400" /><span class="text-blue-400 font-medium">Pharmacie normale</span></div>'
//       }
//             </div>
//           </div>

//           <div class="space-y-4">
//             <div>
//               <h5 class="text-sm text-gray-400 mb-2">Adresse</h5>
//               <div class="flex items-start gap-2">
//                 <MapPin class="text-green-500 mt-0.5" size={18} />
//                 <p class="text-white">${pharmacy.adresse || pharmacy.localisation || 'Non spécifiée'}</p>
//               </div>
//             </div>

//             <div>
//               <h5 class="text-sm text-gray-400 mb-2">Téléphone</h5>
//               <div class="flex items-center gap-2">
//                 <Phone class="text-green-500" size={18} />
//                 <a href="tel:${pharmacy.telephone || ''}" class="text-green-400 hover:text-green-300">${pharmacy.telephone || 'Non disponible'}</a>
//               </div>
//             </div>

//             ${pharmacy.horaires ? `
//               <div>
//                 <h5 class="text-sm text-gray-400 mb-2">Horaires</h5>
//                 <div class="flex items-center gap-2">
//                   <Clock class="text-green-500" size={18} />
//                   <span class="text-white">${pharmacy.horaires}</span>
//                 </div>
//               </div>
//             ` : ''}
//           </div>

//           <div class="mt-8 pt-6 border-t border-gray-800">
//             <button onclick="window.open('tel:${pharmacy.telephone || ''}', '_self')" 
//                     class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${!pharmacy.telephone ? 'opacity-50 cursor-not-allowed' : ''}"
//                     ${!pharmacy.telephone ? 'disabled' : ''}>
//               <Phone size={20} />
//               Appeler
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(detailsModal);

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
//         const allPharmacies = pharmaciesData;
//         const cityPharmacies = allPharmacies.filter(pharmacy =>
//           pharmacy.ville === city
//         );

//         const results = cityPharmacies.length > 0
//           ? cityPharmacies
//           : allPharmacies.slice(0, 20);

//         setSearchResults(results.map((ph, i) => ({
//           ...ph,
//           id: `normal_${city}_${i}`,
//           type: 'normal',
//           isGarde: false,
//           ville: ph.ville
//         })));
//         setSearchType('normal');
//       } else {
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
//           const lowerQuery = query.toLowerCase();
//           let customMessage = searchResult.message;

//           if (lowerQuery.includes('palais') ||
//             lowerQuery.includes('spécifique') ||
//             lowerQuery.includes('nom exact')) {
//             customMessage = "Cette pharmacie spécifique n'est pas dans notre base. Consultez l'annuaire médical officiel.";
//           } else if (searchResult.results && searchResult.results.length === 0) {
//             customMessage = `Aucune pharmacie trouvée pour "${query}". Essayez avec un nom plus simple ou consultez l'annuaire médical.`;
//           }

//           searchResult.message = customMessage;
//           setAiResponse(searchResult);
//           setSearchResults([]);
//         }
//       }
//     } catch (error) {
//       console.error('Erreur recherche:', error);
//       setSearchType('error');
//       setAiResponse({
//         type: 'error',
//         message: "Erreur de recherche. Veuillez réessayer ou consulter l'annuaire médical.",
//         suggestions: ['Recharger la page', 'Vérifier votre connexion']
//       });
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
//     switch (viewMode) {
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
//     switch (action) {
//       case 'garde':
//         handleGardeSearch();
//         break;
//       case 'normal':
//         performSearch('pharmacies normales', 'normal');
//         break;
//       case 'near':
//         findNearbyPharmacies();
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
//           <h3 className="text-xl font-bold text-white">Bien vouloir faire une autre recherche dans la barre de recherche</h3>
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

//   // OVERLAY VOCAL COMPACT ET MODERNE
//   const VoiceHelper = () => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
//     >
//       <div className="bg-gray-900/95 rounded-3xl border border-green-500/30 w-full max-w-md overflow-hidden shadow-2xl">
        
//         {/* Header minimal */}
//         <div className="p-4 border-b border-gray-800 flex justify-between items-center">
//           <h3 className="text-white font-medium">Recherche vocale</h3>
//           <button
//             onClick={() => setShowVoiceHelper(false)}
//             className="text-gray-400 hover:text-white transition p-1"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Micro énorme et animé - PRIORITÉ VISUELLE */}
//         <div className="p-8 flex flex-col items-center">
//           <div className="relative mb-6">
//             {/* Animation externe */}
//             <div className="absolute inset-0 -m-8">
//               <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
//               <div className="absolute inset-0 bg-green-500/5 rounded-full animate-pulse"></div>
//             </div>
            
//             {/* Micro principal */}
//             <div className="relative">
//               <div className="w-48 h-48 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-2xl">
//                 {isListening ? (
//                   <>
//                     {/* Animation d'onde pendant l'écoute */}
//                     <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
//                     <div className="absolute inset-8 border-4 border-white/20 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
//                     <div className="absolute inset-16 border-4 border-white/10 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    
//                     <Mic className="text-white" size={64} />
//                   </>
//                 ) : (
//                   <Mic className="text-white" size={64} />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Message principal */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2">
//               {isListening ? '🎤 ÉCOUTE...' : 'PARLEZ MAINTENANT'}
//             </h2>
//             <p className="text-gray-300 text-sm">
//               Prononcez clairement chaque mot
//             </p>
//           </div>

//           {/* Exemples réduits */}
//           <div className="w-full mb-6">
//             <p className="text-gray-400 text-xs mb-2 text-center">Exemples :</p>
//             <div className="flex flex-col gap-1.5">
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
//                 <span className="text-white text-sm">"Pharmacie de garde"</span>
//               </div>
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
//                 <span className="text-white text-sm">"Pharmacie normale"</span>
//               </div>
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
//                 <span className="text-white text-sm">"Pharmacie proche"</span>
//               </div>
//             </div>
//           </div>

//           {/* Transcript en bas */}
//           {transcript && (
//             <div className="w-full bg-gray-800/50 rounded-xl p-4 mb-4">
//               <p className="text-gray-400 text-xs mb-1">Vous avez dit :</p>
//               <p className="text-white font-medium text-center">{transcript}</p>
//             </div>
//           )}

//           {/* Indicateur d'écoute */}
//           {isListening && (
//             <div className="flex items-center justify-center gap-1 mb-4">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <div
//                   key={i}
//                   className="w-1.5 h-6 bg-green-400 rounded-full animate-pulse"
//                   style={{
//                     animationDelay: `${i * 0.1}s`,
//                     animationDuration: '0.6s'
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Bouton Annuler discret */}
//           <button
//             onClick={() => setShowVoiceHelper(false)}
//             className="mt-4 px-6 py-2 text-gray-400 hover:text-white text-sm transition"
//           >
//             Annuler
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );

//   if (showOnboarding) {
//     return <OnboardingSteps onComplete={handleOnboardingComplete} />;
//   }

//   return (
//     <div className="relative bg-gradient-to-b from-gray-900 to-black min-h-screen">
//       {/* Header */}
//       <header className="sticky top-0 z-40 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             {viewMode !== 'home' ? (
//               <button
//                 onClick={goBack}
//                 className="flex items-center gap-2 text-gray-300 hover:text-white transition"
//               >
//                 <ChevronLeft size={20} />
//                 <span className="hidden sm:inline text-sm">Retour</span>
//               </button>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
//                   <Image 
//                     src="/allo237logo.jpg" 
//                     alt="Logo" 
//                     width={48} 
//                     height={48} 
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 <div>
//                   <h1 className="text-lg font-bold text-white">Allo237</h1>
//                   <p className="text-xs text-gray-400">Trouvez votre pharmacie</p>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center gap-2">
//               {viewMode === 'home' && userCity && (
//                 <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-full">
//                   <MapPin size={14} className="text-green-500" />
//                   <span className="text-xs text-gray-300">{userCity}</span>
//                 </div>
//               )}

//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition"
//               >
//                 {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Overlay vocal compact */}
//       {showVoiceHelper && <VoiceHelper />}

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-4 pb-32">
//         <AnimatePresence mode="wait">
//           {viewMode === 'home' && (
//             <motion.div
//               key="home"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="pt-2"
//             >
//               {/* Hero Section */}
//               <div className="text-center mb-6">
//                 <div className="inline-flex items-center space-x-1 mb-3 px-3 py-1.5 bg-green-600/10 rounded-full border border-green-600/20">
//                   <Sparkles size={14} className="text-green-400" />
//                   <span className="text-xs sm:text-sm text-green-400 font-medium">Recherche Vocale</span>
//                 </div>

//                 <h1 className="text-2xl sm:text-4xl font-bold mb-3">
//                   <span className="text-white">Trouvez votre</span>
//                   <br />
//                   <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
//                     pharmacie
//                   </span>
//                 </h1>

//                 <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base px-4 mb-6">
//                   Dites "pharmacie de garde" ou "pharmacie normale" pour commencer
//                 </p>

//                 {/* Quick Actions */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto mb-6">
//                   <button
//                     onClick={() => handleQuickAction('garde')}
//                     className="bg-gradient-to-br from-green-600 to-green-800 p-3 sm:p-4 rounded-xl text-white hover:opacity-90 transition active:scale-95"
//                   >
//                     <div className="flex flex-col items-center gap-1">
//                       <Clock size={20} className="sm:size-6" />
//                       <span className="font-semibold text-xs sm:text-sm">De garde</span>
//                       <span className="text-xs text-green-200">Urgence 24h/24</span>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleQuickAction('normal')}
//                     className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 sm:p-4 rounded-xl text-white hover:opacity-90 transition active:scale-95"
//                   >
//                     <div className="flex flex-col items-center gap-1">
//                       <Building2 size={20} className="sm:size-6" />
//                       <span className="font-semibold text-xs sm:text-sm">Normales</span>
//                       <span className="text-xs text-blue-200">Horaires réguliers</span>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => handleQuickAction('near')}
//                     className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 sm:p-4 rounded-xl text-white hover:opacity-90 transition active:scale-95"
//                   >
//                     <div className="flex flex-col items-center gap-1">
//                       <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
//                         <MapPin size={20} className="sm:size-6" />
//                       </div>
//                       <span className="font-semibold text-xs sm:text-sm">Proche</span>
//                       <span className="text-xs text-purple-200">À côté de moi</span>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* Barre de recherche */}
//               <div className="max-w-xl mx-auto mb-6">
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                     <Search size={16} />
//                   </div>
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={handleTextSearch}
//                     placeholder="Tapez ou dites 'pharmacie de garde' ou 'pharmacie normale'..."
//                     className="w-full pl-10 pr-24 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition text-sm placeholder-gray-500"
//                     disabled={isLoading}
//                   />
//                   <button
//                     onClick={() => searchQuery.trim() && performSearch(searchQuery)}
//                     disabled={isLoading || !searchQuery.trim()}
//                     className="absolute right-1 top-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-md hover:opacity-90 transition flex items-center gap-1 disabled:opacity-50 text-xs active:scale-95"
//                   >
//                     {isLoading ? (
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <>
//                         <Search size={12} />
//                         Chercher
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="max-w-xl mx-auto text-center">
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
//                   <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
//                     <p className="text-lg font-bold text-green-400">24h/24</p>
//                     <p className="text-gray-400 text-xs">Service d'urgence</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
//                     <p className="text-lg font-bold text-blue-400">200+</p>
//                     <p className="text-gray-400 text-xs">Pharmacies</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
//                     <p className="text-lg font-bold text-purple-400">10+</p>
//                     <p className="text-gray-400 text-xs">Régions</p>
//                   </div>
//                   <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
//                     <p className="text-lg font-bold text-yellow-400">100%</p>
//                     <p className="text-gray-400 text-xs">Gratuit</p>
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
//               className="pt-2"
//             >
//               <div className="max-w-2xl mx-auto">
//                 <h2 className="text-xl font-bold text-white mb-2">
//                   Sélectionnez une région
//                 </h2>
//                 <p className="text-gray-400 text-sm mb-4">
//                   Choisissez la région pour voir les pharmacies de garde disponibles
//                 </p>

//                 {loadingGardes ? (
//                   <div className="text-center py-8">
//                     <div className="w-12 h-12 mx-auto mb-4 border-3 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
//                     <p className="text-gray-300">Chargement des régions...</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-3">
//                     {Object.keys(gardesData?.regions || {}).map((region) => {
//                       const regionData = gardesData.regions[region] || [];
//                       let pharmacyCount = 0;
                      
//                       if (regionData.length > 0 && regionData[0].pharmacies) {
//                         pharmacyCount = regionData.reduce((total, city) => {
//                           return total + (city.pharmacies?.length || 0);
//                         }, 0);
//                       } else {
//                         pharmacyCount = regionData.length;
//                       }
                      
//                       const colorClass = REGION_COLORS[region] || 'from-green-500 to-green-700';

//                       return (
//                         <button
//                           key={region}
//                           onClick={() => handleRegionSelect(region)}
//                           className={`bg-gradient-to-br ${colorClass} p-4 rounded-xl text-white hover:opacity-90 transition text-left active:scale-95`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <h3 className="font-bold text-lg">{region}</h3>
//                               <p className="text-sm opacity-90">
//                                 {pharmacyCount} pharmacie{pharmacyCount > 1 ? 's' : ''} de garde
//                               </p>
//                             </div>
//                             <Building2 size={24} className="opacity-50" />
//                           </div>
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
//               className="pt-2"
//             >
//               <div className="max-w-2xl mx-auto">
//                 <h2 className="text-xl font-bold text-white mb-2">
//                   {selectedRegion}
//                 </h2>
//                 <p className="text-gray-400 text-sm mb-4">
//                   Sélectionnez une ville pour voir les pharmacies de garde
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                   {selectedCity.villes.map((ville, index) => {
//                     let villePharmaciesCount = 0;
                    
//                     if (selectedCity.citiesData) {
//                       const cityData = selectedCity.citiesData.find(city => city.ville === ville);
//                       villePharmaciesCount = cityData ? cityData.pharmacies?.length || 0 : 0;
//                     }

//                     return (
//                       <button
//                         key={index}
//                         onClick={() => handleCitySelect(ville)}
//                         className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-green-500 hover:bg-gray-800/50 transition text-left active:scale-95"
//                       >
//                         <div className="flex justify-between items-start mb-1">
//                           <h3 className="font-semibold text-white">{ville}</h3>
//                           <div className="px-2 py-0.5 bg-green-600/20 rounded-full">
//                             <span className="text-green-400 text-xs font-medium">
//                               {villePharmaciesCount}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-gray-400 text-xs">
//                           {villePharmaciesCount} pharmacie{villePharmaciesCount > 1 ? 's' : ''} de garde
//                         </p>
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
//               className="pt-2"
//             >
//               {isLoading ? (
//                 <div className="text-center py-8">
//                   <div className="w-12 h-12 mx-auto mb-4 border-3 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
//                   <p className="text-gray-300">Recherche en cours...</p>
//                 </div>
//               ) : (
//                 <>
//                   {searchType === 'ai' && aiResponse && <AIResponseDisplay response={aiResponse} />}
//                   {searchType === 'fallback' && aiResponse && <FallbackDisplay response={aiResponse} />}

//                   {searchResults.length > 0 ? (
//                     <div className="max-w-4xl mx-auto">
//                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
//                         <div>
//                           <h2 className="text-lg font-bold text-white">
//                             {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
//                           </h2>
//                           {searchType === 'garde_city' && selectedRegion && (
//                             <p className="text-green-400 text-sm">
//                               Pharmacies de garde à {selectedRegion}
//                             </p>
//                           )}
//                           {searchType === 'nearby' && (
//                             <p className="text-purple-400 text-sm">
//                               Pharmacies proches de votre position
//                             </p>
//                           )}
//                         </div>

//                         <div className="flex gap-2 mt-2">
//                           {searchType === 'garde_city' && (
//                             <button
//                               onClick={() => setViewMode('city')}
//                               className="px-3 py-1.5 bg-gray-800 rounded text-gray-300 hover:bg-gray-700 transition text-sm active:scale-95"
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
//                             className="px-3 py-1.5 bg-green-600 rounded text-white hover:bg-green-700 transition text-sm active:scale-95"
//                           >
//                             Nouvelle recherche
//                           </button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 gap-3 pb-20">
//                         {searchResults.map((pharmacy, index) => (
//                           <div key={pharmacy.id || index} onClick={() => handlePharmacySelect(pharmacy)}>
//                             <PharmacyCard
//                               pharmacy={pharmacy}
//                               distance={pharmacy.distance}
//                               isRecommended={false}
//                               isGarde={pharmacy.type === 'garde'}
//                               showItinerary={false} // Désactive le bouton itinéraire dans la carte
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <AlertCircle size={48} className="text-gray-500 mx-auto mb-3" />
//                       <p className="text-lg text-gray-300">Aucun résultat trouvé</p>
//                       <p className="text-gray-500 text-sm mt-1">Essayez une autre recherche</p>
//                       <button
//                         onClick={() => setViewMode('home')}
//                         className="mt-4 px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 transition text-sm active:scale-95"
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

//       {/* Bouton vocal principal */}
//       {(viewMode === 'home' || viewMode === 'results') && !showVoiceHelper && (
//         <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-30">
//           <div className="relative">
//             <MicrophoneButton
//               isListening={isListening}
//               onClick={handleVoiceButtonClick}
//               disabled={isLoading}
//               size="large"
//             />
//             {isListening && (
//               <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-ping"></div>
//             )}
//           </div>
//           <p className="text-center mt-2 text-xs text-gray-400">
//             {isListening ? 'Écoute en cours...' : 'Parlez'}
//           </p>
//         </div>
//       )}

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-gray-900/95 border-t border-gray-800/50 z-20">
//         <div className="container mx-auto px-4 py-2">
//           <div className="flex justify-around">
//             <button
//               onClick={() => setViewMode('home')}
//               className={`flex flex-col items-center gap-0.5 p-1.5 ${viewMode === 'home' ? 'text-green-500' : 'text-gray-500'} transition`}
//             >
//               <Search size={18} />
//               <span className="text-xs">Accueil</span>
//             </button>

//             <button
//               onClick={() => handleQuickAction('garde')}
//               className="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-green-500 transition active:scale-95"
//             >
//               <Clock size={18} />
//               <span className="text-xs">Garde</span>
//             </button>

//             <button
//               onClick={() => handleQuickAction('normal')}
//               className="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-blue-500 transition active:scale-95"
//             >
//               <Building2 size={18} />
//               <span className="text-xs">Normales</span>
//             </button>

//             <button className="flex flex-col items-center gap-0.5 p-1.5 text-gray-500">
//               <Heart size={18} />
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
import { hybridPharmacySearch, analyzeQuery } from '../src/lib/pharmacies';
import Image from "next/image";

// IMPORT DIRECT DU FICHIER JSON
import pharmaciesData from '../src/data/pharmacies.json';

// Icônes Lucide React
import {
  MapPin, Phone, Clock, Shield,
  Search, AlertCircle,
  Sparkles, Moon, Sun, Heart,
  Building2, ChevronLeft, X,
  Mic, Volume2
} from 'lucide-react';

// ==================== INDEXATION DES PHARMACIES ====================
// Fonctions d'indexation intégrées directement dans le fichier
let pharmaciesIndex = null;
let villeList = [];

const initPharmacyIndex = (pharmaciesData) => {
  const index = {
    parNom: new Map(),     // "tongolo" → [pharmacie]
    parVille: new Map(),   // "yaoundé" → [toutes pharmacies de yaoundé]
    nomsSimplifies: new Map()
  };

  pharmaciesData.forEach(pharma => {
    // Index par NOM SIMPLIFIÉ
    const nomSimple = pharma.nom
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/pharmacie\s*/gi, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!index.parNom.has(nomSimple)) {
      index.parNom.set(nomSimple, []);
    }
    index.parNom.get(nomSimple).push(pharma);
    index.nomsSimplifies.set(nomSimple, pharma.nom);

    // Index par VILLE
    if (pharma.ville) {
      const villeClean = pharma.ville
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .trim();
      
      if (!index.parVille.has(villeClean)) {
        index.parVille.set(villeClean, []);
        villeList.push(villeClean);
      }
      index.parVille.get(villeClean).push(pharma);
    }
  });

  pharmaciesIndex = index;
  console.log(`✅ Index initialisé: ${index.parVille.size} villes, ${index.parNom.size} noms`);
  return index;
};

const searchPharmacyByName = (query) => {
  if (!pharmaciesIndex) return null;
  
  const queryClean = query
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/pharmacie\s*/gi, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  // Recherche exacte
  if (pharmaciesIndex.parNom.has(queryClean)) {
    return pharmaciesIndex.parNom.get(queryClean);
  }

  // Recherche partielle
  for (const [nom, pharmacies] of pharmaciesIndex.parNom) {
    if (nom.includes(queryClean) || queryClean.includes(nom)) {
      return pharmacies;
    }
  }

  return null;
};

const searchPharmacyByCity = (villeQuery) => {
  if (!pharmaciesIndex) return [];
  
  const villeClean = villeQuery
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Recherche exacte
  if (pharmaciesIndex.parVille.has(villeClean)) {
    return pharmaciesIndex.parVille.get(villeClean);
  }

  // Recherche approximative (yaounde → yaoundé)
  for (const [ville, pharmacies] of pharmaciesIndex.parVille) {
    if (ville.includes(villeClean) || villeClean.includes(ville)) {
      return pharmacies;
    }
  }

  return []; // Ville non trouvée
};

// ==================== COMPOSANT PRINCIPAL ====================
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
  const [viewMode, setViewMode] = useState('home');
  const [showVoiceHelper, setShowVoiceHelper] = useState(false);
  const [pharmacyIndex, setPharmacyIndex] = useState(null);

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

  // ==================== FONCTIONS DE RECHERCHE LOCALE ====================
  const searchLocalPharmacies = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Nettoyer la requête
    let cleanQuery = lowerQuery
      .replace(/^pharmacie\s+de\s+/, '')
      .replace(/^pharmacie\s+/, '')
      .trim();

    // Recherche par ville
    const resultatsVille = searchPharmacyByCity(cleanQuery);
    if (resultatsVille.length > 0) {
      return {
        type: 'ville',
        results: resultatsVille,
        message: `Pharmacies à ${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)}`
      };
    }

    // Recherche par nom
    const resultatsNom = searchPharmacyByName(cleanQuery);
    if (resultatsNom && resultatsNom.length > 0) {
      return {
        type: 'exact',
        results: resultatsNom,
        message: `Pharmacie ${resultatsNom[0].nom}`
      };
    }

    // Aucun résultat local
    return {
      type: 'not_found',
      results: [],
      message: `Aucune pharmacie trouvée pour "${query}" localement`
    };
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
          const allPharmacies = pharmaciesData;

          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371e3;
            const φ1 = lat1 * Math.PI / 180;
            const φ2 = lat2 * Math.PI / 180;
            const Δφ = (lat2 - lat1) * Math.PI / 180;
            const Δλ = (lon2 - lon1) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

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

          const nearbyPharmacies = pharmaciesWithDistance
            .filter(p => p.distance < 10000 && p.distance !== Infinity)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 20);

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

  // ==================== CHARGEMENT INITIAL ====================
  useEffect(() => {
    loadGardesData();

    if (location) {
      const city = location.lat > 4.0 ? 'Douala' : 'Yaoundé';
      setUserCity(city);
    }

    // INITIALISER L'INDEX DES PHARMACIES
    const index = initPharmacyIndex(pharmaciesData);
    setPharmacyIndex(index);
    
    console.log("🎯 Villes disponibles:", Array.from(index.parVille.keys()).sort());
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

  // Scroller vers le haut
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ==================== RECHERCHE VOCALE AMÉLIORÉE ====================
  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
      handleVoiceCommand(transcript);
    }
  }, [transcript]);

  // Gestion du bouton vocal
  const handleVoiceButtonClick = () => {
    setShowVoiceHelper(true);
    startListening();
  };

  // NOUVELLE FONCTION handleVoiceCommand AMÉLIORÉE
  const handleVoiceCommand = (command) => {
    console.log(`🎤 Commande vocale: "${command}"`);
    const lowerCommand = command.toLowerCase().trim();
    
    // ENLEVER "PHARMACIE DE" AU DÉBUT SI PRÉSENT
    let query = lowerCommand
      .replace(/^pharmacie\s+de\s+/, '')  // "pharmacie de mbouda" → "mbouda"
      .replace(/^pharmacie\s+/, '')       // "pharmacie tongolo" → "tongolo"
      .trim();

    // 1. ESSAYER COMME VILLE D'ABORD
    const resultatsVille = searchPharmacyByCity(query);
    
    if (resultatsVille.length > 0) {
      // C'EST UNE VILLE !
      setSearchResults(resultatsVille);
      setSearchQuery(`Pharmacies à ${query.charAt(0).toUpperCase() + query.slice(1)}`);
      setViewMode('results');
      setSearchType('ville');
      
      setTimeout(() => setShowVoiceHelper(false), 800);
      return;
    }

    // 2. ESSAYER COMME NOM DE PHARMACIE
    const resultatsNom = searchPharmacyByName(query);
    
    if (resultatsNom && resultatsNom.length > 0) {
      // C'EST UN NOM DE PHARMACIE !
      setSearchResults(resultatsNom);
      setSearchQuery(resultatsNom[0].nom);
      setViewMode('results');
      setSearchType('exact');
      
      setTimeout(() => setShowVoiceHelper(false), 800);
      return;
    }

    // 3. SI ON ARRIVE ICI, C'EST NI UNE VILLE NI UN NOM CONNU
    // On vérifie si c'est une commande spéciale comme "garde" ou "normale"
    if (lowerCommand.includes('pharmacie de garde') || lowerCommand.includes('garde')) {
      handleGardeSearch();
      setTimeout(() => setShowVoiceHelper(false), 800);
      return;
    } else if (lowerCommand.includes('pharmacie normale') || lowerCommand.includes('pharmacie')) {
      performSearch(command, 'normal');
      setTimeout(() => setShowVoiceHelper(false), 800);
      return;
    }

    // 4. MESSAGE POLI POUR VILLE/NOM INCONNU
    const villesDisponibles = Array.from(pharmaciesIndex?.parVille.keys() || []).slice(0, 5);
    const messagePoli = `Je n'ai pas trouvé "${command}". Essayez avec une ville comme ${villesDisponibles.join(', ')}.`;
    
    setAiResponse({
      type: 'info',
      message: messagePoli,
      suggestions: villesDisponibles
    });
    
    setSearchResults([]);
    setViewMode('results');
    setSearchType('not_found');
    
    setTimeout(() => setShowVoiceHelper(false), 1500);
  };

  // ==================== RECHERCHE TEXTUELLE AMÉLIORÉE ====================
  const performSearch = async (query, type = 'all') => {
    console.log(`🔍 Recherche textuelle: "${query}"`);
    const lowerQuery = query.toLowerCase().trim();
    
    setIsLoading(true);
    setAiResponse(null);
    setSearchType(null);
    setShowRegionSelection(false);
    setViewMode('results');

    try {
      // 1. D'ABORD ESSAYER LA RECHERCHE LOCALE (INSTANTANÉE)
      const localSearch = searchLocalPharmacies(lowerQuery);

      if (localSearch.type === 'ville' || localSearch.type === 'exact') {
        setSearchResults(localSearch.results);
        setSearchType(localSearch.type);
        
        if (localSearch.type === 'ville') {
          setSearchQuery(`Pharmacies à ${lowerQuery.charAt(0).toUpperCase() + lowerQuery.slice(1)}`);
        } else {
          setSearchQuery(localSearch.results[0]?.nom || query);
        }
        
        setIsLoading(false);
        return;
      }

      // 2. SI C'EST UNE COMMANDE "GARDE"
      if (lowerQuery.includes('garde')) {
        handleGardeSearch();
        setIsLoading(false);
        return;
      }

      // 3. SI C'EST "NORMALE" OU "PHARMACIE"
      if (type === 'normal' || lowerQuery.includes('normale') || lowerQuery.includes('pharmacie')) {
        const allPharmacies = pharmaciesData;
        const city = userCity || 'Yaoundé';
        
        const cityPharmacies = allPharmacies.filter(pharmacy =>
          pharmacy.ville === city
        );

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
        setIsLoading(false);
        return;
      }

      // 4. FALLBACK: UTILISER L'ANCIENNE RECHERCHE HYBRIDE
      const queryInfo = analyzeQuery(query);
      const city = queryInfo.ville || userCity || 'Yaoundé';
      
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

    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchType('error');
      setAiResponse({
        type: 'error',
        message: "Erreur de recherche. Veuillez réessayer.",
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
      
      // Si c'est une ville ou un nom spécifique, utiliser performSearch améliorée
      if (lowerQuery.includes('garde')) {
        handleGardeSearch();
      } else {
        // Utiliser la nouvelle performSearch qui cherche d'abord localement
        performSearch(searchQuery);
      }
    }
  };

  // ==================== FONCTIONS DES PHARMACIES DE GARDE ====================
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
      const citiesData = gardesData.regions[region];
      const villes = citiesData.map(city => city.ville);
      setSelectedCity({ 
        region, 
        villes,
        citiesData
      });
    }
  };

  const handleCitySelect = (cityName) => {
    if (!selectedRegion || !gardesData) return;

    const regionData = gardesData.regions[selectedRegion];
    const cityData = regionData.find(city => city.ville === cityName);
    const pharmacies = cityData ? cityData.pharmacies : [];

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

  // MODALE PHARMACIE
  const showPharmacyDetails = (pharmacy) => {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80';
    detailsModal.innerHTML = `
      <div class="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">Détails</h3>
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

            ${pharmacy.horaires ? `
              <div>
                <h5 class="text-sm text-gray-400 mb-2">Horaires</h5>
                <div class="flex items-center gap-2">
                  <Clock class="text-green-500" size={18} />
                  <span class="text-white">${pharmacy.horaires}</span>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="mt-8 pt-6 border-t border-gray-800">
            <button onclick="window.open('tel:${pharmacy.telephone || ''}', '_self')" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${!pharmacy.telephone ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${!pharmacy.telephone ? 'disabled' : ''}>
              <Phone size={20} />
              Appeler
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(detailsModal);

    detailsModal.querySelector('button').onclick = () => detailsModal.remove();
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const goBack = () => {
    switch (viewMode) {
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
    switch (action) {
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

  // ==================== COMPOSANTS D'AFFICHAGE ====================
  const AIResponseDisplay = ({ response }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mb-8"
    >
      <div className="bg-gradient-to-r from-yellow-600/20 to-transparent border border-yellow-600/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-yellow-500" size={24} />
          <h3 className="text-xl font-bold text-white">Recherche élargie</h3>
        </div>
        <p className="text-gray-200 mb-4">{response.message}</p>
        {response.suggestions && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Villes disponibles :</p>
            <div className="flex flex-wrap gap-2">
              {response.suggestions.map((ville, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(ville);
                    performSearch(ville);
                  }}
                  className="px-4 py-2 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-yellow-300 text-sm hover:bg-yellow-600/30 transition"
                >
                  {ville}
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

  // FEEDBACK VOCAL VISUEL
  const VoiceFeedback = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mb-2"
    >
      <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-green-600/20 to-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-300 font-medium">"{transcript}"</span>
        <div className="ml-auto flex items-center gap-1">
          {searchType === 'exact' && (
            <span className="text-xs bg-green-600/30 px-2 py-0.5 rounded">🎯 Exact</span>
          )}
          {searchType === 'ville' && (
            <span className="text-xs bg-blue-600/30 px-2 py-0.5 rounded">🏙️ Ville</span>
          )}
          {searchType === 'garde' && (
            <span className="text-xs bg-red-600/30 px-2 py-0.5 rounded">🛡️ Garde</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  // OVERLAY VOCAL COMPACT ET MODERNE
  const VoiceHelper = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-gray-900/95 rounded-3xl border border-green-500/30 w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Header minimal */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-white font-medium">Recherche vocale</h3>
          <button
            onClick={() => setShowVoiceHelper(false)}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Micro énorme et animé - PRIORITÉ VISUELLE */}
        <div className="p-8 flex flex-col items-center">
          <div className="relative mb-6">
            {/* Animation externe */}
            <div className="absolute inset-0 -m-8">
              <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-green-500/5 rounded-full animate-pulse"></div>
            </div>
            
            {/* Micro principal */}
            <div className="relative">
              <div className="w-48 h-48 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-2xl">
                {isListening ? (
                  <>
                    {/* Animation d'onde pendant l'écoute */}
                    <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-8 border-4 border-white/20 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute inset-16 border-4 border-white/10 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    
                    <Mic className="text-white" size={64} />
                  </>
                ) : (
                  <Mic className="text-white" size={64} />
                )}
              </div>
            </div>
          </div>

          {/* Message principal */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isListening ? '🎤 ÉCOUTE...' : 'PARLEZ MAINTENANT'}
            </h2>
            <p className="text-gray-300 text-sm">
              Dites "Yaoundé", "Douala" ou le nom d'une pharmacie
            </p>
          </div>

          {/* Exemples réduits */}
          <div className="w-full mb-6">
            <p className="text-gray-400 text-xs mb-2 text-center">Exemples :</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">"Yaoundé"</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">"Douala"</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">"Saint Victor"</span>
              </div>
            </div>
          </div>

          {/* Transcript en bas */}
          {transcript && (
            <div className="w-full bg-gray-800/50 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-xs mb-1">Vous avez dit :</p>
              <p className="text-white font-medium text-center">{transcript}</p>
            </div>
          )}

          {/* Indicateur d'écoute */}
          {isListening && (
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-6 bg-green-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          )}

          {/* Bouton Annuler discret */}
          <button
            onClick={() => setShowVoiceHelper(false)}
            className="mt-4 px-6 py-2 text-gray-400 hover:text-white text-sm transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (showOnboarding) {
    return <OnboardingSteps onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {viewMode !== 'home' ? (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline text-sm">Retour</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/allo237logo.jpg" 
                    alt="Logo" 
                    width={48} 
                    height={48} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Allo237</h1>
                  <p className="text-xs text-gray-400">Trouvez votre pharmacie</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {viewMode === 'home' && userCity && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gray-800 rounded-full">
                  <MapPin size={14} className="text-green-500" />
                  <span className="text-xs text-gray-300">{userCity}</span>
                </div>
              )}

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay vocal compact */}
      {showVoiceHelper && <VoiceHelper />}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 pb-32">
        <AnimatePresence mode="wait">
          {viewMode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-2"
            >
              {/* Hero Section */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-1 mb-3 px-3 py-1.5 bg-green-600/10 rounded-full border border-green-600/20">
                  <Sparkles size={14} className="text-green-400" />
                  <span className="text-xs sm:text-sm text-green-400 font-medium">Recherche Vocale</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-bold mb-3">
                  <span className="text-white">Trouvez votre</span>
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    pharmacie
                  </span>
                </h1>

                <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base px-4 mb-6">
                  Dites "Yaoundé", "Douala" ou le nom d'une pharmacie
                </p>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto mb-6">
                  <button
                    onClick={() => handleQuickAction('garde')}
                    className="bg-gradient-to-br from-green-600 to-green-800 p-3 sm:p-4 rounded-xl text-white hover:opacity-90 transition active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Clock size={20} className="sm:size-6" />
                      <span className="font-semibold text-xs sm:text-sm">De garde</span>
                      <span className="text-xs text-green-200">Urgence 24h/24</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('normal')}
                    className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 sm:p-4 rounded-xl text-white hover:opacity-90 transition active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Building2 size={20} className="sm:size-6" />
                      <span className="font-semibold text-xs sm:text-sm">Normales</span>
                      <span className="text-xs text-blue-200">Horaires réguliers</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleQuickAction('near')}
                    className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 sm:p-4 rounded-xl text-white hover:opacity-90 transition active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        <MapPin size={20} className="sm:size-6" />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm">Proche</span>
                      <span className="text-xs text-purple-200">À côté de moi</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="max-w-xl mx-auto mb-6">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleTextSearch}
                    placeholder="Tapez ou dites 'Yaoundé', 'Douala' ou un nom de pharmacie..."
                    className="w-full pl-10 pr-24 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition text-sm placeholder-gray-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => searchQuery.trim() && performSearch(searchQuery)}
                    disabled={isLoading || !searchQuery.trim()}
                    className="absolute right-1 top-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-md hover:opacity-90 transition flex items-center gap-1 disabled:opacity-50 text-xs active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search size={12} />
                        Chercher
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Feedback de recherche */}
              {isLoading && searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-xl mx-auto mb-2"
                >
                  <div className="flex items-center gap-2 text-sm bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-300">
                      Recherche "{searchQuery.substring(0, 30)}..."
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Feedback vocal */}
              {isListening && transcript && <VoiceFeedback />}

              {/* Stats */}
              <div className="max-w-xl mx-auto text-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                    <p className="text-lg font-bold text-green-400">24h/24</p>
                    <p className="text-gray-400 text-xs">Service d'urgence</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                    <p className="text-lg font-bold text-blue-400">250+</p>
                    <p className="text-gray-400 text-xs">Pharmacies</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                    <p className="text-lg font-bold text-purple-400">10+</p>
                    <p className="text-gray-400 text-xs">Villes</p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                    <p className="text-lg font-bold text-yellow-400">100%</p>
                    <p className="text-gray-400 text-xs">Gratuit</p>
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
              className="pt-2"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-2">
                  Sélectionnez une région
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Choisissez la région pour voir les pharmacies de garde disponibles
                </p>

                {loadingGardes ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-4 border-3 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                    <p className="text-gray-300">Chargement des régions...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {Object.keys(gardesData?.regions || {}).map((region) => {
                      const regionData = gardesData.regions[region] || [];
                      let pharmacyCount = 0;
                      
                      if (regionData.length > 0 && regionData[0].pharmacies) {
                        pharmacyCount = regionData.reduce((total, city) => {
                          return total + (city.pharmacies?.length || 0);
                        }, 0);
                      } else {
                        pharmacyCount = regionData.length;
                      }
                      
                      const colorClass = REGION_COLORS[region] || 'from-green-500 to-green-700';

                      return (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className={`bg-gradient-to-br ${colorClass} p-4 rounded-xl text-white hover:opacity-90 transition text-left active:scale-95`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg">{region}</h3>
                              <p className="text-sm opacity-90">
                                {pharmacyCount} pharmacie{pharmacyCount > 1 ? 's' : ''} de garde
                              </p>
                            </div>
                            <Building2 size={24} className="opacity-50" />
                          </div>
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
              className="pt-2"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-2">
                  {selectedRegion}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Sélectionnez une ville pour voir les pharmacies de garde
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCity.villes.map((ville, index) => {
                    let villePharmaciesCount = 0;
                    
                    if (selectedCity.citiesData) {
                      const cityData = selectedCity.citiesData.find(city => city.ville === ville);
                      villePharmaciesCount = cityData ? cityData.pharmacies?.length || 0 : 0;
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleCitySelect(ville)}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-green-500 hover:bg-gray-800/50 transition text-left active:scale-95"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-white">{ville}</h3>
                          <div className="px-2 py-0.5 bg-green-600/20 rounded-full">
                            <span className="text-green-400 text-xs font-medium">
                              {villePharmaciesCount}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs">
                          {villePharmaciesCount} pharmacie{villePharmaciesCount > 1 ? 's' : ''} de garde
                        </p>
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
              className="pt-2"
            >
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 border-3 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                  <p className="text-gray-300">Recherche en cours...</p>
                </div>
              ) : (
                <>
                  {(searchType === 'ai' || searchType === 'fallback' || searchType === 'not_found') && aiResponse && (
                    <AIResponseDisplay response={aiResponse} />
                  )}

                  {searchResults.length > 0 ? (
                    <div className="max-w-4xl mx-auto">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                        <div>
                          <h2 className="text-lg font-bold text-white">
                            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                          </h2>
                          {searchType === 'garde_city' && selectedRegion && (
                            <p className="text-green-400 text-sm">
                              Pharmacies de garde à {selectedRegion}
                            </p>
                          )}
                          {searchType === 'ville' && (
                            <p className="text-blue-400 text-sm">
                              Pharmacies à {searchQuery.replace('Pharmacies à ', '')}
                            </p>
                          )}
                          {searchType === 'exact' && (
                            <p className="text-green-400 text-sm">
                              🎯 Correspondance exacte
                            </p>
                          )}
                          {searchType === 'normal' && (
                            <p className="text-blue-400 text-sm">
                              Pharmacies normales
                            </p>
                          )}
                          {searchType === 'nearby' && (
                            <p className="text-purple-400 text-sm">
                              Pharmacies proches de votre position
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 mt-2">
                          {searchType === 'garde_city' && (
                            <button
                              onClick={() => setViewMode('city')}
                              className="px-3 py-1.5 bg-gray-800 rounded text-gray-300 hover:bg-gray-700 transition text-sm active:scale-95"
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
                            className="px-3 py-1.5 bg-green-600 rounded text-white hover:bg-green-700 transition text-sm active:scale-95"
                          >
                            Nouvelle recherche
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 pb-20">
                        {searchResults.map((pharmacy, index) => (
                          <div key={pharmacy.id || index} onClick={() => handlePharmacySelect(pharmacy)}>
                            <PharmacyCard
                              pharmacy={pharmacy}
                              distance={pharmacy.distance}
                              isRecommended={false}
                              isGarde={pharmacy.type === 'garde'}
                              showItinerary={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (!aiResponse && searchType !== 'garde') ? (
                    <div className="text-center py-8">
                      <AlertCircle size={48} className="text-gray-500 mx-auto mb-3" />
                      <p className="text-lg text-gray-300">Aucun résultat trouvé</p>
                      <p className="text-gray-500 text-sm mt-1">Essayez une autre recherche</p>
                      <button
                        onClick={() => setViewMode('home')}
                        className="mt-4 px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 transition text-sm active:scale-95"
                      >
                        Retour à l'accueil
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bouton vocal principal */}
      {(viewMode === 'home' || viewMode === 'results') && !showVoiceHelper && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="relative">
            <MicrophoneButton
              isListening={isListening}
              onClick={handleVoiceButtonClick}
              disabled={isLoading}
              size="large"
            />
            {isListening && (
              <div className="absolute -inset-2 bg-green-500/20 rounded-full animate-ping"></div>
            )}
          </div>
          <p className="text-center mt-2 text-xs text-gray-400">
            {isListening ? 'Écoute en cours...' : 'Parlez maintenant'}
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-gray-900/95 border-t border-gray-800/50 z-20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-around">
            <button
              onClick={() => setViewMode('home')}
              className={`flex flex-col items-center gap-0.5 p-1.5 ${viewMode === 'home' ? 'text-green-500' : 'text-gray-500'} transition`}
            >
              <Search size={18} />
              <span className="text-xs">Accueil</span>
            </button>

            <button
              onClick={() => handleQuickAction('garde')}
              className="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-green-500 transition active:scale-95"
            >
              <Clock size={18} />
              <span className="text-xs">Garde</span>
            </button>

            <button
              onClick={() => handleQuickAction('normal')}
              className="flex flex-col items-center gap-0.5 p-1.5 text-gray-500 hover:text-blue-500 transition active:scale-95"
            >
              <Building2 size={18} />
              <span className="text-xs">Normales</span>
            </button>

            <button className="flex flex-col items-center gap-0.5 p-1.5 text-gray-500">
              <Heart size={18} />
              <span className="text-xs">Favoris</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}