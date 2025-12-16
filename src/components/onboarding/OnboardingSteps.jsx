'use client';
import { motion } from 'framer-motion';
import { Mic, MapPin, Clock, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

const steps = [
  {
    icon: <Mic className="text-white" size={40} />,
    title: "Recherche Vocale",
    description: "Parlez simplement, nous comprenons",
    color: "from-green-500 to-emerald-500",
    feature: "Reconnaissance vocale française"
  },
  {
    icon: <MapPin className="text-white" size={40} />,
    title: "Localisation Instantanée",
    description: "Trouvez la pharmacie la plus proche",
    color: "from-blue-500 to-cyan-500",
    feature: "Géolocalisation précise"
  },
  {
    icon: <Clock className="text-white" size={40} />,
    title: "24h/24, 7j/7",
    description: "Même à 3h du matin",
    color: "from-green-600 to-green-400",
    feature: "Service d'urgence permanent"
  }
];

export default function OnboardingSteps({ onComplete }) {

    //scroller vers le haut
  useEffect(() =>{
    window.scrollTo(0,0)
  },[])
  
  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header avec Logo séparé */}
        <div className="p-8 text-center border-b border-gray-800/50">
          {/* Logo Container */}
          <div className="mb-8">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                <Image 
                  src="/allo237logo.jpg" 
                  alt="Allo237 Logo" 
                  width={112}
                  height={112}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Titre avec espace */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-green-500 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                Bienvenue sur
              </span>
            </h1>
            <h2 className="text-4xl font-bold text-white mb-4">
              Allo<span className="text-green-400">237</span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
            Votre assistant urgence pour la recherche des pharmacies de garde sur l'étendue du territoire national
          </p>

          {/* Badge Version */}
          <div className="mt-8 inline-flex items-center space-x-2 px-6 py-2 bg-green-500/10 rounded-full border border-green-500/20 backdrop-blur-sm">
            <Zap size={16} className="text-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Version 1.0 • Cameroun</span>
          </div>
        </div>

        {/* Steps Section */}
        <div className="p-8 space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-6 rounded-2xl bg-gradient-to-r from-gray-900/50 to-transparent border border-gray-800/30 transition-all duration-300 hover:border-green-500/20 hover:bg-gray-900/60 hover:shadow-lg hover:shadow-green-500/5"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                <span className="inline-block px-3 py-1.5 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700/50">
                  {step.feature}
                </span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/50 border border-gray-700/50">
                <span className="text-sm font-bold text-gray-400">{index + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer avec bouton */}
        <div className="p-8 border-t border-gray-800/50">
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:opacity-90 hover:shadow-[0_10px_25px_-5px_rgba(34,197,94,0.4)]"
          >
            <span>Commencer maintenant</span>
            <ArrowRight size={20} className="animate-pulse" />
          </motion.button>

          <p className="text-center text-gray-400 text-xs mt-6">
            En continuant, vous acceptez nos{" "}
            <button className="text-green-400 hover:text-green-300 hover:underline transition-colors">
              Conditions d'utilisation
            </button>
            {" "}et notre{" "}
            <button className="text-green-400 hover:text-green-300 hover:underline transition-colors">
              Politique de confidentialité
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}