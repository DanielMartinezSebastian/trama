# 42 · Coherencia de las animaciones con el scroll

> 26-10-2026. El usuario: Quilate consiguió buenas curvas con el scroll, pero no consigue repetirlas en diseños nuevos
> con Trama. Hay herramientas y documentación, pero no salen buenas animaciones con el scroll. Investigación sobre el
> código de Quilate, las piezas del kit, los once sitios con scroll suave y las demos del laboratorio de cine.

## 0. Conclusiones

1. **La buena curva de Quilate no es una curva: es una tubería de tres etapas.** Cada una tapa un defecto distinto.

   | Etapa | Qué hace en Quilate | Sin ella |
   |---|---|---|
   | **1. Entrada con inercia** | Lenis con `lerp 0,04` y `wheelMultiplier 0,85`. La rueda deja una cola larga | Cada golpe de rueda es un salto |
   | **2. Mapeo por tramos con meseta** | El avance se mide entre los centros de los pasos (`[data-step]`), no en píxeles de página. El 30 % central de cada paso queda quieto (meseta) y el resto se recorre con una S (`smoothstep`). Las poses son fotogramas clave con nombre (`BEATS`) | Las cosas se mueven siempre, nunca «llegan». O llegan tarde, cuando el texto ya ha pasado |
   | **3. Seguimiento amortiguado** | La escena no salta a la pose: la persigue con `k = min(1, dt·9)` (pose) y `dt·4` (aspecto) | Lo que se mueve hereda cada irregularidad del scroll |

   Además, **una sola variable de tiempo `t` gobierna todo lo de un tramo**: la pose del 3D, el fundido de las salas
   (`--w<k>`), las cintas (`--r<k>`, `--o<k>`), los cuadros y el HUD. Por eso todo «respira» a la vez.

2. **Trama solo empaqueta una de las tres etapas.**
   - `useScrollStory` (`lib/story`) es la etapa 2. Ni Quilate lo usa: lleva su propia copia, y solo lo usan Ánima, Cota y
     `PointCloud`.
   - La etapa 1 (`SmoothScroll`) existe, pero cada web la configura a su manera. Valor por defecto 0,1, frente al 0,04 de
     Quilate. Siete de los once sitios usan el de por defecto.
   - **La etapa 3 no existe en el kit.** Cada escena escribe su `lerp` a mano.

3. **Las piezas de scroll del kit se saltan la tubería.**
   - `PinnedSection`, `ScrubText` y `Parallax` no tienen ninguna curva: mapean el progreso 1:1.
   - `ChapterStage`, `ProjectReel` y `FlameHorizon` (ronda 25) traen cada una su curva.
   - El banco de Meer Mohsin que hice (`RelatoMeer`) usa `scrollY` lineal, sin meseta ni amortiguado. **Es el mismo error
     que el usuario no consigue evitar en sus diseños**: componer piezas que miden el scroll cada una a su manera.

4. **Cada uno mide el avance en su unidad.** `scrollY` en píxeles, `pinProgress` sobre el alto de la sección,
   `useScrollStory` entre centros de pasos y `lib/scroll/track` con GSAP y `power2.out` de 0,6 s. Hay dos funciones
   `trackScroll` distintas. El mismo diseño cambia de ritmo con el alto de la ventana o con la longitud del texto.

5. **Hay tokens para el movimiento por tiempo y ninguno para el movimiento por scroll.** `--ease-out`, `--ease-io` y
   `--dur-*` sirven para transiciones. No hay nada equivalente para el scroll: inercia, meseta, curva del tramo,
   amortiguado. Las reglas de Quilate viven repartidas en docs/19 §7 y docs/22. Son prosa, no código que se componga.

6. **La sensación «mecánica» tiene firma medible.** Movimiento continuo sin mesetas, velocidad proporcional a la de la
   rueda (sin cola) y piezas que no van a la vez. El inspector de cine ya mide curvas de cámara y de piezas
   (`power2.out`, `sine.in`…). Se puede medir Quilate como referencia de lo bueno y comparar cada diseño nuevo con ella.

