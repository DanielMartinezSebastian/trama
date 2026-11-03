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
  /** Selección acotada de conocimiento; no convierte la receta en una plantilla distribuida. */
  pilot?: {
    components: string[];
    examples: string[];
    flow: string;
    pages: { path: string; purpose: string; states: string[] }[];
    integrations: { capability: string; status: "local" | "pending"; note: string }[];
    limitations: string[];
    assets: { status: "pending"; note: string }[];
  };
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
    pilot: {
      components: ["ActionBar", "GuideFrame", "BookingFlow", "AppointmentList"],
      examples: ["scripts/fixtures/agents/salon-style.tsx.txt", "scripts/fixtures/agents/salon-booking.tsx.txt", "scripts/fixtures/agents/salon-fonts.tsx.txt"],
      flow: "F6: encargo sin referencias; elegir servicio y profesional, reservar y consultar/cambiar/anular una cita local.",
      pages: [
        { path: "/", purpose: "Presentación editorial de Linde y CTA a reservar; sin noticias ni tienda", states: ["escritorio", "móvil", "teclado", "movimiento reducido"] },
        { path: "/reservar", purpose: "Adaptar servicio/profesional/editar de query a props de BookingFlow", states: ["selección", "sin hueco", "datos inválidos", "confirmación local"] },
        { path: "/mis-citas", purpose: "AppointmentList con la misma clave y servicios; navegación/remonte entre rutas", states: ["carga", "vacío", "citas", "cambio", "confirmar anulación", "cambios cerrados a 24 horas"] },
      ],
      integrations: [
        { capability: "Persistencia", status: "local", note: "localStorage por origen; memoria temporal si no está disponible; sin sincronización entre instancias." },
        { capability: "Disponibilidad, agenda, identidad, correo y cobro", status: "pending", note: "No hay servicios conectados. Slots de demostración incluyen ocupación ficticia." },
      ],
      limitations: ["Los ejemplos son muestras de API; las tres páginas y su recorrido aún no están construidos ni validados.", "Las referencias Hebra y las inspiraciones no son assets ni plantillas incluidas en npm."],
      assets: [{ status: "pending", note: "Dos imágenes propias o con licencia y dimensiones/alt fijados antes del consumidor visual; no usar /img/hebra/*." }],
    },
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
  // tercera ronda (docs/58): tipos de web que no estaban
  { id: "suscripcion", sector: "Club de suscripción, caja mensual", guia: "manchas", cuando: "El producto llega cada mes y lo que se vende es pertenecer a algo.", secciones: [["Portada con el objeto y una llamada", ["Reveal"]], ["La selección del mes", ["Marquee"]], ["Cómo funciona en cuatro pasos", ["Reveal"]], ["Planes", ["MembershipFlow"]], ["Preguntas", ["FAQSection"]]], llamada: "Hazte socia, en la cabecera y tras cada sección", noOlvidar: ["el límite de la caja lo marca el plan", "la fecha tope para cambiar o pausar", "regalar es otra compra, con su carrito"], replicas: ["polilla"], webs: [] },
  { id: "catalogo-cultural", sector: "Distribuidora, sello o catálogo cultural", guia: "filmoteca", cuando: "El catálogo es el producto y cada título merece su ficha.", secciones: [["Catálogo que se recorre en una sola pantalla", ["SmoothScroll"]], ["Índice filtrable", ["FilterBar"]], ["Ficha técnica con críticas", ["MetaTable"]], ["Sesiones y butacas", ["SeatMap"]]], llamada: "Entradas, en cada ficha que esté en cartel", noOlvidar: ["teclado y flechas además de la rueda", "qué pasa con lo que ya no está en salas", "devolver una entrada"], replicas: ["sesion-doble"], webs: [] },
  { id: "interiorismo", sector: "Interiorismo y estudio con tienda", guia: "goloso", cuando: "El estudio vende proyectos caros y también objetos pequeños.", secciones: [["Marca de borde a borde y foto a sangre", ["FitText", "Parallax"]], ["Quiénes somos en una frase", ["Reveal"]], ["Espacios", ["ImageGallery"]], ["Tienda", ["ProductCard", "CartDrawer"]], ["Encargo", ["BriefFlow"]]], llamada: "Hablemos, en la cabecera", noOlvidar: ["una voz propia: consultorio o columna", "pie de foto con lugar y año", "pedido aparte del encargo"], replicas: ["casa-melosa"], webs: [] },
  { id: "hardware", sector: "Robótica, hardware y tecnología física", guia: "sereno", cuando: "Hay que explicar una máquina sin parecer un folleto de defensa.", secciones: [["Vídeo a sangre con una frase", ["VideoPlayer"]], ["Qué permite ver o hacer", ["Reveal"]], ["La flota o gama", ["ProductCard"]], ["Comparador", ["Table"]], ["Misiones reales", ["ProjectList"]], ["Pedir demostración", ["BriefFlow"]]], llamada: "Pedir demostración, en cada ficha", noOlvidar: ["ficha técnica comparable", "casos con cifras", "empleo y prensa: los miran inversores"], replicas: ["marejada"], webs: [] },
  { id: "promocion", sector: "Promoción residencial e inmobiliaria", guia: "burdeos", cuando: "Se vende una promoción concreta, sobre plano, a compradores que comparan.", secciones: [["Entrada de marca que se abre a la foto", ["ScrollExpand"]], ["Tipologías", ["ImageGallery"]], ["Selector de viviendas", ["FilterBar"]], ["Entorno y plazos", ["Timeline"]], ["Reservar visita", ["ContactForm"]]], llamada: "Reserva una visita, con la vivienda ya elegida", noOlvidar: ["estado de cada vivienda: libre, reservada, vendida", "precio visible", "fecha de entrega"], replicas: ["alba"], webs: [] },
  { id: "juego-navegador", sector: "Videojuego de navegador", guia: "tinta", cuando: "La web es el juego: se entra y se juega sin instalar.", secciones: [["Pantalla de título jugable", ["ExplorableCanvas"]], ["Cómo se juega", ["Timeline"]], ["Partida", ["Progress"]], ["Clasificación", ["Table"]]], llamada: "Jugar, sin registro", noOlvidar: ["las dos formas de acabar", "pausa", "móvil con el marcador siempre visible"], replicas: ["no-mires-abajo"], webs: [] },
  { id: "seleccion", sector: "Selección de personal y consultoría", guia: "baldosa", cuando: "Se vende criterio a dos públicos: empresas y candidatos.", secciones: [["Mosaico con la propuesta", ["CellGrid"]], ["Clientes", ["LogoCloud"]], ["Opiniones", ["TestimonialSection"]], ["Ofertas filtrables", ["FilterBar"]], ["Para empresas", ["BriefFlow"]]], llamada: "Hablemos para empresas; ofertas para candidatos", noOlvidar: ["guardar ofertas", "salario visible", "qué pasa si no hay resultados"], replicas: ["cantera"], webs: [] },
  { id: "logistica", sector: "Logística y operaciones globales", guia: "orbital", cuando: "Hay que transmitir alcance y control a clientes B2B.", secciones: [["Globo con rutas", ["PointCloud"]], ["Cifras grandes", ["StatsSection"]], ["Servicios", ["ProjectList"]], ["Seguimiento", ["TextField"]], ["Presupuesto", ["RangeSlider"]]], llamada: "Pide presupuesto y seguir un envío, juntos", noOlvidar: ["cinta de avisos de operativa", "código de ejemplo en el seguimiento", "cifra orientativa antes del formulario"], replicas: ["ultramar"], webs: [] },
  { id: "tienda-diseno", sector: "Mueble y tienda de diseño", guia: "catalogo", cuando: "Pocos productos, muy diseñados, que cambian de color.", secciones: [["Muro de producto", ["BentoGrid"]], ["Destacados con muestras", ["OptionPicker"]], ["Premios", ["Table"]], ["Tienda", ["ProductCard", "CartDrawer"]], ["Pedido", ["CheckoutFlow"]]], llamada: "Comprar, con el color elegido", noOlvidar: ["el color cambia la imagen", "medidas y peso", "devolución"], replicas: ["zanco"], webs: [] },
  { id: "musico", sector: "Música y artistas", guia: "cartel", cuando: "Un artista con discografía, gira y tienda.", secciones: [["Nombre a pantalla completa", ["FitText"]], ["Último disco", ["AudioPlayer"]], ["Trayectoria", ["Timeline"]], ["Gira", ["EventLineup"]], ["Tienda", ["CartDrawer", "CheckoutFlow"]]], llamada: "Entradas, en cada fecha", noOlvidar: ["el reproductor persiste entre páginas", "fechas agotadas", "vinilo y CD como variantes"], replicas: ["pulso-lento"], webs: [] },
  { id: "safari", sector: "Hotel de naturaleza, safari y turismo rural de lujo", guia: "sabana", cuando: "Se venden pocas camas en un lugar extraordinario y el viaje se prepara a medida.", secciones: [["Foto a sangre con titular desplazado", ["Reveal"]], ["Párrafo grande en serifa", ["Reveal"]], ["Collage de fauna que flota", ["Parallax"]], ["Alojamientos", ["ImageGallery"]], ["Planificar la estancia", ["QuantityStepper", "DatePicker"]]], llamada: "Planifica tu estancia, con presupuesto al momento", noOlvidar: ["precio por noche visible", "quién te acompaña: guías con nombre", "qué parte del dinero va a la conservación"], replicas: ["tierra-ancha"], webs: [] },
  { id: "restaurante", sector: "Restaurante, pizzería o bar de barrio", guia: "trattoria", cuando: "La gente vuelve por la comida, el precio y el ambiente; hay que reservar o pedir en dos toques.", secciones: [["Portada de color con los cuatro botones", ["Button"]], ["Platos del día en carrusel", ["Tabs"]], ["Programación de noches", ["EventLineup"]], ["Salones privados", ["BriefFlow"]], ["Pedido a domicilio", ["QuantityStepper", "CheckoutFlow"]]], llamada: "Reservar mesa y pedir online, siempre a la vista", noOlvidar: ["horario por servicio: comedor, barra, reparto", "días cerrados en la reserva", "tarjeta regalo"], replicas: ["bocado"], webs: [] },
  { id: "clinica", sector: "Clínica de medicina estética o salud privada", guia: "clinica", cuando: "Hay que transmitir rigor médico y calma, y llevar a una consulta.", secciones: [["Retrato a sangre", ["Reveal"]], ["Por qué la clínica, en cuatro pasos", ["Tabs"]], ["Preocupaciones y tratamientos", ["FilterBar"]], ["Ficha con preguntas", ["FAQSection"]], ["Reservar consulta", ["BookingFlow"]]], llamada: "Reservar consulta, con tratamiento y profesional", noOlvidar: ["recuperación y sesiones en cada ficha", "precio desde", "aviso de que no es consejo médico"], replicas: ["pausa"], webs: [] },
  { id: "arquitectura", sector: "Estudio de arquitectura o ingeniería", guia: "terracota", cuando: "Se enseña obra construida a clientes públicos y privados, por sectores.", secciones: [["Foto del estudio", ["Reveal"]], ["Sectores en paneles de color", ["BentoGrid"]], ["Proyectos filtrables", ["FilterBar", "ProjectList"]], ["Ficha de proyecto", ["Table"]], ["Contacto por oficina", ["ContactForm"]]], llamada: "Hablemos de tu proyecto, con la oficina más cercana", noOlvidar: ["cliente, superficie y año en cada proyecto", "qué pasa si un sector no tiene obra", "empleo"], replicas: ["solera"], webs: [] },
  { id: "automocion", sector: "Automoción de lujo y producto de alta gama", guia: "motor", cuando: "Se vende un objeto caro y deseado, que se configura antes de pedir precio.", secciones: [["Portada en penumbra con titular condensado", ["Reveal"]], ["Detalles dispersos", ["ImageGallery"]], ["Herencia", ["Timeline"]], ["Configurador", ["OptionPicker"]], ["Boutique", ["CartDrawer", "CheckoutFlow"]]], llamada: "Configura el tuyo y pide presupuesto", noOlvidar: ["el configurador cambia la imagen", "precio total al momento", "registro para novedades"], replicas: ["vencejo"], webs: [] },
  { id: "tarjeta", sector: "Banca privada, tarjeta o club de socios", guia: "obsidiana", cuando: "Se vende pertenencia y tranquilidad, con acceso limitado.", secciones: [["Objeto metálico en 3D", ["Reveal"]], ["Galería en profundidad", ["Parallax"]], ["Ventajas de la red", ["Tabs"]], ["Preguntas", ["FAQSection"]], ["Solicitar acceso", ["Progress"]]], llamada: "Solicitar acceso, siempre en la cabecera", noOlvidar: ["cuota anual clara", "lista de espera y plazo de revisión", "aviso legal de que no es entidad financiera si es una demo"], replicas: ["nacar"], webs: [] },
  { id: "software", sector: "Software, API e infraestructura", guia: "cinta", cuando: "El público es técnico: quiere ver rendimiento, precio y código antes de registrarse.", secciones: [["Portada oscura con titular y dos botones", ["Button"]], ["Pruebas con datos", ["Chart", "StatsSection"]], ["Código copiable", ["CodeBlock"]], ["Ejemplos por tipo", ["Tabs"]], ["Calculadora de precio", ["RangeSlider"]]], llamada: "Pruébalo gratis y habla con ingeniería", noOlvidar: ["precio por uso calculado al momento", "documentación a un clic", "seguridad y cumplimiento"], replicas: ["nimbo"], webs: [] },
  { id: "conferencia", sector: "Festival, congreso o semana cultural", guia: "foro", cuando: "Hay fechas, cartel y entradas; el programa decide la compra.", secciones: [["Fotos de escenario bajo el titular", ["Reveal"]], ["Ponentes", ["ImageGallery"]], ["Programa con agenda propia", ["Tabs", "FilterBar"]], ["Entradas", ["QuantityStepper", "CheckoutFlow"]], ["Preguntas", ["FAQSection"]]], llamada: "Consigue tu entrada, con las fechas siempre visibles", noOlvidar: ["agenda que se guarda", "sala y hora de cada sesión", "sala de prensa"], replicas: ["pleno"], webs: [] },
];
