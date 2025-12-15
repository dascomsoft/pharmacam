'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, X, MapPin, Building, Clock, Phone, 
  SortAsc, Search, Navigation, Star, Crosshair,
  ChevronDown, Sliders, Check
} from 'lucide-react';

export default function GardeFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  onSearchNearby,
  regions = [],
  getCities,
  loading = false,
  stats = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);

  const sortOptions = [
    { id: 'popularity', label: 'Plus populaires', icon: Star },
    { id: 'rating', label: 'Mieux notées', icon: Star },
    { id: 'name', label: 'Nom (A-Z)', icon: SortAsc },
    { id: 'city', label: 'Ville', icon: Building },
    { id: 'distance', label: 'Plus proches', icon: Navigation }
  ];

  // Charger les villes quand la région change
  useEffect(() => {
    const loadCities = async () => {
      if (localFilters.region && localFilters.region !== 'all' && getCities) {
        try {
          const cityList = await getCities(localFilters.region);
          setCities(['all', ...cityList]);
        } catch (error) {
          console.error('Erreur chargement villes:', error);
          setCities(['all']);
        }
      } else {
        setCities(['all']);
      }
    };
    
    loadCities();
  }, [localFilters.region, getCities]);

  // Synchroniser les filtres locaux
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
    
    // Recherche immédiate pour certains filtres
    if (['region', 'ville', 'type', 'garde24h', 'openNow', 'hasPhone', 'sortBy'].includes(key)) {
      onFilterChange(key, value);
    }
  }, [localFilters, onFilterChange]);

  const handleApplyFilters = () => {
    Object.keys(localFilters).forEach(key => {
      if (key !== 'page') {
        onFilterChange(key, localFilters[key]);
      }
    });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      query: '',
      region: 'all',
      ville: 'all',
      type: 'all',
      garde24h: false,
      openNow: false,
      hasPhone: false,
      sortBy: 'popularity',
      page: 1
    };
    
    setLocalFilters(defaultFilters);
    onClearFilters();
    setIsOpen(false);
  };

  const handleGeolocation = async () => {
    setIsGeolocating(true);
    try {
      await onSearchNearby?.();
    } finally {
      setIsGeolocating(false);
    }
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query !== '' ||
      filters.region !== 'all' ||
      filters.ville !== 'all' ||
      filters.type !== 'all' ||
      filters.garde24h ||
      filters.openNow ||
      filters.hasPhone ||
      filters.sortBy !== 'popularity'
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.region !== 'all') count++;
    if (filters.ville !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.garde24h) count++;
    if (filters.openNow) count++;
    if (filters.hasPhone) count++;
    if (filters.sortBy !== 'popularity') count++;
    return count;
  }, [filters]);

  return (
    <div className="relative mb-6">
      {/* Barre de recherche et actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Barre de recherche */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search size={20} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={localFilters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            placeholder="Rechercher une pharmacie, une ville, un quartier..."
            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition placeholder-gray-500"
            disabled={loading}
          />
          {localFilters.query && (
            <button
              onClick={() => handleFilterChange('query', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-white transition"
              disabled={loading}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Boutons d'actions */}
        <div className="flex gap-2">
          {/* Bouton géolocalisation */}
          <button
            onClick={handleGeolocation}
            disabled={loading || isGeolocating}
            className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/20 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeolocating ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Crosshair size={18} />
            )}
            <span className="hidden md:inline">Proches</span>
          </button>

          {/* Bouton filtres */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={loading}
            className={`px-4 py-3 rounded-xl transition flex items-center gap-2 relative ${
              hasActiveFilters
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {hasActiveFilters ? <Sliders size={18} /> : <Filter size={18} />}
            <span className="hidden md:inline">Filtres</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filtres actifs rapides */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3"
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-400 mr-2">Filtres actifs:</span>
            
            {filters.region !== 'all' && (
              <button
                onClick={() => handleFilterChange('region', 'all')}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-1.5 hover:bg-primary/20 transition"
              >
                <MapPin size={12} />
                {filters.region}
                <X size={12} />
              </button>
            )}

            {filters.ville !== 'all' && (
              <button
                onClick={() => handleFilterChange('ville', 'all')}
                className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-blue-500/20 transition"
              >
                <Building size={12} />
                {filters.ville}
                <X size={12} />
              </button>
            )}

            {filters.garde24h && (
              <button
                onClick={() => handleFilterChange('garde24h', false)}
                className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-green-500/20 transition"
              >
                <Clock size={12} />
                24h/24
                <X size={12} />
              </button>
            )}

            {filters.openNow && (
              <button
                onClick={() => handleFilterChange('openNow', false)}
                className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-yellow-500/20 transition"
              >
                Ouvert maintenant
                <X size={12} />
              </button>
            )}

            {filters.hasPhone && (
              <button
                onClick={() => handleFilterChange('hasPhone', false)}
                className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-purple-500/20 transition"
              >
                <Phone size={12} />
                Avec téléphone
                <X size={12} />
              </button>
            )}

            {filters.sortBy !== 'popularity' && (
              <button
                onClick={() => handleFilterChange('sortBy', 'popularity')}
                className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-700 transition"
              >
                Tri: {sortOptions.find(o => o.id === filters.sortBy)?.label}
                <X size={12} />
              </button>
            )}

            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition"
            >
              Tout effacer
            </button>
          </div>
        </motion.div>
      )}

      {/* Statistiques rapides */}
      {stats && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Pharmacies</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{stats.percentageWithPhone}%</div>
            <div className="text-sm text-gray-400">Avec téléphone</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">{stats.openNow}</div>
            <div className="text-sm text-gray-400">Ouvertes</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{Object.keys(stats.byRegion).length}</div>
            <div className="text-sm text-gray-400">Régions</div>
          </div>
        </div>
      )}

      {/* Panneau de filtres complet - CORRECTION ICI : AnimatePresence fermé correctement */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Panneau */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto px-4 py-6">
                {/* En-tête */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Filter size={24} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Filtres avancés</h2>
                      <p className="text-sm text-gray-400">Affinez votre recherche</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Filtres */}
                <div className="space-y-6">
                  {/* Localisation */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <MapPin size={18} />
                      Localisation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Région */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Région
                        </label>
                        <select
                          value={localFilters.region}
                          onChange={(e) => handleFilterChange('region', e.target.value)}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                          disabled={loading}
                        >
                          <option value="all">Toutes les régions</option>
                          {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      {/* Ville */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Ville
                        </label>
                        <select
                          value={localFilters.ville}
                          onChange={(e) => handleFilterChange('ville', e.target.value)}
                          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                          disabled={loading || !localFilters.region || localFilters.region === 'all'}
                        >
                          <option value="all">Toutes les villes</option>
                          {cities.slice(1).map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Filtres à cocher */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Options</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <label className={`flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer ${
                        localFilters.garde24h
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={localFilters.garde24h}
                          onChange={(e) => handleFilterChange('garde24h', e.target.checked)}
                          className="mt-1 w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary/30"
                          disabled={loading}
                        />
                        <div>
                          <div className="text-white font-medium">24h/24</div>
                          <div className="text-sm text-gray-400 mt-1">Ouvertes continuellement</div>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer ${
                        localFilters.openNow
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={localFilters.openNow}
                          onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                          className="mt-1 w-4 h-4 text-yellow-500 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500/30"
                          disabled={loading}
                        />
                        <div>
                          <div className="text-white font-medium">Ouvert maintenant</div>
                          <div className="text-sm text-gray-400 mt-1">Actuellement en service</div>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer ${
                        localFilters.hasPhone
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={localFilters.hasPhone}
                          onChange={(e) => handleFilterChange('hasPhone', e.target.checked)}
                          className="mt-1 w-4 h-4 text-green-500 bg-gray-800 border-gray-700 rounded focus:ring-green-500/30"
                          disabled={loading}
                        />
                        <div>
                          <div className="text-white font-medium">Avec téléphone</div>
                          <div className="text-sm text-gray-400 mt-1">Numéro disponible</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Type de pharmacie */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Type de pharmacie</h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {['all', 'garde', 'urgence', 'nocturne', 'jour'].map(type => (
                        <button
                          key={type}
                          onClick={() => handleFilterChange('type', type)}
                          className={`px-4 py-2 rounded-lg transition ${
                            localFilters.type === type
                              ? 'bg-primary text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {type === 'all' && 'Tous types'}
                          {type === 'garde' && 'De garde'}
                          {type === 'urgence' && 'Urgences'}
                          {type === 'nocturne' && 'Nocturnes'}
                          {type === 'jour' && 'De jour'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-800">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition flex items-center gap-2"
                    disabled={loading || !hasActiveFilters}
                  >
                    <X size={18} />
                    <span>Réinitialiser</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    
                    <button
                      onClick={handleApplyFilters}
                      className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition flex items-center gap-2"
                      disabled={loading}
                    >
                      <Check size={18} />
                      <span>Appliquer ({activeFilterCount})</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Menu de tri - maintenant EN DEHORS du AnimatePresence précédent */}
      <div className="relative mt-3">
        <button
          onClick={() => setShowSortOptions(!showSortOptions)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          disabled={loading}
        >
          <SortAsc size={16} />
          <span>Trier par: {sortOptions.find(o => o.id === filters.sortBy)?.label}</span>
          <ChevronDown size={14} className={`transition ${showSortOptions ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showSortOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 left-0 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        handleFilterChange('sortBy', option.id);
                        setShowSortOptions(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                        filters.sortBy === option.id
                          ? 'bg-primary/20 text-primary'
                          : 'hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>{option.label}</span>
                      </div>
                      {filters.sortBy === option.id && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}