# Entrega: Trama como librería híbrida para personas y agentes

29 de octubre de 2026. Rama `feat/evolucion-agentes`, base `2263365`, paquete local 0.13.0. Sin publicar en npm ni
desplegar. Plan en [plan-evolucion-agentes.md](../plan-evolucion-agentes.md); registro en
[tareas/evolucion-agentes.md](../tareas/evolucion-agentes.md).

Paquete tras el opt-in de contraste: `dist-npm/trama-ui-0.13.0.tgz`, SHA-256 `28d62a4f…`.
Las cohortes mantienen sus paquetes históricos; sus cifras no corresponden a este artefacto nuevo.

## Estado por entrega

| Entrega | Estado | Evidencia |
| --- | --- | --- |
| P0. Línea base | Hecha | [Matriz](./p0-matriz.md), [evidencia](./evidencia-p0.json), [registro npm](./npm-registry-p0.json) |
| P1. Contrato mínimo | Hecha | [Contrato](./p1-contrato-piloto.md), [implementación](./p1-implementacion.md), [índice generado](../agents/README.md) |
| P2. Distribución piloto | Hecha | `knowledge/` y `skills/` en el `.tgz`; consumidor limpio `examples/agent-pilot` con build Next 16.3.5 y recorrido en navegador |
| P3. Construcción y estilo | Hecha | `skills/trama-build`, `skills/trama-style`; instalador `trama-ui skills install`; [descubrimiento](./discovery-evidencia.json) en Codex CLI 0.165.0 y Claude Code 2.1.302 |
| P3b. Investigación | Hecha | `skills/trama-research`; [brief piloto](./research-piloto.md) y [evidencia](./research-evidencia.json) |
| P4. Evaluación | Hecha: Codex (12 de 12 ensayos) y Claude Code (18 de 18) | [Codex](./p4-evaluacion.md), [Claude Code](./p4b-evaluacion-claude.md), datos en `evaluacion-*evidencia.json` |
| P5. Comunicación | Hecha | Portada, metadatos, README, README del paquete y [docs/57-agentes.md](../57-agentes.md) |
| P6. Consulta y extensiones | Decidida: no ahora | Ver abajo |

## Qué cambia para quien usa Trama

- **Sin agente, nada cambia**: mismos imports, CSS y catálogo. `CATALOG.md` explica ahora cómo nombrar las fuentes y
  avisa del contraste de las guías.
- **Con agente**: el paquete trae `knowledge/` (índice, fichas de guía, receta y piezas `salon`, declaraciones y
  ejemplos) y tres skills que se instalan por proyecto sin tocar instrucciones existentes.
- **Arreglo del kit**: `Button` con `glyph` funciona desde Server Components (comprobado en el consumidor). La causa,
  `renderGlyph` dentro de un módulo `"use client"`, afectaba también a `Callout`, `FeatureGrid`, `Footer` y `Timeline`;
  ahora vive en `components/ui/glyph.ts` y `trama-ui/Icon` lo sigue exportando.
- **Tipos de reserva**: `Appointment`, `BookingService`, `BookingStaff` y `BookingPlace` se importan desde
  `trama-ui/BookingFlow` o desde la raíz; dos agentes los buscaron ahí.
- **Fichas de las 19 guías** en `knowledge/guides/`, cada una con su tabla de contraste medida.
- **SectionHeader con backdrop**: la palabra decorativa ocupa una franja recortada sobre el texto para evitar
  que cruce el subtítulo. Sin cambios de API; ficha en [el cuaderno](../cuaderno/pieza-section-header-legible.md).
- **GuideFrame textContrast**: opción aprobada por el usuario, desactivada por defecto. Ajusta los roles de texto
  secundario/acento sobre `--bg`, preservando los tokens medidos y decorativos. [Ficha y límites](../cuaderno/pieza-guide-frame-contraste.md).

## Resultado de la evaluación

| | Codex | Claude Code (Opus 5.5) |
| --- | --- | --- |
| Documentación de la base | 2/6 | 4/6 |
| Documentación actualizada | — | 4/6 |
| Skills | 6/6 | 5/6 |
| Entrada extra con skills | +64 % | +20 % |

Las skills aciertan más con los dos clientes y cuestan más. Con Opus, la documentación ya resuelve composición y
referencia; los fallos restantes son de contraste en la reserva. Una guía y dos clientes: no autoriza cifras generales.
Detalle en [P4](./p4-evaluacion.md) y [P4b](./p4b-evaluacion-claude.md).

## P6: decisión

No se añaden MCP, registro ni una consulta CLI nueva. Ninguna de las dos cohortes falló por no encontrar una pieza:
los fallos fueron de contraste, fuentes y tipos sin exportar, y el sobrecoste de las skills está en leer las fichas,
no en buscarlas. `trama-ui knowledge` basta para localizar el índice de la versión instalada. Volver a valorarlo si
más recetas y piezas con ficha alargan la búsqueda.

## Pendiente

- Revisión visual humana de las capturas de P4 y del consumidor piloto.
- Recetas y piezas con ficha siguen siendo solo las de `salon`.
- Publicar en npm y desplegar la web son decisiones del usuario; esta rama no lo hace.
