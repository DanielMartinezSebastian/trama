# 36 · Plan de mejora: medir mejor, llegar más lejos y componentizar a fondo

> Petición del usuario (25-10-2026), al terminar el reestudio:
> - mejorar las capturas y las comparaciones;
> - cumplir más objetivos o subir las cifras donde no llegan;
> - capturar más de cada ejemplo para componentizar más a fondo.
>
> **El objetivo final es un conjunto de componentes, reglas y conceptos que se puedan replicar en el futuro, con
> atención a la versatilidad de lo que entra en la librería.** Las cifras de partida son las del reestudio (docs/35 §6).

## 0. Diagnóstico

1. **El inspector mide bien lo determinista y mal lo vivo.** Chartogne y Plain Sight se sostienen un día después
   (ejes ≤ 12 %). En webs con física o generación al azar, una comparación es una muestra: Lusion dio un 9 % y un 48 %
   de ruido de imagen en dos ocasiones. Faltan varias capturas por lado y un veredicto que tenga en cuenta el ruido.
2. **Hay cosas que pasan y no tienen eje.** El ritmo (cuándo hay cortes, picos de movimiento, transiciones de página),
   el sonido y el relato dentro de la ficha. Y el flujo del vídeo no entiende la perspectiva.
3. **De cada web se estudió una sección.** Lusion tiene además su reel y las tarjetas de proyectos con distorsión;
   Chartogne, el mapa cenital con las parcelas; Meer Mohsin, la intro con el retrato enmascarado; Active Theory, todo
   (de ahí no salió ninguna pieza).
4. **Lo que entró en la librería es más concreto de lo que debería.**

   | Componente | Versatilidad | Lo replicable que queda atado |
   |---|---|---|
   | `ChapterStage` | buena: todo por datos (capítulos, imágenes, duraciones), fijado o controlado | — |
   | `TypeField` | media: palabras y fuente | el campo de letras con muelles, para cualquier glifo o icono |
   | `CrossCluster` | baja: solo cruces | sombreado analítico entre vecinas y racimo que sigue al puntero, para cualquier forma |
   | `EngravedMap` | baja: solo un paisaje de viñas | **el grabado a lápiz** (`lib/gravure`), que podría envolver cualquier escena o modelo |
   | `Porthole` | baja: una ventanilla al alba | el cielo por rampa medida y la cámara que se asoma |
   | `ToyDrive` | baja: un coche y una palabra | la física sin WebAssembly (`lib/physics`) para soltar y empujar cualquier cosa |

## 0b. Criterio que manda: la misma sensación y la misma profundidad

Petición del usuario: **las demos deben estar lo más cerca posible de la referencia, al menos en sensación y en
profundidad.** Las cifras ayudan, pero el criterio final es que la demo se sienta igual. Esto cambia tres cosas:

1. **Recortar el decorado ya no vale.** «El decorado no se recrea» (Bruno Simon, el emblema de Meer Mohsin) deja la
   demo plana aunque la técnica esté bien. Si la sensación depende del decorado, la luz o la atmósfera, entra en la
   demo, con piezas propias o procedurales.
2. **La profundidad se mide.** Se añade un eje de profundidad (A8) con cuatro señales:
   - **paralaje entre capas**: en el flujo del vídeo, lo cercano se mueve más que lo lejano (relación de velocidades
     por franjas de profundidad);
   - **atmósfera**: cómo caen el contraste y la saturación con la distancia (niebla, perspectiva aérea);
   - **desenfoque por profundidad**: el gradiente de nitidez de cerca a lejos;
   - **escala y solapamiento**: cuántas capas hay y cuánto se tapan.

   La referencia y la demo tienen que tener las mismas capas y la misma caída.
3. **La sensación se mide y se juzga.**
   - Se mide: inercia y curvas del movimiento (ejes de cámara, dinámica y movimiento), respuesta al gesto (retraso y
     amortiguado al puntero, a la rueda y al arrastre) y ritmo (A3).
   - Se juzga: el informe ya tiene una rúbrica de 1 a 5 por momento. El panel la usará para que el usuario puntúe
     sensación y profundidad de cada demo frente a su referencia, y esa puntuación cuenta para dar el estudio por
     cerrado.

## 1. Principio para lo que entra en la librería: tres capas

