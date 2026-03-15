// src/lib/db/schema.js
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';


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
  pharmacie_id: text('pharmacie_id').references(() => pharmacies.id, { onDelete: 'cascade' }),
  date_debut: text('date_debut').notNull(),
  date_fin: text('date_fin').notNull(),
  periode_texte: text('periode_texte'),
  scraped_at: text('scraped_at').default(sql`CURRENT_TIMESTAMP`),
  source: text('source')
});

export const stats_pharmacies = sqliteTable('stats_pharmacies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pharmacie_id: text('pharmacie_id').references(() => pharmacies.id, { onDelete: 'cascade' }),
  total_gardes: integer('total_gardes').default(0),
  fiabilite_tel: real('fiabilite_tel').default(0),
  derniere_garde: text('derniere_garde'),
  popularite: integer('popularite').default(0)
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

// Table des services (catalogue)
export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nom: text('nom').unique().notNull()
});

// Table de liaison pharmacies-services
export const pharmacie_services = sqliteTable('pharmacie_services', {
  pharmacie_id: text('pharmacie_id').notNull().references(() => pharmacies.id, { onDelete: 'cascade' }),
  service_id: integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.pharmacie_id, table.service_id] })
}));