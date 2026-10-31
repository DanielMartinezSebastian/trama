# P5 · Fidelidad WebGL y variedad de direcciones

**Fecha:** 31 de octubre de 2026  
**Rama/worktree:** `feat/evolucion-agentes`, `C:/COMPARTIDO/trama-evolucion-agentes`  
**Paquete fijo:** `trama-ui@0.13.0`, tarball local SHA-256 `f542c814490041599cb53cb43087e325bb0d714db692faaa9182d49c933f7ae6`  
**Cliente:** Codex CLI 0.165.0; una generación por tarea y condición.

## Protocolo

Comparación emparejada entre la documentación actual del paquete y el mismo paquete con las skills propuestas instaladas. Referencia WebGL: `.refs3d/research-igloo-inc/desktop/pantallas/00.jpg` (Igloo Inc.). Encargos: reinterpretar esa firma con escena 3D propia y tres capítulos; generar tres direcciones de homepage distintas para la misma empresa. La suite pide HTML legible, controles y render responsive. El consumidor y sus dependencias son iguales para ambas condiciones. No se hicieron llamadas de red ni se modificaron otros worktrees.

La cohorte final es exploratoria: solo Codex, una repetición por combinación (cuatro entregas). Se interrumpió la segunda repetición para contener el tiempo de generación; sus entregas y capturas se conservaron en `.cache/agent-evaluation-signature-codex-v2/`. El intento anterior con un contrato impreciso se conservó por separado en `.cache/agent-evaluation-signature-codex/` y no se contó.

## Resultado observado

| Encargo | Documentación actual | Skills propuestas |
|---|---|---|
| WebGL | React Three Fiber y geometría procedural reales; objeto estratificado y tres actos. Falla axe en el tercer acto: texto blanco sobre gris, contraste 1,66:1. | R3F/Three reales, pieza procedural de placas, cámara y partículas; controles cambian tres actos con transformaciones visibles. Canvas GL válido; contraste automatizado y móvil pasan. |
| Tres direcciones | Expediente editorial, campo oscuro interactivo para campaña y configurador/brief. Estructura, tipografía, navegación y acción cambian entre ellas. | Flujo de producto y diagrama, escena de feria/campaña y carta editorial con formulario de brief. Diferencias estructurales claras y controles/móvil pasan. |

En la muestra de skills, Codex consultó las skills `build`, `style` y `research`, el índice y el atlas local de firmas cinemáticas. Para WebGL eligió Canvas directo con R3F, en vez de un componente retro, y produjo movimiento de cámara/geometría que responde al scroll y al puntero. La revisión visual de capturas desktop y móvil confirma legibilidad, composición diferenciada y capítulos navegables.

## Límites e interpretación

La prueba demuestra que las skills contienen referencias accionables y que el agente las usó; en esta muestra, la condición con skills resolvió mejor contraste y el recorrido WebGL. No demuestra causalidad general: n=1 por combinación, solo Codex y el encargo de variedad pide explícitamente propuestas distintas. La condición solo-documentación también produjo tres direcciones distinguibles. Repetir con otra solicitud menos guiada y varias generaciones, y con Claude, antes de concluir que se corrigió la tendencia a reutilizar un mismo estilo.

El evaluador se ajustó durante la ejecución: contar varios `<h2>` rechazaba correctamente el marcado real de un resultado con un solo `h1` dinámico; se sustituyó por comprobar los tres controles de capítulo y recorrer cada uno. Las capturas por capítulo se guardan como `desktop-chapter-1..3.png`; las variantes como `desktop-direction-1..3.png` y `mobile-direction-1..3.png`. El WebGL solo-docs sigue fallando por contraste y queda como ejemplo reproducible de un error que debe señalarse.

## Comprobaciones

- `npm run agents:test`: pasa (suites, resumen de cohortes y contrato del piloto).
- `npm run agents:validate-evaluation -- .cache/agent-evaluation-signature-codex-v2 .cache/agent-pilot-signature`: build del consumidor correcto; skills: las dos tareas pasan; docs: direcciones pasan y WebGL falla contraste 1,66:1.
- Revisión visual manual de las ocho capturas de las variantes de homepage en desktop y móvil, y de los tres estados de la escena WebGL con skills.

## Siguiente paso

Hacer una segunda prueba con un encargo menos prescriptivo que el de esta suite, capturar la distancia entre direcciones con una rúbrica fija y repetir al menos con Codex y Claude. No editar las skills a partir de este n pequeño sin confirmar el patrón.
