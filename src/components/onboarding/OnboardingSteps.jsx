

'use client';
import { motion } from 'framer-motion';
import { Mic, MapPin, Clock, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Mic className="text-white" size={40} />,
    title: "Recherche Vocale",
    description: "Parlez simplement, nous comprenons",
    color: "from-primary to-orange-500",
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
    color: "from-purple-500 to-pink-500",
    feature: "Service d'urgence permanent"
  }
];

export default function OnboardingSteps({ onComplete }) {
  return (
    <div className="py-20 bg-gradient-to-br from-secondary via-secondary-light to-black">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-secondary-light/80 to-secondary/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-800/50">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-primary/20">
                <Shield className="text-white" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
                <Sparkles size={20} className="text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Bienvenue sur Pharmacam
              </span>
            </h1>
            <p className="text-gray-400">Votre assistant urgence médicale</p>

            <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Zap size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">Version 1.0 • Cameroun</span>
            </div>
          </div>

          {/* Steps */}
          <div className="p-8 space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-transparent border border-gray-800/30 transition-all duration-300 hover:border-primary/20 hover:bg-gray-900/60"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                  <span className="inline-block px-3 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full border border-gray-700/50">
                    {step.feature}
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/50 border border-gray-700/50">
                  <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-800/50">
            <motion.button
              onClick={onComplete}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 hover:opacity-90 hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)]"
            >
              <span>Commencer maintenant</span>
              <ArrowRight size={20} />
            </motion.button>

            <p className="text-center text-gray-500 text-sm mt-6">
              En continuant, vous acceptez nos{" "}
              <button className="text-primary hover:underline">Conditions d'utilisation</button>
              {" "}et notre{" "}
              <button className="text-primary hover:underline">Politique de confidentialité</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



































































