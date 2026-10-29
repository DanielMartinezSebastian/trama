---
titulo: Skills Trama por proyecto y evaluación independiente
fecha: 2026-10-29
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/57-agentes.md]
ruta:
codigo: [skills/trama-build/SKILL.md, skills/trama-style/SKILL.md, skills/trama-research/SKILL.md, scripts/trama-cli.mjs, scripts/evaluate-agents.mts]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [GuideFrame, BookingFlow, AppointmentList]
piezas-nuevas: []
relacionados: [herramienta-conocimiento-agentes, demo-linde-agentes, herramienta-evaluacion-agentes]
---

## Concepto

Distribuir instrucciones de construcción, estilo e investigación junto a conocimiento de la misma versión, con
instalación local por proyecto y una sola fuente de skills. Comprobar descubrimiento separado de calidad y eficiencia.

## Qué se midió

Validación de frontmatter, instalación idempotente, conservación de instrucciones/modificaciones locales, contexto de
la dependencia y lectura real de las tres skills en Codex CLI 0.165.0 y Claude Code 2.1.302. Evaluación de tres tareas,
dos condiciones y dos repeticiones; sus fallos y límites se conservan en el informe de entrega.

## Qué se hizo

skills/ como fuente común; el empaquetador incorpora los helpers de contexto y la CLI instala en .agents o .claude.
No se escriben instrucciones globales ni se sobrescriben adaptaciones. Research declara observado/inferido/decidido y
perfiles de herramientas. Los ensayos se ejecutan en directorios nuevos secuencialmente, sin tocar otros worktrees.

## Diferencias con la referencia

No se implementa un importador universal, plugin de hosting, MCP o marketplace. El formato común no demuestra
equivalencia de comportamiento entre clientes. Los modelos por defecto de los clientes de descubrimiento difieren.

## Aprendido

Menos documento leído no significa menos tokens: las llamadas adicionales y el historial reenviado también cuestan.
La evaluación conserva un intento interrumpido por falta de entrega y registra eventos/uso real en el protocolo revisado.
Una skill útil conserva el encargo y sus permisos; no impone otra estética ni pide confirmaciones rutinarias.

## Siguiente

Adjudicación hecha (herramienta-evaluacion-agentes): las skills aciertan más pero leen más. Antes de recortar las
fichas o añadir consulta CLI/MCP, medir una segunda cohorte con otra guía.
