# Ronda 4: webs premiadas con Three.js (19-10-2026)

> Fuentes: el listado de Utsubo [«8 Best Three.js Websites of 2026»](https://www.utsubo.com/blog/best-threejs-websites-2026), el
> de [hontran.dev](https://www.hontran.dev/blog/best-award-winning-websites-2026) y la categoría Three.js de
> [Awwwards](https://www.awwwards.com/websites/three-js/). Se **abrieron en Chrome** Oryzo e Iventions; del resto solo se leyó la
> reseña, así que no hay medidas propias. Complementa [`08-ronda-3-webs-premiadas.md`](./08-ronda-3-webs-premiadas.md).

## Observado

| Web | Qué hace (técnica) | En Trama |
|---|---|---|
| [Oryzo](https://oryzo.ai/) (Lusion; sitio del mes de abril de 2026 según Utsubo) | Escritorio de maquetista visto desde arriba: alfombrilla de corte con regla, lápices y cúter; un solo objeto en three.js; la intro dibuja **anotaciones de CAD** (líneas discontinuas, tiradores) alrededor del objeto; el scroll acerca la cámara (dolly en Z real), con profundidad de campo y textos que se enfocan | `ExplorableCanvas nav="scroll"` + `dims` (cotas en el tablero) |
| [Iventions](https://iventions.com/) (SOTD, Developer Award) | Haces de luz cónicos que barren la página y tiñen lo que tocan; el wordmark cambia de color bajo el haz; vídeo en una tarjeta inclinada; un foco final que llena la pantalla de color | Pendiente: un modo «haz» para `Spotlight` |
| Explore Primland (según Utsubo) | Vuelo de cámara sobre un terreno real con niebla, guiado por el scroll | `nav="scroll"` + niebla en la escena |
| [Cartier Watches & Wonders](https://www.cartier.com/en-fr/watchesandwonders#/) (Immersive Garden) | Salas 3D, una por pieza; el scroll pasa de una a otra; audio. Abierta en Chrome: ver la ampliación de abajo | Las paradas de `path` con su texto |
| Hubtown (Unseen Studio, según Utsubo) | Monolito sobre agua; el cursor revela detalle | Pendiente |
| IVRESS (Utsubo) | `WebGPURenderer` con WebGL de reserva; shaders en TSL | Pendiente: probar `three/webgpu` |
| Overworld Audio (ronda 3) | Mapa 3D que se arrastra con puntos clicables | `ExplorableCanvas depth="3d"` |

**Tendencia** (según las reseñas, sin verificar): en 2026 domina la narración por scroll con escenas 3D en vez de páginas 2D,
y WebGPU empieza a ser normal con WebGL de reserva.

## Qué se construyó (sin componentes nuevos)

| Pieza | Qué es |
|---|---|
| `ExplorableCanvas depth="3d"` | El mismo lienzo, como **maqueta de papel** en three.js (`lib/map3d/scene.tsx`): volúmenes de cartón, metacrilato, madera de balsa y árboles de espuma (`blocks`), textura de papel generada, sombras suaves, aristas a lápiz, niebla hacia el fondo y una intro que pasa de la planta cenital a la maqueta. Los puntos siguen siendo botones del DOM colocados sobre la escena. Sin WebGL o con movimiento reducido: el plano 2D con las huellas |
| `ExplorableCanvas nav="scroll"` + `path` | Dentro de un `PinnedSection`, el scroll lleva la cámara por paradas (planta → maqueta → detalle) y cada parada enseña su texto |
| `dims` | Cotas dibujadas en el tablero (y en el plano 2D), como anotaciones de CAD |
| `lib/ui/gl.tsx` | `GLBoundary` y `useGLGate`: la carga diferida que repetían `ObjectStage`, `Logo3D`, `DeviceMockup3D` y `DistortImage` (ahora la usan todos, y el mapa 3D) |
| `lib/sites/maqueta.ts` | Datos para demos: `city()` (manzanas con calles y plazas) y `walls()` (muros a partir de un plano) |

**Demos:**
- **Alzado** (`/sitios/alzado`), nueva: estudio de arquitectura con preloader, portada fijada que recorre la maqueta con el
  scroll, índice con la foto en el cursor y mapa 3D de obras.
- **Plano**: maqueta del edificio revisado, con las incidencias como puntos.
- **Sonar**: el mapa de proyectos pasa a ser una ciudad de cartón en 3D.

## Ampliación: Cartier, Sleep Well Creatives y Atlas Motion (19-10-2026)

> Las tres **abiertas en Chrome** (escritorio, 1568 px). La técnica sale de lo que expone la página (`window.__THREE__`,
> lienzos, scripts); lo demás es lo que se ve. Se miran tres cosas en cada una: **estructura** (cómo se cuenta), **estilo**
> (con qué se viste) y **3D** (qué hace WebGL y qué no).

### [Cartier · Watches & Wonders](https://www.cartier.com/en-fr/watchesandwonders#/)

Nuxt y three r183 en **un único lienzo** a pantalla completa (2880 × 1417 en pantalla de doble densidad).

- **Estructura.** Carga con porcentaje dentro de la silueta de un reloj, sobre un color plano. Después, una sucesión de
  **salas**: cada movimiento de scroll lleva a la siguiente con una transición de cámara (no hay recorrido continuo). Un
  indicador de puntos a la derecha marca la sala. Cada sala tiene un titular, una pieza y un único botón, «Explore», que
  abre una **ficha editorial en 2D** sobre fondo blanco con su propia URL (`#/tailored-crafts-serving-one-form`): la
  foto del reloj, el titular, un párrafo que se enciende al bajar, fotos de detalle a sangre, «All pictures» y una X para
  volver a la sala. Botón «Sound» fijo arriba a la izquierda.
- **Estilo.** Serifa de titulares muy fina en mayúsculas y caja alta de cuerpo pequeño; en la ficha cambia a una palo
  seco geométrica y ancha. Paleta de la escena (tierra, latón, crema) y ficha en blanco roto: el contraste entre la sala
  oscura y la ficha clara es el ritmo de la web. Muy poco texto por pantalla.
- **3D.** Interiores con suelo que refleja, niebla, luz volumétrica (conos de luz cálida), biombos con textura de papel,
  cilindros de metal cepillado, siluetas de artesanos sobre mesas de trabajo y una pantalla curva con vídeo de un paisaje.
  La cámara deriva despacio con el puntero. La pieza (el reloj) es un modelo real centrado. Calidad de render alta: es
  posprocesado (bloom, viñeta, grano), no materiales planos.

### [Sleep Well Creatives](https://sleep-well-creatives.com/)

Webflow con jQuery, y three r180 cargado desde un paquete propio en Netlify. Página de **49.800 px** (unas 53 pantallas).

- **Estructura.** Puerta «Enter Site» con el logo (para poder sonar). Un **ensayo ilustrado por capítulos**: problema («Sleep
  isn't a luxury») → causas (pastillas, pulso, reloj, cafeína, móvil) → giro («How to redesign for a better sleep») →
  consejos en carrusel → cierre («Make it part of your routine»). Cada capítulo abre con su número en un círculo («01»),
  una etiqueta en mayúsculas y un titular de serifa. Fijos: el logo arriba al centro, «The Note» (menú) arriba a la
  derecha, y abajo a la izquierda «Insights ••••••» como índice de capítulos.
- **Estilo.** Dos colores: crema de papel y azul ultramar, alternando el fondo por capítulo. **Grano** sobre toda la
  página. Serifa condensada para titulares, palo seco para el cuerpo en dos columnas. Ilustraciones punteadas
  (estilo grabado) en las fotos de los consejos y estrellas amarillas sueltas.
- **3D.** Escenas ilustradas, no realistas: dunas con un estampado blanco y negro y una figura de espaldas (sombreado
  plano, «toon»), un **túnel de anillos de papel plegado** por el que se avanza con el scroll, ondas de pulso en línea fina
  y una mano con un móvil rodeada por un anillo de tarjetas que gira. El 3D sirve a la metáfora de cada capítulo.

### [Atlas Motion](https://atlasmotion.com/)

Astro y three r183: **un lienzo WebGL2** a pantalla completa y dos lienzos 2D. Página de 15.300 px; casi cada sección
mide dos pantallas para poder fijarse.

- **Estructura.** Preloader con la retícula de la página dibujada, un anillo de marcas que gira y «MOTION» / «SYSTEMS» que
  se separan. Portada: vídeo de un torno con «The physical layer of autonomy» y, al bajar, el vídeo **se disuelve en una
  pintura** de nubes (transición pintada). Siguen: una montaña pintada con «The right motor for the mission», un dron 3D que
  entra volando, «Built to ramp with you» y un párrafo que se enciende palabra a palabra. Después, **el proceso**: un
  motor en **despiece** dibujado en alambre que gira y se separa en cuatro pasos fijados; cada paso tiene su número
  («01»–«04»), un texto corto y una palabra gigante abajo (INTEGRATE, EVALUATE, MANUFACTURE, INNOVATE). Tesis con una
  pintura de la fábrica, galería con miniaturas, un robot 3D con el titular desenfocado detrás, tres tarjetas con
  marcas de esquina, y un paisaje pintado como llamada final («Ready to scale», «Become a partner»).
- **Estilo.** Gris casi negro y crema, con **líneas de columna visibles** que atraviesan toda la página (también sobre las
  fotos) y curvas de nivel muy tenues de fondo. SuisseIntl en mayúsculas apretadas; botones en caja con borde fino;
  enlaces que ruedan letra a letra (como `RollLink`). Fotografía y pintura al óleo conviviendo con dibujo técnico.
- **3D.** Pocos objetos y muy bien elegidos: el dron, el motor en alambre y el robot. Cada uno tiene **imagen de reserva**
  (`home-drone-fallback.jpg`, `home-motor-fallback.jpg`), la misma idea que el plano 2D de `ExplorableCanvas`.
- **Parecido con Plano.** Comparten la retícula a la vista, las etiquetas técnicas y un solo acento. Atlas añade lo que a
  Plano le falta: **un relato** (problema → proceso por pasos → prueba → llamada) y un objeto 3D que cambia con cada paso.
  El plan de remodelación está en [`10-plan-plano.md`](./10-plan-plano.md).

### Lo que se repite en las tres

| Patrón | Cartier | Sleep Well | Atlas | En Trama |
|---|---|---|---|---|
| Un único lienzo WebGL para toda la página | ✓ | ✓ | ✓ | No: cada componente 3D monta el suyo. Plano debe usar uno solo |
| Puerta de entrada (sonido, carga) | Carga con % | «Enter Site» | Preloader con retícula | `Preloader`, `Modal size="full"` |
| Capítulos con número e índice fijo | Puntos a la derecha | «01» + «Insights ••••••» | «01»–«04» + puntos | `SectionIndex` |
| Texto que se enciende al bajar | Ficha | — | Párrafos | `ScrubText` |
| Alternar fondo claro y oscuro por capítulo | Sala / ficha | Crema / azul | Crema / negro | A mano en cada web |
| Grano o textura sobre todo | Posprocesado | Ruido | Curvas de nivel | `GridBackground`; falta un grano |
| Detalle en 2D encima del 3D | Ficha con URL | — | — | `Modal size="full"` |
| Imagen de reserva del 3D | — | — | Por objeto | Plano 2D de `ExplorableCanvas` |
| Despiece / capas que se separan | — | Anillo de tarjetas | Motor | Pendiente: capas en `ExplorableCanvas` |

## Pendiente de esta ronda

- Modo «haz de luz» en `Spotlight` (Iventions).
- Profundidad de campo en la maqueta (Oryzo); hoy no hay posprocesado en el kit.
- Probar `WebGPURenderer` (IVRESS).
- Cargar modelos GLB reales en la maqueta.
- Revisar en móvil (390 px) el rendimiento de las sombras.
- Un solo lienzo WebGL por página cuando hay varias escenas (lo hacen las tres webs de la ampliación).
- Grano de página (Sleep Well) como opción de `GridBackground`.
- Remodelación de Plano: [`10-plan-plano.md`](./10-plan-plano.md).
