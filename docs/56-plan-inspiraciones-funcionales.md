# 56 · Plan: inspiraciones funcionales y presentables

> 27-10-2026. El usuario pide que las 18 inspiraciones (docs/55) sean **todas funcionales**, con algunas rutas más que
> simulen una plantilla interactiva, los **flujos básicos de su negocio** y un acabado **presentable** para enseñarlas a
> clientes. No hace falta copiar las rutas de la original, pero sí un mínimo de variedad, y de paso encontrar referencias
> nuevas para mejorar la librería. No hacen falta todas las animaciones de un producto acabado; sí lo que hoy es básico:
> scroll interesante al saltar a una sección de la misma página, menú animado en el móvil, etc. Se hace mientras Codex
> termina las imágenes (docs/encargo-imagenes-inspiraciones.md).

## 0. Punto de partida (inventario del 27-10-2026)

Hoy cada inspiración es **una sola página**. Casi ninguna tiene flujo de negocio:

| Situación | Inspiraciones |
|---|---|
| Sin formulario ni acción de negocio | Abuela Rosa, Cita, Impulso, Lobo, Matiz, Núcleo, Oficio, Patrón, Q47, Raíz, Vive |
| Formulario de contacto, nada más | Ahora, Melena, Nura, Remada, Talla, Cénit |
| Enlaces a `#` que no llevan a nada | Brasa, Cénit, Nura, Q47 |
| Scroll suavizado (anclas incluidas) | solo Brasa, Cénit, Cita, Impulso, Núcleo y Remada |
| Menú móvil propio y animado | solo algunas (Matiz y Q47 con `FullscreenMenu`); el resto, por revisar una a una |

Lo que ya existe y se reutiliza antes de crear nada:
- **Enrutado de varias páginas**: `/sitios` (`components/sites/SiteRouter.tsx`, `shared.tsx`: `siteHref`, `useSiteNavigate`,
  `useActiveIndex`, `PageHeader`).
- **Carrito y reservas simuladas**: ya los hacen las webs completas (Almíbar, Almíbar Taller, Almíbar Barrio).
- **Piezas del kit**: carrito, pasos, formulario (`ContactForm`), horario (`ClassSchedule`, `OpeningHours`), programas
  (`CohortList`), precios (`PricingSection`), ficha de producto (`ProductCard`), selectores, `Modal`, `Toast`, `FAQSection`.
- **Scroll**: `SmoothScroll` (Lenis) ya hace anclas suaves con `anchors`.

## 1. Qué es «terminada» (definición de hecho)

Cada inspiración se cierra solo si cumple todo esto:

1. **Nada muerto.**
   - Cada enlace, botón, pestaña, acordeón, menú y formulario hace algo visible: navega, abre, filtra, valida o confirma.
   - Lo que no tiene sentido simular va a una página real de la inspiración o a un aviso explicado (`Toast`), nunca a `#`.
2. **Rutas: de 3 a 5 páginas.**
   - Inicio y entre 2 y 4 internas en `/inspiraciones/<slug>/<página>`, con su variante de maquetación (§3).
   - Una ficha de detalle donde el negocio la pide: producto, proyecto, curso, viaje, local o disciplina.
   - Su propio 404.
3. **Flujo de negocio de principio a fin** (§3), con datos simulados:
   - validación con mensajes de error;
   - estado vacío;
   - confirmación;
   - el estado se recuerda entre páginas (`localStorage`, con `try/catch`).
4. **Básicos de interacción.**
   - Anclas con **scroll suave** y desplazamiento de la cabecera, con la curva de su guía.
   - **Menú móvil animado**.
   - **Transición entre páginas**.
   - Enlace activo en la navegación.
   - Hover y foco visibles en todo lo que se pulsa.
   - Botón de volver arriba cuando la página es larga.
   - Respeta `prefers-reduced-motion`.
5. **Presentable.**
   - Móvil a 390 px sin desborde.
   - Teclado y foco.
   - Textos alternativos.
   - `npm run smoke` sin errores ni sombras prohibidas.
   - Imágenes de Codex revisadas.
   - El par de la portada (`refs:probe --par`) igual o mejor que antes.
6. **Documentado.**
   - Ficha del cuaderno ampliada: rutas, flujo, piezas usadas y **referencias nuevas para la librería** (§5).
   - Commit propio.

## 2. Infraestructura común (ola 0)

Antes de las inspiraciones, una vez:

