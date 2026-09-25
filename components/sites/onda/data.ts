/** Onda Instruments — fabricante de equipos para DJ y músicos. Datos puros (sin React). */
import type { GearKind } from "@/lib/sites/art";

export const SLUG = "onda";

export const meta = {
  slug: SLUG,
  name: "Onda Instruments",
  title: "Onda Instruments · equipos para DJ y músicos",
  blurb: "Fabricante de controladoras, sintetizadores, cajas de ritmos, monitores y auriculares: catálogo por categorías, fichas con especificaciones y descargas, artistas y soporte con registro de producto.",
  accent: "#ff6a1a",
  tag: "fabricante · catálogo",
};

export type Gear = {
  slug: string;
  name: string;
  category: string;
  kind: GearKind;
  seed: number;
  price: number;
  tagline: string;
  body: string;
  highlights: string;
  specs: string;
  box: string[];
  downloads: string[];
  isNew?: boolean;
};

export const CATEGORIES = ["DJ", "Sintetizadores", "Ritmos", "Monitores", "Auriculares"];

export const GEAR: Gear[] = [
  {
    slug: "polar-8",
    name: "Polar 8",
    category: "Sintetizadores",
    kind: "synth",
    seed: 4,
    price: 1490,
    tagline: "Polifónico analógico de 8 voces.",
    body: "Ocho voces analógicas con dos osciladores por voz, filtro de 24 dB en escalera y un secuenciador polifónico de 64 pasos. Cada mando tiene su función: sin menús, sin pantallas que miren hacia otro lado.",
    highlights: "icon:music|8 voces analógicas|Dos osciladores y un generador de ruido por voz, con deriva ajustable.\nicon:zap|Filtro en escalera|24 dB/oct con resonancia hasta la autooscilación.\nicon:clock|Secuenciador de 64 pasos|Polifónico, con probabilidad y automatización por paso.",
    specs: "Característica, Polar 8\nVoces, 8 (analógicas)\nOsciladores, 2 + ruido por voz\nTeclado, 49 teclas semicontrapesadas\nConexiones, MIDI DIN · USB-C · CV/Gate\nPeso, 9,8 kg",
    box: ["Polar 8", "Fuente de alimentación", "Cable USB-C", "Guía rápida"],
    downloads: ["Manual (PDF, 12 MB)", "Firmware 2.4", "Editor de sonidos para macOS y Windows"],
    isNew: true,
  },
  {
    slug: "dx-2",
    name: "DX-2",
    category: "DJ",
    kind: "controller",
    seed: 7,
    price: 499,
    tagline: "Controladora DJ de 2 canales para empezar en serio.",
    body: "Platos de 15 cm con retroalimentación de posición, 16 pads multifunción y una tarjeta de sonido de 24 bits. Funciona con los principales programas de DJ sin configurar nada.",
    highlights: "icon:gamepad|Platos de 15 cm|Con indicador de posición y tensión ajustable.\nicon:volume|Audio de 24 bits|Salida maestra balanceada y de auriculares independiente.\nicon:power|Alimentación por USB|Llévala en la mochila y pincha en cualquier sitio.",
    specs: "Característica, DX-2\nCanales, 2\nPads, 16 multifunción\nAudio, 24 bits / 48 kHz\nSalidas, Máster XLR · Cabina · Auriculares\nPeso, 2,4 kg",
    box: ["DX-2", "Cable USB-C", "Licencia de software DJ", "Guía rápida"],
    downloads: ["Manual (PDF, 6 MB)", "Firmware 1.8", "Mapeo para software DJ"],
  },
  {
    slug: "dx-4-pro",
    name: "DX-4 Pro",
    category: "DJ",
    kind: "controller",
    seed: 12,
    price: 899,
    tagline: "Cuatro canales y pantallas en los platos.",
    body: "La controladora de club: cuatro canales, pantallas de color en los platos con la forma de onda, efectos por canal y dos entradas de micrófono con ecualizador.",
    highlights: "icon:image|Pantallas en los platos|Forma de onda, BPM y portada sin mirar el portátil.\nicon:mic|Dos micrófonos|Con ecualizador de tres bandas y talkover.\nicon:sparkles|Efectos por canal|Filtro, eco y reverb con un solo mando.",
    specs: "Característica, DX-4 Pro\nCanales, 4\nPantallas, 2 × 4,3 pulgadas\nAudio, 24 bits / 96 kHz\nEntradas, 2 micros · 2 línea\nPeso, 5,1 kg",
    box: ["DX-4 Pro", "Fuente de alimentación", "Cable USB-C", "Licencia de software DJ"],
    downloads: ["Manual (PDF, 14 MB)", "Firmware 3.1", "Mapeo para software DJ"],
  },
  {
    slug: "mx-4",
    name: "MX-4",
    category: "DJ",
    kind: "mixer",
    seed: 3,
    price: 1290,
    tagline: "Mezclador de club de 4 canales.",
    body: "Cuatro canales con ecualizador de aislamiento de tres bandas, filtros por canal y un crossfader magnético que aguanta años de scratch. Pensado para cabinas que no cierran.",
    highlights: "icon:settings-cog|Ecualizador de aislamiento|Corta del todo cada banda, sin colorear el sonido.\nicon:zap|Crossfader magnético|Sin contacto, sin desgaste, con curva ajustable.\nicon:volume|Salidas de club|Máster XLR, cabina y grabación independientes.",
    specs: "Característica, MX-4\nCanales, 4\nEcualizador, 3 bandas de aislamiento\nCrossfader, Magnético\nConversión, 32 bits\nPeso, 6,2 kg",
    box: ["MX-4", "Cable de alimentación", "Guía rápida"],
    downloads: ["Manual (PDF, 9 MB)", "Firmware 1.2"],
  },
  {
    slug: "nano",
    name: "Nano",
    category: "Sintetizadores",
    kind: "synth",
    seed: 20,
    price: 349,
    tagline: "Un sintetizador que cabe en la funda del portátil.",
    body: "Monofónico, con un oscilador analógico, filtro multimodo y secuenciador de 16 pasos. Funciona con pilas y tiene altavoz integrado para probar ideas en cualquier sitio.",
    highlights: "icon:battery-full|Funciona con pilas|Ocho horas con cuatro AA o por USB-C.\nicon:volume|Altavoz integrado|Para bocetar sin cables.\nicon:link|Sincronía|Se sincroniza con Pulse 16 y con cualquier equipo MIDI.",
    specs: "Característica, Nano\nVoces, 1 (analógica)\nSecuenciador, 16 pasos\nAlimentación, 4 × AA o USB-C\nConexiones, MIDI TRS · Sync\nPeso, 0,6 kg",
    box: ["Nano", "Cable USB-C", "Adaptador MIDI TRS"],
    downloads: ["Manual (PDF, 3 MB)", "Firmware 1.5"],
  },
  {
    slug: "pulse-16",
    name: "Pulse 16",
    category: "Ritmos",
    kind: "drum",
    seed: 9,
    price: 649,
    tagline: "Caja de ritmos híbrida con 16 pads.",
    body: "Once instrumentos analógicos y cuatro pistas de muestras, con un secuenciador por paso que invita a tocar: probabilidad, redobles, bloqueo de parámetros y cambio de patrón sin cortes.",
    highlights: "icon:music|11 instrumentos analógicos|Bombo, caja, palmas y platos con su propio circuito.\nicon:folder|Muestras propias|Carga las tuyas por USB en cuatro pistas.\nicon:clock|Secuenciador por paso|Probabilidad, redobles y 128 patrones.",
    specs: "Característica, Pulse 16\nInstrumentos, 11 analógicos + 4 muestras\nPads, 16 sensibles a la velocidad\nPatrones, 128\nSalidas, Máster + 8 individuales\nPeso, 3,4 kg",
    box: ["Pulse 16", "Fuente de alimentación", "Cable USB-C", "Tarjeta con 500 muestras"],
    downloads: ["Manual (PDF, 10 MB)", "Firmware 2.0", "Pack de muestras de fábrica"],
    isNew: true,
  },
  {
    slug: "s5",
    name: "S5",
    category: "Monitores",
    kind: "monitor",
    seed: 5,
    price: 229,
    tagline: "Monitor de estudio de 5 pulgadas, precio por unidad.",
    body: "Un monitor biamplificado con cono de 5 pulgadas y tweeter de seda, con ajustes de sala para que suene plano en habitaciones pequeñas. La respuesta de graves te dice la verdad.",
    highlights: "icon:volume|Biamplificado|70 W de clase D repartidos entre graves y agudos.\nicon:settings-cog|Ajustes de sala|Compensa escritorio, pared y esquina.\nicon:target|Respuesta plana|De 45 Hz a 22 kHz, ±2 dB.",
    specs: "Característica, S5\nCono, 5 pulgadas\nPotencia, 70 W (clase D)\nRespuesta, 45 Hz – 22 kHz\nEntradas, XLR · TRS · RCA\nPeso, 5,3 kg",
    box: ["Monitor S5", "Cable de alimentación", "Almohadillas de desacople"],
    downloads: ["Manual (PDF, 4 MB)", "Guía de colocación en sala"],
  },
  {
    slug: "h1",
    name: "H1",
    category: "Auriculares",
    kind: "headphones",
    seed: 14,
    price: 179,
    tagline: "Auriculares cerrados para cabina y estudio.",
    body: "Cerrados, giratorios y con transductores de 50 mm que aguantan el volumen de una cabina sin distorsionar. Almohadillas y cable reemplazables: están hechos para durar.",
    highlights: "icon:headphone|Transductores de 50 mm|Graves firmes y agudos sin fatiga.\nicon:reload|Todo reemplazable|Almohadillas, diadema y cable, por separado.\nicon:shield|Aislamiento|Cerrados, con 28 dB de atenuación pasiva.",
    specs: "Característica, H1\nTransductores, 50 mm\nImpedancia, 32 Ω\nRespuesta, 5 Hz – 30 kHz\nCable, Espiral y recto (desmontables)\nPeso, 290 g",
    box: ["Auriculares H1", "Cable en espiral", "Cable recto", "Funda"],
    downloads: ["Manual (PDF, 2 MB)"],
  },
];

