# P4. Evaluación: documentación actual frente a skills piloto

Fecha: 29 de octubre de 2026. Cohorte: tres tareas × dos condiciones × dos repeticiones = 12 ensayos, todos ejecutados.
Datos por ensayo en [evaluacion-evidencia.json](./evaluacion-evidencia.json); los artefactos completos (fuentes, eventos,
capturas) quedan en `.cache/agent-evaluation-json/` y `.cache/agent-evaluation-json-glyph/`, ignorados por Git.

## Diseño

- **Tareas**: `composition` (sección comercial de Linde con tres servicios y CTA), `reference` (adaptar una captura al
  hero, con brief observado/inferido/decidido) y `booking` (reserva local y «mis citas» con `BookingFlow`/`AppointmentList`).
- **Condiciones**: `current_documentation` recibe el paquete sin `knowledge/` ni skills y el `CATALOG.md` de la base
  `2263365` con imports reescritos a `trama-ui`; `proposed_skills` recibe el `.tgz` piloto (SHA-256 `e238839e…`) con las
  skills instaladas por `trama-ui skills install --client codex`.
- **Cliente**: Codex CLI 0.165.0, `exec` de solo lectura, salida JSON con esquema, modelo heredado sin override (el
  cliente no informa cuál). Orden alternado por repetición para no favorecer a una condición por caché.
- **Adjudicación** (`npm run agents:validate-evaluation`): TypeScript estricto e imports públicos; build Next 16.3.5
  compartido; Chromium a 1440×900 y 390×844 con un h1, contenido pedido, CTA, columnas/apilado, desborde, axe WCAG 2 A/AA,
  errores de página y, en reserva, error de validación → confirmación → persistencia tras recarga → anulación.

## Resultados

| Condición | Ejecutados | Pasan (paquete evaluado) | Pasan (con arreglo de Button) | Generación media | Entrada media (sin caché) | Salida media |
| --- | --- | --- | --- | --- | --- | --- |
| Documentación actual | 6 de 6 | 2 | 3 | 82 s | 254 k (49 k) | 3,1 k |
| Skills piloto | 6 de 6 | 6 | 6 | 115 s | 417 k (65 k) | 4,3 k |

Por tarea (generación / tokens de entrada):

| Tarea | Documentación actual | Skills piloto |
| --- | --- | --- |
| composition | 75 s/272 k ✗ h1 · 70 s/300 k ✗ contraste | 74 s/357 k ✓ · 85 s/422 k ✓ |
| reference | 81 s/235 k ✓ · 81 s/232 k ✓ | 119 s/378 k ✓ · 120 s/234 k ✓ |
| booking | 86 s/278 k ✗ contraste · 98 s/205 k ✗ contraste | 141 s/544 k ✓ · 149 s/565 k ✓ |

Fallos, con su causa:

- **composition-docs-1** — no había h1 en el HTML servido. Causa: defecto del kit, no del agente. `Button` llama a
  `renderGlyph`, que vivía en `Icon.tsx` (`"use client"`); usado desde un Server Component con `glyph`, Next lanza
  «Attempted to call renderGlyph() from the server» y la página queda en el fallback de Suspense. Corregido en esta
  rama (`components/ui/glyph.ts`); con el paquete corregido el mismo código pasa todas las comprobaciones.
- **composition-docs-2**, **booking-docs-1** y **booking-docs-2** — axe `color-contrast`: textos con `--mut` `#868686` (3,64:1) y `--acc`
  `#f5a490` (1,98:1) sobre blanco, que son los tokens medidos de la guía `salon`. Las ejecuciones piloto ajustaron
  `--mut`/`--acc` en un tema local, como indica `trama-style`.
- **booking-docs-2** — completado al reintentarlo, con el mismo paquete original: 98 s, 205.249 tokens de entrada y
  3.492 de salida. Compila en ambos paquetes y falla por contraste. El intento inicial sin turno («usage limit»,
  3 s, sin uso) se conserva en `.cache/agent-evaluation-json-sin-cuota/booking-docs-2` y no entra en las medias.

Revisión visual de las 24 capturas (hecha por el agente evaluador, no por una persona):

- Las tres ejecuciones de documentación que nombran la fuente escriben `fontFamily: 'Cormorant'` literal; `next/font`
  registra otra familia, así que el titular cae a una serif del sistema más pesada. Las ejecuciones piloto usan
  `var(--font-…)` o las clases `ui-g-*` y muestran Cormorant.
- `composition-pilot-1` añade un semicírculo de acento sin función; `reference-pilot-1` oculta el botón «Reservar» de
  su cabecera en móvil (el CTA del hero sigue visible). Ninguno lo detecta la validación automática.
- `booking-docs-1` llama al salón «Liria»: el encargo de reserva no nombraba la marca, así que no se cuenta como error.
- `booking-docs-2` hereda las fuentes de `GuideFrame`; el formulario y el apilado móvil se revisaron en captura.

## Lectura

- Con las skills, 6 de 6 ensayos cumplen; con la documentación actual, 2 de 6 (3 de 6 descontando el defecto de
  `Button`). La diferencia procede de contraste y de carga de fuentes, que es conocimiento que el piloto lleva y el
  catálogo no.
- El piloto **no ahorra**: +40 % de tiempo de generación, +64 % de tokens de entrada (+33 % sin contar caché) y +38 %
  de salida. En reserva más que duplica la entrada. La hipótesis de ahorro del estudio no se confirma en esta cohorte.
- Muestra pequeña (n = 2 por celda), un cliente, un modelo no identificado y una sola guía. No
  autoriza cifras generales ni promesas de otros clientes.

## Cambios derivados

- `components/ui/glyph.ts`: `renderGlyph` fuera del módulo cliente; `Icon` lo reexporta por compatibilidad. Importan
  de ahí Button, Callout, FeatureGrid, Footer, Timeline y los componentes cliente que lo usaban.
- `scripts/agent-knowledge.mts`: la ficha de guía incluye `contrast` (cada rol de texto sobre `bg`/`card`, con su
  ratio y el uso que admite) en lugar de «pendiente de medir».
- `scripts/validate-agent-evaluation.mts`: registra nodos y resumen de cada fallo de axe y separa los ensayos que el
  cliente no llegó a empezar.

## Reproducir la adjudicación y el resumen

Con los artefactos locales conservados:

```powershell
npm run agents:validate-evaluation -- .cache/agent-evaluation-json .cache/agent-pilot-final
npm run agents:validate-evaluation -- .cache/agent-evaluation-json-glyph .cache/agent-pilot-glyph
npx tsx scripts/summarize-agent-evaluation.mts
```

La copia `agent-evaluation-json-glyph` contiene las mismas fuentes y `runs.json`. El resumen deriva tiempos,
tokens y adjudicaciones de esos JSON; conserva hashes históricos y anotaciones de fuentes/revisión visual.

## Pendiente

- Revisión visual humana de las capturas.
- Una segunda cohorte con otra guía o cliente antes de comunicar cifras.
