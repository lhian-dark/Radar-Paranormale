export interface WikiPage {
  pageid: number;
  title: string;
  dist: number;
  lat: number;
  lon: number;
  extract?: string;
  fullurl?: string;
}

export async function fetchNearbyWiki(lat: number, lng: number, radiusMeters: number = 10000): Promise<WikiPage[]> {
  const url = `https://it.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${radiusMeters}&gscoord=${lat}|${lng}&gslimit=20&format=json&origin=*`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query?.geosearch || [];
    
    if (pages.length === 0) return [];

    // Otteniamo estratti e URL per le pagine trovate
    const ids = pages.map((p: any) => p.pageid).join('|');
    const detailUrl = `https://it.wikipedia.org/w/api.php?action=query&prop=extracts|info&exintro&explaintext&inprop=url&pageids=${ids}&format=json&origin=*`;
    
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();
    const pagesDict = detailData.query?.pages || {};

    return pages.map((p: any) => ({
      ...p,
      extract: pagesDict[p.pageid]?.extract,
      fullurl: pagesDict[p.pageid]?.fullurl
    })).filter((p: any) => {
      // Filtriamo per rilevanza (parole chiave nel titolo o estratto)
      const text = (p.title + ' ' + (p.extract || '')).toLowerCase();
      const keywords = ['castello', 'torre', 'chiesa', 'cimitero', 'rovine', 'mistero', 'leggenda', 'fantasma', 'villa', 'storico', 'monastero', 'abbazia'];
      return keywords.some(k => text.includes(k));
    });
  } catch (err) {
    console.error('Wikipedia API error:', err);
    return [];
  }
}
