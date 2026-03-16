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
[out:json][timeout:30];
(
  node["historic"="ruins"]["name"](around:${radiusMeters},${lat},${lng});
  way["historic"="ruins"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="castle"]["name"](around:${radiusMeters},${lat},${lng});
  way["historic"="castle"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="fort"]["name"](around:${radiusMeters},${lat},${lng});
  node["amenity"="grave_yard"]["name"](around:${radiusMeters},${lat},${lng});
  way["amenity"="grave_yard"]["name"](around:${radiusMeters},${lat},${lng});
  node["landuse"="cemetery"]["name"](around:${radiusMeters},${lat},${lng});
  way["landuse"="cemetery"]["name"](around:${radiusMeters},${lat},${lng});
  node["building"="abandoned"]["name"](around:${radiusMeters},${lat},${lng});
  node["abandoned"]["name"](around:${radiusMeters},${lat},${lng});
  node["disused"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="monastery"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="church"]["name"](around:${radiusMeters},${lat},${lng});
  way["historic"="church"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="manor"]["name"](around:${radiusMeters},${lat},${lng});
  way["historic"="manor"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="archaeological_site"]["name"](around:${radiusMeters},${lat},${lng});
  node["tourism"="attraction"]["historic"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="battlefield"]["name"](around:${radiusMeters},${lat},${lng});
  node["historic"="tomb"]["name"](around:${radiusMeters},${lat},${lng});
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
  if (h === 'church') return 'chiesa';
  if (h === 'manor') return 'villa';
  if (h === 'battlefield') return 'campo_battaglia';
  if (h === 'tomb') return 'tomba';
  if (h === 'archaeological_site') return 'sito_archeologico';
  if (tags.abandoned || tags.disused || b === 'abandoned') return 'abbandonato';
  return 'storico';
}

export async function fetchParanormalPlaces(
  lat: number,
  lng: number,
  radiusKm: number = 100
): Promise<OsmPlace[]> {
  const radiusMeters = radiusKm * 1000;
  const query = buildQuery(lat, lng, radiusMeters);

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
    next: { revalidate: 3600 }, // Next.js cache 1 hour
  });

  if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);

  const data = await res.json();

  const places: OsmPlace[] = (data.elements || [])
    .filter((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      return elLat && elLng && el.tags?.name;
    })
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      return {
        id: el.id,
        lat: elLat,
        lng: elLng,
        tags: el.tags || {},
        name: el.tags.name,
        category: detectCategory(el.tags),
        distanceKm: Math.round(calcDistanceKm(lat, lng, elLat, elLng) * 10) / 10,
      } as OsmPlace;
    })
    .filter((p: OsmPlace) => p.distanceKm <= radiusKm)
    .sort((a: OsmPlace, b: OsmPlace) => a.distanceKm - b.distanceKm)
    .slice(0, 60);

  return places;
}
