import type { BriefService } from "@/components/ui/BriefFlow";

/* Datos de Brasa (docs/56): capítulos, trabajos con su ficha, servicios, trayectoria y blog. Datos puros. */

export const I = "/img/inspiraciones/brasa/";

export const CAPITULOS = [
  { word: "LEGADO", label: "Tensión", image: `${I}capitulo-legado.webp`, items: ["El diseño atrae la mirada. El desarrollo le da vida."] },
  { word: "UI - UX", label: "Inmersión", image: `${I}capitulo-uiux.webp`, items: ["UI y UX", "Desarrollo web 3D", "Resolver problemas", "Investigación con usuarios"] },
  { word: "WEB 3D", label: "Impacto", image: `${I}capitulo-web3d.webp`, items: ["Ingeniería frontend", "Three.js y WebGL", "Animación con GSAP", "Optimización del rendimiento"] },
];

export type Trabajo = { id: string; titulo: string; img: string; tipo: string; ano: string; rol: string; texto: string; claves: string[] };

export const TRABAJOS: Trabajo[] = [
  { id: "codice", titulo: "Códice", img: `${I}proyecto-codice.webp`, tipo: "Web 3D", ano: "2026", rol: "Diseño y desarrollo", texto: "Un archivo de manuscritos antiguos que se hojea en 3D: cada página pesa y cruje.", claves: ["Libro en Three.js con física de papel", "Lectura accesible en texto plano", "60 fps en móviles de gama media"] },
  { id: "norte-capital", titulo: "Norte Capital", img: `${I}proyecto-norte.webp`, tipo: "UI / UX", ano: "2025", rol: "Investigación, UX y UI", texto: "El panel de inversión de una gestora joven: menos gráficos, más decisiones.", claves: ["Doce entrevistas con clientes", "Sistema de diseño de 40 componentes", "Tiempo de tarea −35 %"] },
  { id: "amarra", titulo: "Amarra", img: `${I}proyecto-amarra.webp`, tipo: "Web 3D", ano: "2025", rol: "Dirección creativa y desarrollo", texto: "Una marca de cuerdas náuticas presentada como un nudo que se hace y deshace con el scroll.", claves: ["Nudos animados con curvas", "Tienda integrada", "Premio del mes en una web de diseño"] },
  { id: "charla", titulo: "Charla", img: `${I}proyecto-charla.webp`, tipo: "UI / UX", ano: "2024", rol: "Diseño de producto", texto: "Una app de mensajería clara y luminosa, pensada para conversar sin esfuerzo.", claves: ["Modo de lectura sin distracciones", "Accesible con lector de pantalla", "Prototipo probado con 30 personas"] },
];

export const SERVICIOS = [
  { id: "ui-ux", t: "UI y UX", d: "Investigación, arquitectura y diseño de interfaz para productos que se entienden a la primera.", desde: 4000 },
  { id: "web-3d", t: "Web 3D", d: "Webs inmersivas con Three.js y WebGL que se cargan rápido y funcionan en el móvil.", desde: 9000 },
  { id: "animacion", t: "Animación e interacción", d: "Movimiento con intención: transiciones, scroll y microinteracciones con GSAP.", desde: 2500 },
  { id: "rendimiento", t: "Rendimiento", d: "Auditoría y optimización de webs pesadas: menos megas, más fotogramas.", desde: 1500 },
];

export const PETICIONES: BriefService[] = SERVICIOS.map((s) => ({ label: s.t, hint: s.d }));

export const TRAYECTORIA = [
  { a: "2026", t: "Estudio propio", d: "Brasa trabaja con marcas y agencias de cinco países." },
  { a: "2023", t: "Dirección creativa", d: "Tres años liderando el equipo de interacción de una agencia de Madrid." },
  { a: "2020", t: "Del diseño al código", d: "Aprendo Three.js para que los diseños se muevan como los imaginaba." },
  { a: "2017", t: "Primer encargo", d: "Una web para una banda de mi barrio. Sigue publicada." },
];

export const BLOG = [
  { id: "caida", t: "La caída siempre fue parte del camino", f: "02.10.2026", texto: "Lo que aprendí de los proyectos que salieron mal, y por qué los enseño también." },
  { id: "rendimiento-3d", t: "3D que no derrite el móvil", f: "18.09.2026", texto: "Cinco trucos para que una escena WebGL vaya fluida en un teléfono de hace cuatro años." },
  { id: "silencio", t: "El valor del silencio en una web", f: "30.08.2026", texto: "Cuándo quitar animación es la mejor animación." },
];

export const PAGINAS = [
  { path: "trabajos", titulo: "Trabajos" },
  ...TRABAJOS.map((t) => ({ path: `trabajos/${t.id}`, titulo: t.titulo })),
  { path: "servicios", titulo: "Servicios" },
  { path: "sobre-mi", titulo: "Sobre mí" },
  { path: "blog", titulo: "Blog" },
  { path: "contacto", titulo: "Contacto" },
];