1. **Técnicas (motores y efectos)**: lo que se puede aplicar a una escena o a un contenido que trae el usuario.
   Ejemplos: el grabado a lápiz, el sombreado analítico, la física, la pila de posprocesado, la aparición por baldosas,
   el fallo de señal.
   - Van como `lib/<técnica>` y, si tiene sentido, como componente envoltorio: «pinta tu escena así», «aplica esto a
     tu imagen».
2. **Componentes listos**: una técnica con una escena por defecto y props para cambiarla (`EngravedMap`,
   `CrossCluster`). Siempre construidos **sobre** la capa 1, nunca con la técnica dentro.
3. **Conceptos (reglas)**: la ficha del concepto. Qué es, cuándo usarlo, los parámetros medidos en la referencia
   como valores de partida, qué piezas lo implementan y cómo verificarlo. Van en `docs/37-conceptos.md`, que se
   alimentará en cada ronda.

**Lista de comprobación de versatilidad** (para cerrar cualquier pieza):

| Se comprueba | Qué |
|---|---|
| Contenido | por props o datos, no fijo: palabras, imágenes, formas, modelos (GLB), capítulos |
| Técnica | separada de la escena; usable con lo que traiga el usuario |
| Tema | tokens del tema (claro y oscuro) y colores por prop |
| Control | interno (puntero, scroll) **y** controlado (`progress`, valores), para encajarla en relatos o en otro scroll |
| Respaldo | versión sin WebGL o con movimiento reducido |
| Móvil | capturada con `--movil`: coste y composición |
| Valores | presets con los valores medidos (`preset="lusion"`) en vez de números mágicos |
| Variación | probada fuera de los valores de la referencia (otra forma, otra escena, otro tema) y verificada con una vuelta |

## 2. Fase A · Captura y comparación (herramienta)

| # | Mejora | Resultado esperado |
|---|---|---|
| A1 | **Objetivo por eje en la receta y veredicto automático** en cada vuelta (bien, en el ruido, a medias, lejos), con el objetivo = máx(ruido + margen, umbral del concepto) | El criterio de «completado» deja de aplicarse a mano |
| A2 | **`cine:vuelta --muestras N`**: N capturas de referencia y de banco; mediana y dispersión por eje; veredicto por solape | Lusion, Bruno y Active Theory, comparables |
| A3 | **Eje de ritmo**: cortes (saltos de imagen), picos de movimiento y su tempo, de las dos capturas, alineados | Transiciones de página y montajes con eje propio |
| A4 | **Flujo con homografía** (perspectiva) | Vuelos y cabeceos sin cámara de three |
| A5 | **`Ficha.relato`** y el relato en el informe | El texto entra en la ficha como la cámara |
| A6 | **Sonido** (si lo hay): eventos de audio en el tiempo, con el gancho de WebAudio | Webs que suenan (Bruno, Runa) |
| A7 | **Captura de secciones**: una receta con varias secciones (portada, reel, mapa…), cada una con su tramo y su banco | Estudiar una web entera, no una sección |
| A8 | **Eje de profundidad**: paralaje entre capas (flujo por franjas), caída de contraste y saturación con la distancia, gradiente de nitidez y número de capas | La demo tiene la misma profundidad que la referencia, medida |
| A9 | **Puntuación del usuario en el panel**: sensación y profundidad de 1 a 5 por demo frente a su referencia, guardada con la vuelta | El juicio humano entra en el criterio de cierre |

### Hecho en la ronda 24: A1, A8 y A9

- **A1**: `lib/cine/objetivos.ts` da a cada eje su objetivo, máx(ruido · 1,1 + 0,02, umbral), con un umbral del 15 %
  (10 % el presupuesto).
  - La receta puede cambiarlo con `objetivos` o marcar un eje como `"no aplica"` (las piezas de Bruno, la coreografía
    de Chartogne, con un 100 % de ruido).
  - `cine:vuelta` y `cine:reestudio` escriben «Cumple N de M», el objetivo y el veredicto de cada eje, y el historial
    los guarda.
  - El panel dibuja el objetivo como una marca discontinua.
