# Web de Trama nueva · plan y tres propuestas

- Objetivo: rehacer la web de la librería (`/`, `/demos`, `/componentes`, `/docs`, `/guias`, `/lab`) con las skills del
  repo (trama-research, trama-style, trama-build) e imágenes generadas con Codex donde amplíen el proyecto. Antes,
  tres propuestas de portada muy distintas para elegir; las que no se elijan pasan a `/demos` como muestra de lo que
  se puede hacer con la librería.
- Rama y worktree: `feat/web-nueva` en `C:/COMPARTIDO/trama-web-nueva`, desde `main` (7d046f0).
- URL local: `npx next dev -p 3011` en este worktree; propuestas en `/propuestas/telar`, `/propuestas/escaparate` y
  `/propuestas/consola`.

## Plan de la web completa (tras elegir propuesta)

1. **Sistema de la web**: tokens, tipografía, navegación y pie de la propuesta elegida en `components/site/`; los datos
   siguen saliendo de `lib/site-data.ts` (catálogo, demos por sector, webs, inspiraciones, guías).
2. **Portada**: la propuesta elegida, conectada a los datos reales y con todas las rutas.
3. **`/demos`**: mantiene las vistas «Por sector» y «Técnicas», pero con miniaturas de cada demo (capturas con
   Playwright) en lugar de una lista de texto, y una imagen de cabecera por sector generada con Codex.
4. **`/componentes`, `/docs`, `/guias`, `/lab`, `/inspiraciones`**: mismo sistema; el catálogo y las guías no cambian
   de funcionamiento, solo de marco.
5. **Imágenes**: Codex genera las de la portada, las once cabeceras de sector y las imágenes Open Graph de cada
   sección; nunca iconos, logotipos ni diagramas (eso es código). Todas se declaran como visualizaciones conceptuales.
6. **Cierre**: `qa:contrast` y `qa:visual-text` en los anchos de las skills, `npm run verify`, build sin dev en
   marcha, ficha del cuaderno y paso a `main`.
7. Las propuestas no elegidas quedan en `/demos` (Técnicas → «Propuestas para la web de Trama»).

## Direcciones exploradas (skills: explorar más de las pedidas)

| Candidata | Tesis | Medio | Gesto | Elegida |
|---|---|---|---|---|
| Telar | El nombre hecho materia: tokens = urdimbre, componentes = trama; la página se teje al bajar | canvas 2D generativo + foto macro | scroll que teje; puntero que tensa hilos | sí |
| Escaparate | Herramienta de decisión para negocios: eliges sector y estilo y ves tu web montada con piezas reales | DOM + fotos por sector | elegir (selector) y comparar | sí |
| Consola | Trama como sistema de texto: órdenes, ventanas y agentes con la estética ASCII de origen | DOM monoespaciado, ASCII | teclado: escribir órdenes, ⌘K | sí |
| Muestrario de imprenta | Libro de especímenes con láminas numeradas | DOM editorial | pasar láminas | no: comparte composición editorial con Telar |
| Ciudad-mapa | Mapa isométrico, cada barrio un sector | canvas/3D | arrastrar el mapa | no: coste alto y lectura lenta del contenido |
| Muro de capturas | Mosaico infinito de demos | DOM | arrastre | no: centro estadístico, no explica la librería |

## Matriz de las tres propuestas

| Eje | Telar | Escaparate | Consola |
|---|---|---|---|
| Premisa | qué es Trama (sistema) | qué puedo hacer yo (negocio) | cómo se trabaja (desarrollador/agente) |
| Composición | bandas a sangre que se apilan como una pieza de tela | pantalla partida: controles / vista previa | escritorio con ventanas y barra de órdenes |
| Medio dominante | canvas generativo + fotografía macro | fotografía por sector + piezas del kit en vivo | texto monoespaciado, ASCII |
| Interacción | scroll y puntero | selección (sector, estilo, sección) | teclado y órdenes |
| Tipografía | Fraunces + Instrument Sans | Bricolage Grotesque + Inter | JetBrains Mono + VT323 |
| Tono | lino crudo, tinta, bermellón | blanco cálido, color del sector | negro, fósforo lima |
| Navegación | índice lateral de hilos | pasos 1-2-3 | menú de ventanas y ⌘K |

## Registro

- 2026-11-04: worktree creado, plan y matriz; imágenes pedidas a Codex con `proyectos/web-nueva/imagenes.md`.
- 2026-11-04: Telar, Escaparate y Consola hechas (contraste 0 incumplimientos). El usuario no se queda con ninguna:
  pasan a `/demos` → Técnicas → «Propuestas para la web de Trama».
- 2026-11-04: nueva dirección pedida: parecida a la web actual, neofuturista y con 3D del kit → **Neo**
  (`/propuestas/neo`): `SiteChrome` actual, Archivo expandida, negro azulado + lima + ultramar, `ObjectStage`,
  `CrossCluster`, `DeviceMockup3D` (web del sector en vivo) y `TypeField`. Contraste 0 incumplimientos.
- 2026-11-05: el usuario decide no cambiar de momento el aspecto de la web. Las cuatro propuestas, Neo incluida,
  quedan como demos en `/demos` → Técnicas → «Propuestas para la web de Trama». Plan de la web completa en pausa.
