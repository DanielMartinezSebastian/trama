# P0: capacidades, versiones y canales

Revisión del 29 de octubre de 2026, rama `feat/evolucion-agentes`, base `2263365bc6b9485028ae7ce769fcf1fb5ba619ec`. Alcance: fuentes locales y construcción del paquete; consulta de lectura al registro npm público. Sin publicación, despliegue ni cambios de producto. [Contrato y piloto seleccionados](./p1-contrato-piloto.md).

## Cómo interpretar la evidencia

**Hallazgo** significa leído en fuente o ejecutado aquí; se indica cuál. **Recomendación** es una decisión para la siguiente entrega. **Hipótesis** necesita experimento. La evidencia de código acredita implementación, no revisión visual ni funcionamiento completo. El snapshot del estudio se conserva intacto en [su carpeta](../estudios/evolucion-agentes/README.md).

Los [datos de evidencia](./evidencia-p0.json) contienen fecha UTC, conteos, tamaños, versiones instaladas, exports del paquete construido y SHA-256 de fuentes. Son una foto de esta revisión, no otro catálogo mantenido a mano. La [respuesta npm](./npm-registry-p0.json) conserva la consulta original; puede cambiar después de esta fecha.

## Matriz de versión y canal

| Canal | Evidencia y versión | Qué se puede afirmar | Límite / decisión |
| --- | --- | --- | --- |
| Repositorio de este worktree | [`package.json`](../../package.json), HEAD y rama comprobados: 0.13.0, commit base indicado arriba; raíz `private: true` | Código y documentación disponibles localmente | La versión declarada no acredita publicación |
| Paquete generado local | [`scripts/build-package.mts`](../../scripts/build-package.mts), `npm run pkg:build` correcto; `dist-npm/package.json`: 0.13.0, sin `private` | Compilación ESM + declaraciones y exports generados; 706 archivos, 173 componentes en barrel | No se ha instalado un `.tgz` en consumidor limpio; eso corresponde a P2 |
| Registro npm público | `npm view trama-ui version dist-tags versions repository dist.tarball --json --registry=https://registry.npmjs.org`; [respuesta](./npm-registry-p0.json) | `latest` = 0.2.0; versiones enumeradas 0.1.0 y 0.2.0; repositorio declarado coincide con Trama | No hay 0.13.0 en esta respuesta. No se inspeccionó el contenido de 0.2.0. El piloto debe fijar un `.tgz` propio, sin resolver `latest` |
| Consumidor del estudio | [Estudio §2](../estudios/evolucion-agentes/estudio-trama-hibrida-agentes-2026-10.md): 0.12.1 desde `.tgz`; README histórico 0.12.0 | Antecedente documental, distinto de repo y npm actuales | No se dispone de ese consumidor aquí; no se ha vuelto a validar su instalación |
| Web desplegada | [`lib/site-url.ts`](../../lib/site-url.ts): entorno de despliegue o localhost; [`app/layout.tsx`](../../app/layout.tsx) | Se puede auditar el código de la web local | URL de producción y commit servido no identificados. `trama.dev` es un ejemplo documental; no se atribuye a un despliegue verificado |
| Copia del kit | [`scripts/kit-export.mts`](../../scripts/kit-export.mts), [`scripts/kit-pull.mts`](../../scripts/kit-pull.mts), [`scripts/kit-lib.mts`](../../scripts/kit-lib.mts) | Existen exportación selectiva y manifiesto de procedencia; retorno revisable | Inspección estática; no se exportó hacia otros directorios ni se equipara copia a paquete instalado |

## Matriz de capacidades y diferencias con el estudio

