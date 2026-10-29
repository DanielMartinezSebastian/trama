# Trama: resumen detallado del estudio de evolución

Preparado el 29 de octubre de 2026 a partir del estudio del 28 de octubre. Estado: síntesis de una propuesta para valorar. No incorpora implementación, nuevas pruebas de producto ni un benchmark.

## 1. Documentos de origen y alcance

Este resumen reúne cuatro archivos del repositorio consumidor `martinezsebastian`:

| Archivo | Aportación al estudio |
| --- | --- |
| [`estudio-trama-hibrida-agentes-2026-10.md`](./estudio-trama-hibrida-agentes-2026-10.md) | Producto, identidad, arquitectura, skills, mantenimiento y fases |
| [`plan-trama-investigacion-referencias.md`](./plan-trama-investigacion-referencias.md) | Investigación desde imágenes, webs y guías; modos, flujos y traspaso |
| [`estudio-costes-trama-agentes-2026-10.md`](./estudio-costes-trama-agentes-2026-10.md) | Coste hasta cumplir objetivos, tiempo, tokens, correcciones y evaluación |
| [`modelo-costes-trama-2026-10.json`](./modelo-costes-trama-2026-10.json) | Datos, supuestos, perfiles y estructura editable de medición |

La [sección 12 del estudio principal](./estudio-trama-hibrida-agentes-2026-10.md#12-fuentes-y-trazabilidad) recoge los nombres completos y enlaces de los archivos fuente. En las secciones siguientes se indican también los archivos concretos que sostienen cada tema. Las rutas de Trama se refieren al commit `2263365bc6b9485028ae7ce769fcf1fb5ba619ec`, cuya versión declarada era 0.13.0. El consumidor tenía instalada la 0.12.1 desde un `.tgz` local.

Se distinguen tres tipos de contenido: hallazgos recogidos en la revisión, recomendaciones de evolución e hipótesis pendientes de medir. Las capacidades del repositorio, del paquete instalado y de la web desplegada pueden diferir. El estudio no certificó la versión publicada en npm ni el commit desplegado.

## 2. Idea central del cambio

La propuesta consiste en ampliar Trama hacia una librería híbrida que distribuya tanto componentes como conocimiento para construir sitios: guías, recetas sectoriales, procedimientos y referencias consultables por agentes.

El valor diferencial sería convertir una intención o referencia visual en decisiones de diseño y construcción que puedan reutilizarse y verificarse. Trama ya dispone de muchas piezas; falta hacerlas accesibles desde un proyecto consumidor con información compatible con su versión.

Se propone mantener el nombre **Trama** y ampliar su descripción hacia componentes, guías visuales y recetas para construir webs con carácter en React. ASCII, textmode y pixel art siguen formando parte de su identidad, pero resultan insuficientes para describir todo el sistema.

**Procedencia:** estudio principal, secciones 1, 3–5. Archivos de Trama: `README.md`, `package.json`, `components/site/HomePage.tsx`, `app/layout.tsx`, `docs/catalog.json`, `lib/ui/guides.ts` y `lib/catalog/sectores.ts`. El posicionamiento nuevo es una propuesta del estudio.

## 3. Qué se encontró y qué conviene conservar

El snapshot estudiado recoge 187 entradas de catálogo, 14 categorías, nueve variantes, ocho landings de referencia y 34 sitios de referencia. También documenta 19 guías y 18 inspiraciones. El árbol contiene 190 archivos TSX directamente en `components/ui/`; ese número no equivale al de entradas del catálogo ni prueba un error.

La base existente abarca componentes, secciones, tokens, tipografías, guías, recetas, navegación, formularios, reservas y otros flujos, además de investigación sobre composición, movimiento y 3D. `GuideFrame` permite aplicar un sistema visual mediante variables y clases. Las recetas aportan estructura y objetivos por negocio, en lugar de limitarse a cambiar textos sobre una misma landing.

Conviene conservar el lenguaje común de variantes, intenciones y superficies; el ciclo de investigación y extracción de piezas; la separación entre kit y demos; y el retorno de aprendizajes desde proyectos consumidores.

**Procedencia:** estudio principal, secciones 2–3. Archivos de Trama: `docs/catalog.json`, `lib/ui/guides.ts`, `components/ui/GuideFrame.tsx`, `lib/catalog/sectores.ts`, `docs/54-guias-de-estilo-del-repo.md`, `docs/56-plan-inspiraciones-funcionales.md`, `docs/35-procedimiento.md`, `AGENTS.md` y `scripts/build-package.mts`. Experiencia local: `docs/arquitectura-ui-trama.md`.

## 4. Problemas que motivan la evolución

| Hallazgo del estudio | Implicación |
| --- | --- |
| Mensaje público centrado en el origen retro | Se oculta parte del valor para sitios completos y direcciones visuales distintas |
| README, portada y catálogo presentan cifras diferentes | Personas y agentes reciben información incoherente |
| Catálogos grandes y poco selectivos | Consultarlos enteros añade lectura y dificulta encontrar lo necesario |
| El paquete no distribuye todo el conocimiento del repositorio | El consumidor no recibe automáticamente guías, recetas y consultas equivalentes |
| CLI limitada a `assets` y `catalog` | Falta consulta específica por pieza, guía, receta o necesidad |
| Metadatos orientados al visor | Los controles de `PropSpec` no representan todas las firmas TypeScript |
| Ejemplos con imports y recursos internos | Una receta del repo puede no ser utilizable directamente desde el paquete |
| Ausencia de skills en el árbol revisado | Las instrucciones internas no constituyen una capacidad instalable para consumidores |
| Flujos visuales que pueden parecer servicios completos | Una reserva local no acredita disponibilidad, persistencia o integración de producción |

El consumidor también muestra deriva: su `README.md` menciona 0.12.0, mientras `package.json` y `node_modules/trama-ui/package.json` identifican 0.12.1. El artículo público y la documentación histórica ofrecen mensajes distintos sobre distribución. Hay que resolver el canal real antes de actualizar promesas públicas.

**Procedencia:** estudio principal, sección 3.3. Archivos de Trama: `README.md`, `components/site/HomePage.tsx`, `app/layout.tsx`, `docs/catalog.json`, `lib/catalog/schema.ts`, `scripts/build-catalog.mts`, `scripts/build-package.mts`, `scripts/trama-cli.mjs` y `components/ui/BookingFlow.tsx`. Archivos locales: `README.md`, `package.json`, `node_modules/trama-ui/package.json`, `content/blog/por-que-construi-trama.md` y `docs/arquitectura-ui-trama.md`.

## 5. Identidad pública y alternativas de producto

La evolución de la web debería explicar primero qué sitios permite construir Trama, mostrar varias identidades y ofrecer recorridos para desarrolladores y agentes. Las guías necesitan demostraciones aplicadas a páginas y estados; los casos deben aclarar qué reutilizan, qué adaptan y qué simulan. Los contadores deberían generarse desde fuentes comunes y mostrar su versión.

La navegación propuesta es «Empezar · Componentes · Guías · Recetas y sitios · Agentes». El laboratorio puede mantener su función de investigación sin convertir todo su contenido en producto público. El estudio aconseja probar un recorrido completo antes de acometer un rediseño amplio.

Se comparan seis alternativas:

| Alternativa | Valoración |
| --- | --- |
| Mejor documentación e instrucciones | Base necesaria, con reutilización limitada fuera del repo |
| Skills con referencias versionadas | Primera entrega recomendada: portátil y auditable, sin servidor obligatorio |
| Skills con CLI selectiva | Evolución posterior si reduce búsqueda y contexto en las pruebas |
| MCP | Condicional a una necesidad real de acceso; reutilizaría datos y consultas de la CLI |
| Registro de componentes o plantillas | Complemento posible, con costes de dependencias y divergencia del código copiado |
| Constructor integral | Amplía mucho el alcance hacia edición, hosting e integraciones; queda fuera del primer objetivo |

S/M/L expresa esfuerzo relativo de implementación, sin equivaler a minutos, tokens ni presupuesto de ejecución.

**Procedencia:** estudio principal, secciones 4–5. Diagnóstico de presentación: `components/site/HomePage.tsx`, `components/site/theme.ts`, `app/layout.tsx` y `README.md` de Trama. Base de distribución: `scripts/build-package.mts` y `scripts/trama-cli.mjs`. La navegación y las alternativas son propuestas.

## 6. Las tres skills propuestas

| Skill | Responsabilidad | Resultado esperado |
| --- | --- | --- |
| `trama-build` | Construir o modificar con la versión disponible | Composición, rutas, estados, integración explícita y validación |
| `trama-style` | Elegir, aplicar o adaptar una guía | Reglas coherentes de tipografía, espacio, superficies y movimiento |
| `trama-research` | Interpretar referencias cuando lo exige el encargo | Evidencia, inferencias, brief y correspondencia con capacidades disponibles |

Un solo agente puede recorrer las tres capacidades. No requieren tres sesiones ni aprobaciones sucesivas. Investigación puede terminar en un estudio si ese es el encargo; cuando se pide construir, su brief permite continuar. Una futura `trama-maintain` atendería el desarrollo interno de la librería y permanecería separada del consumo.

Construcción comienza detectando framework, versión, imports, CSS, fuentes y personalizaciones. Después interpreta el negocio, selecciona guía/receta, consulta tipos y exports reales, compone, completa estados y verifica. La revisión visual incluye lectura, jerarquía, encuadres, móvil, foco y movimiento reducido.

Se propone una fuente común de skills, con instalación por proyecto, versión fijada y referencias cargadas según necesidad. Codex y Claude Code serían los primeros entornos a validar. Compartir `SKILL.md` no demuestra por sí solo idéntico descubrimiento, herramientas o comportamiento entre clientes; los entornos cloud requieren pruebas propias.

**Procedencia:** estudio principal, sección 6, y plan de referencias, secciones 1–3. Base de Trama: `AGENTS.md`, `lib/ui/guides.ts`, `lib/catalog/sectores.ts`, `lib/catalog/schema.ts` y tipos/exports del paquete. Las skills son propuestas; la sección 12.4 del estudio conserva las referencias externas de formato y clientes consultadas originalmente.

## 7. Investigación: intención, evidencia y ocho flujos

El plan diferencia **reproducir**, **adaptar**, **inspirarse** e **investigar sin construir**. Cada modo tiene un criterio de comparación distinto. Una adaptación puede transferir jerarquía y composición a otra marca sin buscar igualdad de píxeles.

Cada hallazgo debe separar lo observado, lo inferido y lo decidido. Una captura permite estimar proporciones; no revela por sí sola fuentes exactas, CSS, comportamiento móvil o animaciones. Una guía externa necesita traducción de roles y resolución de vacíos; importar tokens no importa automáticamente composición ni accesibilidad.

| Flujo | Trabajo principal y condición de cierre |
| --- | --- |
| F1. Imagen → página | Interpretar regiones, explicitar lo desconocido, resolver móvil y comparar al tamaño de referencia |
| F2. Web → sitio propio | Recorrer estados representativos, medir cuando sea posible y adaptar al negocio nuevo |
| F3. Guía externa → sistema visual | Extraer reglas, mapear roles y comprobar una muestra con componentes y estados |
| F4. Varias referencias → dirección coherente | Asignar a cada fuente un papel y resolver contradicciones según el encargo |
| F5. Gesto o escena → prototipo | Observar disparadores y recorrido, probar una sección y su alternativa sin movimiento |
| F6. Encargo sin referencias → selección | Consultar primero guías/recetas e investigar solo vacíos que cambien una decisión |
| F7. Web existente → mejora | Capturar línea base, intervenir áreas relevantes y comprobar regresiones |
| F8. Proyecto → aprendizaje reutilizable | Distinguir adaptación local, receta, mejora de guía y candidata para el kit |

Hay tres perfiles de herramientas: esencial para documentos e imágenes con visión; web para navegador, capturas y sonda; avanzado para movimiento/3D y herramientas de cine. El consumidor básico no debería necesitar todo el laboratorio.

**Procedencia:** `plan-trama-investigacion-referencias.md`, secciones 1–7. Archivos de Trama: `scripts/probe-refs.mts`, `docs/35-procedimiento.md`, `docs/37-conceptos.md`, `docs/16-guias-de-estilo-plan.md` y `lib/ui/guides.ts`. Los ocho flujos son una propuesta apoyada en esa base, no ocho importadores disponibles.

## 8. Información que debe conservar cada encargo

El contrato de traspaso propone guardar un expediente de referencias, evidencia por región/estado, brief aplicable, correspondencia con la versión de Trama, adaptación visual local y registro de validación. Puede resolverse en un Markdown con adjuntos; no obliga a crear seis archivos por tarea.

Debe ser posible continuar en otra sesión conociendo fuentes, intención, prioridades, páginas, acción principal, decisiones, límites y comprobaciones pendientes. Los recursos grandes permanecen como archivos consultables por partes.

El conocimiento distribuido debería ofrecer un índice pequeño y fichas específicas de componentes, guías y recetas. Los tipos/exports gobiernan la API; los metadatos aportan descubrimiento y uso; `lib/ui/guides.ts` gobierna el sistema visual y `lib/catalog/sectores.ts` la composición sectorial. Se recomienda ampliar la generación existente y evitar una base paralela manual.

Código y conocimiento deben compartir procedencia y compatibilidad. Se proponen campos como versión de paquete, esquema, commit, estado, introducción, obsolescencia, sustituto, requisitos y ejemplos. Las recetas deben declarar recursos disponibles, dependencias e integraciones pendientes.

**Procedencia:** estudio principal, sección 7, y plan de referencias, sección 6. Archivos de Trama: `lib/catalog/schema.ts`, `scripts/build-catalog.mts`, `scripts/build-package.mts`, `lib/ui/guides.ts`, `lib/catalog/sectores.ts` y `docs/README.md`. Los campos nuevos y artefactos de traspaso son propuestas.

## 9. CLI, MCP y mantenimiento

Las consultas futuras podrían detectar proyecto y versión, buscar capacidades, consultar una pieza/guía/receta y diagnosticar problemas. Son operaciones conceptuales; el estudio no implementa comandos con esos nombres. Deben resolver el paquete desde el consumidor, admitir `.tgz` y monorepos y evitar devolver documentación de una versión remota incompatible.

MCP podría envolver las mismas consultas si se demuestra su necesidad. `llms.txt` sería un índice complementario, sin garantizar descubrimiento ni sustituir versionado o contratos.

El mantenimiento amplía el ciclo actual: investigación → hallazgo → decisión de madurez → código/guía/receta → referencias generadas → pruebas de consumo → entrega versionada → aprendizaje. Una nueva firma exige tipos y ejemplos; una guía modificada exige revisar las referencias afectadas; una receta debe identificar simulaciones. La promoción de un hallazgo necesita límites y variación fuera del caso original.

Se recomienda fijar versiones durante el piloto, conservar las adaptaciones de cada proyecto y registrar el origen del código copiado. Actualizar la dependencia no autoriza a rediseñar una web. Las verificaciones progresivas incluyen integridad de referencias, consumo del `.tgz`, CSS/fuentes, descubrimiento de skills, recorridos y revisión visual. Pasar `catalog:check` no demuestra que un ejemplo funcione fuera del repo.

**Procedencia:** estudio principal, secciones 7.4–8. Archivos de Trama: `scripts/trama-cli.mjs`, `scripts/build-package.mts`, `AGENTS.md`, `docs/flujo-agentes.md`, `docs/35-procedimiento.md` y `docs/36-plan-de-mejora.md`.

## 10. Qué significa coste y qué se sabe realmente

El coste estudiado es **tiempo, tokens, herramientas e iteraciones hasta cumplir los objetivos**. La versión corregida descarta las antiguas estimaciones monetarias como predicción de ejecución.

Se separan preparación, investigación necesaria, primera construcción, correcciones, validación final y entrega. También se distinguen tiempo transcurrido, tiempo de herramientas e intervención humana. Si hay trabajos solapados, su suma no equivale al tiempo real: importa la ruta crítica.

Los tokens deben contabilizar todas las solicitudes, el historial reenviado, caché y salidas, evitando sumar dos veces categorías ya incluidas. Los bytes o caracteres de un archivo no equivalen a tokens. Si el entorno no ofrece uso real, el dato queda como no disponible.

Hay dos evidencias cuantitativas de alcance limitado:

- Las 187 fichas compactas ocupan 323.382 bytes; una selección de doce ocupa 26.917 bytes, un 91,7 % menos de contenido en esa selección. Eso no demuestra el mismo ahorro de tokens o duración de una tarea.
- El estudio histórico Hublot declara capturas de 16 segundos a 1280×720 que tardan 4–6,5 minutos y vueltas de 6–8 minutos en una RTX 5060. Registra siete vueltas en ese caso y sesiones distintas para Hublot y Plain Sight. Son antecedentes no reproducidos aquí, sin validez predictiva general.

Los totales de 54/86 minutos y 164.000 tokens del modelo son ejemplos aritméticos. No son resultados medidos de las skills.

**Procedencia:** `estudio-costes-trama-agentes-2026-10.md`, secciones 1–6, y `modelo-costes-trama-2026-10.json`, bloques `baseline`, `formulas` y `arithmeticExamplesNotBenchmarks`. Fuentes de Trama: `docs/catalog.json` y `docs/28-estudio-hublot-y-coste.md`.

## 11. Profundidad de validación y criterios de cierre

| Perfil propuesto | Exigencia | Hipótesis de correcciones |
| --- | --- | --- |
| V0 | Composición conocida; contratos, contenido y recorrido aplicable | 1–2 |
| V1 | Flujo completo; errores, teclado, móvil y estados | 2–4 |
| V2 | Dirección desde referencias; comparación y coherencia entre páginas | 3–6 |
| V3 | Fidelidad exigente o técnica nueva; calibración, ruido y movimiento | 5–10 o más |

Son hipótesis para diseñar el piloto. No incluyen la primera construcción, no son límites rígidos ni garantizan calidad. Tampoco hay rangos medidos de minutos o tokens por nivel. El modelo plantea además rangos por F1–F8, sin sumarlos mecánicamente cuando comparten trabajo.

Cada objetivo necesita criterio, método y evidencia. Sus estados distinguen pendiente, cumplido, no aplicable y evidencia insuficiente. Solo se cierra cuando todos los obligatorios tienen evidencia válida. Alcanzar un presupuesto orientativo no convierte una tarea incompleta en éxito.

La validación se repite según impacto: un texto requiere revisar su render y enlaces; una guía global afecta múltiples rutas y estados; un cambio de estado compartido exige recorrer sus consumidores. La evidencia debe invalidarse cuando cambian las condiciones que la sustentaban.

Para fidelidad se fijan viewport, estado, carga y referencia. Si la medida varía, se comprueba la referencia contra sí misma antes de perseguir pequeñas diferencias. Una puntuación visual no certifica funcionamiento. Tras varias vueltas sin mejora, se revisan hipótesis, medida y contenido; el disparador histórico de tres vueltas sin progreso no es una regla universal para terminar.

**Procedencia:** `estudio-costes-trama-agentes-2026-10.md`, secciones 3–10, y `modelo-costes-trama-2026-10.json`, bloques `validationProfiles`, `flowHypotheses`, `objectiveStates` y `completionPolicy`. Método previo: `docs/35-procedimiento.md` y `docs/36-plan-de-mejora.md` de Trama.

## 12. Cómo comprobar el beneficio de la propuesta

La comparación debe enfrentar documentación actual y skills propuestas con tareas equivalentes: misma versión, modelo/configuración, herramientas, contenido, referencias y criterios de cierre. El primer lote contempla tres tareas ordinarias, dos condiciones y dos repeticiones: doce ejecuciones. Movimiento avanzado se evalúa aparte.

Se registran por tarea y vuelta alcance, objetivos, hipótesis, cambios, tiempo, tokens, herramientas, regresiones, esperas y estado final. Se incluyen tareas fallidas o incompletas y su consumo. Las primeras repeticiones sirven para detectar problemas; no sostienen una promesa comercial general de ahorro.

La calidad se evalúa junto a la eficiencia: APIs reales, recorrido funcional, adecuación al negocio, coherencia visual, móvil, accesibilidad, rendimiento y mantenimiento. Una generación inicial más rápida puede necesitar más reparación y acabar costando más.

La investigación incluye casos difíciles: imagen sin móvil, referencias contradictorias, fuentes no disponibles, web inaccesible, guía incompleta, roles sin equivalente, 3D sin herramientas o piezas ausentes en la versión instalada. Una respuesta útil declara el vacío y propone una salida sin inventar evidencia.

**Procedencia:** estudio principal, sección 9; plan de referencias, sección 8; estudio de costes, secciones 11–13; modelo JSON, bloques `taskFields`, `cycleFields`, `usageNormalization` y `pilot`. Este protocolo sigue pendiente de ejecución.

## 13. Plan de entregas y decisiones abiertas

| Fase | Entrega y condición de avance |
| --- | --- |
| 0. Inventario y mensaje | Alinear repo, paquete y web; identificar evidencia y canal de cada promesa |
| 1. Conocimiento | Índice y fichas mínimas, brief y procedencia; resolver pilotos sin cargar todo el catálogo |
| 2. Skills básicas | `trama-build` y `trama-style`; comprobar descubrimiento y primeras tareas |
| 2b. Investigación | `trama-research`; tres tipos de entrada y al menos una construcción verificada |
| 3. Evaluación | Comparar coste y calidad hasta cumplir; localizar fallos y estancamientos |
| 4. CLI | Añadir consultas que demuestren utilidad en el consumidor |
| 5. Web y adopción | Publicar recorridos y casos reproducibles apoyados en evidencia |
| 6. Extensiones | MCP, registros o plugins cuando resuelvan una limitación observada |

El piloto de referencias avanza desde un contrato mínimo hacia imagen, web y guía; después combina fuentes y finalmente incorpora gestos avanzados. La primera unidad recomendada es una receta sectorial, una guía y un consumidor limpio. Su ampliación consiste en adaptar una misma web de servicios desde captura, URL y guía externa, producir los briefs y construir al menos una variante.

Queda por decidir el detalle de distribución, instalación, separación de skills, soporte de frameworks, idioma y momento de añadir CLI/MCP. Las preferencias del estudio son mantener Trama, priorizar conocimiento junto al paquete, instalar por proyecto y empezar con una combinación pequeña de entornos y casos.

**Procedencia:** estudio principal, secciones 10–11; plan de referencias, sección 8; estudio de costes, sección 13. Son recomendaciones de secuencia y criterios de aceptación, sin compromiso de calendario.

## 14. Estado al retomar el trabajo

Los documentos dejan preparado un diagnóstico, una arquitectura propuesta y un protocolo de prueba. No se han implementado las skills, las nuevas consultas ni una importación universal de referencias. No se ha demostrado ahorro de tiempo o tokens, ejecutado todo el catálogo, compilado el repo remoto ni reproducido sus resultados históricos.

La ampliación del 29 de octubre añade este resumen y las rutas de procedencia al estudio principal. El siguiente paso que el estudio recomienda sigue siendo el piloto acotado y medido, antes de ampliar producto e infraestructura.

**Procedencia:** límites del estudio principal, sección 2; estado del plan de referencias; estado del estudio de costes; campos `status` y `completionPolicy` del modelo JSON.
