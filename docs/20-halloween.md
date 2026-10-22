# 20 · Ánima: una fiesta de Halloween con una calavera 3D procedural

> Ronda 10 (21-10-2026). Petición: «otra demo similar a Quilate, pero de miedo, con calaveras: un evento de Halloween». La web
> es **Ánima** (`/sitios/anima`, `components/sites/anima/`), una fiesta ficticia en Valencia el 31 de octubre. Reutiliza la
> fórmula de Quilate (docs/19 §7) y estrena dos cosas: una **calavera modelada con una función de distancia** y la pieza
> de kit **`Countdown`**.

**Referencias.** La búsqueda en Awwwards (SOTD de 2025 con Halloween, calaveras o three.js) no dio ninguna web premiada del
tema; se parte de la fórmula de Quilate, ya medida, y del lenguaje habitual de los eventos (fecha, lugar, entradas y cuenta
atrás desde la portada).

## 1. La noche contada en actos

La portada dice qué es, cuándo y dónde: «La fiesta de Halloween más terrorífica de Valencia», 31 de octubre, con la
cuenta atrás y dos llamadas (entradas y programa). Después, la noche en seis actos, cada uno con su hora:

| Acto | Hora | Cuadro | La calavera | Interludio (cintas) |
|---|---|---|---|---|
| 01 La puerta | 21:00 | precios y maquillaje gratis | de tres cuartos, despertando | «Niebla · calabazas · velas» / «La noche más larga del año» |
| 02 El pasaje | 21:30 | pasaje del terror de 90 m | la cámara entra en la cuenca | «No mires atrás» / «Seis personas · diez minutos · ninguna salida» |
| 03 La pista | 22:00 | tres DJs, dos salas | castañetea al ritmo | «Bailar hasta que salga el sol» / «Techno · Thriller · gritos» |
| 04 El concurso | 1:00 | 500 € al mejor disfraz | se pone el sombrero pirata; después, el trío de piratas | «Calaveras · brujas · vampiros» / «El público vota, el jurado decide» |
| 05 La cena de los muertos | 21:00–4:00 | food trucks y barra | la boca abierta, masticando | «Pan de muerto · ponche · tacos» / «Se come con las manos» |
| 06 Medianoche | 0:00 | un minuto a oscuras y fuego | los ojos en rojo, riendo | «Un minuto a oscuras» / «Y después, fuego» |

Todo como en Quilate:
- **Capas** (de atrás adelante): salas de niebla de color, líneas técnicas, cintas de detrás y prólogo, cuadros, calavera y
  cintas de delante.
- **Cuadros**: de cristal, suben con el scroll, llegan desde abajo desenfocados y se van por arriba, por detrás de la calavera.
- **Prólogo**: el manifiesto se rellena palabra a palabra; en escritorio, a la izquierda; en móvil, a pantalla completa.
- **Navegación**: isla con hamburguesa, menú de vidrio a todo el alto y barra inferior suave.

Las cintas van en **Jacquard 24** (gótica) y los titulares en **Gloock**. Las salas son degradados en CSS (violeta,
calabaza, verde y sangre) que se funden al ritmo del scroll.

## 2. La calavera

