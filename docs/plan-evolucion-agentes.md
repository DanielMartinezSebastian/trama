# Plan de aplicación: evolución de Trama para agentes

Fecha: 29 de octubre de 2026. Estado: P0–P6 cerrados; un ensayo de P4 pendiente de cuota del cliente. Resumen en la
[entrega final](./evolucion-agentes/entrega-final.md).

## Objetivo y base

Hacer que un consumidor pueda descubrir y aplicar componentes, guías y recetas de su versión de Trama, interpretar referencias cuando lo necesite y comprobar el resultado. Mantener el consumo convencional del paquete y aprovechar las fuentes generadas existentes.

Base: `2263365bc6b9485028ae7ce769fcf1fb5ba619ec`, versión declarada 0.13.0. Worktree: `C:/COMPARTIDO/trama-evolucion-agentes`. Rama: `feat/evolucion-agentes`.

La [carpeta del estudio](./estudios/evolucion-agentes/README.md) conserva los documentos de producto, investigación y coste en que se apoya este plan. El [registro de tarea](./tareas/evolucion-agentes.md) recoge comprobaciones y continuidad. No hay servidor iniciado ni URL de trabajo asignada todavía.

## Entregas y criterios de aceptación

| Entrega | Trabajo y archivos principales | Criterio de aceptación |
| --- | --- | --- |
| P0. Línea base | Contrastar `README.md`, `package.json`, `docs/README.md`, `docs/catalog.json`, `scripts/build-package.mts`, `scripts/trama-cli.mjs`, `components/site/HomePage.tsx` y `app/layout.tsx` | Matriz de capacidad, versión, canal y evidencia; diferencias identificadas. Diagnóstico y verificaciones iniciales registrados |
| P1. Contrato mínimo | Ampliar generación a partir de `lib/catalog/schema.ts`, `scripts/build-catalog.mts`, `lib/ui/guides.ts` y `lib/catalog/sectores.ts`; contrastar exports en `scripts/build-package.mts` | Índice breve y fichas de una receta, una guía y sus piezas; imports públicos verificables, procedencia, versiones e integraciones pendientes. Sin duplicar manualmente el catálogo completo |
| P2. Distribución piloto | Incluir referencias mínimas en el paquete desde `scripts/build-package.mts`; decidir ubicación interna e instalación explícita por proyecto | `.tgz` consumible en proyecto limpio, con CSS, fuentes y conocimiento compatible; ejemplos utilizables sin acceso al repo. Código del kit sin imports desde demos o catálogo |
| P3. Construcción y estilo | Crear las skills piloto `trama-build` y `trama-style` sobre P1/P2; una fuente común y adaptadores de instalación según el cliente | Descubrimiento y lectura comprobados en los entornos ensayados; composición con API real y dirección visual coherente. Sin prometer soporte de clientes no probados |
| P3b. Investigación | Preparar `trama-research`, expediente y brief con observado/inferido/decidido; reutilizar `scripts/probe-refs.mts` donde encaje | Captura, URL y guía externa producen briefs trazables; al menos un caso llega a construcción y validación; vacíos y sustituciones explícitos |
| P4. Evaluación | Comparar documentación actual y piloto usando los objetivos y registro del estudio de costes | Tres tareas ordinarias × dos condiciones × dos repeticiones; registrar también fallos. Tiempo, tokens disponibles, vueltas, calidad y evidencia hasta cumplir. Movimiento avanzado en lote separado |
| P5. Comunicación | Ajustar descripción, cifras y recorridos de web/documentación según lo comprobado | Promesas respaldadas por versión/canal y un caso reproducible. No presentar capacidades experimentales como validadas |
| P6. Consulta y extensiones | Añadir búsqueda/consulta CLI si P4 detecta utilidad; valorar MCP o registro después | Reducción observada de búsqueda/contexto sin degradar resultados; compartir contrato de datos y resolver desde la versión del consumidor |

La corrección de afirmaciones objetivamente desactualizadas puede empezar en P0. El rediseño visual amplio, las integraciones externas y la infraestructura adicional requieren concretar su necesidad mediante el piloto. Los nombres P0–P6 son entregas de este plan, no scripts ni comandos existentes.

## Primera unidad de implementación

1. Ejecutar y registrar la línea base del worktree, sin copiar dependencias o salidas de otros trabajos.
2. Selección realizada: receta y guía `salon`; encargo F6 y recorrido de reserva local con `BookingFlow`/`AppointmentList`. Motivos, alternativas y límites en el [contrato piloto](./evolucion-agentes/p1-contrato-piloto.md).
3. Contrato mínimo, generación y fixtures implementados; [detalle de P1](./evolucion-agentes/p1-implementacion.md). Fijar el copy restante y assets antes de medir. Separar interfaz simulada de servicios conectados.
4. Conservar la condición de documentación actual y preparar la condición piloto de forma reproducible, fijando paquete, modelo/configuración y herramientas. No comparar ejecuciones con exigencias distintas.
5. Empaquetar y comprobar en un consumidor limpio antes de generalizar a las restantes guías, recetas o frameworks.

