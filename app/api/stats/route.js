import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET() {
  try {
    const total = await client.execute('SELECT COUNT(*) as total FROM pharmacies');
    const avecTel = await client.execute('SELECT COUNT(*) as total FROM pharmacies WHERE tel IS NOT NULL');
    const parRegion = await client.execute(`
      SELECT region, COUNT(*) as count 
      FROM pharmacies 
      GROUP BY region 
      ORDER BY count DESC
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        total: total.rows[0].total,
        avecTel: avecTel.rows[0].total,
        parRegion: parRegion.rows
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}