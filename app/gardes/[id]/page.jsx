'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Clock, Shield, Building2,
  Navigation, ChevronLeft, Heart, Share2, Copy,
  Star, AlertCircle, CheckCircle, Users,
  Mail, Globe, ExternalLink, Zap
} from 'lucide-react';

export default function PharmacyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPharmacyData = async () => {
      try {
        // D'abord, essayons de charger toutes les pharmacies de garde
        const response = await fetch('/data/gardes_du_jour.json');
        if (!response.ok) throw new Error('Fichier non trouvé');
        const data = await response.json();
        
        // Trouver la pharmacie par ID dans toutes les régions
        let foundPharmacy = null;
        for (const region in data.regions) {
          const pharmacyInRegion = data.regions[region].find(
            ph => ph.id === params.id || 
            `garde_${region}_${ph.nom.replace(/\s+/g, '_')}` === params.id
          );
          if (pharmacyInRegion) {
            foundPharmacy = {
              ...pharmacyInRegion,
              region,
              isGarde: true
            };
            break;
          }
        }
        
        if (foundPharmacy) {
          setPharmacy(foundPharmacy);
        } else {
          // Si non trouvée, c'est peut-être une pharmacie normale
          // ou chercher dans les pharmacies normales
          const normalResponse = await fetch('/src/data/pharmacies.json');
          if (normalResponse.ok) {
            const normalData = await normalResponse.json();
            const normalPharmacy = normalData.find(
              ph => ph.id === params.id || 
              `normal_${ph.nom.replace(/\s+/g, '_')}` === params.id
            );
            if (normalPharmacy) {
              setPharmacy({
                ...normalPharmacy,
                isGarde: false,
                region: normalPharmacy.region || 'Non spécifiée'
              });
            } else {
              setError('Pharmacie non trouvée');
            }
          } else {
            setError('Pharmacie non trouvée');
          }
        }
      } catch (err) {
        console.error('Erreur chargement:', err);
        setError('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadPharmacyData();
  }, [params.id]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCall = () => {
    if (pharmacy?.telephone) {
      window.open(`tel:${pharmacy.telephone}`, '_self');
    }
  };

  const handleDirections = () => {
    const address = pharmacy?.adresse || pharmacy?.localisation || '';
    if (address) {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (pharmacy?.telephone) {
      const message = `Bonjour, je vous contacte au sujet de la pharmacie ${pharmacy.nom}`;
      window.open(`https://wa.me/${pharmacy.telephone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Pharmacie ${pharmacy?.nom}`,
      text: `Découvrez ${pharmacy?.nom} - ${pharmacy?.isGarde ? 'Pharmacie de garde' : 'Pharmacie normale'}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Partage annulé:', err);
      }
    } else {
      handleCopy(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-300 text-lg">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Pharmacie non trouvée</h2>
          <p className="text-gray-400 mb-6">{error || "Cette pharmacie n'existe pas ou a été supprimée."}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header avec image d'arrière-plan */}
      <div className="relative">
        <div className={`h-48 ${pharmacy.isGarde ? 'bg-gradient-to-r from-green-600/30 via-green-800/20 to-green-600/30' : 'bg-gradient-to-r from-blue-600/30 via-blue-800/20 to-blue-600/30'}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Building2 size={120} className={pharmacy.isGarde ? 'text-green-400' : 'text-blue-400'} />
          </div>
        </div>
        
        {/* Boutons de navigation */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition flex items-center gap-2"
          >
            <ChevronLeft size={24} />
            <span className="hidden sm:inline">Retour</span>
          </button>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition"
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition"
            title="Partager"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Carte de la pharmacie */}
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-2xl">
            {/* Titre et informations principales */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <div className={`w-24 h-24 ${pharmacy.isGarde ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Building2 className="text-white" size={48} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-white">{pharmacy.nom}</h1>
                  {pharmacy.isGarde && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 rounded-full">
                      <Clock size={18} className="text-white" />
                      <span className="text-white font-bold">DE GARDE</span>
                      <Zap size={18} className="text-yellow-400 animate-pulse" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={18} className="text-green-500" />
                    <span>{pharmacy.region || pharmacy.ville || 'Région non spécifiée'}</span>
                  </div>
                  
                  {pharmacy.telephone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={18} className="text-green-500" />
                      <span>{pharmacy.telephone}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {pharmacy.isGarde && (
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                      Service 24h/24
                    </span>
                  )}
                  {pharmacy.type && (
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                      {pharmacy.type}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    {pharmacy.ville || 'Ville non spécifiée'}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid d'informations détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Colonne gauche - Informations de contact */}
              <div className="space-y-6">
                {/* Adresse complète */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="text-green-500" size={20} />
                    Adresse complète
                  </h3>
                  <p className="text-gray-300 text-lg mb-4">
                    {pharmacy.adresse || pharmacy.localisation || 'Adresse non spécifiée'}
                  </p>
                  <button
                    onClick={() => handleCopy(pharmacy.adresse || pharmacy.localisation || '')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition"
                  >
                    <Copy size={16} />
                    {copied ? 'Copié !' : 'Copier l\'adresse'}
                  </button>
                </div>

                {/* Coordonnées */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Coordonnées</h3>
                  <div className="space-y-4">
                    {pharmacy.telephone && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Phone className="text-green-500" size={20} />
                          <div>
                            <p className="text-gray-400 text-sm">Téléphone</p>
                            <p className="text-white text-lg font-medium">{pharmacy.telephone}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(pharmacy.telephone)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition"
                        >
                          <Copy size={16} className="text-gray-400" />
                        </button>
                      </div>
                    )}
                    
                    {pharmacy.email && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Mail className="text-green-500" size={20} />
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-white">{pharmacy.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopy(pharmacy.email)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition"
                        >
                          <Copy size={16} className="text-gray-400" />
                        </button>
                      </div>
                    )}
                    
                    {pharmacy.website && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Globe className="text-green-500" size={20} />
                          <div>
                            <p className="text-gray-400 text-sm">Site web</p>
                            <a 
                              href={pharmacy.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300 transition"
                            >
                              {pharmacy.website}
                            </a>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(pharmacy.website, '_blank')}
                          className="p-2 hover:bg-gray-700 rounded-lg transition"
                        >
                          <ExternalLink size={16} className="text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonne droite - Services et horaires */}
              <div className="space-y-6">
                {/* Horaires */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className={pharmacy.isGarde ? 'text-green-500' : 'text-blue-500'} size={20} />
                    Horaires d'ouverture
                  </h3>
                  <div className="space-y-3">
                    {pharmacy.isGarde ? (
                      <div className="flex items-center justify-between p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="text-green-400" size={20} />
                          <div>
                            <p className="text-green-400 font-bold">Service de garde</p>
                            <p className="text-green-300 text-sm">Urgences 24h/24</p>
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-300 text-lg">
                          {pharmacy.horaires || 'Horaires standards'}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">Consultez la pharmacie pour les horaires exacts</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services spéciaux */}
                {(pharmacy.services || pharmacy.isGarde) && (
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Services proposés</h3>
                    <div className="space-y-3">
                      {pharmacy.isGarde && (
                        <div className="flex items-center gap-3">
                          <Shield className="text-green-500" size={20} />
                          <span className="text-gray-300">Service d'urgence 24h/24</span>
                        </div>
                      )}
                      
                      {pharmacy.services && (
                        <div className="text-gray-300">
                          {pharmacy.services}
                        </div>
                      )}
                      
                      {!pharmacy.services && pharmacy.isGarde && (
                        <div className="text-gray-400 text-sm">
                          <p>• Consultation d'urgence</p>
                          <p>• Médicaments d'urgence</p>
                          <p>• Soins de première nécessité</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes supplémentaires */}
                {pharmacy.notes && (
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Informations supplémentaires</h3>
                    <p className="text-gray-300">{pharmacy.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleCall}
                disabled={!pharmacy.telephone}
                className={`flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition ${
                  pharmacy.telephone
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Phone size={24} />
                <div className="text-left">
                  <div>Appeler</div>
                  {pharmacy.telephone && (
                    <div className="text-sm font-normal opacity-90">{pharmacy.telephone}</div>
                  )}
                </div>
              </button>
              
              <button
                onClick={handleDirections}
                disabled={!pharmacy.adresse && !pharmacy.localisation}
                className={`flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition ${
                  (pharmacy.adresse || pharmacy.localisation)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Navigation size={24} />
                <div className="text-left">
                  <div>Itinéraire</div>
                  <div className="text-sm font-normal opacity-90">Google Maps</div>
                </div>
              </button>
              
              {pharmacy.telephone && (
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-semibold transition"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                  </svg>
                  <div className="text-left">
                    <div>WhatsApp</div>
                    <div className="text-sm font-normal opacity-90">Envoyer message</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section informations importantes */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="text-yellow-500" size={24} />
              Informations importantes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 mt-0.5" />
                  <p className="text-gray-300">Présentez votre ordonnance pour tout achat de médicaments</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-500 mt-0.5" />
                  <p className="text-gray-300">Vérifiez les horaires avant de vous déplacer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-500 mt-0.5" />
                  <p className="text-gray-300">En cas d'urgence médicale, composez le 118</p>
                </div>
                {pharmacy.isGarde && (
                  <div className="flex items-start gap-2">
                    <Zap size={18} className="text-yellow-500 mt-0.5" />
                    <p className="text-green-300 font-medium">Service de garde prioritaire pour les urgences</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}