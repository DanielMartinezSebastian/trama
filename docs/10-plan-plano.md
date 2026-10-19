# Plan de remodelación de Plano (19-10-2026)

> Demo: `/sitios/plano` («Cota», software ficticio que revisa modelos de edificación al guardarlos). Referencias:
> [Atlas Motion](https://atlasmotion.com/) (relato por pasos con un objeto 3D en despiece), [Cartier Watches &
> Wonders](https://www.cartier.com/en-fr/watchesandwonders#/) (salas y ficha en 2D), [Sleep Well
> Creatives](https://sleep-well-creatives.com/) (capítulos numerados, fondo que alterna, grano) y Oryzo (anotaciones de
> CAD). El análisis de las tres está en [`09-ronda-4-threejs.md`](./09-ronda-4-threejs.md#ampliación-cartier-sleep-well-creatives-y-atlas-motion-19-10-2026).
> **Estado: plan, sin aplicar.**

## Diagnóstico de la Plano actual

| Tiene | Le falta |
|---|---|
| Retícula a la vista (`BlueprintFrame`), etiquetas mono, un acento naranja, celdas con divisores (`CellGrid`) | **Relato**: son bloques sueltos (portada, problemas, frase, maqueta) sin hilo entre ellos |
| Foto de portada y un dibujo de línea | Que la foto **se convierta** en plano: hoy conviven, no se transforman |
| Maqueta 3D de la planta con 4 incidencias (`ExplorableCanvas depth="3d"`) | Que la maqueta **explique el producto**: hoy se arrastra, pero no enseña qué hace Cota ni en qué orden |
| Página de producto con ficha técnica y rejilla de funciones | Detalle de cada incidencia, prueba (cifras, clientes), una llamada final con peso |

La idea de fondo sale de Atlas: Atlas cuenta un motor en cuatro pasos sobre un mismo objeto en despiece. Plano puede
contar **una revisión** sobre una misma maqueta: guardas → Cota revisa → separa el edificio por capas → señala las
incidencias → entrega el informe.

## Guion de la portada: «De guardar a entregar»

Una única `PinnedSection` larga con **un solo lienzo** (`ExplorableCanvas depth="3d" nav="scroll"`) que no se desmonta
en todo el relato. Los textos de cada capítulo son DOM encima de la escena. Así se cumple lo que hacen las tres
referencias: un lienzo para toda la página y nada de cargar escenas nuevas en cada sección.

| # | Capítulo (texto) | Lo que pasa en la escena | Referencia | Piezas |
|---|---|---|---|---|
| 0 | Carga | La retícula de `BlueprintFrame` se dibuja línea a línea y «COTA» se separa en dos | Atlas | `Preloader` (variante `words` o una nueva `grid`, ver abajo) |
| 1 | «Revisa tus modelos mientras los dibujas.» | **Foto primero**: la fachada en blanco y negro a sangre. Al bajar, la foto se disuelve en la planta dibujada (máscara ligada a `--pin-p`), con las cotas que se trazan | Atlas (vídeo → pintura), Oryzo | `SplitText`, `ExplorableCanvas` parada 0 (`tilt: 0`, `dims`) |
| 2 | «Guardas.» Párrafo del problema que se enciende palabra a palabra | La planta se levanta en maqueta de cartón (la intro actual) | Atlas («Built to ramp…») | `ScrubText`, parada 1 |
| 3 | «Cota revisa.» | Un **plano de luz barre** la maqueta de un lado a otro; lo que toca queda un instante en naranja y aparecen los puntos de las incidencias detrás del barrido | Iventions (haz), Atlas | parada 2 con `scan` (nuevo) |
| 4–7 | Cuatro pasos: **01 Normativa · 02 Colisiones · 03 Cotas · 04 Nomenclatura**, cada uno con su texto corto y la palabra gigante abajo | El edificio se separa **por capas** (base, estructura, instalaciones, muros) y la capa que revisa cada paso se queda sólida mientras el resto pasa a **alambre**. La cámara rodea la maqueta | Atlas (motor en despiece con INTEGRATE…), Sleep Well («01» en círculo) | paradas 3–6 con `explode` y `focusLayer` (nuevos), `FitText` para la palabra |
| 8 | «4 incidencias.» | Las capas vuelven a su sitio; la cámara visita las incidencias una a una como **salas**; cada una con su titular y «Ver incidencia» | Cartier (salas + Explore) | paradas 7–10 con `focus` (nuevo), `SectionIndex` |
| 9 | «Informe listo.» | La maqueta baja a planta 2D otra vez y se ve el informe encima | Cierre circular (plano → maqueta → plano) | parada 11 `tilt: 0` |

Tras la sección fijada, ya sin 3D:

- **Prueba** (fondo oscuro, como el proceso de Atlas): cifras con `StatCounter` («‑62 % de incidencias en entrega», etc., ficticias
  y marcadas como demo), y clientes en `CellGrid` con marcas de esquina.
- **Integraciones**: Revit, Rhino, ArchiCAD y SketchUp como tres o cuatro tarjetas con marcas de esquina (Atlas «Prototyped in
  America / Designed in Vector / Scaled with allies»).
- **Llamada final** con foto a sangre (otra arquitectura de la biblioteca), titular grande y botón en caja; pie.

## Páginas

| Ruta | Qué es | Referencia |
|---|---|---|
| `/sitios/plano` | El relato de arriba | Atlas |
| `/sitios/plano/incidencias/<id>` | **Ficha editorial** de cada incidencia, sobre fondo claro: foto, titular, párrafo que se enciende, «antes / después» (foto + dibujo), elemento afectado en `MetaTable` y una X que vuelve a la sala del relato (`#c1`). Se abre desde «Ver incidencia» | Cartier («Explore» → ficha con URL) |
| `/sitios/plano/producto` | La actual, con la ficha técnica; gana el despiece en pequeño (la maqueta con `explode` fijo y arrastrable) | — |

La ficha es una **página** con URL propia y no un modal: se puede compartir y el botón atrás funciona. La transición de la
sala a la ficha puede ir con `ElementTransition` (la foto de la incidencia como elemento compartido).

## Estilo

- **Paleta en dos tiempos**, como Sleep Well y Atlas: el relato en papel claro (tema `blueprintTokens` de hoy) y los pasos
  01–04 en **oscuro** (tinta casi negra y líneas crema). El cambio va con el scroll: el fondo de la escena se interpola
  entre paradas (`bg` por parada, nuevo) y el DOM cambia de tokens con una clase en el capítulo.
- **Retícula siempre a la vista**: las columnas de `BlueprintFrame` siguen por encima de la escena y de las fotos (Atlas).
- **Tipografía**: el par «técnico» de hoy. Palabra gigante de cada paso en mayúsculas apretadas a todo el ancho
  (`FitText`); números de capítulo «01» en un círculo de línea fina (Sleep Well).
- **Textura**: grano muy suave sobre todo (Sleep Well) y curvas de nivel tenues en el fondo oscuro (Atlas).
  Sin sombra oscura en textos oscuros sobre claro.
- **Movimiento**: un solo ritmo, el del scroll. Nada se anima solo salvo el preloader.

## Cambios en el kit (opciones, ningún componente nuevo)

Todo entra en `ExplorableCanvas` / `lib/map3d/scene.tsx` y sirve también a Alzado y Sonar.

| Opción | Dónde | Qué hace |
|---|---|---|
| `MapBlock.layer?: number` | bloques | Capa del bloque (0 base, 1 estructura, 2 instalaciones, 3 muros…) |
| `CameraStop.explode?: number` | paradas | Separación vertical entre capas en esa parada; se interpola entre paradas como el resto de la cámara |
| `CameraStop.focusLayer?: number` | paradas | La capa elegida se queda sólida y las demás pasan a **alambre** (solo aristas, como el motor de Atlas). Reutiliza las aristas que ya se dibujan |
| `MapBlock.mat: "wire"` | bloques | Bloque siempre en alambre (instalaciones, volúmenes futuros) |
| `CameraStop.scan?: boolean` | paradas | Al llegar a esta parada, un plano de luz barre la maqueta con el progreso; los puntos aparecen cuando el barrido los pasa. Es la versión 3D del haz pendiente de `Spotlight` |
| `CameraStop.focus?: string` | paradas | Id de un punto: la cámara lo encuadra, ese punto se resalta y el resto se atenúa (sala de Cartier) |
| `CameraStop.bg?: string` | paradas | Color de fondo y niebla de la escena en esa parada (claro → oscuro) |
| `onStop?: (i: number) => void` + `--stop` / `--stop-p` | `ExplorableCanvas` | La web sabe en qué parada está y cuánto lleva, para pintar sus propios capítulos (número, palabra gigante) en vez del pie de foto genérico |
| `Preloader variant="grid"` *(opcional)* | `Preloader` | Retícula que se dibuja y marca que se separa (Atlas). Si `words` + CSS lo resuelve, no se añade |
| Grano | `GridBackground kind="grain"` *(opcional)* | Ruido fijo en CSS/SVG, sin canvas |

Lo específico de Cota (la maqueta por capas, los textos, la ficha) vive en `components/sites/plano/`.

## Rendimiento y accesibilidad

- **Un lienzo** en toda la portada; el despiece y el barrido son cambios de uniformes y posiciones, sin cargar nada.
- Sombras: medir en un móvil a 390 px; si baja de 50 fps, quitarlas por debajo de 768 px (pendiente de la ronda 4).
- **Sin WebGL o con movimiento reducido**: se ve el plano 2D con las cotas y los capítulos como una lista normal (cada
  capítulo con su texto, en orden), igual que Atlas enseña imágenes de reserva. La foto de portada siempre se ve.
- Los capítulos son texto real en el DOM, en orden de lectura; las palabras gigantes son decorativas (`aria-hidden`) y el
  nombre del paso va en un encabezado.
- Teclado: cada incidencia sigue siendo un botón; «Ver incidencia» es un enlace.

## Fases

| Fase | Trabajo | Comprobación |
|---|---|---|
| 1 | Opciones de capas: `layer`, `explode`, `focusLayer`, `mat: "wire"`, `bg` por parada, `onStop` y `--stop` | Catálogo de `ExplorableCanvas` con un control de despiece; Alzado y Sonar sin cambios visibles |
| 2 | `scan` y `focus` | Catálogo: barrido y encuadre de un punto |
| 3 | Plano: datos por capas (`data.ts`), guion de la portada con los capítulos 0–9 y la disolución foto → planta | Recorrido completo en Chrome, consola limpia, 390 px |
| 4 | Ficha `/incidencias/<id>`, prueba, integraciones, llamada final | Las 4 fichas responden 200; atrás vuelve a su sala |
| 5 | Estilo: tramo oscuro, grano, curvas de nivel, preloader | Sin sombras en texto oscuro; `check:shadows` |
| 6 | Accesibilidad y cierre | axe, teclado, movimiento reducido, `tsc`, `catalog:check`, docs (`README`, `04`, `09`) |

## Fuera de este plan

- Modelos GLB reales (Cartier y Atlas los usan); aquí la maqueta sigue siendo de bloques generados.
- Sonido (Cartier y Sleep Well lo tienen; en un producto B2B no aporta).
- Posprocesado tipo Cartier (bloom, profundidad de campo): sigue pendiente de la ronda 4.
