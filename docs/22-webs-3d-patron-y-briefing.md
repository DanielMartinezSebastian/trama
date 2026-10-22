# 22 · Webs 3D e interactivas: qué tenemos, el patrón y cómo preguntar antes de construir

> Estudio del 22-10-2026, tras Quilate ([19](./19-joyeria.md)) y Ánima ([20](./20-halloween.md)), con el tutorial de fluidos
> ([21](./21-simulacion-fluidos-threejs.md)). Para la próxima web de alto impacto, con 3D, *shaders* o un relato con el
> scroll, este documento responde a tres cosas:
> - qué sabemos hacer y qué falta (§1–§2);
> - cómo se construye, en diseño y en código (§3–§5);
> - **qué hay que preguntar al cliente antes de empezar** (§6), incluido si hace falta un relato.
>
> La §7 resume las vías para conseguir modelos y la §8, las trampas que ya nos han costado tiempo.

## 0. Conclusiones

1. **Tenemos un oficio completo para el «objeto que cuenta la historia»**: un modelo protagonista en un escenario fijo,
   que cambia de pose con el scroll mientras pasan capítulos, con luz y efectos por capítulo. Quilate y Ánima lo
   demuestran y el kit ya lo empaqueta:
   - `useScrollStory`, el motor de pasos;
   - `lib/gems`, gemas trazadas;
   - `ModelNav`, `ObjectStage` con GLB y `Traveler`;
   - `FluidSmoke` y `FireRing` (aún propios de Ánima).
2. **Lo hicimos bien en lo que más pesa**:
   - la pose se interpola con la posición del scroll (no con el tiempo), con meseta;
   - el 3D llega tarde (puerta de WebGL, carga perezosa, imagen plana de respaldo);
   - el texto sigue siendo DOM;
   - todo se comprueba con capturas en escritorio y móvil.
3. **Nos ha costado iteraciones** el encuadre (centrar, escalar, cortes del lienzo en móvil), las capas (qué va delante del
   3D) y la CSP (WebAssembly). Son las tres primeras cosas que hay que decidir en una web nueva (§4).
4. **Falta para «demo completa de alto impacto»** (§2):
   - una puerta de entrada con progreso de carga y sonido opcional;
   - un único lienzo por página cuando hay varias escenas;
   - posprocesado en el kit (hoy solo en Quilate);
   - presupuesto de rendimiento por dispositivo;
   - y una demo de un concepto propio de Trama en 3D: la nube de puntos (§9).
5. **Antes de construir, preguntar** (§6): sin la respuesta a «¿qué objeto?, ¿qué decisión debe tomar el visitante?, ¿en qué
   dispositivo?» se rehace el encuadre tres veces.

## 1. Inventario: lo que sabemos hacer

| Capacidad | Dónde | Notas |
|---|---|---|
| Recorrido por pasos (escenario fijo + pasos que pasan) | `lib/story/useScrollStory` (kit); Quilate y Ánima | Publica `--w<k>`, `--r<k>`, `--o<k>`, mueve los cuadros (tilt-shift) y llama a `onFrame` para la pose |
| Pose por scroll con meseta | `BEATS` de cada web | El 30 % central de cada paso, quieto: el objeto ya está colocado cuando llega el texto |
| Cuadros detrás del 3D que entran desenfocados | `useScrollStory` (`[data-card]`) | Opacidad y desenfoque según la distancia a la línea media |
| Cintas de texto (detrás y delante del objeto) | Quilate, Ánima (CSS) | `--r<k>` las desplaza; `--o<k>` las apaga antes del paso vecino |
| HUD alineado con el detalle | `focus` (la escena proyecta su punto de mira) | En móvil se centra donde enseña la cámara |
| Luz por finalidad | `LightScroll`, `lib/ui/light.ts` (kit) | Temperatura e intensidad por sección; la lee three |
| Gemas con trazado de rayos | `lib/gems` (kit) | Fresnel, reflexión interna total, dispersión, Beer–Lambert; HDR de taller; `uGlow` (luz interior) |
| Humo de fluido (Stable Fluids) | `components/sites/anima/FluidSmoke.tsx` | WebGL2, 128/512, Jacobi; un preset por capítulo |
| Shader de fuego (eclipse) | `components/sites/anima/FireRing.tsx` | fbm polar, rayos, chispas, humo |
| Posprocesado de movimiento | `components/sites/quilate/motionFx.tsx` | Desenfoque de movimiento y tilt-shift solo en transiciones |
| Niebla al alejarse, velo en cambios de material | Quilate | Por material, sin `scene.fog` |
| Modelos procedurales | Anillo (torno, brillante), calavera SDF + MarchingCubes | Sin descargas; respaldo de modelos GLB |
| Modelos descargados, por piezas | `npm run models:fetch` + gltfjsx | Ver §7 |
| Objeto que mira al puntero | `ObjectStage src follow`, `ModelNav` | Inclinación con retraso |
| Golpes con muelles | Ánima (§2f de la 20) | `x'' = −k·x − c·x'`; sin motor de físicas |
| Elementos que viajan entre rutas | `Traveler` / `TravelSlot` (kit) | El mismo nodo vivo; la gema al ojo, la calavera al navbar |
| Navbar con modelo | `ModelNav` (kit) | `model` (escena) o `emblem` (un hueco de viajero) |
| Maqueta 3D y recorrido de cámara | `ExplorableCanvas depth="3d" nav="scroll"` | De la ronda 4 |

