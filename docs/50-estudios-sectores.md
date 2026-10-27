# 50 · Estudios por sector: peluquería, gimnasio, academia y producto

> 26-10-2026. Encargo del usuario: «amplía los estudios a más webs de Awwwards, sobre todo las relacionadas con
> sectores de negocio (peluquería, gimnasio, academia o centros de formación). Necesito ampliar modelos y guías de
> estilo para la librería». Lista de tareas para ir iterando, una web cada vez, con el método de docs/38.

## 0. Para qué

- **Modelos**: una plantilla por sector (secuencia de secciones, fórmula de docs/07 y páginas que necesita un negocio
  real: servicios, precios, equipo, reserva, horario, contacto) montada con Secciones del kit.
- **Guías de estilo**: una por sector o por familia visual, con las constantes de docs/16 medidas con `refs:probe`.
- **Piezas**: solo lo que se repita en varias webs, o lo que sea versátil (docs/38 §3: se estudia un concepto, no una
  web). La firma de una sola web va a una demo.
- **Contexto**: hay una sesión con demos de peluquería y gimnasio en curso (Hebra, Cadencia, Esparta, Forja; docs/46 y
  47 en la rama `feat/demos-peluqueria-gimnasio`, sin integrar). Estos estudios les sirven de referencia: al terminar
  cada uno, contrastar con esas demos y anotar qué les falta.

## 1. Procedimiento por web (encargo A de docs/38)

1. `npm run cine:web -- <url>` en escritorio y con `--movil`: mapa, tira y transición entre páginas. Si tiene varias
   páginas, mapa de las dos o tres más importantes.
2. `npm run refs:probe -- <url>`: color, escala tipográfica, rejilla, superficies y movimiento.
3. Secciones con canvas, 3D o transiciones: `cine:explora`, `cine:sonda`, `cine:capture` (con `--clic` para las
   transiciones) y `cine:flujo`; `cine:ritmo` si el scroll tiene sensación propia.
4. Ficha: estructura, técnica, estilo, conceptos (docs/37), qué cubre el kit y qué falta, coste de reproducirlo.
5. Al cerrar un sector, `cine:sintesis` con sus webs: plantilla común y lista de piezas.

Salidas en `.refs3d/webs/<slug>/` (ignorado por Git) y las conclusiones en este documento (§3).

## 2. Tareas

Estado: `[ ]` pendiente · `[~]` en curso · `[x]` hecha (con la fecha y el commit).

### Peluquería y belleza

