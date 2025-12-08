'use client';

import { useState, useCallback } from 'react';
import { hybridPharmacySearch } from '@/src/lib/pharmacies';

export function usePharmacySearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const search = useCallback(async (query, location = null) => {
    if (!query?.trim()) {
      setError('Veuillez entrer une recherche');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Starting search for:', query);
      
      const searchResults = await hybridPharmacySearch(query, null, location);
      console.log('Search completed:', searchResults.type);
      
      setResults(searchResults);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Une erreur est survenue lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    // Actions
    search,
    clearResults,
    
    // State
    loading,
    results,
    error,
    
    // Helpers
    hasLocalResults: results?.type === 'local_database',
    hasAIResults: results?.type === 'ai_assisted',
    hasFallback: results?.type === 'fallback'
  };
}
