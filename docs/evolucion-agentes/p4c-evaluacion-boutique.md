# P4c. Segunda guía: boutique en un estudio de pilates

Protocolo fijado el 29 de octubre de 2026, antes de ejecutar los ensayos. Rama `feat/evolucion-agentes`, partida
`5abd496`. Cohorte prevista: tres tareas × dos condiciones × dos repeticiones = 12 ensayos con Codex CLI 0.165.0,
modelo heredado sin override. Los resultados posteriores al protocolo se registran abajo y en
[evaluacion-boutique-evidencia.json](./evaluacion-boutique-evidencia.json).

## Pregunta

¿La documentación y las skills actuales permiten aplicar otra guía y trasladar el flujo de reserva a otro sector?
`boutique` tiene ficha de guía; receta y ejemplos con ficha siguen siendo los de `salon`. No se añade una receta de
pilates antes de medir: se observa si el agente adapta lo que encuentra o arrastra el contenido del salón.

## Condiciones fijadas

- Paquete idéntico en ambas condiciones: `trama-ui@0.13.0`, `.tgz` SHA-256
  `28d62a4f55ce7a38a3f5856052e2970992e8427f4ca84fa77775fdbec9aea3d3`; incluye los arreglos de glyph, tipos,
  SectionHeader y el opt-in `textContrast`. No se actualiza ni recompila durante la cohorte.
- Documentación actual (`updated_documentation`): CATALOG de ese paquete y declaraciones públicas, sin
  `knowledge/` ni skills. Skills (`proposed_skills`): el mismo paquete completo y skills instaladas para Codex.
  No se usa el catálogo antiguo de la base, porque la pregunta es sobre el estado actual.
- Orden: repetición 1 documentación → skills; repetición 2 skills → documentación, por tarea. Directorios nuevos,
  repos independientes, solo lectura, sin instalaciones ni red en los ensayos. Codex devuelve TSX y brief en JSON.
- Consumidor `.cache/agent-pilot-boutique` independiente, Next 16.3.5/React 19.3.0. Host neutro con reset de
  box-sizing, sin guía ni tema heredados; carga Cormorant/Inter y Geist Mono. Cada respuesta debe aplicar su estilo.
- `cohort.json` fija encargos, expectativas, paquete completo, cliente y hash de referencia antes del primer turno;
  una reanudación con cambios se rechaza. La ausencia de cuota se registra y detiene la cohorte para no producir
  más ensayos vacíos. No se sustituye el cliente ni se mezclan ejecuciones silenciosamente.

## Tareas y adjudicación

Marca ficticia: **Compás — Pilates y movimiento**. Guía `boutique`, original, sin modificar sus tokens medidos.

| Tarea | Encargo | Comprobaciones |
| --- | --- | --- |
| composition | h1, introducción y tres servicios: Sesión inicial gratis/15 min, Clase privada 35 €/45 min, Dúo desde 65 €/60 min; CTA a reserva | Un h1, contenido/importe pedido, enlace usando bookHref, móvil sin desborde, axe, errores de página |
| reference | Adaptar la captura al titular «Fuerza con calma. Movimiento contigo.», imagen recibida y CTA | Texto izquierda/imagen derecha en escritorio; texto antes de imagen en móvil, alt, carga de imagen; brief observado/inferido/decidido y revisión visual |
| booking | Reserva y mis citas con almacenamiento local, profesionales Alba/Dani y tres servicios del estudio | Tipos/imports públicos, error de formulario → confirmación → persistencia al recargar → anulación; parámetros horarios iguales a P4 |

Para todos: build Next, Chromium 1440×900/390×844, un h1, axe WCAG 2 A/AA, contenido servido y ausencia de errores.
Texto puramente decorativo con `aria-hidden` se anota aparte, como en P4b. Revisión visual posterior separada de
la adjudicación automática; no se exige igualdad de píxeles. No se arreglan las respuestas antes de puntuarlas.

## Referencia

Referencia e ilustración originales locales, no una web externa ni una réplica. Se compone con GuideFrame y Hero
del paquete fijado, tokens de `boutique`, tipografía Cormorant/Inter y un dibujo de reformer/pelota de pilates.
Fuentes de fixture en `scripts/fixtures/evaluation-boutique/`; captura y medidas en `.refs3d/agent-boutique/`.
Escritorio y móvil revisados por Codex antes de lanzar los ensayos. Hash de la captura que reciben:
`ea7bf75e60a18d9b6a100eea3cba6bc08f65af0e015a7af91b9ad4db57bf9d55`.

## Reproducción

```powershell
# Exige un destino nuevo y el .tgz exacto indicado arriba.
npm run agents:pilot -- .cache/agent-pilot-boutique --suite boutique
# Dentro de ese consumidor: npm run build
npx tsx scripts/capture-agent-boutique.mts .cache/agent-pilot-boutique
npm run agents:evaluate -- .cache/agent-pilot-boutique/node_modules/trama-ui .cache/agent-evaluation-boutique --suite boutique --conditions updated,pilot
npm run agents:validate-evaluation -- .cache/agent-evaluation-boutique .cache/agent-pilot-boutique
Copy-Item .cache/agent-evaluation-boutique/validation.json .cache/agent-evaluation-boutique/validation-protocolo-original.json
npm run agents:validate-evaluation -- .cache/agent-evaluation-boutique .cache/agent-pilot-boutique --robust-selectors
npx tsx scripts/summarize-agent-cohort.mts
```

La referencia debe recapturarse y congelarse antes de otra cohorte; un render posterior puede cambiar su hash.
Los artefactos de P4 y P4b no se modifican. Las cifras nuevas no son una comparación causal con P4: han cambiado
guía, sector, catálogo, paquete y host. La comparación interna sí mantiene esos factores iguales entre condiciones.

