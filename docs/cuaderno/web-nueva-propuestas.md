---
titulo: Web de Trama nueva, cuatro propuestas de portada (Neo, Telar, Escaparate, Consola)
fecha: 2026-11-04
tipo: concepto
estado: hecho
referencias: []
fichas: [docs/tareas/web-nueva.md, proyectos/web-nueva/imagenes.md]
ruta: http://localhost:3011/propuestas/neo
codigo: [components/propuestas/neo/Neo.tsx, components/propuestas/telar/Telar.tsx, components/propuestas/telar/Weave.tsx, components/propuestas/escaparate/Escaparate.tsx, components/propuestas/consola/Consola.tsx, public/propuestas]
colores: [#05060a, #eef1f8, #c8ff2e, #7c86ff, #efe8da, #942508, #fbfaf7, #0c0d0b, #c5f06a]
fuentes: [Archivo, Fraunces, Instrument Sans, Bricolage Grotesque, Inter, JetBrains Mono]
sector: [tecnología]
guia: []
tono: [técnico, futurista]
paleta: [fondo oscuro, acento lima, cromado]
tipografia: [titular gigante, grotesca expandida, etiquetas mono]
patrones: [cifras en cápsulas, demos por sector, banco de variantes, dispositivo con web en vivo, índice numerado]
movimiento: [objeto que sigue al puntero, campo de letras, órbitas lentas, movimiento reducido respetado]
piezas: [ObjectStage, CrossCluster, DeviceMockup3D, TypeField, Marquee, Hero, OpeningHours, PricingCard, MenuList, OptionPicker, DeviceMockup, CodeBlock, Button, Badge, ScrubText, BitmapText, TerminalTyper, AsciiChart, Kbd]
piezas-nuevas: []
relacionados: []
---

## Concepto

Rehacer la portada de la web de Trama con las skills (research, style, build). Primera ronda: tres direcciones lejanas
entre sí (Telar: el nombre como tela que se teje; Escaparate: configurador por negocio; Consola: órdenes y ASCII). No
convencieron como web principal y pasan a `/demos` (Técnicas → «Propuestas para la web de Trama»). Segunda ronda, a
petición del usuario: **Neo**, la estructura de la web actual con piel neofuturista y cuatro escenas 3D del kit.

## Qué se midió

- `qa:contrast` en 320–1920 px: cero incumplimientos en las cuatro. Pendiente de revisión a ojo en Neo: el wordmark
  con degradado (su tono más oscuro, #7f889c, da ~5,9:1 sobre el fondo) y textos sobre capas que axe no resuelve.
- Playwright: sin errores de consola ni desbordamiento lateral a 1440 y 390 px.

## Qué se hizo

- Neo: `ObjectStage` (nudo cromado) en portada, `CrossCluster` en componentes, `DeviceMockup3D` con la web en vivo del
  sector elegido y `TypeField` al cierre; reutiliza `VariantLab`, `StartSteps` e `InstallChip` de la web actual.
- Nueve imágenes generadas con Codex (`codex exec`, image_generation) para Telar y Escaparate, en WebP; originales
  fuera de `public/`.

## Diferencias con la referencia

Sin referencia externa: la referencia es la web actual de Trama, de la que Neo conserva estructura, marco y cifras.

## Aprendido

- `.x a { color: inherit }` pisa el color de `Button` con `href` (también es `<a>`): excluir `.ui-button`.
- `Reveal` mide a medio aparecer en `qa:contrast`: falsos incumplimientos. Evitarlo en bloques con mucho texto.
- `BitmapText` con `█` se monta si la monoespaciada no da ese glifo a ancho fijo; FIGlet `Standard` se lee bien.
- `qa:visual-text` necesita `--path` para medir una ruta; la URL sola mide `/`.
- Lanzar Codex con `--full-auto` y el sandbox desactivado lo bloquea el clasificador; con `-s workspace-write` funciona.

## Siguiente

La web no cambia de aspecto por ahora (05-11-2026): las cuatro quedan como demos. Si se retoma, plan en
`docs/tareas/web-nueva.md`.
