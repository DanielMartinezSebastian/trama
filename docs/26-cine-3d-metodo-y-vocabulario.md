# 26 · Cine 3D: capturar una web WebGL/WebGPU, describirla con una ficha y depurar una recreación hasta su calidad

> Ronda 14 (23-10-2026). Hasta ahora las webs 3D de referencia se estudiaban «a ojo» o por reseñas (docs/09, 16 y 22):
> `refs:probe` mide CSS, fuentes y maquetación, pero nada de lo que pasa dentro del lienzo. Este documento recoge el
> método nuevo, que sí lo mide, el vocabulario con el que se describe una escena y el bucle con el que se acerca una
> recreación propia a la referencia. Herramienta: `npm run cine:capture`, `cine:analyze` y `cine:compare`
> (`scripts/cine/`); ficha y curvas en `lib/cine/`; banco de pruebas en `/lab/cine/[estudio]`.

## 0. Conclusiones

1. **El código minificado no basta, pero three habla.** Con `window.__THREE_DEVTOOLS__` definido antes de cargar, three
   avisa de cada renderer y escena aunque vaya empaquetado. Envolviendo `render` se obtiene la cámara de cada fotograma
   y la cadena de pasadas (el posprocesado), y del grafo de nodos TSL salen los parámetros con su nombre. En los ejemplos
   de calibración, la ficha medida coincide con el código fuente en todo lo medible (tabla de la §6).
2. **Hay tres vías y se complementan**: el gancho de three (valores exactos), las firmas de los shaders (técnicas sin
   nombre: N8AO, transmisión) y las firmas del JavaScript publicado (librerías y componentes: `N8AO`,
   `MeshTransmissionMaterial`, Rapier, GSAP, Lenis). Las dos últimas funcionan también con motores propios sin three.
3. **El vídeo es imprescindible, y a fotograma exacto.** Los valores dicen *qué* hay; el vídeo dice *cómo se mueve*
   (anticipación, inercia, ritmo, cuándo entra el texto). Con un reloj virtual (rAF, `performance.now` y `Date`
   controlados) el vídeo sale a 60 fps exactos aunque cada captura tarde 100 ms, y la referencia y el banco se comparan
   en el mismo instante.
4. **El vocabulario es un esquema de datos**: la ficha de escena (`lib/cine/schema.ts`), ocho ejes con términos
   cerrados (planos, movimientos de cámara, curvas, luces, pila de posprocesado en orden…). La misma ficha la rellena la
   captura, la monta el banco y la compara el comparador: por eso se puede medir la distancia entre las dos.
5. **El bucle funciona.** Bloom de three se recrea con SSIM 0,996; una variante con cuatro errores puestos a propósito
   los delata todos con su valor; camera-scroll de r3f pasa de SSIM 0,51 a 0,90 en tres vueltas, y en cada vuelta el
   comparador señaló lo que faltaba (scroll, materiales, sombras, amortiguado).

## 1. Por qué hacía falta

| Lo que se quería saber | Con `refs:probe` | Con `cine:*` |
|---|---|---|
| Renderer, tone mapping, exposición | `window.__THREE__` (solo la versión) | Medido en cada fotograma |
| Cámara: lente, posición, recorrido, curva | A ojo | Medida por fotograma; planos, movimientos y curva ajustada |
| Luces, entorno, materiales | A ojo | Inventario completo de la escena |
| Posprocesado | «Parece que hay bloom» | La cadena de pasadas en orden, con sus parámetros (TSL) |
| Coste | Nada | Llamadas de dibujo, triángulos, pasadas por fotograma |
| Movimiento | Capturas fijas | Vídeo a 60 fps exactos, anotado, con gráficas |

## 2. Captura: `npm run cine:capture -- <url>`

