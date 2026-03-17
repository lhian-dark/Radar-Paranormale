import { OsmPlace } from './overpass';

const templates: Record<string, string[]> = {
  cimitero: [
    'Un antico cimitero avvolto nel silenzio, dove le lapidi raccontano storie dimenticate. I residenti locali riferiscono strane presenze nelle ore notturne.',
    'Questo campo santo custodisce le spoglie di generazioni passate. Tra i suoi vialetti si aggirano leggende di spiriti inquieti mai partiti.',
    'Il cimitero storico è avvolto da un\'aura di mistero. Visitatori hanno riferito rumori inspiegabili e apparizioni nelle ore crepuscolari.',
  ],
  castello: [
    'Questa fortezza medievale ha visto battaglie, tradimenti e morti violente. Le mura ancora vibrano di energia ancestrale che i più sensibili percepiscono chiaramente.',
    'Il castello domina il paesaggio da secoli, testimone silenzioso di eventi oscuri. Numerose testimonianze parlano di luci nella torre nord nelle notti senza luna.',
    'Tra queste torri millenarie, le leggende di apparizioni si tramandano di generazione in generazione. I guardiani notturni evitano certe stanze.',
  ],
  rovine: [
    'Ciò che rimane di questo edificio nasconde una storia di abbandono e mistero. Tra le macerie dimorate storie di presenze che rifiutano di abbandonare il luogo.',
    'I ruderi si ergono come un monito del tempo. Gli anziani del posto raccontano di aver visto bagliori tra le pietre durante le notti d\'autunno.',
    'Questo sito in rovina emana un\'energia difficile da ignorare. Ricercatori del paranormale vi hanno registrato anomalie elettromagnetiche inspiegabili.',
  ],
  monastero: [
    'Questo antico monastero ha visto monaci, riti esoterici e segreti sepolti. Le sue camere vuote risuonano ancora di canti gregoriani nelle notti silenziose.',
    'Il monastero abbandonato custodisce secoli di storia religiosa e occulta. I locali evitano di avvicinarsi dopo il tramonto.',
    'Tra queste mura sacre si intrecciano storia e leggenda. Alcuni studiosi ritengono che antichi riti vi siano stati praticati nel sottosuolo.',
  ],
  chiesa: [
    'Questa chiesa storica nasconde cripta e segreti dimenticati. Le tradizioni locali parlano di apparizioni di figure religiose nelle ore notturne.',
    'Consacrata secoli fa, questa chiesa ha visto eventi che la storia ufficiale ha preferito dimenticare. Il sagrato di notte è avvolto in una presenza particolare.',
    'Tra le navate di questa chiesa antica, l\'aria porta ancora tracce di qualcosa di indefinibile. I fedeli parlano di sensazioni di essere osservati.',
  ],
  villa: [
    'Questa villa nobiliare cela storie di famiglie illustri, tragedie e segreti. Alcune stanze sono rimaste sigillate per decenni per ragioni mai divulgate.',
    'Gli ultimi proprietari abbandonarono la villa senza spiegazioni. Da allora i vicini riportano luci alle finestre e ombre che si muovono al crepuscolo.',
    'La villa signorile ha assistito a vicende di cui le cronache locali parlano ancora sottovoce. Un\'atmosfera opprimente avvolge le sue stanze.',
  ],
  campo_battaglia: [
    'Su questo terreno si è combattuta una delle battaglie più sanguinose della regione. Gli echi di quel conflitto sembrano rimanere nell\'aria.',
    'Questo campo fu teatro di enormi sofferenze umane. In primavera, quando la nebbia scende al mattino, la vegetazione sembra diversa dal resto.',
    'Le terre qui sono intrise di storia e sangue. Sensibili e sensitivi riportano di sentire la presenza di anime ancora legate al luogo del loro ultimo respiro.',
  ],
  tomba: [
    'Questo antico sepolcro custodisce segreti di chi vi è sepolto. Le iscrizioni sulle pareti raccontano una storia molto diversa da quella ufficiale.',
    'La tomba storica è circondata da misteri irrisolti. Gli archeologi che l\'hanno studiata riferiscono di strani inconvenienti tecnici durante gli scavi.',
    'Questo monumento funebre è avvolto in una leggenda locale che parla di maledizioni e custodi invisibili.',
  ],
  sito_archeologico: [
    'Questo sito custodisce tracce di civiltà antiche i cui rituali rimangono avvolti nel mistero. La notte il luogo assume un\'atmosfera del tutto particolare.',
    'Gli scavi qui hanno restituito oggetti difficili da classificare. La storia ufficiale non spiega tutto ciò che è stato trovato sotto la superficie.',
    'Antiche civiltà hanno lasciato impronte indelebili in questo luogo. Alcuni ricercatori parlano di portali energetici ancestrali ancora attivi.',
  ],
  abbandonato: [
    'Questo luogo abbandonato porta i segni di una storia interrotta di colpo. I muri scrostati celano un passato che qualcuno ha voluto dimenticare in fretta.',
    'L\'abbandono repentino di questo edificio ha alimentato le più disparate teorie. Chi si è avvicinato di notte riporta esperienze difficili da razionalizzare.',
    'Finestre sbarrate e porte serrate non bastano a contenere l\'energia di ciò che questo posto ha vissuto. Le presenze si manifestano soprattutto all\'alba.',
  ],
  storico: [
    'Questo punto di interesse nasconde leggende e tradizioni secolari. Il folklore locale lo indica come un luogo dove il velo tra i mondi è insolitamente sottile.',
    'Nei secoli questo sito ha assistito a vicende straordinarie che la tradizione orale ha tramandato fino a noi. Un\'aura di mistero lo circonda.',
    'La storia ufficiale tace su ciò che è avvenuto qui, ma le leggende locali parlano chiaro: è un punto di forte carica energetica.',
  ],
};

