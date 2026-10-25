# 32 · Ilustración en 3D: el grabado de Chartogne-Taillet y `EngravedMap`

> Ronda 21 (25-10-2026). La candidata que añadió el usuario en la ronda 18:
> [Chartogne-Taillet](https://chartogne-taillet.com/en), la web de una bodega de champán con su pueblo (Merfy) y sus
> viñas dibujados en 3D como un grabado a lápiz. Tipo nuevo para el método: **rendering no fotorrealista** (un 3D que no
> parece 3D). Pieza nueva del kit: **`EngravedMap`**, con el motor reutilizable **`lib/gravure`**. Herramienta nueva:
> **`cine:tramo`**.

## 0. Conclusiones

1. **El grabado no se pinta: se compone.** La escena no tiene colores. Cada píxel guarda tres datos: la normal (r), la
   fuerza del lápiz (g) y la cercanía (b). Una sola pasada final los convierte en papel, lápiz y contornos (Sobel sobre la
   normal, más gruesos cerca). Separar «qué hay» de «cómo se dibuja» es lo que permite el mismo motor para el terreno, las
   casas y los árboles, y cambiar papel y lápiz sin tocar la escena.
2. **El rayado es una banda periódica sumada a la sombra.** `|fract(distancia · subdivisión) − 0,5| · 2` más la
   oscuridad (desplazada y multiplicada) y casi binarizada con `pow(x, 0,1)`. Donde está iluminado no hay trazo; según
   oscurece, las líneas engordan. La «distancia» es a un punto lejano: el origen (anillos casi paralelos de cerca) o un
   punto alto (bandas horizontales en los árboles), y **en las coordenadas del modelo**. Por eso cada árbol lleva el
   mismo número de bandas sea cual sea su tamaño.
3. **Es el primer estudio en que el acabado coincide además del concepto.** Encuesta de la ronda 18: «concepto sí,
   acabado no».

   | Eje | Alejamiento |
   |---|---|
   | Imagen | **8 %** (ΔE de la paleta 1,0) |
   | Acabado | **7 %** (detalle 2 %, bordes 3 %, grano 20 %) |
   | Cámara | **5 %** (0,9° de dirección) |
   | Luz y posprocesado | 10 % |

   El paisaje es procedural y propio. Lo que hace que se parezca es la técnica medida, no los datos de la referencia.
4. **El kit gana `EngravedMap` y `lib/gravure`.**
   - `materialLapiz` y `pilaGrabado` valen para cualquier escena con WebGPURenderer: un modelo de producto, un edificio,
     un mapa.
   - En el tema oscuro el mismo motor da un grabado inverso (tiza sobre pizarra).

## 1. La técnica (shaders y parámetros leídos con una sonda)

Escena (three r122, `ShaderMaterial` sobre Phong con código propio):

| Pieza | Trazo | Subdivisión | Luz (desplazamiento, multiplicador) | Tope | Fundido con la distancia |
|---|---|---|---|---|---|
| Terreno (10 m, elevación 0,75) | anillos alrededor del origen | 300 | −0,5, ×3 | 0,7 | no |
| Árboles (instanciados, con viento) | bandas horizontales (punto lejano arriba) | 200 | −0,7, ×3 | 0,75 | de 0,7 a 2,2 m |
| Casas (instanciadas) | anillos | 200 | −0,7, ×3 | 0,75 | de 0,7 a 2,2 m |

- **Luz:** cuatro direccionales blancas, dos parejas idénticas que se suman: 3,75 desde (−0,96, 1,68, 4,61) y 2,1
  desde (2,08, 3,2, −3,23).
- **Composición** (`EffectComposer`, un `ShaderPass` sobre un búfer a 2×):
  - papel #fff5dd, lápiz #8c887d y realce #c55656;
  - contorno de Sobel con umbral 0,5 y ancho 0,5 + cercanía;
  - viñeta de 1,8 con −0,28 que se funde con el papel;
  - grano de 0,123;
  - papel (textura de 256 px) al 25 %;
  - aparición por baldosas: un ruido de Perlin y una rejilla de azar de 3,8 × 10 deciden qué trozo entra antes.
- **El DOM también es WebGL.** Todos los textos y los bloques de la interfaz son cuadrados con su textura y la misma
  aparición por baldosas (`uRevealProgress`). Por eso el título «PARCELLES DE CHARTOGNE TAILLET» entra y sale a trozos.

## 2. Medir

- **Sonda de uniforms:** se envuelve `render` y se recogen los materiales con `uniforms` de todo lo que se pinta (208).
  Da todos los parámetros de la tabla sin leer el JavaScript publicado.
- **`cine:tramo <captura> <desde> <hasta> <salida>`:** corta una captura a un tramo de tiempo. Aquí deja fuera el aviso
  de edad, el título y su transición, que el banco no recrea. El tramo sale marcado como captura de tiempo aunque la
  original fuera de scroll (§5, trampa 2).
- **`dprFijo` en la ficha:** la referencia pinta siempre a 2×, también en pantallas de 1×. Sin igualarlo, el banco tenía
  el doble de grano y de detalle fino (el acabado pasó del 30 % al 16 % solo con eso).

## 3. La cámara

Vuelo de entrada de 3 s, desde (1,01, 0,50, 7,94) mirando a −z hasta (1,70, 0,84, 2,20) mirando a
(−0,725, −0,454, −0,518), con fov 65.

| Medida | Curva |
|---|---|
| Avance | cuadrática que frena (0,161 a 1/12 del vuelo: power2.out exacta) |
| Giro de la mirada | **ninguna curva con nombre**: se midió la fracción del camino cada 0,25 s, deshaciendo la normalización de la dirección, y se usa la tabla (`GIRO` en `lib/gravure/content.tsx`) |

Con una S cúbica la dirección se apartaba 47° en el peor momento; con la tabla, 0,9°.

## 4. `EngravedMap`

`components/ui/EngravedMap.tsx` + `lib/gravure/`:

| Archivo | Qué hace |
|---|---|
| `material.ts` | `materialLapiz` con los ajustes medidos (`LAPIZ_TERRENO`, `LAPIZ_ARBOL`, `LAPIZ_CASA`). El terreno añade surcos por parcela: celdas de Voronoi estiradas 2,6 veces, una dirección por celda, caminos en blanco con un trazo a cada lado, prados sin surcos y el pueblo sin viña. |
| `post.ts` | `pilaGrabado`: Sobel, papel y lápiz en el espacio de la pantalla (como la referencia), aparición por baldosas con `progreso`, viñeta, grano y fibra de papel procedural. |
| `landscape.ts` | Terreno con lomas, 900 casas con tejado a dos aguas alineadas por barrios y 5000 árboles en bosquecillos, setos y el pueblo. |
| `content.tsx`, `scene.tsx` | El vuelo medido, el paralaje leve y el lienzo a 2×. |

- Props: `seed`, `intro` (segundos de vuelo; 0 = sin vuelo), `interactive`, `height` y `children` encima.
- Colores: papel de `--card` sobre `--bg` y lápiz de `--mut`.
- Sin WebGL o con movimiento reducido, un rayado CSS del color del lápiz.

## 5. Trampas

1. **Un `build` con el `next dev` del worktree en marcha deja el servidor devolviendo 404 en todas las rutas de `/lab`**,
   incluso tras reiniciarlo. Hay que parar el servidor, borrar `.next/dev` y relanzarlo (AGENTS.md ya avisa de no
   compilar con el servidor en marcha).
2. **Un tramo de una captura de scroll no tiene scroll:** si conserva `drive: scroll`, el comparador alinea por un
   scroll que no se mueve y la cámara sale al 100 % aunque sea la misma. `cine:tramo` lo marca como tiempo.
3. **La densidad de píxeles cambia el acabado:** con una referencia a 2× fijo, comparar a 1× duplica el grano.
4. **Bandas en coordenadas del mundo con una subdivisión de 300 por metro** dan líneas de 2 px que se emborronan en
   moiré. La referencia mide en las coordenadas del modelo: en el kit, 70 por metro en el terreno y 7–9 por unidad de
   modelo en casas y árboles.
5. **El tejado como prisma de `CylinderGeometry(…, 3)`:** el vértice sale en +z. Para la arista arriba hay que girar
   −90° en x, no 30°.
6. **Comentarios con un `import("./…")` de ejemplo:** `build-package` reescribe los import relativos también en los
   comentarios de los `.d.ts`, y `pkg:build` fallaba en `Preloader` (arreglado en esta ronda).

## 6. Pendiente

- La transición al mapa cenital con la lista de parcelas y su resaltado (la sección siguiente de la referencia).
- La aparición por baldosas para el DOM (títulos y bloques que entran a trozos) como pieza propia: en CSS con una
  máscara o en WebGL como la referencia.
- El viento de los árboles (`uWind*` de la referencia).
- Hecho en la ronda 22 (docs/33 §4): los pájaros (bandada de 100) y el giro de la vista al arrastrar (128,9° por ancho,
  inercia 0,24 s), que encontraron `cine:sonda` y `cine:explora`.
- El presupuesto no se puede comparar: el gancho solo ve parte de las llamadas de la referencia (26 llamadas y 3268
  triángulos con miles de instancias).

## 7. Coste

| Ronda | Qué incluye | Tiempo |
|---|---|---|
| Ronda 21 | arreglo de `pkg:build`, sonda de shaders y uniforms, `cine:tramo`, `dprFijo`, motor del grabado, paisaje procedural, seis vueltas de comparación, `EngravedMap`, este documento | unas 2 h 30 de reloj |
