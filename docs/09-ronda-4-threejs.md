# Ronda 4: webs premiadas con Three.js (19-10-2026)

> Fuentes: el listado de Utsubo [«8 Best Three.js Websites of 2026»](https://www.utsubo.com/blog/best-threejs-websites-2026), el
> de [hontran.dev](https://www.hontran.dev/blog/best-award-winning-websites-2026) y la categoría Three.js de
> [Awwwards](https://www.awwwards.com/websites/three-js/). Se **abrieron en Chrome** Oryzo e Iventions; del resto solo se leyó la
> reseña, así que no hay medidas propias. Complementa [`08-ronda-3-webs-premiadas.md`](./08-ronda-3-webs-premiadas.md).

## Observado

| Web | Qué hace (técnica) | En Trama |
|---|---|---|
| [Oryzo](https://oryzo.ai/) (Lusion; sitio del mes de abril de 2026 según Utsubo) | Escritorio de maquetista visto desde arriba: alfombrilla de corte con regla, lápices y cúter; un solo objeto en three.js; la intro dibuja **anotaciones de CAD** (líneas discontinuas, tiradores) alrededor del objeto; el scroll acerca la cámara (dolly en Z real), con profundidad de campo y textos que se enfocan | `ExplorableCanvas nav="scroll"` + `dims` (cotas en el tablero) |
| [Iventions](https://iventions.com/) (SOTD, Developer Award) | Haces de luz cónicos que barren la página y tiñen lo que tocan; el wordmark cambia de color bajo el haz; vídeo en una tarjeta inclinada; un foco final que llena la pantalla de color | Pendiente: un modo «haz» para `Spotlight` |
| Explore Primland (según Utsubo) | Vuelo de cámara sobre un terreno real con niebla, guiado por el scroll | `nav="scroll"` + niebla en la escena |
| Cartier Watches & Wonders (Immersive Garden, según Utsubo) | Seis «salas» 3D, una por producto; el scroll pasa de una a otra; audio | Las paradas de `path` con su texto |
| Hubtown (Unseen Studio, según Utsubo) | Monolito sobre agua; el cursor revela detalle | Pendiente |
| IVRESS (Utsubo) | `WebGPURenderer` con WebGL de reserva; shaders en TSL | Pendiente: probar `three/webgpu` |
| Overworld Audio (ronda 3) | Mapa 3D que se arrastra con puntos clicables | `ExplorableCanvas depth="3d"` |

**Tendencia** (según las reseñas, sin verificar): en 2026 domina la narración por scroll con escenas 3D en vez de páginas 2D,
y WebGPU empieza a ser normal con WebGL de reserva.

## Qué se construyó (sin componentes nuevos)

| Pieza | Qué es |
|---|---|
| `ExplorableCanvas depth="3d"` | El mismo lienzo, como **maqueta de papel** en three.js (`lib/map3d/scene.tsx`): volúmenes de cartón, metacrilato, madera de balsa y árboles de espuma (`blocks`), textura de papel generada, sombras suaves, aristas a lápiz, niebla hacia el fondo y una intro que pasa de la planta cenital a la maqueta. Los puntos siguen siendo botones del DOM colocados sobre la escena. Sin WebGL o con movimiento reducido: el plano 2D con las huellas |
| `ExplorableCanvas nav="scroll"` + `path` | Dentro de un `PinnedSection`, el scroll lleva la cámara por paradas (planta → maqueta → detalle) y cada parada enseña su texto |
| `dims` | Cotas dibujadas en el tablero (y en el plano 2D), como anotaciones de CAD |
| `lib/ui/gl.tsx` | `GLBoundary` y `useGLGate`: la carga diferida que repetían `ObjectStage`, `Logo3D`, `DeviceMockup3D` y `DistortImage` (ahora la usan todos, y el mapa 3D) |
| `lib/sites/maqueta.ts` | Datos para demos: `city()` (manzanas con calles y plazas) y `walls()` (muros a partir de un plano) |

**Demos:**
- **Alzado** (`/sitios/alzado`), nueva: estudio de arquitectura con preloader, portada fijada que recorre la maqueta con el
  scroll, índice con la foto en el cursor y mapa 3D de obras.
- **Plano**: maqueta del edificio revisado, con las incidencias como puntos.
- **Sonar**: el mapa de proyectos pasa a ser una ciudad de cartón en 3D.

## Pendiente de esta ronda

- Modo «haz de luz» en `Spotlight` (Iventions).
- Profundidad de campo en la maqueta (Oryzo); hoy no hay posprocesado en el kit.
- Probar `WebGPURenderer` (IVRESS).
- Cargar modelos GLB reales en la maqueta.
- Revisar en móvil (390 px) el rendimiento de las sombras.