## 2. Qué falta para una demo completa de alto impacto

Por orden de valor:

1. **Puerta de entrada**: un preloader con el progreso real de los recursos (GLB, HDR, texturas: `THREE.DefaultLoadingManager`)
   y un «entrar» que desbloquea el sonido. Las webs premiadas de la ronda 4 lo tienen todas; nosotros cargamos en silencio
   y el primer fotograma 3D llega tarde en móvil.
2. **Un solo lienzo por página**: Ánima monta hasta cinco contextos de GL (escena, humo, fuego, navbar, ObjectStage). En
   móvil, el límite de contextos y la memoria lo notan. Un lienzo con `View` de drei (varias escenas en un canvas) o
   *scissor* lo resolvería; es la deuda técnica más importante.
3. **Posprocesado en el kit**: bloom (luz que desborda), profundidad de campo, grano y aberración. Hoy solo existe la pasada
   propia de Quilate. Un `lib/postfx` con un compositor ligero (sin `postprocessing`, que trae WebAssembly opcional) daría
   el «acabado cine» que se ve en los SOTD.
4. **Presupuesto de rendimiento por dispositivo**: `useGLGate` decide sí o no. Falta el término medio (menos resolución
   del fluido, sin dispersión en las gemas, `dpr` 1) según `navigator.hardwareConcurrency`, la memoria y una medida de
   FPS de los primeros 2 s.
5. **Sonido**: ambiente y respuestas a la interacción (la calavera que castañetea). Ninguna demo lo tiene; Sonar lo hace
   en 2D.
6. **Accesibilidad del relato**: el texto está en el DOM, pero falta un «saltar la introducción» y un índice de capítulos
   que funcione con teclado en todas las demos (Quilate lo tiene; Ánima, a medias).
7. **WebGPU**: three ya lo trae con WebGL de reserva y TSL para los *shaders*. Pendiente desde la ronda 4; no es urgente
   mientras WebGL baste.
8. **Texturas comprimidas (KTX2/Basis)**: ahorrarían memoria de GPU, pero el transcodificador es WebAssembly y choca con
   la CSP (§8). Si se activa, añadir `'wasm-unsafe-eval'` a `script-src` a conciencia, documentándolo.

## 3. El patrón de diseño: cuándo un relato y cómo es

**¿Hace falta un relato con scroll?** Sí, cuando:
- hay **un objeto protagonista** que se entiende mejor visto de cerca, por partes o cambiando: una joya, un producto, un
  edificio, un mecanismo, una mascota;
- el visitante tiene que **entender un proceso o una oferta en pasos**: cómo se hace, qué incluye, cómo es la noche;
- la marca **vende experiencia** más que catálogo: lujo, eventos, cultura, lanzamientos.

No, cuando:
- el visitante viene a **hacer algo rápido**: reservar, comprar algo que ya conoce, consultar un horario. El relato se
  queda en la portada y el resto es web funcional;
