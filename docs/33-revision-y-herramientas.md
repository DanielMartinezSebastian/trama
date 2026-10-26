# 33 · Revisión de pendientes y herramientas nuevas del inspector

> Ronda 22 (25-10-2026). Petición del usuario: revisar lo que quedó pendiente en todos los estudios (docs/26 a 32) y ver
> qué herramientas le faltan al inspector para ir más rápido la próxima vez. Resultado:
> - cuatro herramientas nuevas: **`cine:explora`**, **`cine:sonda`**, **`cine:vuelta`** y **`cine:tramo movimiento`**;
> - `--movil` en la captura;
> - la orden de cada captura guardada en su `meta.json`;
> - recetas para los siete estudios.
>
> Para probarlas, dos pendientes de Chartogne resueltos con ellas: los pájaros y el giro por arrastre.

## 0. Conclusiones

1. **Lo que más tiempo se llevaba no era medir, sino montar cada medida.** En `.refs3d` había **66 scripts de un uso**:
   exploraciones, sondas de escena, capturas rápidas, ajustes y parches. El trío captura → análisis → comparación se
   lanzó a mano entre 12 y 18 veces por estudio (18 en Plain Sight, 15 en Hublot). Cada sonda nueva costaba entre 20 y 30
   minutos de escribir y depurar el mismo arranque.
2. **Las órdenes exactas de los estudios no quedaban escritas.** Para rehacer las vueltas de Hublot o Bruno Simon hubo que
   sacar sus argumentos (arrastres, teclas, clics) del historial de la conversación. Desde ahora la captura guarda su
   orden y cada estudio tiene receta.
3. **Las herramientas nuevas ya encuentran cosas.**
   - `cine:explora` vio que en Chartogne el arrastre gira la vista. Se midió con una captura dirigida (128,9° por ancho de
     lienzo y una inercia de 0,24 s) y el banco lo reproduce con menos de 1,1° de diferencia.
   - `cine:sonda` encontró **100 pájaros instanciados que aletean** (una uve de 16 vértices, con 0,8 Hz de aleteo y
     fundido por distancia). Ninguna de las dos cosas se había visto en la ronda 21.
4. **Una vuelta completa ya es una orden** (`npm run cine:vuelta -- chartogne`), de unos 3 minutos sin intervención:
   captura, análisis, comparación, par de fotogramas, reparto de tonos y cambio por eje respecto a la vuelta anterior,
   apuntado en un historial.

## 1. Revisión de lo pendiente

Estado de cada pendiente de los docs 26–32. **Herramienta** = del inspector; **kit** = de una pieza; **estudio** = más
de una referencia.

| De | Pendiente | Tipo | Estado |
|---|---|---|---|
| 28 §8 | Medir los tramos desde el primer fotograma en movimiento | herramienta | **Resuelto en la captura**: `cine:tramo <captura> movimiento quieto` (en Chartogne, 4,75 s, el mismo instante que se buscó a mano). En `cine:analyze` sigue abierto |
| 29 §8 | El eje de cámara con ventanas, para no contar la intro | herramienta | **Resuelto** con `cine:tramo` (corte por tiempo o por movimiento) |
| 31 §8 | El coste en móvil | herramienta | **Capturable**: `--movil` en `cine:capture`, `cine:explora` y `cine:sonda` (iPhone 15: 390 × 844 a 3×, táctil). Falta medirlo pieza a pieza |
| 32 §6 | El presupuesto no se puede comparar con motores propios | herramienta | **Abierto**. `cine:sonda` da las pasadas reales (Chartogne: la escena a 256 × 144 y a 2560 × 1440 y un cuadrado). El eje debería contar pasadas y tamaños, no las llamadas de `renderer.info` |
| 26 §8, 27 §7 | Motores sin three (Hydra, Tidewater) | herramienta | **Abierto**. `cine:explora` avisa cuando no hay escena de three; faltan el flujo óptico sobre el vídeo y la lectura de WebGPU |
| 30 §6 | El relato escrito en la ficha y en el informe | herramienta | **Abierto** (`relato.json` existe; falta `Ficha.relato`) |
| 32 §6 | Los pájaros | kit | **Resuelto**: `lib/gravure/birds.ts` (bandada de 100, aleteo y fundido medidos) |
| — | El giro por arrastre de Chartogne (hallazgo de `cine:explora`) | kit | **Resuelto**: dentro de 1,1° de la referencia en todo el gesto |
| 32 §6 | El viento de los árboles | kit | Abierto (los parámetros `uWind*` están en la sonda) |
| 32 §6 | El mapa cenital con la lista de parcelas | estudio y kit | Abierto |
| 32 §6 | La aparición por baldosas para el DOM | kit | Abierto |
| 31 §8 | Chaflán de la cruz (SDF mallado), giro en la cola | kit | Abiertos |
| 31 §8 | El reel y las tarjetas de Lusion | estudio | Abierto |
| 30 §6 | Umbral del párrafo, letra caligráfica, emblema 3D de Meer Mohsin | kit y estudio | Abiertos |
| 29 §8 | Decorado de `ToyDrive`; más cuerpos en `lib/physics` | kit | Abiertos. El decorado puede reutilizar el paisaje de `lib/gravure` con otro material |
| 28 §8 | Pueblos más cálidos, bisel y destello de Hublot | kit | Abiertos (no mueven los ejes) |
| 26 §8 | Flotación exacta de drei; componente `PostFX`; más pases (GTAO, SSR, LUT, desenfoque de movimiento) | kit | Abiertos |
| 26 §8 | Webs premiadas cerradas (Oryzo, IVRESS, Hubtown) | estudio | Abierto: con `cine:explora` y `cine:sonda`, el primer vistazo ya no cuesta |

