# Trama: coste de ejecución, iteración y validación por tarea

Fecha: 28 de octubre de 2026. Complementa el [estudio de producto](./estudio-trama-hibrida-agentes-2026-10.md) y el [plan de referencias](./plan-trama-investigacion-referencias.md).

**Enfoque corregido:** aquí «coste» significa tiempo, tokens, ejecuciones de herramientas e iteraciones necesarias para cumplir los objetivos de una tarea. Sustituye el enfoque económico de la revisión anterior. Sus horas de desarrollo y cuentas monetarias no se utilizan como estimaciones de ejecución.

Estado: modelo de trabajo para validar, no benchmark de las futuras skills. [Datos y supuestos editables](./modelo-costes-trama-2026-10.json).

## 1. Conclusión

**El coste depende de la distancia hasta los objetivos y de la evidencia exigida para comprobarlos.** No basta clasificar un encargo como «crear una web» o contar cuántas skills activa. Una composición basada en piezas conocidas puede cerrarse con pocas vueltas; investigar una técnica nueva y demostrar fidelidad requiere explorar, calibrar y comparar varias veces.

Conviene que Trama permita definir por tarea:

1. Qué hay que conseguir y qué queda fuera.
2. Con qué evidencia se comprueba cada objetivo.
3. Qué se reutiliza ya validado y qué necesita una comprobación nueva.
4. Qué parte se corrige en cada vuelta y qué regresiones se comprueban después.
5. Cuándo se ha cumplido, cuándo falta evidencia y cuándo hay que cambiar de método.

Las skills deberían reducir la exploración redundante y las correcciones evitables. **El objetivo de optimización es el coste hasta un resultado aceptable**, manteniendo el nivel requerido; una primera versión rápida que necesita muchas reparaciones puede ser peor.

## 2. Qué evidencia tenemos

Base: snapshot de Trama `2263365bc6b9485028ae7ce769fcf1fb5ba619ec`, versión declarada 0.13.0. Consumidor instalado en este workspace: 0.12.1. No se han ejecutado todavía las skills propuestas ni medido sus tareas completas.

| Evidencia | Qué aporta | Límite |
| --- | --- | --- |
| Procedimiento de investigación | Receta, ruido, objetivos por eje, vueltas y criterio para revisar un estancamiento | Método existente; no garantiza iguales tiempos en todos los casos |
| Estudio Hublot | Tiempos de sesión y herramientas; siete vueltas en un caso | Historial declarado, con un agente y una RTX 5060; no reproducido aquí |
| Cuaderno y guías | Reglas, excepciones y hallazgos previos | Reutilización posible si la regla y la versión siguen siendo aplicables |
| Catálogo y selección medida | Capacidad de consultar una parte del conocimiento | Bytes de documentación, no tokens ni ahorro de ejecución medido |

El [procedimiento][procedimiento] propone objetivos por eje con ruido de referencia y revisar la causa cuando un eje no mejora tras tres vueltas. El [estudio Hublot][hublot] documenta capturas de 16 segundos a 1280×720 de 4–6,5 minutos y vueltas completas de unos 6–8 minutos; siete vueltas en ese caso. Registra sesiones de 1 h 08 para Hublot y 4 h 17 más 57 minutos de refinamiento para Plain Sight. Son antecedentes de alcance específico, no una predicción para una web completa.

En el mismo snapshot, las 187 fichas del catálogo serializadas de forma compacta ocupan 323.382 bytes UTF-8. Doce fichas seleccionadas ocupan 26.917 bytes, un 91,7 % menos en esa selección. Esto demuestra selección de contenido, **no** una reducción del 91,7 % en tokens totales o tiempo. [Catálogo][catalogo]

## 3. Definir el objetivo antes de contar vueltas

Cada objetivo debe tener un estado y una comprobación. Un ejemplo para una adaptación de una web de servicios:

| Objetivo | Tipo de evidencia | Condición de cierre |
| --- | --- | --- |
| Reservar desde inicio hasta confirmación | Recorrido y estados reales de la interfaz | El recorrido funciona; servicios externos pendientes identificados |
| Mantener la guía elegida | Reglas, capturas y revisión visual | Jerarquía, espacio, superficies y movimiento coherentes |
| Móvil usable | Captura, interacción y comprobación de desbordes | Navegación y acción principal utilizables |
| Movimiento reducido | Comprobación del modo y alternativa | Contenido/acciones accesibles sin el efecto original |
| Aproximar el hero de la referencia | Comparación en viewport y estado equivalentes | Diferencias aceptables según el modo de adaptación |
| Presupuesto de carga | Medición por ruta y condiciones definidas | Dentro del límite acordado para ese sitio |

