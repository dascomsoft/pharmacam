// 'use client';
// import { MapPin, Phone, Navigation, Clock, Star, Shield, Zap } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function PharmacyCard({ pharmacy, distance, isRecommended }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`bg-gradient-to-br from-secondary-light to-secondary border border-gray-800 rounded-2xl p-6 card-hover ${
//         isRecommended ? 'glow-border' : ''
//       }`}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <div className="flex items-center space-x-2 mb-2">
//             <h3 className="text-xl font-bold text-white">{pharmacy.nom}</h3>
//             {isRecommended && (
//               <span className="px-3 py-1 bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold rounded-full flex items-center">
//                 <Zap size={12} className="mr-1" /> RECOMMANDÉ
//               </span>
//             )}
//           </div>
          
//           {/* Note */}
//           <div className="flex items-center space-x-2 mb-3">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={14}
//                   className={`${
//                     i < Math.floor(pharmacy.note)
//                       ? 'text-yellow-500 fill-yellow-500'
//                       : 'text-gray-600'
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-sm text-gray-400">{pharmacy.note}/5</span>
//           </div>
//         </div>
        
//         {/* Badges */}
//         <div className="flex flex-col items-end space-y-2">
//           {pharmacy.garde_24h && (
//             <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
//               <span className="text-xs text-green-400 font-medium flex items-center">
//                 <Clock size={12} className="mr-1" /> 24h/24
//               </span>
//             </div>
//           )}
          
//           {distance && (
//             <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
//               <span className="text-xs text-blue-400 font-medium">
//                 {distance < 1000 ? `${distance}m` : `${(distance/1000).toFixed(1)}km`}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Informations */}
//       <div className="space-y-3 mb-6">
//         <div className="flex items-start space-x-3">
//           <MapPin size={18} className="text-primary mt-0.5" />
//           <div>
//             <p className="text-gray-300 font-medium">{pharmacy.adresse}</p>
//             <p className="text-gray-500 text-sm">
//               {pharmacy.quartier} • {pharmacy.ville}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-3">
//           <Phone size={18} className="text-accent-green" />
//           <p className="text-gray-300 font-medium">{pharmacy.tel || 'Non disponible'}</p>
//         </div>
        
//         {/* Services */}
//         {pharmacy.services && pharmacy.services.length > 0 && (
//           <div className="flex flex-wrap gap-2 pt-3">
//             {pharmacy.services.slice(0, 3).map((service, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full border border-gray-700"
//               >
//                 {service}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Action Buttons */}
//       <div className="grid grid-cols-2 gap-3">
//         <button 
//           onClick={() => pharmacy.tel && pharmacy.tel !== 'Non listé' && window.open(`tel:${pharmacy.tel}`)}
//           disabled={!pharmacy.tel || pharmacy.tel === 'Non listé'}
//           className={`py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
//             pharmacy.tel && pharmacy.tel !== 'Non listé'
//               ? 'btn-primary'
//               : 'bg-gray-800 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           <Phone size={20} />
//           <span>Appeler</span>
//         </button>
        
//         <button 
//           onClick={() => window.open(`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`)}
//           className="py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 btn-secondary"
//         >
//           <Navigation size={20} />
//           <span>Itinéraire</span>
//         </button>
//       </div>
      
//       {/* Footer */}
//       {pharmacy.garde_24h && (
//         <div className="mt-4 pt-4 border-t border-gray-800/50">
//           <div className="flex items-center space-x-2">
//             <Shield size={16} className="text-green-400" />
//             <p className="text-sm text-green-400 font-medium">
//               ✅ Pharmacie de garde - Ouverte toute la nuit
//             </p>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }








































// 'use client';
// import { MapPin, Phone, Navigation, Clock, Star, Shield, Zap } from 'lucide-react';
// import { motion } from 'framer-motion';

// export default function PharmacyCard({ pharmacy, distance, isRecommended }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`bg-gradient-to-br from-secondary-light to-secondary border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] hover:border-primary/30 hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.2)] ${
//         isRecommended ? 'border-2 border-primary/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''
//       }`}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <div className="flex items-center space-x-2 mb-2">
//             <h3 className="text-xl font-bold text-white">{pharmacy.nom}</h3>
//             {isRecommended && (
//               <span className="px-3 py-1 bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold rounded-full flex items-center">
//                 <Zap size={12} className="mr-1" /> RECOMMANDÉ
//               </span>
//             )}
//           </div>
          
//           {/* Note */}
//           <div className="flex items-center space-x-2 mb-3">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   size={14}
//                   className={`${
//                     i < Math.floor(pharmacy.note)
//                       ? 'text-yellow-500 fill-yellow-500'
//                       : 'text-gray-600'
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-sm text-gray-400">{pharmacy.note}/5</span>
//           </div>
//         </div>
        
//         {/* Badges */}
//         <div className="flex flex-col items-end space-y-2">
//           {pharmacy.garde_24h && (
//             <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
//               <span className="text-xs text-green-400 font-medium flex items-center">
//                 <Clock size={12} className="mr-1" /> 24h/24
//               </span>
//             </div>
//           )}
          
//           {distance && (
//             <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
//               <span className="text-xs text-blue-400 font-medium">
//                 {distance < 1000 ? `${distance}m` : `${(distance/1000).toFixed(1)}km`}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Informations */}
//       <div className="space-y-3 mb-6">
//         <div className="flex items-start space-x-3">
//           <MapPin size={18} className="text-primary mt-0.5" />
//           <div>
//             <p className="text-gray-300 font-medium">{pharmacy.adresse}</p>
//             <p className="text-gray-500 text-sm">
//               {pharmacy.quartier} • {pharmacy.ville}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-3">
//           <Phone size={18} className="text-accent-green" />
//           <p className="text-gray-300 font-medium">{pharmacy.tel || 'Non disponible'}</p>
//         </div>
        
//         {/* Services */}
//         {pharmacy.services && pharmacy.services.length > 0 && (
//           <div className="flex flex-wrap gap-2 pt-3">
//             {pharmacy.services.slice(0, 3).map((service, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full border border-gray-700"
//               >
//                 {service}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Action Buttons */}
//       <div className="grid grid-cols-2 gap-3">
//         <button 
//           onClick={() => pharmacy.tel && pharmacy.tel !== 'Non listé' && window.open(`tel:${pharmacy.tel}`)}
//           disabled={!pharmacy.tel || pharmacy.tel === 'Non listé'}
//           className={`py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
//             pharmacy.tel && pharmacy.tel !== 'Non listé'
//               ? 'bg-gradient-to-r from-primary to-primary-dark text-white hover:opacity-90 hover:scale-105'
//               : 'bg-gray-800 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           <Phone size={20} />
//           <span>Appeler</span>
//         </button>
        
//         <button 
//           onClick={() => window.open(`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`)}
//           className="py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 bg-secondary-light border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
//         >
//           <Navigation size={20} />
//           <span>Itinéraire</span>
//         </button>
//       </div>
      
//       {/* Footer */}
//       {pharmacy.garde_24h && (
//         <div className="mt-4 pt-4 border-t border-gray-800/50">
//           <div className="flex items-center space-x-2">
//             <Shield size={16} className="text-green-400" />
//             <p className="text-sm text-green-400 font-medium">
//               ✅ Pharmacie de garde - Ouverte toute la nuit
//             </p>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }
























































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
        
        <button 
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
        </button>
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