1. **Rutas.**
   - `app/inspiraciones/[slug]/[[...ruta]]/page.tsx` con `generateStaticParams` sobre las páginas que declara cada una.
   - Un enrutador que reutiliza la base de `/sitios`: `siteHref`, navegación sin recarga y enlace activo. Generalizarla si
     hace falta, sin duplicarla.
   - Cada inspiración declara sus páginas en `registro.ts`.
2. **Estado de negocio simulado.**
   - Un único módulo para carrito, reservas y solicitudes (`localStorage`, con `try/catch`). Sale del que ya usan las
     webs completas; no se escribe otro.
   - Cada inspiración lo usa con sus datos.
3. **Básicos de navegación.**
   - Revisar `SmoothScroll`: desplazamiento de cabecera (`anchorOffset`) y curva y duración de la guía en el salto a
     anclas.
   - Si falta algo, se amplía la pieza del kit, documentado en el catálogo.
   - Transición entre páginas con `PageTransition`, con el estilo de cada guía.
4. **Menú móvil.**
   - Inventario de cómo abre el menú en móvil cada inspiración.
   - Las que no lo animan usan `FullscreenMenu` o el menú móvil de `NavBar`, con su estética.
5. **Auditor.**
   - Se amplía `npm run smoke` con un modo `--auditar`: recorre los enlaces y botones visibles, los pulsa uno a uno y
     comprueba que algo cambia (URL, DOM, scroll, foco o un diálogo).
   - Lista lo muerto y las anclas que no existen.
   - Así «nada muerto» se mide y no se queda en opinión. Es una herramienta continua, documentada en docs/53.

## 3. Rutas y flujo de cada inspiración

Las páginas son una propuesta y pueden cambiar al auditar. El flujo marcado es el mínimo de su negocio.

### Ola 1 · Peluquería y barbería: reservar cita

Flujo común: **servicio → profesional → día y hora → datos → confirmación**, con la cita guardada y opción de cancelarla.
Probable pieza nueva del kit: `BookingFlow` (§5).

| Inspiración | Páginas | Flujo y detalles |
|---|---|---|
| Cita Barbers | inicio · locales y ficha de local · tarifas · reservar | elegir local primero; mapa o lista de locales con horario abierto o cerrado |
| Matiz | inicio · tratamientos · equipo · revista y artículo · reservar | carta de tratamientos con duración y precio |
| Patrón | inicio · servicios · tienda (shop-in-shop) · revista · reservar | también carrito de la tienda |
| Melena | inicio · salón · tienda, ficha y carrito · academia | dos flujos: comprar y reservar; solicitud de curso en la academia |
| Raíz | inicio · trabajos (antes y después, con filtros) · consulta | consulta con fotos simuladas y franja horaria |
| Nura | inicio · pelo (equipo y reservar) · arte (exposición y ficha de obra) · contacto | reservar y pedir información de una obra |

### Ola 2 · Gimnasio y estudio: plan, alta y clase

Flujo común: **ver horario → reservar plaza en una clase**, y **elegir plan → alta en pasos → confirmación**.

| Inspiración | Páginas | Flujo y detalles |
|---|---|---|
| Núcleo | inicio · clases (horario filtrable) · bonos · privadas | reservar plaza con aforo; comprar bono |
| Impulso | inicio · coaching · sobre Tomás · primera sesión | calendario para la sesión de prueba |
| Vive | inicio · clubes y ficha de club · membresía · clases | alta con elección de club |
| Talla | inicio · membresía · horario · coaches | alta y clase de prueba |
| Lobo | inicio · disciplinas y ficha · horario · tienda | clase de prueba y carrito de la tienda |

### Ola 3 · Academias: solicitar plaza

Flujo común: **programa → convocatoria → solicitud en pasos → pago simulado o reserva → confirmación**.

| Inspiración | Páginas | Flujo y detalles |
|---|---|---|
| Remada | inicio · viajes y ficha de viaje · método · vlog | plaza en una convocatoria, con nivel |
| Ahora | inicio · cursos y ficha · profesores · empresas | inscripción; formulario para empresas |
| Oficio | inicio · programas y ficha de promoción · mentores · eventos | solicitud; lista de espera para «lanzamos pronto» |

### Ola 4 · Producto, agencia y estudio

