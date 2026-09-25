# Webs completas: plan y estructura

Nueva sección de la galería con **sitios de varias páginas** construidos con el kit (`components/ui/`), como casos de uso
concretos. A diferencia de las landings (`/demo/<slug>`, una sola página), cada web tiene navegación real entre páginas,
estado compartido (carrito, suscripción) y contenido propio.

## Arquitectura

| Pieza | Dónde | Qué hace |
|---|---|---|
| Rutas | `app/sitios/[site]/[[...path]]/page.tsx` | Todas las páginas de todas las webs, estáticas (`generateStaticParams` + `dynamicParams = false`) |
| Registro | `lib/sites.ts` | Slug, título, resumen, acento y lista de páginas (con su título) de cada web; lo leen las rutas, la galería y el catálogo |
| Marco común | `components/sites/` (`SiteShell`, `SitePage`, `shared.tsx`, `sites.css`) | Tema por web, scroll de página, enlaces internos sin recarga (`router.push`), cabecera de página |
| Cada web | `components/sites/<slug>/` | `data.ts` (contenido y rutas), `Shell.tsx` (barra, pie, estado), una página por archivo, CSS con prefijo propio |
| Imágenes | `lib/sites/art.ts` | Ilustraciones SVG generadas (portadas de blog, sprites, aparatos de audio, cámaras, composiciones de moda): sin depender de imágenes externas |

Mejoras del kit que salen de esto (sirven a cualquier proyecto):

- `onChange` en `TextField`, `Select`, `CheckboxGroup`, `RadioGroup`, `Tabs` y `Pagination`, y `value` en `TextField`/`Select`
  (antes solo eran decorativos).
- `ChatWidget` (overlays): asistente flotante con respuestas por reglas, respuestas rápidas, indicador de escritura y
  un `onMessage` asíncrono para conectarlo a un backend real.

## Las cinco webs

| # | Web | Slug | Estética | Páginas |
|---|---|---|---|---|
| 1 | **Kernel Log** — blog de tecnología de Ada Ríos | `kernel-log` | oscuro, técnico, acento turquesa; variante `outline` + código `terminal` | inicio · artículos (búsqueda, temas, paginación) · 4 artículos (`Article`) · newsletter (alta + archivo) · sobre mí |
| 2 | **Pixelforge** — tienda de assets para videojuegos | `pixelforge` | violeta y amarillo, `retro`, tipografía pixel | inicio · tienda (filtros, orden, búsqueda) · 8 fichas de producto (licencias) · carrito (cupón, pago en pasos) · FAQ · términos · privacidad · licencias |
| 3 | **Vigía** — videovigilancia y seguridad | `vigia` | azul noche corporativo, `glass` | inicio · servicios · 4 fichas de servicio · planes · presupuesto (formulario en pasos) · contacto — con **chatbot** en todas |
| 4 | **Onda Instruments** — fabricante de equipos para DJ y músicos | `onda` | negro y naranja, `solid`, display Syne | inicio · productos (categorías) · 8 fichas (especificaciones, descargas) · artistas · soporte (descargas, FAQ, registro) |
| 5 | **Clara Vidal** — estilismo y moda | `clara-vidal` | claro, minimalista, mucho aire, estilo Apple; variante `minimal` | inicio · servicios · lookbook · diario + 3 entradas · sobre mí · reservar |

## Orden de ejecución

1. Mejoras del kit (`onChange`/`value`, `ChatWidget` + entrada de catálogo).
2. Marco común, rutas, registro y sección «Webs completas» en la galería.
3. Las cinco webs, una a una, comprobando cada una en el navegador.
4. `CATALOG.md`: sección «Webs completas de referencia» (páginas, archivos y componentes que usa cada una).
5. `typecheck`, `catalog:check` y revisión final.