## 2. Herramientas nuevas

Todas comparten `scripts/cine/navegador.mts`: Chromium con la GPU, los ganchos, la espera a la escena, los pasos en una
línea y los avisos de cookies y de edad (reconoce el texto duplicado de las letras animadas, como «EnterEnter»).

**`npm run cine:explora -- <url> [--movil] [--antes "…"]`**: primer vistazo.
- Qué hay: three, escenas, mallas, scroll, textos y botones.
- Pasa los avisos.
- Prueba siete gestos midiendo la cámara y el cambio de imagen: puntero a la izquierda y a la derecha, rueda, arrastre,
  clic, flechas y tiempo quieto.
- Termina con las órdenes de captura recomendadas, con los clics de los avisos ya puestos.
- En Chartogne: Enter y Accept; la rueda lanza el vuelo (5,9 m y 63°), el puntero da paralaje (0,17 m y 3,9°) y el
  arrastre gira la vista.

**`npm run cine:sonda -- <url> [--antes "avisos;rueda:400x10;espera:5"]`**: volcado de la escena.
- Las pasadas de un fotograma.
- Por escena:
  - las cámaras (con el desplazamiento de la vista);
  - las luces, la niebla y el fondo;
  - las mallas agrupadas por geometría y material, con instancias, atributos, defines y los **valores de los uniforms
    propios** (sin los que three pone en todos los materiales).
- Los cuadrados del posprocesado con sus uniforms.
- Sustituye a las cuatro sondas de un uso de Lusion y Chartogne.

**`npm run cine:vuelta -- <estudio> [--nota "…"]`**: una vuelta del bucle con la receta de
`scripts/cine/recetas.json`.
- Hace todo en orden: captura del banco, análisis, comparación, dinámica del conjunto si la hay, par de fotogramas
  (referencia arriba y banco abajo al 10, 40, 70 y 100 %) y reparto de tonos.
- Compara cada eje con la vuelta anterior.
- Variantes: `--lista` (estudios y su última vuelta), `--referencia` (vuelve a capturar la referencia con su tramo) y
  `--sin-captura`.
- Historial en `.refs3d/vueltas/<estudio>/historial.jsonl`.

**`cine:tramo <captura> movimiento quieto <salida>`**: corta desde el primer fotograma en que la cámara se mueve (más de
1 mm o 0,05°) hasta un segundo después del último.

**`--movil`** en `cine:capture`, `cine:explora` y `cine:sonda`, y la **orden** de cada captura en su `meta.json`.

## 3. Cómo se trabaja ahora (para la próxima web)

1. `cine:explora <url>`: qué hay, qué avisos y qué gesto la mueve. Copiar la orden de captura recomendada.
2. `cine:sonda <url> --antes "…"`: materiales, uniforms, luces, cámaras y pasadas, sin leer el JavaScript publicado.
3. `cine:capture` con la orden recomendada; `cine:tramo … movimiento quieto` si hay intro.
4. Ficha, banco y receta en `recetas.json`; después, `cine:vuelta <estudio> --nota "…"` en cada cambio, hasta que los
   ejes del concepto bajen del 15 % (docs/28 §7).
5. Los pasos 1 a 3 llevaban de una a dos horas por web en las rondas 17–21. Ahora son tres órdenes y unos diez minutos
   de espera.

## 4. Lo resuelto con las herramientas (Chartogne-Taillet)

| Medida | Referencia | Banco |
|---|---|---|
| Giro tras arrastrar 0,3 anchos en 0,5 s: a 0,3 s · 0,5 s · 1 s · 2,5 s | 9,5° · 21,8° · 36,5° · 38,7° | 10,5° · 22,9° · 36,3° · 38,2° |
| Pájaros | 100 uves de 16 vértices, aleteo `sin(t·5 − d·2)·0,01·d`, fundido a 0,45–0,65 m de la cámara y a 3–3,5 m del centro | lo mismo, en `lib/gravure/birds.ts`, volando en círculos sobre el pueblo |
| Ejes tras añadir ambos (`cine:vuelta`) | — | imagen 8 %, acabado 7 %, cámara 5 %: sin cambios |

## 5. Trampas

1. **Una herramienta que necesita una orden exacta tiene que guardarla.** Si no, la siguiente sesión no puede repetir la
   vuelta.
2. **El texto de las letras animadas sale duplicado** en `textContent`: un aviso «Enter» se lee «EnterEnter» y no casa
   con ningún patrón.
3. **Tras las cookies viene la edad:** los avisos se repasan varias veces.
4. **El papel no es gris:** #fff5dd tiene una saturación de 0,13. Un reparto de tonos que separe grises y colores con un
   hueco entre medias deja el papel sin contar.
5. **Lo que parece un desplazamiento puede ser un giro:** la exploración midió 1,3 m de cámara al arrastrar, pero la
   serie dice que la posición casi no cambia y lo que gira es la mirada.

## 6. Pendiente

- El eje de presupuesto desde las pasadas de la sonda.
- `Ficha.relato`.
- El flujo óptico para motores sin three.
- Los kits abiertos de §1.
- Refactorizar `cine:conjunto` sobre `navegador.mts`.
