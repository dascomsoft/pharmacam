


'use client';
import { MapPin, Phone, Navigation, Clock, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Fonction pour formater la distance
const formatDistance = (distance) => {
  if (!distance || distance === Infinity) return null;
  
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  } else {
    return `${(distance / 1000).toFixed(1)}km`;
  }
};

export default function PharmacyCard({ pharmacy, distance, isRecommended, isGarde }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br from-secondary-light to-secondary border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] hover:border-primary/30 hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.2)] ${
        isRecommended ? 'border-2 border-primary/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-white">{pharmacy.nom}</h3>
            {isRecommended && (
              <span className="px-3 py-1 bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold rounded-full flex items-center">
                <Zap size={12} className="mr-1" /> RECOMMANDÉ
              </span>
            )}
          </div>
          
          {/* Badge Type */}
          <div className="mb-3">
            {isGarde ? (
              <span className="px-3 py-1 bg-green-600/20 border border-green-600/30 rounded-full text-green-400 text-sm font-medium flex items-center w-fit">
                <Clock size={12} className="mr-1" /> Pharmacie de garde
              </span>
            ) : (
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-600/30 rounded-full text-blue-400 text-sm font-medium flex items-center w-fit">
                <Shield size={12} className="mr-1" /> Pharmacie normale
              </span>
            )}
          </div>
          
          {/* Note */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(pharmacy.note || 3)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">{pharmacy.note || 3}/5</span>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-col items-end space-y-2">
          {pharmacy.garde_24h && (
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-xs text-green-400 font-medium flex items-center">
                <Clock size={12} className="mr-1" /> 24h/24
              </span>
            </div>
          )}
          
          {distance && (
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-xs text-blue-400 font-medium flex items-center">
                <Navigation size={12} className="mr-1" />
                {formatDistance(distance)}
              </span>
            </div>
          )}
          
          {/* Ville */}
          {pharmacy.ville && (
            <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <span className="text-xs text-purple-400 font-medium">
                {pharmacy.ville}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Informations */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-3">
          <MapPin size={18} className="text-primary mt-0.5" />
          <div>
            <p className="text-gray-300 font-medium">{pharmacy.adresse || pharmacy.localisation || 'Adresse non spécifiée'}</p>
            {pharmacy.quartier && (
              <p className="text-gray-500 text-sm">
                {pharmacy.quartier} • {pharmacy.ville || 'Ville inconnue'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone size={18} className="text-accent-green" />
          <p className="text-gray-300 font-medium">{pharmacy.telephone || pharmacy.tel || 'Non disponible'}</p>
        </div>
        
        {/* Horaires */}
        {pharmacy.horaires && (
          <div className="flex items-center space-x-3">
            <Clock size={18} className="text-yellow-500" />
            <p className="text-gray-300 text-sm">{pharmacy.horaires}</p>
          </div>
        )}
        
        {/* Services */}
        {pharmacy.services && pharmacy.services.length > 0 && (
          <div className="pt-3">
            <p className="text-sm text-gray-500 mb-2">Services :</p>
            <div className="flex flex-wrap gap-2">
              {pharmacy.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full border border-gray-700"
                >
                  {service}
                </span>
              ))}
              {pharmacy.services.length > 3 && (
                <span className="px-3 py-1 bg-gray-800 text-gray-500 text-xs rounded-full">
                  +{pharmacy.services.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => {
            const phone = pharmacy.telephone || pharmacy.tel;
            if (phone && phone !== 'Non disponible' && phone !== 'Non listé') {
              window.open(`tel:${phone}`, '_self');
            }
          }}
          disabled={!pharmacy.telephone && !pharmacy.tel || pharmacy.telephone === 'Non disponible' || pharmacy.tel === 'Non listé'}
          className={`py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            (pharmacy.telephone || pharmacy.tel) && pharmacy.telephone !== 'Non disponible' && pharmacy.tel !== 'Non listé'
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 hover:scale-105'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Phone size={20} />
          <span>Appeler</span>
        </button>
        
        {/* <button 
          onClick={() => {
            const address = pharmacy.adresse || pharmacy.localisation || '';
            const city = pharmacy.ville || '';
            const searchQuery = encodeURIComponent(`${address} ${city}`);
            window.open(`https://maps.google.com/?q=${searchQuery}`, '_blank');
          }}
          className="py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 bg-secondary-light border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
        >
          <Navigation size={20} />
          <span>Itinéraire</span>
        </button> */}
      </div>
      
      {/* Footer */}
      {pharmacy.garde_24h && (
        <div className="mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex items-center space-x-2">
            <Shield size={16} className="text-green-400" />
            <p className="text-sm text-green-400 font-medium">
              ✅ Pharmacie de garde - Ouverte toute la nuit
            </p>
          </div>
        </div>
      )}
      
      {/* Informations de distance */}
      {distance && distance < 5000 && (
        <div className="mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex items-center space-x-2">
            <Navigation size={16} className="text-blue-400" />
            <p className="text-sm text-blue-400 font-medium">
              📍 À {formatDistance(distance)} de votre position
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}













































































// // src/components/ui/PharmacyCard.jsx ou .tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { 
//   MapPin, 
//   Phone, 
//   Clock, 
//   Building2, 
//   Star,
//   Shield,
//   CheckCircle
// } from 'lucide-react';

// const PharmacyCard = ({ 
//   pharmacy, 
//   distance, 
//   isRecommended = false, 
//   isGarde = false,
//   showItinerary = false // Nouveau prop pour contrôler l'affichage
// }) => {
//   // Formatage de la distance
//   const formatDistance = (meters) => {
//     if (!meters || meters === Infinity) return '';
//     if (meters < 1000) {
//       return `${Math.round(meters)} m`;
//     }
//     return `${(meters / 1000).toFixed(1)} km`;
//   };

//   // Déterminer la couleur en fonction du type
//   const getGradientClass = () => {
//     if (isGarde) {
//       return 'from-green-500 to-green-700';
//     }
//     return 'from-blue-500 to-blue-700';
//   };

//   // Déterminer la couleur de texte
//   const getTextColor = () => {
//     if (isGarde) {
//       return 'text-green-400';
//     }
//     return 'text-blue-400';
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 cursor-pointer group"
//       whileHover={{ y: -2 }}
//     >
//       <div className="p-5">
//         {/* En-tête avec nom et badge */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradientClass()} flex items-center justify-center`}>
//                 <Building2 className="text-white" size={24} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-lg font-bold text-white truncate group-hover:text-green-300 transition">
//                   {pharmacy.nom}
//                 </h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   {isGarde ? (
//                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-600/20 rounded-full">
//                       <Clock size={12} className="text-green-400" />
//                       <span className="text-green-400 text-xs font-medium">De garde</span>
//                     </div>
//                   ) : (
//                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/20 rounded-full">
//                       <Building2 size={12} className="text-blue-400" />
//                       <span className="text-blue-400 text-xs font-medium">Normale</span>
//                     </div>
//                   )}
                  
//                   {distance && (
//                     <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
//                       <span className="text-gray-300 text-xs">
//                         {formatDistance(distance)}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Informations principales */}
//         <div className="space-y-3">
//           {/* Adresse */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
//               <MapPin size={16} className="text-gray-400" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-gray-400 text-sm mb-1">Adresse</p>
//               <p className="text-white text-sm truncate">
//                 {pharmacy.adresse || pharmacy.localisation || 'Non spécifiée'}
//               </p>
//             </div>
//           </div>

//           {/* Téléphone */}
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
//               <Phone size={16} className="text-gray-400" />
//             </div>
//             <div className="flex-1">
//               <p className="text-gray-400 text-sm mb-1">Téléphone</p>
//               {pharmacy.telephone ? (
//                 <a 
//                   href={`tel:${pharmacy.telephone}`}
//                   className="text-green-400 hover:text-green-300 transition text-sm font-medium"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   {pharmacy.telephone}
//                 </a>
//               ) : (
//                 <p className="text-gray-500 text-sm">Non disponible</p>
//               )}
//             </div>
//           </div>

//           {/* Horaires */}
//           {pharmacy.horaires && (
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
//                 <Clock size={16} className="text-gray-400" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-gray-400 text-sm mb-1">Horaires</p>
//                 <p className="text-white text-sm">
//                   {pharmacy.horaires}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Services */}
//           {pharmacy.services && (
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
//                 <CheckCircle size={16} className="text-gray-400" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-gray-400 text-sm mb-1">Services</p>
//                 <p className="text-white text-sm">
//                   {pharmacy.services}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Bouton unique - Appeler uniquement */}
//         <div className="mt-6 pt-4 border-t border-gray-800">
//           <button
//             className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
//               pharmacy.telephone 
//                 ? 'bg-green-600 hover:bg-green-700 text-white' 
//                 : 'bg-gray-800 text-gray-400 cursor-not-allowed'
//             }`}
//             onClick={(e) => {
//               e.stopPropagation();
//               if (pharmacy.telephone) {
//                 window.open(`tel:${pharmacy.telephone}`, '_self');
//               }
//             }}
//             disabled={!pharmacy.telephone}
//           >
//             <Phone size={18} />
//             {pharmacy.telephone ? 'Appeler maintenant' : 'Téléphone indisponible'}
//           </button>
//         </div>

//         {/* Badge de garde en bas */}
//         {isGarde && (
//           <div className="absolute bottom-4 right-4">
//             <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 rounded-full">
//               <Shield size={12} className="text-green-400" />
//               <span className="text-green-400 text-xs font-medium">24h/24</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PharmacyCard;