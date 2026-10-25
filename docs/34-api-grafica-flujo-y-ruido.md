# 34 · La API gráfica, el flujo del vídeo y el ruido de cada eje

> Ronda 23 (25-10-2026). Seguimos mejorando el método con lo pendiente de docs/33. Hay tres herramientas nuevas:
> - **`hooks/gl.js`**: el coste y las pasadas leídos de WebGL y WebGPU, con cualquier motor;
> - **`cine:flujo`**: el movimiento de la imagen medido en el vídeo, la «cámara» de las webs sin three;
> - **`cine:vuelta --ruido`**: cuánto se separa la referencia de sí misma.
>
> Probadas con Chartogne, Lusion y una web nueva sin three, Active Theory (motor Hydra).

## 0. Conclusiones

1. **Las pasadas de la API gráfica describen el motor sin conocerlo.** En Active Theory, sin three, `cine:analyze` lee
   sola su cadena de render:

   | Técnica | Pasadas |
   |---|---|
   | escena a 2560×1440 | — |
   | destellos anamórficos | dos cadenas, de 1280×360 a 10×360 |
   | pirámide de bloom | de 192×108 a 48×27 |
   | simulación en la GPU | 11 pasadas de ida y vuelta a 256×256 |
   | un millón de partículas | 1024² puntos |
   | mapas auxiliares | — |
   | composición | — |

   Antes una web así solo daba shaders y vídeo (docs/26 §8).
2. **El presupuesto ya compara de verdad.**
   - Con `renderer.info` de three, Chartogne decía 26 llamadas y 3268 triángulos.
   - La API gráfica dice 72 llamadas, 521 000 triángulos, 5084 instancias, 20 000 puntos y 4 pasadas.
   - Con eso salió que el banco pintaba el doble de triángulos (1,02 millones). Árboles más ligeros: 0,66 millones, sin
     cambio en imagen ni acabado.
   - El eje pasó a ser **unilateral**: solo cuenta lo que el banco gasta de más. Chartogne queda con todos los ejes en el
     10 % o menos.
3. **El flujo del vídeo sustituye a la cámara cuando no hay three.**
   - Calibrado con un giro conocido (el arrastre de Chartogne, 38,7°): el movimiento de la imagen sigue la forma del giro
     (11, 57, 98 y 100 % del recorrido frente a 10, 53, 94 y 100 %).
   - Dos gestos que la cámara del gancho da por iguales (dentro de 1,1°) marcan un 14 % en el eje: ese es su ruido de
     fondo.
4. **Lo más importante: el ruido.** Una web viva no se parece a sí misma.

   | Web | Imagen | Acabado | El resto |
   |---|---|---|---|
   | Chartogne-Taillet | 0 % | 0 % | 0–1 % (coreografía: 90 %, por los pájaros) |
   | Active Theory | 38 % | 16 % | movimiento 6 % |
   | Lusion | 48 % | 26 % | 0–10 % |

   El 42 % de imagen y el 27 % de acabado de Lusion en la ronda 20 **estaban dentro del ruido**. Con otra muestra de la
   referencia, el mismo banco da 66 % y 40 %, ahora por encima. El criterio de «completado» de docs/28 §7 (ejes del
   concepto por debajo del 15 %) solo vale en webs deterministas. En las vivas hay que compararse con el ruido y con
   varias capturas de cada lado (§5).

## 1. `hooks/gl.js`: lo que se pide a la GPU

- **WebGL y WebGL2:**
  - cuenta `drawArrays`, `drawElements`, sus versiones instanciadas y las de `ANGLE_instanced_arrays`;
  - suma las instancias y los triángulos según la primitiva, más los puntos y las líneas;
  - cada `bindFramebuffer` abre una pasada, con el tamaño del viewport que se fija después.
- **WebGPU:**
  - cada `beginRenderPass` es una pasada, con el tamaño de su primer adjunto;
  - cada `draw` o `drawIndexed` va a **la pasada de su codificador**. three abre las dos pasadas de un fotograma antes de
    grabar los dibujos, así que «la última pasada abierta» las juntaba (§6, trampa 1).
- `cine:capture` guarda en cada muestra el último fotograma completo (`gl`). La ficha toma de ahí `drawCalls`,
  `triangulos`, `instancias`, `pasadasPorFotograma` y el nuevo `pixelesPorFotograma` (coste de relleno), con
  `fuente: "gl"`.
