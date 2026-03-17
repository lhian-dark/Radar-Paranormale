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
  // Cerchiamo sia per tipologia che per parole chiave specifiche nel nome o descrizione
  const keywords = "fantasma|ghost|haunted|mistero|mystery|leggenda|legend|spirito|spirit|macabro|paranormale";
  
  return `
[out:json][timeout:30];
(
  node(around:${radiusMeters},${lat},${lng})["historic"~"ruins|castle|fort|monastery|church|manor|archaeological_site|battlefield|tomb"];
  way(around:${radiusMeters},${lat},${lng})["historic"~"ruins|castle|fort|monastery|church|manor|archaeological_site|battlefield|tomb"];
  node(around:${radiusMeters},${lat},${lng})["amenity"~"grave_yard|church"];
  way(around:${radiusMeters},${lat},${lng})["amenity"~"grave_yard|church"];
  node(around:${radiusMeters},${lat},${lng})["landuse"="cemetery"];
  way(around:${radiusMeters},${lat},${lng})["landuse"="cemetery"];
  node(around:${radiusMeters},${lat},${lng})["building"="abandoned"];
  node(around:${radiusMeters},${lat},${lng})["abandoned"];
  
  // Ricerca testuale specifica per il "Paranormale"
  node(around:${radiusMeters},${lat},${lng})["description"~"${keywords}",i];
  node(around:${radiusMeters},${lat},${lng})["note"~"${keywords}",i];
  node(around:${radiusMeters},${lat},${lng})["name"~"${keywords}",i];
  way(around:${radiusMeters},${lat},${lng})["description"~"${keywords}",i];
  way(around:${radiusMeters},${lat},${lng})["note"~"${keywords}",i];
  way(around:${radiusMeters},${lat},${lng})["name"~"${keywords}",i];
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

  if (a === 'grave_yard' || land === 'cemetery') return 'cimitero';
  if (h === 'castle' || h === 'fort') return 'castello';
  if (h === 'ruins') return 'rovine';
  if (h === 'monastery') return 'monastero';
  if (h === 'church' || a === 'church') return 'chiesa';
  if (h === 'manor') return 'villa';
  if (h === 'battlefield') return 'campo_battaglia';
  if (h === 'tomb') return 'tomba';
  if (h === 'archaeological_site') return 'sito_archeologico';
  if (tags.abandoned || tags.disused || b === 'abandoned') return 'abbandonato';
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
    .sort((a: OsmPlace, b: OsmPlace) => a.distanceKm - b.distanceKm)
    .slice(0, 60);

  console.log(`🔮 Final filtered places: ${places.length}`);
  return places;
}