- [x] **E1 · Il Colorista Salon** — 26-10-2026, conclusiones en §3.1 (Awwwards: https://www.awwwards.com/sites/il-colorista-salon)
  - Sacar la URL real de la ficha de Awwwards; anotar premio, fecha y créditos.
  - Mapa, estilo y transiciones. Mirar: cómo presenta servicios y precios, el equipo, la reserva y la galería de
    trabajos; el tono (lujo, color, editorial).
  - Salida: guía de estilo «salón editorial» y contraste con Hebra y Esparta.
- [x] **E2 · Más webs de peluquería, barbería o estética** (búsqueda en Awwwards del 26-10-2026: «hair salon»,
  «barber», «beauty salon», «hairdresser»; descartadas las que solo coinciden en el nombre: Le Salon Peugeot,
  Salon 94, Heleen Hülsmann, Cielia):
  - [x] E2a · ALICE Hair & Art — https://www.alicehairart.se/ (HM 11-02-2025; peluquería y arte en Estocolmo, Framer)
  - [x] E2b · Rendezvous Barbers — https://www.myrendezvous.ca/ (HM 31-07-2024; barberías de Toronto)
  - [x] E2c · Hair Me Up — https://hairmeup.pl (nominada 16-04-2024; salón con blog y tienda)
  - [—] E2d · Fruits Hair Lab — https://fruitshairlab.com/ (nominada 03-01-2023; «minimal maximalism», Nashville).
    **Descartada**: el dominio sirve hoy una plantilla genérica (Arial y Georgia, ilustraciones de relleno, «Clean visuals
    without broken images»); la web premiada ya no existe.
  - [x] E2e · Marco Ambrosi Salon — https://www.marcoambrosi.salon/ (HM 02-06-2021; color y extensiones, vídeo)
  - [x] E2f · Don Barber & Groom — https://don-barber.gr/en (HM 15-03-2021; barbería de lujo asequible)
  - Reserva por si alguna no carga: Serenity Hair Salon (nominada 2025), Base Coat Nail Salon (HM 2020, Shopify).
  - [x] E2z · Síntesis de peluquería (`cine:sintesis` con E1 y E2a–f): plantilla, guía y si `ShapeMosaic` se hace.
    26-10-2026: fichas en §3.2 y síntesis en §3.3 (`.refs3d/sintesis/peluqueria/`). `ShapeMosaic` no se hace.

### Gimnasio y deporte

- [x] **E3 · Webs de gimnasio, estudio de entrenamiento, pilates o club deportivo** (búsqueda en Awwwards del
  26-10-2026: «gym», «fitness», «pilates», «boxing»; descartadas las de producto, como BHOUT o Puretec, y las de
  agencias):
  - [x] E3a · Core Atelier Pilates — https://coreatelierpilates.com/ (HM 25-03-2026; calma, tipografía fina, reserva)
  - [x] E3b · Essor Fitness — https://coachsportifecublens.com/ (HM 03-01-2026; estudio de entrenamiento suizo)
  - [—] E3c · Between The Ears — https://btwntheears.com/ (HM 20-09-2023; gimnasio de longevidad). **Descartada**: hoy es
    una consulta de psicoterapia, no el gimnasio premiado.
  - [x] E3d · FIT AND YOU — https://fit-and-you.webflow.io/ (HM 03-11-2023; club premium, Webflow)
  - [x] E3e · Skulpt Fitness — https://www.skulptfitness.nl (HM 30-09-2022; gimnasio sin florituras, horario largo)
  - [x] E3f · Fenriz Gym — https://www.fenriz-gym.com/ (nominada 06-02-2024; gimnasio de artes marciales)
  - Reserva: Trevor Blount Pilates (SOTD 2019), Andre Wolf Boxing (nominada 2025), Kinective (HM 2020).
  - [x] E3z · Síntesis de gimnasio con E3a–f. 26-10-2026: fichas en §3.4 y síntesis en §3.5; candidata `ClassSchedule`.
  - Mirar: horario y reservas, planes y precios, entrenadores, energía del movimiento (vídeo, tipografía, cortes).
  - Contraste con Cadencia y Forja.

### Academia y centros de formación

- [x] **E4 · Surfing Academy** (26-10-2026, §3.6) — https://surfing.academy/
  - Escuela de surf: cursos, niveles, calendario o reserva, ubicación, galería. Mirar si hay vídeo o canvas en la
    portada y cómo lo resuelve en móvil.
  - Los defaults de copy del kit ya son de una escuela de surf: comparar con lo que hacen ellos.
- [x] **E5 · Future London Academy** (26-10-2026, §3.6) — https://futurelondonacademy.co.uk/
  - Academia de formación ejecutiva y creativa: catálogo de cursos, fichas de curso (programa, fechas, precio,
    profesorado), testimonios, logos de empresas, solicitud.
  - Salida: plantilla «academia» con páginas de catálogo y de curso.
- [x] **E6 · Honhar** (26-10-2026, §3.6; formación profesional) — https://honhar.in/
  - Confirmar sector al mapearla (por el nombre, oficio o talento; puede ser formación o plataforma de artistas).
    Estudiar dentro de academia si encaja; si no, como referencia de maquetación.
- [x] **E7 · Síntesis de academia** (26-10-2026, §3.7; candidata `CohortList`) (`cine:sintesis` con E4–E6 y las que se añadan): plantilla común, guía de estilo y
  piezas que falten (catálogo de cursos con filtros, ficha de curso, calendario de convocatorias, solicitud por pasos).

### Producto

- [x] **E8 · Peppa Sauce** (26-10-2026, §3.8) — https://www.peppasauce.love/
  - Producto de consumo (salsa): presentación del producto, sabores, dónde comprar o tienda, tono de marca. Mirar 3D o
    animación del bote, color y tipografía.
  - Salida: guía de estilo «producto de marca» y contraste con la fórmula de producto de docs/07.

### Transiciones, maquetación y navegación

- [x] **E9 · K72** (26-10-2026, §3.9: escalera y menú con marquesina → E12) — https://k72.ca/en
  - Agencia creativa de Montreal. Nota del usuario: «muy interesante la navegación»; estudiar a fondo transiciones y
    maquetación.
  - Capturar el menú abierto y cerrado (`cine:capture --clic`), la transición entre páginas y entre proyectos, el hover
    de la lista de trabajos y la rejilla.
  - Salida: ronda de cine si la navegación es un concepto nuevo (docs/35), con pieza del kit (menú o transición) y su
    ficha de concepto; si ya lo cubre el kit (`PageTransition`, `IslandNav`…), ampliarlo en vez de duplicar.

### Cierre

- [ ] **E10 · Guías de estilo nuevas** en docs/16 (una por familia: salón, gimnasio, academia, producto de marca), con
  sus tokens y un ejemplo con piezas del kit.
- [ ] **E11 · Modelos por sector**: recetas en `CATALOG.md` («Landings de referencia» o «Webs completas») para
  peluquería, gimnasio y academia, montadas con Secciones del kit; o, si las demos de la otra sesión ya lo cubren,
  mejorarlas con lo aprendido.
- [~] **E12 · Piezas nuevas o ampliadas** que salgan de las síntesis, con la lista de versatilidad de docs/36 §1,
  catálogo y docs/README.
  - [x] `TeamSection`: foto con marco (`shape`: portrait, square, circle, oval), tratamiento (`photoTone`: color, mono,
    mono-hover), biografía, enlace por persona (`linkLabel`), `layout="rows"`, `members` como datos (26-10-2026).
  - [x] `SectionHeader`: `titleSize="giant"` y `backdrop` (palabra de fondo cortada) (26-10-2026).
  - [x] `ClassSchedule` (nueva, categoría datos): días desde hoy, filtros de disciplina y nivel, plazas, lista de espera,
    `bookings` y `onBook`; en lista o semana. Sale de los horarios de Cadencia y Forja (26-10-2026).
  - [x] `CohortList` (academias, §3.7, nueva): programas por convocatoria con formato, nivel, fechas y estado, en filas o tarjetas (27-10-2026).
  - [x] `TeamSection layout="wall"`: muro denso de profesorado (FLA) (27-10-2026).
  - [x] `PageTransition kind="stairs"` (K72, §3.9) (27-10-2026).
  - [x] `FullscreenMenu` con `rules`, `linkHover="marquee"` y `reveal="stairs"` (Il Colorista y K72) (27-10-2026).
  - [x] `ShapeMosaic` (nueva, Il Colorista): al reproducir Matiz se vio que la firma pedía la pieza; versátil para cualquier mosaico geométrico con fotos (27-10-2026).
  - [~] Menú en columnas verticales con la palabra girada (Skulpt): hecho dentro de la réplica Talla, no en el kit; pasarlo a `FullscreenMenu` si se repite.
  - [ ] `PageTransition` con marca en el centro (Il Colorista).
  - [x] `FeatureExplorer` cubre el acordeón que cambia la foto fija (Core Atelier): usado en Núcleo.

### Réplicas (encargo del 27-10-2026)

> «Completa y revisa todas las webs que añadimos a los estudios y reproduce su temática y estética en conjunto con
> nuestros componentes; si no existen, valora recrearlos con nuestro estilo de Trama.»

Hechas las 16 el 27-10-2026: índice en **`/lab/estudios`**. Cada web se reproduce entera en **`/lab/estudios/<slug>`** (`components/lab/estudios/`), con una marca inventada y
textos propios en español, la estructura, el tono y la estética del original, y piezas del kit; lo que falte se crea en
el kit si es versátil (E12). Fotos provisionales del repo hasta que lleguen las de Codex
(`docs/encargo-imagenes-replicas.md`).

- [x] **E13a · Matiz** (Il Colorista): mosaico de formas (`ShapeMosaic`, nueva), carta de paquetes, menú con filetes.
- [x] **E13b · Nura** (ALICE): collage suelto que se desenfoca, una sola letra, equipo en filas.
- [x] **E13c · Cita** (Rendezvous): serif con cursiva, vídeo que crece, locales, palabras gigantes, app.
- [x] **E13d · Melena** (Hair Me Up): arco, palabras de fondo, servicios numerados, tienda, academia, reserva por salón.
- [x] **E13e · Raíz** (Marco Ambrosi): oscuro y cobre, antes y después, comparación, carta «desde», WhatsApp.
- [x] **E13f · Patrón** (Don Barber): gótica condensada, cinta, menú lateral, la familia, shop in shop.
- [x] **E13g · Núcleo** (Core Atelier): acordeón con foto fija, cursiva serif, sesiones privadas.
- [x] **E13h · Impulso** (Essor): negro, titular a todo el ancho, cintas, fichas numeradas.
- [x] **E13i · Vive** (FIT AND YOU): condensada naranja, damero, lista de clases gigante, cifras, tarjetas ladeadas.
- [x] **E13j · Talla** (Skulpt): lima, bordes curvos, planes mes/año, menú en columnas verticales.
- [x] **E13k · Lobo** (Fenriz): B/N con degradado de marca, disciplinas, eventos, horario.
- [x] **E13l · Remada** (Surfing Academy): minúsculas, ilustración, viajes por convocatoria (`CohortList`, nueva).
- [x] **E13m · Ahora** (Future London Academy): amarillo, muro de profesores, tarjetas solapadas, lista de cursos.
- [x] **E13n · Oficio** (Honhar): neobrutalismo amarillo, sellos, programas por promoción.
- [x] **E13o · Abuela Rosa** (Peppa Sauce): producto fijo, dos tintas, maridajes gigantes.
- [x] **E13p · Q47** (K72): portada sin scroll con reel, menú de filas con marquesina, escalera, catálogo.

### Iteración profunda en el lab (encargo del 27-10-2026)

> «Itera los estudios: llévatelo al lab y comienza a analizarlo y replicarlo en profundidad para mejorar nuestra
> librería y fuente de conocimientos.» Ampliar las herramientas existentes si aportan, documentado; anotar siempre los
> ejercicios en el lab para encontrar relaciones y sacar hojas de estilo y patrones (docs/53).

- [x] **E14a · Cuaderno del lab**: `docs/cuaderno/`, `npm run lab:cuaderno` (en `verify`), `/lab/cuaderno`; fichas de los
  3 estudios, las 16 réplicas, las 4 demos reformadas y las 7 piezas (27-10-2026).
- [x] **E14b · `refs:probe` ampliado**: paleta por superficie, radios, curvas, hover y modo `--par` (docs/53 §3).
- [x] **E14c · Q47 frente a K72**: de 10 a 19 de 20 medidas; `FullscreenMenu triggerHover="fill"` (docs/53 §4).
- [ ] **E14d · Par y ficha de las otras 15 réplicas**, una a una, en este orden (de más a menos lejos a ojo): Abuela Rosa,
  Matiz, Impulso, Cita, Vive, Talla, Patrón, Lobo, Oficio, Ahora, Remada, Melena, Raíz, Nura, Núcleo.
- [ ] **E14e · Movimiento por scroll** en las que lo tienen (Rendezvous, Essor, Il Colorista, Peppa Sauce): `cine:capture`
  + `cine:compare` sobre el par.
- [ ] **E14f · Páginas internas**: un par por página que importe (la de trabajo de K72, la carta de Il Colorista).

## 3. Conclusiones por web

### 3.1 Il Colorista Salon — https://ilcolorista.salon/

![Montaje de ilcolorista-salon](/lab/cine/archivo/.refs3d/webs/ilcolorista-salon/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/ilcolorista-salon/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/ilcolorista-salon/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/ilcolorista-salon/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/ilcolorista-salon-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/ilcolorista-salon)

Mención de Honor de Awwwards (29-09-2022), de studio zerotredici (Italia). Atelier de color en Isola della Scala
(Verona). Sin WebGL a la vista pese a la etiqueta: DOM, GSAP y Highway.js para las transiciones. Material en
`.refs3d/webs/ilcolorista-salon/` (mapa de escritorio y móvil, `probe/`, `interaccion/` con scroll, menú, transición y
páginas internas).

**Estructura** (5 páginas: home, servizi, metodo viso sartoriale, news, contatti):

1. Portada: «Atelier a Isola della Scala» en serif fina a la izquierda y un **mosaico de formas** a la derecha:
   círculos y cuadrados en tres tonos salmón, unos con foto de un trabajo dentro, otros de color liso.
2. Al bajar, el mosaico se desplaza y **las fotos se disuelven en color liso**: queda pura geometría, y de ahí sale el
   manifiesto en gris claro («da qui nasce metodo viso sartoriale») con dos enlaces.
3. Carrusel de tratamientos: retrato a sangre con flechas y la ficha del servicio abajo a la derecha.
4. «il nostro staff» en sans fina gris, gigante, y el equipo en **retratos circulares en blanco y negro** con nombre en
   serif y dos roles en pequeño.
5. News en rejilla de 4 columnas (imagen cuadrada, etiqueta, título en sans fina).
6. Revista descargable y newsletter en **bloques salmón con formas**; pie con correo, teléfono, dirección y horario
   («Tutti i giorni 8:30–18:30»).

**Servicios como carta de restaurante** («Menu primavera–estate 2026»): fondo crema, un círculo salmón con dos
pinceladas de acuarela verdeazuladas en la cabecera, y cinco secciones (Biondi sartoriali, Colorazioni, Benessere,
Taglio, Menù consulenza). Cada servicio es un **paquete con nombre propio** («Biondo Berlino», «Biondo Bali»), lo que
incluye («Consulenza intro + Air Touch + tonalizzazione + ricostruzione + piega») y el precio («Euro 169»), separados
por filetes. Nota final: «Consulenza intro 29 €, gratuita si luego pides cita». **No hay reserva en línea**: formulario
de contacto, WhatsApp y teléfono.

**Movimiento**:
- Transición entre páginas (Highway): la página se va a blanco con la marca (un mechón en acuarela salmón) en el
  centro; la nueva entra con su color de fondo y la forma de cabecera aparece fundiéndose y creciendo; el texto,
  después.
- Menú: capa oscura a pantalla completa (#1e1e1e); los enlaces en sans fina enorme suben escalonados con máscara y los
  filetes entre ellos se dibujan de izquierda a derecha; «vai al form» como enlace secundario a la derecha; redes
  abajo; «close ×».
- Formas del mosaico con `is-scroll-animated`: se mueven con el scroll y la foto de dentro se funde.

**Estilo** (para la guía «salón editorial», E10):
- Color: salmón #f5a490 y rosa #f8c4b6 (los de la ficha de Awwwards), un tercer tono más claro, crema en servicios,
  blanco en portada, #1e1e1e en el menú; logo en una caja azul marino.
- Tipo: Cormorant Garamond 200 para titulares (72 px, 5 vw, interlineado 1,1); Karla fina para todo lo demás, en
  minúsculas y gris claro en los titulares de sección («il nostro staff»); escala 14 · 21 · 24 · 40 · 72–110.
- Superficies planas sin sombras; formas geométricas como único adorno; mucho aire.

**Contra el kit**:

| Rasgo | En el kit | Decisión |
|---|---|---|
| Menú a pantalla completa con enlaces enormes | `FullscreenMenu` | Ampliar si se repite: filetes que se dibujan y subida escalonada con máscara |
| Carta de servicios con paquetes y precio | `MenuList` (layout `list`: `description`, `price`, `footnote`) | Cubierto |
| Equipo en retratos circulares B/N | `TeamSection` **sin fotos** (solo iniciales) | **Ampliar**: foto por persona, forma (círculo o recuadro) y tratamiento (color o B/N); reutilizar `Avatar` como hizo Codex en `Testimonial` |
| Horario y contacto en el pie | `OpeningHours`, `Footer` | Cubierto |
| Transición con la marca en el centro | `PageTransition` (View Transitions; sin marca) | Candidata a ampliar: una marca o dibujo propio en el centro durante el cambio |
| **Mosaico de formas con fotos que se disuelven en color** | no hay (`StickerCollage` y `RetroShapes` son otra cosa) | **Firma de la web.** Candidata a pieza (`ShapeMosaic`: rejilla de círculos y cuadrados con los tonos del tema, foto opcional en cada forma, deriva y disolución con el scroll); se decide en la síntesis de peluquería (E2) si se repite |
| Cabecera de forma con pinceladas de acuarela | no hay | Firma; decorado de demo, no pieza |

**Para las demos de la otra sesión** (Hebra, Esparta): la carta de servicios como paquetes con nombre y lo que
incluyen, y la consulta inicial gratuita si se reserva, son buenas ideas de contenido; el mosaico de formas daría a
Hebra una portada con más carácter.

### 3.2 Peluquerías y barberías (E2a–f)

Método: mapa de `cine:web` a 1440 × 900 y en móvil, y un perfil propio con Playwright (tipos y colores calculados por
superficie, navegación, enlaces de reserva, precios, titulares y ocho pantallas con rueda real). Todo en
`.refs3d/webs/<slug>/` (`estudio/montaje.jpg`, `estudio/perfil.json`).

#### E2a · ALICE Hair & Art — https://www.alicehairart.se/ (Framer)

![Montaje de alicehairart-se](/lab/cine/archivo/.refs3d/webs/alicehairart-se/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/alicehairart-se/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/alicehairart-se/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/alicehairart-se/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/alicehairart-se-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/alicehairart-se)

- **Estructura** (una página y `/art`): collage de fotos en B/N y color esparcidas sin rejilla, con la marca «ALICE»,
  «Hair · & Art» y la dirección en una sola línea a media altura → manifiesto → equipo → «current exhibition» con los
  cuadros que expone el salón → pie con formulario.
- **Equipo**: una fila por estilista, en tres columnas: nombre y @ de Instagram, biografía de tres líneas, foto en
  B/N a la derecha. Cada nombre lleva su enlace de reserva (Bokadirekt).
- **Reserva**: externa, **una por estilista** (Bokadirekt); no hay precios en la web.
- **Movimiento**: al bajar, las fotos del collage **se desenfocan y se funden** con el fondo antes de que entre el
  manifiesto. El conmutador «Hair / & Art» se rellena con una barra negra que avanza. La barra inferior (Info, correo,
  Instagram, «Up ↑») es fija.
- **Estilo**: **una sola letra** (Px Grotesk, 14 px, mayúsculas, espaciado 0,1 em) para todo; grises #f5f5f5,
  #f0f0f0 y #dedede con grano; texto #121212. El color lo ponen las fotos y los cuadros.

#### E2b · Rendezvous Barbers — https://www.myrendezvous.ca/ (GSAP, ScrollTrigger y Lenis)

![Montaje de myrendezvous-ca](/lab/cine/archivo/.refs3d/webs/myrendezvous-ca/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/myrendezvous-ca/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/myrendezvous-ca/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/myrendezvous-ca/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/myrendezvous-ca-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/myrendezvous-ca)

- **Estructura**: titular centrado en serif con cursiva mezclada («Toronto-based barbershops *specializing in the
  latest modern short hair styles*») → vídeo que crece desde una miniatura → «It's all about the pleasure to feel
  yourself» → **«Locations» gigante** y cinco locales en tarjetas de retrato con «+» → frase grande con una palabra en
  naranja → **«Clients»** con reseñas en B/N y carrusel → **la app** (móvil, tres pasos numerados, QR y tiendas) →
  blog («/paper», artículos de cuidado masculino).
- **Reserva**: «Book now» por local y «Download app» fijo arriba a la derecha; la reserva vive en su app.
- **Movimiento**: las palabras gigantes («Clients», «Our app») entran por el borde inferior de su sección y quedan
  cortadas, como asomando; el vídeo crece con el scroll.
- **Estilo**: naranja #ff622b, negro y blanco; GT Super (serif, 40–200 px, cursiva para el énfasis), GT Walsheim para
  el texto y **GT Alpina Typewriter en mayúsculas** para los datos (horarios, direcciones). Logo de tijeras.

#### E2c · Hair Me Up — https://hairmeup.pl (Cracovia)

![Montaje de hairmeup-pl](/lab/cine/archivo/.refs3d/webs/hairmeup-pl/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/hairmeup-pl/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/hairmeup-pl/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/hairmeup-pl/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/hairmeup-pl-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/hairmeup-pl)

- **Estructura** (Poznaj nas, Cennik, Blog, Akademia, Sklep, Kontakt): portada con un **arco melocotón** detrás del
  nombre y un sello circular «Rozpocznij przygodę» → cuatro servicios numerados 01–04 con filete → reseñas
  (TrustMate, 5,0, pestaña vertical fija a la derecha) → embajadores de Olaplex → productos de la tienda en carrusel
  (precio rebajado tachado) → academia con sus cursos → blog → marcas.
- **Reserva**: **dos píldoras fijas abajo**, una por salón («Umów wizytę na Grodzkiej / Basztowej»: Booksy y
  Saloner). Precios en página aparte («Cennik»).
- **Palabras de fondo**: cada sección lleva su nombre gigante en melocotón muy claro detrás («sklep», «akademia»,
  «blog»), en serif, cortado por los bordes.
- **Estilo**: #feede4 y #ffd5bf, botones teja #963e13, texto #2c2c2c; DM Serif Display para titulares (cursiva para
  el énfasis), Lora para el texto. Es la más «comercial»: tienda, academia y salón en una sola web.

#### E2d · Fruits Hair Lab — descartada (la web premiada ya no existe; ver §2)

#### E2e · Marco Ambrosi Concept Salon — https://www.marcoambrosi.salon/

![Montaje de marcoambrosi-salon](/lab/cine/archivo/.refs3d/webs/marcoambrosi-salon/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/marcoambrosi-salon/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/marcoambrosi-salon/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/marcoambrosi-salon/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/marcoambrosi-salon-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/marcoambrosi-salon)

La web de hoy no es la premiada en 2021, pero sirve como modelo de **salón especialista** (extensiones).

- **Estructura** (una página con anclas: Perché noi, Servizi, Prima e dopo, Recensioni, Contatti): portada con foto de
  melena a sangre, etiqueta «Hair extension specialist · Bussolengo (VR)» y titular con una palabra en cobre cursiva
  («Capelli più lunghi, più pieni. *Tuoi.*») → **por qué con un profesional**: dos sellos (Great Lengths Platinum,
  Top Hairstylists 2024) y cuatro razones en tarjetas → **comparación** «el presupuesto más bajo» frente a «el trabajo
  hecho en salón» (lista con ✗ y con ✓) → cinco servicios numerados con «a partire da» y precio → **antes y después**
  con tirador sobre la misma foto → trabajos en rejilla → «Il salone in movimento»: cuatro clips verticales que suenan
  al tocarlos → reseñas → contacto.
- **Reserva**: «Prenota su WhatsApp» como píldora cobre en la cabecera fija y en la portada.
- **Estilo**: oscuro (#141618, #1a1d20, tarjetas #202428), texto #9aa0a6 y #f2f0ed, acento cobre #e0b183; Playfair
  Display para titulares, Outfit 300 para el texto; tarjetas con borde fino y radio 12 px.

#### E2f · Don Barber & Groom — https://don-barber.gr/en (Atenas)

![Montaje de don-barber-gr-en](/lab/cine/archivo/.refs3d/webs/don-barber-gr-en/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/don-barber-gr-en/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/don-barber-gr-en/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/don-barber-gr-en/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/don-barber-gr-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/don-barber-gr-en)

- **Estructura**: portada partida: foto del local a la izquierda con **cuatro servicios en gótica condensada enorme**
  (Barbering, Detailed pricelist, Grooming & wellness, Manicure & pedicure), producto propio a la derecha y una
  **cinta «Welcome to Don's world»** que corre abajo → «La familia»: el nombre del dueño gigante sobre su retrato,
  fondo azul gris → marcas y «Shop in shop» → «Services» gigante con tres servicios (el central en óvalo) → «News» en
  tres columnas → pie con la cinta otra vez.
- **Menú**: panel a la derecha sobre fondo topo, con la foto de portada a la izquierda; enlaces en mayúsculas con
  subenlaces (Profile: timeline, gallery, the team), una tarjeta «Keep it handsome» y «Exit» en un óvalo.
- **Reserva**: «Book now» lleva al contacto; precios en una página propia.
- **Estilo**: PF Grand Gothik (ancha para el texto, 12 px; **condensada a 100 px** para los titulares, interlineado
  0,8); azul gris #7e929c, topo #757171, hueso #eceae0; botones en **óvalo de contorno**.

### 3.3 Síntesis de peluquería (E2z)

`cine:sintesis` con Il Colorista y las cinco ([sintesis.md](/lab/cine/archivo/.refs3d/sintesis/peluqueria/sintesis.md)): ninguna usa 3D; lo que se
repite es de maquetación y de contenido, no de técnica.

**Qué se repite** (de 6):

| Rasgo | Webs | En el kit | Decisión |
|---|---|---|---|
| Equipo **con fotos** (B/N en 4) y su enlace o su biografía | 5 (Colorista, ALICE, Rendezvous en reseñas, Marco, Don) | `TeamSection` solo con iniciales | **Ampliar `TeamSection`** (E12): foto, forma (círculo, recuadro, óvalo), tratamiento B/N, biografía, @ y enlace de reserva por persona; disposición en filas (ALICE) además de rejilla |
| Reserva **externa** (Bokadirekt, Booksy, Saloner, WhatsApp, app) o por contacto | 6 | `ActionBar`, `Button` | Las demos pueden mantener la reserva propia (Hebra y Esparta lo hacen mejor), pero la plantilla debe admitir un botón por estilista o por local que salga fuera |
| Botón de reserva **siempre a la vista** (cabecera, píldoras fijas abajo) | 4 | `ActionBar`, `NavBar` | Cubierto; receta: dos píldoras si hay dos locales |
| **Palabra gigante** como título de sección, cortada por el borde o detrás del contenido | 4 (Rendezvous, Hair Me Up, Don, Colorista «il nostro staff») | `FitText`, `SectionHeader` | **Ampliar `SectionHeader`** con un modo «palabra de fondo» (detrás, en tono claro, cortada) o receta con `FitText`; se decide en E12 |
| Precios en página propia o como carta | 4 | `MenuList`, `PricingSection` | Cubierto |
| Blog o noticias de cuidado | 4 | `ArticlesSection`, `BlogCard` | Cubierto |
| Tienda de producto o marcas | 3 (Hair Me Up, Don, Rendezvous con la app) | `ProductCard`, `LogoCloud` | Cubierto |
| Titular serif con **una palabra en cursiva o en el acento** | 4 | `SplitText` / marcado | Receta, no pieza |
| Varios locales con su ficha | 2 (Rendezvous, Hair Me Up) | no hay sección | Receta con tarjetas de retrato y `OpeningHours`; pieza solo si sale en gimnasios (cadenas) |
| Antes y después | 1 (Marco) | `BeforeAfter` | Cubierto |
| Cinta de texto que corre | 1 (Don) | `Marquee` | Cubierto |
| App con QR y tiendas | 1 (Rendezvous) | `QRCode`, `DeviceMockup` | Cubierto |

**`ShapeMosaic`: no se hace.** El mosaico de formas solo está en Il Colorista; ALICE tiene otro collage (fotos sueltas
que se desenfocan al bajar), que se compone con `StickerCollage` o `ImageTrail` y un desenfoque con el scroll. Queda
como decorado de demo; se vuelve a mirar si aparece en gimnasios o academias.

**Plantilla de salón** (para E11): portada con titular y foto o collage → manifiesto corto → servicios (carta con
paquetes o 3–5 servicios numerados con «desde») → equipo con fotos y reserva por persona → trabajos (rejilla o antes y
después) → reseñas con nota → locales y horario → blog o tienda (opcional) → pie con contacto. Reserva fija.

**Dos guías de estilo** (para E10):

- **Salón editorial claro** (Il Colorista, ALICE, Hair Me Up): fondo claro o pastel cálido (salmón, melocotón, gris
  con grano), serif fina o una sola grotesca en mayúsculas pequeñas, fotos en B/N, mucho aire, sin sombras, acento
  terroso para los botones.
- **Barbería de carácter** (Rendezvous, Don, Marco): un acento saturado o metálico (naranja #ff622b, cobre #e0b183) o
  una paleta apagada (azul gris y topo) con contraste fuerte; titulares enormes en serif con cursiva o en gótica
  condensada; datos en máquina de escribir o mayúsculas anchas; botones en óvalo o píldora.

**Para Hebra y Esparta** (la otra sesión): la reserva propia con profesional y agenda ya supera a las seis; les falta
**fotos en el equipo** (esperan a `TeamSection`), los **títulos de sección gigantes** y, en Esparta, una tipografía
con más carácter (gótica condensada de Don o la serif cursiva de Rendezvous). Hebra puede tomar el manifiesto con
foto difuminada de ALICE y la carta con paquetes de Il Colorista.

### 3.4 Gimnasios y estudios de entrenamiento (E3a–f)

Mismo método que §3.2. Ninguna usa 3D; tres llevan GSAP y una, Barba (transición entre páginas).

#### E3a · Core Atelier Pilates — https://coreatelierpilates.com/ (GSAP, Lenis, Barba)

![Montaje de coreatelierpilates-com](/lab/cine/archivo/.refs3d/webs/coreatelierpilates-com/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/coreatelierpilates-com/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/coreatelierpilates-com/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/coreatelierpilates-com/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/coreatelierpilates-com-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/coreatelierpilates-com)

- **Estructura** (About, Classes, Book, Shop, Events, Contact, Sign in, con área de socio: reservas, paquetes y
  pedidos): la captura cae en «core classes». Foto del estudio a sangre → titular «core *classes*» con foto
  superpuesta → **«semi private *small group classes*»**: un acordeón de aparatos (Reformer, Stability Chair, Tower &
  Arc Barrel, Curated by Core) en el que **cada pestaña abierta cambia la foto fijada a la derecha** → «private
  *sessions*» en tres tarjetas (private, duet, trio) → reserva.
- **Reserva**: propia, con cuenta y paquetes («packages required»).
- **Movimiento**: Barba entre páginas; la foto de la derecha queda fija mientras pasa el acordeón.
- **Estilo**: rosa empolvado #f7e7de, marrón #744c32 y casi negro #25140c; **Minion Pro con la mitad del titular en
  cursiva** («semi private / *small group classes*») y Albert Sans 16–18 px para el texto; etiquetas en mayúsculas de
  13 px. Es el «salón editorial» llevado al pilates.

#### E3b · Essor Fitness — https://coachsportifecublens.com/ (Framer)

![Montaje de coachsportifecublens-com](/lab/cine/archivo/.refs3d/webs/coachsportifecublens-com/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/coachsportifecublens-com/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/coachsportifecublens-com/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/coachsportifecublens-com/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/coachsportifecublens-com-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/coachsportifecublens-com)

- **Estructura** (Home, Équipe, Services, Contact y «Je me lance»): «Coaching Sportif & Nutritionnel à Ecublens» con
  el diploma del entrenador en vídeo → **«Essor Fitness™» a todo el ancho** → nota (★ 4,85/5, 60+ reviews) y lista de
  objetivos → retrato del entrenador con la promesa y «Passez à l'action» → socios en rejilla de logos → **«Studio
  privé haut de gamme» desfilando de lado** → cuatro fichas numeradas (Le Studio 01, Timothy 02, Christophe 03,
  Mission 04) → «Nos Services» con cinco filas numeradas → manifiesto con retratos detrás.
- **Precios**: en las páginas de servicio (110–180 CHF).
- **Movimiento**: titulares que cruzan la pantalla con el scroll y **cintas blancas de texto** (Personal Training,
  Duo Training, Coaching semi-privé) que separan secciones; fotos que se agrandan desde una miniatura.
- **Estilo**: negro absoluto y blanco, grises #999 y #bbb; **Inter Display 600 a 208 px con espaciado −8 px**;
  botones en píldora de contorno. Muy parecida en espíritu a «barbería de carácter».

#### E3c · Between The Ears — descartada

![Montaje de btwntheears-com](/lab/cine/archivo/.refs3d/webs/btwntheears-com/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/btwntheears-com/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/btwntheears-com/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/btwntheears-com/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/btwntheears-com-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/btwntheears-com)

El dominio es hoy una consulta de psicoterapia y coaching («let's face your life head on»), no el gimnasio de
longevidad premiado. Solo vale de ella **la onda de puntos** de la portada, que ya hacen `PointCloud` o
`GradientField`.

#### E3d · FIT AND YOU — https://fit-and-you.webflow.io/ (Webflow, GSAP)

![Montaje de fit-and-you-webflow-io](/lab/cine/archivo/.refs3d/webs/fit-and-you-webflow-io/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/fit-and-you-webflow-io/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/fit-and-you-webflow-io/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/fit-and-you-webflow-io/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/fit-and-you-webflow-io-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/fit-and-you-webflow-io)

- **Estructura** (una página: Classes, Bonuses, Memberships, Locations y «Join now [+]»): «IT'S NOT FITNESS. *IT'S
  LIFE.*» sobre vídeo → **fotos y círculos negros con texto en damero** (Unparalleled personal training, Unrivaled
  group fitness) → «Membership with ✕ best benefits» y un **círculo naranja «Join now»** → **«Our classes» como lista
  de nombres enormes** con filetes, agrupados por zona (Exclusive studio, Group fitness, Spa) sobre un vídeo en B/N →
  **cifras en cinta** («4 clubs · 45 min workout · 20 activities») → **«Bonuses for you»: cuatro tarjetas ladeadas**
  alrededor del titular → planes (50–150 $).
- **Estilo**: negro, blanco y **naranja #fb5607**; Antonio 700 condensada en mayúsculas (158 px, espaciado −9,5 px),
  Inter 12–14 px; el «[+]» como firma de los enlaces. Menú en isla redondeada.

#### E3e · Skulpt Fitness — https://www.skulptfitness.nl (Grou, Países Bajos)

![Montaje de skulptfitness-nl](/lab/cine/archivo/.refs3d/webs/skulptfitness-nl/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/skulptfitness-nl/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/skulptfitness-nl/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/skulptfitness-nl/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/skulptfitness-nl-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/skulptfitness-nl)

- **Estructura** (Aanbod, Over ons, Contact): «SPORT VANDAAG. GROEI MORGEN.» con el párrafo a la derecha y un botón
  redondo lima con flecha → foto a sangre que se abre con **borde curvo** → frase de humor en tres líneas escalonadas
  («Jouw bank ligt veel lekkerder als je er uitgeput op ligt») → tres ventajas con foto (coaches, aparatos, **café
  gratis**) → **cinta lima** «Start snel. Eindig sneller.» → lista de lo que incluye → oferta numerada 01–03 → planes
  (Individueel, Familie, Student) con **conmutador mes/año** y planes Hyrox aparte.
- **Menú**: pantalla entera con **tres columnas verticales** (Aanbod, Over ons, Contact en letra girada 90°) y la
  columna de datos con horario de apertura y de personal.
- **Reserva**: «Gratis proefles» (clase de prueba gratis) fijo arriba en lima; horario largo (6:00–23:00).
- **Estilo**: #f5f5f5 y #202020, **lima #cef952**; Pilat Condensed 800 en mayúsculas para titulares, Suisse Intl
  Book para el texto; bordes curvos de sección.

#### E3f · Fenriz Gym — https://www.fenriz-gym.com/ (Berlín; GSAP)

![Montaje de fenriz-gym-com](/lab/cine/archivo/.refs3d/webs/fenriz-gym-com/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/fenriz-gym-com/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/fenriz-gym-com/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/fenriz-gym-com/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/fenriz-gym-com-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/fenriz-gym-com)

- **Estructura** (Kurse, Events, Preise, Kursplan, Über uns, Probetraining; DE/EN): «MARTIAL ARTS. FROM KREUZBERG.
  WITH LOVE.» sobre foto en B/N con **una franja degradada** (amarillo, rojo, azul) que es la firma de la marca →
  «Unsere Kurse» con el subrayado degradado y **seis disciplinas en tarjetas de retrato B/N con el nombre encima**
  (Muay Thai, BJJ, MMA, Boxen, Fitness, Recovery) → **Probetraining** → «Über uns» con federaciones → **Events**
  (carteles en duotono de color) → pie.
- **Menú**: panel negro a la derecha que cae desde «Menu ≡», con el degradado arriba, enlaces en mayúsculas,
  secundarios (Mitglieder, Shop, Hilfe) y «Probetraining» como botón.
- **Estilo**: B/N con un solo degradado de color; Kenyan Coffee 700 (condensada, 90 px) y Roboto 300.

### 3.5 Síntesis de gimnasio (E3z)

`cine:sintesis` con las cinco válidas ([sintesis.md](/lab/cine/archivo/.refs3d/sintesis/gimnasio/sintesis.md)): titulares gigantes y galerías en las
5, navegación fija y varias páginas en 4, GSAP en 3.

| Rasgo | Webs | En el kit | Decisión |
|---|---|---|---|
| **Titular condensado en mayúsculas** enorme (Antonio, Pilat, Kenyan Coffee, Inter Display apretada) | 4 | `FitText`, `Hero` | Receta y guía; nada nuevo |
| **Clase de prueba gratis** como llamada principal (Gratis proefles, Probetraining, «obtenez votre séance d'essai») | 4 | `Button`, `ActionBar`, `CTASection` | Receta: la llamada fija es «prueba gratis», no «reservar» |
| **Disciplinas en tarjetas de retrato con el nombre encima** o como lista de nombres gigantes | 4 (Fenriz, FIT AND YOU, Skulpt 01–03, Essor 01–05) | `ImageGallery`, `ProjectList`, `HoverFX` | Cubierto (lista con filetes = `ProjectList`; tarjetas = galería) |
| Planes con **mes/año**, familia, estudiante | 3 (Skulpt, FIT AND YOU, Essor por servicio) | `PricingSection` (`toggle`, `yearlyPeriod`) | Cubierto |
| **Cinta de texto** o de cifras entre secciones | 3 (Skulpt, Essor, FIT AND YOU) | `Marquee`, `StatCounter` | Cubierto |
| Un solo **acento saturado** sobre negro o gris (naranja, lima, degradado) | 4 | tokens `--acc` | Guía |
| Fotografía de grupo o de lucha en **B/N** | 3 | — | Guía (tratamiento de imagen) |
| Horario de apertura largo y **horario de clases** (Kursplan, Book) | 3 | `OpeningHours`; Cadencia y Forja tienen su horario de clases en el sitio | **Candidata a pieza** (`ClassSchedule`: semana × franjas, filtro por disciplina, plazas y lista de espera), sacándola de Cadencia y Forja; se decide en E12 |
| Acordeón que **cambia la foto fijada** al lado | 1 (Core) | `FeatureExplorer`, `ExpandingPanels` | Comprobar en E12 si `FeatureExplorer` lo cubre |
| Menú a pantalla entera con **columnas verticales** | 1 (Skulpt) | `FullscreenMenu` | Variante candidata, junto a la de Il Colorista (E12) |
| Área de socio (reservas, paquetes, pedidos) | 1 (Core) | Cadencia y Forja ya la tienen | — |
| Equipo con fotos | 2 (Essor, Core en clases) | `TeamSection` sin fotos | Refuerza la ampliación de E2 |

**Plantilla de gimnasio** (para E11): portada con lema en condensada y vídeo o foto B/N → prueba gratis → disciplinas
o clases (tarjetas o lista gigante) → por qué nosotros (3 ventajas con foto, una con humor) → cinta de cifras →
horario de clases → planes con mes/año → equipo → ubicación y horario → pie. Llamada fija: prueba gratis.

**Dos guías de estilo** (para E10):

- **Club de alto contraste** (FIT AND YOU, Skulpt, Fenriz, Essor): negro o gris claro, un acento saturado (naranja
  #fb5607, lima #cef952 o un degradado de marca), condensada en mayúsculas a 90–200 px con espaciado negativo,
  fotos en B/N, botones en píldora o círculo.
- **Estudio boutique** (Core Atelier): la del «salón editorial» con tonos tierra (rosa empolvado, marrón), serif con
  cursiva, fotos cálidas y reserva con cuenta. Sirve para pilates, yoga y estudios privados.

**Para Cadencia y Forja**: van por delante en producto (planificador, reservas, lista de espera, área personal).
Les faltan la **clase de prueba gratis** como llamada principal, la **cinta de cifras** y, en Cadencia, la lista de
disciplinas gigante de FIT AND YOU. Forja (oscura) encaja con la guía de alto contraste; un acento único saturado y
fotos B/N la acercarían a Fenriz.

### 3.6 Academias (E4–E6)

Mismo método que §3.2. En Future London Academy, el perfil cayó en la página de profesores y el scroll se atascó en el
pie; la portada se volvió a capturar con `scrollTo` (la página mueve el documento entero, no reacciona a la rueda
sintética).

#### E4 · Surfing Academy — https://surfing.academy/ (Lenis)

![Montaje de surfing-academy](/lab/cine/archivo/.refs3d/webs/surfing-academy/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/surfing-academy/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/surfing-academy/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/surfing-academy/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/surfing-academy-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/surfing-academy)

- **Qué es**: no es una escuela con local, sino **la academia de un entrenador** (Andrey Khurtin): viajes de surf
  por convocatorias, curso en línea, surfskate y vlogs. La marca es la persona: su avatar con el nombre escrito a mano
  va fijo arriba a la izquierda en todas las pantallas.
- **Estructura** (una página por anclas y una por destino: /mentawai, /g-land, /maldives…): portada con «your
  surfing progress *(starts here)*» y un **dibujo de línea** de cuatro surfistas con la tabla, con tres notas sueltas
  sobre el dibujo (método, mentores, destinos) → **calendario de viajes** en filas: destino, **etiquetas de nivel**
  (beginner, intermediate, advanced, en negro), una línea de qué lo hace especial, **convocatorias por mes** con sus
  fechas y «learn more» → «(about me)» en una tarjeta verde con forma de **billete troquelado** → «*the core of my
  approach»: cuatro principios con una foto suelta cada uno → cifras (140 000+ seguidores, 30 000 000+
  visualizaciones, 1 000+ alumnos) → «(the first introductory lesson is **a gift** for you!)» con vídeo → dos bandas
  de llamada (analizar tus errores, empezar el curso) → «((reviews))».
- **Reserva**: por convocatoria; chat flotante abajo a la derecha. Primera clase gratis.
- **Móvil**: la misma página apilada; el avatar fijo se queda encima del contenido (un fallo).
- **Estilo**: gris claro #ededed y blanco, **naranja #ff4f28** y verde #39be91; Hauora en **minúsculas** para todo
  (16 px, titulares 40–64 px), títulos entre paréntesis y asteriscos como tic tipográfico; botones naranja con
  **sombra dura desplazada** en negro; garabatos a mano (subrayados, flechas, llamas).

#### E5 · Future London Academy — https://futurelondonacademy.co.uk/

![Montaje de futurelondonacademy-co-uk](/lab/cine/archivo/.refs3d/webs/futurelondonacademy-co-uk/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/futurelondonacademy-co-uk/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/futurelondonacademy-co-uk/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/futurelondonacademy-co-uk/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/futurelondonacademy-co-uk-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/futurelondonacademy-co-uk)

- **Estructura** (Courses, Tailored solutions, Teachers, Journal, Contact y «Log in»): portada amarilla con «WE CREATE
  LEARNING EXPERIENCES» y una **F gigante de líneas blancas** → foto de clase y **muro de profesores**
  («200+ famous teachers and mentors»: retratos en cuadrícula con nombre y empresa, «Explore all») → **cursos
  destacados como tarjetas amarillas que se solapan** (Tailored, Executive Programme, Mini-MBA), cada una con su
  formato en chips (anytime, online, upon request, next cohort) → **lista de cursos** a todo el ancho con el formato
  en letra de contorno («SELF-PACED, ONLINE») y flecha → testimonio con retrato B/N y flechas → **muro de logos**
  («We have already inspired people from these companies»: BMW, Microsoft, Nike, IKEA…) → Instagram, redes y
  boletín.
- **Solicitud**: en cada ficha de curso; hay cuenta de alumno.
- **Estilo**: **amarillo #ffe32b**, negro #1a1a1a y gris #f1f1f1; una sola letra (OnyFuture) en mayúsculas para
  titulares (40 px, espaciado −2 px) y la misma en contorno para el formato; fotos documentales de las clases.

#### E6 · Honhar — https://honhar.in/ (GSAP, Lottie)

![Montaje de honhar-in](/lab/cine/archivo/.refs3d/webs/honhar-in/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/honhar-in/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/honhar-in/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/honhar-in/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/honhar-in-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/honhar-in)

- **Qué es** (sector confirmado): **instituto de formación profesional** en Mohali (marketing digital, diseño, ventas),
  respaldado por una agencia.
- **Estructura** (Programs, H Movement, Mentors, Honhar Tales, Outcomes y «Enroll Now»): portada amarilla con una
  **escena 3D de pollitos** en una pizarra («हम GYAAN नहीं SKILLS बांटते हैं») → **sellos de valoración** en
  recuadros (Trustpilot, Glassdoor, Google… «Rated 4.8/5») → «Tricity's most *practical skill* academy» → **cifras en
  recuadros** (625+ alumnos, 6 promociones, 17 masterclasses) → cuatro principios con la palabra tachada («~~LEARN~~
  Work on live campaigns») → logos de prensa → **programas en tarjetas** con «Launching soon», la promoción («batch-12»),
  chips (12 semanas, 9 módulos, presencial), lo que incluye, mentores en avatares y «Apply now» / «Pre-book demo
  class» → próximos talleres y masterclasses → «Launching soon!» con tarjetas difuminadas → «**masterclass gratis
  antes de cada curso**» → resultados («22 alumnos han montado su empresa») → testimonios en vídeo B/N.
- **Estilo**: **amarillo #ffcc00** y negro, tarjetas blancas o negras; **neobrutalismo**: botones blancos con borde
  y **sombra negra desplazada**, recuadros con borde; Magic Brush (pincel) para titulares en mayúsculas, Montserrat
  para el texto.

### 3.7 Síntesis de academia (E7)

`cine:sintesis` con las tres ([sintesis.md](/lab/cine/archivo/.refs3d/sintesis/academia/sintesis.md)): ninguna usa WebGL
(la escena de pollitos de Honhar es una animación); varias páginas en las 3. Lo que importa es el contenido:

| Rasgo | Webs | En el kit | Decisión |
|---|---|---|---|
| **Programas por convocatoria**: nombre, nivel, formato (presencial, en línea, a tu ritmo), duración, **fechas de la próxima promoción** y solicitar | 3 | no hay pieza (`PricingSection` y `ProductCard` son otra cosa; `ClassSchedule` es semanal) | **Candidata a pieza** (`CohortList`: filas o tarjetas con chips de formato y nivel, convocatorias con fechas, estado «abierta / últimas plazas / próximamente» y CTA); E12 |
| **Primera clase o masterclass gratis** | 2 (Surfing, Honhar) | `CTASection` | Receta: como la prueba gratis de los gimnasios |
| **Profesorado como muro** (retrato, nombre, empresa) o el autor como marca | 3 | `TeamSection` (ya con fotos) | Cubierto; falta la disposición en muro denso (cuadrícula sin hueco) → variante `layout="wall"` en E12 |
| **Prueba social**: logos de empresas, sellos de valoración, cifras grandes | 3 | `LogoCloud`, `StatsSection`, `StatCounter` | Cubierto; los sellos con nota («Rated 4.8/5») son una variante de `LogoCloud` |
| Testimonios con retrato B/N o en vídeo | 3 | `TestimonialSection`, `VideoPlayer` | Cubierto |
| Lista de cursos a todo el ancho con flecha | 1 (FLA) | `ProjectList` | Cubierto |
| Tarjetas destacadas que se solapan | 1 (FLA) | `StackedCards` | Cubierto |
| Botones con **sombra dura desplazada** | 2 (Surfing, Honhar) | variante `retro` del kit | Comprobar en E10 que `retro` lo da sin tocar nada |
| Ilustración de línea y garabatos a mano | 1 (Surfing) | `LineDraw` | Decorado de demo |

**Plantilla de academia** (para E11), con dos páginas además de la portada:

- *Portada*: promesa + CTA a la próxima convocatoria → cifras y sellos → programas por convocatoria → método en 3–4
  principios → profesorado → testimonios → clase gratis → logos → boletín.
- *Catálogo*: lista de programas con filtros (formato, nivel, área) y estado de la convocatoria.
- *Ficha de programa*: qué aprendes, temario por módulos (`Accordion`), profesorado, convocatorias y precio,
  preguntas frecuentes y solicitud por pasos (`Stepper` + `TextField`).

**Dos guías de estilo** (para E10):

- **Academia de autor** (Surfing): gris claro, un naranja y un verde, todo en minúsculas, títulos entre paréntesis,
  ilustración de línea y garabatos; el retrato del autor como marca fija.
- **Escuela amarilla** (FLA, Honhar): amarillo saturado y negro, mayúsculas, recuadros y sombras duras
  (neobrutalismo en Honhar, editorial en FLA), fotos documentales de las clases.

**El copy por defecto del kit** (escuela de surf de Cantabria) se queda: encaja con Surfing Academy en tono (cercano,
de progreso) aunque ellos venden viajes y no clases en una playa fija.

### 3.8 Producto: Peppa Sauce (E8) — https://www.peppasauce.love/

![Montaje de peppasauce-love](/lab/cine/archivo/.refs3d/webs/peppasauce-love/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/peppasauce-love/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/peppasauce-love/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/peppasauce-love/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/peppasauce-love-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/peppasauce-love)

- **Qué es**: la salsa picante de una familia («Mama Joyce Peppa Sauce, Fiery Blasian Hot Sauce», de Guyana). Una sola
  página; la compra sale a otra tienda.
- **El bote fijo**: la botella (`div.bottle`, fija) se queda en el centro de la pantalla mientras toda la página pasa
  por detrás; a veces se aparta a un lado (en «A taste of Guyana» queda cortada en el borde derecho). Es el concepto de
  la web: **el producto como objeto que acompaña al scroll**.
- **Estructura**: tres tarjetas con marco de etiqueta antigua (estrellas, llamas, gotas, lunas en las esquinas): la
  historia de Mama Joyce, el sello circular de la marca y «Blasian hot sauce · 2,400 SHU» → «A taste of Guyana» con
  el mapa y una **cinta de texto en el marco** («WTF IS GUYANA») → **maridajes en palabras gigantes** con
  ilustración: «the best with EGG», «goes great with CHICKEN», «STEAK» → la abuela ilustrada y «hand milled» → «this
  sauce is not for EVERYTHING» a toda pantalla → «Flavor meet heat» → **lo que no**: «don't ruin it with MINT»,
  «leave out the RASPBERRY», «CEREAL» → «Buy the damn stuff».
- **Movimiento**: pantalla de carga y cortinilla (`page-cover`), cursor propio, cinta «BUY NOW ✶» fija arriba.
- **Tono**: con humor y descaro («WTF is Guyana», «Buy the damn stuff»); la familia y el origen como argumento.
- **Estilo**: **azul noche #141329** y **crema #feeee2** (dos tintas, como una serigrafía), ilustraciones planas en
  gris azulado; Obviously (grotesca ancha, 50–245 px, espaciado negativo) y Vulf Sans en mayúsculas para el texto.

**Contra el kit y docs/07**:

| Rasgo | En el kit | Decisión |
|---|---|---|
| Producto fijo que acompaña al scroll | `ObjectStage`, `Traveler` (entre rutas), `PinnedSection` | Comprobar en E12 si `ObjectStage` admite una imagen (no 3D) fija con posiciones por sección; si no, receta con `position: sticky` |
| Palabras gigantes con ilustración y nota pequeña al lado | `FitText` | Receta |
| Cinta de compra fija | `Marquee` | Cubierto |
| Tarjetas con marco de etiqueta (esquinas ornamentales) | no hay | Decorado de demo |
| Dos tintas | tokens | Guía «producto de marca»: `--bg` y `--fg` y nada más; el color lo ponen el producto y la foto |

La fórmula de producto de docs/07 (Linear, Stripe: SaaS) no sirve para un producto de consumo: aquí no hay
funciones ni precios, hay **origen, maridajes y tono**. La guía «producto de marca» (E10) sale de esta web.

### 3.9 Navegación y transiciones: K72 (E9) — https://k72.ca/en

![Montaje de k72-ca-en](/lab/cine/archivo/.refs3d/webs/k72-ca-en/estudio/montaje.jpg)

Capturas: [montaje](/lab/cine/archivo/.refs3d/webs/k72-ca-en/estudio/montaje.jpg) · [pantallas del mapa](/lab/cine/archivo/.refs3d/webs/k72-ca-en/pantallas) · [tira](/lab/cine/archivo/.refs3d/webs/k72-ca-en/tira.jpg) · [móvil](/lab/cine/archivo/.refs3d/webs/k72-ca-movil/tira.jpg) · [carpeta](/lab/cine/archivo/.refs3d/webs/k72-ca-en)

Fotogramas de la navegación en [nav/](/lab/cine/archivo/.refs3d/webs/k72-ca-en/nav): menú
([apertura](/lab/cine/archivo/.refs3d/webs/k72-ca-en/nav/m-menu.jpg), [hover y cierre](/lab/cine/archivo/.refs3d/webs/k72-ca-en/nav/m-menu2.jpg))
y paso a Work ([fotogramas](/lab/cine/archivo/.refs3d/webs/k72-ca-en/nav/m-work2.jpg)), cada 100–150 ms.

- **Portada sin scroll**: una sola pantalla. Fondo de **vídeos que se suceden** (campañas de la agencia), encima
  «THE SPARK FOR ALL [vídeo] THINGS CREATIVE» con **un vídeo pequeño metido en el titular** como si fuera una palabra
  y una elipse lima dibujada alrededor de «CREATIVE»; dos **píldoras de contorno gigantes**, WORK y AGENCY, y la
  **hora de Montreal** en directo abajo a la izquierda. Al pasar por WORK, la píldora y el texto se vuelven lima.
- **Transición en escalera** (la firma): al navegar, unos **bloques negros bajan en escalera** desde la esquina
  superior derecha (cinco columnas, cada una con retraso) hasta tapar la pantalla; en la página nueva, la misma
  escalera en gris se retira y deja ver el contenido. Unos 600 ms en cada sentido. El menú se abre con la misma
  escalera.
- **Menú**: negro a pantalla completa, **cuatro filas** (WORK, AGENCY, CONTACT, BLOG) separadas por filetes y centradas
  en mayúsculas enormes; abajo, hora, avisos legales y redes en **píldoras de contorno**; arriba, EN/FR y una cruz
  fina. **Al pasar por una fila, esta gira y se convierte en una banda lima** con una **marquesina** que repite otra
  frase («KNOW US», «SEND US A FAX», «READ ARTICLES») intercalada con **imágenes en píldora**. Es lo más original de
  la web.
- **Work**: «WORK¹⁷» (el número de proyectos en superíndice) y rejilla de dos columnas; al pasar por un proyecto, las
  esquinas se redondean y aparece «VIEW PROJECT» en una píldora; **una barra fina arriba dice qué proyecto estás
  viendo** (cliente, título y año) y cambia con el scroll.
- **Estilo**: negro, blanco y **lima #d3fd50**; grotesca neutra en mayúsculas, píldoras de contorno como único botón.

**Contra el kit**:

| Rasgo | En el kit | Decisión |
|---|---|---|
| Transición en escalera de bloques | `PageTransition` tiene `blinds` (franjas) pero no escalera | **Ampliar** `PageTransition` con `kind="stairs"` (columnas con retraso escalonado, dirección y color del tema); vale también para abrir un menú (E12) |
| Fila del menú que gira a banda con marquesina | `FullscreenMenu` (sin efecto de fila) y `Marquee` | **Ampliar** `FullscreenMenu` con `linkHover="marquee"`: la fila se vuelve banda del acento con una marquesina del `meta` del enlace e imágenes opcionales (E12) |
| Vídeo dentro de un titular | no hay | Candidata pequeña: un `InlineMedia` (vídeo o imagen en píldora del alto de la línea) o receta con `SplitText`; se decide en E12 |
| Hora local en directo | `LocalTime` | Cubierto |
| Barra superior con el proyecto en vista | no hay | Receta con `IntersectionObserver` sobre `ProjectList` / `ImageGallery` |
| Píldoras de contorno gigantes | `Button` `emphasis="outline"` | Cubierto |

No hace falta una ronda de cine completa (docs/35): no hay 3D; son dos ampliaciones del kit y una receta.