## Resultados

12 de 12 ensayos ejecutados, con código y brief; sin incidencias de cuota. Las medias se calculan sobre seis
ensayos por condición, sin imputar uso ausente. No se transforman tokens en dinero ni se inventa un modelo.

| Condición | Pasan con selectores originales | Pasan con selectores robustos | Generación media | Entrada media (sin caché) | Salida media |
| --- | --- | --- | --- | --- | --- |
| Documentación actual | 5/6 | 6/6 | 83 s | 259 k (51 k) | 3,3 k |
| Skills | 5/6 | 6/6 | 107 s | 252 k (46 k) | 3,8 k |

Los dos fallos iniciales son del validador, no de los flujos:

- `booking-updated-1`: hay dos enlaces válidos a «Ver mis citas» (confirmación y pie). El selector de Playwright
  exige un único elemento y se detiene por ambigüedad. La comprobación robusta elige el primero después de confirmar.
- `booking-pilot-1`: la lista local usa «Anular cita»/«Sí, anular cita»; el selector original exige
  «Anular»/«Sí, anular». El opt-in admite ambas etiquetas y mantiene la comprobación de persistencia y anulación.

Se conservó `validation-protocolo-original.json` antes de añadir `--robust-selectors`, que no cambia el
comportamiento por defecto de P4. Se repitieron **los doce ensayos** con ese opt-in, sin corregir fuentes, briefs
ni parámetros. Todos compilan, pasan axe inicial y completan el recorrido que les corresponde; las cuatro reservas
completan error de datos → confirmación → mis citas → recarga → anulación. No es una certificación de todos los estados.

Por tarea (generación / tokens de entrada):

| Tarea | Documentación actual | Skills |
| --- | --- | --- |
| composition | 71 s/321 k · 91 s/228 k | 100 s/293 k · 103 s/204 k |
| reference | 79 s/195 k · 80 s/214 k | 107 s/205 k · 75 s/162 k |
| booking | 86 s/337 k · 91 s/257 k | 150 s/326 k · 108 s/326 k |

## Revisión visual y de fuentes

Inspección por Codex de las 24 capturas (no revisión humana). Notas por ensayo en `visual-review.json` local y
en el JSON de evidencia. Se mantiene separada de la tasa de pruebas automáticas:

- Las cuatro referencias conservan jerarquía, ilustración, CTA visible y orden texto/imagen en móvil. Sus briefs
  separan lo observado de inferencias y decisiones, sin atribuir fuentes exactas a la captura.
- No se observa fallback de fuentes de sistema. Ambas condiciones usan Cormorant/Inter y declaran que no habían
  compilado ni probado navegador durante la generación; la adjudicación la hizo después el evaluador.
- **Paleta:** las seis respuestas con skills conservan el rosa/tierra de boutique. Con documentación, ambas
  composiciones y ambas reservas lo sustituyen por crema/verde mediante overrides locales; las dos referencias
  sí conservan la paleta. Es una menor fidelidad al color medido, aunque se mantiene contraste y funcionamiento.
  No se convierte retrospectivamente esta observación en un fallo automático.
- Las ilustraciones ornamentales de reserva se recortan; en `booking-pilot-1`, `booking-pilot-2` y
  `booking-updated-2` quedan especialmente estrechas en móvil. No tapan contenido ni el CTA, pero no se tomarían
  como una decisión visual final sin revisión del proyecto.
- `booking-pilot-1` reimplementa la lista de citas para evitar «llámanos», texto fijo de AppointmentList al cerrar
  el plazo de cambios. Su flujo funciona, pero añade código y acoplamiento al formato de almacenamiento.
  `booking-pilot-2` reutiliza AppointmentList y aclara que esa llamada es texto del simulador, sin teléfono conectado.

## Lectura y decisiones

- **Empate funcional, diferencia visual observada:** no hay ventaja de acierto automático en esta guía con el
  paquete actual. Las skills conservan mejor su paleta en esta muestra. El catálogo basta para construir los tres
  encargos; la presencia de una ficha de guía permite a las skills adaptarse sin una receta nueva de pilates.
- **Coste mixto:** con skills se lee un 2 % menos de entrada total (8 % menos sin caché), pero la generación tarda
  un 29 % más y produce un 16 % más de salida. No se repite el sobrecoste de lectura de P4/P4b ni se acredita un
  ahorro global. Tiempos de cliente/modelo remotos y muestra pequeña: no son promesa de latencia.
- **El contraste base ya cumple:** boutique tiene `mut/bg` 5,11:1 y `acc/bg` 6,18:1. Todos los ensayos activan
  `textContrast`, que deja esos colores intactos cuando ya cumplen. Este caso no prueba el ajuste sobre una guía
  de bajo contraste ni permite atribuir al opt-in el empate de aciertos.
- **No se añade MCP ni una receta boutique por estos datos.** El siguiente ajuste de conocimiento que merece
  probarse es explicar cuándo conservar la paleta medida y cuándo justificar una adaptación local. Antes de
  reimplementar una lista, conviene valorar texto configurable en AppointmentList; es una propuesta, no un cambio
  de API hecho en esta cohorte.
- La comparación interna mantiene paquete/encargo/host iguales. Frente a P4 cambian varios factores a la vez:
  dos repeticiones por celda, un cliente, modelo no informado y dos guías entre todos los estudios no generalizan.

## Estado final

Generación, dos adjudicaciones, resumen reproducible y revisión por el agente completos. Pendiente únicamente la
valoración visual del usuario si quiere hacerla. Paquete y cohortes anteriores intactos, sin publicación ni push.