**La calavera pirata** (desde el 21-10-2026; `PirateSkull` en `skullScene.tsx`):
- **El modelo**: «The Halloween Pirate Skull», de Machin, en
  [Sketchfab](https://sketchfab.com/3d-models/the-halloween-pirate-skull-7743a10d48d74c8e814fa5b6759e1ddb), con licencia
  CC BY 4.0 (se cita en el pie de Ánima).
- **Cómo llegó**: con `npm run models:fetch -- bajar sketchfab:7743a10d48d74c8e814fa5b6759e1ddb calavera-pirata --partes`
  (el script de modelos, docs/README).
- **Se eligió por venir articulada**: el script la midió «por piezas» (cráneo, mandíbula, dientes de arriba y de abajo,
  ojo y sombrero, con nombre) frente a otra animada con esqueleto que parecía un escáner médico.
- **Optimización**: gltfjsx (`--transform --keepmeshes`: texturas WebP de 1024, sin juntar mallas) y la cuantización la dejan en
  0,81 MB de 4,58 MB, sin Draco (la CSP de producción no deja compilar WebAssembly); el original no se guarda. `components/models/CalaveraPirata.tsx` es su mapa de piezas.
- **Mandíbula**: su animación original es una actuación de 20 s (el sombrero bota, el cráneo gira), no una bisagra.
  La escena cuelga la mandíbula de un pivote en los cóndilos, calculado con su caja (arriba y atrás), y la mueve con
  `jaw` y `talk`. El modelo viene con la boca abierta: `JAW_SHUT` (−0,42 rad) la cierra.
- **Brillo**: las runas y el ojo usan su propio mapa emisivo, con la intensidad de `eye`. En la medianoche el ojo
  pierde su mapa y pasa a rojo; una luz puntual en la cuenca tiñe el hueso de verde fantasma o de rojo.
- **El ojo**: el del modelo (una esfera con textura, borrosa de cerca) se oculta y en su sitio va una **gema tallada** con el
  material de trazado de rayos de Quilate, que pasa al kit como motor `lib/gems/` (`gemMaterial.ts`, `brilliant.ts`,
  `environment.ts`, la caja de luz de respaldo, y `hdr.ts`, el HDR de taller y el índice de escaparate). Quilate lo importa desde ahí.
  - **La talla**: brillante, de radio 2 veces el ojo original (llena la cuenca), con la mesa hacia fuera; gira despacio
    para que las facetas centelleen. El foco del material (`uKeyI`) sale de la cámara.
  - **Luz interior**: uniforme nuevo `uGlow` en el material (0 por defecto, así que Quilate no cambia). Sale por las
    facetas teñida por la absorción, más fuerte de frente. Cada ~7 s hay un destello (sube en 0,35 s y se apaga en
    1,2 s) que también enciende la luz puntual de la cuenca.
  - **Una piedra por calavera** (`EYE_GEMS`): la del centro, verde, pasa a rojo a medianoche; en el trío, azul a la
    izquierda e incolora a la derecha. La luz de la cuenca toma el color de su piedra.
  - **Por qué no brillaba como en Quilate** (corregido): tenía índice de refracción, pero el de una esmeralda (1,575: poca
    reflexión interna y casi sin dispersión), la caja de luz sintética en vez del HDR y el foco desde la cámara. Ahora
    lleva lo mismo que el solitario de Quilate: el HDR de taller (`lib/gems/hdr.ts`, compartido por las tres calaveras),
    el índice «de escaparate» `SHOW_DIAMOND_IOR` (2,65–2,88) en las tres piedras (solo cambia el color de absorción) y un
    foco que barre despacio la gema.
  - **Con la cámara dentro de la cuenca** (`close`), el brillo del hueso y la luz de la cuenca bajan, para que mande la
    gema.
- **El sombrero** (`hat`) cae sobre la cabeza en el acto del concurso de disfraces. El trío son tres piratas con sombrero.
- **Escala**: 1,15 de alto en la escena (cráneo y mandíbula), centrada en el círculo del HUD. La caja se mide solo con `Skull_low` y `Jaw_low`: `Box3.setFromObject` cuenta también los objetos ocultos, así que esconder el sombrero no bastaba, el centro subía y la calavera quedaba descolgada bajo el HUD.
- **Final**: el último interludio aleja la cámara (`zoom` 1,05, antes 0,68) para que la calavera quede entera y centrada.
  El escenario no lleva fundido abajo (al contrario que Quilate): el último tramo mide 190svh, calculado para que el
  escenario fijo se suelte justo después de que se apaguen sus cintas, y sube con la calavera entera antes de que siga
  la web.
- **Respaldo**: si el GLB no carga, entra la calavera procedural (abajo).
- **Antes**: se probó el cráneo anatómico de Khronos (*Skull*, de Vladimir Petkovic, CC0). Venía en una sola pieza y hubo
  que partir la mandíbula a mano por un perfil (la línea de la boca, la rama y la coronoides bajo el arco). Funcionaba,
  pero dejaba lascas junto a la oreja; queda descartado.

**La calavera procedural** (`skullGeometry.ts`, `skullScene.tsx`; la primera versión, ahora de respaldo)

- **Modelado con una función de distancia (SDF)**, sin modelos que descargar:
  - el cráneo, a base de elipsoides y cápsulas con uniones suaves (`smin`): bóveda, cara, cejas, pómulos, arco cigomático
    y maxilar;
  - con restas suaves para la nuca, las sienes, el hundido bajo los pómulos, las cuencas y la nariz;
  - la mandíbula, aparte, para que se abra sobre su bisagra;
  - los dientes, cajas en arco: incisivos, colmillos más largos y muelas más anchas.
- **Triangulación con `MarchingCubes` de three**: la escena rellena su campo con la SDF (`field = −sdf`, `isolation = 0`) y
  copia el resultado a una geometría estática. Resolución 92 para la principal y 60 para las acompañantes; se triangula
  una vez y se comparte.
- **Oclusión ambiental por vértice** con la propia SDF: se mira a lo largo de la normal cuánto espacio libre hay. Va como
  color de vértice y oscurece las cuencas, la nariz y las juntas sin texturas ni pasadas extra.
- **Luz**: luna fría arriba, un relleno cálido, una vela abajo que parpadea (tres senos) y un contraluz verde. Los ojos son
  ascuas con un halo y una luz puntual muy baja (si no, queman las paredes de la cuenca); pasan de naranja a rojo con `red`.
- **Ambiente**: ascuas que suben (220 puntos aditivos) y bancos de niebla que derivan.
- **Pose por scroll** (`SkullPose`): `yaw`, `x`, `y`, `zoom`, `jaw`, `talk` (castañeteo), `eye`, `red`, `close` (la cámara
  en la cuenca), `split` (la tapa sube y la mandíbula baja) y `trio` (dos calaveras más a los lados).
- **En móvil**: centrada en la mitad de arriba, sin trío y con la cámara menos dentro de la cuenca. Las líneas técnicas
  se centran en lo que enseña la cámara (`focus`).
- **Sin WebGL o con movimiento reducido**: una calavera plana en SVG (`SkullFlat`).

## 2b. El HUD: humo de fluido por acto (`FluidSmoke.tsx`) y eclipse de fuego (`FireRing.tsx`)

**Humo de fluido** (actos 01–05), siguiendo [21](./21-simulacion-fluidos-threejs.md):
- **El simulador**: *Stable Fluids* de Pavel Dobryakov en WebGL2 sin three, en un lienzo a pantalla completa por detrás de
  la calavera y de los cuadros.
  - Texturas RGBA16F con doble búfer (*ping-pong*) para velocidad, color y presión; divergencia y curl, sencillas.
  - Por fotograma: inyectar, curl, *vorticity confinement*, divergencia, presión (Jacobi, 20 iteraciones; 12 en móvil),
    restar el gradiente y advección semilagrangiana de la velocidad y del color.
  - Resolución: velocidad a 128 (96 en móvil) y color a 512 (320).
- **Emisores** alrededor del círculo del HUD (centro: lo que enseña la cámara, `focus`; radio: el del HUD). Un ajuste por
  acto en `SMOKES` (forma, colores, disipación de color y de velocidad, curl, radio y fuerza del pincel, ritmo):

  | Acto | Humo | Forma |
  |---|---|---|
  | 01 La puerta | niebla baja y fría | franja bajo la calavera, de lado |
  | 02 El pasaje | ectoplasma verde | gira alrededor del círculo (tangencial y algo hacia fuera) |
  | 03 La pista | bocanadas violeta, magenta y cian | golpes de nueve chorros hacia fuera, 2,2 por segundo |
  | 04 El concurso | bengala roja y naranja | sube del arco de abajo |
  | 05 La cena | vapor cálido | sube, suave y ancho |
  | 06 Medianoche | (eclipse de fuego, abajo) | — |

- **Ratón**: arrastra el humo (pinceladas con la velocidad del puntero), como en el tutorial.
- **Ahorro**: tras 4 s sin emisión deja de simular. En móvil, la mitad de color. Sin WebGL2 con
  `EXT_color_buffer_float` o con movimiento reducido, no pinta.

**Eclipse de fuego** (`FireRing.tsx`), solo en el acto 06:

Un lienzo WebGL propio (sin three) 1,9 veces el HUD, centrado en la calavera y por detrás
de ella. Sigue la imagen de referencia (un eclipse con corona de fuego). El tutorial de YouTube que se pasó no se pudo ver,
así que se hizo con la técnica habitual: ruido fractal (fbm) en coordenadas polares. Capas del *shader*:
- un disco oscuro semitransparente (el eclipse) con un borde incandescente;
- llamas: fbm sobre la dirección (sin costura en el ángulo), desplazado hacia fuera con el tiempo; la altura de cada llama
  sale del ruido;
- un halo de calor ancho, rayos finos (90 franjas angulares que parpadean), chispas que salen hacia fuera y humo gris que
  sube despacio;
- color de brasa a blanco, que pasa a rojo sangre con `red` (medianoche).

El radio y la intensidad salen del mismo progreso de scroll que las salas (`fire` en `Home`): el radio del HUD del paso
y la intensidad, la suma de pesos de los pasos con HUD. Sin intensidad no pinta. Con movimiento reducido, quieto.
Resolución moderada (hasta 720 px de lado). Quedan solo los rótulos del SVG.

**Trampa**: no llamar a `loseContext()` al desmontar. En desarrollo (StrictMode) el efecto se repite sobre el mismo
`<canvas>`, y un contexto perdido se queda perdido y se pinta en blanco; basta con borrar el programa y el búfer. Y en
GLSL ES, `smoothstep` con los bordes invertidos no está definido: se usa `1 − smoothstep(...)`.

## 2c. El navbar: `ModelNav` (kit)

Pieza nueva del kit, `components/ui/ModelNav.tsx`: una `IslandNav` con un **modelo 3D acoplado en el centro**.
- **El medallón**: de vidrio, sobresale de la píldora y lleva cualquier escena de react-three-fiber (`model`). El lienzo
  mide 1,6 veces el medallón, así que el modelo puede asomar por arriba (el sombrero).
- **El puntero**: el medallón inclina el modelo hacia él; dentro del modelo, `useModelNavPointer()` dice dónde está y lo
  cerca que pasa (`near`, de 0 a 1).
- **Accesibilidad**: la marca sigue debajo, invisible, como enlace y nombre accesible; el medallón no recibe clics.
- **Carga**: three solo baja cuando hay modelo (`lib/modelnav/scene.tsx`, perezoso). Sin WebGL o con movimiento reducido,
  se ve la marca. Al cambiar el modelo (`modelKey`), el medallón vuelve a entrar con su animación.
- **En Ánima**: en la portada no hay modelo (la calavera ya está en el recorrido); en las páginas interiores, la calavera
  pirata con sombrero (`navSkull.tsx`, también perezoso). Reaprovecha `buildPirate` y abre la boca y enciende las runas
  cuando el puntero se acerca.

## 2d. Modelos lúgubres en las páginas (`ObjectStage` con `src`)

Con `npm run models:fetch -- buscar "…" --caras 40000` (opción nueva, `max_face_count` de Sketchfab: los escaneos de museo
pasan del millón de caras) se eligieron dos modelos ligeros, bajados con `--partes`. El script ya solo guarda el
`-transformed.glb` (texturas WebP y geometría cuantizada, sin Draco: la CSP no deja compilar WebAssembly) y apunta a él los créditos.
- **`/entradas`**: «halloween magic grave» (vicente betoret ferrero, CC BY; 1,43 MB de 6,8): una lápida con una runa roja.
  Va junto al título, girando poco hacia el puntero (`follow` 0,35), con luz naranja (`glow="acc"`) y sin reflejos de
  estudio (`env="none"`, la luz viene horneada).
- **`/info`**: «Blue Eyeball (Free)» (Tom Hodes, CC BY; 0,17 MB de 2,2): un ojo que te sigue con la mirada (`follow` 1,2).

Ambos con una pieza del kit, `ObjectStage`, ampliada en vez de duplicada (guía §12). Opciones nuevas:
- `src`: un GLB en lugar de la forma, encuadrado en una esfera de radio 1,35;
- `modelRotation`, `follow`, `glow` y `env`.

En móvil, el objeto va encima del título.

## 2e. Viajes entre rutas: el laboratorio (`/laboratorio`)

Con `Traveler` del kit (la técnica de Travesía, docs/05). Dos viajeros viven en el Shell, dentro de un `TravelStage`, así
que son el mismo nodo vivo en todas las páginas:
- **La calavera en busto** (`skullBust.tsx` + `navSkull.tsx`, la escena de `ModelNav`).
- **La gema** (`gemBit.tsx`, lib/gems).

Cada página dice con un `TravelSlot` dónde van. La historia tiene tres gestos:
1. **Una gema sin dueño**, en una vitrina (hueco `vitrina`).
2. **Al pulsarla**, se monta otro hueco (`ojo`) dentro de `startTransition` y la gema vuela a la cuenca.
   - El hueco se coloca donde está la cuenca en ese momento: el busto la proyecta en cada fotograma (`bustEye.ts`), aunque
     se esté inclinando hacia el puntero.
   - Al llegar, la calavera la toma como ojo (estado en el Shell y en `sessionStorage`: dura al navegar) y el viajero se va.
3. **«Que vigile la noche»** navega al programa y la calavera, la misma, vuela del laboratorio al hueco del navbar.

**Navbar mínimo** (`ModelNav` con `emblem` nuevo, que acepta cualquier nodo):
- Sin texto «Ánima»: menú (icono), el hueco de la calavera (fuera de la portada) y «Entradas» con un icono de tique (en
  móvil, solo el icono).
- Fija (`hideOnScroll={false}`): la calavera que viaja hasta ella es `fixed` y no seguiría a una cabecera que se esconde.
- La calavera del navbar va por encima del cristal del medallón (`z-index` 45) y sin recibir clics.

## 2f. La calavera reacciona: mirada, cabeceo y golpes (sin motor de físicas)

- **Mira al puntero** con retraso (±0,32 rad de giro, ±0,18 de cabeceo) y, de vez en cuando, cabecea hacia abajo (un pico
  suave cada ~30 s).
- **Más abajo**: `y` −0,07 en todo el recorrido (la cabeza tendía a quedar alta).
- **Golpes**: un clic sobre la calavera, o una pasada rápida del ratón por encima, empujan dos muelles amortiguados (la
  mandíbula se balancea y la cabeza retrocede hacia el lado del golpe). Se detecta proyectando el centro y el radio de la
  calavera en pantalla: el lienzo no recibe eventos.
- **¿Físicas con una librería?** Se evaluó `@react-three/rapier` (Rapier en WebAssembly): articular la mandíbula con una
  junta de bisagra daría el mismo balanceo, pero Rapier compila WebAssembly, que **la CSP de producción no permite**
  (falta `'wasm-unsafe-eval'` en `script-src`), y añade ~1 MB. Para un objeto con una bisagra y un retroceso, un muelle
  `x'' = −k·x − c·x'` integrado en `useFrame` da lo mismo en unas líneas. Rapier compensa cuando hay muchos cuerpos que
  chocan entre sí (dados, piezas que caen, un péndulo de cadena); entonces hay que añadir `'wasm-unsafe-eval'` a la CSP.

## 2g. Portada: la calavera es la O de «HALLOWEEN»

El titular, en la gótica de la marca y ajustado al ancho, tiene un hueco del tamaño de una O. `Home` mide el hueco: su
alto da el `zoom` de la pose de la portada y, en cada fotograma del primer tramo, su centro da `x` e `y`. Así la calavera
sube con el texto al bajar y, cuando el tramo la suelta, sale del titular hacia el prólogo. Nada tapa la calavera: subtítulo,
llamadas y cuenta atrás van debajo.

## 2h. WebAssembly y la CSP

La CSP de producción (`next.config.ts`) no permite compilar WebAssembly. Por eso:
- **Draco y meshopt fuera**: `models:fetch` cuantiza en vez de comprimir con Draco (`-- sin-draco archivo.glb` para
  cualquier GLB).
- **`useGLTF(url, false, false)` en todas partes**: drei activa meshopt por defecto, y su decodificador compila
  WebAssembly nada más importarse, aunque el modelo no lo use.
- Probado con `next start` (en desarrollo no hay CSP): sin errores en la consola.

## 3. Páginas

- **Programa**: `Timeline` del kit con las horas y los seis actos con su detalle.
- **Entradas**:
  - tipo (`OptionPicker`, con la anticipada agotada), cantidad (`QuantityStepper`, hasta 8) y nombre;
  - resumen con los gastos de gestión y una «reserva» de mentira que da un QR;
  - no hay formulario de pago ni se piden datos de pago.
- **Info**: lugar, normas (edad, accesibilidad, avisos de luces estroboscópicas, pago) y preguntas frecuentes.
- **Datos estructurados**: JSON-LD `Event` con fechas, lugar y entradas en venta.

## 4. Pieza nueva del kit: `Countdown`

Cuenta atrás hasta una fecha (eventos, lanzamientos, rebajas), en `components/ui/Countdown.tsx` y en el catálogo (datos):
- **Cálculo**: en el navegador; antes de hidratar enseña guiones, sin desajustes. Se alinea con el cambio de segundo para
  que todas las cifras salten a la vez.
- **Cifras**: entran con un desplazamiento al cambiar (sin animación con movimiento reducido).
- **Al llegar a cero**: enseña el texto de `done`.
- **Accesibilidad**: `role="timer"`, con la fecha en un `<time>`. El texto para lectores de pantalla se actualiza al
  minuto, no al segundo.
- **Estilo**: sirve con las nueve variantes.

## 5. Pendiente

- Probar la calavera en un móvil real (coste de MarchingCubes a resolución 92 en la primera carga: unos cientos de ms).
- Una variante «calavera de azúcar» (Día de Muertos) pintada con una textura proyectada.
