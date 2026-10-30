---
titulo: Mapa interactivo de decisiones de las skills de Trama
fecha: 2026-10-30
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/57-agentes.md]
ruta: http://127.0.0.1:3450/flujo-decision-skills.html
codigo: [public/flujo-decision-skills.html, skills/trama-build/SKILL.md, skills/trama-style/SKILL.md]
colores: [#f1efe8, #20231f, #2456a6, #7658b5, #c64d2d]
fuentes: []
sector: []
guia: []
tono: [analítico, transparente]
paleta: [papel mineral, tinta, azul, violeta, naranja]
tipografia: [serif editorial, monoespaciada técnica]
patrones: [diagrama de decisiones, inspector interactivo, filtro por categoría, selector de escenario]
movimiento: [cambios de estado sin animación obligatoria, movimiento reducido respetado]
piezas: []
piezas-nuevas: []
relacionados: [herramienta-skills-trama, herramienta-evaluacion-agentes, demo-rizo-empresa-tecnologica]
---

## Concepto

Un mapa navegable para entender qué pasos siguen `trama-research`, `trama-style` y `trama-build`, y qué decisiones
son puertas obligatorias, orientaciones o elecciones creativas.

## Qué se midió

Lectura de las tres skills locales y sus reglas sobre contexto, conocimiento, guías, recetas, referencias y revisión.
Se comparó el caso de una web con un pedido de tres o cuatro versiones del mismo proyecto.

## Qué se hizo

Página HTML autocontenida en `public/flujo-decision-skills.html`, con nodos SVG seleccionables, panel de detalle,
filtros por tipo de regla y un conmutador de escenario. En móvil el diagrama permite desplazamiento horizontal.
`trama-build` y `trama-style` ahora separan restricciones de preferencias y abren la exploración de conceptos cuando
el usuario pide varias versiones; no imponen una lista fija de estéticas.

## Diferencias con la referencia

No pretende exponer una cadena privada de razonamiento ni representar las skills como un árbol ejecutable. Visualiza
las instrucciones documentadas y deja claro que el agente interpreta el encargo. Los gates de contraste, legibilidad,
responsive y funcionamiento se separan de las decisiones visuales.

## Aprendido

Las reglas de compatibilidad y calidad no obligan por sí solas a una estética. La convergencia aparece cuando receta,
guía o esqueleto de landing pasan de ser recursos a ser el punto de partida automático. Las instrucciones nuevas
reducen ese sesgo, pero no garantizan resultados impredecibles: el modelo, el historial y los ejemplos vistos siguen
influyendo.

## Siguiente

Probar una petición de tres o cuatro versiones con el mismo brief y comprobar que la tesis, estructura e interacción
se separan antes de iterar sobre la elegida.
