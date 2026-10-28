import type { BriefService } from "@/components/ui/BriefFlow";

/* Datos de Q47 (docs/56): proyectos con su caso, agencia, blog y lo que se puede pedir. Datos puros. */

const I = "/img/inspiraciones/q47/";
export const V = "/video/";
export const REEL = [`${V}ciudad/02-avenida-noche`, `${V}costa/01-olas-islandia`, `${V}oceano/03-delfines-hawai`, `${V}ciudad/03-budapest`, `${V}costa/03-playa-tunez`, `${V}ciudad/01-rascacielos-noche`];

export type Proyecto = { id: string; cliente: string; titulo: string; ano: string; img: string; sector: string; servicios: string[]; reto: string; idea: string; resultado: string; cifras: [string, string][] };

export const PROYECTOS: Proyecto[] = [
  { id: "banco-atlantico", cliente: "Banco Atlántico", titulo: "Adelántate", ano: "2025", img: `${I}trabajo-banco.webp`, sector: "Banca", servicios: ["Estrategia", "Campaña", "Digital"], reto: "Un banco de toda la vida que los menores de 35 ni miraban.", idea: "Dejar de hablar de dinero y hablar de tiempo: lo que te ahorras cuando el banco se adelanta a ti.", resultado: "La campaña más recordada del sector ese año y una app que dejó de ser la peor valorada.", cifras: [["+38 %", "altas de menores de 35"], ["4,6", "valoración de la app"]] },
  { id: "lana-norte", cliente: "Lana Norte", titulo: "Tejido en casa", ano: "2024", img: `${I}trabajo-lana.webp`, sector: "Consumo", servicios: ["Identidad", "Contenido"], reto: "Una hilatura centenaria que quería vender directamente a quien teje.", idea: "Contar la lana desde la oveja hasta el jersey, con la gente que la hace.", resultado: "Tienda propia que en un año pasó a ser la mitad de la facturación.", cifras: [["50 %", "ventas en la tienda propia"], ["120 k", "seguidores nuevos"]] },
  { id: "quesos-ribera", cliente: "Quesos Ribera", titulo: "Abre el envoltorio", ano: "2024", img: `${I}trabajo-quesos.webp`, sector: "Consumo", servicios: ["Identidad", "Envase", "Campaña"], reto: "Quesos premiados escondidos en un envase que parecía de marca blanca.", idea: "Un envoltorio que se abre como un regalo, con la historia del queso dentro.", resultado: "Entrada en tres cadenas nacionales y el envase en dos premios de diseño.", cifras: [["3", "cadenas nuevas"], ["+64 %", "ventas en lineal"]] },
  { id: "club-hockey", cliente: "Club de hockey", titulo: "Aquí, por los nuestros", ano: "2023", img: `${I}trabajo-hockey.webp`, sector: "Deporte", servicios: ["Estrategia", "Campaña"], reto: "Llenar un pabellón en una ciudad donde el hockey es casi un secreto.", idea: "Convertir a la afición en el anuncio: caras del barrio, no estrellas.", resultado: "Abonos agotados por primera vez en doce temporadas.", cifras: [["100 %", "abonos vendidos"], ["x3", "público medio"]] },
  { id: "widescape", cliente: "Widescape", titulo: "Paisajes anchos", ano: "2022", img: `${I}trabajo-paisajes.webp`, sector: "Tecnología", servicios: ["Identidad", "Digital"], reto: "Una app de mapas para senderistas con un nombre que nadie recordaba.", idea: "Una identidad que se estira como el horizonte: el logo cambia de ancho con el paisaje.", resultado: "Un millón de descargas el primer año.", cifras: [["1 M", "descargas"], ["4,8", "valoración"]] },
  { id: "la-ventana", cliente: "Navidad Q47", titulo: "La ventana", ano: "2022", img: `${I}trabajo-ventana.webp`, sector: "Marca propia", servicios: ["Contenido"], reto: "Felicitar la Navidad sin hacer otra tarjeta.", idea: "Una ventana en la web que se abría cada noche de diciembre a una calle distinta de Madrid.", resultado: "Nuestra felicitación más compartida y dos clientes nuevos que llegaron por ella.", cifras: [["31", "noches"], ["2", "clientes nuevos"]] },
];

export const SECTORES = [...new Set(PROYECTOS.map((p) => p.sector))];

export const SERVICIOS = [
  { n: "Estrategia", d: "Dónde está la marca, a dónde va y qué tiene que decir para llegar." },
  { n: "Identidad", d: "Nombre, logo, tipografía, tono y el sistema que lo sostiene todo." },
  { n: "Campaña", d: "Ideas que se ven en la calle, en la tele y en el móvil." },
  { n: "Digital", d: "Webs, apps y producto: la marca cuando se usa." },
  { n: "Contenido", d: "Lo que la marca cuenta cada semana, sin aburrir." },
];

export const PETICIONES: BriefService[] = SERVICIOS.map((s) => ({ label: s.n, hint: s.d }));

export const BLOG = [
  { id: "roce", img: `${I}blog-roce.webp`, t: "La chispa sale del roce", f: "14.10.2026", texto: "Por qué las mejores ideas salen de juntar a gente que no está de acuerdo, y cómo lo hacemos sin que acabe en bronca.", cuerpo: ["Cada proyecto empieza con dos equipos que no piensan igual: estrategia y creatividad, cliente y agencia, gente joven y gente que lleva veinte años.", "El roce no es una pelea. Es la fricción justa para que la idea se caliente: si todos asienten en la primera reunión, todavía no hemos llegado.", "Nuestra regla: la crítica va a la idea, nunca a la persona, y nadie sale de la sala sin un siguiente paso."] },
  { id: "marcas-lentas", img: `${I}blog-marcas-lentas.webp`, t: "Las marcas lentas ganan", f: "29.09.2026", texto: "Lo que aprendimos de los clientes que llevan diez años con nosotros.", cuerpo: ["Una marca no se construye en una campaña. Se construye en cien decisiones pequeñas que van en la misma dirección.", "Los clientes que mejor les va son los que repiten lo que funciona y cambian solo lo que no."] },
  { id: "brief", img: `${I}blog-brief.webp`, t: "El brief que nos gusta recibir", f: "08.09.2026", texto: "Cinco preguntas que ahorran semanas. Y por qué el presupuesto no es tabú.", cuerpo: ["¿Qué tiene que pasar para que esto sea un éxito? ¿A quién queremos mover? ¿Qué no se puede tocar? ¿Para cuándo? ¿Con cuánto?", "Con esas cinco respuestas, la primera propuesta llega en una semana y no en un mes."] },
];

export const PAGINAS = [
  { path: "trabajo", titulo: "Trabajo" },
  ...PROYECTOS.map((p) => ({ path: `trabajo/${p.id}`, titulo: `${p.cliente}: ${p.titulo}` })),
  { path: "agencia", titulo: "Agencia" },
  { path: "contacto", titulo: "Contacto" },
  { path: "blog", titulo: "Blog" },
  ...BLOG.map((b) => ({ path: `blog/${b.id}`, titulo: b.t })),
];
