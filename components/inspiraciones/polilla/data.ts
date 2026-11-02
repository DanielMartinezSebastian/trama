import type { MembershipPlanOption } from "@/components/ui/MembershipFlow";

/* Datos de Polilla (docs/58): libros inventados con su portada de color, planes del club y preguntas. Datos puros. */

export type Libro = { id: string; titulo: string; autora: string; genero: string; paginas: number; lomo: string; tapa: string; tinta: string; blurb: string; gancho: string; librera: string };

export const LIBROS: Libro[] = [
  { id: "la-casa-de-sal", titulo: "La casa de sal", autora: "Irene Maroto", genero: "Novela histórica", paginas: 412, lomo: "#d9649f", tapa: "#0b3487", tinta: "#fff2c9", blurb: "Tres generaciones de salineras guardan el mismo secreto en una casa que el mar se come cada año un poco.", gancho: "Si te gustan las sagas donde las abuelas mandan.", librera: "Lo leí en dos tardes y luego llamé a mi madre." },
  { id: "monstruos-de-provincias", titulo: "Monstruos de provincias", autora: "Dani Oliver", genero: "Terror", paginas: 288, lomo: "#b5121b", tapa: "#190b14", tinta: "#ff5a3c", blurb: "Un pueblo de Teruel con 41 vecinos y ninguno quiere hablar de lo que pasa en la presa.", gancho: "Para leer con la luz encendida.", librera: "El capítulo del bingo no se me va de la cabeza." },
  { id: "dientes-de-leche", titulo: "Dientes de leche", autora: "Sofía Rey", genero: "Fantasía", paginas: 530, lomo: "#00918f", tapa: "#7ee2d6", tinta: "#10302e", blurb: "Una niña descubre que el ratón Pérez lleva siglos construyendo un ejército. Ella es su contable.", gancho: "Fantasía con mucho humor y poca piedad.", librera: "Por fin una elegida que sabe hacer cuentas." },
  { id: "amor-en-la-prorroga", titulo: "Amor en la prórroga", autora: "Ana Cordero", genero: "Romántica", paginas: 340, lomo: "#ff3d9a", tapa: "#ffd1e6", tinta: "#8d0048", blurb: "Una árbitra y el entrenador al que expulsó tienen que compartir piso durante toda la liga.", gancho: "Enemigos, un solo baño y un penalti.", librera: "Me reí en el metro y no me arrepiento." },
  { id: "manual-para-desaparecer", titulo: "Manual para desaparecer", autora: "Lucía Beltrán", genero: "Suspense", paginas: 298, lomo: "#3a2a8c", tapa: "#a78bff", tinta: "#190f4f", blurb: "Una gestora de Cuenca finge su muerte con hoja de cálculo. Le sale casi perfecto.", gancho: "La protagonista más organizada del crimen.", librera: "Tiene el mejor giro de la temporada." },
  { id: "el-ano-de-las-higueras", titulo: "El año de las higueras", autora: "Marta Sampedro", genero: "Literaria", paginas: 224, lomo: "#6e7c1e", tapa: "#d9e27a", tinta: "#2c3208", blurb: "Una hija vuelve al huerto de su padre para venderlo y se queda a podar.", gancho: "Corta, tierna y con mucha tierra en las uñas.", librera: "Es de esos libros que subrayas a lápiz." },
  { id: "la-ultima-estacion", titulo: "La última estación", autora: "Noa Ibáñez", genero: "Ciencia ficción", paginas: 460, lomo: "#ff7a1a", tapa: "#14213d", tinta: "#ffc24d", blurb: "Quedan seis personas en órbita, una sola nave y un sindicato recién fundado.", gancho: "Huelga en gravedad cero.", librera: "Nunca pensé que lloraría por una asamblea." },
  { id: "tres-bodas-y-un-robo", titulo: "Tres bodas y un robo", autora: "Paula Vera", genero: "Romántica", paginas: 316, lomo: "#ffb300", tapa: "#fff3b0", tinta: "#7a3b00", blurb: "Una organizadora de bodas descubre que todas sus clientas son la misma estafadora.", gancho: "Comedia con vestido y furgoneta de huida.", librera: "El libro más divertido del año." },
];

export const GENEROS = [...new Set(LIBROS.map((l) => l.genero))];

export const PASOS = [
  { n: "Paso 1", t: "Mira los libros", d: "Cada mes, ocho novedades elegidas por nuestras libreras.", c: "#a4f6f8" },
  { n: "Paso 2", t: "Llena tu caja", d: "Hasta tres libros. Cambia de idea hasta el día 20.", c: "#fd48f2" },
  { n: "Paso 3", t: "Ábrela en casa", d: "Llega el día 1, con marcapáginas y algo dulce.", c: "#ffd24a" },
  { n: "Paso 4", t: "Cuéntalo", d: "Una tertulia al mes, en línea, sin deberes.", c: "#b7a6ff" },
];

export const PLANES: MembershipPlanOption[] = [
  { id: "uno", name: "Un libro", price: 17, period: "/mes", features: ["1 libro al mes", "Tertulia mensual", "Pausa cuando quieras"] },
  { id: "dos", name: "Dos libros", price: 29, period: "/mes", features: ["2 libros al mes", "Tertulia mensual", "Marcapáginas de edición limitada"] },
  { id: "tres", name: "Tres libros", price: 39, period: "/mes", features: ["3 libros al mes", "Tertulia mensual", "Envío gratis a un regalo"] },
];

export const VOCES = [
  { q: "Me ha devuelto las ganas de leer antes de dormir.", a: "Carmen, socia desde 2024" },
  { q: "Mi grupo de amigas ya solo habla de lo que llega en la caja.", a: "Nerea, Bilbao" },
  { q: "Nunca habría comprado la mitad de estos libros. Y son los mejores.", a: "Javi, Málaga" },
];

export const FAQ = [
  "¿Cuándo llega mi caja?|Sale de nuestro almacén el día 25 y llega en torno al día 1 del mes siguiente.",
  "¿Puedo saltarme un mes?|Sí. Antes del día 20 puedes pausar sin coste, tantas veces como quieras.",
  "¿Y si un libro no me gusta?|Lo cambias por otro de la selección antes de abrirlo. Una vez leído, déjalo a alguien.",
  "¿Tengo que ir a las tertulias?|No. Son opcionales, en línea, y no pasamos lista.",
  "¿Enviáis a Canarias?|Sí, a toda España. A Canarias, Ceuta y Melilla puede tardar cuatro días más.",
  "¿Puedo regalar una suscripción?|Sí, de tres, seis o doce meses, en la página de regalar.",
].join("\n");

export const REGALOS = [
  { id: "regalo-3", titulo: "Tres meses de libros", precio: 54, nota: "Un libro al mes, tres cajas.", c: "#a4f6f8" },
  { id: "regalo-6", titulo: "Seis meses de libros", precio: 99, nota: "Un libro al mes, seis cajas.", c: "#ffdbfd" },
  { id: "regalo-12", titulo: "Un año de libros", precio: 180, nota: "Doce cajas y una tertulia con autora.", c: "#faed8f" },
];

export const PAGINAS = [
  { path: "libros", titulo: "Libros" },
  ...LIBROS.map((l) => ({ path: `libros/${l.id}`, titulo: l.titulo })),
  { path: "caja", titulo: "Tu caja" },
  { path: "socia", titulo: "Hazte socia" },
  { path: "regalar", titulo: "Regalar" },
  { path: "pedido", titulo: "Pedido" },
  { path: "preguntas", titulo: "Preguntas" },
];