- no hay objeto ni contenido que aguante cinco o siete pasos: un relato de dos pasos es un hero, no un relato;
- el público navega sobre todo en móviles modestos y no hay presupuesto para afinar el rendimiento.

**La forma** (lo que funciona en Quilate y Ánima):
- **Portada**: el objeto, grande y legible, con el mensaje de la marca en claro. En Ánima, la calavera es una letra del
  titular. El objeto no se tapa nunca.
- **Prólogo**: una frase que se enciende al bajar, a un lado del objeto.
- **Capítulos (5–7)**: cada uno con un **cuadro** (rótulo, tesis, dato y llamada), una **pose** distinta y un **efecto**
  propio (luz, humo, sala). Tras cada uno, un **interludio** sin cuadro, con dos cintas de texto y el objeto haciendo otra
  cosa.
- **Final**: el objeto entero, quieto un momento, y el escenario se suelta para seguir con la web normal.
- **Tras el recorrido**: la web funcional (entradas, galería, preguntas, contacto) con piezas del kit.

**Reglas de encuadre** (las que más iteraciones han costado):
- El objeto **se centra por su cuerpo**, no por su caja con accesorios. `Box3.setFromObject` cuenta también lo oculto:
  mide solo las piezas que importan.
- En **escritorio**, el objeto va al lado contrario del cuadro y su HUD no toca el cuadro; si no cabe, se aparta el objeto,
  no se encoge el HUD.
- En **móvil**, el lienzo ocupa toda la pantalla y el objeto se coloca con la cámara: arriba si hay cuadro debajo, en el
  centro en los interludios. Nada de lienzos a media pantalla con degradado, que cortan el objeto.
- **Capas, de atrás adelante**: fondos de sala, HUD, cintas de detrás, prólogo, cuadros, objeto, cintas de delante, índice.
  Los cuadros van por debajo del objeto y por encima del HUD.

## 4. El patrón de código

```
DOM (pasos [data-step], cuadros [data-card])  →  useScrollStory (tramo j, t; CSS vars)  →  onFrame: pose = lerp(BEATS[j], BEATS[j+1], t)
                                                                                                  ↓
                                         escena R3F (useFrame): sigue la pose con un lerp corto; cámara, materiales, efectos
```

1. **Los datos primero**: una tabla `BEATS` (tipo de paso, capítulo, pose, sala, efecto del HUD) y una de capítulos
   (textos). Se lee como un guion y se afina sin tocar la escena.
2. **El motor no opina**: `useScrollStory` mide y publica. La web pone sus reglas en `onFrame`: ajustes de móvil, el HUD,
   el humo.
3. **La escena sigue a la pose** con un `lerp` por fotograma (`k = min(1, dt·7)`). Nunca dos `lerp` a la vez sobre la misma
   variable: el punto de equilibrio dependería del ritmo de fotogramas y la cámara temblaría (Quilate).
4. **El 3D, perezoso y con respaldo**: `useGLGate` (WebGL, equipo, cerca de la pantalla), `lazy()` para three y una imagen
   plana (SVG) mientras tanto, sin WebGL y con movimiento reducido. `frameloop="never"` fuera de pantalla.
5. **Proyectar para alinear el DOM**: la escena escribe en un `ref` dónde cae su punto de interés (`focus`, `bustEye`) y el
   DOM se coloca ahí (HUD, el hueco del ojo). Al revés, el DOM manda la pose: el hueco de la O de la portada.
6. **Muelles en vez de físicas** para reacciones de un objeto: integrados con `dt` acotado (`≤ 1/30`). Un motor de
   físicas (Rapier) solo con muchos cuerpos que chocan, y entonces hay que tocar la CSP (§8).
7. **Viajes entre rutas**: el objeto vive en el layout dentro de un `Traveler`; cada página pone un `TravelSlot`. Para un
   viaje dentro de la misma página, otro hueco en `startTransition` con otra `key`.
8. **Efectos a pantalla completa** (humo, fuego) en su propio lienzo, detrás del objeto, que no pintan sin intensidad. Es
   la deuda de §2.2: mejor en el mismo contexto.
