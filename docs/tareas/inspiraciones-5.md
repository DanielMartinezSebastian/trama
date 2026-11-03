# Tarea: quinta ronda de inspiraciones, guiada por los huecos de las guías

- Objetivo: ocho webs premiadas nuevas, elegidas por los huecos de las guías del repo y no por sector. Ajustar las guías
  existentes antes que crear otras, y seguir enteras las skills `trama-research`, `trama-kit-evolution` y `trama-style`.
  Las imágenes de Codex, al final.
- Rama / commit / worktree: feat/inspiraciones-5 desde main c481b34 / C:/COMPARTIDO/trama-inspiraciones-5. Árbol limpio
  al iniciar.
- URL local: http://localhost:3000. El usuario pidió parar los servidores levantados y dejar solo lo necesario: se paró
  el dev de trama-evolucion-agentes (3000) y se levantó el de este worktree en el mismo puerto.
- Expediente: docs/60-inspiraciones-ronda-5.md.

## Registro

- 03-11-2026. Línea base: `refs:probe --repo` sobre 80 páginas medibles, con 28 por debajo de 0,25
  (`.refs/ronda-5/repo-antes.json`).
- Hallazgo: muchas de esas 28 no son estéticas sin guía. La sonda tomaba como titular lo mayor de la primera pantalla y,
  en las portadas que abren con una foto, eso es la navegación (1–2 vw), mientras que las guías se miden con su titular a
  la vista. Decisión de capa: herramienta. La sonda mide además lo mayor de las tres primeras pantallas (sin el pie) y la
  afinidad lo usa cuando el titular de la primera mide menos de 2,5 vw.
- Sonda (`scripts/probe-refs.mts`, `scripts/guias-afinidad.mts`): titular de página, marca y titular de guía por separado, letra por familia genérica y fondo de la primera pantalla. Bajo 0,25: de 28 a 14 páginas; por encima de 0,35: de 27 a 40.
- Guías: `salon` (tarjetas salmón) y `trattoria` (fondo rojo) ajustadas; `bloque` nueva (11/11), pero aún no atrae a su familia: se mide con titular de 6 vw, peso 400 y sin acento visible (Truck'N Roll, Glitch&Grit, Bolo y Grano: 10–14 vw, 900, saturación alta). Brasa, Impulso, Bolo y Grano apuntan a `bloque`.
- Kit: `CheckoutFlow delivery="digital"` y `useCart` sincronizado entre instancias.
- Webs hechas con provisionales: bolo, grano, turia, majo, corriente, tueste, trocha, llave (`.refs/encargo5*.py`).

## Siguiente
1. Rehacer `bloque` para que su relato muestre un titular de 12 vw y peso 900 y el acento en superficie; decidir guía de color pleno (Turia, Llave, Cita) y guías de majo, corriente, tueste y trocha según `.refs/ronda-5/afin2.mts`.
2. Pares, `qa:contrast` y `qa:visual-text` con todos los anchos; `refs:probe --repo` final.
3. Catálogo, docs/60, 54, 55, AGENTS, recetas, fichas del cuaderno, encargo de imágenes y prompt para Codex; verify y build.

## Cierre

- `bloque` rehecha (portada con foto, Archivo 900, tarjetas violeta): Bolo 0,54, Grano 0,45, Glitch&Grit 0,40 y Truck'N Roll 0,25, todas con `bloque` como la más afín.
- Guías asignadas: Llave → `manchas`, Majo y Trocha → `papel`, Nada Corriente → `sabana`, Tueste → `monocromo`, Turia → `cartel` (afinidad baja: hueco de color pleno sin segunda fuente).
- Medida final del repo: 91 páginas medibles; 13 por debajo de 0,25 (al empezar, 28 de 80) y 49 por encima de 0,35 (27). Réplicas más cerca de otra guía: 20 de 44 (22 de 36).
- `qa:contrast` (11 anchos) sin fallos reales tras corregir colores; lo que queda son elementos a media animación. `qa:visual-text` (11 anchos): solo líneas pegadas de un mismo titular, por diseño; se separó el enlace del muro de Grano.
- `verify`: todo pasa salvo el cuaderno, por fichas de `proyectos/` (carpeta sin seguimiento que este worktree no tiene).
- Imágenes (03-11-2026): Codex se quedó sin cuota a mitad. Se aprovecharon 59 de 92, todas con formato, tamaño y peso
  correctos y fieles a su motivo (commit `71476e4`): Bolo, Grano, Turia, Majo y Nada Corriente completas y 6 de Tueste.
  `tueste/t5` se reencuadró: la máquina ocupaba un tercio del cuadro y desentonaba en el catálogo. Los pares de las cinco
  webs completas no cambian (11/20, 8/14, 10/20, 13/20, 10/20): la sonda mide estructura, letra y color de superficie, no
  el contenido de las fotos.
- Pendiente: 33 imágenes provisionales (Tueste 10, Trocha 14, Llave 9) y medir los pares de esas tres webs.