- **A8**: eje `profundidad` en `cine:compare` (`scripts/cine/profundidad.mts`).
  - Atmósfera, desenfoque y planos por bloques de 24 px en los mismos doce pares que el acabado; paralaje del flujo
    (residuo frente a movimiento) cuando la receta tiene `flujo`.
  - Comprobado con los controles: los ejes que ya había no cambian.
    - Plain Sight: profundidad 6 %, cumple 9 de 9.
    - Chartogne: profundidad 28 % con un ruido del 1 %, lo que confirma que es real. La demo difumina el horizonte con
      niebla (más rango de nitidez, 53 %, y una capa más), mientras que la referencia mantiene el grabado nítido hasta el
      fondo. Es lo primero de su Fase C.
- **A9**: el panel tiene un formulario por demo (sensación y profundidad de 1 a 5, y una nota).
  - Lo guarda la ruta `/lab/cine/puntuar`, solo en local, en `<carpeta de la receta>/puntuaciones.jsonl`, con la
    vuelta a la que se refiere.
  - La tarjeta enseña la última puntuación.

## 3. Fase B · Subir las cifras donde no llegan

Del reestudio (docs/35 §6), por orden de distancia a la sensación de la referencia:

| # | Demo | Lejos (ahora · ruido) | Causa | Qué se hace | Conceptos que salen para la librería |
|---|---|---|---|---|---|
| B1 | **Meer Mohsin** (relato) | cámara 100 %, luz 85 %, imagen 72 %, acabado 70 %, texto 21 %, posprocesado 25 % · ruido 0 % | El banco solo recreó el texto; faltan el emblema 3D, la sala roja, las llamas y siluetas y la atmósfera | Recrear la escena de la sección y el emblema que baja; el texto, del 21 % al 15 % (el párrafo que sube 20 px) | Objeto que acompaña al scroll; atmósfera roja de llamas (partículas y siluetas recortadas); fallo de señal suelto (D4) |
| B2 | **Bruno Simon** | imagen 100 % · 24 %, acabado 81 % · 4 %, atmósfera 55 % · 1 %, luz 45 % · 0 %, cámara 55 % · 7 % (intro) | Sin decorado ni su luz; la cámara mide la intro | Decorado estilizado (hierba instanciada, árboles, agua, sombreado de juguete) con su luz y su niebla; cámara por ventanas (sin la intro) | Decorado de juguete reutilizable; física para soltar cualquier cosa (D5) |
| B3 | **Lusion** | imagen 66 % · 48 %, acabado 40 % · 26 % | Composición al azar más matiz del material; hacen falta muestras | `--muestras 5` (A2) y, si sigue por encima del ruido, el material (matcap, cristal) con la media de varias capturas | Racimo de cualquier forma (D2) |
| B4 | **camera-scroll** (calibración) | acabado 30 %, imagen 18 %, piezas 18 % · ruido 0–1 % | La flotación aproximada y el resaltado al pasar el ratón | La flotación exacta de drei y el resaltado | — (calibración) |
| B5 | **Hublot** | imagen 13 % · 2 % | Pueblos más cálidos, puntos muy brillantes, bisel | Ajuste de las ciudades y del bisel | Cielo por horas (D6) |

Plain Sight y Chartogne están en su objetivo con un ruido del 0 %: sirven de **control**. Cada cambio del inspector
tiene que seguir dándoles lo mismo.

## 4. Fase C · Capturar más de cada ejemplo

| Web | Qué falta capturar | Concepto que se espera sacar |
|---|---|---|
| Chartogne-Taillet | Mapa cenital con la lista de parcelas y su resaltado; transición del 3D al mapa; textos e imágenes que entran por baldosas | Aparición por baldosas (técnica, para DOM e imágenes); mapa ilustrado con zonas interactivas |
| Lusion | Reel (transición al vídeo) y tarjetas de proyectos con distorsión | Transición de tarjeta a vídeo; imagen que se deforma con el scroll |
| Meer Mohsin | Intro con el retrato enmascarado y el emblema 3D que baja | Máscara de titular sobre retrato; objeto que acompaña al scroll |
| Active Theory | Portada y páginas de trabajo | Destellos anamórficos (pase de `lib/postfx`), partículas por GPGPU, transición entre proyectos |
| Bruno Simon | Decorado (hierba, árboles, agua) y zonas con proyectos | Decorado estilizado reutilizable; zonas que se activan al llegar |
| Hublot | Otras horas del día (panel de ajustes) | Cielo por hora como preset |

