// src/lib/regions.js
export const REGIONS_CONFIG = {
  "Centre": {
    slug: "centre",
    cities: ["Yaoundé", "Mbalmayo", "Obala", "Nanga-Eboko"],
    center: { lat: 3.8480, lng: 11.5021 },
    zoom: 11
  },
  "Littoral": {
    slug: "littoral",
    cities: ["Douala", "Nkongsamba", "Edéa", "Loum"],
    center: { lat: 4.0511, lng: 9.7679 },
    zoom: 11
  },
  "Ouest": {
    slug: "ouest",
    cities: ["Bafoussam", "Mbouda", "Dschang", "Foumban"],
    center: { lat: 5.4778, lng: 10.4176 },
    zoom: 10
  },
  "Adamaoua": {
    slug: "adamaoua",
    cities: ["Ngaoundéré", "Meiganga", "Tibati", "Banyo"],
    center: { lat: 7.3169, lng: 13.5833 },
    zoom: 8
  },
  "Nord": {
    slug: "nord",
    cities: ["Garoua", "Poli", "Rey Bouba", "Figuil"],
    center: { lat: 9.3077, lng: 13.3988 },
    zoom: 9
  },
  "Extrême-Nord": {
    slug: "extreme-nord",
    cities: ["Maroua", "Kousséri", "Mokolo", "Yagoua"],
    center: { lat: 10.5953, lng: 14.3247 },
    zoom: 9
  },
  "Sud": {
    slug: "sud",
    cities: ["Ebolowa", "Sangmélima", "Kribi", "Ambam"],
    center: { lat: 2.9000, lng: 11.1500 },
    zoom: 9
  },
  "Est": {
    slug: "est",
    cities: ["Bertoua", "Batouri", "Abong-Mbang", "Yokadouma"],
    center: { lat: 4.5792, lng: 13.6769 },
    zoom: 8
  },
  "Nord-Ouest": {
    slug: "nord-ouest",
    cities: ["Bamenda", "Wum", "Ndop", "Kumbo"],
    center: { lat: 5.9630, lng: 10.1591 },
    zoom: 10
  },
  "Sud-Ouest": {
    slug: "sud-ouest",
    cities: ["Buea", "Limbe", "Kumba", "Mamfe"],
    center: { lat: 4.1550, lng: 9.2430 },
    zoom: 10
  }
};

export const EMERGENCY_NUMBERS = {
  police: "117",
  gendarmerie: "117",
  pompiers: "118",
  samu: "119",
  pharmacie_urgence: "1510",
  croix_rouge: "111",
  sos_medecins: "1520"
};

export const APP_CONFIG = {
  name: "Pharmacam",
  version: "1.0.0",
  description: "Trouvez les pharmacies de garde au Cameroun"
};

export const DEFAULT_MAP_CENTER = {
  lat: 5.9630,
  lng: 12.3547,
  zoom: 6
};