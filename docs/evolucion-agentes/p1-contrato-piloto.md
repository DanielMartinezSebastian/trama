# Piloto seleccionado y contrato mínimo de P1

Decisión de trabajo del 29 de octubre de 2026, derivada de [P0](./p0-matriz.md). **Contrato documental para implementar**, no esquema, generador, skill o consumidor ya existentes. Paquete objetivo: `trama-ui@0.13.0` construido desde esta rama; no el `latest` público. El contrato se limita a una guía, una receta y sus piezas antes de generalizar.

Actualización posterior: la [implementación de P1](./p1-implementacion.md) concreta este contrato y documenta las comprobaciones. Las frases sobre salidas propuestas reflejan el momento de esta decisión; ya se genera `docs/agents/`, mientras `knowledge/` en el paquete y el consumidor siguen pendientes de P2.

## Selección y justificación

Guía **`salon` — Salón editorial claro**, receta **`salon` — Peluquería y color, estética**. Fuentes: [`lib/ui/guides.ts`](../../lib/ui/guides.ts), [`lib/catalog/sectores.ts`](../../lib/catalog/sectores.ts). Flujo de encargo **F6**, sin referencias externas iniciales; flujo de producto **elegir servicio y profesional → reservar → consultar, cambiar o anular cita local**. Nivel funcional objetivo V1 del estudio, sin adoptar sus rangos de vueltas como criterio de éxito.

La guía fuerza una dirección clara, editorial y tipográfica fuera del sesgo retro de la comunicación actual. Sus fuentes principales, Cormorant Garamond y Manrope, están declaradas en `lib/ui/fonts.ts`; no necesita Fontshare ni WebGL. La receta ya une guía, estructura y referencias, y sus piezas existen en catálogo. El recorrido admite objetos, callbacks, query y persistencia: detecta fallos que una landing estática ocultaría. Al ser local permite separar capacidades disponibles de servicios pendientes.

Alternativas consideradas: `boutique` tiene menos secciones, pero clases/cuenta añaden contratos de identidad y plazas; `escuela` introduce catálogo con filtros y varias fichas antes de estabilizar la distribución; `marca` exige objeto/recursos y compra externa; `barberia` también sirve para reservas, pero `salon` permite comprobar mejor la dirección clara y el límite entre acento pastel y texto legible. Estas son razones de alcance, no una clasificación de calidad de las recetas.

Hebra y matiz/nura/melena se conservan como referencias de estructura de la receta. No se copiarán su estado, rutas internas, CSS o fotos como si vinieran en npm. Hebra no prueba el uso de `GuideFrame guide="salon"` ni de `BookingFlow` (véase P0).

## Fuentes y derivación

| Información | Autoridad | Regla de P1 |
| --- | --- | --- |
| IDs, descripción, categorías, notas y controles | `lib/catalog/catalog.ts`, `entries/*`, `schema.ts` | Reutilizar `build-catalog.mts`; controles identificados como `playgroundProps`, nunca como API completa |
| Valores y reglas visuales | `STYLE_GUIDES`, `StyleGuide`, `guideToStyle`, CSS `ui-g-*` | Serializar la guía seleccionada y enlazar clases/aplicación; no mantener otra paleta o escala |
| Orden, CTA, advertencias y referencias sectoriales | `RECETAS_SECTOR`, `RecetaSector` | Conservar IDs y orden; resolver nombres de piezas a IDs del catálogo |
| Imports y disponibilidad | Exports de `dist-npm/package.json` y barrel generado por `build-package.mts` | Verificar destino y export concreto; un wildcard no acredita que exista cualquier módulo |
| Firma y tipos relacionados | TS de componente + `.d.ts` generado | Enlazar declaración pública por subruta y preservar su cierre de tipos; no transcribir firmas desde los controles |
| Integraciones, ejemplos y recorrido piloto | Anotaciones junto a la fuente que gobierna cada dato y fixture de ejemplo tipado | Añadir solo lo que no existe; evitar un mapa paralelo de componentes/guías/recetas. El brief del ejercicio puede vivir aquí, sin gobernar la API |

Para metadatos nuevos: anotaciones de componente en su entrada de catálogo; requisitos visuales en su guía; flujo e integraciones sectoriales en la receta. Extender sus tipos solo por campos usados por el piloto. Las dependencias de ejecución se obtienen del cierre de imports y manifiesto; recursos por URL requieren declaración explícita. Que la documentación consulte el catálogo no autoriza al kit a importarlo.

## Salidas mínimas acordadas

Ubicación propuesta dentro del paquete: `knowledge/`, reservada para P1/P2; **hoy no existe**. P1 genera en `docs/agents/` con el mismo árbol y P2 la copia al paquete, sin edición manual intermedia. JSON es el contrato; Markdown de lectura es derivado del mismo objeto, no una segunda fuente. No se añade CLI ni export de módulo JS para leerlo en P1.

