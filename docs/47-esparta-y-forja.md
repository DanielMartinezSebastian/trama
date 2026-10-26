> Documento histórico de la primera propuesta. La dirección visual, los recursos y los controles 3D aquí descritos fueron sustituidos por [48 · Negocios con identidad](./48-negocios-con-identidad.md).

# Esparta y Forja: dos variantes con carácter

26 de octubre de 2026. Nuevas webs en `/sitios/esparta` y `/sitios/forja`. Conservan independientes Hebra y Cadencia, sus rutas y sus datos guardados.

## Diseño y estructura

**Esparta — Barber Society.** Barbería masculina clásica, con referencias a los retratos espartanos y la fotografía vintage. Carbón `#171714`, marfil `#eee5d3`, latón `#c7a56a`, secundario `#b7ad98`, superficie `#24241e`, líneas `#494438`. Cormorant Garamond en titulares y marca, Manrope en lectura y controles. Hero de campaña a sangre; entrada de texto por palabras, retrato que se asienta, cinta tipográfica, imagen que se revela al hacer scroll, selector de corte/barba/ritual y carta sobre papel. Pausa de movimiento visible y respeto a `prefers-reduced-motion`.

Cinco páginas: barbería, servicios, barberos, reservar y mis citas. Servicios propios: corte de la casa, clásico a tijera, barba de carácter, afeitado tradicional, ritual completo y consulta gratuita. Precios cerrados y duración; profesionales compatibles; calendario; resumen; formulario; persistencia; reprogramación; cancelación y descarga de calendario. No hay pagos ni correos reales.

**Forja — Strength & Conditioning.** Gimnasio de fuerza y acondicionamiento con ambiente industrial oscuro. Grafito `#111312`, hueso `#f3f0e8`, naranja `#ff7038`, pistacho de luz `#d8e987`, superficie `#20241f`, líneas `#3c4439`. Anton en titulares, Archivo en marca y Manrope en lectura. Imagen deportiva de campaña; titulares que entran con máscara; cinta naranja; programas Fuerza/Motor/Base que llevan a una sesión reservable; explorador 3D del equipamiento.

Cinco páginas: club, horario, planes, espacio/equipo y área personal. Horarios de fin de semana, actividad, nivel, plazas, espera, duplicados, confirmación, bajas y calendario conservan las funciones de Cadencia con almacenamiento separado. Las sesiones tienen nombres propios: Base camp, Mobility lab, Engine room, Heavy club y Recovery.

La estructura funcional deriva de las demos de [46](./46-hebra-y-cadencia.md); no se han modificado sus archivos. Los componentes del kit no importan las nuevas demos.

## Barra 3D

`components/sites/forja/BarbellStage.tsx` usa los controles de Trama y las utilidades `useGLGate`, `GLBoundary`, `useTokens` y `useReducedMotion`. La escena se carga con `lazy` cuando está cerca de pantalla. Fuera de ella, deja de dibujar.

`barbellScene.tsx` modela una barra olímpica por geometrías: eje, manguitos, topes, zonas de agarre y discos con anillos. Reflejos con `RoomEnvironment` y luces con los tokens del tema. No necesita modelos descargados, HDR, fuentes remotas, texturas ni decodificadores Wasm.

- 20 kg: barra sin discos.
- 60 kg: barra y un disco de 20 kg por lado.
- 100 kg: barra y dos discos de 20 kg por lado.
- Despiece interpolado, giro orbital con arrastre y giro automático que se puede pausar.
- SVG estático si no hay WebGL o se pide movimiento reducido; selección de carga y despiece siguen disponibles.

El selector es una demostración visual de equipamiento, no una pauta de carga para una persona. Las reservas funcionan sin abrir el explorador.

## Imágenes de campaña

Se utilizó la herramienta integrada `image_gen` en modo generación, sin API key ni CLI. Los originales se conservan en la carpeta de generación y los recursos consumidos por las webs están guardados y optimizados como WebP en el proyecto:

