// // app/api/pharmacies/route.js
// import { NextResponse } from 'next/server';
// import { db } from '@/src/lib/db/client';
// import { pharmacies, gardes } from '@/src/lib/db/schema';
// import { sql, eq, and, gte, lte, like, or } from 'drizzle-orm';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
  
//   // Paramètres de recherche
//   const query = searchParams.get('query');
//   const region = searchParams.get('region');
//   const ville = searchParams.get('ville');
//   const enGarde = searchParams.get('en_garde') === 'true';
//   const avecTel = searchParams.get('avec_tel') === 'true';
//   const page = parseInt(searchParams.get('page') || '1');
//   const limit = parseInt(searchParams.get('limit') || '20');
//   const sortBy = searchParams.get('sort_by') || 'nom';
//   const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
//   try {
//     // Construction de la requête
//     let conditions = [];
    
//     if (query) {
//       conditions.push(
//         or(
//           like(pharmacies.nom, `%${query}%`),
//           like(pharmacies.adresse, `%${query}%`),
//           like(pharmacies.quartier, `%${query}%`),
//           like(pharmacies.ville, `%${query}%`)
//         )
//       );
//     }
    
//     if (region && region !== 'all') {
//       conditions.push(eq(pharmacies.region, region));
//     }
    
//     if (ville && ville !== 'all') {
//       conditions.push(eq(pharmacies.ville, ville));
//     }
    
//     if (avecTel) {
//       conditions.push(sql`${pharmacies.tel} IS NOT NULL AND ${pharmacies.tel} != 'Non listé'`);
//     }
    
//     if (enGarde) {
//       // Jointure avec les gardes pour la date spécifiée
//       const subquery = db.select({ pharmacie_id: gardes.pharmacie_id })
//         .from(gardes)
//         .where(
//           and(
//             lte(gardes.date_debut, date),
//             gte(gardes.date_fin, date)
//           )
//         );
      
//       conditions.push(sql`${pharmacies.id} IN (${subquery})`);
//     }
    
//     // Exécution de la requête
//     const results = await db.select()
//       .from(pharmacies)
//       .where(conditions.length > 0 ? and(...conditions) : undefined)
//       .limit(limit)
//       .offset((page - 1) * limit)
//       .orderBy(
//         sortBy === 'nom' ? pharmacies.nom :
//         sortBy === 'note' ? sql`${pharmacies.note} DESC` :
//         pharmacies.nom
//       );
    
//     // Compter le total
//     const countResult = await db.select({ count: sql`count(*)` })
//       .from(pharmacies)
//       .where(conditions.length > 0 ? and(...conditions) : undefined);
    
//     const total = Number(countResult[0].count);
    
//     return NextResponse.json({
//       success: true,
//       data: results,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       },
//       timestamp: new Date().toISOString()
//     });
    
//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // POST pour les stats (quand un utilisateur clique)
// export async function POST(request) {
//   const { pharmacie_id, action } = await request.json();
  
//   if (action === 'click') {
//     // Incrémenter la popularité
//     await db.execute(sql`
//       UPDATE stats_pharmacies 
//       SET popularite = popularite + 1 
//       WHERE pharmacie_id = ${pharmacie_id}
//     `);
//   }
  
//   return NextResponse.json({ success: true });
// }




































import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('query');
  const region = searchParams.get('region');
  const ville = searchParams.get('ville');
  const enGarde = searchParams.get('en_garde') === 'true';
  const avecTel = searchParams.get('avec_tel') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sortBy = searchParams.get('sort_by') || 'nom';
  
  try {
    let sql = `SELECT * FROM pharmacies WHERE 1=1`;
    const args = [];
    
    if (query) {
      sql += ` AND (nom LIKE ? OR adresse LIKE ? OR quartier LIKE ? OR ville LIKE ?)`;
      args.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }
    
    if (region && region !== 'all') {
      sql += ` AND region = ?`;
      args.push(region);
    }
    
    if (ville && ville !== 'all') {
      sql += ` AND ville = ?`;
      args.push(ville);
    }
    
    if (avecTel) {
      sql += ` AND tel IS NOT NULL AND tel != ''`;
    }
    
    if (enGarde) {
      sql += ` AND id IN (SELECT pharmacie_id FROM gardes WHERE date_debut <= date('now') AND date_fin >= date('now'))`;
    }
    
    // Compter le total
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await client.execute({ sql: countSql, args });
    const total = countResult.rows[0].total;
    
    // Ajouter pagination
    sql += ` ORDER BY ${sortBy === 'note' ? 'note DESC' : 'nom'} LIMIT ? OFFSET ?`;
    args.push(limit, (page - 1) * limit);
    
    const result = await client.execute({ sql, args });
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}