Estados: `pendiente`, `cumplido`, `no_aplica` o `sin_evidencia_suficiente`. Este último no equivale a aprobado. Registrar también si algo está fuera de alcance; no hacer que la tarea lo incorpore silenciosamente durante la validación.

Para reproducir una referencia se comprueba fidelidad. Para adaptar se comprueba la transferencia del lenguaje a otro contenido. Para inspirarse se comprueban los conceptos elegidos y la adecuación del resultado. El mismo porcentaje de diferencia de imagen no sirve como objetivo universal.

## 4. Niveles de validación y esfuerzo inicial

Estos niveles describen profundidad, no permisos para omitir los requisitos básicos del encargo. Una interfaz interactiva necesita comprobar su funcionamiento aunque su estética sea sencilla.

| Nivel | Encargo representativo | Validación característica | Vueltas de corrección orientativas |
| --- | --- | --- | --- |
| V0. Composición conocida | Página sencilla con guía y piezas ya probadas | Contratos/imports, contenido, captura y recorrido principal aplicable | 1–2 |
| V1. Funcionamiento completo | Sitio con navegación, formulario o reserva | Estados, errores, teclado, móvil y recorrido de extremo a extremo | 2–4 |
| V2. Dirección visual propia | Adaptación desde imágenes, webs o guías externas | V1 más reglas visuales, comparación de regiones y coherencia entre páginas | 3–6 |
| V3. Fidelidad o técnica nueva | Movimiento/3D o reproducción exigente | Calibración de referencia, ejes aplicables, ruido y comparación temporal | 5–10 o más |

**Los intervalos son hipótesis para el piloto.** Una vuelta significa cambiar una hipótesis o grupo coherente de cambios y volver a comprobar objetivos afectados. No incluye la primera construcción ni cada llamada de herramienta. Más vueltas no indican por sí solas mayor calidad; pueden revelar una mala medida o un objetivo ambiguo.

No asignaría todavía un rango de tokens o minutos a cada nivel como si estuviera medido. Depende del tamaño del sitio, del historial del agente, la velocidad del equipo y el coste de sus pruebas. Primero hay que medir una vuelta representativa y separar el trabajo fijo de las repeticiones.

## 5. Cómo estimar tiempo sin confundirlo con desarrollo del toolkit

```text
T_tarea = preparacion + investigacion_necesaria + primera_construccion
          + tiempo_en_la_ruta_critica_de_las_vueltas
          + validacion_final + entrega

T_vuelta = diagnostico + cambio + ejecucion_de_pruebas + inspeccion
```

Registrar tres relojes diferentes:

- **Tiempo transcurrido:** desde el inicio hasta el cierre, con esperas identificadas.
- **Tiempo de herramientas:** duración por captura, build, prueba, comparación y descarga. La suma puede superar el tiempo transcurrido si hay solapamiento.
- **Tiempo de intervención humana:** revisión, respuesta o decisión necesaria, separado del tiempo de ejecución del agente.

Para tareas secuenciales puede sumarse cada vuelta. Si hay procesos independientes solapados, usar la ruta crítica; no sumar tiempos y presentar el resultado como duración real.

### Ejemplo calculable, no predicción

Supongamos 20 minutos para preparar/construir, tres correcciones de 8 minutos y 10 minutos para cierre: **54 minutos**. Si hacen falta siete correcciones del mismo coste, son **86 minutos**. El objetivo de una skill sería comprobar si reduce las correcciones o su coste sin reducir la calidad requerida.

Para cine, diez vueltas de 6–8 minutos supondrían 60–80 minutos de ese tramo bajo condiciones parecidas a las históricas; investigación inicial, desarrollo y cierre se añaden aparte. Reutilizar una captura de referencia válida puede evitar repetir parte de ese tiempo.

## 6. Tokens: medir la tarea completa

```text
I_total = suma de entrada normalizada de todas las solicitudes
O_total = suma de salida facturada de todas las solicitudes
tokens_tarea = I_total + O_total
```

Normalizar según proveedor y entorno: entrada nueva, historial reenviado, caché leída/escrita, resultados de herramientas e imágenes. El razonamiento, cuando se reporta, puede ser un subconjunto de la salida: **no sumarlo dos veces**. Tampoco sumar la caché a un total de entrada que ya la incluya.