| Archivo | Uso |
| --- | --- |
| `public/img/esparta/hermandad.webp` | Portada, ritual y retratos de campaña de Esparta, 1774 × 887 |
| `public/img/forja/atleta.webp` | Portada de Forja, 1672 × 941 |

Los personajes y escenas son ficticios. Se explica en la FAQ de Esparta, en la página de equipo y en `/creditos`. No se presentan como fotografías de clientes, empleados ni resultados reales. La foto de material de la página interior de Forja procede de la biblioteca de Commons ya existente, con sus créditos.

### Prompt final de Esparta

```text
Use case: ads-marketing. Asset type: full-bleed hero photograph for a classic masculine barbershop called Esparta. Create a premium, cinematic editorial photograph of three fictional adult men aged 30-50 with impeccably groomed full beards, strong faces, and short textured barber haircuts, staged as a contemporary interpretation of vintage Spartan warriors. The central man in three-quarter profile is closest to camera on the right, stern yet calm; two companions recede behind him toward the middle. Restrained worn bronze shoulder details over black clothing, absolutely no weapons. Authentic skin and individual beard hairs, hard amber side light, deep warm charcoal shadows, subtle analog grain, old master chiaroscuro, no fantasy CGI look. Wide landscape composition with the LEFT 40 percent nearly empty warm black for HTML headline overlay. Faces fill the right two-thirds, dramatic head-and-shoulders framing. Palette ink black, tobacco brown, aged brass and ivory. High-end men's grooming campaign, timeless, rugged, tactile. No text, letters, logos, watermark, borders or layout graphics. Deliver landscape image suitable for a website hero.
```

### Prompt final de Forja

```text
Use case: ads-marketing. Asset type: website hero photograph for a high-energy strength gym. Primary request: a cinematic black-and-white sports editorial photograph with a vivid molten-orange rim light, an athletic fictional adult male athlete in his thirties with muscular but realistic build, short hair, dark charcoal sleeveless training top, chalked hands gripping an Olympic barbell at the top of a deadlift. Three-quarter front view, focused downward look, no screaming, authentic sweat and skin texture, no injuries. Wide landscape composition, athlete occupying right half, barbell extending toward center; LEFT third almost black negative space for HTML headline. Background dark industrial training room, deep shadow, a hint of wall texture, dramatic edge light and a thin orange light fixture. Premium real fitness photography, documentary grit, sharp equipment details, frozen motion, no smoke obscuring the subject. No writing, logos, watermarks, badges, typography, or graphic layout.
```

## Probar y presentar

1. Esparta: dejar terminar la entrada, bajar al ritual, cambiar Corte/Barba/Ritual, reservar con Bruno, cambiar la cita y descargarla al calendario.
2. Forja: elegir un programa, probar la reserva, bajar al hierro, girar la barra, seleccionar 100 kg y separar los discos. Probar también 20 kg y pausar el giro.
3. Mostrar horario, espera y planes; abrir el área personal y cambiar el objetivo. La disponibilidad es simulada y el estado se guarda solo en ese navegador.
4. Cambiar a móvil o activar movimiento reducido. Se mantienen las funciones de negocio y la alternativa estática del explorador.

## Comprobaciones

- `npm run doctor`, `npm run catalog`, `npm run verify`.
- `npx tsx scripts/negocios-oscuros.test.mts http://localhost:3000`: reservas, recargas, reprogramación, cancelación, planes, espera, guardados inválidos y diez rutas en 1440 y 390 px.
- `npx tsx scripts/negocios-motion.test.mts http://localhost:3000`: animación y pausa de Esparta, WebGL real de Forja, cargas, despiece, giro con puntero, movimiento reducido y WebGL desactivado.
- Smoke de ambas portadas; revisión visual de capturas y de la escena realmente renderizada. Capturas e informes en `.refs3d/negocios-oscuros/`, ignorado por Git.
- Build y comprobación con `next start` en un worktree de validación con `.next` y dependencias independientes. Se conserva el servidor del usuario.

No se ha publicado el sitio ni se ha conectado ningún servicio de reservas o de pago.