Lanza el Chromium de la caché de Playwright con `--enable-unsafe-webgpu`: **usa la GPU real también sin ventana**
(comprobado: ANGLE D3D11 sobre la RTX 5060 para WebGL, adaptador NVIDIA Blackwell para WebGPU en páginas https). Inyecta
cuatro scripts antes que los de la página (`scripts/cine/hooks/`):

| Gancho | Qué hace |
|---|---|
| `three.js` | Define `__THREE_DEVTOOLS__`; envuelve `render`; `__cine.snapshot()` (renderer, cámara, pasadas, scroll) y `__cine.inventory()` (luces, materiales, entorno, niebla, caja de la escena, parámetros de los pases TSL). Suma las llamadas de todo el fotograma (WebGLRenderer reinicia `info` en cada `render()`). |
| `shaders.js` | Guarda el GLSL y el WGSL finales, sin duplicados. |
| `clock.js` | Reloj virtual. Desde el arranque: la página carga en tiempo real pero no anima hasta el primer paso. |
| (estilo `--solo-lienzo`) | Deja visible solo el lienzo mayor sobre negro; el resto se vuelve transparente **sin dejar de recibir eventos**. |

Recorridos (`--drive`): `time` (segundos de intro o bucle), `scroll` (pasos de rueda, `--frames-per-step` fotogramas
entre pasos y `--cola` segundos sin tocar nada al final) y `pointer` (un ocho tumbado por el lienzo). `--assets`
descarga GLB, HDR y KTX2 **solo para estudio local**.

Salida en `.refs3d/<slug>/<fecha>/` (ignorada por git): `timeline.jsonl`, `inventario.json`, `shaders/`, `red.json`,
`frames/`, `video.mp4`, `hoja.jpg`, `meta.json` y `ficha.auto.json`.

**Por qué el vídeo se graba siempre y así.** `recordVideo` de Playwright y el screencast de CDP dan frecuencias
irregulares, inútiles para medir una curva. `canvas.captureStream` pierde la interfaz. Lo único exacto es el tiempo
virtual: avanzar 1/60 s, dejar que la GPU presente el lienzo y capturar. Con eso las gráficas, el vídeo y la ficha se
refieren al mismo instante.

## 3. Análisis: `npm run cine:analyze -- <captura>`

- **Rehace la ficha medida** con la versión actual de `scripts/cine/lib.mts` (una mejora del análisis vale para capturas
  antiguas sin repetirlas).
- **Planos y movimientos**: la cámara se corta en planos por saltos bruscos y, dentro de cada uno, en tramos cuando se
  para (velocidad suavizada < 5 % de la máxima durante 0,25 s) o cuando la distancia al centro cambia de sentido. Cada
  tramo se clasifica (§4) y su avance normalizado se ajusta a las curvas de `lib/cine/curves.ts`: sale la curva y su
  error, la meseta final y una **ruta** de seis puntos de paso.
- **Amortiguado del scroll**: tras el último golpe de rueda la cámara frena de forma exponencial; la mediana de
  v[k+1]/v[k] es la fracción que queda por fotograma (camera-scroll de drei: 0,95). Con amortiguado, las curvas se miden
  contra el scroll ya suavizado.
- **Imagen** (ffmpeg): luminancia, altas luces recortadas, contraste (p90 − p10), saturación, viñeteado (borde frente a
  centro), energía de movimiento y paleta (k-medias sobre miniaturas); cortes de plano (`select=gt(scene,0.3)`).
- **Firmas**: en los shaders (con un preprocesador que quita los `#ifdef` inactivos del GLSL de three) y en el JavaScript
  publicado. Son indicios: se confirman en el vídeo o en el inventario.
- **`anotado.mp4`**: código de tiempo, fotograma y el plano, movimiento y curva de cada tramo.
- **`informe.html`**: el visor. Vídeo con fotograma a fotograma (`,` y `.`) y velocidades lentas, gráficas sincronizadas
  (posición, distancia, fov, luminancia, movimiento, llamadas), tabla de tramos, **notas por instante** y **rúbrica**;
  se exportan como `notas.json`, que el siguiente `cine:analyze` mezcla en `ficha.json`.