Métricas útiles: entrada total, entrada reutilizada desde caché, salida total, tokens de razonamiento si están disponibles, número de solicitudes, tokens por vuelta y tokens hasta cumplir. Bytes de archivos, caracteres y el texto visible en chat no sustituyen estos datos. Si un entorno no expone uso por tarea, dejarlo como no disponible y mantener separadas las aproximaciones.

### El historial acumulado importa

Ejemplo hipotético sin caché: ocho solicitudes empiezan con 12 k tokens de entrada y cada nueva solicitud añade 2 k al historial. La entrada suma `12 + 14 + … + 26 = 152 k`, no 96 k. Con 1,5 k de salida por solicitud, el total sería **164 k**. Es aritmética ilustrativa, no una medición de Trama.

Guardar un brief estable y consultar fichas selectivas puede reducir relecturas. Reanudar en otra sesión también puede perder contexto útil y provocar errores: esa estrategia debe evaluarse por resultado, no solo por tokens iniciales.

## 7. Coste esperado según el flujo F1–F8

Las vueltas de esta tabla son orientativas para una muestra o implementación acotada. Un sitio con varias rutas, flujos o técnicas debe dividirse en unidades verificables; no hereda el mismo rango por tener una única URL de entrada.

| Flujo | Trabajo fijo | Qué suele provocar vueltas | Validación a repetir | Hipótesis inicial |
| --- | --- | --- | --- | --- |
| F1. Imagen → página | Interpretar regiones y explicitar lo desconocido | Tipografía aproximada, proporciones, recorte y comportamiento móvil inferido | Región afectada y móvil; recorrido si cambia la estructura | 2–5 correcciones |
| F2. Web → sitio propio | Explorar estados/páginas representativos y medir | Cambio de contenido, navegación, diferencias entre desktop/móvil | Páginas afectadas y flujo de negocio | 3–6 |
| F3. Guía externa → sistema | Traducir roles y reglas a una muestra | Roles sin equivalente, fuentes, contraste y componentes que no responden como se espera | Muestra de componentes y modos afectados | 2–4 |
| F4. Varias referencias | Asignar a cada fuente un papel y prioridad | Contradicciones o falta de una dirección unificada | Conjunto visual, no solo el último detalle editado | 3–6 |
| F5. Gesto/3D → prototipo | Descubrir interacción, receta y ruido | Técnica no soportada, dinámica, iluminación o medida inestable | Tramo relevante, ejes afectados y alternativa sin efecto | 5–10 o más |
| F6. Encargo sin referencias | Resolver receta/guía; investigar solo vacíos útiles | Selección incorrecta o encargo insuficientemente definido | Adecuación al brief y muestra representativa | 1–3 si encaja en lo existente |
| F7. Web existente → mejora | Línea base y mapa de dependencias | Regresiones en otras rutas o efectos de CSS compartido | Área modificada y consumidores afectados | 2–5 |
| F8. Aprendizaje → kit | Distinguir adaptación local y regla reusable | Generalización excesiva o falta de una variación que demuestre utilidad | Caso original más otro contenido/tema y contrato público | 2–4 |

Los antecedentes de F5 tienen evidencia histórica; los demás rangos son hipótesis propuestas y requieren observación. No sumar los rangos si el encargo combina flujos: pueden compartir investigación, muestras y cierre.

## 8. Qué se valida en cada vuelta

Separar adquisición de evidencia, corrección y regresión permite evitar repetir todo sin perder garantías.

| Cambio | Comprobación inmediata | Comprobación adicional pertinente |
| --- | --- | --- |
| Copy o contenido local | Render, enlaces, cortes de línea y contenido largo | Flujo si cambian acciones o datos |
| Espacio/tipografía de una sección | Región y breakpoints afectados | Páginas que comparten esa regla |
| Tokens o guía global | Muestra representativa y contrastes | Rutas, estados y temas afectados |
| API/estado de un componente | Tipos, interacción y estados límite | Recorridos de consumidores que lo usan |
| Navegación/transición | Origen → destino, foco y elementos persistentes | Historial y movimiento reducido cuando corresponda |
| Motor de scroll/3D | Receta, tramo y ejes afectados | Controles previos que permitan detectar regresiones |
| Herramienta de medida | Calibración y controles conocidos | Resultados anteriores que dependían de esa medida |

