# Gramática visual y variedad de las referencias de Trama

Esta ficha ayuda a elegir una dirección que no caiga en el último estilo usado. Es un atlas de contrastes, no un selector automático ni otra colección de templates. Las guías en `knowledge/guides/` aportan mediciones de color, tipografía, espacio y movimiento; las inspiraciones muestran decisiones de composición e interacción más completas.

## Primero separar cinco capas

1. **Guía medida**: paleta, familias, contraste, escala y ritmo. `GuideFrame` aplica algunas clases/tokens; no impone arquitectura.
2. **Composición**: cómo ocupa el espacio el contenido (lienzo total, poster, índice lateral, grilla, capítulos, tabla, columna, archivo).
3. **Medio**: HTML, imagen, vídeo, ilustración, canvas 2D, shader, modelo 3D o mezcla.
4. **Interacción/coreografía**: scroll, puntero, arrastre, teclado, navegación, filtros, sincronización, transiciones entre escenas/rutas.
5. **Firma semántica**: qué objeto, acción, gesto o forma pertenece a este brief y se recordará.

Repetir una guía no implica repetir una web, pero repetir guía + composición + medio + gesto sí produce la misma plantilla. Elige cada capa por separado. Para una referencia, la firma y el medio de la fuente prevalecen sobre la guía más cercana.

## Ejes de contraste que ya existen en Trama

| Dirección | Firma visual/estructural | Ejemplos para inspeccionar |
|---|---|---|
| Campo técnico | marco de instrumentación, cruces, líneas, celdas, labels, precisión | Plano / Heron AI; `docs/07-formulas-webs-top.md` |
| Wordmark de evento | tipografía de borde a borde, prueba de fecha/edición, hero que cambia | Foro / OFFFForum |
| Bosque y arquitectura | espacio abierto, navegación isla, titular grande, imagen como ventana | Arbor / Belgrade Arbor |
| Editorial de estudio | lista/proyectos, páginas internas, tipografía con contraste, transiciones de material | Cénit / Lusion; Brasa / Meer Mohsin |
| Relato con objeto | objeto fijo o móvil, escenas por capítulos, scroll que altera pose/luz/escala | Quilate, Ánima, `docs/22-webs-3d-patron-y-briefing.md` |
| Tipografía como materia | campo de letras 3D, glifo como relieve, cámara que escribe el titular | Plain Sight, `components/inspiraciones/` |
| Grabado/territorio | superficie convertida en línea/relieve, cámara que observa el mapa | Chartogne, plano de viña |
| Ficha de negocio funcional | horarios, catálogo, reserva/compra, acciones persistentes y estados | Inspiraciones por sector en `docs/55-inspiraciones.md`; sus recetas describen patrones de negocio, no una estética obligatoria |
| Cultura/archivo | índice, cédulas, etiquetas de procedencia, orden y filtrado que expresan el contenido | úsalo solo si el material necesita clasificación; no como destino genérico de cualquier historia |
| Espacio audiovisual | pantalla completa, escena y transiciones que gobiernan el relato; contenido HTML en capas | Igloo Inc. y el atlas `knowledge/references/cinematic-webgl.md` |

## Evitar el centro estadístico

Antes de codificar una demo nueva, anota en 5 líneas la tesis de composición, interacción dominante, medio, jerarquía tipográfica, guía o dirección propia y su firma. Compárala con las tres demos más recientes. Si la elección vuelve a «fondo oscuro + foto/escena en hero + titular blanco + secciones editoriales + grid de tarjetas + CTA», no es una dirección todavía: falta decidir qué hace estructuralmente única a esta historia.

No es necesario inventar una guía cada vez. Si una guía no modela la parte singular (3D, fragmentación, transformación, navegación espacial), usa sus tokens medidos solo para la parte que corresponde y construye la gramática de página desde el hallazgo. Una guía de color no debe anular la coreografía de un sitio WebGL.

## Registro de comparación entre demos

| Demo | Premisa/forma | Medio dominante | Acción del visitante | Estructura/navegación | Ritmo/transición | Guía/decisión propia |
|---|---|---|---|---|---|---|
| Completar con demos recientes del proyecto | | | | | | |

No marques «diferente» solo por usar otra paleta o fuente. Registra al menos tres contrastes estructurales y cuál de las firmas de la referencia se conserva. Si dos demos se sienten iguales en miniaturas, revisa la composición antes de pulir microdetalle.

## Evidencia de direcciones dispares ya construidas

Consulta estas fichas para diseñar sistemas completos, no para reutilizar su markup como receta. Las demos comparten una porción de la paleta/identidad, pero cambian la gramática y la acción principal:

| Trabajo | Decisión que lo distingue | Qué estudiar/evitar |
|---|---|---|
| UMBRAL / Fanzine | Cubierta y columna de revista; programa integrado en una lectura editorial. | `docs/cuaderno/umbral-tres-esteticas.md` y `examples/demo-umbral/variantes/`. No pasar la columna editorial a las otras versiones. |
| UMBRAL / Nocturno | Imagen a pantalla completa y orden de sala; programa y compra aparecen como recorrido de club. | Misma ficha. No convertir toda demo en hero de foto oscura. |
| UMBRAL / Cartel | Retícula de afiche: fecha, imagen, portal y cartelera son piezas de composición. | Misma ficha. Tipografía grande no significa que sea legible sin medir las placas/metadatos. |
| RIZO / Señal | Relato audiovisual de campaña con imagen conceptual y CTA a brief. | `docs/cuaderno/demo-rizo-empresa-tecnologica.md`, `examples/demo-rizo/app/campaign/`. No repetir su secuencia hero→casos→contacto en producto o foro. |
| RIZO OS | Consola que filtra, busca, selecciona y guarda vistas; su contenido reacciona a controles. | `examples/demo-rizo/app/system/`. El tablero es una experiencia de herramienta, no una plantilla para toda empresa. |
| FORO / 10 | Cartel y agenda de un evento con espacio, programa seleccionable y reserva de visita. | `examples/demo-rizo/app/forum/`. No es un dashboard ni un archivo editorial. |
| Archivo | Índice monocromo con clasificación y enlaces entre proyectos. | `examples/demo-rizo/app/archive/`. Solo usar archivo cuando ordenar material sea parte del valor. |
| Navegador | Diagnóstico guiado: cada elección lleva a una recomendación. | `examples/demo-rizo/app/navigator/`. Una acción de decisión no se resuelve con secciones promocionales. |
| Inés Bruma | Portfolio como cuaderno con collage de arte original; una tarjeta se expande y el fondo adaptativo ocupa el hueco. | `docs/cuaderno/ines-bruma-ilustradora.md`. Conservar la imagen de fondo distinta de la de portada; no convertir el collage de ilustración en una lista empresarial. |

POLARIS / primera versión sirve como antipatrón de **fidelidad técnica**: «foto + shader» parecía WebGL, pero eliminó geometría, profundidad y progresión de la referencia. La corrección documentada en `docs/cuaderno/demo-polaris-igloo.md` preserva objeto, escena Three, fragmentos y cámara en scroll con arte original. No imites esa escena literalmente: la lección transferible es conservar la clase de medio y el gesto que justifican la referencia.

Al proponer varias versiones, escribe la tesis de cada una con su estructura y acción dominante. En una misma serie permite distintos medios: por ejemplo, relato con canvas, índice tipográfico, herramienta de selección, recorrido de escenario o catálogo táctil. Si al quitar marca, copy y paleta las siluetas siguen coincidiendo, cambia composición e interacción antes de generar contenido.
