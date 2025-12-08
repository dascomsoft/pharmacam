






// src/hooks/useVoice.js
'use client';

import { useState, useCallback, useEffect } from 'react';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [browserSupport, setBrowserSupport] = useState(true);

  useEffect(() => {
    // Vérifier la compatibilité du navigateur
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupport(false);
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur. Utilisez Chrome ou Edge.');
    }
  }, []);

  const startListening = useCallback(() => {
    if (!browserSupport) {
      setError('Navigateur non compatible avec la reconnaissance vocale');
      return false;
    }

    setError(null);
    setIsListening(true);
    setTranscript('');

    // Utiliser l'API Web Speech
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      
      const errors = {
        'no-speech': 'Aucune parole détectée. Parlez plus fort.',
        'audio-capture': 'Microphone non accessible. Vérifiez les permissions.',
        'not-allowed': 'Permission microphone refusée. Autorisez dans les paramètres.',
        'network': 'Erreur réseau. Réessayez.',
        'aborted': 'Reconnaissance annulée.',
        'language-not-supported': 'Français non supporté.'
      };
      
      setError(errors[event.error] || `Erreur: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      return true;
    } catch (err) {
      setError('Impossible de démarrer la reconnaissance vocale');
      setIsListening(false);
      return false;
    }
  }, [browserSupport]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    browserSupport,
    startListening,
    stopListening,
    clearTranscript
  };
}