## 4. Vocabulario: la ficha de escena (`lib/cine/schema.ts`)

Cada valor lleva su origen en `origen`: **medido** (gancho), **vídeo** (análisis o nota con tiempo), **ojo** o **código**
(fuente de la referencia). Lo que no se vio no se rellena (docs/07 §4).

| Eje | Términos (español · inglés) | Cómo se obtiene |
|---|---|---|
| 1. Plano y cámara | Tamaño de plano (detalle, primerísimo, primer, medio, americano, general, gran general · shot size); angulación (cenital, picado, normal, contrapicado, nadir, holandés); movimientos: fijo · static, dolly, travelling lateral · truck, pedestal, grúa · crane, órbita · orbit/arc, zoom, dolly-zoom, panorámica · pan, inclinación · tilt, alabeo · roll, barrido · whip pan; lente (fov y mm equivalentes); curva; meseta; profundidad de campo y cambio de foco · rack focus; temblor · camera shake; quién la mueve (tiempo, scroll, puntero) | Medido (pose por fotograma, tramos, curvas, rutas); tamaño y angulación, a ojo |
| 2. Luz y materiales | IBL/HDRI, esquema de tres puntos (principal · key, relleno · fill, contra · rim, práctica · practical), PBR (rugosidad, metálico, reflejo del entorno), transmisión, dispersión, iridiscencia, barniz · clearcoat, sheen, SSS; sombras (PCF, PCF suave, VSM, CSM, de contacto), luz horneada | Medido (luces, entorno, materiales por nombre, sombras) |
| 3. Atmósfera | Niebla lineal, exponencial o por altura; volumétricos, rayos · god rays, partículas, cáusticas, cielo | Medido (niebla; volumétrico por material y pasada reducida) y a ojo |
| 4. Posprocesado | En orden: AO (SSAO, GTAO, N8AO) → SSR/SSGI → bloom (umbral, selectivo) → DOF → desenfoque de movimiento → tone mapping (ACES, AgX, Neutral) → LUT → aberración cromática, destello, grano, viñeta → AA (FXAA, SMAA, TRAA) | Medido (pasadas y parámetros TSL), firmas, a ojo |
| 5. Movimiento | Los principios de animación que pesan en 3D: anticipación, aceleración (slow in/out), inercia · follow-through, solapamiento · overlap, arcos, exageración, puesta en escena · staging, ritmo; transiciones (fundido, máscara, portal, corte, barrido) | Vídeo y notas |
| 6. Interacción | Respuesta al puntero (parallax, inclinación, curva de seguimiento), raycast, físicas, audio | Recorrido `pointer`, firmas (Rapier, cannon, Howler), a ojo |
| 7. Interfaz | Texto DOM sobre el lienzo, DOM proyectado, texto en WebGL (SDF/MSDF) | A ojo (y firma «SDF / MSDF») |
| 8. Presupuesto | Renderer, llamadas de dibujo, triángulos, pasadas por fotograma, ms de GPU, tope de DPR, MB de carga, respaldo | Medido |

**Movimiento propio de la escena** (ejes 1, 2 y 5): **cámara de autor** (`camara.deModelo`: la anima un clip del modelo),
**animación atada al reloj** (`animacionReloj`: el tiempo de un clip sigue al scroll), **flotación · float/bob** (`flotacion`:
pivote, periodo, subida y balanceo por pieza) y **transición de material** (`transicion`: color de partida y amortiguado).
Todo sale de la captura: acciones de los mezcladores, pose de cada pieza y color de cada material por fotograma.

**Contenido** (`escena`): lo que se puede describir como datos (un GLB, una primitiva) va como pieza; lo que no (un
shader propio, una simulación) es un `componente` registrado en `components/lab/cine/componentes.ts`.

