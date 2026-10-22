# 24 · Historia interactiva entre rutas: la web «Maravillas»

> 22-10-2026. Reto: buscar modelos 3D y construir una **historia interactiva** con **animaciones y juegos entre rutas**,
> con lo aprendido en Travesía ([14](./14-transiciones-entre-rutas.md)) y en las últimas demos (Quilate, Ánima, Cota), con
> **letras grandes y diseño editorial**. Sin preguntar: cada duda se resolvió buscando contexto real. La web está en
> `/sitios/maravillas` (`components/sites/maravillas/`).

## 1. Qué se decidió y por qué

| Duda | Cómo se resolvió | Decisión |
|---|---|---|
| ¿Qué historia? | Las demos 3D ya cubrían producto (Quilate), personaje (Ánima) y datos (Cota). Faltaba **juego y narración por rutas**. Los gabinetes de curiosidades de museo ya se gamifican en la web (el de las [Fundaciones Francke](https://bildung.francke-halle.de/en/development/facilities/krokoseum-childrens-creative-centre/discover-the-wunderkammer-with-suddenlife-gaming) cuenta su Wunderkammer con juegos; el [museo de Humboldt](https://humboldtmuseum.humboldt.ca/node/1595) tiene juegos de emparejar y preguntas), pero sin 3D | Un **gabinete de curiosidades** ficticio (Albarracín, 1894) que hay que recomponer: cuatro piezas, cuatro salas, cuatro juegos |
| ¿Qué miran hoy las webs premiadas? | Las SOTD de Awwwards del 13 al 22-10-2026 (Cartier · Le Chœur des Pierres, Pegassi, FORMAT, Belgrade Arbor, Overworld Audio…): objeto 3D protagonista y transiciones con algo que persiste. Ya estaban en la 14 y la 15 | El objeto que persiste es **la pieza 3D**; la tipografía también viaja |
| ¿Qué modelos? | `npm run models:fetch -- buscar` en Sketchfab (CC BY y CC0), mirando articulación | Nautilo (Hailey Majewski), amonites y astrolabio (**escaneos de museo**, Museos Virtuales de Malopolska) y un reloj de bolsillo con **agujas y tapa sueltas** (adsky_pes) |
| ¿Los datos del texto son ciertos? | Búsquedas: el nautilo **no** sigue la proporción áurea: se triplica por vuelta, una espiral áurea crecería ≈6,85 ([Science News](https://www.sciencenews.org/?p=26206), [Science Friday](https://www.sciencefriday.com/educational-resources/nautilus-shell-golden-ratio/)). El *Euaspidoceras* es del Oxfordiense, ≈154–161 Ma ([Wikipedia](https://en.wikipedia.org/wiki/Euaspidoceras_perarmatum)). Con un astrolabio se sabía la hora de noche apuntando a una estrella con la alidada ([Sky at Night](https://www.skyatnightmagazine.com/top-astronomy-kit/astrolabe), [arXiv](https://arxiv.org/pdf/1202.2005)) | El texto lo cuenta así; lo inventado (Ordás, la tormenta, la hora) se presenta como ficción |
| ¿Qué pieza nueva para el kit? | `grep` en `components/ui`: no había nada para rascar | **`ScratchReveal`**: rascar para revelar (sedimento, lámina de rasca y gana, color plano), con progreso y umbral |

## 2. El guion

Un prólogo, cuatro salas y una vitrina. Cada sala es una ruta, con un juego que se juega **sobre la pieza 3D**, y lo que
se gana en una sala resuelve la siguiente:

| Ruta | Pieza | Juego | Lo que da al ganar |
|---|---|---|---|
| `/` Prólogo | — | Índice tipográfico: al señalar una sala, su pieza aparece en la vista previa | — |
| `/sala/mar` | Nautilo | **La espiral**: arrastrar la concha hasta verla de frente, como en el dibujo del cuaderno (espiral ×3 por vuelta) | «La piedra dirá a quién mirar» |
| `/sala/tierra` | Amonites | **La excavación**: rascar el sedimento (`ScratchReveal`) | Grabado en la roca: **VEGA** |
| `/sala/cielo` | Astrolabio | **La altura**: girar la alidada hasta una estrella y soltar; solo vale la que dice la piedra | «Vega, a su altura de las **3:40**» |
| `/sala/tiempo` | Reloj | **La hora**: arrastrar alrededor de la esfera; la minutera sigue al puntero y la horaria avanza con cada vuelta | El reloj vuelve a andar |
| `/vitrina` | Las cuatro | Las piezas recuperadas vuelan del estante a su hueco en un **armario de gabinete** (nogal, fondo de terciopelo, dos baldas con foco y cartela de museo) | Tiempo total de la partida |

Se puede ir en cualquier orden: si falta una pista, la sala lo dice y enlaza con la que la tiene. Todo se juega también con
teclado (flechas y Enter) y el sedimento tiene un botón para revelar sin rascar.

## 3. Animaciones entre rutas (lo que viene de cada demo)

- **Travesía → la pieza que persiste.** Cada pieza es un `Traveler` que vive en el Shell, con cuatro huecos posibles:
  `indice` (vista previa), `sala` (el juego), `estante` (la cabecera, fija) y `vitrina`. Al pulsar una sala, la misma pieza
  vuela de la vista previa a la sala; al salir de la sala, vuela al estante; al abrir la vitrina, las cuatro bajan del
  estante, escalonadas (`delay`). Sin desmontar el lienzo.
- **Travesía → el título que viaja.** La palabra de la sala en el índice («Mar», «Tierra»…) es el titular gigante de la
  sala y la palabra de «Siguiente sala» al pie: `SharedText` con el mismo nombre, así que la palabra pequeña del pie crece
  hasta el titular de la sala siguiente. La página cambia con un barrido del color de la marca (`PageTransition kind="wipe"`).
- **Ánima (laboratorio) → mover entre huecos sin navegar.** «Guardar en el estante» cambia de hueco dentro de un
  `startTransition`: la pieza vuela a la cabecera en la misma página.
- **Ánima y Cota → la pose como contrato.** La página escribe la pose (`PiecePose`: giro, minutos del reloj, ángulo de la
  alidada) y la escena la lee en cada fotograma, con amortiguación. El viajero tiene `pointer-events: none`: el gesto lo
  recibe el panel de la página que está debajo, y la escena solo dibuja.
- **Quilate → el objeto dentro del texto.** La palabra enorme va detrás y la pieza delante, a caballo entre las letras.

## 4. Diseño editorial

Papel (`#efe9de`) con grano de puntos, tinta casi negra, bermellón de acento y verde azulado de segundo color. **Bodoni
Moda** para los titulares, en tamaños de cartel (la palabra de cada sala mide entre 24 y 40 vw), **Instrument Sans** para leer
y **Geist Mono** para las etiquetas. Filetes finos, columnas con filete, capitulares, entradilla en cursiva y una ficha de
cada pieza con el crédito del modelo. En móvil la palabra va arriba y la pieza la pisa por debajo.

## 5. Trampas que salieron (y cómo se arreglaron)

1. **Modificar el `scene` de `useGLTF` dentro de un `useMemo`.** En desarrollo React ejecuta el memo dos veces: el segundo
   `holder.add(scene)` le quitaba el modelo al primer contenedor y el lienzo salía vacío. Ahora se mide sobre un clon
   (`scene.clone(true)`, comparte geometrías) y el `scene` se monta tal cual dentro de un grupo con la rotación.
2. **Crear un `AnimationMixer` en un memo.** La limpieza del doble montaje de desarrollo paraba la acción y no se volvía a
   lanzar: la tapa del reloj no se abría. El mezclador va en un efecto.
3. **Cuantizar recentra las mallas.** Al quitar Draco (la CSP no deja WebAssembly) y cuantizar, cada malla se recentra en su
   caja: el origen de las agujas ya no está en el eje y girarlas las desplazaba. Se mete cada aguja en un **pivote** en el
   pasador central (`pivotHand`) y se mide hacia dónde apunta de origen.
4. **Modelos con orientación propia.** Los escaneos vienen torcidos: la normal de cada pieza se calculó con **PCA de los
   vértices** (la dirección de menor varianza en una pieza plana) y la escena la lleva a +z. El reloj, además, enseña la
   tapa trasera por +z y la esfera en espejo: se mira desde −z y se refleja en x.
5. **gltfjsx con una malla y unas líneas que comparten material** declara el material dos veces, y si el modelo no tiene
   animaciones el componente se quedaba sin importar `ThreeElements`. Lo segundo está arreglado en `models:fetch`; lo
   primero se corrigió a mano en `components/models/Astrolabio.tsx`.

6. **El modelo se cortaba en móvil.** La cámara estaba a una distancia fija pensada para un lienzo cuadrado y la pieza de
   frente: en lienzos verticales (la vitrina en móvil), al girar o con la tapa del reloj abierta se salía del cuadro. Ahora
   cada pieza mide la **esfera que la envuelve** (el vértice más lejano del centro, el reloj con la tapa abierta) y
   `FitCamera` aparta la cámara para que esa esfera quepa en el lado más estrecho del lienzo. Como el encuadre cambia con
   la pantalla, el eje de los juegos (el pasador del reloj, el de la alidada) ya no es una constante: la escena lo proyecta
   en cada fotograma y la página mide los ángulos desde ahí.

## 6. Comprobado

Con Playwright (Chromium, SwiftShader) a 1440 y 390 px se jugó la partida entera: índice → sala I (girar) → estante → sala
II (rascar) → sala III (Deneb da error, Vega gana) → sala IV (hora equivocada y luego las 3:40 con teclado) → vitrina con las
cuatro piezas y el tiempo. Se capturaron los vuelos a mitad de transición (animaciones a ¼ de velocidad). En producción
(`next start`, con la CSP), sin errores en consola.

## 7. Pendiente

- Hasta cuatro lienzos WebGL a la vez en la vitrina: medir en un móvil modesto y, si pesa, pintar las piezas del estante
  una vez y congelarlas (`frameloop="demand"`).
- Sonido opcional (el clic de la alidada, el tictac al ganar).
- Un modo «visita guiada» que encadene las salas sin juego, para quien solo quiera leer.
