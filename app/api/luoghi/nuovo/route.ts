import { NextRequest, NextResponse } from 'next/server';

// This is a passthrough — actual DB write happens client-side via Appwrite SDK
// (avoids exposing API keys server-side)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.lat || !body.lng) {
      return NextResponse.json({ error: 'name, lat, lng obbligatori' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, received: body });
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 });
  }
}