**Rúbrica** (`lib/cine/rubric.ts`): de 1 a 5 por eje, con anclas que describen lo que se ve («3 = pila sobria y medida:
tone mapping elegido, bloom con umbral; nada se nota como efecto»). Se puntúa igual la referencia y la recreación.

## 5. Banco y comparación: el bucle de depuración

```
cine:capture <referencia>  →  cine:analyze  →  ficha (medida + notas)
        ↓                                         ↓
cine:compare <ref> <banco>  ←  cine:capture /lab/cine/<estudio>  ←  banco monta la ficha
        ↓
«Depurar primero: <eje>»  →  se corrige la ficha o el banco  →  otra vuelta
```

- **Banco** (`/lab/cine/[estudio]`, `components/lab/cine/Bench.tsx`): R3F con `WebGPURenderer` (WebGL2 de reserva, o
  forzado si la referencia es WebGL) y la pila de posprocesado en TSL (`RenderPipeline`: bloom, dof, aberración, grano,
  viñeta, FXAA, SMAA). Recorre los planos por su ruta (Catmull-Rom por longitud de arco) con su curva y su meseta, aplica
  el amortiguado del scroll, y a las piezas de un GLB los materiales de la ficha por nombre. Las fichas viven en
  `components/lab/cine/estudios/`.
- **Comparación** (`cine:compare`): cámara (error de posición en % del tamaño de la escena, fov, dirección, forma del
  avance), planos, render, luces, materiales, sombras, atmósfera, pila de pases con sus parámetros, imagen (ΔE de la
  paleta, luminancia, contraste, recorte), SSIM y coste. Cada eje da un alejamiento de 0 a 100 %; el mayor es lo
  siguiente que depurar. Salida: `comparacion.md`, `comparacion.json` y `lado.mp4`.

## 6. Calibración (ejemplos con el código a la vista)

| Ejemplo | Lo medido | Verdad (código) |
|---|---|---|
| three `webgpu_postprocessing_bloom` | WebGPU, Reinhard, fov 40, cámara (−5, 2.5, −3.5), PointLight 100 colgada de la cámara, AmbientLight #cccccc; bloom strength 1, radius 0, threshold 0, smoothWidth 0,01; 14 pasadas (escena + pase de altas luces + 5 niveles de desenfoque + composición), 19 llamadas | Idéntico |
| three `webgpu_postprocessing_dof` | dof: focusDistance 500, focalLength 200, bokehScale 10; los desenfoques gaussianos como auxiliares; fov 70 | Idéntico |
| three `webgpu_volume_lighting` | Neutral, exposición 2; volumétrico: `VolumeNodeMaterial`, 12 pasos, a 0,25 de resolución, con desenfoque de limpieza 0,6 | Idéntico |
| r3f `lusion-connectors` | fov 17,5; 45 llamadas y 465 000 triángulos por fotograma; firmas: N8AO, `MeshTransmissionMaterial`, Rapier, EffectComposer; material de vidrio con aberración propia | Idéntico (bundle) |
| r3f `camera-scroll` | Órbita con alejamiento (`sine.in`) y órbita con acercamiento (`circ.out`) contra el scroll suavizado; amortiguado 0,95; ACES; sombras PCF de 1024; materiales con envMapIntensity 0,2 | Coherente con drei ScrollControls |

**Recreaciones:**

- **Bloom** desde su ficha: SSIM 0,996 en los 240 fotogramas, alejamiento 0 % en todos los ejes salvo un 1 % de imagen.
- **Bloom desviado** (fov 50, ACES, bloom 2,5 / 0,4 / 0,2): el comparador lista los cuatro cambios con su valor y ordena
  cámara (100 %), posprocesado (77 %), imagen (52 %), luz (25 %).
