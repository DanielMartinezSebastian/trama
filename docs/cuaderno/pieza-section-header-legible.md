---
titulo: SectionHeader — decoración sin interferir con el texto
fecha: 2026-10-29
tipo: pieza
estado: hecho
referencias: []
fichas: [docs/evolucion-agentes/p4b-evaluacion-claude.md]
ruta: /componentes#section-header
codigo: [components/ui/SectionHeader.tsx, components/ui/styles/ui-kit.css, lib/catalog/entries/texto.tsx]
colores: []
fuentes: []
sector: [peluquería]
guia: [salón editorial claro]
tono: [editorial]
paleta: []
tipografia: [titular gigante]
patrones: []
movimiento: []
piezas: [SectionHeader]
piezas-nuevas: []
relacionados: [herramienta-evaluacion-agentes, demo-linde-agentes]
---

## Concepto

La cohorte de Claude mostró una palabra decorativa detrás del subtítulo. Aunque axe la exime por `aria-hidden`,
interfiere con la lectura. Separa decoración y texto sin cambiar la API ni los tokens.

## Qué se midió

Captura original: `.cache/agent-evaluation-claude-v3/composition-pilot-1/desktop.png`.
En `/componentes#section-header`: 1440 y 390 px, alineación izquierda/centrada y tamaños md/giant.
Comprobación geométrica de la separación y ausencia de desborde de página, con capturas en
`.refs3d/section-header/`; revisión visual por Codex, no humana. Smoke sin errores ni sombras oscuras.

## Qué se hizo

La palabra pasa de posición absoluta a una fila propia del grid, recortada en una franja de 64–140 px.
Mantiene escala, color derivado de `--acc` y `aria-hidden`. `min-width: 0` impide que el texto decorativo
ensanche las columnas. El escenario del catálogo crece con la cabecera para permitir ver el subtítulo completo.
No hay cambios de props; el hint y la declaración explican la nueva posición.

## Diferencias con la referencia

La franja ocupa espacio sobre el texto y aumenta la altura de la cabecera con `backdrop`; sin `backdrop` el kit
conserva su composición. No se busca reproducir el solapamiento de la captura original.

## Aprendido

Excluir decoración del contraste automático no acredita legibilidad. Reservar su espacio evita depender del
color o de la superficie del contenedor; el grid necesita limitar también el tamaño mínimo de la palabra.

## Siguiente

La propuesta opt-in de contraste en GuideFrame sigue pendiente de aprobación expresa del usuario.