La primera decisión técnica a resolver es qué información ya puede generarse con los metadatos actuales y qué necesita extraerse de tipos públicos. `PropSpec` describe controles del visor y no debe presentarse como firma completa de la API.

## Validación por impacto

- Entorno: `npm ci`, `npm run doctor` y `npm run verify` como base exigida por `AGENTS.md`. En worktrees nuevos, ejecutar `npx next typegen` antes del primer typecheck para disponer de los tipos de rutas.
- Contrato/generación: catálogo actualizado conscientemente, identificadores y referencias consistentes, ejemplos contra exports y tipos públicos.
- Paquete: construcción y consumo del `.tgz` con dependencias propias; comprobar rutas, CSS y fuentes.
- Interfaz: servidor y puerto propios; `smoke`, inspección visual, móvil, teclado, estados y movimiento reducido según el cambio.
- Rutas o CSS: build con el dev de este worktree parado. No detener servidores ajenos.
- Ejercicios del laboratorio: ficha e índice de cuaderno según `docs/53-cuaderno-del-laboratorio.md` cuando se ejecuten; esta preparación documental no constituye todavía un ejercicio visual.

Antes de escribir código Next.js, leer la guía pertinente en `node_modules/next/dist/docs/`, como exige `AGENTS.md`. No es necesario arrancar dev para preparar el plan documental.

## Decisiones y límites

Mantener Trama y priorizar referencias versionadas junto al paquete. Empezar por instalación local por proyecto, sin sobrescribir instrucciones del consumidor. No desplegar, publicar paquetes ni cambiar otros worktrees como parte de esta preparación.

Las tres skills representan capacidades y pueden ejecutarse con un solo agente. Los rangos V0–V3 y F1–F8 del estudio son hipótesis para medir, sin convertirlos en presupuestos certificados o límites de calidad. Los datos de tokens ausentes se registran como no disponibles.

## Estado tras P0 y P1

La [matriz de P0](./evolucion-agentes/p0-matriz.md) contrasta código, catálogo, tipos, exports y canales con el estudio. Sus [datos de evidencia](./evolucion-agentes/evidencia-p0.json) y [respuesta del registro público](./evolucion-agentes/npm-registry-p0.json) fijan procedencia: npm devuelve `latest` 0.2.0, distinto de 0.13.0 local y 0.12.1 del consumidor histórico. Se construyó el paquete local, sin instalarlo en otro proyecto ni publicar. El commit desplegado de la web sigue sin identificar.

El [contrato mínimo de P1](./evolucion-agentes/p1-contrato-piloto.md) define fuentes, salidas selectivas, campos, ejemplos y aceptación. La selección `salon` permite probar una dirección clara y un flujo con estados sin servicios externos. La guía existe como API pública; faltan fichas selectivas. `onBooked` no constituye una transacción de agenda y los tipos de comercio no están exportados por raíz. Estos límites condicionan el piloto.

En P0 pasaron doctor, `verify` y `pkg:build`, sin cambios de producto. La continuación P1 amplía el generador, comparte exports con el empaquetador y genera [índice y fichas](./agents/README.md) con declaraciones completas y tres fixtures. Corrige dos controles de muestra de GuideFrame indebidamente presentados como props. No modifica componentes del kit, rutas ni CSS. Comprobaciones y límites en la [implementación P1](./evolucion-agentes/p1-implementacion.md) y el registro de tarea. Próximo paso: P2, distribución y consumidor limpio; P3–P6 e hipótesis de ahorro siguen pendientes.

## Estado tras P2–P6

P2–P3b, descritos en el registro de tarea, distribuyen conocimiento y skills en el `.tgz` y los prueban en un consumidor
limpio y en dos clientes. La [evaluación P4](./evolucion-agentes/p4-evaluacion.md) da 6/6 con skills frente a 2/5 con
la documentación actual, con más tiempo y tokens; destapó un defecto de `Button` en Server Components (corregido) y
dos huecos del catálogo (contraste de guías y nombre de fuentes), cubiertos en el generador. P5 alinea web y
documentación con esas cifras y sus límites. P6 decide no añadir MCP, registro ni consulta CLI por ahora.

La [segunda cohorte](./evolucion-agentes/p4b-evaluacion-claude.md), con Claude Code y una condición de catálogo
actualizado, confirma la ventaja de las skills (5/6 frente a 4/6) con menor sobrecoste (+20 % de entrada) y sitúa
todos los fallos restantes en el contraste de la reserva. Las fichas cubren ya las 19 guías.