| Inspiración | Páginas | Flujo y detalles |
|---|---|---|
| Abuela Rosa | inicio · tienda y ficha de salsa · recetas · historia | carrito y compra simulada en pasos |
| Q47 | inicio · trabajo (filtros) y ficha de proyecto · agencia · contacto | pedir presupuesto en pasos |
| Cénit | inicio · proyectos y ficha · estudio · contacto | contacto y boletín funcionales |
| Brasa | inicio · trabajos y ficha · servicios · contacto | contacto; el reel abre la ficha |

Las páginas internas reutilizan la cabecera, el pie y la letra de la portada y siguen su guía de estilo. No inventan
otra estética.

## 4. Cómo se ejecuta junto a Codex

- **Una pasada por inspiración.** En cuanto Codex entrega una, se hace todo junto:
  - revisar sus fotos en escritorio y móvil (tarea pendiente de docs/55);
  - auditarla;
  - construir sus rutas y su flujo;
  - medir el par.
- Mientras Codex no llega a una ola, se avanza con la ola 0 y con las que ya tengan fotos. El orden de Codex (Cita,
  Matiz, Nura, Raíz, Patrón…) coincide con la ola 1.
- **Sin pisarse.** Codex solo toca `public/img/inspiraciones/`; Claude, el código. Cada uno hace commit de sus propias
  rutas, sin `git add -A`.
- **Imágenes de las páginas nuevas.** Las fichas nuevas (productos, obras, proyectos, viajes) piden fotos. Se reutilizan
  las del encargo actual donde encajen, y el resto va en un **segundo encargo** para Codex, con el mismo formato, que se
  le pasa al terminar el primero.

## 5. Referencias nuevas para la librería

Cada ola se cierra preguntando qué pieza se repitió y no existía. Antes de crear, se busca en el kit y se amplía
(`buscar-antes-de-crear`). Candidatas previstas:

| Candidata | Sale de | Qué haría |
|---|---|---|
| `BookingFlow` | ola 1 (6 webs) y ola 2 | reserva en pasos: servicio, profesional, hueco y datos, con confirmación |
| Alta en pasos o `CheckoutFlow` | gimnasios, academias y tiendas | pasos con resumen lateral, sobre el carrito y los pasos del kit |
| Localizador de locales | Cita y Vive | lista o mapa con «abierto ahora» (`OpeningHours`) |
| Galería filtrable | Raíz, Q47, Cénit | trabajos filtrables con transición entre filtros |
| Ficha de proyecto | Q47, Cénit, Brasa | cabecera grande, datos, galería y siguiente proyecto |
| `SmoothScroll` ampliado | todas | desplazamiento de cabecera y curva de la guía en las anclas |
| Auditor de interacción | todas | `smoke --auditar` (§2.5) |

Lo aprendido va a docs/02 §10 (trampas), al cuaderno (fichas y piezas) y al catálogo.

## 6. Orden y estimación

| Paso | Contenido | Esfuerzo |
|---|---|---|
| Ola 0 | rutas, estado simulado, anclas y transiciones, menú móvil, auditor | M |
| Ola 1 | 6 inspiraciones de peluquería y barbería, con `BookingFlow` | L |
| Ola 2 | 5 de gimnasio y estudio | L |
| Ola 3 | 3 academias | M |
| Ola 4 | 4 de producto, agencia y estudio | M |
| Cierre | auditor de las 18 a cero; `refs:probe --repo` y `--par`; docs/55 y 56; catálogo; build | S |

Al terminar cada ola: aviso al usuario con las rutas para revisarla y un commit.

## 7. Estado (28-10-2026): hecho

Las 18 tienen varias páginas, su flujo de negocio y menú animado en el móvil. Cada una vive en
`components/inspiraciones/<slug>/`:

- `data.ts`, datos puros con `PAGINAS`;
- `enlaces.ts`, con `<slug>Href`;
- la portada sin marco;
- `Sitio.tsx`, que exporta `Shell` (cabecera, menú, estado y pie que persisten) y `Pagina({ ruta })`.

El registro (`registro.ts`) da las rutas y la transición. El cargador ya solo usa `sitio()`.

