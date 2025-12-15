// src/hooks/useGardes.js
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import gardeService from '@/src/lib/gardeService';

export function useGardes(initialFilters = {}) {
  const searchParams = useSearchParams();
  const [state, setState] = useState({
    gardes: [],
    loading: true,
    error: null,
    filters: {
      query: '',
      region: 'all',
      ville: 'all',
      type: 'all',
      garde24h: false,
      openNow: false,
      hasPhone: false,
      sortBy: 'popularity',
      page: 1,
      limit: 20,
      ...initialFilters
    },
    stats: null,
    metadata: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1
    }
  });

  const searchTimeout = useRef();
  const isInitialMount = useRef(true);
  const prevFiltersRef = useRef();

  // Initialiser les filtres depuis les query params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    
    const filtersFromParams = {
      query: params.query || '',
      region: params.region || 'all',
      ville: params.ville || 'all',
      type: params.type || 'all',
      garde24h: params.garde24h === 'true',
      openNow: params.openNow === 'true',
      hasPhone: params.hasPhone === 'true',
      sortBy: params.sortBy || 'popularity',
      page: parseInt(params.page) || 1,
      limit: parseInt(params.limit) || 20
    };

    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filtersFromParams }
    }));
  }, [searchParams]);

  // Recherche principale avec debounce
  const search = useCallback(async (newFilters = {}) => {
    const mergedFilters = { ...state.filters, ...newFilters };
    
    // Éviter les recherches inutiles
    if (JSON.stringify(mergedFilters) === JSON.stringify(prevFiltersRef.current)) {
      return;
    }
    
    prevFiltersRef.current = mergedFilters;
    
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      filters: mergedFilters
    }));

    try {
      const result = await gardeService.search(mergedFilters);
      
      setState(prev => ({
        ...prev,
        gardes: result.results,
        loading: false,
        stats: result.stats,
        metadata: {
          periode: result.periode,
          lastUpdate: result.lastUpdate,
          dataQuality: result.metadata?.data_quality,
          source: result.metadata?.source
        },
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }));
    } catch (error) {
      console.error('Erreur recherche:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erreur lors de la recherche',
        gardes: []
      }));
    }
  }, [state.filters]);

  // Debounce pour la recherche textuelle
  const debouncedSearch = useCallback((filters) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      search(filters);
    }, 300);
  }, [search]);

  // Mettre à jour un filtre spécifique
  const updateFilter = useCallback((key, value, immediate = false) => {
    const newFilters = { ...state.filters, [key]: value, page: 1 };
    
    if (immediate || ['region', 'ville', 'type', 'garde24h', 'openNow', 'hasPhone', 'sortBy'].includes(key)) {
      search(newFilters);
    } else if (key === 'query') {
      setState(prev => ({ ...prev, filters: newFilters }));
      debouncedSearch(newFilters);
    } else {
      setState(prev => ({ ...prev, filters: newFilters }));
    }
  }, [state.filters, search, debouncedSearch]);

  // Changement de page
  const changePage = useCallback((page) => {
    updateFilter('page', page, true);
  }, [updateFilter]);

  // Réinitialiser les filtres
  const clearFilters = useCallback(() => {
    const defaultFilters = {
      query: '',
      region: 'all',
      ville: 'all',
      type: 'all',
      garde24h: false,
      openNow: false,
      hasPhone: false,
      sortBy: 'popularity',
      page: 1,
      limit: 20
    };
    
    search(defaultFilters);
  }, [search]);

  // Recherche par géolocalisation
  const searchNearby = useCallback(async (maxDistance = 50, limit = 10) => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Géolocalisation non supportée'
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const result = await gardeService.getNearest(latitude, longitude, limit, maxDistance);
      
      setState(prev => ({
        ...prev,
        gardes: result.results,
        loading: false,
        filters: {
          ...prev.filters,
          sortBy: 'distance'
        },
        metadata: {
          ...prev.metadata,
          userLocation: result.userLocation,
          searchType: 'nearby'
        }
      }));
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Impossible de détecter votre position'
      }));
    }
  }, []);

  // Charger une pharmacie spécifique
  const getPharmacyDetails = useCallback(async (id) => {
    try {
      return await gardeService.getPharmacyDetails(id);
    } catch (error) {
      console.error('Erreur chargement détail:', error);
      return null;
    }
  }, []);

  // Obtenir les villes disponibles
  const getCities = useCallback(async (region = null) => {
    try {
      return await gardeService.getCities(region);
    } catch (error) {
      console.error('Erreur chargement villes:', error);
      return [];
    }
  }, []);

  // Formatage du téléphone
  const formatPhone = useCallback((phone) => {
    return gardeService.formatPhoneNumber(phone);
  }, []);

  // Numéro d'appel
  const getCallablePhone = useCallback((phone) => {
    return gardeService.getCallablePhone(phone);
  }, []);

  // Contacts d'urgence
  const getEmergencyContacts = useCallback(() => {
    return gardeService.getEmergencyContacts();
  }, []);

  // Mémoized statistics
  const memoizedStats = useMemo(() => ({
    total: state.pagination.total,
    withPhone: state.stats?.withPhone || 0,
    openNow: state.stats?.openNow || 0,
    percentageWithPhone: state.stats?.percentageWithPhone || 0,
    topCities: state.stats?.topCities || [],
    emergencyNumbers: state.stats?.emergencyNumbers || {},
    byRegion: state.stats?.byRegion || {}
  }), [state.pagination.total, state.stats]);

  // Mémoized metadata
  const memoizedMetadata = useMemo(() => ({
    periode: state.metadata?.periode || 'Chargement...',
    lastUpdate: state.metadata?.lastUpdate ? new Date(state.metadata.lastUpdate).toLocaleString('fr-FR') : '',
    dataQuality: state.metadata?.dataQuality || 0,
    source: state.metadata?.source || 'local',
    userLocation: state.metadata?.userLocation,
    searchType: state.metadata?.searchType || 'standard'
  }), [state.metadata]);

  // Mémoized filtered cities
  const memoizedCities = useCallback(async () => {
    if (state.filters.region && state.filters.region !== 'all') {
      return await getCities(state.filters.region);
    }
    return await getCities();
  }, [state.filters.region, getCities]);

  // Effet de recherche initiale
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      search();
    }
  }, [search]);

  // Nettoyage du timeout
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return {
    // Données
    gardes: state.gardes,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    stats: memoizedStats,
    metadata: memoizedMetadata,
    pagination: state.pagination,
    
    // Actions
    search,
    updateFilter,
    clearFilters,
    changePage,
    searchNearby,
    getPharmacyDetails,
    
    // Utilitaires
    getRegions: () => gardeService.getRegions(),
    getCities: memoizedCities,
    getPharmacyTypes: () => gardeService.getPharmacyTypes(),
    formatPhone,
    getCallablePhone,
    getEmergencyContacts,
    
    // États dérivés
    hasResults: state.gardes.length > 0,
    isEmpty: !state.loading && state.gardes.length === 0,
    canLoadMore: state.pagination.page < state.pagination.totalPages,
    currentPage: state.pagination.page,
    totalPages: state.pagination.totalPages,
    
    // URLs Google Maps
    getGoogleMapsUrl: (pharmacy) => gardeService.getGoogleMapsUrl(pharmacy),
    getGoogleDirectionsUrl: (pharmacy) => gardeService.getGoogleDirectionsUrl(pharmacy)
  };
}