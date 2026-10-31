# Estudio de Igloo Inc. para una demo WebGL propia

**Fecha:** 31-10-2026 · **Modo:** inspirarse y construir · **Estado:** comprobaciones locales completas; pendiente la revisión humana del usuario.

## Identidad y alcance

La referencia es [Igloo Inc.](https://www.igloo.inc/), asociada a Site of the Year 2024 en el registro de referencias de `docs/13-ronda-5-esteticas.md`. El caso de estudio oficial de Awwwards está fechado el 31-10-2024 y describe una landing de tres secciones con navegación por scroll, escena en tiempo real, shaders propios, bloques de hielo procedurales, partículas interactivas y UI WebGL. La demo no copia su marca, textos, proyectos, geometría ni recursos. Se decidió representar un archivo ficticio de exploración polar llamado POLARIS, con tres imágenes y todo el contenido generados para este ejercicio.

Entorno del repo: rama `feat/evolucion-agentes`, Trama fuente `0.13.0`; componentes locales de guía en `components/ui/`. La web de Trama tiene `next@16.3.5`; se consultó la guía `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` para el límite de cliente de la escena.

## Fuentes y cobertura

| Fuente | Qué se observó | Cobertura y límite |
|---|---|---|
| https://www.igloo.inc/ · URL final observada | Escena WebGL a pantalla completa, espacio glaciar, una estructura de hielo que cambia con scroll/gestos y etiquetas superpuestas en esquinas | `cine:web` a 390×844 y 1440×900, 32 pasos en cada viewport. La página oculta el scroll DOM y dibuja su contenido visualmente; el mapa registra una sola sección y no extrae titulares. No se interpreta ese resultado como página vacía. |
| `npm run cine:explora` | El puntero a izquierda/derecha, la rueda y el clic central cambian píxeles; la escena también evoluciona sin gesto | 1440×900; tabla e imágenes en `.refs3d/research-igloo-inc/explora/`. Los valores de cámara no explican por sí solos el resultado visual. |
| `npm run cine:sonda` | Three.js r165; 9 escenas capturadas, shaders y targets de render; un grupo de 1.200 instancias; postprocesado con aberración cromática y pasos de composición | 1440×900, muestra de 90 fotogramas. No expone fuentes ni texto del overlay. |
| `npm run refs:probe` | Fondo computado gris azulado, sin familias ni jerarquía de texto identificables | `datos.json` reporta el shader `three` como valor de versión y cero canvas DOM; sus medidas DOM no representan la paleta/estructura completa de una UI dibujada en WebGL. |
| [Caso de estudio oficial de Awwwards](https://www.awwwards.com/igloo-inc-case-study.html) | Awwwards describe la navegación por tres secciones, transición con aberración cromática/desplazamiento/escarcha, intro con shaders, bloque de hielo de crecimiento procedural y simulación de partículas | Fuente editorial primaria para intención técnica. El caso declara Three.js, three-mesh-bhv, Svelte, GSAP, Vite y JavaScript. No se usaron sus imágenes ni assets. |

## Capturas e informes

- Escritorio, 1440×900, escena de hielo: `.refs3d/research-igloo-inc/desktop/pantallas/00.jpg` — SHA-256 `A5973D37EFDBA6A35BD8C58F0C6B4D394D738ACA355B32DA9D6CE7E38572FAE8`.
- Escritorio, 1440×900, estado posterior del recorrido: `.refs3d/research-igloo-inc/desktop/pantallas/08.jpg` — SHA-256 `BAB4E1873B4DC2B87A1F2F4212FFD867ED40690D63671DF1D1CDA02AD22F93CC`.
- Interacción, escritorio, estado inicial abierto: `.refs3d/research-igloo-inc/explora/00-inicio.png` — SHA-256 `E3B6CBD6E18D8DDC471FE21C010C1E2DCB5D2BDBC80BDB03F01056B18959A375`.
- Mapas, secuencia de pasos y sonda: `.refs3d/research-igloo-inc/{web.md,desktop/web.md,explora/explora.md,sonda/sonda.md,style/datos.json}`.

## Hallazgos: observado, inferido y decidido

- **Observado:** la referencia mantiene una escena gráfica dominante; rueda y clic producen grandes cambios de imagen; al menos una capa de texto aparece al abrir una ficha; el movimiento continúa durante el reposo. Awwwards atribuye su profundidad al motor 3D, shaders y activos generativos en tiempo real.
- **Inferido:** en un medio nevado, el desplazamiento de imagen, la separación cromática y un barrido de escarcha pueden sugerir refracción sin copiar su modelo de iglú. Los metadatos y el texto narrativo deben seguir en HTML para preservar legibilidad, foco y selección.
- **Decidido:** POLARIS es un archivo ficticio de expediciones. Su diferencia principal es un relato editorial oscuro que alterna una portada ancha, bloque de lectura claro, una estación humana en primer plano, archivo filtrable y formulario local. Un shader WebGL propio desplaza una fotografía generada por Codex, añade separación de canales/grano y hace reaccionar el hielo al puntero y al avance de página. El contenido nunca se rasteriza. No se cambia la API del kit: la combinación de un paisaje y este tratamiento es singular para esta demo.

## Construcción y límites

- Ruta: `/demo/polaris-archivo`, listado `/demos` → «Relatos WebGL».
- Piezas del kit: `GuideFrame` (`nocturno`, con `textContrast`) y `Button`.
- Técnica local: `IceShader` en WebGL 1, GLSL fragment shader con distorsión, aberración, ruido y capa de escarcha; render limitado a 30 fps, imagen de respaldo y dibujado estático con `prefers-reduced-motion`. No es la malla procedural ni la simulación volumétrica de la referencia.
- Arte: tres imágenes generadas para esta demo (una persona ante la grieta; dos personas instalando una sonda; tres personas bajo una aurora), optimizadas a WebP. Sin texto ni marca dentro de las imágenes.
- Interacciones: shader al puntero/scroll, filtro por tipo de registro, ficha de expedición modal con Escape, foco retornado y formulario de muestra. No se envía ni guarda información.
- Diferencias deliberadas: no hay pantalla de carga cinemática ni réplica del iglú; el WebGL se limita a la hero para que texto, archivo y acciones funcionen como DOM ordinario y sobrevivan al modo sin WebGL.

## Cierre

`npm run smoke` responde 200 en `/demo/polaris-archivo` y `/demos`, sin errores de consola ni sombras. `qa:contrast` registra cero incumplimientos medibles en 320, 390, 556, 700, 768, 830, 1024, 1072, 1150, 1440 y 1920 px; axe deja pendientes únicamente pares sobre gradientes/fotografías del hero, revisados en las capturas reales con el scrim aplicado. `qa:visual-text` no encuentra escapes, clipping ni microtexto en esos anchos. La revisión visual encontró en móvil un corte y solapamiento leve en «el descubrimiento»; se bajó solo ese titular para que la frase quepa como una línea. Se volvieron a revisar capturas a 320, 390 y 1440 px. Las cajas de otros titulares display se cruzan por interlineado apretado intencional; la inspección visual confirma que sus glifos siguen separados y legibles. Las intersecciones de texto con la foto y el canvas son intencionales: el texto está en HTML y el scrim oscuro se mantiene detrás.

Playwright en Chromium confirma WebGL 1.0, carga de las tres imágenes WebP, filtro (una ficha de Instrumentación), modal, foco atrapado y restaurado al cerrar con Escape, formulario local, `prefers-reduced-motion`, cero violaciones de contraste en estado normal y modal, viewport de 320 px sin desbordamiento horizontal y cero errores de consola. Capturas de demo y QA en `.refs3d/polaris/`; informes automáticos en `.refs3d/contrast/3450-1793447922526/` y `.refs3d/visual-text/3450-1793448140134/` (salidas locales ignoradas por Git). El mapa, la sonda y la exploración originales permanecen en `.refs3d/research-igloo-inc/`.