| Archivo propuesto | Contenido obligatorio |
| --- | --- |
| `index.json` + `README.md` | Cabecera de versión y alcance `pilot`; enlaces relativos a guía, receta y piezas incluidas, ID/tipo/nombre/una frase por entrada. Resumen de exclusiones y cómo abrir una ficha. Sin props ni valores visuales completos |
| `guides/salon.json` + `.md` | Datos de `StyleGuide` completos; variante sugerida, `GuideFrame`/clases, carga de fuentes, límites de assets, procedencia y ejemplos |
| `recipes/salon.json` + `.md` | Campos de `RecetaSector`, secciones con IDs resueltos, enlaces a fichas, páginas/estados del piloto y capacidades simuladas, adaptadas o ausentes |
| `components/<id>.json` + `.md` | Identidad, descripción, imports públicos, `playgroundProps`, referencia de declaraciones completas, notas, requisitos, ejemplos y límites de integración |

Cobertura: todas las piezas nombradas por la receta `salon`, más `ActionBar` (CTA), `GuideFrame`, `BookingFlow` y `AppointmentList`; se deduplican y resuelven automáticamente desde la receta/catálogo. Las dependencias internas (por ejemplo `DatePicker`, `Stepper`, `TextField`, `Button`) siguen el cierre del paquete y sus tipos: la ficha indica su relación; no se finge que cada una sea una selección explícita del encargo. Cada referencia del índice debe tener ficha y cada componente usado en ejemplos debe tener import resoluble. El índice declara esta selección, sin presentarse como inventario completo de Trama.

Cabecera común de cada salida:

| Campo | Regla mínima |
| --- | --- |
| `schemaVersion` | `1` para este contrato piloto; cambios incompatibles requieren otra versión |
| `packageName`, `packageVersion` | Leídos de `package.json`; compatibilidad exacta durante el piloto |
| `sourceCommit`, `sourceDirty` | Git HEAD y presencia de cambios respecto a HEAD; no atribuir fuentes modificadas solo al commit base |
| `sources` | Ruta de cada fuente y SHA-256 de sus bytes; incluir generador y fuentes de tipos/exports usadas. Sin rutas absolutas del desarrollador |
| `kind`, `id`, `status` | `index/component/guide/recipe`; ID existente; `status: pilot` indica madurez del conocimiento, no estabilidad global del código |
| `requirements`, `examples`, `limitations` | Listas explícitas, admiten vacío; no inferir soporte de framework/cliente no ensayado |

No se inventa `introducedIn` o `deprecatedIn` sin historia comprobada. Si una pieza fuente ya tiene `@deprecated`, preservar su aviso. La cabecera distingue «tipo/import resuelto», «ejemplo compilado» y «recorrido validado» mediante evidencias de comprobación, sin convertir `status: pilot` en certificación funcional. Para reproducibilidad se ordenan claves/listas sin orden semántico; se preserva orden de secciones. La fecha de generación no debe provocar deriva en `--check`.

Cada ejemplo lleva ID, código, requisitos, ruta de fixture y evidencia de compilación o estado pendiente. Los fixtures se almacenan una sola vez y el generador los incorpora. Las declaraciones transitivas pueden referenciar rutas relativas internas del paquete; esas rutas no se recomiendan como imports al consumidor. Se usa `ComponentProps<typeof BookingFlow>` para derivar `services`/`staff` y `Parameters<NonNullable<...['onBooked']>>[0]` si hace falta el tipo de cita: `BookingService`, `BookingStaff` y `Appointment` no se exportan hoy por raíz ni por subruta de comercio. `BookingFlowProps` sí está exportado por `trama-ui/BookingFlow`; no asumir export de raíz.

## Encargo fijo para el futuro consumidor

Construir **Linde, salón de corte y color ficticio**, en Next.js App Router/React/TypeScript con el `.tgz` exacto, CSS público y fuentes de `trama-ui/fonts`. Idioma español, moneda EUR. Un local ficticio, sin login, cobro, envío de correo ni API de agenda. Textos de demo explícitos junto al formulario y en confirmación. Usar la guía `salon` y `variant="editorial"` cuando lo permita el tipo; las adaptaciones para contraste/foco se declaran como locales. No hay encargo de reproducción visual de Hebra.

| Ruta | Contenido / acción |
| --- | --- |
| `/` | Portada, manifiesto, servicios, equipo, trabajos, reseñas, horario y pie siguiendo receta; CTA persistente a `/reservar`. Noticias/tienda queda omitida por no ser parte del negocio piloto, documentando la variación |
| `/reservar` | `BookingFlow`; lee `servicio`, `profesional`, `editar` en el adaptador de la página y los mapea a props. El componente no lee query por sí mismo |
| `/mis-citas` | `AppointmentList`; misma clave de almacenamiento y catálogo de servicios; enlaza cambio con `?editar=` |

