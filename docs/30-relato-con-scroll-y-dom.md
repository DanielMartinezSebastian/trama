# 30 · Relato con scroll: medir el DOM (Meer Mohsin) y `ChapterStage`

> Ronda 19 (24-10-2026). Siguiente paso de la encuesta de la ronda 18: webs más difíciles y, de lo que más se vende,
> el **relato con scroll con texto sincronizado con el 3D**. La herramienta no veía el DOM (titulares que entran, capas que
> se cruzan); ahora sí. Estudio: [Meer Mohsin](https://www.meermohsin.me/) (Awwwards, «Cinematic Hero Scroll»). Pieza nueva
> del kit: **`ChapterStage`**.

## 0. Conclusiones

1. **La herramienta ya ve el DOM.** Por fotograma, los textos visibles; por captura, el relato escrito (qué entra,
   cuándo, cómo, con qué curva); y un eje de texto en el comparador. En Meer Mohsin sacó la coreografía de las palabras de
   la sección (LEGACY → UI - UX → 3D WEB): dónde se fija, cuánto dura cada capítulo y cómo sale y entra cada palabra.
2. **Qué se ve lo deciden los píxeles, no el DOM.** El lienzo de la referencia está encima de todo (z-index 400) con
   `pointer-events: none`: ni la pila de capas ni el z-index dicen si tapa un texto. Mirar si el color del texto aparece
   en la caja de sus letras sí lo dice. Tres intentos con el DOM solo fallaron antes de llegar ahí (§5).
3. **El relato del banco coincide con el de la referencia**: el momento de entrada de las cuatro apariciones de la
   sección al **0–3 % del recorrido** (UI - UX y 3D WEB en el mismo píxel de scroll), las duraciones al 7–20 % y el eje de
   texto en el **21 %**. El resto de ejes no aplica: la referencia tiene además su propia escena 3D (el emblema) y este
   estudio es del relato en el DOM.
4. **El kit gana `ChapterStage`**, construido sobre el progreso de `PinnedSection`: un escenario por capítulos con la
   coreografía medida, la tarjeta con fallo de señal en WebGL y un modo controlado por progreso.

## 1. Medir el DOM

- **Gancho `scripts/cine/hooks/dom.js`** (en cada fotograma de `cine:capture`, apagable con `--sin-dom`): los textos
  visibles como bloques. El texto partido en letras o palabras (un `span` en línea por trozo, lo que hacen SplitText y
  compañía) se agrupa en su bloque y se mide la media: opacidad efectiva, desplazamiento de los trozos, recorte,
  desenfoque, color y cuerpo, más la caja **de las letras** (se mueven con su transform) y la fracción que dejan ver
  sus contenedores.
- **Visibilidad desde los píxeles** (`scripts/cine/dom.mts`): el DOM no sabe si un lienzo encima (con
  `pointer-events: none`, invisible para `elementsFromPoint`) tapa el texto: solo donde pinta. Un bloque se ve cuando su
  color de texto aparece dentro de la caja de sus letras en el fotograma (tinta), con el fondo de la caja contrastando,
  umbral al 50 % del percentil 90 de su tinta e histéresis para la salida.
- **El relato** (`relato.json` de `cine:analyze`): por aparición, cuándo entra y sale (segundos y scroll), cómo (fundido,
  sube, baja, recorte, desenfoque), cuánto tarda y con qué curva.
- **Eje de texto** en `cine:compare`: las apariciones emparejadas por su texto; el momento en píxeles de scroll sobre el
  recorrido de la referencia, la duración y la forma de entrar. `--tramo-scroll a-b` lo limita a la sección estudiada.
- **`--espera s`** en `cine:capture`: tiempo real antes de que el reloj virtual tome el control (pantallas de carga que
  cuentan con el reloj: cuatro de seis candidatas se quedaban en el cargador).

## 2. La web y lo medido

Elegida entre las Sitios del Día recientes de Awwwards (93 revisadas, seis sondeadas): Edolus, Heron AI, Nick Ho y
Santioni no dejan ver su escena o piden pasar un aviso; NOHO es casi todo DOM. Meer Mohsin: three r180, 274 000
triángulos, Lenis + GSAP ScrollTrigger, 21 782 px de página.

La sección estudiada (fijada de 3 291 a 8 691 px de scroll con 720 px de alto): una sala en perspectiva de líneas rojas,
una palabra gigante caligráfica por capítulo (LEGACY → UI - UX → 3D WEB), una tarjeta de imagen con fallo de señal en el
centro, la lista del capítulo a la derecha, la barra TENSION / IMMERSION / IMPACT y el emblema 3D bajando.

| Capítulo | Duración | Salida | Entrada |
|---|---|---|---|
| LEGACY | 3,29 pantallas (con la entrada) | 0 → −329 px en 273 px de scroll, curva en S | rebote de sus letras (+57 px y vuelta) |
| UI - UX | 1,70 | 0 → −257 px en 304 px | +257 → 0 en 327 px, frenando |
| 3D WEB | 2,51 | — | +257 → 0 en ~200 px, frenando |

## 3. `ChapterStage`

`components/ui/ChapterStage.tsx` + `lib/chapterstage/` (`coreografia.ts`, `scene.tsx`):

- Capítulos `{ word, image, items, label }`; `perChapter` en pantallas, uno para todos o uno por capítulo.
- La coreografía medida (`coreografia.ts`): la primera palabra entra 0,41 pantallas después de fijarse la sección y
  casi de golpe; en cada frontera la saliente sube con curva en S (0,38 pantallas) y la entrante llega frenando (0,45).
- Tarjeta en WebGL con la imagen del capítulo y un fallo de señal (separación de color, desgarros horizontales, líneas de
  barrido, grano) cuyo pico está en la frontera; la sala de líneas en perspectiva del color de acento.
- Lista del capítulo (entra subiendo) y barra de capítulos con el progreso.
- Fijado al scroll de la página o **controlado** con `progress` (0–1) y `height` (el catálogo usa este modo con un
  deslizador).
- Sin WebGL o con movimiento reducido: la imagen sin fallo y las líneas en SVG. Texto para lectores de pantalla: los
  capítulos en una lista.
- Banco: `/lab/cine/relato` (las palabras, listas y duraciones de la referencia, a la misma altura de scroll).

## 4. Verificación

| Lo que se esperaba | Resultado |
|---|---|
| Medir el relato escrito de una web con scroll | **Sí**: relato.json con entrada, salida, forma y curva de cada texto |
| Que la medida no se engañe con capas y texto apilado | **Sí**, tras tres correcciones: visibilidad por píxeles, caja de las letras y agrupación solo de trozos en línea |
| Comparar el relato de dos capturas | **Sí**: eje de texto, emparejado por texto y limitado a la sección (`--tramo-scroll`) |
| Recrear la coreografía de la sección | **Sí**: momento al 0–3 %, duración al 7–20 %, eje de texto al 21 % |
| Llevarlo al kit | **Sí**: `ChapterStage` con modo fijado y controlado, en el catálogo |
| Recrear la escena 3D de la referencia (el emblema) | **No** se intentó: el estudio era el relato; los ejes de imagen y cámara no aplican |

## 5. Trampas

1. **Cargadores con el reloj virtual**: la red va en tiempo real y el cargador en virtual; `--clock-later --espera 8`.
2. **El DOM no sabe qué se ve**: un lienzo con `pointer-events: none` encima no sale en `elementsFromPoint` y tapa o no
   según lo que pinte. Ni la pila de capas ni el z-index lo resuelven (en Meer Mohsin el lienzo tiene z-index 400 y deja
   ver los titulares que tiene debajo): la respuesta está en los píxeles.
3. **Palabras apiladas en el mismo hueco y del mismo color**: la tinta de un bloque ve las letras del otro. Hay que medir
   en la caja de las letras (que se mueven con su transform), no en la del bloque.
4. **Un `span` no es siempre texto en línea**: agrupar trozos solo si su `display` es `inline*`.
5. **El sitio fija `html` y `body`** (`overflow: hidden`): las páginas largas del laboratorio añaden la clase `scrollable`
   (componente `Desplazable`).

## 6. Pendiente

- El párrafo de la lista cuenta como «entra distinto»: la referencia lo sube más de 20 px (el umbral de «sube»), el banco
  14 px.
- La letra caligráfica de la referencia (una fuente de trazo, quizá dibujada): `wordFont` la admite, el kit no trae
  ninguna parecida.
- El emblema 3D que baja por la sección y la intro de la portada (titular con retrato enmascarado).
- Usar el relato escrito en la ficha (`Ficha.relato`) y en el informe interactivo (hoy solo en relato.json).
