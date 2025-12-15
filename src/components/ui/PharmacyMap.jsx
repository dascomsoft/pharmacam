// src/components/ui/PharmacyMap.jsx
'use client';

import { useState } from 'react';
import { Navigation, MapPin } from 'lucide-react';

export default function PharmacyMap({ pharmacy }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!pharmacy?.coordinates) {
    return (
      <div className="h-64 w-full bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Localisation non disponible</p>
        </div>
      </div>
    );
  }

  const { lat, lng } = pharmacy.coordinates;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handleOpenMaps = () => {
    setIsLoading(true);
    window.open(mapsUrl, '_blank');
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleGetDirections = () => {
    setIsLoading(true);
    window.open(directionsUrl, '_blank');
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-br from-blue-900/20 to-gray-900/30">
      {/* Carte statique avec lien */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
      
      {/* Point central */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">🏥</span>
          </div>
          <div className="absolute -inset-6 bg-red-500/20 rounded-full animate-ping" />
        </div>
      </div>
      
      {/* Infos */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        <p className="text-white font-medium">{pharmacy.nom}</p>
        <p className="text-gray-300 text-sm">{pharmacy.adresse}</p>
        <div className="mt-3 flex items-center space-x-3">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
            {pharmacy.ville}
          </span>
          <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
            {pharmacy.en_garde ? 'EN GARDE' : 'FERMÉ'}
          </span>
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleOpenMaps}
          disabled={isLoading}
          className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition flex items-center space-x-2 shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>Voir carte</span>
        </button>
        
        <button
          onClick={handleGetDirections}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition flex items-center space-x-2 shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>Itinéraire</span>
        </button>
      </div>
      
      {/* Overlay avec lien */}
      <div 
        onClick={handleOpenMaps}
        className="absolute inset-0 cursor-pointer group"
      >
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="px-4 py-2 bg-white rounded-lg shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
            <span className="text-gray-900 font-medium">Ouvrir Google Maps →</span>
          </div>
        </div>
      </div>
    </div>
  );
}