El cierre incluye las comprobaciones requeridas del proyecto y las preocupaciones que sigan sin resolver. Las comprobaciones globales ya aprobadas no se repiten solo por costumbre cuando nada relevante ha cambiado. Si cambian dependencias, rutas, CSS compartido o la herramienta de medida, se invalida la evidencia afectada y se amplía la revisión.

No es necesario lanzar una captura completa de cine por cambiar un texto. Tampoco es suficiente inspeccionar un botón aislado después de cambiar el estado compartido de una reserva.

## 9. Controlar la medida antes de perseguir la fidelidad

La referencia puede variar por animación, física, fuentes, carga, viewport, fecha o contenido. Antes de corregir el prototipo, comprobar que la diferencia pertenece a la implementación.

1. Fijar versión/fecha de referencia, viewport, estado e interacción.
2. Reutilizar la evidencia mientras esas condiciones sigan siendo válidas.
3. Si hay variación relevante, repetir la referencia contra sí misma. Varias muestras ayudan a estimar dispersión; unas pocas capturas solo dan una indicación provisional.
4. Marcar ejes que no aplican o no pueden medirse. Resolverlos con otra evidencia; no presentarlos como aprobados.
5. Comparar únicamente estados y tramos equivalentes.

El método existente emplea umbrales por eje y margen sobre ruido; sus valores no deben convertirse en un «15 % de error aceptable» universal para cualquier web. Un eje dentro del ruido tampoco certifica una experiencia visual o funcional correcta. [Procedimiento][procedimiento], [plan de mejora][mejora]

Si mejora la herramienta de medida, volver a comprobar su calibración antes de interpretar nuevas puntuaciones como una mejora o regresión del sitio.

## 10. Cuándo continuar, cambiar de método o terminar

| Situación | Decisión |
| --- | --- |
| Todos los objetivos obligatorios tienen evidencia válida | Cerrar; conservar resultado y comprobaciones |
| Queda un fallo reproducible y la corrección tiene una hipótesis concreta | Corregir el área y repetir su validación/regresión |
| Varias vueltas no reducen una diferencia relevante | Revisar causa, referencia, contenido y medida antes de seguir afinando |
| La diferencia está al nivel del ruido | Mejorar la evidencia o usar revisión alternativa; no perseguir decimales sin significado |
| No se puede observar el comportamiento de origen | Declarar la incertidumbre y proponer una decisión de diseño adecuada |
| La solución exige una nueva técnica o modificar el toolkit | Separar esa subtarea y reestimar el alcance pendiente |
| Se alcanza el presupuesto orientativo sin cumplir | Registrar objetivos pendientes y coste acumulado; decidir cómo continuar, sin marcar completo |

El antecedente de revisar tras tres vueltas sin mejora es un disparador de diagnóstico, no un límite rígido al trabajo. Para tareas de adaptación, una discrepancia deliberada debe justificarse respecto al brief. Para una reproducción exigente no debe rebautizarse como «inspiración» para declararla terminada.

No se pide aprobación después de cada vuelta si corregir sigue dentro del encargo. Una decisión del usuario resulta necesaria cuando falta un criterio material o la propuesta cambia el objetivo o el alcance autorizado.

## 11. Qué deberían aportar las skills al coste de ejecución

| Capacidad | Ahorro que se espera comprobar | Riesgo contrario |
| --- | --- | --- |
| `trama-build` | Menos APIs inventadas y menos implementación repetida | Aplicar recetas de forma rígida y generar retrabajo |
| `trama-style` | Menos incoherencias y decisiones visuales repetidas | Abrir todas las guías o imponer una estética inadecuada |
| `trama-research` | Menos inferencias incorrectas, referencias perdidas y capturas redundantes | Investigar demasiado antes de una tarea sencilla |
| Consulta selectiva por CLI/MCP | Menos contexto irrelevante y versión correcta | Respuestas grandes o exploración con demasiadas llamadas |
| Brief y expediente persistentes | Continuidad entre vueltas/sesiones | Resumen desactualizado que oculte decisiones importantes |
| Validación por impacto | Menos ejecuciones globales innecesarias | Invalidación incompleta y regresiones no detectadas |

No presuponer que tres skills implican tres agentes. Un solo agente puede recorrerlas. La investigación adicional solo se justifica si resuelve una incertidumbre que afecta a construir o validar.

## 12. Protocolo de medición para el piloto

### Línea base