Cada captura nueva pasa por el procedimiento (docs/35) y deja receta, ruido y vueltas.

## 5. Fase D · Componentizar a fondo (versatilidad)

| # | Extracción | Desde | Forma en la librería |
|---|---|---|---|
| D1 | **Grabado a lápiz para cualquier escena**: `GravureCanvas` (envuelve los hijos de R3F) y `materialLapiz` público con presets (terreno, objeto, follaje) | `lib/gravure` | técnica + envoltorio; `EngravedMap` pasa a ser un ejemplo encima |
| D2 | **Racimo para cualquier forma**: `shape` (cruz, esfera, cápsula, cubo redondeado o geometría propia con su aproximación de choque) y el material analítico como técnica | `lib/crosscluster` | `CrossCluster` → `ShapeCluster` (con alias) |
| D3 | **Aparición por baldosas** para DOM e imágenes (ruido + rejilla de azar, medida en Chartogne) | Fase C | técnica (CSS o WebGL) + componente `TileReveal` |
| D4 | **Fallo de señal** como pieza suelta (`GlitchImage`) | `ChapterStage` | componente; `ChapterStage` lo usa |
| D5 | **Física para soltar y empujar cualquier cosa** (`PhysicsPile`: palabras, iconos, modelos) | `lib/physics`, `ToyDrive` | componente; `ToyDrive` lo usa |
| D6 | **Cielo por rampa medida** como fondo (`SkyRamp`, presets de hora) | `lib/porthole` | componente de fondo |
| D7 | **`PostFX`**: la pila TSL como componente, con el pase anamórfico | `lib/postfx`, Active Theory | componente envoltorio |
| D8 | **Bandada** (`Flock`) para cualquier escena | `lib/gravure/birds` | técnica |

**D1 hecho (ronda 25):**

- `components/ui/GravureCanvas.tsx` con `lib/gravure/canvas.tsx`:
  - envuelve los hijos de R3F y les pone el material de lápiz;
  - `userData.lapiz` elige el ajuste de cada malla y `userData.sinLapiz` la deja fuera.
- Ajustes genéricos en `AJUSTES_LAPIZ`: objeto, suelo y follaje.
- Dirección nueva `diagonal` en el material.
- Variación fuera de la referencia: el bodegón de `lib/gravure/muestra.tsx`, en el catálogo (`/componentes#gravure-canvas`).
- Chartogne no empeora: el material solo gana opciones, con los mismos valores por defecto.

Cada extracción: variación fuera de la referencia + vuelta de la referencia original sin empeorar (la pieza
publicada sigue reproduciendo su estudio) + entrada de catálogo + ficha de concepto.

## 6. Fase E · Conceptos replicables (`docs/37-conceptos.md`)

Una ficha por concepto, con la misma forma:

1. Qué es, en una frase.
2. Cuándo usarlo y cuándo no.
3. La regla: los parámetros medidos (presets).
4. Piezas que lo implementan.
5. Cómo verificar una implementación (receta y ejes).
6. Webs de referencia.

Conceptos de partida:

- cámara de autor con curva medida;
- campo tipográfico con muelles;
- ventanilla y cielo por rampa;
- física de juguete;
- relato por capítulos con palabra gigante;
- sombreado analítico entre vecinas;
- grabado a lápiz;
- cadena de render (bloom, anamórfico, simulación);
- aparición por baldosas.

## 7. Orden propuesto

1. **A1** (veredicto automático), **A8** (profundidad) y **A9** (puntuación del usuario): el criterio de cierre
   completo (cifras, ruido, profundidad y sensación) antes de seguir subiendo cifras.
2. **D1** (grabado para cualquier escena): convierte la mejor pieza en técnica.
3. **Fase B** con las cifras del reestudio, empezando por las demos que no se sienten como su referencia (decorado,
   atmósfera, profundidad).
4. **A2** (muestras) y **D2** (racimo de cualquier forma), que van juntas: Lusion es la web viva.
5. **Fase C** de Chartogne (mapa y baldosas) → **D3**.
6. **A3** (ritmo) con el reel de Lusion → transición de tarjeta a vídeo.
7. **D4–D8** y la Fase E en cada ronda.

Cada paso cierra con el procedimiento de docs/35 §5: documento, panel, comprobaciones y commit.
