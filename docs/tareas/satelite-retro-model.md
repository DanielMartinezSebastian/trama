# Tarea: satélite solar en RetroModel

- Objetivo: modelo GLB detallado basado en las cuatro vistas del chat, disponible en el selector y reutilizable fuera del catálogo.
- Desarrollo: `C:/COMPARTIDO/trama`, rama `main`, base `cd243dc`. Se conservaron los cambios previos del usuario.
- Integración en el servidor solicitado: `C:/COMPARTIDO/trama-estudios`, rama `feat/cine-captura`, base `baea28f`; URL `http://localhost:3020/componentes#retro-model`. El puerto 3020 pertenece a este worktree; no se detuvo ningún servidor.
- Archivos: `scripts/gen-satellite.mjs`, `public/models/satelite.glb`, `public/models/LICENSES.md`, `lib/catalog/entries/fondos.tsx` y catálogo generado. En estudios, además ficha `docs/cuaderno/satelite-retro-model.md` e índice.
- Modelo: 21 344 triángulos, 47 mallas agrupadas por pieza/material, 7 materiales; 1 567 976 bytes. Seis paneles con celdas, marcos y bisagras; manta térmica geométrica, cámara, radiador, parabólica, antenas y tornillos. Sin descargas ni texturas externas. Regenerar con `node scripts/gen-satellite.mjs`.
- Decisiones: GLB estándar sin Draco/meshopt para el cargador existente; Y arriba, frontal +Z, alas X. La referencia conceptual tiene inconsistencias y se interpretó como un volumen único. No se cambió la API del componente.
- Comprobaciones: doctor y verify pasan en ambos worktrees. Smoke de 3020 HTTP 200 sin errores de consola ni sombras inválidas. Lectura del GLB con NodeIO correcta; controles de modos, materiales, modelo y rotación sin errores de página.
- Capturas: `.refs3d/smoke/satelite/` en estudios (ignoradas por git).
- No se ejecutó build: no se cambiaron rutas ni CSS y el servidor del usuario sigue activo.
- Uso: `<RetroModel src="/models/satelite.glb" material="original" rotation="45,-20,0" />` dentro de `RetroCanvas` con `tint="scene"`, `mode="pixel"`, `pixelSize={1}` y `levels={12}` para mostrar detalle.
- Siguiente: listo para revisión; no se han creado commits ni publicado paquetes.