Usar las mismas tareas con documentación actual y con skills. Mantener versión de Trama, modelo/esfuerzo, entorno, contenido, referencias y criterio de cierre. Registrar cambios inevitables de configuración. Varias repeticiones y un orden alternado evitan atribuir al sistema el aprendizaje de una única sesión.

Primera muestra propuesta:

- Una composición conocida de V0/V1.
- Una adaptación desde imagen o web de V2.
- Un flujo con estados que se pueda recorrer de principio a fin.
- Un concepto de movimiento de V3, evaluado aparte para no distorsionar las tareas ordinarias.

No cruzar desde el principio todos los clientes, frameworks, guías y referencias. Estabilizar una combinación y ampliar según fallos o uso. Tres tareas × dos condiciones × dos repeticiones son doce ejecuciones iniciales; V3 puede añadirse como lote separado.

### Registro por tarea y vuelta

| Campo | Utilidad |
| --- | --- |
| Identificador, alcance, referencias, versión y entorno | Comparabilidad |
| Objetivos y comprobaciones de cierre | Evitar que cada ejecución se juzgue con una exigencia distinta |
| Inicio/fin y esperas | Tiempo hasta cumplir |
| Uso normalizado de tokens y solicitudes | Consumo real, caché y relecturas |
| Cambio/hipótesis por vuelta | Saber por qué se itera |
| Herramientas y duración por ejecución | Detectar el cuello de botella |
| Objetivos aprobados, fallidos y sin evidencia | Progreso y cobertura |
| Regresiones, retrabajo y ampliaciones | Coste que una primera demo no enseña |
| Resultado terminal | Cumplida, pendiente, sin evidencia o interrumpida |

No valorar solo la media de las tareas terminadas: incluir fallos y tareas que no llegan al objetivo con su consumo acumulado. Al haber muestra suficiente, comparar mediana, dispersión y proporción de éxito bajo un mismo presupuesto; no publicar un percentil alto fiable a partir de dos repeticiones.

## 13. Integración en el plan

1. Añadir a cada receta un conjunto mínimo de objetivos verificables y comprobaciones opcionales por modo.
2. Incorporar alcance, evidencia disponible y nivel de validación al brief de investigación.
3. Crear un registro común de ejecución, independiente del cliente de agente.
4. Medir la línea base antes de asignar rangos generales de tokens y duración.
5. Probar las skills comparando el coste hasta cumplir, no solo la rapidez de primera generación.
6. Revisar tareas estancadas para mejorar herramientas, referencias o componentes según su causa.
7. Sustituir los intervalos orientativos de vueltas por datos observados cuando haya cobertura suficiente.

**Siguiente experimento recomendado:** completar un mismo encargo de adaptación con y sin las skills, con objetivos idénticos y registro de cada vuelta. Eso permitirá saber qué ahorra Trama y cuánto cuesta validar la calidad solicitada. Esta revisión deja preparado el protocolo; todavía no ejecuta ese experimento.

## 14. Fuentes y modelo

- [Procedimiento de investigación y cierre][procedimiento].
- [Tiempos históricos de Hublot y Plain Sight][hublot].
- [Plan de mejora: objetivos, ruido, profundidad y evaluación humana][mejora].
- [Guías y límites de la medida de afinidad][guias-doc].
- [Catálogo utilizado para la selección medida][catalogo].
- [Modelo editable de ejecución](./modelo-costes-trama-2026-10.json): medidas disponibles, hipótesis y ejemplos aritméticos, sin tarifas monetarias.

[procedimiento]: https://github.com/DanielMartinezSebastian/trama/blob/2263365bc6b9485028ae7ce769fcf1fb5ba619ec/docs/35-procedimiento.md
[hublot]: https://github.com/DanielMartinezSebastian/trama/blob/2263365bc6b9485028ae7ce769fcf1fb5ba619ec/docs/28-estudio-hublot-y-coste.md
[mejora]: https://github.com/DanielMartinezSebastian/trama/blob/2263365bc6b9485028ae7ce769fcf1fb5ba619ec/docs/36-plan-de-mejora.md
[guias-doc]: https://github.com/DanielMartinezSebastian/trama/blob/2263365bc6b9485028ae7ce769fcf1fb5ba619ec/docs/54-guias-de-estilo-del-repo.md
[catalogo]: https://github.com/DanielMartinezSebastian/trama/blob/2263365bc6b9485028ae7ce769fcf1fb5ba619ec/docs/catalog.json
