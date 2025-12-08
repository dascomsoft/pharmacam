'use client';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MicrophoneButton({ isListening, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-28 h-28 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
        isListening 
          ? 'bg-lineart-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30 animate-pulse' 
          : 'bg-linear-to-br from-primary to-primary-dark shadow-xl hover:shadow-2xl hover:scale-105'
      }`}
      whileTap={{ scale: 0.95 }}
      animate={isListening ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
    >
      {/* Icon */}
      <div className="relative z-10">
        {isListening ? (
          <MicOff size={36} className="animate-pulse" />
        ) : (
          <Mic size={36} />
        )}
      </div>
      
      {/* Effets visuels */}
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/10"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
      
      {/* Anneau extérieur */}
      <div className={`absolute -inset-4 rounded-full border-2 ${
        isListening 
          ? 'border-red-500/30 animate-ping' 
          : 'border-primary/20'
      }`} />
    </motion.button>
  );
}