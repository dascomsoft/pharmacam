// src/lib/db/index.js
export { db, query } from './client.js';
export { 
  pharmacies, 
  gardes, 
  scraping_logs, 
  stats_pharmacies, 
  services, 
  pharmacie_services 
} from './schema.js';