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
    name: "Ca' de Anime - Casa delle Anime",
    description: "Voltri, Genova (GE). Antica locanda medievale dove osti uccidevano ospiti; urla, porte che si aprono e spiriti di vittime durante WWII.",
    lat: 44.4275,
    lng: 8.7809,
    category: "abbandonato"
  },
  {
    id: "f-10",
    name: "Castello della Rotta",
    description: "Moncalieri (TO). Maniero XII sec. tra i più infestati d'Italia; apparizioni di templari, nobili, preti e cardinali; rumori, urla e ombre dal Medioevo.",
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
    name: "Triora - Borgo delle Streghe",
    description: "Triora (IM). 'Salem ligure': processi per stregoneria 1587-1589 con torture e morti; Cabotina luogo dei sabba, rumori e presenze stregate.",
    lat: 43.9175,
    lng: 7.7532,
    category: "storico"
  },
  {
    id: "f-13",
    name: "Rosazza - Borgo massonico",
    description: "Rosazza (BI). Villaggio XIX sec. del senatore Federico Rosazza con simboli esoterici, massonici e pagani su edifici, fontane e pietre; energia occulta.",
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
    name: "Castello Malaspina di Fosdinovo",
    description: "Fosdinovo (MS). Fantasma di Bianca Maria Aloisia Malaspina, murata viva nel 1620 dal padre con cane e cinghiale per amore con uno stalliere; appare nelle notti di luna piena.",
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
  },
  {
    id: "f-21",
    name: "Castello di Vincigliata",
    description: "Fiesole (FI). Sposa fantasma Bianca degli Usimbardi, morta di dolore nel XIII sec. dopo l'uccisione dell'amato Uberto; vaga in lacrime proteggendo amori impossibili.",
    lat: 43.8000,
    lng: 11.1333,
    category: "castello"
  },
  {
    id: "f-22",
    name: "Castello di Brolio",
    description: "Gaiole in Chianti (SI). Spettro del Barone di Ferro Bettino Ricasoli (1809-1880), visto a cavallo tra i vigneti con cani; fenomeni durante il funerale.",
    lat: 43.2667,
    lng: 11.3167,
    category: "castello"
  },
  {
    id: "f-23",
    name: "Castello dei Conti Guidi",
    description: "Poppi (AR). Fantasma di contessa Matelda, murata viva nella Torre del Diavolo per aver sedotto e ucciso amanti; appare alle finestre silenziose.",
    lat: 43.7167,
    lng: 11.7667,
    category: "castello"
  },
  {
    id: "f-24",
    name: "Castello dei Vicari",
    description: "Lari (PI). Fantasma di Giovanni Princi 'il Rosso', prigioniero morto nel 1922; passi, catene e ombra rossa tra 15-16 dicembre nelle segrete.",
    lat: 43.5667,
    lng: 10.6167,
    category: "castello"
  },
  {
    id: "f-25",
    name: "Fonte di Fata Morgana - Villa del Riposo",
    description: "Bagno a Ripoli (FI). Ninfe e fate bianche appaiono danzando presso la fonte del 1500; alchimista Von Leben le vide nel 1572 offrendogli acqua ringiovanente.",
    lat: 43.7333,
    lng: 11.3167,
    category: "storico"
  },
  {
    id: "f-26",
    name: "Ponte della Pia",
    description: "Sovicille (SI), presso Rosia. Ombra di Pia de' Tolomei, uccisa dal marito nel XIII sec.; citata da Dante nel Purgatorio per gelosia o tradimento.",
    lat: 43.2167,
    lng: 11.1500,
    category: "storico"
  },
  {
    id: "f-27",
    name: "Villa del Cotone",
    description: "Empoli (FI), Figline Valdarno area. Fantasma di bambina Emma, bruciata nel 1600 davanti alla cappella; appare ripetutamente dal '600.",
    lat: 43.7167,
    lng: 11.0000,
    category: "villa"
  },
  {
    id: "f-28",
    name: "Castello di Sorci",
    description: "Sorci (AR), Anghiari area. Fantasma di condottiero Baldaccio Bruni (1390-1441); rumori notturni e presenze spettrali nella residenza medievale.",
    lat: 43.5667,
    lng: 11.9833,
    category: "castello"
  },
  {
    id: "f-29",
    name: "Tempio di Minerva Medica",
    description: "Montefoscoli (PI), Valdera. Tempio massonico del XIX sec. con presunte anime in pena; visite luna piena rivelano presenze occulte nel bosco.",
    lat: 43.7000,
    lng: 10.6667,
    category: "storico"
  },
  {
    id: "f-30",
    name: "Castello della Lucertola",
    description: "Apricale (IM). Fantasma di contessa Cristina Anna Bellomo (1861-1904), uccisa dal marito-suicida; apparizioni nel castello del X sec.",
    lat: 43.8386,
    lng: 7.7533,
    category: "castello"
  },
  {
    id: "f-31",
    name: "Valle Christi",
    description: "Rapallo (GE). Abbazia cistercense XII sec.; suora murata viva con figlia per amore di pastore, lamenti nelle notti senza luna.",
    lat: 44.3667,
    lng: 9.2333,
    category: "abbandonato"
  },
  {
    id: "f-32",
    name: "Buranco - Porta dell'Inferno",
    description: "Bardineto (SV). Voragini del torrente Varatella simili all'Inferno dantesco; figure cornute avvistate.",
    lat: 44.1167,
    lng: 8.1333,
    category: "storico"
  },
  {
    id: "f-33",
    name: "Ex Colonia Devoto",
    description: "Monte Zatta (SP). Colonia 1930 per orfani, chiusa negli anni '60; fantasmi di bambini nei corridoi abbandonati.",
    lat: 44.3667,
    lng: 9.6167,
    category: "abbandonato"
  },
  {
    id: "f-34",
    name: "Volto di Borzone",
    description: "Borzonasca (GE). Volto scolpito nella roccia da monaci medievali; origine ignota, volto di Cristo tra alberi misteriosi.",
    lat: 44.4000,
    lng: 9.3833,
    category: "sito_archeologico"
  },
  {
    id: "f-35",
    name: "Passo delle Cento Croci",
    description: "Varese Ligure (SP). Briganti travestiti da frati uccisero 100 vittime; lamenti e fantasmi in notti di tempesta.",
    lat: 44.4667,
    lng: 9.6833,
    category: "storico"
  },
  {
    id: "f-36",
    name: "Menhir Farfalla di Luce",
    description: "Monte Caprione (SP). Megaliti preistorici; fascio luminoso a forma di farfalla al solstizio d'estate.",
    lat: 44.0667,
    lng: 10.0000,
    category: "sito_archeologico"
  },
  {
    id: "f-37",
    name: "Cimitero della Strega Senza Testa",
    description: "Campo Ligure (GE). Strega decapitata sepolta a faccia in giù; appare di notte esercitando malefici.",
    lat: 44.5000,
    lng: 8.8000,
    category: "cimitero"
  },
  {
    id: "f-38",
    name: "Grotte Alchemiche di Torino",
    description: "Torino (TO). Tre tunnel sotterranei segreti (Palazzo Reale, Gran Madre, Piazza Statuto); portali interdimensionali per alchimisti, pietra filosofale nascosta.",
    lat: 45.0703,
    lng: 7.6869,
    category: "storico"
  },
  {
    id: "f-39",
    name: "Sacra di San Michele",
    description: "Sant'Ambrogio di Torino (TO). Abbazia X sec. su Monte Pirchiriano; fantasmi monaci, rumori e ispirazione per 'Il Nome della Rosa'; energia mistica.",
    lat: 45.0997,
    lng: 7.3389,
    category: "monastero"
  },
  {
    id: "f-40",
    name: "Castello di Malgrà",
    description: "Crescentino (VC). XIV sec., fantasmi di spiriti inquieti da secoli; abbandonato, riti satanici e presenze riportate.",
    lat: 45.1167,
    lng: 8.2833,
    category: "castello"
  },
  {
    id: "f-41",
    name: "Ponte del Diavolo",
    description: "Lanzo Torinese (TO). Ponte medievale costruito dal Diavolo in una notte; maledizione su chi passa di notte, urla e ombre demoniache.",
    lat: 45.2786,
    lng: 7.4747,
    category: "storico"
  },
  {
    id: "f-42",
    name: "Chiesa di Santa Maria d'Isana",
    description: "Roccaverano (AT). Chiesetta romanica con misteri occulti; presenze e fenomeni legati a culti antichi pre-cristiani.",
    lat: 44.7333,
    lng: 8.1167,
    category: "chiesa"
  },
  {
    id: "f-43",
    name: "Castello di Cannero",
    description: "Cannero Riviera (VB). Rovine XIV sec. dei fratelli Mazzaforte pirati; fantasmi di briganti sul Lago Maggiore, urla notturne.",
    lat: 45.9833,
    lng: 8.7833,
    category: "rovine"
  },
  {
    id: "f-44",
    name: "Castello della Manta",
    description: "Manta (CN). Tre spettri nelle sale affrescate XIV sec.; nobili erranti, FAI-owned con avvistamenti persistenti.",
    lat: 44.7667,
    lng: 7.4333,
    category: "castello"
  },
  {
    id: "f-45",
    name: "Villa del Roccolo",
    description: "Busca (CN). Neogotico 1831, fantasma di figlia marchesi Tapparelli; spirito buono attende marito, appare di notte.",
    lat: 44.5000,
    lng: 7.4833,
    category: "villa"
  },
  // --- NUOVI INSERIMENTI ---
  {
    id: "f-46",
    name: "Isola di Poveglia",
    description: "Venezia (VE). Lazzaretto peste XIV sec., poi manicomio con 160.000 morti; fantasma dottore suicidato e urla pazienti.",
    lat: 45.3667,
    lng: 12.3000,
    category: "manicomio"
  },
  {
    id: "f-47",
    name: "Castello di Monselice",
    description: "Monselice (PD). Prigioni medievale con lamenti prigionieri torturati; passi e figure spettrali.",
    lat: 45.2361,
    lng: 11.7433,
    category: "castello"
  },
  {
    id: "f-48",
    name: "Castello di Collalto",
    description: "Susegana (TV). Bianca murata viva per amore proibito XI sec.; pianto luna piena sui bastioni.",
    lat: 45.8833,
    lng: 12.2667,
    category: "castello"
  },
  {
    id: "f-49",
    name: "Villa Foscari - La Malcontenta",
    description: "Mira (VE). Elisabetta Dolfin segregata dal marito; spirito malinconico con rumori e cali temperatura.",
    lat: 45.4167,
    lng: 12.2333,
    category: "villa"
  },
  {
    id: "f-50",
    name: "Castello di Valbona",
    description: "Lozzo Atestino (PD). Figlia Ghibelli murata viva per amore Duecento; vaga in lacrime tra merli.",
    lat: 45.2667,
    lng: 11.5167,
    category: "castello"
  },
  {
    id: "f-51",
    name: "Masso della Mandringa",
    description: "Volterra (PI). Rocca dove streghe si riunivano per sabba; Aradia vi insegnò magia nel 1300.",
    lat: 43.4000,
    lng: 10.8667,
    category: "storico"
  },
  {
    id: "f-52",
    name: "Ex Manicomio di Volterra",
    description: "Volterra (PI). Complesso psichiatrico con torture e morti; urla e ombre pazienti riportate in urbex.",
    lat: 43.4002,
    lng: 10.8759,
    category: "manicomio"
  },
  {
    id: "f-53",
    name: "Vicolo delle Streghe",
    description: "Volterra (PI). Vicolo medievale legato a processi; presenze sussurranti notti luna piena.",
    lat: 43.4014,
    lng: 10.8614,
    category: "storico"
  },
  {
    id: "f-54",
    name: "Palazzo Viti - Dama Bianca",
    description: "Volterra (PI). Nobildonna appare lune piene XIX sec.; palazzo rinascimentale con scale infestate.",
    lat: 43.4010,
    lng: 10.8605,
    category: "storico"
  },
  {
    id: "f-55",
    name: "Balze di Volterra",
    description: "Volterra (PI). Erosione che inghiotte case; leggende etrusche di spiriti sotterranei e crolli maledetti.",
    lat: 43.3950,
    lng: 10.8700,
    category: "storico"
  },
  {
    id: "f-56",
    name: "Villa Morazzana",
    description: "Livorno (LI). Villa più infestata di Livorno; 'do di petto' risuona, fantasmi nobili e urla notturne.",
    lat: 43.5000,
    lng: 10.3167,
    category: "villa"
  },
  {
    id: "f-57",
    name: "Villa delle Rose - Villa Dupouy",
    description: "Livorno (LI). Ragazzina bionda appare alla finestra; costruita Quattrocento, cani ululano al cimitero interno.",
    lat: 43.4920,
    lng: 10.3200,
    category: "villa"
  },
  {
    id: "f-58",
    name: "Villino Wetryk",
    description: "Livorno (LI). Fantasma del mago Copperfield livornese appare al piccolo erede; illusioni spettrali.",
    lat: 43.5500,
    lng: 10.3064,
    category: "villa"
  },
  {
    id: "f-59",
    name: "Torre dei Fantasmi",
    description: "Livorno (LI). Torre guardia 1702 maledetta; voci chiamano nomi, lanterna rossa caccia anime.",
    lat: 43.5500,
    lng: 10.3000,
    category: "storico"
  },
  {
    id: "f-60",
    name: "Torre della Bella Marsilia",
    description: "Talamone (GR). Margherita Marsili rapita nel '500; appare notti senza luna con capelli rossi.",
    lat: 42.611786,
    lng: 11.117056,
    category: "storico"
  },
  {
    id: "f-61",
    name: "Arcidosso - David Lazzaretti",
    description: "Arcidosso (GR). Borgo profeta XIX sec.; simboli occulti, presenze mistiche e riti giacobini.",
    lat: 42.8667,
    lng: 11.1333,
    category: "storico"
  },
  {
    id: "f-62",
    name: "Buriano - Borgo fantasma",
    description: "Castiglione della Pescaia (GR). Villaggio abbandonato per malaria; case vuote e presenze eteree tra rovine.",
    lat: 43.0000,
    lng: 10.8833,
    category: "abbandonato"
  },
  {
    id: "f-63",
    name: "Casa Morandini",
    description: "Grosseto (GR). Villa liberty sfitta per fantasmi; rumori notte, voci e luci strane dagli anni '70.",
    lat: 42.766213538232826,
    lng: 11.111053012556322,
    category: "villa"
  },
  {
    id: "f-64",
    name: "Chiesa di Sant'Agostino",
    description: "Lucca centro. Botola nasconde pozzo all'Inferno; leggenda collega ad Agharti sotterraneo.",
    lat: 43.8430,
    lng: 10.5010,
    category: "chiesa"
  },
  {
    id: "f-65",
    name: "Giardino Botanico",
    description: "Lucca. Carro di fuoco vorticoso nel laghetto notti; luogo stregato dai Borboni 1820.",
    lat: 43.8417,
    lng: 10.5033,
    category: "storico"
  },
  {
    id: "f-66",
    name: "Duomo di Pisa",
    description: "Pisa. Unghiate del Diavolo su pilastri; leggende medievali di presenze infernali.",
    lat: 43.7230,
    lng: 10.3966,
    category: "storico"
  },
  {
    id: "f-67",
    name: "Villa di Corliano",
    description: "San Giuliano Terme (PI). Fantasma Teresa appare nei giardini; tomba Botro Lupa nel bosco.",
    lat: 43.7667,
    lng: 10.5167,
    category: "villa"
  },
  {
    id: "f-68",
    name: "Pieve San Pietro Gropina",
    description: "Loro Ciuffenna (AR). Green Man e chimere precristiane; chiese paleocristiane sottostanti.",
    lat: 43.5333,
    lng: 11.6000,
    category: "chiesa"
  }
];