| Capacidad / afirmación del estudio | Fuente de autoridad y evidencia local | Canal real y conclusión |
| --- | --- | --- |
| 187 entradas, 14 categorías, 9 variantes, 8 landings, 34 webs | [`docs/catalog.json`](../catalog.json), [`scripts/build-catalog.mts`](../../scripts/build-catalog.mts); conteo por Node y `catalog:check` | **Confirmado** en repo; son entradas/referencias, no 187 APIs certificadas. 190 TSX directos no es el mismo indicador; barrel excluye 17 componentes con peers opcionales y contiene 173 |
| 19 guías y 18 inspiraciones | [`STYLE_GUIDES`](../../lib/ui/guides.ts), [`registro`](../../components/inspiraciones/registro.ts), documentación [54](../54-guias-de-estilo-del-repo.md) y [55](../55-inspiraciones.md) | Implementaciones/registro en repo. No se recorrieron visualmente las 19/18. Las inspiraciones son referencias del sitio, no plantillas incluidas en npm |
| Recetas por sector | [`RECETAS_SECTOR`](../../lib/catalog/sectores.ts): 8; generador valida guía, piezas, webs e inspiraciones | El Markdown incluye recetas; el JSON actual **no** incluye guías ni recetas (sus claves están comprobadas). P1 debe derivarlas desde las fuentes TS existentes |
| Conocimiento de diseño ejecutable | [`GuideFrame`](../../components/ui/GuideFrame.tsx), [`guides.ts`](../../lib/ui/guides.ts), [`ui-guides.css`](../../components/ui/styles/ui-guides.css) | El paquete **sí** exporta `STYLE_GUIDES`, `guide`, `guideToStyle` y tipos por raíz; `GuideFrame` por raíz/subruta. Falta ficha selectiva, no faltan todos los datos de guías |
| Tokens, variantes e intenciones | [`tokens.ts`](../../lib/ui/tokens.ts), [`variants.ts`](../../components/ui/variants.ts), [`intent.ts`](../../components/ui/intent.ts) | 9 variantes reales, incluida `editorial`; 6 intenciones. No todas las piezas admiten todas las combinaciones; verificar su tipo, no extrapolar desde el vocabulario global |
| Contrato de props insuficiente para agentes | [`PropSpec`](../../lib/catalog/schema.ts) y `propOut` del generador frente a [`BookingFlowProps`](../../components/ui/BookingFlow.tsx) | **Confirmado**: controles escalares no describen `services`, `staff` o `onBooked` completos. Declaraciones generadas contienen objetos y callbacks; P1 debe enlazar tipos públicos en vez de llamar firma al listado de controles |
| Conocimiento distribuido incompleto | Lista `files`, copias y exports de [`build-package`](../../scripts/build-package.mts); inspección de `dist-npm` | Se incluye `CATALOG.md` con imports reescritos a `trama-ui/X`, CSS, CLI y recursos pixel. No se copian `docs/catalog.json`, hojas dedicadas, skills ni fuentes de demos. No hay export público `trama-ui/guides` ni `trama-ui/lib/commerce/booking` |
| Fuentes y assets | [`fonts.ts`](../../lib/ui/fonts.ts), [`kit-lib`](../../scripts/kit-lib.mts), [docs de recursos](../README.md) | `trama-ui/fonts` usa `next/font/google`; no prueba soporte React genérico. Fotos de demos y modelos/vídeos no viajan por esa copia. Las fuentes Fontshare son nombres y fallback, no archivos redistribuidos |
| Reservas y estados | [`BookingFlow`](../../components/ui/BookingFlow.tsx), [`AppointmentList`](../../components/ui/AppointmentList.tsx), [`booking.ts`](../../lib/commerce/booking.ts) | Guarda localmente; slots incluyen ocupación ficticia (`busy=0.25`), no disponibilidad real. Valida correo pero `Appointment` no lo guarda ni lo entrega al callback. `onBooked` ocurre **después** de guardar y fijar confirmación; no es una transacción asíncrona ni certifica una integración de agenda |
| Web de referencia como receta ejecutable | [`Hebra Site`](../../components/sites/hebra/Site.tsx) frente a `BookingFlow` | Hebra tiene estado/CSS/routing propios y tokens distintos de la guía `salon`; no usa `BookingFlow`. Sirve para inspeccionar estructura e intención, no como prueba de consumo del componente o de aplicación exacta de la guía |
| CLI selectiva y skills | [`trama-cli.mjs`](../../scripts/trama-cli.mjs); búsqueda `rg --files -g SKILL.md` excluyendo dependencias/salidas | Solo `assets` y `catalog`; este último imprime una ruta (comprobado en paquete generado). Sin skills en fuentes. `search`, `info`, instalación de skills y MCP siguen siendo propuestas |
| Investigación y comprobaciones | [`probe-refs.mts`](../../scripts/probe-refs.mts), [`scripts/cine`](../../scripts/cine), [`smoke.mts`](../../scripts/smoke.mts), [`package.json`](../../package.json) | Herramientas internas del repo; no están en la CLI de consumo. `doctor` y `verify` aprobados aquí; no se ejecutó estudio visual/cine nuevo ni importación automática de imágenes, webs o tokens |
| Tamaños y ahorro | Node sobre `docs/CATALOG.md` y `catalog.json`: 229.396 y 621.170 bytes; componentes compactos 323.382 bytes | Coinciden con estudio. No se volvió a medir la selección de 12 (no se fijan aquí sus IDs). Bytes no son tokens ni ahorro de ejecución; cifras de vueltas/tiempos del modelo siguen siendo hipótesis o antecedentes |

