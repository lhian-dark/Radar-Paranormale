import { OsmPlace } from './overpass';

export function generateDescription(place: OsmPlace): string {
  const t = place.tags || {};
  
  // 1. Cerchiamo una descrizione reale già scritta in OSM
  const realDesc = t.description || t.note || t['description:it'] || t['note:it'] || t['description:en'] || t['note:en'];
  if (realDesc) return realDesc.substring(0, 400);

  // 2. Se c'è un link a Wikipedia, diamo un'indicazione factual
  if (t.wikipedia) {
    return `Questo luogo di tipo ${getCategoryLabel(place.category)} è documentato storicamente. Consulta la pagina Wikipedia (${t.wikipedia}) per dettagli certificati sulla sua storia e leggende.`;
  }

  // 3. Altrimenti diamo una descrizione tecnica basata sulla categoria senza inventare dettagli
  const label = getCategoryLabel(place.category);
  const historicInfo = t.start_date ? ` risalente al ${t.start_date}` : "";
  
  return `Record ufficiale OpenStreetMap: ${label}${historicInfo}. Situato alle coordinate ${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}. Non sono presenti note paranormali specifiche nella banca dati globale per questo punto esatto.`;
}

export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    cimitero: '⚰️',
    castello: '🏰',
    rovine: '🏚️',
    monastero: '⛪',
    chiesa: '✝️',
    villa: '🏛️',
    campo_battaglia: '⚔️',
    tomba: '🪦',
    sito_archeologico: '🗿',
    abbandonato: '👻',
    storico: '🔮',
  };
  return map[category] || '👁️';
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    cimitero: 'Cimitero',
    castello: 'Castello',
    rovine: 'Rovine',
    monastero: 'Monastero',
    chiesa: 'Chiesa Antica',
    villa: 'Villa',
    campo_battaglia: 'Campo di Battaglia',
    tomba: 'Tomba Antica',
    sito_archeologico: 'Sito Archeologico',
    abbandonato: 'Edificio Abbandonato',
    storico: 'Sito Storico',
  };
  return map[category] || 'Luogo Misterioso';
}
