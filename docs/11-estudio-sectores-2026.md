# Estudio por sectores 2026: webs que venden, no solo que lucen

> Quinta ronda de investigación (19-10-2026). Las rondas 06–10 miran **webs premiadas** (qué efecto las hace
> reconocibles). Esta mira **webs con éxito comercial por sector** y lo que el cliente de cada sector necesita para
> decidir. Objetivo: que cada demo de Trama sea **funcional y comprensible para su público**, con los efectos al servicio
> de eso. Se cruza con la investigación de UX de las rondas 06–10 en el **§10** (patrones de UX por sector y fórmulas
> por sector); los puntos van numerados (`B1`, `R3`…) para poder citarlos desde otros documentos.
>
> **Método y límites.** Esta ronda es de **lectura**: listados sectoriales de 2026, guías de normativa y datos de
> rendimiento. **Nada se abrió ni se midió en Chrome** (a diferencia de [`07`](./07-formulas-webs-top.md)). Casi todos
> los listados los publican agencias que venden ese tipo de web, así que las cifras de conversión que citan son
> anécdotas de un caso y aquí no se usan como prueba. Lo que se repite en fuentes distintas se toma como patrón; lo que
> sale de una sola, se marca. Fuentes al final.

## 0. Conclusiones en cinco líneas

1. **En una pyme el visitante viene a resolver una pregunta concreta** (¿abren hoy?, ¿cuánto cuesta?, ¿hay hueco el
   jueves?, ¿dónde está?). La web que gana la responde en la primera pantalla del móvil. Los efectos van después.
2. **Cada sector tiene una «acción principal» única** (reservar mesa, pedir cita, pedir presupuesto, comprar, probar
   una clase). La demo debe tenerla visible en todas las páginas y en el pulgar en móvil.
3. **La confianza es concreta**: número de reseñas (no solo estrellas), fotos del sitio real, precio o «desde», nombre y
   cara del equipo, colegiado o registro sanitario. Las fotos de stock y las cifras sin fuente restan.
4. **2026 trae obligaciones**: accesibilidad (Ley 11/2023 / EAA, en vigor desde el 28-06-2025 para comercio
   electrónico y otros servicios), cookies con «Rechazar» al mismo nivel (AEPD) y Core Web Vitals en verde. La
   búsqueda con IA (AI Overviews, AI Mode) premia datos claros y coherentes: ficha de Google y `schema.org`.
5. **El movimiento tiene un presupuesto distinto por sector** (§2). Un despacho de abogados y una marca de moda no
   toleran lo mismo. Regla de Trama: **toda función se completa sin animación** (`prefers-reduced-motion`, sin JS de
   efectos, con teclado).

## 1. Base común: lo que no puede faltar en 2026 (cualquier sector)

| # | Imprescindible | Por qué / cómo se comprueba | En Trama hoy |
|---|---|---|---|
| B1 | **Acción principal persistente**: en la cabecera en escritorio y en una barra inferior fija en móvil (zona del pulgar, objetivo ≥ 44×44 px) | Patrón repetido en restauración, salud, hoteles y gimnasios. Que la reserva no obligue a abrir el menú | ◐ `NavBar` lleva CTA; **falta barra de acción móvil** |
| B2 | **Teléfono, WhatsApp y dirección a un toque** (`tel:`, `https://wa.me/`, enlace a mapa) | En España el mensaje es canal de contacto habitual; los listados de gimnasios y clínicas lo citan | ✘ falta un bloque de contacto rápido |
| B3 | **Horario con estado «abierto ahora / cierra a las…»** y festivos | Primera pregunta en restauración, comercio, clínicas | ✘ (`LocalTime` da la hora, no el estado) |
| B4 | **Precio visible o «desde»** y qué incluye | Estudio de 36 webs de gimnasios: la transparencia de precio fue la categoría peor puntuada (46/100) y el 94 % no explica la permanencia. En SaaS, «precio claro» es patrón repetido | ✔ `PricingCard`, `PriceTag` |
| B5 | **Prueba social con número y fuente** («4,8 · 212 reseñas en Google»), no solo estrellas | Repetido en gimnasios, clínicas, despachos | ◐ `Testimonial` con `rating`; **falta resumen de reseñas** |
| B6 | **Fotos reales** del local, del equipo y del trabajo | Repetido en todos los sectores locales. Ya es regla de Trama («fotos primero») | ✔ biblioteca + `/creditos` |
| B7 | **Formularios cortos** (3–5 campos), validación en línea, confirmación clara y alternativa por teléfono | Baymard: el formulario de pago medio tiene ~23 campos frente a 12–14 recomendables | ✔ `ContactForm`, `Stepper` |
| B8 | **Rendimiento**: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 en el percentil 75 de móvil | Solo ~48 % de las webs pasan las tres en móvil (Web Almanac 2025); LCP es la que más falla. Medir con Lighthouse y CrUX | ◐ el 3D va diferido; **falta medir cada demo** |
| B9 | **Accesibilidad WCAG 2.1 AA** (EN 301 549): contraste, foco visible, teclado, textos alternativos, `lang`, encabezados en orden, movimiento reducido | Obligatoria por Ley 11/2023 en comercio electrónico y otros servicios (exentas las microempresas de servicios, pero crecer las saca de la exención). Pasar axe y teclado | ◐ ayudas accesibles en el kit; **demos sin pasar axe** (pendiente de rondas 3 y 4) |
| B10 | **Cookies conformes a la AEPD**: «Rechazar» en la primera capa, mismo tamaño y estilo que «Aceptar», sin casillas premarcadas, revocable | Guía de cookies de la AEPD (julio de 2023, exigible desde el 11-01-2024) | ✔ `CookieBanner` (añadir enlace fijo «Configurar cookies» en el pie) |
| B11 | **Páginas legales**: aviso legal (LSSI), privacidad (RGPD), cookies; en tienda, condiciones, desistimiento y precios con IVA | Mínimo legal en España | ✔ en Pixelforge; **falta plantilla reutilizable** |
| B12 | **Datos para buscadores y asistentes**: `LocalBusiness`/`Organization`, `Product`, `FAQPage`, `Event`… coherentes con la ficha de Google (nombre, dirección, teléfono, horario) | La búsqueda local con IA cita pocas empresas y cruza ficha, reseñas y web. Google no promete que el `schema` dé más presencia en AI Overviews: es condición, no garantía | ◐ `lib/seo.tsx`; **faltan generadores por tipo** |
| B13 | **Búsqueda y navegación cortas**: 5–7 entradas de menú, migas en páginas profundas | Repetido en clínicas, inmobiliarias, industria | ✔ `NavBar`, `Breadcrumbs`, `CommandPalette` |
| B14 | **Estados vacíos, de error y de carga** en todo lo funcional (sin huecos, sin «undefined») | Estabilidad: una demo que falla al filtrar o reservar resta más de lo que suma el efecto | ✔ `EmptyState`, `Skeleton`, `Toast` |
| B15 | **Una sola acción por página** y jerarquía clara de botones (uno primario) | Repetido en todos los listados de conversión | — regla de composición |

