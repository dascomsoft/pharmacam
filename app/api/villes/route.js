import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  
  try {
    let sql = 'SELECT DISTINCT ville FROM pharmacies';
    const args = [];
    
    if (region) {
      sql += ' WHERE region = ?';
      args.push(region);
    }
    
    sql += ' ORDER BY ville';
    
    const result = await client.execute({ sql, args });
    
    return NextResponse.json({
      success: true,
      data: result.rows.map(r => r.ville)
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}