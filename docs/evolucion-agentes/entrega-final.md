# Entrega: Trama como librería híbrida para personas y agentes

29 de octubre de 2026. Rama `feat/evolucion-agentes`, base `2263365`, paquete local 0.13.0. Sin publicar en npm ni
desplegar. Plan en [plan-evolucion-agentes.md](../plan-evolucion-agentes.md); registro en
[tareas/evolucion-agentes.md](../tareas/evolucion-agentes.md).

## Estado por entrega

| Entrega | Estado | Evidencia |
| --- | --- | --- |
| P0. Línea base | Hecha | [Matriz](./p0-matriz.md), [evidencia](./evidencia-p0.json), [registro npm](./npm-registry-p0.json) |
| P1. Contrato mínimo | Hecha | [Contrato](./p1-contrato-piloto.md), [implementación](./p1-implementacion.md), [índice generado](../agents/README.md) |
| P2. Distribución piloto | Hecha | `knowledge/` y `skills/` en el `.tgz`; consumidor limpio `examples/agent-pilot` con build Next 16.3.5 y recorrido en navegador |
| P3. Construcción y estilo | Hecha | `skills/trama-build`, `skills/trama-style`; instalador `trama-ui skills install`; [descubrimiento](./discovery-evidencia.json) en Codex CLI 0.165.0 y Claude Code 2.1.302 |
| P3b. Investigación | Hecha | `skills/trama-research`; [brief piloto](./research-piloto.md) y [evidencia](./research-evidencia.json) |
| P4. Evaluación | Hecha, con un ensayo pendiente | [Informe](./p4-evaluacion.md), [datos](./evaluacion-evidencia.json) |
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

## Resultado de la evaluación

Con skills, 6 de 6 ensayos pasan la adjudicación automática; con la documentación actual, 2 de 5 (3 de 5 con el arreglo
de `Button`). Las skills cuestan más: +46 % de tiempo y +58 % de tokens de entrada. La muestra es pequeña (un cliente,
un modelo no identificado, una guía) y no autoriza cifras generales. Detalle en [P4](./p4-evaluacion.md).

## P6: decisión

No se añaden MCP, registro ni una consulta CLI nueva. P4 no mostró fallos por no encontrar una pieza: los fallos
fueron de contraste y fuentes, y el sobrecoste del piloto está en leer las fichas, no en buscarlas. `trama-ui knowledge`
basta para localizar el índice de la versión instalada. Volver a valorarlo si una segunda cohorte con varias guías
muestra búsquedas largas o fichas equivocadas.

## Pendiente

- Repetir `booking-docs-2` (sin turno por límite de uso del cliente); instrucciones en P4.
- Revisión visual humana de las capturas de P4 y del consumidor piloto.
- Generalizar `knowledge/` más allá de `salon` solo tras una segunda cohorte.
- Publicar en npm y desplegar la web son decisiones del usuario; esta rama no lo hace.
