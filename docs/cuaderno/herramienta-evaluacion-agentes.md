---
titulo: Evaluación de agentes con y sin skills de Trama
fecha: 2026-10-29
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/evolucion-agentes/p4-evaluacion.md, docs/57-agentes.md]
ruta:
codigo: [scripts/evaluate-agents.mts, scripts/validate-agent-evaluation.mts, components/ui/glyph.ts]
colores: [#ffffff, #868686, #f5a490]
fuentes: [Cormorant Garamond, Manrope]
sector: [peluquería]
guia: [salón editorial claro]
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [GuideFrame, Button, PricingSection, BookingFlow, AppointmentList]
piezas-nuevas: []
relacionados: [herramienta-conocimiento-agentes, demo-linde-agentes, herramienta-skills-trama]
---

## Concepto

Medir si las skills y el conocimiento del paquete cambian el resultado de un agente frente al `CATALOG.md` de siempre,
con el mismo cliente, encargo y adjudicación automática en un consumidor Next limpio.

## Qué se midió

Tres encargos (sección de servicios, hero desde captura, reserva local) × dos condiciones × dos repeticiones con Codex
CLI 0.165.0. Por ensayo: tiempo, tokens, tipos e imports públicos, build, h1, contenido, columnas y apilado, desborde
móvil, axe WCAG 2 A/AA, recorrido de reserva y capturas a 1440 y 390 px. Once ensayos ejecutados; uno sin turno por
límite de uso del cliente.

## Qué se hizo

`evaluate-agents` lanza cada ensayo en un directorio propio y guarda eventos y uso; `validate-agent-evaluation` monta
las fuentes en el consumidor, compila, sirve en un puerto propio y recorre en Chromium. Ahora registra los nodos de cada
fallo de axe y separa los ensayos que el cliente no empezó. Se repitió la adjudicación con el paquete corregido.

## Diferencias con la referencia

No hay web externa: la referencia es la captura del consumidor Linde. Las capturas las revisó el agente evaluador, no
una persona.

## Aprendido

Skills 6/6 frente a documentación 2/5, pero con +46 % de tiempo y +58 % de tokens de entrada: más acierto, no ahorro.
Los fallos de la documentación vinieron de lo que el catálogo no decía: contraste de los tokens medidos de `salon`
(`--mut` 3,64:1, `--acc` 1,98:1) y fuentes nombradas por su nombre literal, que `next/font` no registra así. La
cohorte destapó además un defecto real: `Button` con `glyph` rompía en Server Components porque `renderGlyph` vivía en
un módulo `"use client"`.

## Siguiente

Repetir el ensayo pendiente cuando haya cuota y probar una segunda guía u otro cliente antes de publicar cifras.
