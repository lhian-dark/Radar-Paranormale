export interface OsmPlace {
  id: number;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  name: string;
  category: string;
  distanceKm: number;
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function buildQuery(lat: number, lng: number, radiusMeters: number): string {
  return `
[out:json][timeout:60];
(
  // Storico, Castelli, Rovine, Monumenti (Nodi e Way separati per affidabilità)
  node(around:${radiusMeters},${lat},${lng})["historic"~"castle|fort|manor|tower|ruins|archaeological_site|monument|memorial|tomb|monastery|convent|hospital|battlefield|prison"];
  way(around:${radiusMeters},${lat},${lng})["historic"~"castle|fort|manor|tower|ruins|archaeological_site|monument|memorial|tomb|monastery|convent|hospital|battlefield|prison"];
  
  // Edifici Abbandonati/Dismessi
  node(around:${radiusMeters},${lat},${lng})["building"~"ruins|collapsed|abandoned|disused"];
  way(around:${radiusMeters},${lat},${lng})["building"~"ruins|collapsed|abandoned|disused"];
  
  node(around:${radiusMeters},${lat},${lng})["abandoned"~"yes|abandoned|disused"];
  way(around:${radiusMeters},${lat},${lng})["abandoned"~"yes|abandoned|disused"];

  // Cimiteri e Luoghi Sacri
  node(around:${radiusMeters},${lat},${lng})["amenity"~"grave_yard|hospital|psychiatric|church|monastery|convent"];
  way(around:${radiusMeters},${lat},${lng})["amenity"~"grave_yard|hospital|psychiatric|church|monastery|convent"];
  node(around:${radiusMeters},${lat},${lng})["landuse"="cemetery"];
  way(around:${radiusMeters},${lat},${lng})["landuse"="cemetery"];

  // Ricerca testuale ottimizzata (solo nomi e note brevi)
  node(around:${radiusMeters},${lat},${lng})["name"~"leggenda|legend|mistero|mystery|folklore|fantasma|ghost|haunted|apparizione|maledetto|curse|spirito|spirit|occulto|esoterico",i];
);
out body center;
`;
}

function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function detectCategory(tags: Record<string, string>): string {
  const h = tags.historic || '';
  const b = tags.building || '';
  const a = tags.amenity || '';
  const land = tags.landuse || '';
  const name = (tags.name || '').toLowerCase();
  
  // Testo per folklore (Priorità alta)
  const text = (name + (tags.description || '') + (tags.note || '')).toLowerCase();
  if (text.includes('leggenda') || text.includes('folklore') || text.includes('mistero') || text.includes('fantasma')) return 'storico';

  // Manicomi e Ospedali (spesso taggati come hospital o social_facility + abandoned)
  if (a === 'hospital' || a === 'social_facility' || name.includes('manicomio') || name.includes('ospedale') || name.includes('asylum') || name.includes('psichiatr')) {
    if (tags.abandoned || b === 'abandoned' || h || tags.disused) return 'manicomio';
  }

  // Carceri
  if (a === 'prison' || h === 'prison' || name.includes('carcere') || name.includes('prigione') || name.includes('penitenziario')) {
    return 'carcere';
  }

  if (a === 'grave_yard' || land === 'cemetery' || h === 'tomb') return 'cimitero';
  if (h === 'castle' || h === 'fort' || h === 'manor') return 'castello';
  if (h === 'ruins' || b === 'ruins' || b === 'collapsed') return 'rovine';
  if (h === 'monastery' || a === 'monastery' || h === 'convent') return 'monastero';
  if (a === 'church' && (tags.abandoned || b === 'abandoned')) return 'abbandonato'; 
  if (h === 'church' || a === 'church') return 'chiesa';
  if (h === 'monument' || h === 'memorial' || h === 'tower') return 'storico';
  if (h === 'archaeological_site') return 'sito_archeologico';
  
  if (tags.abandoned || tags.disused || b === 'abandoned' || b === 'disused') return 'abbandonato';
  return 'storico';
}

function getName(tags: Record<string, string>): string {
  return tags.name || tags['name:it'] || tags['name:en'] || tags.official_name || "";
}

export async function fetchParanormalPlaces(
  lat: number,
  lng: number,
  radiusKm: number = 100
): Promise<OsmPlace[]> {
  const radiusMeters = radiusKm * 1000;
  const query = buildQuery(lat, lng, radiusMeters);

  console.log(`📡 Overpass Query Start: lat=${lat}, lng=${lng}`);
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
    cache: 'no-store', // Disable cache for debugging
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ Overpass API error: ${res.status}`, errorText);
    throw new Error(`Overpass API error: ${res.status}`);
  }

  const data = await res.json();
  const rawElements = data.elements || [];
  console.log(`✅ Overpass returned ${rawElements.length} elements.`);

  const places: OsmPlace[] = rawElements
    .filter((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      const name = getName(el.tags || {});
      return elLat && elLng && name;
    })
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      return {
        id: el.id,
        lat: elLat,
        lng: elLng,
        tags: el.tags || {},
        name: getName(el.tags),
        category: detectCategory(el.tags),
        distanceKm: Math.round(calcDistanceKm(lat, lng, elLat, elLng) * 10) / 10,
      } as OsmPlace;
    })
    .filter((p: OsmPlace) => p.distanceKm <= radiusKm)
    .sort((a: OsmPlace, b: OsmPlace) => a.distanceKm - b.distanceKm);

  console.log(`🔮 Final filtered places: ${places.length}`);
  return places;
}
