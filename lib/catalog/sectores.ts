/*
 * Recetas por sector (docs/50 E11): para montar la web de un negocio con el kit. Cada receta une la guía de estilo de su
 * familia (`STYLE_GUIDES`, docs/16 §5.1b), el orden de secciones que se repite en las webs estudiadas (docs/50 §3), las
 * piezas que lo cubren, la llamada fija, lo que no hay que olvidar (lo que faltaba en las réplicas al medirlas, docs/53
 * §4b) y dónde verlo hecho: inspiraciones en /inspiraciones/<slug> y webs completas en /sitios. `npm run catalog` lo
 * escribe en CATALOG.md y comprueba que cada pieza exista en el catálogo y cada guía en STYLE_GUIDES.
 */

export type RecetaSector = {
  id: string;
  sector: string;
  /** id de la guía de estilo (lib/ui/guides.ts) */
  guia: string;
  /** cuándo usar esta receta y no otra */
  cuando: string;
  /** secciones en orden: [qué es, piezas del kit que lo montan] */
  secciones: [string, string[]][];
  /** la llamada a la acción que va siempre a la vista */
  llamada: string;
  /** lo que se olvida al replicar de memoria y el par delató */
  noOlvidar: string[];
  /** inspiraciones (slug de /inspiraciones) y webs completas (/sitios/<slug>) */
  replicas: string[];
  webs: string[];
};

