# P1: generación selectiva del piloto

Implementación del 29 de octubre de 2026 en `feat/evolucion-agentes`. [Contrato](./p1-contrato-piloto.md) y [matriz previa](./p0-matriz.md). Las evidencias de P0 siguen siendo su snapshot original; sus hashes no describen los archivos modificados después.

## Qué se genera y desde dónde

`npm run catalog` mantiene los dos catálogos existentes y genera [docs/agents/README.md](../agents/README.md) y [index.json](../agents/index.json): guía `salon`, receta `salon`, 18 componentes, tres ejemplos y 49 declaraciones transitivas. La selección se deriva de las secciones de `RECETAS_SECTOR` más sus cuatro piezas de apoyo. No hay listado duplicado de esas 18 piezas.

Los metadatos de flujo e integraciones viven en `RecetaSector.pilot`; las limitaciones específicas de reserva/lista están en sus entradas de catálogo (`consumption`). La guía conserva su única fuente en `lib/ui/guides.ts`. Los ejemplos se almacenan una sola vez en `scripts/fixtures/agents/*.tsx.txt`, se copian a las salidas y se incorporan a las fichas. La extensión `.txt` permite tratarlos como ejemplos para consumidores, sin resolver `trama-ui` contra el código del sitio por accidente.

`scripts/package-surface.mts` comparte el mapa de exports con el empaquetador. `scripts/agent-knowledge.mts` emite declaraciones mediante TypeScript y conserva su cierre local de tipos en `docs/agents/types/`. Es un snapshot generado de la API; sus imports relativos internos permiten leer el cierre, pero no son imports recomendados al consumidor. La comprobación de paquete compara ese cierre completo, no solo las firmas de los componentes principales.

`playgroundProps` contiene controles con sus marcas `noCode`; nunca se presenta como firma. En el catálogo general se corrigieron `title` y `lead` de `GuideFrame`: son controles para sus hijos de ejemplo, no props del componente. No se cambió la API de `GuideFrame` ni el aspecto de la muestra.

## Comprobaciones y reproducción

```powershell
npm run catalog
npm run verify
npm run pkg:build
npm run agents:check-package
```

Ejecutar paquete y typecheck por turnos. `tsconfig.json` excluye `dist-npm/`, `docs/agents/` y `.cache/` del programa del sitio; sus declaraciones y ejemplos se comprueban por los comandos específicos. No se excluyen las fuentes del kit ni los scripts de TypeScript.

- `catalog:check` compara todas las salidas esperadas, incluidos ejemplos y declaraciones. Rechaza archivos extra: una salida obsoleta exige revisión antes de retirarla, evitando borrar archivos ajenos automáticamente.
- `agents:test`, incluido en `verify`, prueba selección inválida/ausente, guía/pieza inexistentes, exports, enlaces y conservación de tipos de objetos, hijos y callbacks. No necesita `dist-npm/` instalado o presente.
- `agents:check-package` resuelve imports mediante los exports del manifiesto construido, comprueba recursos CSS reales, compila los tres fixtures contra `.d.ts` públicos y compara las 49 declaraciones. No usa alias hacia fuentes del repo para simular consumo público.
- `sourceCommit` y `sourceDirty` son la foto de generación. Si datos y hashes siguen iguales, se conserva esa foto al regenerar: un commit de las propias salidas o ajeno al conocimiento no crea deriva perpetua. Cambiar una fuente relevante cambia sus hashes y obliga a regenerar. La fecha no introduce diffs.

Resultado registrado: doctor correcto; typecheck, generación, pruebas de contrato y comparación/compilación de ejemplos contra el paquete correctos. La verificación final completa queda registrada en la [tarea](../tareas/evolucion-agentes.md). La ficha de herramienta y su índice están en el [cuaderno](../cuaderno/herramienta-conocimiento-agentes.md).

## Límites de la entrega

Las fichas distinguen tipos generados, compilación externa a la generación y recorrido de navegador pendiente. Pasar `agents:check-package` no reescribe las fichas para dar por certificado un consumidor. Los ejemplos de reserva/lista son muestras para rutas distintas; no montan un almacén compartido ni implementan el adaptador de query.

No se añadió `knowledge/` a `dist-npm/`, no se instaló `.tgz`, no hay consumidor visual ni skills y no se midió ahorro de tiempo/tokens. La construcción Next del consumidor verificará también la carga de `next/font` del paquete; el typecheck actual no acredita esa transformación. La documentación local de Next consultada fue `01-app/01-getting-started/05-server-and-client-components.md` y `13-fonts.md` antes de escribir los ejemplos.

Siguiente entrega P2: copiar estas salidas al paquete sin segunda edición, fijar `.tgz` y consumidor limpio, verificar recursos/fuentes y continuar con las rutas/estados acordados. El contraste visual de `salon`, los assets pendientes y el comportamiento sin almacenamiento siguen abiertos, sin promesas de agenda de producción.
