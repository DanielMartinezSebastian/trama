---
titulo: GuideFrame — contraste de texto optativo sin cambiar la decoración
fecha: 2026-10-29
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/evolucion-agentes/p4b-evaluacion-claude.md, docs/57-agentes.md]
ruta: /componentes#guide-frame
codigo: [components/ui/GuideFrame.tsx, lib/ui/text-contrast.ts, components/ui/styles/ui-guides.css, components/ui/styles/ui-local.css, scripts/text-contrast.test.ts]
colores: [#ffffff, #868686, #f5a490, #767676, #9e695d]
fuentes: [Cormorant Garamond, Manrope]
sector: [peluquería]
guia: [salón editorial claro]
tono: [editorial]
paleta: [fondo claro]
tipografia: []
patrones: [reserva en pasos]
movimiento: []
piezas: [GuideFrame, BookingFlow, AppointmentList, SectionHeader]
piezas-nuevas: []
relacionados: [herramienta-evaluacion-agentes, pieza-section-header-legible, demo-linde-agentes]
---

## Concepto

El usuario aprobó la propuesta de P4b: ofrecer contraste opcional en GuideFrame, conservando las guías medidas.
`textContrast` está desactivado por defecto; calcula alias de texto sin sustituir los tokens decorativos.

## Qué se midió

- Pruebas de las 19 guías: ratio WCAG sin redondear ≥ 4,5 sobre `--bg`, sin mutar tokens ni cambiar colores que ya cumplen.
  Casos claros/oscuros, redondeo sRGB, overrides y formatos no resolubles en servidor.
- Navegador en `/componentes#guide-frame`: opt-in desactivado/activado, móvil/escritorio, guías anidadas sin opt-in,
  intención semántica y paleta invertida. Smoke sin errores ni sombras oscuras; capturas revisadas por Codex.
- Consumidor limpio `.cache/agent-pilot-contrast`, instalado desde el `.tgz` local SHA-256 `28d62a4f…`.
  Copia de `booking-docs-2` con un único cambio: `GuideFrame textContrast`. Adjudicación completa correcta:
  tipos, build Next, axe inicial, validación de formulario, confirmación, persistencia y anulación.
  No es otra cohorte ni cambia las cifras originales de P4.

## Qué se hizo

La luminancia sRGB decide si el color ya cumple. Si hace falta, se mezcla hacia negro o blanco hasta alcanzar
4,5:1, comprobando el hex final redondeado; se elige el candidato de menor distancia RGB. Con `salon`, el texto
secundario usa `#767676` y el acento de texto `#9e695d`; `--mut=#868686` y `--acc=#f5a490` siguen intactos.

El kit lee `--mut-text`/`--acc-text` con fallback al token medido para sus textos. Fondos, bordes, sombras y decoración
siguen usando los originales. Los ámbitos de guía, paletas invertidas y colores semánticos reinician los alias
correspondientes. API, catálogo, docs, ejemplo de estilo y consejo de trama-style actualizados.

## Diferencias con la referencia

La captura original de reserva usaba tokens de poco contraste. La nueva copia oscurece solo los roles de texto;
los bordes pastel se conservan. Evidencia ignorada en `.refs3d/guide-contrast/` y `.cache/agent-evaluation-contrast/`.
Los artefactos de las cohortes originales no se modifican.

## Aprendido

El cálculo sobre `--bg` no certifica otras superficies, imágenes, transparencias, opacidades ni estados. Los
colores semánticos y los botones rellenos requieren su propia revisión. Los estilos propios deben consumir los alias;
`color: var(--acc)` sigue pidiendo deliberadamente el color original. `var()`, hsl y colores no resolubles se dejan intactos.

## Siguiente

El usuario validó visualmente este ajuste tras recibir el catálogo comparativo y las capturas de antes/después
y móvil (29 de octubre de 2026). Esa validación corresponde al ajuste de GuideFrame, no a toda la cohorte de P4.
Siguiente: otra guía/cohorte antes de generalizar los resultados de evaluación.
