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

- [ ] **E1 · Il Colorista Salon** (Awwwards: https://www.awwwards.com/sites/il-colorista-salon)
  - Sacar la URL real de la ficha de Awwwards; anotar premio, fecha y créditos.
  - Mapa, estilo y transiciones. Mirar: cómo presenta servicios y precios, el equipo, la reserva y la galería de
    trabajos; el tono (lujo, color, editorial).
  - Salida: guía de estilo «salón editorial» y contraste con Hebra y Esparta.
- [ ] **E2 · Buscar 3–4 webs más de peluquería, barbería o estética** en Awwwards (SOTD, Honorable Mention o
  nominadas), para que la síntesis tenga con qué cruzar. Anotarlas aquí antes de estudiarlas.

### Gimnasio y deporte

- [ ] **E3 · Buscar 3–4 webs de gimnasio, estudio de entrenamiento, yoga o club deportivo** en Awwwards (no hay
  ninguna en la lista del usuario todavía). Anotarlas aquí y estudiarlas con §1.
  - Mirar: horario y reservas, planes y precios, entrenadores, energía del movimiento (vídeo, tipografía, cortes).
  - Contraste con Cadencia y Forja.

### Academia y centros de formación

- [ ] **E4 · Surfing Academy** — https://surfing.academy/
  - Escuela de surf: cursos, niveles, calendario o reserva, ubicación, galería. Mirar si hay vídeo o canvas en la
    portada y cómo lo resuelve en móvil.
  - Los defaults de copy del kit ya son de una escuela de surf: comparar con lo que hacen ellos.
- [ ] **E5 · Future London Academy** — https://futurelondonacademy.co.uk/
  - Academia de formación ejecutiva y creativa: catálogo de cursos, fichas de curso (programa, fechas, precio,
    profesorado), testimonios, logos de empresas, solicitud.
  - Salida: plantilla «academia» con páginas de catálogo y de curso.
- [ ] **E6 · Honhar** — https://honhar.in/
  - Confirmar sector al mapearla (por el nombre, oficio o talento; puede ser formación o plataforma de artistas).
    Estudiar dentro de academia si encaja; si no, como referencia de maquetación.
- [ ] **E7 · Síntesis de academia** (`cine:sintesis` con E4–E6 y las que se añadan): plantilla común, guía de estilo y
  piezas que falten (catálogo de cursos con filtros, ficha de curso, calendario de convocatorias, solicitud por pasos).

### Producto

- [ ] **E8 · Peppa Sauce** — https://www.peppasauce.love/
  - Producto de consumo (salsa): presentación del producto, sabores, dónde comprar o tienda, tono de marca. Mirar 3D o
    animación del bote, color y tipografía.
  - Salida: guía de estilo «producto de marca» y contraste con la fórmula de producto de docs/07.

### Transiciones, maquetación y navegación

- [ ] **E9 · K72** — https://k72.ca/en
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
- [ ] **E12 · Piezas nuevas o ampliadas** que salgan de las síntesis, con la lista de versatilidad de docs/36 §1,
  catálogo y docs/README.

## 3. Conclusiones por web

(Se rellena al cerrar cada tarea.)
