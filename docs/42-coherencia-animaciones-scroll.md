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

## 4. Medidas (26-10-2026): `cine:ritmo`

Hay una herramienta nueva, `npm run cine:ritmo -- <captura>` (o `--comparar <a> <b>`).

- **Captura**: con rueda y golpes espaciados: `cine:capture <url> --drive scroll --steps 16 --wheel 200
  --frames-per-step 90 --solo-lienzo`.
- **Movimiento de la escena**: sale de la cámara de three si se mueve con la pose (exacto, sobre ±3 fotogramas, porque
  el gancho redondea a 4 decimales). Si no, del flujo del vídeo.

| Medida | Quilate | Cota antes | Cota con `feel="cinematic"` |
|---|---|---|---|
| Inercia del scroll (s) | 0,92 | 0,68 | 0,92 |
| Retraso de la escena (s) | 0,22 | 0,23 | 0,27 |
| Asentamiento (s) | 0,90 | 0,87 | 0,93 |
| **Rapidez** (pico, recorridos de escena/s) | **0,85** | 1,98 | 1,28 |
| **Sin parar** (movimiento que queda al llegar el golpe siguiente) | **0,21** | 0,04 | 0,09 |
| **Acoplamiento** (con la velocidad de la rueda) | **0,15** | 0,34 | 0,40 |

**Lo que dicen las medidas:**

1. **La firma de Quilate es «lento y deslizante».**
   - La escena va despacio (0,85).
   - Cuando llega el gesto siguiente, aún le queda un 21 % del movimiento: los gestos se encadenan en un flujo continuo.
   - No copia la velocidad de la rueda (0,15).
2. **Cota es «rápido y a tirones».**
   - Más del doble de rapidez.
   - Se para del todo entre gestos.
   - Sigue a la rueda.

   Es la sensación mecánica que describe el usuario.
3. **La entrada cuenta, pero no lo es todo.** Con la sensación de Quilate, la inercia de Cota es la misma y la rapidez
   baja a 1,28. Lo que queda es de diseño: **cuánto cambia la escena por pantalla de scroll**. Quilate cambia poco por
   pantalla, con pasos de unos 217 svh de media y poses vecinas parecidas.
4. **Una hipótesis descartada:** alargar los pasos de Cota a 220 svh no la acerca a Quilate (el temblor sube).
5. **El temblor queda como experimental.** Las dos curvas son limpias vistas fotograma a fotograma. La cuenta de cambios
   de sentido es sensible al redondeo de la captura.

**Regla de diseño provisional para una sensación `cinematic`:**

- rapidez entre 0,7 y 1,0;
- «sin parar» entre 0,15 y 0,3;
- acoplamiento por debajo de 0,2.

Se comprueba con `cine:ritmo --comparar .refs3d/ritmo/quilate-lento <captura>`.

## 5. Hecho en esta ronda

| Pieza | Qué |
|---|---|
| `lib/motion/scroll-feel.ts` | Sensaciones con nombre (`cinematic` = Quilate, `editorial`, `snappy`). Curvas, `tramo()` (meseta y curva), `damp`/`dampFactor` independientes de los fotogramas, `crearSeguidor`, `mezclaPose` y `seguidorRaf` (un valor del DOM que persigue a su objetivo) |
| `SmoothScroll feel` | La inercia de la sensación, publicada en `<html data-scroll-feel>` para las demás piezas |
| `useScrollStory` | Meseta y curva de la sensación de la página. **Corregido: `plateau 0,3` dejaba quieto el 70 % y movía el 30 %, al revés de lo documentado y de Quilate.** Ánima, Cota y `PointCloud` pasan a moverse como Quilate. Pasa también `raw` (avance sin curva) |
| `useScrollTimeline` | Nueva: fotogramas clave con pose con nombre, curva y meseta por tramo, seguimiento amortiguado, variables `--tl-<clave>` y `pose.current` para el 3D |
| `PinnedSection` | `steps` y `feel`; publica `--pin-t` (con la tubería completa, la recomendada) y `--pin-step`, además de `--pin-p` en bruto |
| `ScrubText`, `Parallax` | Siguen al scroll amortiguados (`feel`) |
| `hooks/clock.js` | El reloj virtual ya no fija el tiempo de las animaciones ligadas al scroll (rompía las capturas de Quilate) |
| `lib/pointcloud/scene.tsx` | Los ejes de la cámara del fotograma actual (`updateMatrixWorld` antes de leerlos) |
| Cota | `SmoothScroll feel="cinematic"` (antes `lerp 0,07`) |