export const ARTISTS = [
  { name: "Nerea Solís", role: "DJ · techno", gear: "DX-4 Pro, MX-4", quote: "En la cabina no hay tiempo para menús. Con el MX-4 todo está donde lo busca la mano." },
  { name: "Kaito Mori", role: "Productor · house", gear: "Polar 8, Pulse 16", quote: "El Polar tiene ese punto inestable de los clásicos, pero se afina solo. Es mi primera decisión en cada tema." },
  { name: "Lía Duarte", role: "Directo · electrónica", gear: "Nano, Pulse 16", quote: "Llevo el Nano y la Pulse en una mochila y monto un directo entero en cinco minutos." },
  { name: "Óscar Beltrán", role: "Ingeniero de mezcla", gear: "S5, H1", quote: "Los S5 me dicen la verdad en una habitación pequeña, y los H1 confirman lo que oigo." },
];

export const SUPPORT_FAQ =
  "¿Cuánto dura la garantía?|Tres años en todos los productos, ampliable a cinco si registras el producto.\n¿Cómo actualizo el firmware?|Descarga la última versión desde la ficha del producto y sigue el asistente de Onda Updater; tarda menos de cinco minutos.\n¿Tenéis recambios?|Sí: platos, crossfaders, almohadillas, mandos y cables, en la tienda de recambios o a través de tu distribuidor.\n¿Dónde puedo probarlos?|En más de 200 tiendas de España y Portugal. Pregúntanos por la más cercana.";

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "productos", title: "Productos" },
  ...GEAR.map((g) => ({ path: `productos/${g.slug}`, title: g.name })),
  { path: "artistas", title: "Artistas" },
  { path: "soporte", title: "Soporte" },
];
