import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    // Récupérer la pharmacie
    const pharmacyResult = await client.execute({
      sql: 'SELECT * FROM pharmacies WHERE id = ?',
      args: [id]
    });
    
    if (pharmacyResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pharmacie non trouvée' },
        { status: 404 }
      );
    }
    
    const pharmacy = pharmacyResult.rows[0];
    
    // Récupérer l'historique des gardes
    const gardesResult = await client.execute({
      sql: 'SELECT * FROM gardes WHERE pharmacie_id = ? ORDER BY date_debut DESC LIMIT 10',
      args: [id]
    });
    
    // Récupérer les services
    const servicesResult = await client.execute({
      sql: `SELECT s.nom FROM services s
            JOIN pharmacie_services ps ON s.id = ps.service_id
            WHERE ps.pharmacie_id = ?`,
      args: [id]
    });
    
    // Récupérer les stats
    const statsResult = await client.execute({
      sql: 'SELECT * FROM stats_pharmacies WHERE pharmacie_id = ?',
      args: [id]
    });
    
    return NextResponse.json({
      success: true,
      data: {
        ...pharmacy,
        gardes: gardesResult.rows,
        services: servicesResult.rows.map(s => s.nom),
        stats: statsResult.rows[0] || null
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