## 6. Pendiente

1. Pasar Quilate a `useScrollTimeline` como control: su ritmo no debe cambiar.
2. Una ficha en docs/37 y una sección en docs/02: «elige un `feel`, usa `useScrollTimeline` o `--pin-t`, comprueba con
   `cine:ritmo`».
3. Ajustar en Cota cuánto cambia la escena por pantalla, hasta la regla del §4.
4. Rehacer el banco de Meer Mohsin (`RelatoMeer`) con `useScrollTimeline`.
5. `ChapterStage`, `ProjectReel` y `FlameHorizon` con la sensación de la página.

## 7. Segunda ronda (26-10-2026)

- **Quilate con el motor del kit** (`useScrollStory` con `feel="cinematic"`, sin su copia de 62 líneas). Control con
  `cine:ritmo`: las ocho medidas, idénticas (`.refs3d/ritmo/quilate-motor`).
- **Guía**: docs/02 §6.5 y ficha de concepto en docs/37 §11.
- **Cota, ajuste del cambio por pantalla:**

  | Variante | Rapidez | Sin parar | Acoplamiento |
  |---|---|---|---|
  | Quilate (objetivo) | 0,85 | 0,21 | 0,15 |
  | Cota antes (`lerp 0,07`, pasos de 130 svh) | 1,98 | 0,04 | 0,34 |
  | `feel cinematic` | 1,28 | 0,09 | 0,40 |
  | + pasos de 220 svh | 1,07 | 0,41 | 0,34 |
  | **+ pasos de 175 svh (queda así)** | **1,07** | 0,40 | **0,29** |
  | + seguimiento de la nube a 9/s | 1,09 | 0,55 | 0,43 |

  **Lo que enseña:**
  - **Alargar los pasos baja la rapidez**, pero no hasta Quilate.
  - **Seguir la pose más deprisa empeora**: la escena copia la cola del scroll.
  - **Lo que queda es coreografía**: cuánto cambian las poses vecinas. En Quilate cambian poco (el anillo gira unos 0,4–0,8
    rad por paso y se desplaza un 20 % del ancho). Se ajusta pose a pose, como hace el usuario con los encuadres de
    Quilate, no con el motor.
  - **Regla nueva para docs/02 §6.5**: el seguimiento de la escena, entre 4 y 6/s cuando el scroll ya tiene inercia larga.
    Los 9/s de Quilate funcionan porque sus mesetas absorben la cola.

## 8. Tercera ronda: el banco de Meer Mohsin y las piezas que faltaban

- **`RelatoMeer`**:
  - una sola posición de scroll, amortiguada a 5/s, de la que salen las llamas, la máscara y su salida;
  - tramos en S en vez de lineales;
  - `SmoothScroll feel="cinematic"` en la página.
- **Salida de la máscara sobre el escenario** (queja del usuario): ahora se apaga al 40 % y se desenfoca sobre el
  relato, y luego se va. Antes iba a plena luz hasta desaparecer de golpe.
- **Una sola barra TENSION · IMMERSION · IMPACT**: la del escenario se oculta en el banco. En la referencia hay una.
- **`ChapterStage` y `ProjectReel`**: el avance sigue al scroll amortiguado con la sensación de la página.
  `FlameHorizon` recibe el avance de quien lo usa.

**Estado de la propuesta (§2):**

- hechas: piezas 1, 2, 3, 4 (las seis piezas de scroll del kit), 6 (`cine:ritmo`) y 7 (docs/02 §6.5 y docs/37 §11);
- queda la pieza 5: un solo `trackScroll`; el de GSAP (`lib/scroll/track`) solo lo usa un fondo y se deja.
