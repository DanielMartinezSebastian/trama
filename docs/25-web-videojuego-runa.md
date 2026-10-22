# 25 · La web de un videojuego que se juega: «Runa»

> 22-10-2026. Petición: evaluar y crear otra web con la tecnología de Maravillas ([24](./24-historia-interactiva-entre-rutas.md):
> viajeros 3D entre rutas, juegos sobre los modelos), con **temática de videojuegos**, **transiciones duras**, **modelos de
> videojuegos** y algún **minijuego**. La web está en `/sitios/runa` (`components/sites/runa/`).

## 1. Evaluación

| Pregunta | Qué se encontró | Decisión |
|---|---|---|
| ¿Qué necesita la web de un juego indie? | La web de lanzamiento gira en torno a la **lista de deseados** de la tienda y al **kit de prensa** (capturas, tráiler, ficha, contacto); muchas son de dos páginas ([presskit.gg](https://presskit.gg/field-guides/indie-game-launch-checklist), [Game Developer](https://www.gamedeveloper.com/business/how-to-announce-your-upcoming-steam-indie-game-for-maximum-exposure-and-wishlists), [Wayline](https://www.wayline.io/learn/market-your-game/4)). Son guías de agencias y blogs: orientan, no son cifras fiables | Una web de lanzamiento con lista de deseados y kit de prensa, **pero que se juega**: la demo engancha antes que el tráiler |
| ¿Qué premian las webs de juegos? | La web de Axolot (14islands, SOTD) deja jugar con los objetos 3D de sus juegos ([14islands](https://14islands.com/work/axolot)); en Awwwards se ven «gamificaciones» con three.js ([Shaky Gotcha](https://www.awwwards.com/inspiration/gameplay-3d-interactive-showcase-shaky-gotcha), [Active Theory](https://www.awwwards.com/inspiration/physics-based-3d-game-wonderful-weekends-with-google)) | Los modelos del juego son la interfaz: se eligen, se abren y se golpean |
| ¿Qué modelos? | `models:fetch -- buscar … --articulado` en Sketchfab. Se descartaron los de **fan art** (Sonic, Hollow Knight: propiedad intelectual ajena) | Tres héroes con esqueleto y animación (DJMaesen, BeardenInc, Bento), un cofre con animaciones de abrir y cerrar (Multipainkiller Studio) y un jefe (DJMaesen). Todos CC BY 4.0 |
| ¿Qué transiciones duras hay? | El kit ya tiene `pixelate`, `glitch`, `scanline` y `terminal` en `PageTransition` | Pixelado al avanzar, **glitch** al bajar al jefe, barrido de líneas al volver al menú, y un **cartel de nivel** que se apaga como un CRT (`steps()`, sin fundidos) |
| ¿Qué pieza nueva para el kit? | No había un minijuego de habilidad | **`SkillCheck`**: aguja que recorre un anillo o una barra; hay que pulsar en la zona buena. Sirve para juegos, promociones con juego o un «carga el golpe» |

## 2. El guion (rutas y juegos)

| Ruta | Qué pasa | Juego | Viajeros |
|---|---|---|---|
| `/` Título | «RUNA» enorme con **el jefe entre las sílabas**; «Pulsa start» parpadea (Enter o Espacio también) | — | El jefe, en su hueco `titulo` |
| `/heroe` | Selección de jugador: tres héroes con sus barras FUE/MAG/AGI; ← → para cambiar | Elegir | El héroe elegido gira en grande; al jugar, **vuela al retrato del HUD** |
| `/nivel-1` | Un cofre cerrado: «Cerradura» | **Forzar la cerradura** (`SkillCheck`): los pernos dependen de la agilidad (caballero 4, doctora 3, exploradora 2) | Al abrirlo sale la **runa** (la gema de Quilate, en magenta); «Coger la runa» la manda **al inventario** |
| `/nivel-2` | Barra de vida del jefe, que **llega desde la portada** | **Golpear los puntos débiles** antes de que se apaguen (1,5 s); si se apagan, el jefe golpea y pierdes un corazón. **Sin la runa no le haces daño**: la pista pasa de una ruta a otra | El héroe a la izquierda, el jefe a la derecha; al ganar, el jefe cae y se hunde |
| `/victoria` | «Victoria», puntuación, tiempo, lista de deseados y kit de prensa | — | El héroe y la runa, en grande |

El HUD (puntuación «1UP», corazones, tiempo) y el retrato con el inventario persisten entre rutas (`PageTransitionPersist`).

## 3. Diseño

Arcade de los noventa: negro azulado con rejilla, **rosa y cian de neón**, oro para el botín y líneas de CRT encima de todo.
**Anton** enorme para los titulares (la palabra de cada pantalla ocupa el ancho), **Press Start 2P** para el HUD y las
etiquetas. Botones con sombra dura desplazada, que se hunden al pulsar. Todo corta en seco: `steps()` en parpadeos,
temblores, destellos y en la barra de vida.

## 4. Cómo está hecho

- **`actorScene.tsx`**: un modelo animado con esqueleto en su lienzo. Encuadra midiendo la **malla deformada por los
  huesos** (`getVertexPosition`) en seis instantes de su animación: alto y radio horizontal alrededor de su eje. La cámara se
  aparta para que quepa en el lado más estrecho del lienzo. Admite un tramo del clip (`loop.from/to`), una animación «una
  vez» (`once` + `play`) y una pose de reposo (`rest`). También el golpe (destello emisivo rojo y retroceso con muelle), la
  derrota (cae y se hunde) y el recuadro que ocupa en pantalla (`screen`), donde la página pone los puntos débiles.
- **Tres `Traveler`** en el Shell: héroe, runa y jefe, con huecos en cada ruta y prioridades (la arena manda sobre el HUD).
- **Temblor sin mover el HUD**: el temblor va en el contenido (`.rn-main`), no en el marco. Un `transform` en un antecesor
  convierte a los `position: fixed` en relativos a él: el HUD saltaría.

## 5. Trampas que salieron

1. **Un clip con tres animaciones seguidas.** El del jefe trae pose en T (0–0,07 s), reposo (0,07–3 s) y andar
   (3,03–4,33 s): se vio leyendo los fotogramas clave con gltf-transform y se recorta con `AnimationUtils.subclip`.
2. **El cofre salía abierto.** Sin indicar animación se elegía «la primera que no sea la de abrir», es decir, la de
   **cerrar en bucle**. Ahora reposa en el último fotograma de `A_Close` y abre con `A_Open` al ganar.
3. **Puntos débiles fuera de pantalla.** El recuadro del jefe se proyectaba con la cámara recién movida, pero su matriz solo
   se actualiza al pintar: salían a −13.000 px. Hay que llamar a `camera.updateMatrixWorld()` antes de `project()`.
4. **Doble golpe.** `onPointerDown` y `onClick` en el mismo botón restaban vida dos veces (el segundo veía aún el punto).
   Queda solo `onClick`, que además sirve con teclado.
5. **La optimización y los esqueletos.** El registro de `models:fetch` dice «Removed Skin»: `prune` quita una piel
   duplicada, no la buena. Comprobado con gltf-transform: cada modelo conserva sus pieles, sus mallas con esqueleto y sus
   animaciones.

## 6. Comprobado

Con Playwright (Chromium) a 1440 y 390 px se jugó la partida entera: título → «Pulsa start» → elegir a la doctora →
forzar la cerradura (la prueba pulsa cuando la aguja está en la zona) → coger la runa → glitch al trono → cinco golpes →
victoria. También en producción (`next start`, con la CSP), sin errores.

## 7. Pendiente

- **Sonido** (8 bits) con botón de silencio: es lo que más falta en una web de juego.
- **Tráiler** en la portada y **capturas** descargables en el kit de prensa (es lo que piden los periodistas).
- Más de un jefe o una planta aleatoria, para que la demo se pueda repetir.
- Un **modo sin 3D** más rico (ahora, sin WebGL o con movimiento reducido, las pantallas quedan sin modelos).
