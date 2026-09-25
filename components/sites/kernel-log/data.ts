/** Kernel Log — blog de tecnología de Ada Ríos. Datos puros (sin React): los lee también el registro de rutas. */

export const SLUG = "kernel-log";

export const meta = {
  slug: SLUG,
  name: "Kernel Log",
  title: "Kernel Log · blog de tecnología",
  blurb: "El blog de una ingeniera de plataformas: artículos largos con código, índice y barra de lectura, buscador por temas, newsletter con archivo y página personal.",
  accent: "#5eead4",
  tag: "blog · newsletter",
};

export type Post = { slug: string; topic: string; title: string; excerpt: string; date: string; glyph: string; body: string };

export const TOPICS = ["Infraestructura", "Rendimiento", "Frontend", "IA", "Carrera"];

export const POSTS: Post[] = [
  {
    slug: "migrar-40-servicios-a-kubernetes",
    topic: "Infraestructura",
    title: "Lo que aprendí migrando 40 servicios a Kubernetes",
    excerpt: "Seis meses, dos incidentes serios y una conclusión incómoda: el clúster fue lo fácil. Lo difícil fue todo lo demás.",
    date: "18 sep 2026",
    glyph: "k8s",
    body: `Cuando empezamos, el plan cabía en una diapositiva: *contenedores, un clúster gestionado y a correr*. Seis meses después tengo claro que el clúster fue la parte fácil.

## El inventario que no teníamos

Antes de mover nada hicimos lo que deberíamos haber hecho años antes: **un inventario honesto** de cada servicio. Quién lo mantiene, de qué depende, qué pasa si se cae.

| Tipo | Servicios | Migrados sin cambios |
|:--|--:|--:|
| APIs sin estado | 24 | 21 |
| Trabajos en cola | 9 | 4 |
| Con estado propio | 7 | 0 |

Los siete con estado propio se quedaron fuera de la primera fase. Fue la mejor decisión del proyecto.

## Límites de recursos: la trampa de los valores por defecto

> [!WARNING] El incidente del martes
> Un servicio sin \`limits\` de memoria se comió un nodo entero y arrastró a otros cinco. Nadie lo había puesto porque «en las VMs no hacía falta».

Desde entonces ningún despliegue pasa la revisión sin esto:

\`\`\`yaml deployment.yaml
resources:
  requests: { cpu: 250m, memory: 256Mi }
  limits:   { memory: 512Mi }
\`\`\`

Sin límite de CPU, a propósito: el *throttling* nos dio más latencia que ruido.

## Lo que haría distinto

1. Empezar por la **observabilidad**, no por el clúster.
2. Migrar primero los servicios aburridos: ganan confianza y no hacen ruido.
3. Poner ==presupuestos de error== antes de la primera migración, no después del primer incidente.

---

La migración terminó en febrero. El equipo, que al principio la veía como un castigo, hoy despliega **cuatro veces más** que antes.`,
  },
  {
    slug: "bajar-el-tiempo-de-carga-de-6-a-1-4-segundos",
    topic: "Rendimiento",
    title: "Cómo bajé el tiempo de carga de una SPA de 6 s a 1,4 s",
    excerpt: "Sin reescribirla. Midiendo primero, quitando después y aceptando que el mayor culpable era una fuente.",
    date: "2 sep 2026",
    glyph: "ms",
    body: `La queja llegó por soporte: *«la app tarda muchísimo en abrir desde el móvil»*. Tenía razón: **6,1 segundos** hasta que se podía usar en un Android de gama media.

## Medir antes de tocar

Lo primero fue un perfil real con la red limitada, no con mi portátil. Tres cosas se comían el tiempo:

- Un paquete de JavaScript de **1,2 MB** comprimido
- Una fuente de iconos de 380 KB que bloqueaba el primer pintado
- Una llamada a la API en cascada: datos → usuario → permisos

## Lo que funcionó

> [!TIP]
> Busca primero lo que puedes **quitar**, no lo que puedes optimizar. Lo que no se descarga no hay que acelerarlo.

La fuente de iconos pasó a SVG en línea solo para los 14 iconos que usábamos. El paquete se dividió por rutas:

\`\`\`ts router.ts
const Informes = lazy(() => import("./pages/Informes"));
const Ajustes = lazy(() => import("./pages/Ajustes"));
\`\`\`

Y las tres llamadas en cascada se convirtieron en una sola en el servidor.

## El resultado

| Métrica | Antes | Después |
|:--|--:|--:|
| JavaScript inicial | 1,2 MB | 310 KB |
| Primer pintado | 3,4 s | 0,9 s |
| Interactiva | 6,1 s | 1,4 s |

Nada de esto es nuevo. Lo único nuevo fue **medir en el aparato que usa la gente**.`,
  },
  {
    slug: "server-components-sin-mitos",
    topic: "Frontend",
    title: "Server Components sin mitos: cuándo sí y cuándo no",
    excerpt: "No son la respuesta a todo ni un paso atrás. Son una herramienta con un sitio claro, y conviene saber cuál.",
    date: "21 ago 2026",
    glyph: "</>",
    body: `Llevo un año usando Server Components en producción. Esta es la regla que acabé usando con el equipo: **por defecto en el servidor; al cliente solo lo que necesita interacción**.

## Cuándo sí

- Contenido que se lee y no se toca: artículos, fichas, listados
- Consultas a la base de datos que no quieres exponer en una API
- Dependencias pesadas que solo sirven para pintar (Markdown, resaltado de código)

## Cuándo no

- Cualquier cosa con estado local: formularios, pestañas, menús
- Lo que depende del navegador: \`localStorage\`, tamaño de ventana, geolocalización

> [!NOTE] La frontera importa más que la cantidad
> Un componente de cliente arrastra a todos sus hijos al cliente. Sube la directiva \`"use client"\` lo más abajo que puedas del árbol.

## Un ejemplo real

\`\`\`tsx Ficha.tsx
export default async function Ficha({ id }: { id: string }) {
  const producto = await db.producto.find(id); // en el servidor
  return (
    <article>
      <h1>{producto.nombre}</h1>
      <BotonCarrito id={id} /> {/* lo único de cliente */}
    </article>
  );
}
\`\`\`

La página pesa lo que pesa el botón. Todo lo demás llega como HTML.`,
  },
  {
    slug: "rag-en-produccion-tres-fallos",
    topic: "IA",
    title: "RAG en producción: los tres fallos que nadie te cuenta",
    excerpt: "La demo funcionó a la primera. En producción, el asistente citaba documentos que no existían. Esto es lo que cambiamos.",
    date: "7 ago 2026",
    glyph: "λ",
    body: `Montar un asistente con recuperación de documentos es fácil en una tarde. Que responda bien a usuarios reales es otra historia.

## 1. Trozos demasiado pequeños

Partimos los documentos en fragmentos de 200 palabras. El modelo recibía frases sueltas sin contexto y rellenaba los huecos. **Subir a secciones completas**, con su título, redujo las respuestas inventadas a la mitad.

## 2. No medir la recuperación por separado

> [!IMPORTANT]
> Si el documento correcto no llega al contexto, ningún modelo lo va a arreglar. Mide la recuperación como un sistema aparte.

Preparamos 120 preguntas con su documento esperado y medimos:

| Cambio | Documento correcto en los 5 primeros |
|:--|--:|
| Solo embeddings | 61 % |
| + búsqueda por palabras | 78 % |
| + reordenado | 89 % |

## 3. No dejar decir «no lo sé»

El último cambio fue el más barato: una instrucción explícita para responder *«no aparece en la documentación»* cuando el contexto no alcanza, y **mostrar siempre las fuentes**.

- [x] Fragmentos por sección
- [x] Búsqueda híbrida y reordenado
- [x] Fuentes visibles en cada respuesta
- [ ] Evaluación automática en cada cambio del índice`,
  },
  {
    slug: "informes-de-incidentes-que-se-leen",
    topic: "Carrera",
    title: "Escribir un informe de incidentes que alguien quiera leer",
    excerpt: "El objetivo no es repartir culpas ni cubrir el expediente. Es que el siguiente incidente dure la mitad.",
    date: "24 jul 2026",
    glyph: "#",
    body: `He leído cientos de informes de incidentes. La mayoría tienen el mismo problema: están escritos para cerrar el ticket, no para que alguien aprenda algo.

## La estructura que usamos

1. **Qué notó el usuario**, en una frase y sin jerga
2. **Cronología** con horas reales, no con «poco después»
3. **Por qué fue posible**, no quién se equivocó
4. **Qué cambiamos**, con responsable y fecha

> Un buen informe se lee en cinco minutos y cambia algo en cinco días.
> — Norma del equipo de plataforma

## Lo que evitamos

- Nombres propios en la sección de causas
- «Error humano» como conclusión: siempre hay un *por qué* detrás
- Acciones sin fecha, que nadie hace

Un truco: pedimos a alguien de **otro equipo** que lo lea antes de publicarlo. Si no lo entiende, no está terminado.`,
  },
  {
    slug: "sqlite-es-suficiente",
    topic: "Infraestructura",
    title: "SQLite es suficiente (hasta que deja de serlo)",
    excerpt: "Para la mayoría de proyectos pequeños, una base de datos en un archivo es más rápida, más simple y más barata. Estos son sus límites reales.",
    date: "10 jul 2026",
    glyph: "db",
    body: `Cada vez que alguien propone SQLite para producción aparece la misma objeción: *«eso es para prototipos»*. No lo es. Pero tiene límites, y conviene conocerlos antes de elegirla.

## Por qué funciona

- Las lecturas son **locales**: sin red entre la aplicación y los datos
- Un archivo se copia, se versiona y se restaura en segundos
- Con \`WAL\` activado, las lecturas no bloquean a la escritura

\`\`\`sql ajustes.sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA busy_timeout = 5000;
\`\`\`

## Cuándo deja de serlo

| Síntoma | Qué significa |
|:--|:--|
| Varias máquinas escriben a la vez | Necesitas un servidor de base de datos |
| Escrituras sostenidas de miles por segundo | Te acercas al límite de un solo escritor |
| Consultas analíticas enormes | Mejor un almacén columnar al lado |

> [!TIP]
> Empieza con SQLite y deja la puerta abierta: un ORM o un SQL estándar hacen que migrar después sea una tarde, no un trimestre.`,
  },
];

export const ISSUES = [
  { n: 48, date: "19 sep 2026", title: "Límites de memoria, SQLite en serio y un truco de Git que no conocía" },
  { n: 47, date: "5 sep 2026", title: "Medir en el móvil de verdad y la fuente que pesaba 380 KB" },
  { n: 46, date: "22 ago 2026", title: "Server Components: la frontera importa más que la cantidad" },
  { n: 45, date: "8 ago 2026", title: "RAG que dice «no lo sé» y por qué eso es una buena noticia" },
  { n: 44, date: "25 jul 2026", title: "Informes de incidentes que la gente lee de verdad" },
];

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "articulos", title: "Artículos" },
  ...POSTS.map((p) => ({ path: `articulos/${p.slug}`, title: p.title })),
  { path: "newsletter", title: "Newsletter" },
  { path: "sobre-mi", title: "Sobre mí" },
];
