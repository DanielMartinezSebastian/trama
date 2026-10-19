# Agencias punteras y webs corporativas: lecciones generales

> Sexta ronda (19-10-2026). Las rondas 06–10 buscan efectos de webs premiadas y la [`11`](./11-estudio-sectores-2026.md)
> busca qué necesita cada sector. Esta mira **quién hace las webs corporativas de grandes empresas** y cómo son las
> webs de esas agencias, para sacar **criterios generales** de diseño, no efectos.
>
> **Método.** La lista de agencias sale de rankings de 2026, premios de agencia (Webby, Ad Age, Campaign, Awwwards) y de
> los clientes que cada una enseña. Se **abrieron en Chrome** (escritorio, 1568 px) las webs de 11 agencias y de 3
> clientes corporativos: captura de la primera pantalla y sondeo por JavaScript (encabezados, navegación, tipografías,
> `gsap`, Lenis, `<canvas>`, `<video>`). **No se probó móvil ni teclado.** Los clientes y premios de cada agencia son los
> que ella misma publica o los que citan los rankings, que son en parte comerciales.

## 0. Conclusiones

1. **Las agencias que hacen webs corporativas tienen webs propias sobrias.** De 11 webs, solo Locomotive usa Lenis y
   `<canvas>`, y solo Pentagram carga GSAP. El resto se apoya en **tipografía, foto o vídeo y estructura**. El
   movimiento llamativo no es lo que vende a una gran empresa.
2. **La tipografía es la marca.** Casi todas usan una fuente propia o exclusiva y combinan **palo seco con serifa**.
3. **La prueba va antes que el discurso**: lista de clientes, premios con laureles, una cita de prensa o un informe de
   analistas aparecen en la primera o la segunda pantalla.
4. **Navegación de 4–6 entradas** en la agencia; en el cliente corporativo, **barra de utilidades + megamenú con
   descripciones + buscador**.
5. **Entrar por sector** (Industries, Sector) es tan importante como entrar por servicio.
6. **Contenido vivo**: noticias, ideas y boletín en todas. Una web corporativa sin actualidad parece abandonada.

## 1. Agencias revisadas