- La captura espera también a que haya dibujos: una web sin three esperaba el plazo entero (75 s).

## 2. La cadena de render (`scripts/cine/pasadas.mts`)

`cine:analyze` escribe `pasadas.md` en tres momentos de la captura. Los patrones que reconoce:

| Forma | Técnica |
|---|---|
| La pasada con más triángulos | escena |
| Tres o más pasadas que reducen ancho y alto a la mitad | pirámide (bloom o desenfoque) |
| Tres o más que reducen solo el ancho (o solo el alto) | destellos anamórficos |
| Destinos del mismo tamaño que se alternan (A, B, A, B) | simulación en la GPU |
| Cuadradas pequeñas sueltas | mapas auxiliares: sombras, ruido, LUT |
| Lo que va a pantalla | composición |
| Más de 50 000 puntos | partículas (si es un cuadrado perfecto, de una textura de simulación) |

## 3. `cine:flujo`: el movimiento de la imagen

- Cómo se mide:
  1. Fotogramas a 256 px de ancho, en grises.
  2. Bloques de 16 px en una rejilla, cada uno buscado ±8 px en el fotograma siguiente.
  3. Solo cuentan los bloques con textura y una coincidencia única: la segunda mejor tiene que quedar lejos.
  4. Ajuste de una semejanza (desplazamiento, escala y giro) en dos vueltas: la segunda sin los bloques que se mueven
     por su cuenta.
- Salida: `flujo.json`, con cada par y el acumulado.
- **Eje de movimiento de imagen** en `cine:compare`:
  - el acumulado (x, y, escala en logaritmo, giro) por progreso normalizado;
  - cada componente medido contra su recorrido en la referencia, con un suelo de 5 % del ancho, 10 % de zoom y 5°: un
    giro de cámara deja algo de escala y de giro en el plano por la perspectiva;
  - si a las dos capturas les falta la cámara del gancho, este eje la sustituye.
- Las recetas lo piden con `"flujo": true`.

## 4. El ruido de cada eje: `cine:vuelta <estudio> --ruido`

- Captura la referencia **dos veces** con su receta y compara una con otra. Comparar con una referencia de otra versión
  de la herramienta mide la herramienta, no la web: la primera prueba con Lusion dio un 55 % de presupuesto porque la
  referencia vieja no tenía `gl.js`.
- Guarda `ruido.json` en la carpeta del estudio. Las vueltas añaden la columna **Ruido** y marcan «en el ruido» lo que
  queda por debajo: ahí ya no hay mejora medible.
- Receta nueva, `activetheory`: solo la referencia, para el ruido y como caso sin three.

## 5. Siguiente paso: comparar distribuciones

En una web viva, una comparación es una muestra. Lusion contra sí misma dio un 9 % de imagen una vez y un 48 % otra.
Hace falta `cine:vuelta --muestras N`: N capturas de la referencia y N del banco, con la mediana y la dispersión de
cada eje. Que el banco «se parezca» será que su distribución se solape con la de la referencia.

## 6. Trampas

1. **three abre las pasadas de WebGPU antes de grabar los dibujos:** hay que atribuir cada dibujo a su codificador.
2. **Una búsqueda de bloques que corta la suma en cuanto supera la mejor** falsea la segunda mejor coincidencia, y con
   ella la prueba de que el bloque es único: el flujo salía a cero.
3. **Un eje de coste simétrico castiga ser más barato:** 5 llamadas frente a 72 no es un defecto. Si falta contenido,
   lo dicen la imagen y el acabado.
4. **El ruido se mide con capturas de la misma versión de la herramienta.**
5. **Una sola medida del ruido también es ruido** (9 % y 48 % en Lusion): varias.
6. **Con el reloj virtual desde el arranque no hay fotogramas antes del primer paso:** una web sin three sigue
   esperando el plazo. Con `--clock-later` no.

## 7. Pendiente

- `--muestras N` en `cine:vuelta` (§5).
- El flujo con perspectiva (homografía) para cabeceos y vuelos, no solo semejanza.
- El número de dibujos de `drawIndirect` en WebGPU (hoy no se cuenta).
- `Ficha.relato` (docs/30 §6).
