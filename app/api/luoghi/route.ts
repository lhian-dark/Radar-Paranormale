import { NextRequest, NextResponse } from 'next/server';
import { fetchParanormalPlaces } from '@/lib/overpass';
import { generateDescription } from '@/lib/descriptions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const raggio = parseInt(searchParams.get('raggio') || '100');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat e lng obbligatori' }, { status: 400 });
  }

  try {
    const places = await fetchParanormalPlaces(lat, lng, raggio);
    const enriched = places.map((p) => ({
      ...p,
      description: generateDescription(p),
    }));
    return NextResponse.json({ luoghi: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