## 1. Lo que hace Quilate, con números

- **Entrada**: `SmoothScroll lerp={0.04} wheelMultiplier={0.85}`. Con 0,065, una vuelta de rueda seguía avanzando
  alrededor de 1 s; con 0,04, bastante más (docs/19 §7). Los saltos (`lenis.scrollTo`): 1,6 s con salida en cuarta
  potencia.
- **Mapeo**: `raw` = posición de la línea media entre el centro del paso `j` y el del `j+1`. Después,
  `t = smooth(clamp((raw − 0,15) / 0,7))`: meseta del 15 % a cada lado y una S en el 70 % central.
- **Fotogramas clave**: 18 `BEATS`, cada uno con una pose de 12 parámetros con nombre (explode, head, yaw, x, y, zoom…).
  Se interpolan todos con el mismo `t`. Los encuadres los afina el usuario a mano (memoria `quilate-encuadres-a-mano`).
- **Salida**: la escena sigue a la pose con `min(1, dt·9)`, y los cambios de aspecto (rugosidad, entorno, color) con
  `min(1, dt·4)`: lo material cambia más despacio que lo geométrico.
- **Coherencia**: el mismo `t` va a las variables CSS (`--w`, `--r`, `--o`, `--story-p`), a los cuadros (opacidad y
  desenfoque según la distancia a la línea media) y a la pose.

## 2. Propuesta: la tubería como pieza del kit

| # | Pieza | Qué es |
|---|---|---|
| 1 | **`lib/motion/scroll-feel.ts`** | Ajustes de sensación con nombre. `cinematic` es el de Quilate: inercia 0,04 × 0,85, meseta 0,3, S, amortiguado 9 / 4. También `editorial` (inercia 0,07, meseta 0,2) y `snappy` (0,1, sin meseta). `SmoothScroll` y lo demás los leen; cada web elige uno, no números sueltos |
| 2 | **`useScrollTimeline(beats, opciones)`** | Generaliza `BEATS` + `useScrollStory`: fotogramas clave con nombre, curva por tramo (`smooth`, `power2.out`, `hold`…), meseta, unidad única (pasos o pantallas), y `t`, `j` y la pose interpolada para CSS y para JS. Sustituye las copias de Quilate, Ánima, Cota y del banco |
| 3 | **`useDamped` / `damp(actual, objetivo, λ, dt)`** | La etapa 3, independiente de los fotogramas (`1 − e^(−λ·dt)`, no `min(1, dt·k)`), con la regla de docs/22: una sola fuente por variable |
| 4 | **Piezas de scroll del kit con la tubería** | `PinnedSection`, `ScrubText`, `Parallax`, `ChapterStage`, `ProjectReel` y `FlameHorizon` aceptan `feel` (o heredan el de la página) y aplican meseta y amortiguado en vez de 1:1 |
| 5 | **Una sola medida del scroll** | Un `trackScroll` (el de `lib/motion`). El de GSAP pasa a ser un adaptador |
| 6 | **Medir la sensación** | Un eje «ritmo» en el inspector (docs/36 A3). Captura con rueda: cuánto tarda en asentarse cada pose, cuánto dura la meseta, la cola tras soltar la rueda y si las piezas van a la vez. Quilate es la referencia; cada demo nueva se compara con ella |
| 7 | **Guía corta** | docs/02 (o una ficha en docs/37): «para animar con el scroll, elige un `feel` y usa `useScrollTimeline`». Lista de errores con su síntoma, como la tabla de docs/22 |

## 3. Orden propuesto

1. **Medir Quilate** con el inspector (captura con rueda de la web de Quilate) y sacar su perfil de ritmo: es la vara
   de medir.
2. Piezas 1, 3 y 5 (pequeñas, sin romper nada).
3. Pieza 2. Pasar a ella Quilate (debe quedar igual: control), Ánima y Cota.
4. Pieza 4, una pieza del kit cada vez, comparando antes y después con el eje de ritmo.
5. Rehacer el banco de Meer Mohsin con `useScrollTimeline`, como primera prueba de un diseño nuevo.
