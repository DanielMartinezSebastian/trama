# 27 · Primer estudio real: Plain Sight (campo tipográfico) y verificación del método

> Ronda 15 (24-10-2026), fase 4 del método de cine 3D (docs/26). Tres webs de la portada de threejs.org capturadas, una
> estudiada a fondo, recreada y llevada al kit como **`TypeField`**, y la verificación de si el proceso dio lo que se
> esperaba de él. Ronda 16 (24-10-2026): vueltas 8–11 (la coreografía letra a letra, §3b) y `TypeField` en tema oscuro.

## 0. Conclusiones

1. **El método funciona con una web real que no es nuestra.** De [Plain Sight](https://motion-pieces.pages.dev/plain-sight/)
   (motion-pieces) salieron, medidos, el render, la luz y la sombra, la niebla, la cámara (con su alabeo), la rejilla de
   letras, las palabras escondidas con su color y su celda, la coreografía del scroll (rampas, rebote, onda de vuelta) y la
   interacción del puntero. La recreación quedó con la cámara a 0,4°, render, luz y niebla idénticos, la imagen a
   luminancia +0,003 y ΔE 1,2, y la coreografía al 12 % (de 80 %), con cada letra a 1–3 fotogramas de la referencia.
2. **Lo que el concepto tiene de verdad no está en ningún fotograma fijo.** Que el suelo se hunda en onda desde el centro
   mientras las palabras suben letra a letra en orden de lectura, que cada palabra rebote más al final, que bajen desde la
   última letra y que el puntero hunda con un anillo que se levanta alrededor solo salió comparando, fotograma a fotograma
   y copia a copia, el movimiento de las 1 288 instancias. El vídeo y la serie hicieron falta.
3. **Medir la envolvente engaña** (§3b): el máximo de todas las copias por fotograma mezcla letras que arrancan en
   momentos distintos y parece un muelle lento, sin escalonado y sin rebote a la vuelta. Las vueltas 1–7 lo dieron por
   bueno; ajustar copia a copia (vueltas 8–11) encontró los tres errores.
4. **El método tenía puntos ciegos y el estudio los encontró**: instancias (nada se movía en el origen de las mallas),
   materiales que se animan, shaders retocados con `onBeforeCompile`, colores lineales, sombras con caja propia, luz de
   cielo con su «arriba», webs sin escena visible y el reloj virtual con WebGPU asíncrono. Todos tienen ya respuesta en la
   herramienta (§5).
5. **El concepto ya es del kit**: `TypeField` (subruta `trama-ui/TypeField`), con fuente propia (Anton, OFL) y los
   colores del tema; y la pila de posprocesado TSL del banco pasa a `lib/postfx`. La pieza del banco usa el mismo motor del
   kit (`lib/typefield`), así que la calibración prueba el código que se publica.

## 1. Las tres candidatas (capturas de 4–6 s)

| Web | Lo medido | Valoración |
|---|---|---|
| [Plain Sight](https://motion-pieces.pages.dev/plain-sight/) | WebGL2, Neutral, luz de cielo + sol con sombra PCF, niebla lineal, 22 mallas, 356 000 triángulos, 44 llamadas | **Elegida**: concepto tipográfico (encaja en Trama), recreable sin sus recursos, el gancho la ve entera |
| [Hublot](https://hublot.darkroom.engineering/) | WebGPU + TSL, bloom, SMAA, desenfoques gaussianos, 1,4 M triángulos, 68 llamadas, sin luces (iluminación en nodos) | Muy de lo que se busca (WebGPU), pero la recreación necesita sus modelos |
| [Tidewater](https://dgreenheck.github.io/tidewater/) | **Sin escena**: three empaquetado sin sus efectos globales. Las etiquetas de 199 shaders WGSL cuentan la técnica: cielo atmosférico (Transmittance, MultiScat, SkyView), nubes volumétricas, entorno prefiltrado, océano FFT, sombra del terreno | Caso límite del método (§5) |

## 2. Plain Sight: la ficha

- **Render**: WebGLRenderer, tone mapping Neutral, sRGB, sombras PCF.
- **Cámara**: fija, fov 28 (39,5 mm), picada sobre el suelo, **alabeo −14,4°** (el horizonte inclinado).
- **Luz**: hemisférica (#ffffff / #8c8177, 1,6) con el cielo en +z; sol direccional 2,4 desde (−9, 7, 11) con sombra PCF de
  2048, caja ±15,6 (0,5–80), sesgo −0,0004, sesgo por normal 0,02 y radio 3: la sombra larga y dura es la que hace
  legibles las palabras.
- **Atmósfera**: niebla lineal #e4ddd3 de 20,6 a 29,9; sin fondo (el del lienzo).
- **Escena**: **56 × 23 = 1 288 columnas-letra** (paso 0,44 × 1,0), cada una de 0,47 × 1,0 × 6,5 con la cara de arriba en
  z = 0 y ±0,02 de altura al azar; **una `InstancedMesh` por letra** (22), color por instancia; un solo material estándar
  #e9e2d8, rugosidad 0,82, retocado con `onBeforeCompile`: la cara de arriba toma el color de la instancia y los laterales
  el 70 % (`vFace = objectNormal.z`).
- **Palabras**: ABOUT (azul, fila 4), CONTACT (verde, fila −2), WORKS (rojo, vertical) y NEWS (amarillo, vertical);
  **blancas en reposo**: escondidas a la vista.
- **Coreografía** (scroll, 150 px por golpe; medida copia a copia en la ronda 16, §3b):
  - el suelo baja −0,7 en **onda radial desde el centro** (arranca en el fotograma 18, más 1,7 fotogramas por unidad de
    distancia) con muelle con rebote (k 0,034, c 0,14 por fotograma; ζ 0,38);
  - las palabras suben +1,4 **letra a letra en orden de lectura** (3,75 fotogramas por letra; ABOUT de izquierda a
    derecha, WORKS y NEWS de arriba abajo), las cuatro a la vez, con un muelle más vivo (k 0,052) que **rebota más al
    final de cada palabra** (ζ 0,52 en la primera letra, 0,34 en la última: picos de 1,57 a 1,83);
  - meseta;
  - vuelta: el suelo, en la misma onda y con el mismo muelle, **con rebote** (+0,18); las palabras, **desde la última
    letra** (unos 3 fotogramas por letra);
  - el puntero hunde 0,27 en el centro con caída (1 − d/2,5)^1,4, levanta un anillo de 2,5 a 4,75 (≈ 0,005, como el
    material que se aparta) y tiñe de lavanda; deja huella (24 copias por encima de 0,05; 116 movidas).
- **Rúbrica** (a ojo, anclas de lib/cine/rubric.ts): cámara 4, luz 4, atmósfera 3, posprocesado 3, movimiento 4,
  interacción 4, interfaz 4, presupuesto 4.

## 3. La recreación, vuelta a vuelta

| Vuelta | Cambio | Coreografía | Imagen |
|---|---|---|---|
| 1 | Primera versión (fuente Helvetiker, umbral en vez de rampa) | 80 % (pico en 31, ref. 48) | 38 % |
| 2 | Rampas de subida y bajada | 68 % (pico 48 = 48) | 37 % |
| 3 | Radio y hundido del puntero medidos (127 copias) | 74 % | 38 % |
| 4 | Un muelle por celda y la vuelta en onda radial | 69 % | 38 % |
| 5 | Muelle de vuelta crítico (sin rebote) | 47 % | 38 % |
| 6 | Rampa ajustada (0,068–0,10) | 44 % | 38 % |
| 7 | Fuente Anton (OFL) y motor del kit | 44 % | **8 %** (luminancia 0,000, ΔE 0,9) |

| 8 | El suelo baja en onda radial (también a la ida) | 34 % | 38 % |
| 9 | Las palabras, letra a letra y con su muelle (ajustado letra a letra, no con la envolvente) | 23 % | 38 % |
| 10 | Vuelta con rebote (el mismo muelle) y la huella del puntero con su caída y su anillo | 17 % | 38 % |
| 11 | Las palabras bajan desde la última letra | **12 %** | 10 % (luminancia +0,003, ΔE 1,2) |

La imagen de la vuelta 11 es la del banco con el mismo material de la vuelta 7; el 8 % → 10 % sale del contraste (las
palabras a medio subir en otros fotogramas). El 12 % que queda es sobre todo la fracción de copias movidas (5 %): la cola
de los muelles por debajo de 0,001.

### 3b. Ajustar copia a copia (ronda 16)

La «zona del puntero que arranca primero» de la vuelta 7 resultó ser solo la huella del puntero (unas 45 copias en los
fotogramas 3–20). Lo demás salió de medir, por copia, el fotograma en que arranca y en que vuelve, y de ajustar el
muelle de cada letra por separado (simulando el mismo integrador del motor): `.refs3d/exp/arranque*.cjs`,
`ajuste-letras.cjs`, `ajuste-letra1.cjs`, `ajuste-suelo.cjs`, `ajuste-vuelta.cjs` y `vuelta-palabras.cjs`. El motor
ganó `onda.retrasoSubida`, `muellePalabras` (con amortiguación de la última letra), `escalonado`, `escalonadoVuelta` y
la `curva` y el `borde` del puntero; `TypeField` los usa con los mismos valores.

## 4. Verificación: lo esperado frente a lo obtenido

| Lo que se esperaba del método (docs/26 y el plan) | Resultado |
|---|---|
| Medir la técnica de una web real sin su código | **Sí** con three a la vista (Plain Sight, Hublot); **en parte** sin ella (Tidewater: shaders, etiquetas, red y vídeo en tiempo real, pero no la escena) |
| Un vídeo a fotograma exacto | **Sí**, salvo páginas que leen la GPU a destiempo (Tidewater con WebGPU: se apaga con el reloj virtual; con `--real` va bien). Ahora el análisis lo detecta y lo dice |
| Describir con un vocabulario cerrado | **Sí**, y el estudio lo amplió: instancias y su coreografía, transición de material, alabeo, sombra con caja, cielo con «arriba» |
| Recrear desde la ficha y acercarse midiendo | **Sí**: once vueltas guiadas por el comparador, de 80 % a 12 % en coreografía y de 38 % a 10 % en imagen (las cuatro últimas, ajustando copia a copia, §3b) |
| Que el comparador diga qué depurar | **Sí**: cada vuelta atacó el eje que encabezaba la tabla |
| Llevar al kit lo que funcione | **Sí**: `TypeField` + `lib/typefield` (el concepto) y `lib/postfx` (la pila TSL, que repite SSIM 0,996 tras la extracción) |
| El campo `cine` de las guías de estilo | **Aplazado**: ninguna guía tiene aún una referencia 3D medida; sería un campo vacío |
| SSIM alto como en la calibración | **No aplica**: con otra fuente y otro relleno de letras el parecido píxel a píxel es bajo (0,54) aunque el concepto sea el mismo; para una web real cuentan los ejes, no el SSIM |

## 5. Lo que el estudio añadió a la herramienta

- **Instancias** (`InstancedMesh`): número de copias y paleta de `instanceColor` en el inventario; por fotograma, cuántas
  copias se han desplazado, cuánto y en qué dirección. En el comparador, un eje nuevo: **coreografía de instancias**
  (desplazamiento máximo, medio y fracción de copias movidas, y el fotograma del pico).
- **Sombras**: caja de la cámara de sombras, sesgo, sesgo por normal y radio (gancho, ficha y banco).
- **Luz de cielo** con su posición (su «arriba»).
- **Sin escena**: aviso en la captura; las **etiquetas de los shaders** pasan a la ficha (en WebGPU suelen nombrar la
  técnica); el análisis avisa si la imagen se apaga sola con la cámara quieta y propone `--real`.
- **Tema oscuro en `TypeField`**: material blanco y el color de las letras en las instancias (`reposo`); con el material
  del color del fondo, las palabras se multiplicaban por un color oscuro y se apagaban. Relleno de más a los lados
  (`margen`) para lienzos más anchos que el de la referencia.
- **Reloj de la ficha para piezas propias** (`useRelojFicha`) y piezas registradas en `components/lab/cine/componentes.ts`.
- **Fuentes para texto 3D**: `scripts/font-typeface.mts` (TTF/OTF → typeface de three, solo los caracteres que hagan
  falta, con acentos y Ñ).

## 6. Trampas

1. **Una `InstancedMesh` está en el origen**: su movimiento está en `instanceMatrix`, no en la pose de la malla.
2. **`instanceColor` es lineal**: un «#0916ff» medido no es un hex sRGB.
3. **`onBeforeCompile` no existe en los materiales de nodos**: una pieza que lo use va con el motor clásico.
4. **El color de una palabra puede depender de su estado**: escondida (blanca) en reposo, de color al subir.
5. **R3F pone el puntero en el centro antes de cualquier evento**: un efecto de puntero se activa con el primer movimiento
   real, o la captura lo toma por posición inicial.
6. **Editar un archivo con la captura en marcha**: el `next dev` recompila y la captura falla sin avisar; esperar unos
   segundos o reintentar.
7. **La envolvente no es el movimiento**: el máximo por fotograma de muchas copias que arrancan escalonadas parece un
   muelle lento y sin rebote. Ajustar copia a copia (o letra a letra) antes de dar un muelle por medido.
8. **Material por color de instancia**: el color de instancia multiplica el del material. Con un material oscuro (tema
   oscuro), cualquier color de instancia se apaga: el material, blanco, y el tono en la instancia.

## 7. Pendiente

- Hublot como segundo estudio (WebGPU + TSL): pide modelos propios.
- Tidewater: medir sin escena (flujo óptico para la cámara, WebGPU Inspector para las pasadas).
- Un componente `PostFX` del kit cuando haya un lienzo WebGPU del kit que lo use; hoy `lib/postfx` es el motor.
