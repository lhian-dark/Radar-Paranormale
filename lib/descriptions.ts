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
    'Le rovine si ergono come un monito del tempo. Gli anziani del posto raccontano di aver visto bagliori tra le pietre durante le notti d\'autunno.',
    'Questo sito abbandonato emana un\'energia difficile da ignorare. Ricercatori del paranormale vi hanno registrato anomalie elettromagnetiche inspiegabili.',
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
    'Questo edificio abbandonato porta i segni di una storia interrotta di colpo. I muri scrostati celano un passato che qualcuno ha voluto dimenticare in fretta.',
    'L\'abbandono repentino di questo luogo ha alimentato le più disparate teorie. Chi si è avvicinato di notte riporta esperienze difficili da razionalizzare.',
    'Finestre sbarrate e porte serrate non bastano a contenere l\'energia di ciò che questo posto ha vissuto. Le presenze si manifestano soprattutto all\'alba.',
  ],
  storico: [
    'Questo luogo storico cela strati di storia spesso dimenticati. La sua presenza nel paesaggio racconta di eventi che hanno cambiato queste terre.',
    'Nei secoli questo sito ha assistito a vicende straordinarie, alcune celebrate altre dimenticate volutamente. Un\'aura di mistero lo avvolge ancora.',
    'La tradizione locale attribuisce a questo luogo proprietà particolari. Gli anziani lo descrivono come un punto dove il velo tra i mondi è sottile.',
  ],
};

function pickTemplate(category: string, id: number): string {
  const list = templates[category] || templates['storico'];
  return list[id % list.length];
}

function enrichFromTags(base: string, tags: Record<string, string>): string {
  const extras: string[] = [];
  if (tags.start_date) extras.push(`Risale al ${tags.start_date}.`);
  if (tags.wikipedia) extras.push(`Documentato su Wikipedia.`);
  if (tags.description) extras.push(tags.description.substring(0, 100));
  if (tags.inscription) extras.push(`Iscrizione: "${tags.inscription.substring(0, 80)}".`);

  const result = extras.length > 0 ? `${base} ${extras.join(' ')}` : base;
  return result.substring(0, 400);
}

export function generateDescription(place: OsmPlace): string {
  const base = pickTemplate(place.category, place.id);
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