| Agencia (sede) | Clientes corporativos que publica | Reconocimiento | Lo observado en su web |
|---|---|---|---|
| [Instrument](https://www.instrument.com/) (Portland) | Google, Spotify, ServiceNow, Uber, ŌURA | Campaign US: estudio de diseño del año 2026 (según su web) | Wordmark de borde a borde, rejilla de casos en vídeo; tipografía propia **Instrument Sans + Serif** (titular a 78 px en serifa); secciones: trabajo, **lista de clientes**, servicios, **premios**, propósito, noticias, boletín, contacto. Sin GSAP, Lenis ni canvas |
| [Work & Co](https://work.co/) (Nueva York; hoy en Accenture Song) | Apple, IKEA, Google, Nike, **Pfizer, Celanese**, JW Anderson | Rankings de producto digital | Fondo blanco, una frase de 100 px en Helvetica Now («We solve complex problems through design & technology»), **cita de Fast Company en Garamond** como prueba, luego clientes y áreas. Sin cabecera de navegación visible ni efectos |
| [AREA 17](https://area17.com/) (Nueva York, París) | OpenAI, The New York Times, Saint Laurent, **Green Climate Fund** | Lovie Awards (finalista con GCF) | Intro mínima «A/»; titular en Suisse Intl («We partner with the world’s most influential organizations…»); **sectores que atienden**, novedades, boletín, contacto |
| [Clay](https://clay.global/) (San Francisco) | Slack, Snapchat, Sky, Discover, Marqeta | Rankings de UX y marca | Cabecera clásica con **Industries** desplegable y botón «Contact» relleno; titular de una frase; **cada caso es un H2 con el nombre del cliente** (Slack, STC Bank, Sky…); 12 vídeos, 3 canvas; página muy larga (20.000 px) |
| [Locomotive](https://locomotive.ca/en) (Montreal) | Wolverine Worldwide, The Drake Hotel, Scout Motors, Ubisoft | Muchos premios Awwwards; autores de Locomotive Scroll | La más expresiva: **Lenis**, 2 canvas, fuente propia (153 px), foto a sangre, «Let’s talk» como única acción |
| [DEPT®](https://www.deptagency.com/) (Ámsterdam) | Global | **Agencia del año en los Webby 2026** | Titular en mayúsculas en Inter Variable (112 px), vídeo, **cuadrante de Gartner** como prueba; contacto en píldora y buscador en la cabecera |
| [Pentagram](https://www.pentagram.com/) (Londres, Nueva York) | Obama Presidential Center, Saks, instituciones | La mayor consultora de diseño independiente | **Filtro en forma de frase sobre la foto: «We design [disciplina] for [sector]»**; 5 entradas de menú + buscador + archivo; tipografía Plain; GSAP y 22 vídeos |
| [COLLINS](https://www.wearecollins.com/) (Nueva York, San Francisco) | Spotify, Dropbox, Figma, Target, Equinox | Ad Age: agencia del año (seis veces) | Una frase en serifa centrada («Rewrite your worth.») y debajo **los laureles de los premios**; menú en hamburguesa; casos, programas, cultura |
| [Koto](https://koto.com/) (Londres, Berlín, Sídney) | Amazon, Microsoft, Tripadvisor, Instagram, Fitbit | Rankings de marca | Vídeo a sangre, fuente condensada propia, menú mono en mayúsculas, **hora local** en la cabecera |
| [Edenspiekermann](https://www.edenspiekermann.com/) (Ámsterdam, Berlín) | Corporativos europeos (servicios y producto) | Referente europeo de diseño de producto | Lo más «corporativo»: «Design strategy that ships» en **serifa + negrita**, tira de pantallas de producto, servicios como titulares con verbo (Make, Design, Ship, Multiply), clientes, novedades; botón «Get in touch» relleno |
| [Exo Ape](https://www.exoape.com/) (Ámsterdam) | Ottografie y marcas de hostelería y espacios | **Webby 2026: mejor navegación y estructura** (Ottografie) | Foto a sangre, frase de posicionamiento corta y titular gigante (333 px, Lausanne 300), 4 entradas de menú |

## 2. Webs corporativas de sus clientes (observadas)

| Web | Agencia | Qué hace bien | Patrón |
|---|---|---|---|
| [Celanese](https://www.celanese.com/) (química, EE. UU.) | Work & Co | **Barra de utilidades** arriba (Empleo, Contacto, Área de cliente, región «Americas»); menú principal **Industrias · Aplicaciones · Productos · Servicios · Sostenibilidad · Noticias · Nosotros**; buscador; hero que presenta una herramienta (asistente de selección de materiales) | Industria B2B que entra por aplicación, no por producto |
| [Green Climate Fund](https://www.greenclimate.fund/) (fondo internacional) | AREA 17 | Barra de utilidades (noticias, eventos, junta); cabecera en tarjeta blanca; **megamenú con una línea de descripción por enlace**; buscador; hero «10 years of climate impact» con **tres cifras en mosaico** (358 proyectos, 135 países, 20.400 M$) y una foto | Institucional: cifras que prueban el impacto en la primera pantalla |
| [Wolverine Worldwide](https://www.wolverineworldwide.com/) (calzado, cotizada) | Locomotive | Vídeo de trabajadores reales, lema en tres palabras grandes («Make. Every Day. Better.»); menú **Nosotros · Marcas · Empleo · Responsabilidad · Inversores**; **cotización en bolsa**, informe anual, noticias | Grupo empresarial: marcas, inversores y empleo como puertas principales |

## 3. Lecciones generales para Trama

| # | Lección | Cómo llevarla a Trama |
|---|---|---|
| G1 | **Una frase, enorme, sin adornos** en el hero: qué hacemos y para quién. El movimiento, si lo hay, es un vídeo en bucle | Ya está (`Hero`, `FitText`). Regla de composición: el titular se entiende sin ver la animación |
| G2 | **Par palo seco + serifa** como identidad (Instrument, Work & Co, Edenspiekermann, COLLINS) | Añadir pares tipográficos a los temas (`editorial` lo apunta); una serifa de acento para citas y titulares |
| G3 | **Prueba en la primera o la segunda pantalla**: clientes con nombre, laureles, cita de prensa, informe de analistas | Opción de `LogoCloud` para clientes como texto (no solo logos) y variante con **laureles**; `Testimonial` como cita de prensa con medio y fecha |
| G4 | **Megamenú con descripciones** y **barra de utilidades** (empleo, contacto, área de cliente, idioma o región) | Opciones de `NavBar`: `utility` (fila superior) y `mega` con título + descripción por enlace |
| G5 | **Entrada por sector** además de por servicio | Patrón de página: «Sectores» con una ficha por sector (enlaza con la [`11`](./11-estudio-sectores-2026.md)) |
| G6 | **Filtro en forma de frase** (Pentagram: «We design [X] for [Y]»): filtrar un catálogo grande sin parecer un formulario | Variante `sentence` de `FilterBar` (los `Select` van dentro del texto); accesible con etiquetas reales |
| G7 | **Cifras de impacto en mosaico** en el hero (GCF) | `KpiCard` / `StatsSection` dentro de `BentoGrid`; ya existen, falta usarlas así en una demo |
| G8 | **Páginas de empresa grande**: inversores (cotización, informes), sala de prensa, empleo, sostenibilidad | Plantillas de página en una demo corporativa; `DataTable`, `Chart`, `ArticlesSection` |
| G9 | **Contenido vivo**: noticias, ideas, boletín | `ArticlesSection` + alta al boletín (Kernel Log ya lo tiene) |
| G10 | **Pocas acciones**: «Contact» / «Let’s talk» / «Get in touch» como único botón relleno | Regla: un único botón primario en la cabecera |
| G11 | **Fuente propia o poco vista** antes que la tipografía de moda | En demos: elegir pares menos vistos y documentarlos en el tema |
| G12 | **No copiar sus avisos de cookies**: Celanese («Accept all» / «Accept selected»), DEPT y Locomotive destacan aceptar sobre rechazar. Solo Pentagram los pone al mismo nivel. En España no vale ([`11` B10](./11-estudio-sectores-2026.md)) | `CookieBanner` ya lo cumple; mantenerlo |

**Lo que no se ve en estas webs**: preloaders largos, cursores personalizados, scroll secuestrado, 3D en el hero. Donde
aparece movimiento es en **vídeo de casos reales** y en transiciones discretas. Para una demo corporativa, el nivel de
movimiento recomendado es **1** (escala de la [`11` §2](./11-estudio-sectores-2026.md)).

## 4. Fórmula nueva: «Corporativo claro»

| Ingredientes | Cuándo |
|---|---|
| `NavBar` con `utility` + `mega` (con descripciones) + buscador (`CommandPalette`), hero de una frase con vídeo o foto real, mosaico de cifras (`BentoGrid` + `KpiCard`), sectores, clientes y premios, noticias (`ArticlesSection`), páginas de inversores, prensa, empleo y sostenibilidad, `BigFooter` con mapa del sitio | Grupos empresariales, industria mediana y grande, fundaciones e instituciones, consultoras y despachos grandes |

**Demo propuesta: «Vértice»**, un grupo industrial ficticio con tres líneas de negocio. Páginas: inicio (frase +
cifras), sectores (ficha por sector), soluciones con filtro en frase, sostenibilidad (informe y cifras), inversores
(cotización de ejemplo, informes en tabla, calendario), sala de prensa, empleo (ofertas con filtros) y contacto por
área. Estrena `NavBar utility/mega`, `FilterBar sentence` y `LogoCloud` con laureles.

## 5. Cruce con el estudio por sectores ([`11`](./11-estudio-sectores-2026.md))

Las lecciones G de esta ronda, contra la base común (B), los sectores (§3 de la `11`) y su presupuesto de movimiento
(§2 de la `11`). Los ids de los dos documentos no cambian; los patrones de UX de la `06` se citan como `06·P1`.

### 5.1 Lecciones G frente a la base común y los sectores

| Lección | Coincide con (11) | Matiz que añade esta ronda | Sectores donde pesa más |
|---|---|---|---|
| G1 Una frase enorme en el hero | P1 (especialización en el titular), T (resultado concreto) | El titular se entiende sin la animación; el movimiento, si lo hay, es vídeo real | Todos; sobre todo P, T, B2B |
| G2 Par palo seco + serifa | S4 (tono), C (una paleta, dos tipografías) | La tipografía es la marca: mejor una fuente poco vista que la de moda (G11) | P, H, C, estudios |
| G3 Prueba en la primera o segunda pantalla | B5 (reseñas con número y fuente), A2 (resultados con fuente), B2B5 (certificaciones) | En la gran empresa la prueba es **clientes con nombre, premios, prensa y analistas**; en la pyme, reseñas | B2B, T, P |
| G4 Barra de utilidades + megamenú con descripciones | B13 (5–7 entradas) | No choca: 5–7 entradas arriba y la profundidad en el megamenú, con una línea que explica cada enlace | B2B, I, H (cadenas), corporativo |
| G5 Entrada por sector | B2B1 (por sector o aplicación, no por producto) | Vale también para agencias y consultoras: «para quién» al nivel de «qué» | B2B, P (áreas), T |
| G6 Filtro en forma de frase | I1 (filtros en la URL, sin registro), B2B2 (catálogo con búsqueda) | Los `Select` dentro de una frase; debe dejar el estado en la URL igual que I1 | B2B, I, A (cursos), estudios |
| G7 Cifras de impacto en mosaico | B5, A2 (cifras con fuente) | Con fecha y fuente al lado de cada cifra; sin fuente, restan (§0.3 de la `11`) | Corporativo, fundaciones, B2B, A |
| G8 Inversores, prensa, empleo, sostenibilidad | — (nuevo) | Páginas propias de la empresa grande; no las necesita una pyme | Corporativo, B2B grande |
| G9 Contenido vivo y boletín | §0.1 (la web responde preguntas) | Una web corporativa sin actualidad parece abandonada | Corporativo, P (calendario fiscal), T |
| G10 Un solo botón relleno | B15 (una acción por página), B1 (acción persistente) | En corporativo la acción es «Contacto» por área, no «Reservar» | Todos |
| G11 Fuente poco vista | — | Documentar el par en el tema de la demo | Estudios, C, H |
| G12 Cookies sin trampas | B10 (AEPD: «Rechazar» al mismo nivel) | Agencias punteras lo incumplen: no copiar su banner | Todos (en España) |

### 5.2 Presupuesto de movimiento

Las agencias que hacen webs corporativas se quedan en el **nivel 1** del §2 de la `11` (revelados y vídeo real), salvo
Locomotive (2–3). Encaja con lo que la `11` ya fija para despachos (0–1), salud (1), industria B2B (1–2) y SaaS (2–3, pero
con el producto real). En el cruce de UX de la `11` §10.1: `06·P4` (preloader), `06·P6` (cursor) y el scroll secuestrado
quedan **fuera** de la fórmula «Corporativo claro»; `06·P9` (transiciones cortas) y `06·P10` (microinteracciones) sí.

### 5.3 Fórmula «Corporativo claro» frente a las demos de la `11` §6

| Demo | Sector | Qué toma de esta ronda |
|---|---|---|
| **Vértice** (propuesta aquí) | Corporativo / B2B grande | Toda la fórmula: `NavBar utility/mega`, cifras en mosaico, sectores, inversores, prensa, empleo |
| **Ferrer Asesores** | P | G1, G3 (prensa y colegiación como prueba), G5 (áreas), G9 (calendario fiscal); sin megamenú |
| **Umbral** | I | G6 (filtro en frase sobre el buscador, con estado en la URL), G4 si hay obra nueva y segunda mano |
| **Plano** (existente) | T / B2B | G3 (clientes con nombre ya está; faltan prensa o analistas), G10 (un único botón relleno: «Solicitar demo») |

Las piezas nuevas de esta ronda (`NavBar utility/mega`, `FilterBar sentence`, `LogoCloud` con laureles) se suman a la
lista de la `11` §5 con la misma regla: **opciones de componentes existentes**, no componentes nuevos.

## 6. Hecho: demo Vértice (19-10-2026)

`/sitios/vertice`, grupo industrial ficticio (Movilidad, Energía y Agua) con la fórmula «Corporativo claro». Páginas:
inicio, sectores (índice y ficha por sector), soluciones, sostenibilidad, inversores, sala de prensa, empleo y contacto
por área. Sin componentes nuevos; opciones añadidas al kit:

| Opción | Componente | Lección |
|---|---|---|
| `utility` (barra de utilidades: izquierda y, tras `|`, derecha) | `NavBar` | G4 |
| `layout="sentence"` + `sentence` + `FilterGroup.any` | `FilterBar` | G6 |
| `awards` (premios con laureles) | `LogoCloud` | G3 |
| Pasos con `Etiqueta=/ruta` (enlaces reales) | `Breadcrumbs` | B13 |
| `--sel-bg` / `--sel-fg` (selección por tema) | `kit.css` | — |

El megamenú con descripciones, el buscador ⌘K y `KpiCard` con la cotización ya existían. Movimiento nivel 1: solo
transiciones de estado. Tipografía: Instrument Sans y Instrument Serif (G2). Soluciones guarda el filtro en la URL
(`?tipo=…&sector=…`, B13 / I1). **Falta**: barra de acción móvil (B1), páginas legales propias (B11), axe y Lighthouse.

## 7. Pendiente

- Probar en móvil (390 px) y con teclado las tres webs corporativas, sobre todo el megamenú de GCF y Celanese.
- Ampliar con agencias europeas de corte corporativo (Edenspiekermann ya está) y con alguna española de referencia.
- Medir Lighthouse de las tres corporativas para tener un listón de rendimiento.

## Fuentes

[Instrument](https://www.instrument.com/) · [Work & Co](https://work.co/) · [AREA 17](https://area17.com/) ·
[Clay](https://clay.global/) · [Locomotive](https://locomotive.ca/en) · [DEPT®](https://www.deptagency.com/) ·
[Pentagram](https://www.pentagram.com/) · [COLLINS](https://www.wearecollins.com/) · [Koto](https://koto.com/) ·
[Edenspiekermann](https://www.edenspiekermann.com/) · [Exo Ape](https://www.exoape.com/) ·
[Celanese](https://www.celanese.com/) · [Green Climate Fund](https://www.greenclimate.fund/) ·
[Wolverine Worldwide](https://www.wolverineworldwide.com/) ·
[Webby 2026: agencia del año (DEPT®)](https://www.webbyawards.com/press/press-releases/30th-annual-webby-awards-announce-ad-industry-winners/) ·
[Webby 2026: navegación y estructura](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure) ·
[Comparativa de agencias (Moonb)](https://www.moonb.io/blog/digital-design-agency) ·
[Agencias de marca 2026 (Moonb)](https://www.moonb.io/blog/best-branding-agencies) ·
[Malvah, estudio del año Awwwards 2025 (LBB)](https://lbbonline.com/news/Malvah-Studio-of-the-Year-2025-Awwwards)
