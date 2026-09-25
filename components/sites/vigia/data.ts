/** Vigía — servicios de videovigilancia y seguridad. Datos puros (sin React). */
import type { CamKind } from "@/lib/sites/art";

export const SLUG = "vigia";
const H = (p = "") => `/sitios/${SLUG}${p ? `/${p}` : ""}`;

export const meta = {
  slug: SLUG,
  name: "Vigía",
  title: "Vigía · videovigilancia",
  blurb: "Empresa de seguridad con chatbot en todas las páginas: servicios con ficha propia, planes mensual/anual que llevan al presupuesto, formulario de presupuesto en cuatro pasos con estimación y contacto.",
  accent: "#38bdf8",
  tag: "servicios · chatbot",
};

export type Service = { slug: string; name: string; short: string; art: CamKind; seed: number; body: string; features: string[]; specs: string; faq: string };

export const SERVICES: Service[] = [
  {
    slug: "videovigilancia",
    name: "Videovigilancia CCTV",
    short: "Cámaras IP 4K de interior y exterior, con visión nocturna y grabación en la nube.",
    art: "bullet",
    seed: 2,
    body: "Instalamos cámaras IP de 4K con visión nocturna hasta 30 metros y detección de personas y vehículos por IA, para que solo recibas avisos de lo que importa. Las grabaciones se guardan cifradas en la nube y en un grabador local, así no dependes de la conexión.",
    features: ["Detección de personas y vehículos (sin falsas alarmas por árboles o gatos)", "Grabación cifrada en la nube y en local", "Acceso en directo desde la app", "Zonas privadas enmascaradas para cumplir el RGPD"],
    specs: "Característica, Valor\nResolución, 4K (8 MP)\nVisión nocturna, 30 m\nProtección, IP67\nGrabación, 30 días en la nube",
    faq: "¿Puedo ver las cámaras desde el móvil?|Sí, en directo y las grabaciones, desde la app de Vigía para iOS y Android.\n¿Qué pasa si se va la conexión?|El grabador local sigue grabando y sube lo pendiente cuando vuelve la conexión.\n¿Necesito un cartel?|Sí: la ley obliga a señalizar la zona videovigilada. Te lo instalamos nosotros.",
  },
  {
    slug: "alarmas",
    name: "Alarmas conectadas",
    short: "Detectores, sirena y teclado conectados a nuestra central las 24 horas.",
    art: "alarm",
    seed: 5,
    body: "Una alarma inalámbrica con detectores de movimiento, apertura de puertas y ventanas, sirena de 110 dB y batería de respaldo. Si salta, nuestra central verifica con imagen en menos de un minuto y avisa a la policía solo si hace falta.",
    features: ["Detectores inmunes a mascotas de hasta 35 kg", "Verificación por imagen antes de avisar a la policía", "Batería de respaldo de 24 horas", "Armado y desarmado desde la app"],
    specs: "Característica, Valor\nSirena, 110 dB\nBatería de respaldo, 24 h\nComunicación, 4G + wifi\nInmunidad a mascotas, hasta 35 kg",
    faq: "¿Tengo mascotas, saltará sola?|No: los detectores ignoran animales de hasta 35 kg.\n¿Funciona sin wifi?|Sí, lleva una tarjeta 4G propia como respaldo.\n¿Qué pasa si salta?|La central verifica con imagen y te llama; si hay intrusión real, avisa a la policía.",
  },
  {
    slug: "control-de-accesos",
    name: "Control de accesos",
    short: "Tarjetas, códigos y apertura desde el móvil para oficinas, naves y comunidades.",
    art: "access",
    seed: 8,
    body: "Sustituye las llaves por tarjetas, códigos o el propio móvil. Das y quitas permisos al momento, por horario y por puerta, y sabes quién ha entrado y cuándo. Ideal para oficinas, naves, gimnasios y comunidades de vecinos.",
    features: ["Permisos por persona, puerta y horario", "Registro de entradas y salidas", "Apertura desde el móvil y códigos temporales", "Integración con la alarma: se desarma al entrar"],
    specs: "Característica, Valor\nCredenciales, Tarjeta, código y móvil\nUsuarios, Ilimitados\nRegistro, 12 meses\nIntegración, Alarma y CCTV",
    faq: "¿Puedo dar acceso temporal?|Sí: códigos que caducan en la fecha y hora que elijas, ideales para proveedores o pisos turísticos.\n¿Y si pierdo una tarjeta?|La anulas desde la app en un segundo.",
  },
  {
    slug: "central-24h",
    name: "Central receptora 24 h",
    short: "Operadores que vigilan tus alarmas y cámaras día y noche.",
    art: "monitor",
    seed: 11,
    body: "Nuestra central receptora, homologada por el Ministerio del Interior, recibe las señales de tus alarmas y cámaras y actúa en menos de un minuto: verifica, te llama, avisa a la policía o envía un vigilante.",
    features: ["Tiempo medio de respuesta de 38 segundos", "Verificación por imagen y audio", "Aviso a policía y servicios de emergencia", "Servicio de acuda con vigilante"],
    specs: "Característica, Valor\nDisponibilidad, 24 h · 365 días\nTiempo de respuesta, 38 s de media\nHomologación, Ministerio del Interior\nAcuda, Opcional",
    faq: "¿Quién vigila mis cámaras?|Operadores de nuestra central en Madrid, con formación homologada. Solo ven imágenes cuando salta una alarma.\n¿Qué es el servicio de acuda?|Un vigilante que va a tu local si la alarma salta y no te localizamos.",
  },
];