function pickTemplate(category: string, id: number): string {
  const list = templates[category] || templates['storico'];
  return list[id % list.length];
}

function enrichFromTags(base: string, tags: Record<string, string>): string {
  const extras: string[] = [];
  
  // Se c'è una descrizione reale, diamole priorità o usiamola come incipit
  if (tags.description) extras.push(`Nota storica: ${tags.description.substring(0, 150)}...`);
  if (tags.note) extras.push(`Dettaglio: ${tags.note.substring(0, 120)}...`);
  
  if (tags.start_date) extras.push(`Origini: ${tags.start_date}.`);
  if (tags.wikipedia) extras.push(`Documentato negli archivi storici.`);
  if (tags.inscription) extras.push(`Reca l'iscrizione: "${tags.inscription.substring(0, 60)}".`);

  const result = extras.length > 0 ? `${base} \n\n${extras.join(' ')}` : base;
  return result.substring(0, 500);
}

export function generateDescription(place: OsmPlace): string {
  // Se il nome o i tag contengono parole chiave specifiche, usiamo il template storico/mistero
  const text = (place.name + (place.tags.description || '') + (place.tags.note || '')).toLowerCase();
  
  let category = place.category;
  if (text.includes('leggenda') || text.includes('folklore') || text.includes('mistero')) {
    category = 'storico'; 
  }

  const base = pickTemplate(category, place.id);
  return enrichFromTags(base, place.tags);
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
    cimitero: 'Cimitero Antico',
    castello: 'Castello/Fortezza',
    rovine: 'Rovine/Ruderi',
    monastero: 'Monastero',
    chiesa: 'Chiesa Antica',
    villa: 'Villa Storica',
    campo_battaglia: 'Campo di Battaglia',
    tomba: 'Tomba Antica',
    sito_archeologico: 'Sito Archeologico',
    abbandonato: 'Luogo Abbandonato',
    storico: 'Leggenda/Folklore',
  };
  return map[category] || 'Punto di Interesse';
}
