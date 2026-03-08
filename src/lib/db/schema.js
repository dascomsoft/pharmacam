// src/lib/db/schema.js
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const pharmacies = sqliteTable('pharmacies', {
  id: text('id').primaryKey(),
  nom: text('nom').notNull(),
  adresse: text('adresse'),
  quartier: text('quartier'),
  ville: text('ville').notNull(),
  region: text('region').notNull(),
  tel: text('tel'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  en_garde: integer('en_garde', { mode: 'boolean' }).default(true),
  horaires: text('horaires'),
  services: text('services'), // JSON string
  note: real('note'),
  source: text('source'),
  source_url: text('source_url'),
  scraped_at: text('scraped_at'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const gardes = sqliteTable('gardes', {
  id: text('id').primaryKey(),
  pharmacie_id: text('pharmacie_id').references(() => pharmacies.id),
  date_debut: text('date_debut').notNull(),
  date_fin: text('date_fin').notNull(),
  periode_texte: text('periode_texte'),
  scraped_at: text('scraped_at').default(sql`CURRENT_TIMESTAMP`),
  source: text('source')
});

export const stats_pharmacies = sqliteTable('stats_pharmacies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pharmacie_id: text('pharmacie_id').references(() => pharmacies.id),
  total_gardes: integer('total_gardes').default(0),
  fiabilite_tel: real('fiabilite_tel').default(0), // % de fois où le tel est présent
  derniere_garde: text('derniere_garde'),
  popularite: integer('popularite').default(0) // nombre de recherches/clics
});

export const scraping_logs = sqliteTable('scraping_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').default(sql`CURRENT_TIMESTAMP`),
  source: text('source').notNull(),
  pharmacies_trouvees: integer('pharmacies_trouvees'),
  pharmacies_nouvelles: integer('pharmacies_nouvelles'),
  pharmacies_mises_a_jour: integer('pharmacies_mises_a_jour'),
  status: text('status'),
  erreur: text('erreur'),
  duree_secondes: integer('duree_secondes')
});