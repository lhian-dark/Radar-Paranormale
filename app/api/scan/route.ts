import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_SEARCH_CX;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    return NextResponse.json({ 
      error: 'Google Search non configurato. Chiedi allo sviluppatore di aggiungere le API Key su Vercel.' 
    }, { status: 500 });
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(q + ' leggende misteri')}&num=4`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message || 'Google API Error');
    }

    const results = (data.items || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('Google Search Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