## 2. Presupuesto de movimiento por sector

Escala: **0** nada más allá de transiciones de estado · **1** revelados suaves y microinteracciones · **2** relato con
scroll (secciones fijadas, parallax corto) · **3** experiencia (3D, cursor, preloader, scroll horizontal).

| Sector | Nivel | Dónde gastarlo | Dónde no |
|---|---|---|---|
| Despachos (abogados, asesorías, gestorías) | 0–1 | Contadores de cifras reales, revelado del equipo | Preloader, cursor, scroll secuestrado |
| Salud (clínica, dental, fisio, psicología) | 1 | Transiciones calmadas, antes/después con control del usuario | Cualquier cosa que acelere o maree; la ansiedad del paciente es un factor citado |
| Oficios y servicios locales (reformas, instalaciones, limpieza) | 1 | Antes/después, mapa de zona de servicio | 3D y preloader (el usuario busca desde la calle, con datos) |
| Academias y formación | 1–2 | Recorrido del temario por pasos, testimonios en vídeo | Bloquear el temario o el precio tras la animación |
| Fitness, bienestar, estética | 1–2 | Vídeo de la sala, horario vivo, transformación | Horario o precio escondidos tras efectos |
| Inmobiliaria | 1–2 (3 en promoción de obra nueva) | Galería, plano explorable, maqueta 3D de una promoción | Scroll infinito en el listado, login para ver fichas |
| Restauración | 2 | Fotografía a sangre, relato de procedencia | Carta en PDF, animación sobre la carta |
| Hoteles y alojamiento rural | 2 | Fotografía cinematográfica, ritmo lento (Aman) | Que el motor de reservas pierda fechas o esconda tasas |
| Industria B2B | 1–2 | Producto en despiece / animado (Hajster, Marley), configurador | Fichas técnicas sin descarga o sin búsqueda |
| Comercio / marca propia | 2 | Ficha de producto editorial, materiales, vídeo corto | Tapar el botón de compra, carrito lento |
| SaaS / tecnología | 2–3 | Bucle del producto real en el hero, gradientes (Stripe), modo oscuro sobrio (Linear) | Ilustraciones genéricas en lugar del producto |
| Estudios creativos, eventos, marcas de lujo | 3 | Lo de las rondas 06–10 | — (aun así: B8, B9) |

## 3. Fichas por sector

Cada ficha: **público y pregunta que trae**, **acción principal**, **estructura mínima**, **imprescindibles** (ids),
**referencias** (de los listados; sin verificar en vivo), **relato** y **qué tiene / falta Trama**.

### R · Restauración (bar, restaurante, cafetería, obrador)

- **Público**: vecinos y turistas en el móvil, con prisa; 77 % mira la web antes de ir (cifra de un listado, sin fuente
  primaria). Pregunta: ¿qué hay, cuánto cuesta, abren, hay mesa?
- **Acción**: reservar (o pedir para llevar).
- **Estructura**: inicio · carta · reservar · el sitio / la historia · contacto y cómo llegar · (eventos, grupos, regalo).
- **Imprescindibles**:
  - R1 **Carta en HTML**, no PDF, con precios y **alérgenos** (Reglamento UE 1169/2011: hay que informar de los 14
    alérgenos; en venta a distancia, antes de la compra).
  - R2 Reserva en 2 pasos (día/personas → hueco) con disponibilidad real y política clara (señal, cancelación).
  - R3 Horario con estado (B3) y cómo llegar.
  - R4 Para varios locales: localizador con ficha por local (dirección, horario, carta propia).
  - R5 Si el servicio es raro (menú degustación por tickets, sin reservas, colas), explicarlo **antes** de reservar
    (Alinea, Dishoom).