- **Camera-scroll desde su ficha capturada**, en tres vueltas:
  1. SSIM 0,51: la página del banco no hacía scroll (el sitio lleva `overflow: hidden`; hace falta la clase `scrollable`).
  2. SSIM 0,74: la cámara ya se mueve (error 3,9 %), pero a saltos («5 cortes»): la referencia amortigua el scroll. De
     ahí salió la medida del amortiguado. Imagen quemada: faltaba `envMapIntensity` (0,2) en los materiales y las sombras.
  3. SSIM 0,90, error de cámara 4,9 %. Queda la imagen más clara y contrastada que la referencia (luminancia +0,07,
     contraste +0,39).
  4. **Cuarta vuelta (24-10-2026): de la imagen a la escena.** Con variantes por URL (`?ajuste=`) sobre un fotograma
     fijo se descartó la luz: ni sin ambiente, ni sin direccional, ni sin entorno, ni sin sombras, ni con el
     `WebGLRenderer` clásico (que con los mismos valores da exactamente lo mismo que el motor de nodos) se acerca el tono.
     Lo que destapó la vuelta, en orden:
     - **El reloj de rueda estaba mal escalado**: drei ScrollControls tiene menos recorrido que la rueda mandada. Se mide
       la **saturación** (el último golpe que aún mueve algo) y el progreso es la rueda hasta ahí: 2 250 px, 3,1 pantallas.
     - **El GLB tiene un clip atado al scroll** (`CameraAction.005`): su tiempo sigue al scroll suavizado con r² 0,9998,
       de 0 a 1,175 s. Ahora la captura registra las acciones de animación y el banco las ata al reloj
       (`animacionReloj`).
     - **El scroll de la ventana añade su propio suavizado** (el desplazamiento suave de Chrome): el banco lee la rueda
       con un scroll virtual, como ScrollControls.
     - **Comparar por el reloj estimado de cada captura mete error**: con la misma entrada, se alinea fotograma a
       fotograma (la cámara pasó de 16 % a 4,4 % de error sin tocar el banco).
     - **El cuaternión local engaña**: la cámara de un GLB de Blender cuelga de un nodo animado; el gancho guarda el del
       mundo y la ficha gana el **alabeo** (0,01° de error).
     - **La causa del tono**: el inventario de piezas (pose de cada malla en el mundo) muestra que la referencia hace
       **flotar cada pieza** (pequeños giros que cambian con el tiempo: `Float` de drei) y las monta bajo un grupo a
       escala 0,25; el zepelín no da ni recibe sombra. Las caras que la referencia deja en negro son las de piezas giradas
       respecto a la luz. Siguiente vuelta: la flotación de piezas en la ficha y el banco.

     Resultado: cámara al 4,4 % y alabeo 0,01°, clip del GLB al mismo tiempo, SSIM 0,90; la imagen sigue +0,07 de
     luminancia hasta reproducir la flotación.
  5. **Quinta vuelta (24-10-2026): la escena se mueve sola.** Con una captura en reposo de 10 s y la pose de cada pieza
     por fotograma salieron tres cosas que la ficha no tenía:
     - **Flotación** (`Float` de drei): cada pieza sube y baja ±0,25 y se balancea 3–6° con un periodo común de 12,55 s
       (speed 2) y su propia fase, alrededor de un pivote común. Se ajusta a senoides y el banco la reproduce con un grupo
       por pieza en el pivote. Piezas al 1,2 % y 2,5°.
     - **Transición de material**: los materiales empiezan con el color del GLB (`#f9f9f9`) y se funden a `#202020`
       con un amortiguado de 0,95 por fotograma (el resaltado al pasar el ratón del ejemplo). La ficha tomaba el primer
       instante: era la causa de toda la diferencia de tono. Ahora toma el estado asentado y la transición.
     - **Cámara de autor**: el clip atado al scroll anima el nodo del que cuelga la cámara (`Camera`, de Blender). La
       captura lo detecta (cadena de padres de la cámara y pistas de cada clip) y el banco usa esa cámara tal cual.

     Resultado: cámara al 0,51 % y 0,6°, los mismos planos, luminancia −0,000, ΔE de la paleta 0,5 y **SSIM 0,921**;
     ningún eje por encima del 18 %. Lo que queda: el giro de la flotación (una senoide por eje aproxima la de drei) y el
     contraste (−0,07).

