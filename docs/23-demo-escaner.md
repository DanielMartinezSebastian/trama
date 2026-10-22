# 23 · Qué demo 3D toca: evaluación y la web «Cota» (nube de puntos)

> 22-10-2026. Petición: revisar la librería y la documentación, evaluar qué demo con 3D, *shaders* o WebGL conviene según el
> mercado, y construir **una web pequeña, muy reactiva en los detalles y con guion**. El patrón y el briefing están en
> [22](./22-webs-3d-patron-y-briefing.md).

## 1. Qué cubren ya las demos 3D

| Demo | Qué demuestra en 3D | Sector |
|---|---|---|
| Quilate | Objeto protagonista por capítulos, gemas trazadas, configurador | Joyería (producto de lujo) |
| Ánima | Personaje por capítulos, fluidos y fuego, viajes entre rutas, modelo descargado y articulado | Evento |
| Almíbar Taller | Configurador de producto (tarta) | Pastelería |
| Alzado, Plano, Sonar | Maqueta de papel y recorrido de cámara (`ExplorableCanvas depth="3d"`) | Arquitectura, inspección, sonido |
| Estudio | `ObjectStage` (formas con materiales físicos) | Estudio creativo |

Dicho de otro modo: **producto y configurador** (lo que más piden las marcas) y **personaje con relato** ya están
cubiertos dos veces. Falta el 3D de **datos**: el que no enseña un objeto bonito, sino un lugar medido.

## 2. Mercado

- Las listas de tendencias de 2026 ponen el 3D y WebGL entre lo más visto. Lo usan empresas de producto, SaaS, agencias y
  portfolios, sobre todo para previsualizar productos y objetos interactivos
  ([Indie Hackers](https://www.indiehackers.com/post/web-design-trends-for-2026-what-modern-websites-will-look-like-AfDItczI1BpJwWTMd7sC),
  [Tilda](https://tilda.education/en/web-design-trends-2026), [Clay](https://clay.global/blog/web-design-guide/web-design-trends)).
  Las mismas guías avisan: 3D solo cuando resuelve algo, con cuidado del rendimiento y del SEO. Ninguna da cifras de
  demanda: son opiniones de agencias.
- Las SOTD de la [15](./15-evaluacion-proximas-demos.md) §2 dejaban un concepto sin hacer, muy propio de Trama (puntos,
  matriz, textmode): la **nube de puntos con barrido de escaneo** (Lidar Drone Scanning, de Riotters). Las nubes de puntos
  en la web son terreno de visores técnicos como Potree, también sobre three.js
  ([potree.org](https://www.ep.sci.hokudai.ac.jp/~mkuriki/potree-1.5/src/viewer/sidebar.html)). Ahí hay hueco para una
  versión **de marca**: comercial, ligera y con relato.
- **Sectores** que la usarían: topografía y fotogrametría con dron, constructoras e ingenierías, gemelos digitales,
  inspección industrial, patrimonio (escaneo de monumentos), agricultura de precisión e inmobiliaria (solares). Son B2B,
  con presupuesto de web y sin demo en Trama (la [11](./11-estudio-sectores-2026.md) no los cubre).

## 3. Decisión

**«Cota»**, una empresa ficticia de topografía con dron y gemelos digitales en Zaragoza. Una sola página, con el patrón de
la 22:
- **Pieza nueva del kit**: `PointCloud`, que la 15 proponía. Es un lienzo three con un terreno de puntos procedural (sin
  descargas), un **barrido** que revela los puntos, color por cota, **lupa del puntero** que lee la cota bajo el ratón,
  **extrusión** de los edificios y una **línea de medida**. Todo por una pose, como la calavera, para que el scroll lo
  guíe. Sin WebAssembly (CSP) y con respaldo plano.
- **Guion** (cinco pasos con `useScrollStory`):

  | Paso | Qué pasa | Qué hace la nube |
  |---|---|---|
  | 00 Portada | «Medimos el terreno al centímetro» | Vista alta; los puntos aparecen al paso del barrido |
  | 01 Vuelo | El dron sobrevuela | La cámara baja y gira |
  | 02 Escaneo | Millones de puntos con su altura | Color por cota (de valle a cumbre) |
  | 03 Medición | Distancias y desniveles | Línea de medida con su cifra; la lupa del puntero lee la cota |
  | 04 Gemelo digital | El solar como modelo | Los edificios se levantan desde el suelo |

- **Muy reactiva en los detalles**: la lupa (brillo, color por cota y lectura X/Y/Z que sigue al ratón), la nube que se
  inclina un poco hacia el puntero, el barrido que deja una estela y un clic que lanza un «pulso» de escaneo desde el punto
  pulsado.
- **Tras el recorrido**: servicios (bento), cifras y contacto con piezas del kit.

## 4. Lo construido

**Pieza del kit `PointCloud`** (`components/ui/PointCloud.tsx`, escena en `lib/pointcloud/scene.tsx`, catálogo «galerías»):
- **El terreno**: ruido de valor fractal con un cerro, un río en diagonal y un solar aplanado con seis edificios (cajas de
  puntos en fachadas y cubierta). Todo con semilla (`seed`), ~32.000 puntos por defecto (60 % en móvil) y borde
  redondeado: una «isla» de datos.
- **Un solo `ShaderMaterial`** sobre `Points`, con mezcla aditiva:
  - el barrido avanza por x con una estela que brilla;
  - el color va por cota (`--acc2` → `--acc`) o en uno;
  - los edificios se levantan desde la cota del solar (`lift`) y pasan a blanco;
  - la lupa sube y enciende los puntos cerca del puntero;
  - un clic lanza un anillo que se expande (pulso).
- **La lupa en el DOM**: el rayo del puntero se corta con el plano a la cota del terreno (una corrección) y la escena
  escribe X/Y/Z (escaladas a metros con `scale` y `meters`) y su sitio en pantalla. Una etiqueta del DOM los sigue, sin
  re-renderizar.
- **La línea de medida**: un `Line` de three entre dos puntos a ras de terreno, con su etiqueta en el centro proyectado
  (`{d}` distancia y `{h}` desnivel, calculados de la nube).
- **La cámara**: en órbita (`yaw`, `pitch`, `zoom`) con desplazamiento en paralelo (`x`, `y`) y una inclinación leve hacia
  el puntero (`follow`).
- **Sin pose de fuera**: barrido en bucle o órbita lenta. Sin WebGL o con movimiento reducido: una rejilla de puntos plana
  en perspectiva (CSS). Sin WebAssembly.

**La web `Cota`** (`/sitios/cota`, `components/sites/cota/`):
- Una página: portada a la izquierda con la nube barriéndose a la derecha, cuatro pasos con `useScrollStory` (vuelo,
  escaneo, medición, gemelo digital) y, tras el recorrido, servicios (`BentoGrid`), cifras (`StatsSection`) y contacto
  (`ContactForm`, de mentira).
- En móvil, la nube centrada arriba y los cuadros abajo.
- Comprobada con `next start` (CSP de producción) a 1440 y 390 px.

**Pendiente**: ~~un preloader con el progreso~~ (hecho: [22](./22-webs-3d-patron-y-briefing.md) §2b), sonido opcional y que el color por cota dibuje curvas de nivel (franjas cada
x metros, un `fract()` en el *shader*).