Datos fijos del fixture: `consulta` (15 min, 0 €, consulta inicial), `corte` (45 min, 35 €), `color` (90 min, desde 65 €). Alba hace los tres; Dani, consulta y corte. Sin fotografías de profesionales necesarias. Horario de martes a viernes 10–20, sábado hasta 14, domingos/lunes cerrado; inicios `10:00,11:00,12:00,13:00,16:00,17:00,18:00`, antelación 1–45 días, cambios hasta 24 horas antes. Clave propia `linde:pilot:v1`, mismo origen del consumidor. No reutilizar nombres/claves de demos del repo.

Nombre de prueba Alex y correo `alex@example.com`; no usar datos personales reales. Dos imágenes locales propias o con licencia registrada, con dimensiones y textos alternativos; si no están disponibles aún, el fixture declara assets pendientes en vez de enlazar `/img/hebra/*`. El resto del copy y recursos se fijan en un único fixture antes de ejecutar las dos condiciones; P0 no inicia la medición con contenido variable.

Las fechas de prueba se calculan desde un reloj/fecha base registrada en Europe/Madrid, dentro de ventana y fuera de cierre. Reservas y lista se montan por navegación entre rutas o remonte: `useAppointments` mantiene estado por instancia, no proporciona un almacén reactivo global. Si se exige contador/lista simultáneos, será una adaptación explícita que se deberá comprobar; no forma parte de este piloto.

## Estados y cierre del recorrido (P2–P4)

| Objetivo obligatorio | Evidencia requerida cuando se ejecute |
| --- | --- |
| API y distribución | Instalar `.tgz` en consumidor limpio; typecheck y build con imports públicos, CSS, fuentes y fichas legibles sin el repo |
| Selección y navegación | CTA, selección de servicio/profesional desde query válida, vuelta atrás conservando elecciones; query inválida tiene salida local documentada, sin pantalla rota |
| Reserva | Servicio → fecha/hora → datos → confirmación; no avanzar sin hueco, rechazar nombre corto y correo inválido; guardar una cita y mostrar aviso local, precio y duración correctos |
| Consulta y persistencia | Vacío inicial, carga, cita tras navegar y recargar, descarga `.ics` con datos correctos; prueba con almacenamiento disponible |
| Cambio y anulación | `editar` conserva ID/servicio/profesional/nombre y cambia fecha; correo se vuelve a introducir porque no se guarda; cancelar exige confirmación y devuelve a vacío; cita a menos de 24 h no ofrece cambios |
| Estados límite | Hueco ocupado por cita local, día cerrado y corte del sábado; ausencia de almacenamiento registra el límite de persistencia entre rutas. No presentar ocupación ficticia como prueba de concurrencia multiusuario |
| Diseño y acceso | Capturas e inspección de las tres rutas a 1440×900 y 390×844, teclado/foco, sin desbordes ni CTA tapando contenido; texto normal con contraste mínimo 4,5:1 y controles/texto grande 3:1; movimiento reducido. Los tokens `mut`/acento de `salon` requieren medición, no aprobación por pertenecer a una guía |
| Integración honesta | Nota de demostración visible en reserva/confirmación/lista; sin afirmar disponibilidad en tiempo real, correo, sincronización, identidad ni reserva de producción |

`BookingFlow` no ofrece promesa pendiente/error de servidor ni un prop para sustituir su persistencia: no se exigirán esos estados como si estuvieran implementados. Un servicio real requeriría otra unidad de diseño/API con disponibilidad autoritativa, transacción, errores, identidad y política de datos. La memoria temporal tampoco garantiza el recorrido entre rutas sin almacenamiento: registrar el resultado, sin declararlo persistente.

## Criterio de aceptación específico de P1

1. Generación determinista y modo `--check` integrado con las comprobaciones actuales; detectar ID/guía/pieza/destino inexistente y referencia rota. Los archivos actuales `CATALOG.md`/`catalog.json` conservan su uso; cualquier cambio derivado se revisa.
2. Índice selectivo, una ficha de guía/receta y todas sus piezas según la regla de cobertura; procedencia verificable contra bytes y versión. No editar resultados generados manualmente.
3. Tipos completos referenciados, controles etiquetados, imports contrastados con paquete construido; fixtures de guía y reserva/lista compilan con API pública. Cambiar una prop, guía o receta invalida su salida y ejemplo afectados.
4. Integraciones y assets pendientes explícitos; no hay alias `@/`, imports de demos/catálogo ni rutas absolutas locales en ejemplos de consumo. Las rutas de fuentes se rotulan como procedencia, no como recursos que el consumidor deba abrir.
5. P1 registra que aún faltan instalación del `.tgz` y recorrido visual/funcional P2–P4. Compilar fixtures no los marca aprobados. `npm run verify` pasa antes de entregar.

Implementación siguiente: ampliar generación y metadatos mínimos, generar esta selección y sus fixtures, construir paquete para verificar imports/tipos, revisar diff. Leer la documentación local de Next.js que corresponda antes de crear fixtures/rutas Next. Skills, adaptadores de instalación y comparación de costes quedan para sus entregas. El experimento completo conserva tres tareas × dos condiciones × dos repeticiones; este recorrido es su primera unidad, no sustituye las doce ejecuciones ni demuestra ahorro.