- **Referencias**: [Noma](https://www.noma.dk/) (una historia y una acción), [Eleven Madison Park](https://www.elevenmadisonpark.com/)
  (reserva y lista de espera), [Dishoom](https://www.dishoom.com/) (relato de herencia y aviso honesto de colas),
  [Hawksmoor](https://thehawksmoor.com/) (procedencia del producto y reserva integrada),
  [Ottolenghi](https://ottolenghi.co.uk/) (restaurante, tienda y recetas en una web), [The Wolseley](https://www.thewolseley.com/)
  (ventanas de reserva realistas, eventos en el menú).
- **Relato**: procedencia (de dónde viene el producto → quién lo cocina → la sala llena → reserva).
- **Trama**: ✔ `ImageGallery`, `Tabs` (secciones de carta), `Stepper`. ✘ **carta con alérgenos** (`MenuList`), ✘
  **selector de hueco** (`SlotPicker` / `DatePicker`, ya pendiente en la fase 4), ✘ horario con estado.

### H · Alojamiento (hotel boutique, casa rural, apartamentos)

- **Público**: viajero que compara con Booking/Airbnb. Pregunta: ¿cómo es de verdad, cuánto, por qué reservar aquí?
- **Acción**: reservar directo (las plataformas cobran un 15–25 % de comisión: es el argumento de venta al cliente).
- **Estructura**: inicio · habitaciones (ficha por tipo) · experiencias / entorno · restaurante · ofertas · reservar.
- **Imprescindibles**:
  - H1 **Barra de reserva** (fechas, huéspedes) visible en todas las páginas y en móvil sin abrir menú.
  - H2 **Ventaja de reservar directo** explícita (mejor precio garantizado, desayuno, salida tardía) — Hoxton, citizenM.
  - H3 Precio «desde» por noche y tasas visibles antes del último paso.
  - H4 El paso al motor de reservas **conserva fechas y marca** (si no, se pierde la reserva).
  - H5 Ficha de habitación: fotos, m², camas, vistas, accesibilidad real de la habitación.
- **Referencias**: [The Hoxton](https://thehoxton.com/) (personalidad constante y motor visible),
  [Aman](https://www.aman.com/) (entornos sin personas, ritmo lento), [citizenM](https://www.citizenm.com/) (ventaja
  directa y precios a la vista), [25hours](https://25hours-hotels.com/) (identidad por hotel dentro de una marca),
  [Ace Hotel](https://www.acehotel.com/) (programación cultural al nivel de las habitaciones).
- **Relato**: lugar (llegas → la habitación → el entorno → la mesa → vuelves).
- **Trama**: ✔ `CrossfadeHero`, `ExpandingPanels`, `forestTokens`/Arbor (lujo tranquilo), `ProductGallery` (vale para
  habitaciones). ✘ **barra de reserva con rango de fechas**, ✘ ficha de habitación.

### S · Salud (clínica dental, fisioterapia, psicología, estética médica, veterinaria)

- **Público**: personas con dolor, miedo o dudas; muchas mayores; mayoría en móvil. Pregunta: ¿me pueden atender
  pronto, cuánto cuesta, me fío?
- **Acción**: pedir cita (online o llamando).
- **Estructura**: inicio · tratamientos (ficha por tratamiento: qué es, para quién, cuánto dura, precio orientativo) ·
  equipo · primera visita · precios / financiación · contacto.
- **Imprescindibles**:
  - S1 **Cita en pocos pasos**: tratamiento → profesional (opcional) → hueco → datos mínimos. Botón en cabecera y pie.
  - S2 **Equipo con nombre, foto y nº de colegiado**; **nº de registro sanitario** del centro visible (lo exige la
    normativa de publicidad sanitaria de las comunidades autónomas; confirmar en cada caso).
  - S3 «Tu primera visita»: qué pasa, cuánto dura, qué traer. Reduce la ansiedad (factor repetido en las guías).
  - S4 Tono calmado: colores suaves, mucho aire, lenguaje llano; nada de promesas de resultado.
  - S5 Formularios con datos de salud: mínimo imprescindible, aviso de privacidad específico y envío seguro.
- **Referencias**: los listados de 2026 son de agencias de clínicas y no nombran webs verificables; patrón común:
  reserva en cabecera y pie, reseñas, equipo y precio transparente. **Pendiente**: buscar referentes españoles en vivo.
- **Relato**: tranquilidad (entiendo lo que te pasa → así lo tratamos → quién te atiende → qué pasará el primer día → cita).
- **Trama**: ✔ `Accordion`/`FAQSection`, `TeamSection`, `Timeline` (fases de un tratamiento), `Stepper`. ✘
  selector de cita (mismo que R2), ✘ comparador antes/después con control (`BeforeAfter`), ✘ tema «calma».

### P · Despachos profesionales (abogados, asesoría fiscal y laboral, gestoría, consultoría)

- **Público**: autónomos, pymes y particulares con un problema y poco tiempo. Pregunta: ¿saben de lo mío?, ¿cuánto me
  costará?, ¿me contestan rápido?
- **Acción**: consulta inicial (llamada, formulario o reserva de llamada).
- **Estructura**: inicio · áreas / servicios (ficha por servicio) · casos o resultados · equipo · honorarios / cómo
  trabajamos · recursos (blog, calendario fiscal) · contacto.
- **Imprescindibles**:
  - P1 **Especialización clara en el titular** (no «soluciones integrales»).
  - P2 Equipo con bio, colegiación y formación (señales E-E-A-T que citan las guías del sector).
  - P3 Cómo se cobra (cuota mensual, por asunto, primera consulta gratis o no).
  - P4 Formulario de admisión que **clasifica** el caso (tipo de asunto, urgencia) y no pide documentos al principio.
  - P5 Abogacía: sin promesas de resultado ni comparaciones con otros despachos (límites deontológicos de la
    publicidad).
- **Referencias**: listados de 2026 (Azuro, Growlaw, MagnifyLab) — todos de agencias del sector. Patrón: sobriedad,
  resultados y testimonios a la vista, fotos del equipo real.
- **Relato**: guía (tu problema → lo hemos resuelto antes → cómo trabajamos en 3 pasos → quién te atiende → consulta).
- **Trama**: ✔ `editorialTokens`, `MetaTable` (honorarios), `StatsSection`, `Timeline`, `ArticlesSection`. ✘ calendario
  fiscal / de plazos (útil para asesorías), ✘ demo del sector.

### I · Inmobiliaria (agencia, promotora, alquiler vacacional)

- **Público**: compradores e inquilinos que vienen de portales (Idealista, Fotocasa); propietarios que quieren vender.
  Pregunta: ¿qué tenéis en mi zona y presupuesto?; ¿cuánto vale mi casa?
- **Acciones**: dos. Comprador → contactar por un inmueble; propietario → pedir valoración.
- **Estructura**: inicio · buscar (listado + mapa) · ficha de inmueble · vender / valorar · obra nueva · equipo · contacto.
- **Imprescindibles**:
  - I1 Buscador con filtros persistentes en la URL, **paginación** (no scroll infinito, que rompe la orientación) y
    **sin registro** para ver fichas.
  - I2 Ficha: galería, precio, m², planta, **certificado energético** (obligatorio en la publicidad de venta y alquiler,
    RD 390/2021), plano, mapa de zona, botón de contacto fijo.
  - I3 Valoración en pasos para captar propietarios.
  - I4 Alquiler: los honorarios de gestión los paga el arrendador (Ley 12/2023): no mostrarlos como coste del inquilino.
- **Referencias**: [Luxury Presence: mejores webs 2026](https://www.luxurypresence.com/blogs/best-realtor-websites/)
  (hechas por ellos), SERHANT., Carolwood Estates. Hubtown (Awwwards SOTD) para obra nueva con relato cinematográfico.
- **Relato**: obra nueva = lugar + plano + maqueta; segunda mano = buscador primero, relato después.
- **Trama**: ✔ `FilterBar`, `Pagination`, `ProductGallery`, `ExplorableCanvas` (plano y maqueta 3D: muy vendible en
  promociones), Alzado/Arbor. ✘ **tarjeta de inmueble**, ✘ **mapa de resultados**, ✘ demo con buscador.

### F · Fitness, bienestar y estética (gimnasio, box, yoga, pilates, peluquería, centro de estética)

- **Público**: vecinos en un radio corto; principiantes con miedo a «no encajar». Pregunta: ¿qué clases, a qué hora,
  cuánto, puedo probar?
- **Acción**: clase de prueba / reservar cita.
- **Estructura**: inicio · horario · tarifas · clases o servicios · equipo · el centro · contacto.
- **Imprescindibles**:
  - F1 **Horario de clases** a pantalla completa en móvil, filtrable por actividad, con reserva en un toque.
  - F2 **Tarifas con condiciones** (permanencia, matrícula, baja). En el estudio de 36 gimnasios, el 94 % no las decía.
  - F3 Prueba gratis o primera sesión en ≤ 3 clics y visible arriba.
  - F4 Fotos de la sala y de socios reales (pregunta implícita: «¿gente como yo?»).
  - F5 Estética y peluquería: catálogo de servicios con duración y precio → cita con profesional.
- **Referencias**: el listado de UENI (20 gimnasios de EE. UU.) da patrones, no webs de referencia visual: reseñas con
  número en el hero, dirección arriba, WhatsApp entre los contactos, prueba gratis en barra superior.
- **Relato**: transformación (cómo empiezas → qué harás → quién te acompaña → resultados reales → prueba).
- **Trama**: ✔ Clara Vidal (servicios con precio y reserva con huecos: **reutilizar ese selector**), `PricingSection`,
  `TeamSection`. ✘ **horario semanal de clases** (`ScheduleGrid`), ✘ demo del sector.

### A · Academias y formación (idiomas, oposiciones, refuerzo, autoescuela, cursos online)

- **Público**: alumnos y familias (dos públicos con preguntas distintas). Pregunta: ¿sirve para mi objetivo, cuándo
  empieza, cuánto cuesta, qué resultados tenéis?
- **Acción**: matricularse o pedir información / clase de prueba / prueba de nivel.
- **Imprescindibles**: A1 ficha de curso con **fechas, horario, modalidad, precio y temario**; A2 resultados con fuente
  (aprobados, certificados); A3 prueba de nivel o clase gratuita; A4 no llamar «oficial» a lo que no lo es; A5 área de
  alumno enlazada (si existe).
- **Referencias**: la búsqueda no dio listados útiles del sector. **Pendiente** de ronda en vivo.
- **Trama**: ✔ `Timeline` (temario), `Tabs`, `PricingCard`, `FAQSection`. ✘ calendario de convocatorias / próximos
  inicios, ✘ prueba de nivel (cuestionario en pasos con resultado).

### O · Oficios y servicios locales (reformas, fontanería, electricidad, climatización, limpieza, mudanzas)

- **Público**: alguien con una urgencia o un proyecto, buscando «cerca de mí» en el móvil. Pregunta: ¿cubrís mi zona,
  cuándo podéis venir, cuánto, sois fiables?
- **Acción**: llamar ya / pedir presupuesto.
- **Imprescindibles**: O1 teléfono enorme y botón de llamada fijo; O2 **zona de servicio** (lista de municipios o
  mapa); O3 presupuesto en pasos con fotos opcionales; O4 trabajos reales **antes/después**; O5 garantías, seguros,
  carné de instalador o certificaciones; O6 tiempos de respuesta («urgencias en 2 h»).
- **Relato**: problema → solución → prueba (fotos) → garantía → llamada.
- **Trama**: ✔ Vigía (presupuesto en 4 pasos con estimación: **es la base**), `Stepper`. ✘ `BeforeAfter`, ✘ zona de
  servicio, ✘ subida de fotos en el formulario.

### B2B · Industria y fabricación

- **Público**: ingenieros (quieren la especificación), compras (precio, plazo, certificados) y dirección (fiabilidad).
- **Acción**: solicitar oferta (RFQ) o hablar con ventas; descargar ficha técnica.
- **Imprescindibles**: B2B1 navegación por **sector o aplicación**, no solo por producto (ABB, Honeywell, 3M);
  B2B2 catálogo con búsqueda y **especificaciones comparables**; B2B3 descargas (PDF, CAD) sin formulario obligatorio;
  B2B4 RFQ o configurador que lleve a presupuesto (C.H.I); B2B5 certificaciones (ISO), sectores y clientes; B2B6
  separar particular/empresa cuando venden a los dos (Airthings, C.H.I).
- **Referencias**: [C.H.I](https://www.chiohd.com/) (configurador → presupuesto), [Marley](https://www.marley.co.uk/)
  (megamenú digerible, hero con producto en contexto), [Robin Radar](https://www.robinradar.com/) (soluciones por tipo,
  fichas descargables), [Hajster](https://hajster.com/en) (producto animado de gama alta), [Velux](https://www.velux.co.uk/)
  (producto en espacios reales, varias vías de compra), [Amazon Filters](https://www.amazonfilters.com/) (buscador
  amplio y chat a ventas).
- **Trama**: ✔ Onda (catálogo, especificaciones, descargas), Plano (fórmula técnica), `ObjectStage`/`ExplorableCanvas`
  (despiece), `DataTable`. ✘ **comparador de especificaciones**, ✘ configurador → RFQ.

### C · Comercio / marca propia

- **Público**: compradores que comparan con Amazon; deciden en la ficha de producto.
- **Imprescindibles** (Baymard, datos de 2025): C1 **costes totales** antes del pago (gastos de envío inesperados: 48 %
  del abandono); C2 compra como invitado (exigir cuenta: 26 %); C3 pago corto (12–14 campos) con métodos locales
  (tarjeta, Bizum, PayPal; Bizum para comercios en Europa se anuncia para 2027); C4 ficha con materiales, medidas,
  envío y devolución junto al botón; C5 accesibilidad obligatoria (Ley 11/2023 aplica a comercio electrónico).
- **Referencias**: Allbirds (relato de materiales), Bellroy («qué cabe dentro»), Glossier (la estética es el producto),
  Tatcha (herencia). Patrón según las fuentes: una paleta, dos tipografías, un estilo de foto, aplicados sin excepción.
- **Trama**: ✔ Barro y Pixelforge (carrito, filtros, pedido en pasos), `ProductCard`, `CartDrawer`, `useCart`. ✘ bloque
  «envío y devoluciones» en la ficha, ✘ resumen de reseñas por producto.

### T · SaaS y tecnología

- **Patrón repetido** (Linear, Stripe, Vercel, Ramp): titular de una frase con **resultado concreto para un público
  concreto**, el **producto real** en el hero (bucle, no ilustración), precios a la vista, casos con nombre, sobriedad
  de color (el color significa algo).
- **Trama**: ✔ Pulso, Plano, `DeviceMockup`, `CodeBlock`, `PricingSection`, `LogoCloud`. Lo pendiente está en
  [`07` §5](./07-formulas-webs-top.md) (ronda de producto en vivo).

## 3b. Referentes internacionales validados por sector

Para inspirarse al diseñar: webs **destacadas fuera de España** (o en su país y su público) con una validación que se
pueda comprobar. Dos tipos de validación, y no valen lo mismo:

- **Premio**: Site of the Day (SOTD), Site of the Month (SOTM) o mención de honor (HM) de Awwwards; WebAward (Web
  Marketing Association); Webby. Premian **diseño y ejecución**, no ventas: sirven para la estética y el movimiento.
- **Mercado**: marca con éxito comercial reconocido en su país y una web citada por varias fuentes del sector. Sirven
  para la **estructura y la conversión**.

Fechas y niveles de premio tomados de los listados de Awwwards y WebAward (19-10-2026), **sin abrir cada web**. Antes
de usar una como modelo, abrirla y medirla (§9).

| Sector | Referente (país) | Validación | Qué tomar |
|---|---|---|---|
| **Restauración** | [Dishoom](https://www.dishoom.com/) (Reino Unido) | Mercado: cadena de referencia en Londres; citada en varios listados | Relato de herencia, aviso honesto de colas, reserva por local |
| | [Hawksmoor](https://thehawksmoor.com/) (Reino Unido) | Mercado | Procedencia del producto, reserva integrada sin salir de la web |
| | [Sweetgreen](https://www.sweetgreen.com/) (EE. UU.) | Mercado: cadena cotizada | Carta en primer plano, pedido y fidelización en la misma web |
| | [Crav Burgers](https://www.awwwards.com/sites/crav-burgers) | Premio: Awwwards SOTD, 13-06-2026 | Pedido como experiencia (movimiento nivel 2–3 en comida rápida) |
| **Alojamiento** | [The Hoxton](https://thehoxton.com/) (Reino Unido) | Mercado | Personalidad constante, motor de reservas visible, mejor precio garantizado |
| | [citizenM](https://www.citizenm.com/) (Países Bajos) | Mercado | Ventaja de reservar directo y precio a la vista |
| | [The Drake Hotel](https://www.awwwards.com/sites/the-drake-hotel) (Canadá) | Premio: Awwwards SOTD, 02-09-2025 | Hotel boutique con cultura y comunidad al nivel de las habitaciones |
| | [Explore Primland](https://www.awwwards.com/inspiration_search/hotel-restaurant/) (EE. UU.) | Premio: Awwwards SOTD, 04-02-2026 | Recorrido del lugar con la cámara guiada por el scroll (ya citado en `ExplorableCanvas`) |
| | [Tengile · Malamala Collection](https://www.awwwards.com/inspiration_search/hotel-restaurant/) (Sudáfrica) | Premio: Awwwards SOTD, 03-10-2026 | Lujo de naturaleza, fotografía cinematográfica |
| **Salud** | [Aventura Dental Arts](https://www.awwwards.com/sites/aventura-dental-arts) (EE. UU.) | Premio: Awwwards SOTD, 19-03-2026 | Clínica dental estética con nivel de diseño premiado: el techo de lo que se puede proponer |
| | [Natalie Herzel Dental Clinic](https://www.awwwards.com/sites/natalie-herzel-dental-clinic) (Alemania) | Premio: Awwwards nominada, 20-06-2024 | Clínica pequeña bilingüe (Hamburgo): escala parecida a una pyme española |
| | [Sakai Kids Dental Clinic](https://www.awwwards.com/sites/sakai-kids-dental-clinic) (Japón) | Premio: Awwwards nominada, 13-01-2025 | Odontopediatría: tono para familias y niños |
| | [South Cliff Dental Group](https://www.awwwards.com/sites/south-cliff-dental-group) | Premio: Awwwards HM, 16-06-2026 | Contraejemplo útil: experiencia 3D completa. Ver si mantiene la cita a un toque; por defecto, salud se queda en nivel 1 |
| | [Tend](https://www.hellotend.com/) (EE. UU.) | Mercado: cadena dental de diseño; su premio (ADC) es por el espacio físico, no por la web | Marca coherente de la clínica a la web; reserva como eje |
| **Despachos** | [IMK Avocats](https://www.awwwards.com/websites/law/) (Bélgica) | Premio: Awwwards HM, 05-03-2026 | Abogacía sobria con diseño cuidado |
| | [Stilley Law](https://www.awwwards.com/websites/law/) (EE. UU.) | Premio: Awwwards HM, 25-05-2026 | Despacho pequeño con nivel de diseño premiado |
| | [Kümmerlein](https://www.awwwards.com/websites/law/) (Alemania) | Premio: Awwwards HM, junio de 2025 | Abogados y notarios: confianza, equipo y áreas |
| | [ROEH Law & Tax](https://www.awwwards.com/websites/law/) (Alemania) | Premio: Awwwards HM, 2025 | Derecho y fiscal juntos: el modelo más cercano a una asesoría |
| **Inmobiliaria** | [Mira Real Estate](https://www.awwwards.com/sites/mira-real-estate) (Emiratos) | Premio: Awwwards nominada, febrero de 2025 | Agencia con buscador y filtros sencillos y buen SEO: el modelo para agencias |
| | [FIND Real Estate](https://www.awwwards.com/sites/find-real-estate) (Cuberto) | Premio: Awwwards HM, 18-03-2026 | Búsqueda de inmuebles intuitiva (PropTech) |
| | [Hubtown](https://www.awwwards.com/websites/real-estate/) (India) | Premio: Awwwards SOTD, 10-06-2026 | Obra nueva con relato cinematográfico a pantalla completa |
| | [ERA Residence](https://www.awwwards.com/websites/real-estate/) | Premio: Awwwards SOTM, agosto de 2026 | Promoción residencial: el techo para una promotora |
| | [The Modern House](https://www.themodernhouse.com/) (Reino Unido) | Mercado: agencia de casas de diseño muy citada en su país; sin premio verificado | Fichas editoriales: la casa contada como un artículo |
| **Fitness** | [Phive](https://www.awwwards.com/inspiration_search/fitness/) (Portugal) | Premio: Awwwards SOTD, 05-08-2025 (Burocratik) | Cadena de gimnasios ibérica: público y precios cercanos a los españoles |
| | [THE GRIND](https://www.awwwards.com/inspiration_search/fitness/) (Países Bajos) | Premio: Awwwards HM, marzo de 2026 | Marca de fitness con energía visual |
| | [Essor Fitness](https://www.awwwards.com/inspiration_search/fitness/) (Suiza) | Premio: Awwwards HM, enero de 2026 | Estudio de entrenamiento pequeño: escala de pyme |
| | [XNRGY Club](https://www.awwwards.com/inspiration_search/fitness/) | Premio: Awwwards HM, junio de 2026 | Pádel, fitness y comunidad: encaja con el mercado español del pádel |
| **Academias** | [Process Academy](https://www.webdesignawards.io/winners/2026/education) | Premio: Web Design Awards 2026, educación (8,6/10) | Academia con diseño premiado |
| | [Westbourne Grammar](https://www.awwwards.com/inspiration_search/school/) (Australia) · [The Quaker School at Horsham](https://www.awwwards.com/inspiration_search/school/) (EE. UU.) | Premio: Awwwards HM, 17-12-2025 y 15-09-2026 | Colegios: dos públicos (familias y alumnos), admisiones |
| | [Duolingo](https://www.duolingo.com/) (EE. UU.) | Mercado: líder mundial en idiomas | Prueba de nivel inmediata, tono propio, registro sin fricción |
| **Oficios locales** | [Montreal Plumber](https://www.awwwards.com/sites/montreal-plumber) (Canadá) | Premio: Awwwards nominada, mayo de 2025 | Fontanería con urgencias y servicios claros. **No hay premios fuertes en este sector**: aquí manda §3 «O» (llamar, zona, antes/después) |
| **Industria B2B** | [Vegusa Maquinaria](https://www.webaward.org/category/Manufacturing/best-manufacturing-websites.html) (México) | Premio: WebAward 2026, mejor web de fabricación | Maquinaria en español: catálogo y contacto comercial |
| | [Terminal Industries](https://www.awwwards.com/inspiration_search/industrial/) (EE. UU.) | Premio: Awwwards SOTM, septiembre de 2025 | Tecnología industrial con nivel de producto SaaS |
| | [C.H.I](https://www.chiohd.com/) · [Marley](https://www.marley.co.uk/) · [Velux](https://www.velux.co.uk/) | Mercado (listado de Blend, 2026) | Configurador → presupuesto, megamenú, producto en contexto real |
| **Comercio** | Ganadoras de comercio en Awwwards 2026: Aardvark Book Club, Bucks Sauce, Gielly Green, LAB46… ([listado](https://www.awwwards.com/websites/winner_category_ecommerce/)) | Premio: Awwwards, comercio electrónico 2026 | Fichas editoriales de marca pequeña |
| | [Allbirds](https://www.allbirds.com/) · [Bellroy](https://bellroy.com/) (Australia) · [Glossier](https://www.glossier.com/) | Mercado: marcas de venta directa muy citadas | Materiales, «qué cabe dentro», la estética como producto |
| **Corporativo** | [ComPsych Brand Hub](https://winners.webbyawards.com/winners/websites-and-mobile-sites/general-desktop-mobile-sites/corporate-communications) (EE. UU.) · [KOKUYO](https://winners.webbyawards.com/winners/websites-and-mobile-sites/general-desktop-mobile-sites/corporate-communications) (Japón) | Premio: Webby 2026, comunicación corporativa (jurado y voto popular) | Web de empresa grande que se entiende |
| | [Ottografie](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure) (Exo Ape) | Premio: Webby 2026, mejor navegación y estructura | Arquitectura de información (solo se juzgó eso) |
| **SaaS** | [Linear](https://linear.app/) · [Stripe](https://stripe.com/) · [Vercel](https://vercel.com/) · [Ramp](https://ramp.com/) | Mercado | Ronda propia pendiente ([`07` §5](./07-formulas-webs-top.md)) |

**Cómo usarlos**: el **premio** marca el techo estético (hasta dónde llevar el movimiento en ese sector); el
**mercado** marca la estructura. Si chocan, gana la estructura (§1 y §3). Antes de proponer un referente a un cliente,
abrirlo en móvil y comprobar que su acción principal funciona: varias webs premiadas lo hacen peor que sus competidoras.

## 4. Relato (storytelling) por objetivo

| Estructura | Orden | Sectores |
|---|---|---|
| **Guía** | Tu problema → por qué nosotros (prueba) → plan en 3 pasos → qué evitas → acción | Despachos, oficios, SaaS, salud |
| **Procedencia** | Origen → oficio → resultado → experiencia → acción | Restauración, comercio de marca, industria artesanal |
| **Lugar** | Llegas → recorres → te quedas → vuelves | Hoteles, inmobiliaria de obra nueva, arquitectura |
| **Transformación** | Punto de partida → proceso → resultado real → prueba gratis | Fitness, estética, academias, reformas (antes/después) |
| **Demostración** | El producto haciéndolo → detalle por capas → especificación → oferta | Industria, SaaS, producto técnico (Plano) |

Regla: el relato **ordena** el contenido, no lo esconde. Cada sección abre con una frase que se entiende sola (encaja
con la regla de 40–60 palabras de la guía SEO de martinezsebastian.com), y la acción principal está disponible en
cualquier punto del relato.

## 5. Piezas funcionales que le faltan a Trama

Ordenadas por cuántos sectores las usan. Respetan la regla de modularidad: **primero opción de un componente existente**.

| Pieza | Sectores | Propuesta (modular) |
|---|---|---|
| **Barra de acción móvil** (llamar · WhatsApp · reservar) | todos | Opción `mobileActions` de `NavBar` o componente pequeño `ActionBar`; respeta `safe-area-inset-bottom` |
| **Selector de fecha y hueco** | R, H, S, F, A | `DatePicker` (ya pendiente) con `mode="single" \| "range"` y `slots`; sacar la lógica del selector de Clara Vidal |
| **Horario y estado** | R, S, F, O, comercio | `OpeningHours` (días, festivos, «abierto ahora») sobre `LocalTime` (zona horaria); emite `openingHoursSpecification` |
| **Resumen de reseñas** | todos | Opción de `TestimonialSection`: media, número, fuente, reparto por estrellas |
| **Carta / lista de precios** | R, F, estética | `MenuList` con secciones, precio, etiquetas de alérgenos (iconos SVG propios + texto) |
| **Horario semanal de clases** | F, A | `ScheduleGrid`: columnas por día en escritorio, lista por día en móvil, filtro por actividad |
| **Antes / después** | S, O, F, reformas | `BeforeAfter` con deslizador accesible (teclado, `role="slider"`) |
| **Mapa / ubicación** | todos los locales, I | `LocationCard` (dirección, cómo llegar, enlace a mapas, sin cargar mapa hasta pulsar) y mapa de resultados para I |
| **Tarjeta y ficha de inmueble** | I | Opción de `ProductCard` (`kind="property"`) + `MetaTable` para m², planta, energía |
| **Comparador** | B2B, SaaS, comercio | Opción `compare` de `DataTable` |
| **Barra de utilidades y megamenú** ([`12`](./12-agencias-corporativas.md) G4) | B2B, I, corporativo | Opciones `utility` y `mega` (título + descripción por enlace) de `NavBar` |
| **Filtro en forma de frase** (`12` G6) | B2B, I, A | Variante `sentence` de `FilterBar`, con el estado en la URL (I1) |
| **Clientes en texto y laureles** (`12` G3) | B2B, T, P | Opciones de `LogoCloud` |
| **Contacto rápido** | todos | Bloque con teléfono, WhatsApp, correo y dirección (puede ser variante de `CTASection`) |
| **Plantillas legales** | todos | Páginas de aviso legal, privacidad, cookies y **declaración de accesibilidad** como bloques con datos |
| **Datos estructurados** | todos | Generadores en `lib/seo.tsx`: `LocalBusiness`, `Restaurant`, `Dentist`, `Product`, `Event`, `FAQPage`, `Course` |

## 6. Demos propuestas (pymes y corporativo)

Una por sector que falta, todas con fotos reales, contenido verosímil en español y las piezas de §5. Nivel de
movimiento según §2.

| Demo (nombre provisional) | Sector | Acción principal | Piezas nuevas que estrena | Movimiento |
|---|---|---|---|---|
| **Brasa** | Restaurante (dos locales) | Reservar mesa | `MenuList`, `DatePicker` con huecos, `OpeningHours`, localizador | 2 |
| **Albar** | Casa rural / hotel boutique | Reservar directo | Barra de fechas (`range`), ficha de habitación | 2 |
| **Clínica Ribera** | Dental / fisio | Pedir cita | Cita por tratamiento, `BeforeAfter`, tema «calma» | 1 |
| **Ferrer Asesores** | Asesoría y abogados | Consulta inicial | Calendario fiscal, admisión que clasifica el caso | 0–1 |
| **Umbral** | Inmobiliaria | Contactar / valorar | Buscador con mapa, ficha con energía, valoración en pasos | 1–2 |
| **Núcleo** | Gimnasio / pilates | Clase de prueba | `ScheduleGrid`, tarifas con condiciones | 1–2 |
| **Arista Reformas** | Oficios locales | Llamar / presupuesto | `ActionBar`, zona de servicio, fotos en el presupuesto | 1 |
| **Vértice** (de la [`12`](./12-agencias-corporativas.md)) | Grupo industrial / corporativo | Contacto por área | `NavBar utility/mega`, `FilterBar sentence`, `LogoCloud` con laureles, cifras en mosaico | 1 |

Orden recomendado: **Brasa** y **Clínica Ribera** primero (estrenan las piezas más compartidas: hueco, horario,
reseñas, barra móvil); después **Núcleo** y **Arista** (reutilizan casi todo); **Umbral**, **Albar** y **Ferrer** al
final.

## 7. Criterio de «demo terminada» (además de `typecheck`, `catalog:check` y `build`)

1. La acción principal se completa de principio a fin en móvil a 390 px **con movimiento reducido** y **solo con teclado**.
2. axe sin errores graves; contraste AA en los temas claros y oscuros de la demo.
3. Lighthouse móvil: rendimiento ≥ 90, LCP ≤ 2,5 s, CLS ≤ 0,1 (en local con limitación de red).
4. Estados de vacío, error y carga revisados en cada formulario y filtro.
5. Datos estructurados válidos (prueba de resultados enriquecidos) y páginas legales enlazadas en el pie.
6. Las cinco preguntas del sector (§3) se responden en la primera pantalla o a un toque.

## 8. Para cruzar con la investigación de UX

- Usar los ids de este documento (`B1`–`B15`, `R1`–`R5`, `H1`–`H5`, `S1`–`S5`, `P1`–`P5`, `I1`–`I4`, `F1`–`F5`,
  `A1`–`A5`, `O1`–`O6`, `B2B1`–`B2B6`, `C1`–`C5`) para que la guía por sectores pueda decir «cumple / no aplica / falta».
- Preguntas abiertas para esa investigación: patrones de **formularios de cita** en móvil (¿hueco antes que datos?),
  **público mayor** en salud (tamaño de letra base, contraste), **WhatsApp frente a formulario** en España (no se
  encontraron datos de encuesta: buscar en CNMC, INE, IAB Spain) y el **umbral de animación** aceptable con pruebas reales.

> **Ronda 12** ([`12-agencias-corporativas.md`](./12-agencias-corporativas.md)): cómo son las webs corporativas de las
> agencias punteras y de sus clientes. Su §5 la cruza con este documento (lecciones G1–G12 frente a B, sectores y
> presupuesto de movimiento) y añade la fórmula «Corporativo claro» (nivel 1) y la demo Vértice.

## 9. Pendiente de esta ronda

- **Ronda en vivo** con el método de [`07` §4](./07-formulas-webs-top.md#4-cómo-repetir-la-investigación-sin-dependencias):
  abrir en Chrome las referencias de §3 y §3b, medir CWV, móvil y pasos de la acción principal. Prioridad: Aventura
  Dental Arts, Natalie Herzel, Phive, Mira Real Estate, IMK Avocats, The Drake Hotel y Dishoom (una por demo de §6).
- Confirmar la fecha y el nivel de cada premio en su ficha de Awwwards (se tomaron de los listados) y el país de los
  que quedan sin él.
- Confirmar en fuente primaria (BOE, aepd.es, HTTP Archive) las cifras marcadas como de segunda mano.

## 10. Cruce con la investigación de UX (rondas 06–10)

Las rondas [`06`](./06-indice-replicar-webs-premiadas.md)–[`10`](./10-plan-plano.md) estudian **qué hace memorable** una
web premiada; este documento, **qué necesita** el cliente de cada sector. Aquí se juntan: cada patrón de UX de las
rondas premiadas, con el nivel de movimiento que gasta (§2), los sectores donde cabe y la condición para usarlo.

> **Ids.** Los patrones de UX de `06` §2 también se numeran `P1`–`P14` y chocan con los de despachos (`P1`–`P5`, §3). Para
> no romper ninguna referencia, aquí se citan con el prefijo del documento: **`06·P1`**… Los ids de este documento
> (`B1`, `R2`, `P3`…) no cambian.

### 10.1 Patrones de UX por sector

Nivel = el del §2 (0 nada · 1 revelados · 2 relato con scroll · 3 experiencia). «Sí» = encaja en el presupuesto del
sector; «Con cuidado» = solo si cumple la condición; «No» = gasta más de lo que el sector tolera.

| Patrón (06 §2) | Nivel | Sí | Con cuidado | No | Condición (ids) |
|---|---|---|---|---|---|
| 06·P1 Scroll suave con inercia | 1 | R, H, I, C, T, estudios | F, A, B2B | P, S, O | Nunca en listados largos ni formularios; se apaga con movimiento reducido (B9) |
| 06·P2 Scroll narrativo (secciones fijadas) | 2 | H, R, T, B2B, I (obra nueva) | A, F, C | P, S, O | El relato ordena, no esconde (§4): la acción principal sigue a un toque (B1) y el contenido se lee sin animación |
| 06·P3 Tipografía protagonista animada | 1–2 | R, H, C, T, estudios | P (sin animar), F | S | El titular dice el resultado concreto (P1, T); animación corta |
| 06·P4 Preloader y entrada coreografiada | 3 | Estudios, eventos, lujo | H, T | P, S, O, R, I, F, A, C | Solo una vez por sesión; nunca retrasa B8 (LCP) |
| 06·P5 Menú a pantalla completa | 2 | Estudios, H, R | C, I | O, S | Con 5–7 entradas (B13) y la acción fuera del menú (B1) |
| 06·P6 Cursor propio | 3 | Estudios, eventos | — | Todos los de pyme | Solo puntero fino; sin él la web es igual de usable |
| 06·P7 Imágenes que reaccionan (máscara, WebGL) | 1–2 | R, H, C, I, estudios | F, B2B | S, P, O | Fotos reales (B6); la distorsión no tapa precio ni texto |
| 06·P8 Rejillas y galerías no convencionales | 2 | Estudios, C (marca), H | I (galería de ficha) | P, S, O | Alternativa en lista accesible (como `ExplorableCanvas`) |
| 06·P9 Transiciones entre páginas | 1–2 | Todos salvo O | — | — | Corta (< 400 ms) y la cabecera no se mueve |
| 06·P10 Microinteracciones | 1 | Todos | — | — | Foco visible y objetivo ≥ 44 px (B1, B9) |
| 06·P11 Pie memorable, 404 y contacto | 1 | Todos | — | — | El pie lleva B2, B3, B11 y «Configurar cookies» (B10) |
| 06·P12 Detalles de estudio (reloj, sonido, numeración) | 1 | Estudios, H, R | T | P, S, O | El reloj puede ser B3 («abierto ahora»): detalle con función |
| 06·P13 Producto digital (UI, ⌘K) | 1–2 | T, B2B | A (área de alumno) | — | El producto real, no una ilustración (T) |
| 06·P14 Comercio (ficha, carrito, filtros) | 1 | C, R (pedido), I (buscador) | — | — | C1–C5; filtros en la URL y paginación (I1) |

### 10.2 Fórmulas de las rondas y a qué sector sirven

| Fórmula (ronda) | Sectores | Relato (§4) | Qué hay que añadirle para el sector |
|---|---|---|---|
| Plano técnico (07: Heron) — demo **Plano** | T, B2B, P (versión sobria) | Demostración | B4 precio o «desde», B5 reseñas con fuente, B1 acción fija; en P, sin el 3D |
| Relato 3D por capas (09–10: Atlas, Cartier) — `ExplorableCanvas nav="scroll"` | B2B (despiece de producto), I (obra nueva), arquitectura, T | Demostración / Lugar | Nivel 3: solo donde el §2 lo permite. Plano 2D de reserva y capítulos en el DOM (ya lo hace); la acción, fuera del lienzo |
| Maqueta / mapa 3D explorable (08–09: Overworld) — **Sonar**, **Alzado** | I (promociones), arquitectura, H (finca, resort) | Lugar | Lista accesible (ya está) y la ficha con B4 / I2 |
| Evento con wordmark (07: Foro) | Eventos, academias (convocatorias) | Lugar / Guía | Fechas y precio en la primera pantalla (A1) |
| Arquitectura tranquila (07: Arbor) | H, I, salud estética (S4: calma) | Lugar | En S, quitar el `ScatterText` y el scroll largo: nivel 1 |
| Estudio editorial (06: Mota, Sonar) | Estudios, C (marca), R (procedencia) | Procedencia | B2 y B3 en el pie; carta en HTML en R (R1) |
| Producto SaaS (06: Pulso) | T, B2B (portal de clientes) | Demostración | B4 y casos con nombre |
| Tienda (06: Barro, Pixelforge) | C, R (para llevar) | Procedencia | C1–C5 |

### 10.3 Lo que cambia en las demos actuales

- **Plano** es «Demostración» (§4) para T/B2B: el relato 3D es nivel 3 y vive **en su propia página**
  (`/sitios/plano/recorrido`); la portada vuelve a la maquetación técnica (nivel 1–2), con la acción principal fija
  (`EdgeTab`, B1). Pendiente para el sector: precio o «desde» (B4) y reseñas con fuente (B5).
- **Alzado** y **Sonar** usan el mapa 3D como patrón de lugar (I, arquitectura): les falta la ficha con datos de I2 si se
  enseñan a una inmobiliaria.
- Ninguna demo pasa todavía el §7 completo (axe, Lighthouse móvil, teclado de punta a punta).

### 10.4 Preguntas abiertas para la siguiente ronda de UX

Las de §8 siguen abiertas (cita en móvil, público mayor, WhatsApp frente a formulario, umbral de animación). Se añaden:
- ¿El relato 3D (nivel 3) mejora la comprensión de un producto B2B o solo la impresión? Probar Plano con y sin recorrido.
- ¿Qué parte del relato debe estar en la portada en sectores de nivel 2 (un adelanto) y qué en una página propia?

## Fuentes

Normativa y datos: [Ley 11/2023 (resumen)](https://aiopsgroup.com/accessibility-legislation-spain/) ·
[EAA y microempresas](https://www.taylorwessing.com/en/interface/2025/accessibility/key-eu-accessibility-act-exemptions-and-the-challenges-they-pose) ·
[Legálitas sobre la EAA](https://www.legalitas.com/actualidad/european-accessibility-act) ·
[Guía de cookies AEPD (resumen ECIJA)](https://www.ecija.com/actualidad-insights/nota-informativa-actualizacion-de-la-guia-sobre-el-uso-de-cookies-con-plazo-de-implantacion-hasta-el-11-de-enero-de-2024/) ·
[Usercentrics: banner en España](https://usercentrics.com/es/knowledge-hub/banner-de-cookies-espana/) ·
[Baymard: estado del checkout](https://baymard.com/blog/current-state-of-checkout-ux) ·
[Estadísticas de checkout (Shno)](https://www.shno.co/marketing-statistics/checkout-conversion-statistics) ·
[Core Web Vitals 2026](https://eseospace.com/blog/core-web-vitals-in-2026-what-changed-what-still-matters-and-how-to-pass/) ·
[Bizum para comercios en 2027](https://www.autonomosyemprendedor.es/articulo/autonomos/pymes-autonomos-podran-cobrar-traves-bizum-clientes-toda-europa-partir-2027/20260205160821051798.html) ·
[AI Overviews y búsqueda local](https://www.pinmeto.com/blog/ai-overviews-local-search-2026/) ·
[AI Mode local](https://web60.ie/blog/google-ai-mode-local-search-2026) ·
[Movimiento y accesibilidad (Princeton)](https://digital.accessibility.princeton.edu/how/content/animations)

Sectores: [Restaurantes (KrishaWeb)](https://www.krishaweb.com/blog/best-restaurant-website-design-examples/) ·
[Restaurantes (Inkbot)](https://inkbotdesign.com/restaurant-website/) ·
[Hoteles (KrishaWeb)](https://www.krishaweb.com/blog/best-hotel-website-designs/) ·
[Reserva directa (Hospitality Net)](https://www.hospitalitynet.org/news/4126202/how-boutique-hotels-can-master-e-commerce-for-more-direct-bookings) ·
[Clínicas dentales (Delmain)](https://delmain.co/blog/dental-website-ideas-that-convert) ·
[Despachos (Azuro)](https://azurodigital.com/law-firm-website-examples/) ·
[Despachos (Growlaw)](https://growlaw.co/blog/best-law-firm-websites) ·
[Inmobiliarias (Luxury Presence)](https://www.luxurypresence.com/blogs/best-realtor-websites/) ·
[Inmobiliarias (Fireart)](https://fireart.studio/blog/great-real-estate-website-examples/) ·
[Gimnasios (UENI)](https://ueni.com/blog/gym-fitness-websites/) ·
[Gimnasios: estudio de 36 webs (Webtonic)](https://www.webtonic.io/sub-services/gym-web-design) ·
[Fitness (StudioMeyer)](https://studiomeyer.io/en/blog/webdesign-fitness-studios) ·
[Industria (Blend)](https://www.blendb2b.com/resources/best-manufacturing-website-designs) ·
[Industria (Windmill)](https://www.windmillstrategy.com/best-manufacturing-websites-examples/) ·
[Shopify 2026 (Fudge)](https://www.fudge.ai/blog/best-shopify-stores-2026/) ·
[SaaS (Redefine)](https://redefineweb.com/blog/best-saas-website-designs-proven-convert-2026/) ·
[Awwwards: comercio electrónico](https://www.awwwards.com/websites/winner_category_ecommerce/) ·
[Webby 2026: comunicación corporativa](https://winners.webbyawards.com/winners/websites-and-mobile-sites/general-desktop-mobile-sites/corporate-communications)

Premios por sector (§3b): [Awwwards: clínicas](https://www.awwwards.com/inspiration_search/clinic/) ·
[Awwwards: abogados](https://www.awwwards.com/websites/law/) ·
[Awwwards: inmobiliaria](https://www.awwwards.com/websites/real-estate/) ·
[Awwwards: fitness](https://www.awwwards.com/inspiration_search/fitness/) ·
[Awwwards: hoteles y restaurantes](https://www.awwwards.com/websites/hotel-restaurant/) ·
[Awwwards: colegios](https://www.awwwards.com/inspiration_search/school/) ·
[Awwwards: industria](https://www.awwwards.com/inspiration_search/industrial/) ·
[Web Design Awards 2026: educación](https://www.webdesignawards.io/winners/2026/education) ·
[WebAward: fabricación](https://www.webaward.org/category/Manufacturing/best-manufacturing-websites.html) ·
[Webby 2026: navegación](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure) ·
[Tend (premio ADC por el espacio)](https://thelawrencegroup.com/?p=8376)