export const RECETAS_SECTOR: RecetaSector[] = [
  {
    id: "salon",
    sector: "Peluquería y color, estética",
    guia: "salon",
    cuando: "Un salón que vende oficio y calma: el equipo y los trabajos son el producto.",
    secciones: [
      ["cabecera con la navegación que se subraya", ["NavBar"]],
      ["portada: titular fino y mosaico o collage de trabajos", ["ShapeMosaic", "ImageReveal"]],
      ["manifiesto corto", ["SectionHeader"]],
      ["carta de servicios en paquetes con lo que incluyen y el precio", ["MenuList", "PricingSection"]],
      ["equipo en filas: la fila entera lleva a reservar con esa persona", ["TeamSection"]],
      ["trabajos y antes y después", ["ImageGallery", "BeforeAfter"]],
      ["reseñas con nota", ["TestimonialSection"]],
      ["horario y locales", ["OpeningHours"]],
      ["noticias o tienda", ["ArticlesSection", "ProductCard"]],
      ["pie", ["Footer"]],
    ],
    llamada: "Reservar (una píldora por local si hay varios), fija abajo con ActionBar",
    noOlvidar: ["texto grande y ligero (24 px en Il Colorista), no 14", "consulta inicial gratis si luego reservas", "las palabras de fondo de cada sección (SectionHeader backdrop)"],
    replicas: ["matiz", "nura", "melena"],
    webs: ["hebra"],
  },
  {
    id: "barberia",
    sector: "Barbería, oficio con carácter",
    guia: "barberia",
    cuando: "Un local con personalidad de barrio o de cadena: letrero, cinta que corre y el equipo como familia.",
    secciones: [
      ["portada partida: servicios en condensada gigante sobre la foto del local", ["Hero"]],
      ["cinta de texto que corre", ["Marquee"]],
      ["palabras gigantes que suben al entrar: «Locales», «Clientes»", ["Reveal"]],
      ["locales en tarjetas de retrato con su horario", ["OpeningHours"]],
      ["el equipo en óvalos B/N con reserva por barbero", ["TeamSection"]],
      ["carta en la pared, sin suscripciones", ["PricingSection"]],
      ["reseñas", ["TestimonialSection"]],
      ["la app con su QR", ["DeviceMockup", "QRCode"]],
      ["final en negro: preguntas en dos columnas y reserva", ["FAQSection", "CTASection"]],
    ],
    llamada: "Reservar o descargar la app, arriba a la derecha (se rellena al pasar)",
    noOlvidar: ["el final en negro con preguntas y reserva: es donde cierran la venta", "la gótica condensada es ligera (400), no Anton", "botones en óvalo de contorno"],
    replicas: ["cita", "patron", "raiz"],
    webs: ["esparta"],
  },
  {
    id: "club",
    sector: "Gimnasio, artes marciales, entrenador personal",
    guia: "club",
    cuando: "Un club que vende energía y comunidad; la llamada es la clase de prueba gratis, no «reservar».",
    secciones: [
      ["portada: lema en condensada gigante y foto o vídeo B/N", ["Hero"]],
      ["cintas blancas finas entre secciones", ["Marquee"]],
      ["disciplinas: tarjetas de retrato con el nombre encima o lista de nombres gigantes", ["ImageGallery", "ProjectList"]],
      ["titulares que cruzan la pantalla con la sección fijada", ["PinnedSection"]],
      ["cinta de cifras", ["Marquee", "StatsSection"]],
      ["horario de clases con plazas y lista de espera", ["ClassSchedule"]],
      ["planes con mes/año", ["PricingSection"]],
      ["equipo", ["TeamSection"]],
      ["preguntas, contacto y mapa", ["FAQSection", "ContactForm", "OpeningHours"]],
      ["pie con lema", ["Footer"]],
    ],
    llamada: "Clase de prueba gratis, fija y con el texto que rueda (RollLink)",
    noOlvidar: ["la web entera es larga (11–26 pantallas): tarifas, preguntas, muro de fotos, contacto", "Antonio 700 a −6 %, no Anton", "bandas de foto B/N a sangre entre secciones", "scroll suavizado (SmoothScroll) como Essor"],
    replicas: ["vive", "talla", "lobo", "impulso"],
    webs: ["forja"],
  },
  {
    id: "boutique",
    sector: "Pilates, yoga, estudio privado",
    guia: "boutique",
    cuando: "Un estudio pequeño y cuidado, con reserva y cuenta de cliente.",
    secciones: [
      ["portada con foto a sangre y titular en serifa con media frase en cursiva", ["Hero"]],
      ["acordeón de aparatos o clases que cambia la foto fija de al lado", ["FeatureExplorer"]],
      ["sesiones privadas en tres tarjetas", ["PricingSection"]],
      ["horario y reserva", ["ClassSchedule"]],
      ["pie", ["Footer"]],
    ],
    llamada: "Reservar clase (entrar con la cuenta), con subrayado que crece",
    noOlvidar: ["scroll suavizado (SmoothScroll)", "texto a 18 px con algo de tracking positivo"],
    replicas: ["nucleo"],
    webs: ["cadencia"],
  },
  {
    id: "escuela",
    sector: "Academia, escuela, formación profesional",
    guia: "escuela",
    cuando: "Programas por convocatoria con prueba social; tres páginas: portada, catálogo con filtros y ficha de programa.",
    secciones: [
      ["portada con la promesa y la próxima convocatoria", ["Hero"]],
      ["sellos de valoración y cifras en recuadros", ["LogoCloud", "StatsSection"]],
      ["programas por convocatoria con estado y fechas", ["CohortList"]],
      ["método en tres o cuatro principios", ["FeatureGrid"]],
      ["profesorado en muro", ["TeamSection"]],
      ["testimonios en vídeo o retrato B/N", ["TestimonialSection"]],
      ["masterclass gratis antes de cada curso", ["CTASection"]],
      ["logos de empresas y boletín", ["LogoCloud", "ContactForm"]],
      ["ficha de programa: temario y solicitud por pasos", ["Accordion", "Stepper"]],
    ],
    llamada: "Inscríbete / solicita plaza en la próxima convocatoria",
    noOlvidar: ["el final: presencia en eventos, «sé mentor», el lema y el pie con mapa", "la letra va siempre apretada (−2 a −8 %)", "sombra dura desplazada en los botones"],
    replicas: ["ahora", "oficio"],
    webs: [],
  },
  {
    id: "autor",
    sector: "Academia de autor, coaching, viajes guiados",
    guia: "autor",
    cuando: "La marca es una persona y su comunidad: su retrato fijo, su voz y sus convocatorias.",
    secciones: [
      ["portada en minúsculas con un dibujo de línea", ["LineDraw"]],
      ["viajes o cursos por convocatoria", ["CohortList"]],
      ["sobre mí y los principios del método", ["FeatureGrid"]],
      ["cifras de la comunidad", ["StatsSection"]],
      ["primera clase regalada", ["CTASection"]],
      ["opiniones", ["TestimonialSection"]],
      ["vlogs y fotos de grupo", ["ArticlesSection", "ImageGallery"]],
      ["preguntas y contacto", ["FAQSection", "ContactForm"]],
    ],
    llamada: "Escríbeme (chat flotante) y la primera clase gratis",
    noOlvidar: ["la segunda mitad personal: vlogs, comunidad, preguntas, contacto", "el retrato fijo no debe tapar el contenido en móvil", "SmoothScroll"],
    replicas: ["remada"],
    webs: [],
  },
  {
    id: "marca",
    sector: "Producto de consumo de marca",
    guia: "marca",
    cuando: "Un solo producto vendido con origen, maridajes y tono; la compra va fuera.",
    secciones: [
      ["el producto fijo en el centro mientras pasa la página", ["ObjectStage"]],
      ["cinta de compra fija", ["Marquee"]],
      ["tarjetas con marco de etiqueta: historia, sello y picor", ["SectionHeader"]],
      ["origen en un marco ancho con cinta", ["Marquee"]],
      ["maridajes y lo que no, en palabras gigantes con ilustración", ["FitText"]],
      ["compra", ["CTASection"]],
    ],
    llamada: "Comprar, en la cinta fija de arriba",
    noOlvidar: ["dos tintas y nada más: el color lo pone el producto", "texto de cartel a 36 px (2,5 vw) en las tarjetas", "las dos letras son estrechas"],
    replicas: ["abuela-rosa"],
    webs: [],
  },
  {
    id: "agencia",
    sector: "Agencia creativa, estudio, portfolio",
    guia: "club",
    cuando: "La navegación es la firma: portada de una pantalla, menú y transición propios.",
    secciones: [
      ["portada sin scroll con reel de vídeo y un vídeo dentro del titular", ["VideoPlayer"]],
      ["menú a pantalla completa en escalera con filas que giran a marquesina", ["FullscreenMenu"]],
      ["transición entre páginas en escalera", ["PageTransition"]],
      ["hora local", ["LocalTime"]],
      ["trabajo en rejilla con la barra del proyecto en vista", ["ProjectList", "ImageGallery"]],
    ],
    llamada: "Las dos píldoras gigantes (trabajo, agencia)",
    noOlvidar: ["el titular es ligero (300), no medio", "el botón de menú se rellena al pasar (triggerHover=\"fill\")"],
    replicas: ["q47"],
    webs: [],
  },
];
