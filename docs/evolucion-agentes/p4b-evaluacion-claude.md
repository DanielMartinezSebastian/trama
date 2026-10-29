# P4b. Segunda cohorte: Claude Code y documentación actualizada

Fecha: 29 de octubre de 2026. Mismas tres tareas y la misma adjudicación que [P4](./p4-evaluacion.md), con otro
cliente y una tercera condición. 18 ensayos, todos ejecutados. Datos en
[evaluacion-claude-evidencia.json](./evaluacion-claude-evidencia.json); artefactos en `.cache/agent-evaluation-claude/`
y `.cache/agent-evaluation-claude-v3/`.

## Diseño

- **Cliente**: Claude Code 2.1.302 con `claude -p`, modelo fijado a Opus 5.5, salida JSON con esquema. Herramientas
  Read, Glob y Grep (+ Skill con skills), sin MCP ni ajustes de usuario. Los ensayos corren en una carpeta temporal
  fuera del repo: Claude Code sube buscando `CLAUDE.md` y habría leído las instrucciones de Trama. Una sonda previa
  confirmó que no carga ningún `CLAUDE.md` y sí ve las skills del proyecto (`--restricted` las ocultaba; se descartó).
- **Condiciones**: `current_documentation` (CATALOG de la base, como en P4), `updated_documentation` (CATALOG actual,
  con la nota de fuentes y contraste, sin `knowledge/` ni skills) y `proposed_skills` (paquete con conocimiento de las
  19 guías y skills). Paquete `ea7c7d08…`, que ya incluye el arreglo de `Button`.
- **Incidencia**: 7 ensayos de la segunda repetición chocaron con el límite de sesión del cliente sin llegar a
  empezar. Se apartaron (`.cache/agent-evaluation-claude-sin-cuota/`) y se repitieron tras el reinicio. El
  validador los reconoce ahora como `not-run-infrastructure`, igual que el límite de Codex.

## Resultados

| Condición | Pasan | Generación | Entrada (sin caché) | Salida | Turnos | Coste |
| --- | --- | --- | --- | --- | --- | --- |
| Documentación de la base | 4/6 | 77 s | 432 k (54 k) | 8,3 k | 21 | 0,67 $ |
| Documentación actualizada | 4/6 | 73 s | 352 k (50 k) | 7,9 k | 19 | 0,62 $ |
| Skills | 5/6 | 88 s | 517 k (65 k) | 9,4 k | 20 | 0,80 $ |

Por tarea: composición y referencia pasan en las tres condiciones (12/12). Todos los fallos son de reserva:
documentación 0/2 en ambas variantes, skills 1/2.

Causas de los fallos de reserva:

- Contraste con los tokens de `salon` en textos internos de `BookingFlow` (duraciones, notas, etiqueta «Tu cita»).
  Cuatro de los seis ensayos con documentación no ajustan el tema en esta tarea, aunque sí lo hicieron en composición;
  uno de skills oscurece `--mut` pero deja el `--acc` que usa la etiqueta.
- Dos ensayos con documentación importaron `BookingService`/`BookingStaff` desde `trama-ui/BookingFlow` o desde la
  raíz, donde no estaban exportados. Ahora lo están. Repetida la adjudicación con el paquete `769cb1a5…`, los dos
  compilan y caen después por contraste: el recuento no cambia, pero el fallo pasa a ser del agente, no del paquete.

Ajuste del validador: la palabra gigante de fondo de `SectionHeader` (`aria-hidden`, 1,22:1) hacía fallar dos
ensayos con skills. WCAG 1.4.3 exime la decoración pura, así que esos nodos se anotan como ignorados y no cuentan.

Revisión visual (por el agente evaluador): sin fuentes de sistema en ninguna condición; Opus nombra las fuentes por
variable o hereda las clases `ui-g-*` incluso con la documentación de la base. Defecto no detectado por la
validación: en `composition-pilot-1` la palabra decorativa «servicios» queda detrás del subtítulo y estorba la lectura.
Corregido después de la evaluación: la palabra tiene una franja recortada propia sobre el texto, sin cambiar la API.
Las capturas y cifras de esta cohorte conservan el paquete evaluado; [ficha del arreglo](../cuaderno/pieza-section-header-legible.md).

## Lectura junto a P4

| | Codex (P4) | Claude Code (P4b) |
| --- | --- | --- |
| Documentación de la base | 2/6 | 4/6 |
| Documentación actualizada | — | 4/6 |
| Skills | 6/6 | 5/6 |
| Sobrecoste de las skills (entrada) | +64 % | +20 % (+47 % frente a la actualizada) |

- Las skills ganan con ambos clientes, pero la ventaja depende mucho del modelo: con Opus la documentación ya
  resuelve composición y referencia.
- Mejorar el catálogo abarata sin perder acierto (4/6 con un 19 % menos de entrada), pero no arregla la reserva.
- El fallo que se repite en los dos clientes es el contraste de los tokens medidos de `salon` dentro de piezas del kit.
  Es más barato corregirlo en el kit que esperar que cada agente lo recuerde.

## Propuesta para el kit y aplicación posterior

Que `GuideFrame` ofrezca una opción para subir automáticamente `--mut` y `--acc` hasta 4,5:1 sobre `--bg` cuando
se usen como texto, conservando los valores medidos para lo decorativo. Toca la fidelidad de guías medidas en webs
reales, así que es una decisión del producto.

Aprobada expresamente por el usuario el 29 de octubre de 2026 e implementada como `GuideFrame textContrast`
(por defecto `false`). Publica `--mut-text`/`--acc-text` a 4,5:1 sobre `--bg` para los textos del kit y conserva
los tokens decorativos y `lib/ui/guides.ts`. Véanse los límites en la [ficha del cuaderno](../cuaderno/pieza-guide-frame-contraste.md).
Una copia de `booking-docs-2` con solo ese opt-in pasa la adjudicación completa con el paquete nuevo en un consumidor
limpio. Es una regresión posterior al estudio; las cifras y fuentes históricas de las dos cohortes se conservan.
