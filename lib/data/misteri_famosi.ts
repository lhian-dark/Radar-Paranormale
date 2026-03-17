export interface FamousMystery {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  category: string;
}

export const MISTERI_FAMOSI: FamousMystery[] = [
  {
    id: "f-1",
    name: "Castello di Montebello (Azzurrina)",
    description: "Poggio Torriana (RN). Castello medievale legato alla leggenda della bambina albina Azzurrina, scomparsa il 21 giugno 1375 nella ghiacciaia; si sentono presunti gridi e EVP.",
    lat: 44.0289,
    lng: 12.4049,
    category: "castello"
  },
  {
    id: "f-2",
    name: "Villa De Vecchi - Casa Rossa",
    description: "Cortenova (LC). Villa ottocentesca abbandonata, maledetta dopo il suicidio della moglie del conte De Vecchi e la scomparsa della figlia; infestata da ombre e rumori.",
    lat: 46.0058,
    lng: 9.4092,
    category: "villa"
  },
  {
    id: "f-3",
    name: "Villa Magnoni",
    description: "Cona (FE). Villa con leggenda della strega: tre ragazzi morirono in un incidente dopo aver visto una vecchia alla finestra negli anni '70.",
    lat: 44.8019,
    lng: 11.7304,
    category: "villa"
  },
  {
    id: "f-4",
    name: "Villa Caboto",
    description: "Mondello (PA). Villa anni '40 con fantasma di una fanciulla uccisa dal padre; rumori, luci e apparizioni riportate da visitatori.",
    lat: 38.2048,
    lng: 13.3165,
    category: "villa"
  },
  {
    id: "f-5",
    name: "Villa Cerri",
    description: "Lomello (PV). Marito uccise moglie e amante stalliere nel '900, poi si suicidò; fantasmi degli amanti visti abbracciati.",
    lat: 45.1005,
    lng: 8.7876,
    category: "villa"
  },
  {
    id: "f-6",
    name: "Monastero dei Monaci del Diavolo",
    description: "Sicignano degli Alburni (SA). Monastero seicentesco con monaco assassino vendicativo; sparizioni e url notturni nella foresta.",
    lat: 40.5263,
    lng: 15.3256,
    category: "monastero"
  },
  {
    id: "f-7",
    name: "Palazzo Carmagnola",
    description: "Milano (MI). Palazzo quattrocentesco con fantasmi del conte decapitato e Cecilia Gallerani alla finestra il 2 novembre.",
    lat: 45.4664,
    lng: 9.1871,
    category: "storico"
  },
  {
    id: "f-8",
    name: "Ca' Dario",
    description: "Venezia (VE). Palazzo sul Canal Grande maledetto: proprietari muoiono violentemente o falliscono da secoli.",
    lat: 45.4309,
    lng: 12.3275,
    category: "storico"
  },
  {
    id: "f-9",
    name: "Casa delle Anime",
    description: "Voltri (GE). Locanda dove osti uccidevano ospiti nel '700; spiriti urlanti e presenze riportate.",
    lat: 44.4275,
    lng: 8.7809,
    category: "abbandonato"
  },
  {
    id: "f-10",
    name: "Maniero della Rotta",
    description: "Moncalieri (TO). Castello templare con apparizioni di nobili, preti e cardinali; tra i più infestati d'Italia.",
    lat: 44.9865,
    lng: 7.7017,
    category: "castello"
  },
  {
    id: "f-11",
    name: "Parco dei Mostri",
    description: "Bomarzo (VT). Bosco sacro del '500 con statue mostruose commissionate da Orsini; energia esoterica e alchemica.",
    lat: 42.5172,
    lng: 12.2822,
    category: "sito_archeologico"
  },
  {
    id: "f-12",
    name: "Triora - Villaggio delle streghe",
    description: "Triora (IM). 'Salem italiana': oltre 300 donne processate e uccise per stregoneria nel '500; case con simboli occulti.",
    lat: 43.9175,
    lng: 7.7532,
    category: "storico"
  },
  {
    id: "f-13",
    name: "Rosazza - Borgo massonico",
    description: "Rosazza (BI). Borgo con simboli esoterici e Casa del Diavolo; riti pagani e misteri massonici.",
    lat: 45.6279,
    lng: 8.1603,
    category: "storico"
  },
  {
    id: "f-14",
    name: "Castello di Bardi",
    description: "Bardi (PR). Fantasmi di Soleste e Moroello, amanti separati da suicidio; apparizioni dal XIII secolo.",
    lat: 44.7635,
    lng: 9.7293,
    category: "castello"
  },
  {
    id: "f-15",
    name: "Castello di Fosdinovo",
    description: "Fosdinovo (MS). Fantasma di Bianca Malaspina, donna bionda impiccata; rumori e presenze nel '400.",
    lat: 44.1547,
    lng: 10.0249,
    category: "castello"
  },
  {
    id: "f-16",
    name: "Scarzuola",
    description: "Montegiove (TR). Città ideale alchemica di Tomaso Buzzi vicino al convento di San Francesco; architetture surreali mistiche.",
    lat: 42.8333,
    lng: 12.6667,
    category: "sito_archeologico"
  },
  {
    id: "f-17",
    name: "Grotte di Cumae",
    description: "Cuma (NA). Antro della Sibilla Cumana con profezie; tunnel etrusco-romano legato all'Ade virgiliano.",
    lat: 40.8403,
    lng: 14.0560,
    category: "sito_archeologico"
  },
  {
    id: "f-18",
    name: "Camerano Sotterranea",
    description: "Camerano (AN). Labirinto sotterraneo con sale templari e simboli esoterici; chilometri di gallerie misteriose.",
    lat: 43.4333,
    lng: 13.4833,
    category: "sito_archeologico"
  },
  {
    id: "f-19",
    name: "Castello di Torre Alfina",
    description: "Torre Alfina (VT). Dama Bianca, fantasma di nobildonna; tra i castelli infestati con avvistamenti recenti.",
    lat: 42.7667,
    lng: 12.0167,
    category: "castello"
  },
  {
    id: "f-20",
    name: "Castello di Duino",
    description: "Duino ( Trieste). Fantasma del Bianco Signor; castello friulano con leggende di spiriti nobiliari.",
    lat: 45.7722,
    lng: 13.5792,
    category: "castello"
  }
];