9. **Comprobar con Playwright** en 1440×900 y 390×844 (y 360), en varios puntos del recorrido, con un reloj real (los
   efectos necesitan segundos). En producción (`next start`) para ver la CSP.

## 5. Piezas del kit que conviene usar (y no rehacer)

`useScrollStory`, `LightScroll`, `ModelNav`, `ObjectStage` (formas o `src` GLB), `Traveler`, `SmoothScroll` (Lenis),
`IslandNav` + `FullscreenMenu`, `ActionBar soft`, `Countdown`, `Marquee`, `HorizontalScroll`, `ImageReveal`, `BentoGrid`,
`ExpandingPanels`, y los motores `lib/gems` y `lib/ui/gl`. Las piezas que nacen en una web (fluido, fuego, el busto)
suben al kit cuando una segunda web las pida (guía §12).

## 6. Briefing: qué preguntar al cliente antes de construir

Las preguntas que cambian lo que se construye. Se hacen al principio; si el cliente no sabe responder, se proponen dos
opciones con una imagen o un enlace a una demo de Trama (`/sitios/quilate`, `/sitios/anima`).

**Negocio y objetivo**
1. ¿Qué tiene que hacer el visitante al terminar? (Comprar, reservar, pedir cita, escribir, recordar la marca). Define la
   llamada de cada cuadro y lo que va tras el recorrido.
2. ¿Quién es el visitante y desde qué dispositivo llega? (Campaña en redes = móvil; B2B = escritorio). Define el
   presupuesto de rendimiento y si el 3D es protagonista en móvil.
3. ¿Hay una fecha o un lanzamiento? (Cuenta atrás, entradas, preventa).

**El objeto y el relato**
4. ¿Hay un objeto protagonista? ¿Cuál? (Producto, pieza, mascota, edificio). Sin objeto, valorar un relato tipográfico o
   de imagen en vez de 3D.
5. ¿Existe ya en 3D? (CAD, GLB, un modelo de Blender, fotos para fotogrametría). Si no: ¿descargado (licencia CC0 o CC BY),
   generado por código o modelado (Blender)? (§7).
6. ¿Qué partes deben moverse? (Abrirse, despiezarse, girar una pieza, una boca). Pide un modelo **articulado**: piezas con
   nombre o esqueleto.
7. ¿Qué pasos tiene la historia? (5–7 capítulos: qué se cuenta, qué dato y qué llamada lleva cada uno). Si no hay cinco
   cosas que contar, no es un relato: es una portada.
8. ¿Tono? (Lujo tranquilo, terror, técnico, divertido). Define luz, efectos, tipografía y ritmo del scroll.

**Marca y contenido**
9. Logotipo, colores, tipografías y fotos reales. ¿Hay copy o lo escribimos? (Los textos por defecto del kit son de
   demostración.)
10. ¿Qué páginas además del relato? (Precios, entradas, contacto, catálogo, blog.)

**Técnica y límites**
11. ¿Dónde se aloja y con qué política de seguridad? (Si la CSP no permite WebAssembly: nada de Draco, meshopt, KTX2 ni
    Rapier.)
12. ¿Accesibilidad y SEO? (El texto siempre en el DOM; respaldo sin 3D; movimiento reducido.)
13. ¿Sonido? (Solo tras un gesto del usuario.)
14. ¿Medición? (Eventos por capítulo, clics en llamadas.)

**Para entender al usuario que pide la web** (a menudo un diseñador o el propio desarrollador):
- ¿Tiene una referencia? Pedir el enlace y medirla con Playwright (método de la [16](./16-guias-de-estilo-plan.md)).
- ¿Prefiere ver opciones o que se decida por él? En esta sesión, el usuario afinó a mano los encuadres (memoria
  «Quilate: encuadres a mano»): no pisar lo que ajusta.
- ¿Itera sobre capturas? Enseñar capturas de escritorio y móvil en cada vuelta y medir lo que se pueda (solapes,
  posiciones), no solo describir.

## 7. Cómo conseguir los modelos (las cuatro vías)

