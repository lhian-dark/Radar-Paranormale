export interface OsmPlace {
  id: number;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  name: string;
  category: string;
  distanceKm: number;
}

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

function buildQuery(lat: number, lng: number, radiusMeters: number): string {
  // Query ottimizzata: nwr (node, way, relation) con tag mirati per performance su 100km
  const tags = "castle|fort|manor|tower|ruins|archaeological_site|monument|tomb|monastery|convent|hospital|battlefield|prison|psychiatric";
  return `[out:json][timeout:60];(nwr(around:${radiusMeters},${lat},${lng})["historic"~"${tags}"];nwr(around:${radiusMeters},${lat},${lng})["building"~"ruins|abandoned|collapsed"];nwr(around:${radiusMeters},${lat},${lng})["abandoned"="yes"];);out center;`;
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
  
  const text = (name + (tags.description || '') + (tags.note || '')).toLowerCase();
  if (text.includes('leggenda') || text.includes('folklore') || text.includes('mistero') || text.includes('fantasma')) return 'storico';

  if (a === 'hospital' || a === 'social_facility' || name.includes('manicomio') || name.includes('ospedale') || name.includes('asylum') || name.includes('psichiatr')) {
    if (tags.abandoned || b === 'abandoned' || h || tags.disused) return 'manicomio';
  }

  if (a === 'prison' || h === 'prison' || name.includes('carcere') || name.includes('prigione')) return 'carcere';
  if (a === 'grave_yard' || land === 'cemetery' || h === 'tomb') return 'cimitero';
  if (h === 'castle' || h === 'fort' || h === 'manor') return 'castello';
  if (h === 'ruins' || b === 'ruins' || b === 'collapsed') return 'rovine';
  if (h === 'monastery' || a === 'monastery' || h === 'convent') return 'monastero';
  if (a === 'church' && (tags.abandoned || b === 'abandoned')) return 'abbandonato'; 
  if (h === 'church' || a === 'church') return 'chiesa';
  if (h === 'monument' || h === 'memorial' || h === 'tower' || h === 'battlefield') return 'storico';
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
  let lastError = null;

  for (const mirror of OVERPASS_MIRRORS) {
    try {
      console.log(`📡 Fetching OSM from mirror: ${mirror}`);
      const res = await fetch(mirror, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'RadarParanormale/1.0 (Italy Paranormal Research App)'
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!res.ok) {
        console.warn(`⚠️ Mirror ${mirror} returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      const rawElements = data.elements || [];
      console.log(`✅ Received ${rawElements.length} elements from ${mirror}`);

      return rawElements
        .filter((el: any) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lng ?? el.center?.lon;
          const name = getName(el.tags || {});
          return elLat && elLng && name;
        })
        .map((el: any) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lng ?? el.center?.lon;
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

    } catch (e: any) {
      console.error(`❌ Fetch error on ${mirror}:`, e.message);
      lastError = e;
    }
  }

  throw lastError || new Error("Failed to fetch from all Overpass mirrors.");
}
