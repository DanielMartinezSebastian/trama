---
titulo: Evaluación de agentes — guía boutique y reserva de pilates
fecha: 2026-10-29
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/evolucion-agentes/p4c-evaluacion-boutique.md]
ruta:
codigo: [scripts/agent-evaluation-suites.mts, scripts/evaluate-agents.mts, scripts/validate-agent-evaluation.mts, scripts/capture-agent-boutique.mts]
colores: [#f7e7de, #25140c, #7c5a48, #744c32, #fbf1ec]
fuentes: [Cormorant Garamond, Inter]
sector: [estudio boutique]
guia: [estudio boutique]
tono: [cálido, editorial]
paleta: [tonos tierra, fondo claro]
tipografia: [serif con cursiva]
patrones: [reserva en pasos]
movimiento: []
piezas: [GuideFrame, Hero, BookingFlow, AppointmentList]
piezas-nuevas: []
relacionados: [herramienta-evaluacion-agentes, pieza-guide-frame-contraste, replica-nucleo]
---

## Concepto

Probar otra guía y otro sector sin añadir primero una receta específica. Compás es un estudio ficticio de pilates;
se comparan documentación actual y skills del mismo paquete, con tres tareas y dos repeticiones.

## Qué se midió

Referencia local: tokens, fuentes, dos columnas en escritorio y apilado móvil, con captura revisada por Codex.
Protocolo previo en P4c y contrato congelado antes de generar. Doce ensayos con fuente y brief, sin cuota agotada; 24 capturas revisadas por Codex (no revisión humana).

## Qué se hizo

Suite boutique con encargos y criterios propios, consumidor limpio y referencia original con Hero/GuideFrame.
El evaluador congela el contrato y los hashes antes de generar; no altera P4/P4b.
Dos adjudicaciones conservadas: selectores originales 5/6 por condición y robustos 6/6 por condición. Los falsos
fallos eran dos enlaces a mis citas y etiquetas Anular cita/Sí, anular cita. Se prueba el mismo flujo sin tocar
respuestas. Resumen reproducible con `npx tsx scripts/summarize-agent-cohort.mts`; evidencias en P4c.

## Diferencias con la referencia

Se pide adaptación, no igualdad de píxeles. Referencia e ilustración locales, sin atribución a una web externa.
Ambas referencias por condición conservan disposición, CTA y paleta. Cuatro respuestas de documentación cambian
la paleta medida rosa/tierra por crema/verde; las seis con skills la conservan. En varias reservas la ilustración
ornamental queda estrecha/recortada en móvil, sin tapar el CTA.

## Aprendido

La ficha de boutique existe; la receta y los ejemplos son de salon. Ambas condiciones resuelven las tres tareas
sin una receta específica de pilates. Con skills: entrada −2 % (−8 % sin caché), generación +29 %, salida +16 %.
No hay ventaja funcional ni ahorro global demostrado; sí mayor fidelidad cromática observada. La guía ya tiene
mut/bg 5,11:1 y acc/bg 6,18:1, por lo que no atribuye el empate al ajuste de contraste.
Una reserva con skills reimplementa la lista para evitar el texto fijo llámanos de AppointmentList; funciona,
pero añade código. No exige ampliar el kit sin valorar antes una personalización de texto.

## Siguiente

Valoración visual del usuario opcional. Probar una nota de fidelidad de paleta antes de ampliar recetas o añadir
consultas/MCP; no generalizar con dos repeticiones por celda.