export const PLANS =
  "Hogar|29 €|/ mes|no|Alarma con 3 detectores;2 cámaras interiores;Central 24 h;App móvil;-Control de accesos|Para pisos y casas|290 €\n" +
  "Negocio|59 €|/ mes|si|Alarma con 6 detectores;4 cámaras 4K;Central 24 h con verificación;Control de accesos básico;Servicio de acuda|Para comercios y oficinas|590 €\n" +
  "Empresa|A medida|/ mes|no|Cámaras y detectores sin límite;Control de accesos completo;Vigilante de acuda prioritario;Gestor de cuenta|Naves, industria y comunidades";

export const CHAT_RULES = [
  `precio, precios, cuota, cuesta, cuanto, tarifa, mensual => El plan **Hogar** cuesta **29 €/mes** y el **Negocio**, **59 €/mes**. Ambos incluyen la instalación. Los tienes en [Planes](${H("planes")}). || Pedir presupuesto, ¿Hay permanencia?`,
  `presupuesto, estudio, visita, oferta => El estudio de seguridad es **gratis** y sin compromiso. Pídelo en [Presupuesto](${H("presupuesto")}): son cuatro pasos y un minuto. || Precios, ¿Cuánto tarda la instalación?`,
  `instalacion, instalar, tarda, cuando, plazo => Instalamos en **48 horas** desde que aceptas el presupuesto, en una visita de 2 a 4 horas. || Pedir presupuesto`,
  `camara, camaras, cctv, grabacion, grabar, video => Nuestras cámaras son **4K** con visión nocturna y detección de personas por IA. Más en [Videovigilancia](${H("servicios/videovigilancia")}). || ¿Dónde se guardan las grabaciones?, Precios`,
  `guardan, grabaciones, nube, dias, rgpd, privacidad, ley, cartel => Las grabaciones se guardan **cifradas 30 días** en la nube y en un grabador local. Enmascaramos zonas privadas e instalamos el cartel que exige la ley.`,
  `alarma, alarmas, sirena, detector, detectores => La alarma lleva sirena de 110 dB, detectores y batería de 24 h, conectada a la central. Más en [Alarmas](${H("servicios/alarmas")}). || Tengo mascotas, Precios`,
  `mascota, mascotas, perro, gato => Los detectores ignoran animales de hasta **35 kg**: tu perro no disparará la alarma.`,
  `permanencia, contrato, baja, cancelar => El plan mensual **no tiene permanencia**: te das de baja con un mes de aviso. El anual sale dos meses más barato.`,
  `app, movil, telefono movil, aplicacion => Con la app de Vigía (iOS y Android) ves las cámaras en directo, armas la alarma y recibes los avisos.`,
  `acceso, accesos, tarjeta, puerta, llaves => Con el [control de accesos](${H("servicios/control-de-accesos")}) das y quitas permisos por persona, puerta y horario, desde el móvil.`,
  `central, 24h, 24 horas, respuesta, policia => Nuestra central homologada responde en **38 segundos** de media, verifica con imagen y avisa a la policía si hace falta.`,
  `zona, cobertura, ciudad, donde, provincia => Trabajamos en **Madrid, Barcelona, Valencia, Sevilla y Bilbao** y sus áreas metropolitanas. Para otras zonas, pregunta en [Contacto](${H("contacto")}).`,
  `humano, persona, tecnico, comercial, llamar, hablar => Te paso con el equipo: llama al **900 100 200** (gratuito, 24 h) o escríbenos desde [Contacto](${H("contacto")}).`,
  `hola, buenas, buenos dias => ¡Hola! ¿En qué te ayudo? Puedo contarte **precios**, cómo es la **instalación** o ayudarte a pedir un **presupuesto**. || Precios, Pedir presupuesto, Hablar con una persona`,
].join("\n");

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "servicios", title: "Servicios" },
  ...SERVICES.map((s) => ({ path: `servicios/${s.slug}`, title: s.name })),
  { path: "planes", title: "Planes y precios" },
  { path: "presupuesto", title: "Pide tu presupuesto" },
  { path: "contacto", title: "Contacto" },
];
