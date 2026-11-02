---
titulo: Mapa interactivo de decisiones de las skills de Trama
fecha: 2026-10-30
tipo: herramienta
estado: hecho
referencias: []
fichas: [docs/57-agentes.md]
ruta: http://127.0.0.1:3450/flujo-decision-skills
codigo: [app/flujo-decision-skills/page.tsx, components/decision-map/decision-map.tsx, components/decision-map/decision-map.module.css, app/globals.css, package.json, public/flujo-decision-skills.html, skills/trama-build/SKILL.md, skills/trama-style/SKILL.md]
colores: [#eeece4, #1d211d, #174f9e, #6848a6, #a63c20]
fuentes: []
sector: []
guia: []
tono: [analítico, transparente]
paleta: [papel mineral, tinta, azul, violeta, naranja]
tipografia: [serif editorial, monoespaciada técnica]
patrones: [grafo React Flow, nodos seleccionables, inspector interactivo, filtro por categoría, selector de escenario, minimapa]
movimiento: [cambios de estado sin animación obligatoria, movimiento reducido respetado]
piezas: []
piezas-nuevas: []
relacionados: [herramienta-skills-trama, herramienta-evaluacion-agentes, demo-rizo-empresa-tecnologica]
---

## Concepto

Un mapa navegable y exhaustivo de las reglas escritas en las cuatro skills de Trama. Expone el activador, la pregunta,
las salidas condicionales, los traspasos entre skills y el bucle de revisión, distinguiendo obligaciones, orientaciones,
elecciones abiertas, traspasos y resultados.

## Qué se midió

Lectura de `trama-research`, `trama-style`, `trama-build` y `trama-kit-evolution` en la instalación revisada. Se
contrastaron las condiciones de alcance, evidencia/fidelidad, contexto y versiones múltiples, assets, técnica reusable,
integraciones simuladas y puertas de calidad con cinco escenarios de navegación.

## Qué se hizo

La versión inicial del diagrama se sustituyó por siete etapas con 22 decisiones seleccionables y sus ramas etiquetadas.
El inspector muestra activador, resultado, responsable y skill fuente; cinco escenarios atenúan las ramas ajenas y cinco
filtros separan el tipo de regla. El flujo se adapta a móvil sin desplazamiento horizontal. La página aclara que la
activación real de skills pertenece al orquestador y que no se está representando telemetría ni razonamiento privado.
La edición también documenta los cambios recientes en `trama-build`/`trama-style` para propuestas múltiples y la
fidelidad de firma en referencias.

## Diferencias con la referencia

No pretende exponer una cadena privada de razonamiento ni simular un router ejecutable. Expone las condiciones escritas
y sus ramales; el orquestador puede cargar skills según la tarea y no hay instrumentación aquí que registre su
selección. Las puertas de contraste, legibilidad, responsive y función se separan de las decisiones visuales.

## Aprendido

Las reglas de compatibilidad y calidad no obligan por sí solas a una estética. La convergencia aparece cuando receta,
guía o esqueleto de landing pasan de recurso a punto de partida automático. Las instrucciones de diversidad y fidelidad
reducen sesgos distintos, pero no garantizan resultados impredecibles: historial, ejemplos y selección del agente siguen
influyendo. Para valorar comportamiento real hace falta instrumentar ejecuciones, no inferirlo del mapa de instrucciones.

## Revisión 2026-10-31

- **Objetivo:** sustituir el mapa incompleto por uno preciso, con más ramas y los límites de lo que se puede afirmar.
- **Decisiones:** agrupar por etapas; mostrar todas las salidas en tarjetas; evitar presentar el escenario resaltado como
  traza observada; indicar skill responsable y fuente; conservar interacción teclado y movimiento reducido.
- **Comprobaciones:** `npm run smoke -- http://127.0.0.1:3450/flujo-decision-skills.html --auditar` (200, sin errores,
  sombras ni interacciones/enlaces rotos); Playwright en 1440 y 390 px (22 decisiones, escenarios/inspector/filtro
  operativos, cero overflow horizontal y errores de página). Captura móvil: `.refs3d/decision-map-390.png`.
- **Siguiente:** si se necesita conocer qué skills se activan realmente en cada sesión, añadir telemetría explícita al
  orquestador y representar esas trazas como una capa separada del modelo de instrucciones.

## Revisión 2026-10-31 · grafo React Flow

- **Objetivo:** dar una vista espacial de las rutas, cruces y retornos del mapa para entender mejor cómo se pasa de una
  decisión a otra.
- **Cambios:** ruta `/flujo-decision-skills` en Next con React Flow; 22 nodos de decisión y 32 conexiones con etiquetas;
  selección de nodos e inspector con ramas completas; escenarios, filtros, zoom, controles y minimapa. La URL anterior
  `.html` redirige a la ruta nueva.
- **Decisiones:** nodos agrupados por siete etapas y colocados manualmente para que los recorridos principales fluyan de
  izquierda a derecha; se conserva la explicación de que las conexiones son modelo documentado y no telemetría.
- **Comprobaciones:** `npm run build` correcto; `npm run smoke -- http://127.0.0.1:3450/flujo-decision-skills --auditar`
  (200, sin errores, sombras ni interacciones/enlaces rotos); Playwright confirma 22 nodos, 32 conexiones, inspector,
  filtros, seis escenarios, redirección antigua y cero overflow horizontal en móvil. `npm run verify` se detiene en
  `catalog:check` por los 39 JSON de agentes ya pendientes; no se regeneraron.
- **Ajuste posterior:** se forzó tinta oscura para botones no seleccionados y lima sobre tinta para los seleccionados;
  revisión visual y valores computados confirmados en navegador.
- **Siguiente:** revisar con usuarios qué ramas deberían ser enlaces directos o qué transiciones documentadas faltan;
  para mostrar decisiones reales, añadir telemetría explícita al orquestador.

## Siguiente

Probar una petición de tres o cuatro versiones con el mismo brief y comprobar que la tesis, estructura e interacción
se separan antes de iterar sobre la elegida.
