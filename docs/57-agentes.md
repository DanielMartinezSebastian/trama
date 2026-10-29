# Trama para agentes

Trama combina componentes con guías visuales y recetas de composición. Este recorrido es un **piloto experimental**,
distribuido en el paquete local de esta rama; las skills no convierten las demos en servicios conectados.

## Instalar la versión que vas a usar

```bash
# Desde el repositorio Trama
npm run pkg:pack

# Desde el proyecto consumidor, con la ruta real al archivo generado
npm i /ruta/a/trama-ui-0.13.0.tgz
npx --no-install trama-ui knowledge
npx --no-install trama-ui skills install --client codex
# Alternativa: --client claude
```

El instalador copia las tres skills a `.agents/skills/` o `.claude/skills/` dentro del proyecto. Una instalación
idéntica es idempotente; un conflicto conserva la adaptación y falla antes de escribir el lote. No modifica `AGENTS.md`,
`CLAUDE.md`, configuración global ni instrucciones del cliente. Usa el binario de tu dependencia, no `latest`.

La consulta pública documentada del 29-10-2026 devolvió `latest` 0.2.0, distinto de 0.13.0 de esta rama. Instalar
sin fijar versión no reproduce este piloto. No se ha publicado el paquete de esta evolución ni verificado el commit
de una web de producción. [Matriz y evidencia](./evolucion-agentes/p0-matriz.md).

## Tres capacidades, un mismo encargo

| Skill | Cuándo aporta | Qué produce |
| --- | --- | --- |
| `trama-build` | Construir o modificar con la dependencia instalada | Composición, estados, integración explícita y validación |
| `trama-style` | Elegir/aplicar/adaptar una guía | Dirección tipográfica, espacial y visual coherente |
| `trama-research` | Interpretar una captura, URL o guía externa relevante | Evidencia, inferencias identificadas y brief construible |

En Codex se pueden invocar como `$trama-build`, `$trama-style` y `$trama-research`; el formato también permite
descubrimiento por descripción. Instalación de archivos, descubrimiento del cliente y calidad del resultado son pruebas
distintas. Consulta la [evidencia de entrega](./evolucion-agentes/entrega-final.md) para saber qué se ensayó realmente.

Una petición reproducible para el consumidor piloto:

> Con Trama de la versión instalada, construye Linde, un salón ficticio de corte y color con la guía salon. Permite
> reservar con datos ficticios, consultar citas locales, cambiar fecha y anular con confirmación. Muestra claramente
> que no hay agenda ni correo conectados. Verifica escritorio, móvil, teclado y movimiento reducido.

## Consultar sin cargar todo el catálogo

`node_modules/trama-ui/knowledge/index.json` selecciona la guía y receta `salon` y sus piezas. Las fichas separan
`playgroundProps` de declaraciones completas de API, incluyen procedencia/versiones y enlazan ejemplos. Es una selección
parcial: otras guías/componentes pueden existir en los exports y el catálogo completo aunque no tengan ficha piloto.

Las fuentes de autoridad siguen siendo tipos/exports, `STYLE_GUIDES` y `RECETAS_SECTOR`. Los JSON/Markdown son salidas
generadas. No edites una ficha para corregir la API: corrige su fuente y ejecuta `npm run catalog`.

## CSS, fuentes y recorrido

Importa `trama-ui/styles.css` una sola vez. Aplica guía con `GuideFrame`, clases `ui-g-*` y la variante compatible de
cada pieza. Para cargar `trama-ui/fonts` en Next.js se ensaya `transpilePackages: ['trama-ui']`; la plantilla del
[consumidor limpio](../examples/agent-pilot/next.config.mjs) fija además su raíz propia. El typecheck solo no prueba
la transformación de fuentes: debe pasar el build y observarse su carga en navegador.

Los ajustes locales de contraste se pasan en `GuideFrame.style` o en una guía adaptada, porque los tokens de la guía
son inline y prevalecen frente a una clase CSS del mismo nodo. No hace falta cambiar la guía global para adaptar un cliente.

`BookingFlow` conserva citas localmente, genera ocupación ficticia y llama `onBooked` después de confirmar. No ofrece
una transacción asíncrona de agenda. El correo se valida pero no se guarda; `AppointmentList` relee al montar y no
sincroniza automáticamente otra instancia viva. El adaptador de página debe validar la query. Sin almacenamiento,
la memoria de una pantalla no acredita persistencia entre rutas.

## Reproducir la comprobación local

```powershell
npm run catalog
npm run verify
npm run pkg:pack
npm run agents:pilot -- .cache/mi-piloto-limpio
# Dentro de ese consumidor: npm run build
# Desde Trama: npx tsx scripts/test-agent-pilot.mts .cache/mi-piloto-limpio
```

El preparador exige una carpeta nueva bajo `.cache/`; no sobrescribe proyectos ni comparte dependencias o `.next`.
El test crea y cierra solo su servidor en un puerto propio, guarda capturas e informe en `.refs3d/agent-pilot/` y recorre
errores, confirmación, calendario, persistencia, cambio, anulación y límites. Revisar las imágenes sigue siendo necesario.
Los SVG del ejemplo son ilustraciones originales, sin fotos o testimonios de clientes reales.

## Qué mostró la evaluación

Una cohorte de 11 ensayos con Codex CLI (tres tareas, documentación actual frente a skills, dos repeticiones; uno no
llegó a ejecutarse por límite de uso del cliente) dio estos resultados. Detalle en la [evaluación P4](./evolucion-agentes/p4-evaluacion.md).

- **Más ensayos correctos**: 6 de 6 con skills y 2 de 5 con la documentación actual. Los fallos fueron contraste con
  los tokens de `salon` y, en uno, un defecto de `Button` desde Server Components, ya corregido.
- **No ahorra**: con skills cada ensayo tardó de media un 46 % más y leyó un 58 % más de tokens. El conocimiento
  extra se paga en lectura.
- **Fuentes**: sin skills, el agente escribió el nombre literal de la familia y el titular cayó a una serif del
  sistema. El catálogo y la ficha de guía explican ahora cómo nombrarlas.

Es una muestra pequeña con un cliente, un modelo no identificado y una guía; no generaliza a otros casos. MCP, registro
o una consulta CLI más fina no se añaden: P4 no mostró que falten, y el coste observado está en leer, no en buscar.
Se reconsiderarán con una segunda cohorte.