| Vía | Cuándo | Cómo |
|---|---|---|
| **Descargar** | Hay un modelo libre parecido | `npm run models:fetch -- buscar "x" --articulado --caras 40000`. Fuentes: Sketchfab (bajar pide `SKETCHFAB_TOKEN` en `.env.scripts`), Poly Pizza (`POLY_PIZZA_KEY`), Poly Haven y Khronos. Licencias CC0 y CC BY (se descartan SA, ND y NC); créditos en `public/models/credits.json` y `LICENSES.md`, y en el pie de la web si es CC BY. El informe dice si viene con esqueleto, animado, por piezas o de una sola pieza |
| **Por piezas (gltfjsx)** | El modelo trae piezas con nombre | `-- bajar fuente:id nombre --partes`: gltfjsx con `--transform --keepmeshes --keepnames --types` genera `components/models/<Nombre>.tsx` (nodos por pieza y `play` si hay animaciones). El GLB optimizado se cuantiza sin Draco (CSP) |
| **Partir a mano** | El modelo es de una sola pieza (la calavera de Khronos) | Clasificar triángulos por su centro con planos y franjas en las coordenadas del modelo (la línea de la boca, la rama, la coronoides) y escribir un GLB con dos mallas (gltf-transform). Suelen quedar lascas en el corte: material a dos caras |
| **Generar por código** | Formas paramétricas (anillos, tallas) u orgánicas sencillas | Torno (`LatheGeometry`), poliedros convexos (tallas: el trazador de gemas lo exige), SDF + `MarchingCubes` (la calavera procedural), con oclusión calculada con la propia SDF |
| **Modelar en Blender (MCP)** | Un kit de piezas propio, con anclajes | Sesión con el MCP de Blender: `bpy` en modo headless genera las piezas en mm, con materiales `metal`/`gem` y *Empties* de anclaje (`attach_head`, `seat`, `pave_NN`), y un `manifest.json`. Así se hizo el kit de anillos de Quilate (19 §6). Se integran con gltf-transform (`weld`, `quantize`, `dedup`) |

Y el entorno: el HDR de taller (`lib/gems/hdr.ts`, Poly Haven CC0) para materiales que reflejan; `RoomEnvironment` de three
cuando no se quiere cargar nada.

## 8. Trampas aprendidas (para no repetirlas)

| Síntoma | Causa | Solución |
|---|---|---|
| El 3D no aparece en producción y en desarrollo sí | La CSP no permite compilar WebAssembly (Draco, meshopt, KTX2, Rapier) | Modelos cuantizados sin Draco; `useGLTF(url, false, false)` (drei activa meshopt por defecto y su decodificador compila nada más cargarse). Probar con `next start` |
| La cámara tiembla en reposo | Dos `lerp` sobre la misma variable en el mismo fotograma | Una sola fuente por variable |
| El objeto sale descentrado o «colgando» | `Box3.setFromObject` cuenta los nodos ocultos (un sombrero) | Medir solo las piezas del cuerpo |
| Lienzo blanco en desarrollo | `loseContext()` al desmontar + StrictMode repite el efecto sobre el mismo `<canvas>` | No llamar a `loseContext()`; borrar programa y búfer |
| Un shader pinta mal sin errores | `smoothstep` con bordes invertidos no está definido en GLSL ES | `1 − smoothstep(a, b, x)` |
| La gema se ve plana | Índice real de la piedra (1,57), caja de luz sintética y foco desde la cámara | HDR, índice «de escaparate» y foco que barre |
| El lienzo corta el objeto en móvil | Lienzo a media pantalla con degradado | Lienzo completo y la cámara coloca el objeto |
| El humo o el HUD quedan desplazados | La proyección `focus` se mide sin el desplazamiento lateral | Usarla solo en móvil o de cerca; en escritorio, el centro del HUD |
| Un viajero aparece detrás de la isla | La isla está en `z-index` 40 y el viajero en 30 | `z-index` propio del viajero según su `data-at` |
| El script de modelos rompe las comillas | Heredocs con acentos graves y `$` en Bash | Escribir los scripts de edición como archivos |
| `main` roto unos minutos | Un `git add` con una ruta inexistente aborta el lote y el commit sale incompleto | Comprobar `git status` antes de subir y compilar `origin/main` limpio después |

## 9. La demo siguiente

Ver la evaluación de mercado y la decisión en [23](./23-demo-escaner.md).
