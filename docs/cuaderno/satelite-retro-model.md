---
titulo: Satélite solar reutilizable en RetroModel
fecha: 2026-10-28
tipo: pieza
estado: hecho
referencias: []
fichas: []
ruta: /componentes#retro-model
codigo: [scripts/gen-satellite.mjs, components/ui/RetroModel.tsx, lib/catalog/entries/fondos.tsx]
colores: []
fuentes: []
sector: []
guia: []
tono: []
paleta: []
tipografia: []
patrones: []
movimiento: []
piezas: [RetroModel, RetroCanvas]
piezas-nuevas: []
relacionados: []
---

## Concepto

Convertir la lámina de cuatro vistas del satélite solicitada en el chat en un modelo GLB detallado, reutilizable dentro de RetroModel y en herramientas de modelado.

## Qué se midió

21 344 triángulos, 47 mallas y 7 materiales; 1 567 976 bytes. GLB autocontenido, sin texturas externas ni compresión que requiera decodificador. Smoke HTTP 200 sin errores ni sombras inválidas.

## Qué se hizo

Geometría propia reproducible con `node scripts/gen-satellite.mjs`: seis paneles con 576 celdas físicas, contactos, marcos y bisagras; cuerpo con manta térmica arrugada, largueros y tornillos; óptica frontal, radiador posterior, soporte inferior, parabólica con trípode y antenas. Piezas nombradas y geometría agrupada por pieza/material. Añadido al selector de RetroModel, seleccionado inicialmente en color, con control del tamaño del píxel.

## Diferencias con la referencia

La lámina es conceptual y sus proyecciones no son totalmente coherentes. El GLB adopta un único volumen consistente, eje Y vertical, cámara frontal hacia +Z y alas hacia X. No es una reconstrucción de ingeniería ni un modelo apto para fabricación.

## Aprendido

Para ver las celdas usar material original, tinte scene y píxel 1–2; clay y ASCII priorizan la silueta. La dimensión mayor de RetroModel incluye toda la envergadura, por lo que aumentar extent también acerca las alas al borde del encuadre.

## Siguiente

El modelo ya puede reutilizarse en escenas y abrirse en Blender. Ajustar extent, rotation y spin para cada composición.

```tsx
<div style={{ position: "relative", height: 480 }}>
  <RetroCanvas mode="pixel" tint="scene" pixelSize={1} levels={12} pointerFx="orbit">
    <RetroModel src="/models/satelite.glb" material="original" extent={4} rotation="45,-20,0" spin={2} />
  </RetroCanvas>
</div>
```