| Ola | Inspiración | Páginas | Flujo probado de punta a punta |
|---|---|---|---|
| 1 | Cita | locales y ficha, tarifas, reservar, mis citas | `BookingFlow` con local, servicio, barbero y hueco; anular |
| 1 | Matiz | servicios, método, noticias, reservar, mis citas, contacto | reserva y anulación |
| 1 | Patrón | servicios, tienda y ficha, bolsa, pedido, revista, reservar | reserva y `CheckoutFlow` |
| 1 | Melena | salón, tienda y ficha, pedido, academia y curso | compra y `EnrollmentFlow` con lista de espera |
| 1 | Raíz | trabajos con filtros, consulta | consulta en pasos |
| 1 | Nura | pelo, arte y ficha de obra, reservar, mis citas, info | reserva y petición de información de una obra |
| 2 | Núcleo | clases, bonos, privadas, mi cuenta | `MembershipFlow`, reservar plaza, `MemberArea` |
| 2 | Impulso | equipo, servicios y ficha, tarifas, reservar, packs, reto, mi cuenta | reserva de sesión y alta |
| 2 | Vive | clubes y ficha, membresía, clases, mi cuenta | alta con club y reserva |
| 2 | Talla | oferta y ficha, horario, hazte socio, mi cuenta | alta, prueba y reserva |
| 2 | Lobo | clases y ficha, prueba, eventos, horario, cuotas, mi cuenta, tienda, pedido | prueba gratis, cuota, evento y compra |
| 3 | Remada | viajes y ficha, en línea, vlogs, contacto | solicitud con señal y lista de espera; envío del vídeo; chat por reglas |
| 3 | Ahora | cursos (filtro) y ficha, profesores, empresas, diario, contacto | solicitud de curso; `BriefFlow` para empresas; boletín |
| 3 | Oficio | programas y ficha, mentores, colabora, legal | plaza con señal, masterclass gratis, lista de espera; «sé mentor» |
| 4 | Abuela Rosa | tienda y ficha, pedido, recetas y receta, historia | tamaño y cantidad → bolsa → `CheckoutFlow` |
| 4 | Q47 | trabajo (filtro) y caso, agencia, contacto, blog y artículo | presupuesto con `BriefFlow`; escalera entre páginas (`PageTransition stairs`) |
| 4 | Cénit | proyectos (filtro) y ficha, estudio, contacto | `BriefFlow`; menú desplegable animado; boletín |
| 4 | Brasa | trabajos y ficha, servicios, sobre mí, blog, contacto | `BriefFlow`; el reel abre la ficha |

**Piezas nuevas del kit**:

- `BookingFlow` y `AppointmentList` (`lib/commerce/booking`);
- `CheckoutFlow` (`lib/commerce/card`);
- `EnrollmentFlow`;
- `MembershipFlow` y `MemberArea` (`lib/commerce/membership`);
- `BriefFlow` (petición de propuesta o presupuesto en pasos);
- las anclas animadas de `SmoothScroll` (`lib/motion/anchors`).

**Ampliaciones del kit**:

- `ClassSchedule` con `startedLabel`;
- `ChatWidget` con un avatar de imagen;
- el paso actual del `Stepper` sin halo.

**Candidatas que quedan** (se repitieron y aún son locales):

| Candidata | Dónde se repitió | Qué haría |
|---|---|---|
| Ficha de caso | Q47, Cénit, Brasa | cabecera, imagen, datos, texto, cifras y «siguiente proyecto» |
| Filtro de chips | Ahora, Q47, Cénit, Raíz | chips con `aria-pressed` sobre una lista, con recuento |
| Subida de archivo | Remada (vídeo), Raíz (fotos) | zona de arrastre con vista previa local y validación de tipo y tamaño |
| Boletín con respuesta | Ahora, Cénit | `ContactForm fields="email"` ya vale; falta un estilo de pie oscuro |
| Localizador de locales | Cita, Vive | sigue pendiente (§5) |

**Trampas nuevas** (docs/02 §10):

- un `var()` sin definir dentro de `font:` invalida toda la declaración y la letra vuelve a la heredada (Brasa con
  `--font-sans`);
- al quitar el envoltorio de una portada, hay que sustituir el final del archivo y no un `</div>` cualquiera;
- en Git Bash, las rutas que empiezan por `/` se convierten en rutas de Windows (`MSYS_NO_PATHCONV=1`);
- en `next dev`, Turbopack da 404 en los trozos que se cargan con `lazy()` dentro de un `next/dynamic` (Carousel,
  CrossCluster, la escena de Brasa); en el build no pasa.

**Pendiente**: un segundo encargo de imágenes para Codex con las fichas nuevas que hoy reutilizan fotos:

- productos de Patrón;
- blog de Melena;
- coaches de Núcleo;
- recetas e historia de Abuela Rosa;
- mentores de Oficio;
- profesores de Ahora en contexto.
