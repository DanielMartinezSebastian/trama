> Documento histórico de la primera propuesta. La dirección visual, los recursos y los controles 3D aquí descritos fueron sustituidos por [48 · Negocios con identidad](./48-negocios-con-identidad.md).

# Hebra y Cadencia: dos negocios que se pueden probar

Fecha: 26 de octubre de 2026. Demos: `/sitios/hebra` y `/sitios/cadencia`.

## Método y referencias

Se parte de `CATALOG.md`, las webs completas de `03`, la investigación sectorial `11` y las funciones comerciales de `17` (§4 gimnasio y §7 peluquería). Se contrastaron con páginas públicas de negocios y documentación de sus sistemas de reservas. **La investigación externa es lectura web: no se completaron reservas ni pagos en los negocios reales, ni se midieron sus conversiones.** La prueba en Chromium corresponde a nuestras demos.

| Referencia primaria consultada | Lo que aporta | Aplicación |
| --- | --- | --- |
| [Blue Tit London](https://bluetitlondon.com/) y [sus preguntas frecuentes](https://bluetitlondon.com/faqs/) | Servicios diferenciados, precios, equipo, reserva visible y diagnóstico para cambios importantes | Hebra ofrece corte, textura, color y cuidado; orienta hacia una consulta gratuita si hay dudas. La política de pruebas de sensibilidad se consulta con el salón; no trasladamos afirmaciones legales británicas a España. |
| [Fresha: recorrido de reserva](https://www.fresha.com/help-center/knowledge-base/online-presence/102398-learn-how-clients-book-appointments-online) | Servicio → profesional → disponibilidad → revisión antes de confirmar | Tres pasos con resumen persistente, precio, duración y profesional. La disponibilidad es simulada, nunca se presenta como agenda real. |
| [David Lloyd: fitness](https://www.davidlloyd.es/es-es/fitness/) y [política de reservas](https://www.davidlloyd.es/es-es/policy/es-booking-policy/) | Diferentes disciplinas, reserva y cancelación desde el área personal | Cadencia permite filtrar por actividad y nivel, elegir día, reservar y cancelar. No copiamos su ventana de reserva: siete días y cancelación a dos horas son decisiones del negocio ficticio. |
| [David Lloyd: contacto y aplicación](https://www.davidlloyd.es/es-es/contacto/) | Objetivos, planes y reservas en un mismo espacio | «Mi ritmo» reúne plan, propuesta semanal y agenda. |

La lista de espera y el aviso de aforo son decisiones de producto para demostrar estados completos. No se atribuye eficacia comercial a estos patrones sin medición.

## Dirección visual

**Hebra.** Un salón de textura y color, inclusivo, con tarifas por técnica y tiempo. Fondo lavanda `#eeeaf2`, tinta ciruela `#30243e`, secundario `#6b5c76`, acento accesible `#604878`, tarjetas `#e2d8eb` y lima `#c7ee73` como superficie. Bricolage Grotesque en titulares, Manrope para lectura e Instrument Serif en los monogramas. Firma: retrato en forma de espejo y selector de intención que cambia el titular y lleva a la reserva del servicio elegido. Se evitó la fórmula habitual de salón beige, serif y dorado.

**Cadencia.** Club de fuerza y movilidad donde empezar sin intimidación. Fondo `#f2f4f7`, tinta `#192a48`, secundario `#56657d`, cobalto `#234ce4`, naranja `#d74822` y tarjetas `#e5eaf2`. Anton en titulares, Archivo en marca y Manrope para lectura y datos. Firma: titular deportivo de gran escala con «TU» en naranja y una entrada por objetivo que recomienda una clase reservable. El horario y el precio permanecen fuera de efectos.

Los colores viven en los tokens de cada web. Los componentes del kit no se han modificado ni importan código de las demos.

## Funciones y alcance

| Negocio | Funcional en el navegador | Requiere servicio real para producción |
| --- | --- | --- |
| Hebra | Seis servicios con duración y precio; profesional compatible; calendario a 45 días; lunes y domingos cerrados; sábado reducido; huecos bloqueados; validación; confirmación; persistencia; reprogramación; cancelación con confirmación; descarga de `.ics`; política de 24 horas | Agenda compartida, bloqueo concurrente de citas, identificación de cliente, comunicación, consentimiento y tratamiento de datos, pagos si procede |
| Cadencia | Siete días de horario; fines de semana ajustados; filtros de actividad y nivel; plazas simuladas; control de duplicados; lista de espera; reserva y cancelación; `.ics`; activación y baja de plan; objetivo persistente; propuesta semanal; QR de muestra; gráfico de ocupación | Autenticación, disponibilidad y aforo compartidos, saldo de clases, facturación, avisos y promoción de lista de espera, control de acceso |

Sin backend: `localStorage` independiente por marca, hidratado después del montaje y validado antes de leerlo. Si el almacenamiento está bloqueado, la experiencia funciona durante la sesión y avisa. Los correos solo validan el formulario y se descartan. No se solicitan tarjetas, no se envían mensajes y no hay llamadas a APIs externas en los flujos.

El pase QR codifica explícitamente `TRAMA-DEMO`, nunca una credencial de acceso. La ocupación es orientativa y simulada. Las fotos son referencias con licencia libre, no trabajos ni instalaciones propios. No se inventan reseñas ni resultados de clientes.

## Recursos y modelos

Se revisó el procedimiento de `22` §7 y `scripts/fetch-models.mts`: Sketchfab (CC0/CC BY, descarga con token), Poly Haven (CC0, sin clave), Poly Pizza (clave) y Khronos. Se ejecutaron búsquedas de barra de gimnasio en Sketchfab con límite de 40.000 caras y tijeras en Poly Haven. Los resultados no aportaron una pieza adecuada: no se descargó ningún modelo ni se atribuyó una licencia sin verificarla. Tampoco se añadieron dependencias 3D a la reserva.

Para una futura variante 3D: buscar `dumbbell`, `barbell`, `salon chair` y `hair scissors`, revisar licencia y piezas antes de descargar; medir peso, articulación y legibilidad en móvil; usar `--partes` si interesa mover las piezas; conservar la reserva fuera del lienzo. El criterio es el de `11`: fitness y estética admiten movimiento moderado, sin obstaculizar horario ni cita.

Fotografía: `npm run images:fetch -- peluqueria` y `-- fitness`, con Commons, registro en `lib/sites/photo-credits.json` y crédito visible desde cada pie hacia `/creditos`. Se inspeccionaron las imágenes seleccionadas y se descartaron resultados ajenos al tema. El script guarda autor, fuente, dimensiones y licencia.

## Guion para enseñar a un cliente (cinco minutos)

1. Abrir Hebra en móvil. Cambiar «Un cambio / Más luz / Una pausa» y seguir a la reserva. Elegir servicio y profesional, día y hora, completar con datos de ejemplo. Mostrar la cita tras recargar y cambiarla de día. Descargarla al calendario o cancelarla.
2. Abrir Cadencia. Elegir un objetivo y entrar al horario. Filtrar por disciplina y nivel, reservar una sesión disponible. Seleccionar una clase completa y entrar en espera.
3. Comparar planes, activar uno sin tarjeta y abrir «Mi ritmo»: plan, QR de muestra, objetivo y agenda. Cancelar la reserva y mostrar cómo vuelve a quedar disponible.
4. Abrir `/demos` o `CATALOG.md`: las dos webs están registradas, con sus páginas y componentes Trama. Cambiar tokens y contenido permite adaptar la base a un cliente sin rehacer los controles.

## Verificación

`npm run verify`, smoke de ambas portadas y prueba de recorridos con `npx tsx scripts/negocios.test.mts http://localhost:3000`. El test usa contextos nuevos de Chromium, recorre las diez rutas, comprueba móvil, persistencia, reservas, cambios y bajas; no toca datos del usuario. Capturas en `.refs3d/negocios/` (ignoradas).

El build se realiza en el worktree aislado `C:/COMPARTIDO/trama-negocios-check` con dependencias y `.next` propios, porque el servidor del usuario sigue activo en `trama-cine`.
