export interface WikiDataItem {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  distanceKm: number;
  isDeep: boolean;
}

export async function fetchDeepMisteri(lat: number, lng: number, radiusKm: number = 15): Promise<WikiDataItem[]> {
  // Query SPARQL per Wikidata: cerca entità vicine che sono istanze di o legate a:
  // Q5192900 (haunted house), Q350824 (ghost town), Q43229 (ghost), 
  // Q34344 (legend), Q816823 (urban legend), Q108163 (folklore), Q125191 (monster)
  const sparqlQuery = `
    SELECT ?item ?itemLabel ?itemDescription ?coords ?distance WHERE {
      SERVICE wikibase:around {
          ?item wdt:P625 ?coords .
          bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral .
          bd:serviceParam wikibase:radius "${radiusKm}" .
          bd:serviceParam wikibase:distance ?distance .
      }
      ?item (wdt:P31/wdt:P279*|wdt:P361/wdt:P279*) ?type .
      VALUES ?type { 
        wd:Q5192900 wd:Q350824 wd:Q43229 wd:Q34344 wd:Q816823 wd:Q108163 wd:Q125191 
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
    } ORDER BY ?distance LIMIT 20
  `;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;

  try {
    const res = await fetch(url, {
      headers: { 
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'RadarParanormale/1.0 (https://radar-paranormale.vercel.app; darkl@example.com)'
      }
    });
    const data = await res.json();
    
    return data.results.bindings.map((b: any) => {
      // Coordinate di Wikidata sono nel formato "Point(lng lat)"
      const coords = b.coords.value.replace('Point(', '').replace(')', '').split(' ');
      return {
        id: b.item.value.split('/').pop() || '',
        name: b.itemLabel.value,
        description: b.itemDescription?.value || 'Sito di interesse leggendario documentato.',
        lat: parseFloat(coords[1]),
        lng: parseFloat(coords[0]),
        distanceKm: Math.round(parseFloat(b.distance.value) * 10) / 10,
        isDeep: true
      };
    });
  } catch (err) {
    console.error('Wikidata Deep Research Error:', err);
    return [];
  }
}
