# P4c. Segunda guía: boutique en un estudio de pilates

Protocolo fijado el 29 de octubre de 2026, antes de ejecutar los ensayos. Rama `feat/evolucion-agentes`, partida
`5abd496`. Cohorte prevista: tres tareas × dos condiciones × dos repeticiones = 12 ensayos con Codex CLI 0.165.0,
modelo heredado sin override. Este documento no atribuye resultados a ensayos todavía no adjudicados.

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
```

La referencia debe recapturarse y congelarse antes de otra cohorte; un render posterior puede cambiar su hash.
Los artefactos de P4 y P4b no se modifican. Las cifras nuevas no son una comparación causal con P4: han cambiado
guía, sector, catálogo, paquete y host. La comparación interna sí mantiene esos factores iguales entre condiciones.

## Estado

Preparación y referencia listas. Generación y adjudicación pendientes.
