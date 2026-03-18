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
  'https://overpass.kumi.systems/api/interpreter',
  'https://z.overpass-api.de/api/interpreter'
];

function buildQuery(lat: number, lng: number, radiusMeters: number): string {
  // Query raffinata: rimosso 'monument' e 'battlefield' per ridurre il rumore
  const tags = "castle|fort|manor|tower|ruins|archaeological_site|tomb|monastery|convent|hospital|prison|psychiatric";
  return `[out:json][timeout:90];(nwr(around:${radiusMeters},${lat},${lng})["historic"~"${tags}"];nwr(around:${radiusMeters},${lat},${lng})["building"~"abandoned|ruins|collapsed"];nwr(around:${radiusMeters},${lat},${lng})["abandoned"="yes"];);out center;`;
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
  
  // Folklore solo se accompagnato da termini 'oscuri' o se è un sito fisico rilevante
  if (text.includes('leggenda') || text.includes('mistero') || text.includes('fantasma')) {
    if (h === 'ruins' || b === 'abandoned' || h === 'castle' || text.includes('maledetta') || text.includes('apparizion')) {
       // Manteniamo come categoria specifica se possibile
    } else {
       // Se è solo un cartello o monumento folkloristico, lo declassiamo
       if (h === 'monument' || h === 'memorial') return 'ignore';
    }
  }

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
  // Rimosso tower e monument dalla promozione automatica a storico
  if (h === 'archaeological_site') return 'sito_archeologico';
  if (tags.abandoned || tags.disused || b === 'abandoned' || b === 'disused') return 'abbandonato';
  
  return 'storico';
}

function getName(tags: Record<string, string>): string {
  const baseName = tags.name || tags['name:it'] || tags['name:en'] || tags.official_name;
  if (baseName) return baseName;

  // Fallback Name: se non ha un nome, lo generiamo dalla tipologia per non perderlo
  if (tags.historic === 'castle') return 'Castello (Antico)';
  if (tags.historic === 'ruins' || tags.building === 'ruins') return 'Rovine Storiche';
  if (tags.historic === 'monastery' || tags.historic === 'convent') return 'Monastero / Convento';
  if (tags.historic === 'prison' || tags.amenity === 'prison') return 'Prigione Storica';
  if (tags.historic === 'monument') return 'Monumento Storico';
  if (tags.abandoned === 'yes') return 'Sito Abbandonato';
  if (tags.historic) return tags.historic.charAt(0).toUpperCase() + tags.historic.slice(1);
  
  return "Sito di Interesse";
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
      console.log(`📡 Mirror Try [${radiusKm}km]: ${mirror}`);
      const res = await fetch(mirror, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'RadarParanormale/2.0'
        },
        body: `data=${encodeURIComponent(query)}`,
        cache: 'no-store'
      });

      if (!res.ok) {
        console.warn(`⚠️ Mirror ${mirror} status ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (!data || !data.elements) {
        console.warn(`Empty data from ${mirror}`);
        continue;
      }

      const rawElements = data.elements;
      console.log(`✅ Received ${rawElements.length} elements from ${mirror}`);

      // Se il mirror restituisce 0 ma siamo in un'area vasta, proviamo comunque il prossimo mirror 
      // per sicurezza (casomai il primo avesse limiti di memoria)
      if (rawElements.length === 0 && mirror !== OVERPASS_MIRRORS[OVERPASS_MIRRORS.length - 1]) {
        console.log(`Zero results from ${mirror}, checking next...`);
        continue;
      }

      const places: OsmPlace[] = rawElements
        .filter((el: any) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon ?? el.center?.lng;
          return elLat && elLng; // Nome non più obbligatorio qui, lo generiamo dopo
        })
        .map((el: any) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon ?? el.center?.lng;
          return {
            id: el.id,
            lat: elLat,
            lng: elLng,
            tags: el.tags || {},
            name: getName(el.tags || {}),
            category: detectCategory(el.tags || {}),
            distanceKm: Math.round(calcDistanceKm(lat, lng, elLat, elLng) * 10) / 10,
          } as OsmPlace;
        })
        .filter((p: OsmPlace) => p.category !== 'ignore' && p.distanceKm <= radiusKm)
        .sort((a: OsmPlace, b: OsmPlace) => a.distanceKm - b.distanceKm);

      return places;
    } catch (e: any) {
      console.error(`❌ Fetch error on ${mirror}:`, e.message);
      lastError = e;
    }
  }

  // Fallback estremo se tutto fallisce: restituiamo array vuoto invece di crashare
  console.error("All mirrors failed or returned 0.");
  return [];
}
