# 31 · Materiales premium: el racimo de Lusion y `CrossCluster`

> Ronda 20 (24-10-2026). Siguiente paso tras el relato con scroll (docs/30): **materiales**, la parte del acabado que más
> separa una web premiada de una correcta. Estudio: la portada de [Lusion](https://lusion.co/), un racimo de cruces de
> plástico que sigue al puntero. Pieza nueva del kit: **`CrossCluster`**. Herramienta nueva: **`cine:conjunto`** (dinámica
> de un grupo de cuerpos) y **`--recorte`** en `cine:capture`.

## 0. Conclusiones

1. **El acabado «premium» de Lusion no viene de un PBR caro, sino de saber qué hay alrededor.** No hay luces, ni mapa de
   entorno, ni sombras de three. Cada píxel de cada cruz recorre las otras 23 y calcula de forma analítica (contra los
   tres cilindros de cada una) cuánto cielo le tapan, si le quitan la luz y de qué color es la que ve reflejada. Encima,
   un matcap, la oclusión y la sombra propia horneadas por vértice, y una curva fílmica. El resultado se lee como un
   render con trazado de rayos y cuesta un bucle de 23 vueltas por píxel.
2. **Ese material se puede traducir tal cual a TSL** y funciona en WebGPU y en su reserva WebGL2. Hay dos cambios:
   - el matcap es procedural (la referencia lee una textura que no se descarga aparte);
   - el cristal refracta lo ya pintado con `viewportMipTexture` (desenfocado según el grosor) y `viewportSharedTexture`
     (la cara trasera, nítida).
3. **La dinámica se mide sin tocar el código**: `cine:conjunto` lee las posiciones de las cruces 10 veces por segundo en
   reposo, con el puntero barriendo y al soltarlo. El racimo no esquiva el puntero: **lo sigue** (su centro se mueve un
   31 % de lo que se mueve el puntero y vuelve al centro con τ 0,43 s). Las cruces **chocan como bolas** de radio 1: la
   dispersión medida, 2,44 radios, es la de un empaquetado aleatorio de esferas, y la recreación la clava (1–5 %).
4. **El kit gana `CrossCluster`**: el racimo con el material analítico, la física medida sobre `lib/physics` y los
   colores del tema.

| Eje | Alejamiento |
|---|---|
| Cámara | **0 %** (la misma cámara, desplazada como la de la referencia) |
| Dinámica del conjunto (`cine:conjunto`) | **17,6 %** (dispersión 1–11 %, ganancia 5 %, vuelta al centro 1 %) |
| Acabado | **27 %** (empezó en 46 %) |
| Imagen | **42 %** (empezó en 100 %; lo que queda es sobre todo composición: qué cruces quedan delante) |
| Presupuesto y posprocesado | no aplican: el presupuesto es el de toda la web (11 escenas) y su motor no deja ver sus pases |

## 1. Qué hay en la portada

- three r158 con un **motor propio**: once escenas por fotograma, una de ellas en perspectiva con las cruces (fov 18 en
  z 17,5 con la vista desplazada 67,8 px), y la composición final en un cuadrado a pantalla completa con su propia
  `Camera`. El gancho solo veía ese cuadrado: 1 malla con `RawShaderMaterial` (§7, trampa 1).
- **24 cruces**:
  - azules (#061dfb): 4 mates y 2 pulidas;
  - blancas: 6 y 2;
  - negras (#111111): 6 y 2;
  - de cristal: 2, en #eeeeee y #9da6fd.

  Mates con rugosidad 0,8 y pulidas con 0,1. La luz es un punto en (10, 10, 5). Cada cruz es una malla con su material y
  una pasada previa de profundidad.
- **El shader** (82 capturados; el de las cruces en tres variantes: opaca, cristal y cara trasera del cristal):
  - `getCrossAoShadowIntersect` hace por vecina tres cosas:
    - oclusión con la fórmula de oclusión de una cápsula;
    - sombra suave a lo largo del segmento más cercano al rayo de luz;
    - corte del rayo reflejado (con ruido azul en las rugosas) con los tres cilindros.
  - Atributos horneados: `ao`, `daoP` y `daoN` (la visibilidad hacia los seis ejes, de la que sale la sombra propia
    según venga la luz), `thickness` y las normales suaves.
  - Matcap: canal r difuso, g brillo ancho y b brillo fino.
  - Salida: `pow(color, 2.2)` y la curva fílmica de Hejl.

## 2. Medir

- **El gancho elige la escena con más mallas** entre las que se pintan con cámara en perspectiva
  (`scripts/cine/hooks/three.js`). Antes se quedaba con la última, que en Lusion es la de las tarjetas de la página.
- **`--recorte x,y,ancho,alto`** en `cine:capture`: las imágenes y el barrido del puntero se ciñen a una zona. La escena
  de Lusion vive en una tarjeta (64, 187, 1152 × 480) y el banco se captura a 1152 × 480 con la misma cámara.
- **`cine:conjunto`** (`scripts/cine/conjunto.mts`).
  - **Cuerpos que cuenta:** las mallas con la misma geometría de la escena más poblada, o las instancias de un
    InstancedMesh. Las que repiten posición cuentan una vez.
  - **Fases:** reposo, barrido horizontal y cola.
  - **Por fase:** velocidad y giro medios (en radios de cuerpo por segundo) y dispersión alrededor del centro.
  - **Del barrido:** cuánto sigue el centro al puntero en pantalla y con qué retraso.
  - **De la cola:** cuánto tarda en volver.
  - **Comparar:** `--comparar ref.json banco.json` da el alejamiento de cada medida. En las de tiempo hay un suelo de
    0,5 s, para que un retraso de 0 s en la referencia no haga infinito cualquier retraso.

## 3. La física

`lib/crosscluster/sim.ts` sobre `lib/physics`, sin gravedad:

| Lo medido en Lusion | Cómo se recrea |
|---|---|
| Dispersión 2,44 radios en reposo | cada cruz choca como una esfera de radio 1,05 (con la forma de la cruz, 13 esferas, se encajan y quedan en 1,73) |
| El centro sigue al puntero un 31 %, casi sin retraso | muelle de 20 /s² hacia un punto que va al 35 % del puntero en 0,05 s |
| Vuelve al centro con τ 0,43 s | el mismo muelle con freno de 4 /s (τ 0,44 s) |
| En reposo nunca se para (0,15 radios/s, 0,18 rad/s) | agitación: fuerza y par que cambian despacio (senos de 3–9 s, distintos en cada cruz) |
| Barrido: 0,85 radios/s y 0,89 rad/s | rozamiento 0,2 y freno de giro 0,2: 0,93 y 1,05 |

## 4. El material (`lib/crosscluster/material.ts`)

- Traducción línea a línea del shader: las vecinas llegan en `uniformArray` (centro y radio, giro, color, rugosidad,
  transparencia y luminancia). El bucle es un `Loop` de TSL que se salta la propia cruz, cuyo índice va en un atributo
  por instancia.
- Matcap procedural:
  - difuso de arriba y de frente, oscuro en los costados como el de la referencia (con uno claro las blancas salían
    planas: el doble de píxeles gris claro);
  - brillo ancho;
  - dos tiras finas y un punto como reflejos de estudio (con franjas anchas, las pulidas brillaban 10 veces más).
- Cristal: la referencia refracta una imagen de las cruces sobre el fondo claro de la página (`u_bgColor` #f0f1fa).
  Donde detrás solo hay fondo oscuro, el banco mezcla hacia ese claro (`fondoCristal`); sin eso, el cristal sale negro.
- Geometría (`geometry.ts`): un torno por medio brazo con taladro y cantos redondeados, seis copias. Brazo de radio
  0,29; la oclusión, la sombra hacia seis ejes y el grosor se hornean contra la distancia con signo de la cruz
  (~30 ms, una vez por página).

## 5. `CrossCluster`

`components/ui/CrossCluster.tsx` + `lib/crosscluster/` (`geometry`, `material`, `sim`, `content`, `scene`):

- Props:
  - `count` (8–40);
  - `colors` (por turnos; por defecto acento, texto y atenuado del tema);
  - `glass` (0–4, tintes de `--acc2` y del texto);
  - `glossy` (fracción pulidas);
  - `follow` (cuánto sigue al puntero);
  - `interactive`, `render`, `height`;
  - `children` encima, sin quitar el puntero a la escena.
- Fondo de `--card` compuesto sobre `--bg` (la utilidad `sobreFondo` pasa de `ToyDrive` a `lib/ui/color.ts`). El cristal
  ve `--bg` detrás.
- WebGPURenderer con su reserva WebGL2, grano y SMAA (`lib/postfx`), densidad de píxeles hasta 1,5 (cada píxel recorre
  todas las cruces).
- Sin WebGL o con movimiento reducido: las cruces en SVG con los mismos colores.
- Banco: `/lab/cine/lusion` (la ficha pasa la cámara exacta con `vista`).

## 6. Verificación

| Lo que se esperaba | Resultado |
|---|---|
| Ver la escena de un motor propio que compone en un cuadrado | **Sí**, tras arreglar la elección de escena del gancho |
| Leer el material de los shaders y recrearlo | **Sí**: traducido a TSL; acabado al 27 % e imagen al 42 % |
| Medir la dinámica de un grupo, no de una pieza | **Sí**: `cine:conjunto`, conjunto al 17,6 % |
| Medir sin el código de la física | **Sí**: el choque como bolas se deduce de la dispersión |
| Llevarlo al kit | **Sí**: `CrossCluster` en el catálogo, colores del tema, versión plana |
| Chaflanes en la unión de los brazos | **No**: hechos con el torno dejan un aro en cada cruce (§8) |

## 7. Trampas

1. **Un motor propio pinta muchas escenas por fotograma**: la última que se pinta con cámara no tiene por qué ser la
   que se ve. Hay que quedarse con la escena en perspectiva más poblada.
2. **Una escena en una tarjeta**: capturar la ventana entera mezcla la página con la escena; `--recorte`.
3. **«Puntero fuera» en un lienzo a toda ventana**: mover el ratón a la fila de arriba sigue siendo dentro. Hay que
   sacarlo de la ventana (Chromium lanza `pointerleave`). Con el puntero dentro, el banco nunca se asentaba.
4. **Un generador lineal congruencial reparte mal**: con los colores alternos por índice, las cruces salían agrupadas
   por color. `mulberry32`.
5. **Medir la dinámica tiene ruido de una pasada a otra** (choques caóticos): ±10–20 % por medida. Para afinar, la
   simulación sin navegador (`sim.ts` en Node) da el reposo en segundos.
6. **El color del cristal depende de lo que haya detrás**: la referencia pinta su imagen de refracción sobre el fondo
   de la página, no sobre el de la tarjeta.

## 8. Pendiente

- Chaflán en la unión de los brazos: necesita mallar la distancia con signo con una unión suave (marching cubes o
  surface nets), no el torno.
- El giro en la cola sigue bajo (0,22 frente a 0,64 rad/s): la bola del puntero de la referencia debe de transmitir
  más giro.
- El resto de la portada de Lusion: la transición al vídeo del reel y las tarjetas de proyectos con su distorsión.
- La matriz de coste por píxel con más de 30 cruces en móvil (medir con `cine:capture` en un perfil de móvil).

## 9. Coste

| Ronda | Qué incluye | Tiempo |
|---|---|---|
| Ronda 20 | lectura de los shaders, dos arreglos del gancho, `--recorte`, `cine:conjunto`, seis vueltas de dinámica y cinco de imagen, `CrossCluster`, este documento | unas 3 h de reloj |