## 7. Trampas (para no repetirlas)

1. **Chrome de la extensión congela rAF** entre capturas (docs/13 §5, 14 §5): siempre Playwright.
2. **`visibility: hidden` corta los eventos**: drei ScrollControls y Lenis escuchan la rueda en capas encima del lienzo.
3. **WebGLRenderer reinicia `info` en cada `render()`**: con un compositor solo se ve la última pasada; hay que sumar.
4. **El GLSL de three llega sin preprocesar**, con todos los `#ifdef` de sus trozos: sin quitarlos, cualquier material
   «tiene» transmisión e iridiscencia. Las funciones de tone mapping están todas siempre: el que se usa lo mide el gancho.
5. **`distanceFalloff` es de las luces de three**, no de N8AO (que se reconoce por oclusión + ruido azul).
6. **«NodeMaterial» viaja en bundles WebGL** que no usan TSL: la firma de TSL busca asignaciones `.colorNode =`…
7. **Los mapas de sombras son pasadas de escena cuadradas**: una pasada «reducida» de volumétrico tiene la proporción del
   lienzo.
8. **GLB con Draco**: el repo no lo usa (CSP); para estudio, `npm run models:fetch -- sin-draco <archivo>`.
9. **R3F pisa el tone mapping** después de crear el renderer: los valores de la ficha van en `onCreated`.
10. **Las unidades del reloj de scroll pueden ser diminutas**: las duraciones mínimas, en fotogramas, no en progreso.
11. **Una captura sin cola** no deja ver cómo se asienta la página: `--cola` (1,5 s por defecto).
12. **El recorrido de scroll de la página no es la rueda que se manda**: hay que medir dónde satura.
13. **El cuaternión local de la cámara no sirve** si cuelga de un nodo animado (cámaras de Blender): siempre el del mundo.
14. **Con la misma entrada, se compara fotograma a fotograma**: alinear por relojes estimados mete el error de la estimación.
15. **El scroll de la ventana de Chrome se suaviza solo**: un banco con reloj de scroll lee la rueda en virtual.
16. **Para descartar causas, variantes por URL** (`/lab/cine/<estudio>?ajuste=<json>`) sobre un fotograma fijo: es más
    rápido que editar la ficha y deja el experimento escrito.
17. **Los materiales también se animan** (resaltados, fundidos): la ficha toma el estado asentado, no el primer instante.
18. **Una cámara puede venir del modelo**: antes de ajustar curvas, mirar si un clip anima un padre de la cámara.
19. **Nada con efectos en un `useMemo`**: React (StrictMode) lo ejecuta dos veces; en el banco dejaba las piezas en grupos
    quietos.

## 8. Pendiente

- **Camera-scroll**: el giro de la flotación con el modelo exacto de drei (coseno en x, seno en y y z con amplitudes 1/8 y
  1/20) en vez de una senoide por eje, y el resaltado al pasar el ratón como interacción de la ficha.
- **Primer estudio real** (fase 4 del plan): una pieza con carácter de la portada de threejs.org (Tidewater, Plain Sight,
  Hublot) y después webs premiadas cerradas (Oryzo, IVRESS, Hubtown).
- **Motores sin three** (Hydra de Active Theory): flujo óptico sobre el vídeo para la cámara, WebGPU Inspector para las
  pasadas; Spector.js para un fotograma WebGL (aplazado: el gancho ya da lo que daba).
- **Extraer al kit** lo que demuestre su valor: `lib/postfx` (la pila TSL del banco como componente `PostFX`) y el campo
  `cine` de las guías de estilo (`lib/ui/guides.ts`).
- Más pases en el banco: AO (GTAO), SSR, LUT, desenfoque de movimiento, niebla por altura, partículas.