## Afirmaciones públicas que requieren corrección

| Archivo | Texto observado | Acción recomendada |
| --- | --- | --- |
| [`README.md`](../../README.md) | 72 componentes, siete estilos; npm «cuando esté publicada» | Derivar cifras del catálogo; explicar por versión que npm público existe, pero no entrega 0.13.0 en esta consulta |
| [`scripts/package-README.md`](../../scripts/package-README.md) | Siete estilos e instalación npm sin fijar versión | Evitar que el README del paquete generado prometa el inventario del repo para el `latest` público |
| [`HomePage.tsx`](../../components/site/HomePage.tsx) | Ocho estilos y contadores literales | Usar fuente común; conservar distinción entre entradas, archivos y exports |
| [`build-package.mts`](../../scripts/build-package.mts) | Descripción del paquete generado: ocho estilos | Generar o retirar esa cifra; raíz también mantiene posicionamiento retro |
| [`app/layout.tsx`](../../app/layout.tsx) | Metadata centrada en ASCII/textmode/pixel/landings | Ampliación editorial es recomendación de producto, no error numérico; decidir tras caso reproducible |
| [`AGENTS.md`](../../AGENTS.md) | Lista de ocho variantes; ruta `node_modules/trama/CATALOG.md` | Ruta del paquete es `node_modules/trama-ui/CATALOG.md` (CLI devuelve su ruta absoluta); incluir `editorial` si se actualiza la enumeración |
| [`docs/README.md`](../README.md) | «Sin pruebas visuales automatizadas» | Matizar: existe smoke automático, pero no certifica interacción ni fidelidad. No llamar a `verify` validación visual |

Esta entrega documenta las discrepancias; no cambia portada, metadata, instrucciones compartidas ni generadores. Evita mezclar la corrección de cifras con el posicionamiento propuesto y con promesas de skills aún no probadas.

## Decisiones y pendientes

- **Seleccionado:** guía y receta `salon`, recorrido de reserva con `BookingFlow` y consulta/cambio/anulación con `AppointmentList`; [brief y contrato](./p1-contrato-piloto.md).
- **Adoptado para P1:** generación selectiva desde fuentes actuales y declaraciones públicas; procedencia y límites explícitos. No duplicar paletas, secciones o firmas en otra base editorial.
- **Pospuesto:** CLI nueva, MCP, soporte universal de clientes/frameworks, rediseño público y servicio de reservas. No son dependencias del contrato.
- **Pendiente de validar:** consumo limpio de `.tgz`, contraste y aplicación visual de `salon`, navegación/estado entre rutas, descubrimiento de skills y beneficio respecto a documentación actual. La elección del piloto no acredita estos resultados.

## Comprobaciones de esta revisión

`npm run doctor`, `npm run verify` y `npm run pkg:build`: correctos. `verify` cubre tipos, catálogo, sombras, pruebas de origen de cine e índice del cuaderno (40 fichas). Avisos: referencias/assets locales ausentes y deprecación de Three.js, sin fallo. `node dist-npm/bin/trama-ui.mjs catalog` devuelve el Markdown generado. Sin cambios Next.js, CSS o rutas; no procede build del sitio ni smoke en esta entrega documental. `dist-npm/` es salida local ignorada y regenerable, no evidencia de instalación en un consumidor.
