# Encargo para Codex: segundas imágenes de las inspiraciones

> 28-10-2026, de la sesión de Claude (rama `feat/cine-captura`, worktree `C:/COMPARTIDO/trama-estudios`). Las 18
> inspiraciones ya tienen varias páginas (docs/56 §7). Algunas fichas nuevas repetían una foto que no les corresponde
> (el blog de Melena con fotos de producto, los coaches de Núcleo con fotos de aparatos) o no tenían foto (recetas,
> mentores, cursos, artículos). Cada hueco tiene ya su archivo propio, con una provisional recortada.

**33 imágenes** en 9 inspiraciones. Lo mismo, para recorrerlo con un script:
`docs/encargo-imagenes-inspiraciones-2.json`.

## Reglas

Las mismas del primer encargo (`docs/encargo-imagenes-inspiraciones.md`):

- **Sobrescribe** los archivos de la lista en `public/img/inspiraciones/<slug>/`; no cambies nombres ni rutas.
- `.webp`, calidad ~80, menos de 300 KB, al tamaño exacto de la columna «px».
- Personas inventadas, **sin texto, logos ni marcas**.
- **El estilo de cada inspiración manda**: tienen que parecer de la misma sesión que las fotos que ya entregaste.
- Commit solo de `public/img/inspiraciones/`; no subas nada. Avisa al terminar.


## melena · 3 imágenes · /inspiraciones/melena

Salón, tienda y academia (inspirado en Hair Me Up). Bodegones de producto de pelo sin marca sobre fondo melocotón (#F4B39A) con sombras suaves, estilo catálogo limpio.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `blog-otono.webp` | 3:2 | 1800x1200 | Mujer de espaldas cepillándose una melena castaña junto a una ventana con luz de otoño | artículo «Por qué se cae más el pelo en otoño» |
| `blog-balayage.webp` | 3:2 | 1800x1200 | Melena con balayage miel recién peinada, de perfil, sobre fondo melocotón | artículo «Cómo hacer que tu balayage dure» |
| `blog-flequillo.webp` | 3:2 | 1800x1200 | Estilista peinando en seco un flequillo largo y abierto frente al espejo | artículo «Flequillo: ¿sí o no?» |


## patron · 1 imágenes · /inspiraciones/patron

Barbería de lujo familiar (inspirado en Don Barber & Groom). Madera oscura, latón, cuero, azulejo verde; luz cálida y contrastada; tono clásico y masculino; paleta crema, negro y oro.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `servicio-spa.webp` | 4:5 | 1200x1500 | Hombre recostado con una toalla caliente en la cara en una cabina de tratamiento de madera oscura | servicio «Cuidado y spa» (tenía la foto de la barbería) |


## nucleo · 3 imágenes · /inspiraciones/nucleo

Estudio boutique de pilates (inspirado en Core Atelier). Rosa empolvado (#F7E7DE) y marrón (#744C32), suelo de madera clara, luz natural, aparatos de pilates (reformer, silla, torre, barril). Mujeres de 30 a 55 años.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `coach-ines.webp` | 4:5 | 1200x1500 | Instructora de unos 40 años, fundadora, de pie junto a un reformer, ropa de pilates en tonos tierra | coach Inés |
| `coach-nico.webp` | 4:5 | 1200x1500 | Instructor de unos 30 años con porte de bailarín, haciendo un ejercicio en la silla de pilates | coach Nico |
| `coach-dani.webp` | 4:5 | 1200x1500 | Instructora sonriente de unos 35 años en el estudio, con una esterilla enrollada bajo el brazo | coach Dani |


## lobo · 3 imágenes · /inspiraciones/lobo

Gimnasio de artes marciales (inspirado en Fenriz). Blanco y negro muy contrastado, grano de película, sudor y movimiento: muay thai, BJJ, MMA, boxeo. Producto de merchandising negro sobre gris, sin logos.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `evento-sparring-boxeo.webp` | 4:5 | 1200x1500 | Dos boxeadores con casco y guantes en sparring en el ring, luz dura cenital | cartel del sparring de boxeo |
| `evento-sparring-muay-thai.webp` | 4:5 | 1200x1500 | Patada de muay thai bloqueada con la espinilla en el ring | cartel del sparring de muay thai |
| `evento-open-mat.webp` | 4:5 | 1200x1500 | Dos luchadores con kimono en el tatami, uno controlando al otro en el suelo | cartel del open mat de BJJ |


## abuela-rosa · 3 imágenes · /inspiraciones/abuela-rosa

Salsa picante artesanal (inspirado en Peppa Sauce). Ilustración de dos tintas: crema (#FEEEE2) sobre azul noche (#141329).

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `receta-papas-arrugadas.webp` | 3:2 | 1800x1200 | Papas arrugadas con sal en una cazuela de barro y un cuenco de mojo rojo al lado | receta y su tarjeta |
| `receta-huevos-rotos.webp` | 3:2 | 1800x1200 | Huevos rotos sobre patatas fritas regados con mojo verde, plato de loza | receta y su tarjeta |
| `receta-pollo-al-diablo.webp` | 3:2 | 1800x1200 | Contramuslos de pollo asados con mojo rojo oscuro en una bandeja de horno | receta y su tarjeta |


## oficio · 5 imágenes · /inspiraciones/oficio

Instituto de formación práctica (inspirado en Honhar). Alumnos jóvenes aprendiendo oficios digitales y de comercio en aulas reales; fotos en blanco y negro con contraste, retratos de testimonio.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `mentor-marta.webp` | 1:1 | 1200x1200 | Retrato de una mujer de unos 38 años, directora de contenido, sonriendo, fondo amarillo liso | mentora Marta Gil |
| `mentor-raul.webp` | 1:1 | 1200x1200 | Retrato de un hombre de unos 35 años con gafas y portátil, fondo amarillo liso | mentor Raúl Peña |
| `mentor-susana.webp` | 1:1 | 1200x1200 | Retrato de una diseñadora de unos 30 años con tableta gráfica, fondo amarillo liso | mentora Susana K. Vera |
| `mentor-lola.webp` | 1:1 | 1200x1200 | Retrato de una mujer de unos 50 años, experta en equipos, gesto cercano, fondo amarillo liso | mentora Lola Ibáñez |
| `mentor-tomas.webp` | 1:1 | 1200x1200 | Retrato de un hombre de unos 45 años, vendedor, americana sin corbata, fondo amarillo liso | mentor Tomás Rey |


## ahora · 9 imágenes · /inspiraciones/ahora

Escuela de diseño y negocio en Madrid (inspirado en Future London Academy). Talleres con post-its y pizarras, gente de pie trabajando, retratos de profesores de 30 a 60 años sobre fondo neutro; acento amarillo (#FFE32B) en algún objeto.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `curso-marca-hoy.webp` | 3:2 | 1800x1200 | Mesa de trabajo con pruebas de identidad visual impresas y muestras de color | ficha del curso «Marca hoy» |
| `curso-estrategia-producto.webp` | 3:2 | 1800x1200 | Pared con notas adhesivas y un mapa de recorrido de usuario, dos personas discutiendo | ficha del curso «Estrategia de diseño de producto» |
| `curso-liderazgo-creativo.webp` | 3:2 | 1800x1200 | Directora creativa hablando a su equipo en un estudio, todos de pie | ficha del curso «Liderazgo creativo» |
| `curso-operaciones-creativas.webp` | 3:2 | 1800x1200 | Tablero de planificación de proyectos con tarjetas y un calendario en un estudio | ficha del curso «Operaciones creativas» |
| `curso-programa-ejecutivo.webp` | 3:2 | 1800x1200 | Grupo pequeño de directivos visitando un estudio de diseño en Madrid | ficha del «Programa ejecutivo» |
| `curso-mini-mba.webp` | 3:2 | 1800x1200 | Persona estudiando en línea en casa con portátil y cuaderno, luz de tarde | ficha del «Mini-MBA» |
| `diario-precio-del-diseno.webp` | 3:2 | 1800x1200 | Calculadora, presupuesto impreso y bocetos sobre una mesa de estudio | entrada del diario sobre precios |
| `diario-feedback.webp` | 3:2 | 1800x1200 | Dos diseñadores revisando un trabajo en pantalla, uno señalando | entrada del diario sobre feedback |
| `diario-madrid-creativa.webp` | 3:2 | 1800x1200 | Calle de Malasaña con escaparate de un estudio de diseño | entrada del diario sobre estudios de Madrid |


## q47 · 3 imágenes · /inspiraciones/q47

Agencia creativa (inspirado en K72). Fotogramas de campañas publicitarias de cine: dirección de arte fuerte, color con intención, producto o personaje protagonista, encuadre panorámico.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `blog-roce.webp` | 16:9 | 1920x1080 | Equipo creativo discutiendo con energía alrededor de una mesa llena de bocetos, de noche | artículo «La chispa sale del roce» |
| `blog-marcas-lentas.webp` | 16:9 | 1920x1080 | Fachada de una tienda de barrio con décadas de historia, luz de mañana | artículo «Las marcas lentas ganan» |
| `blog-brief.webp` | 16:9 | 1920x1080 | Hoja de brief impresa con anotaciones a mano sobre una mesa negra | artículo «El brief que nos gusta recibir» |


## brasa · 3 imágenes · /inspiraciones/brasa

Diseñador de producto y web 3D (inspirado en Meer Mohsin). Negro y rojo intenso, retrato dramático con luz roja, maquetas de webs y apps sobre fondo oscuro.

| Archivo | Formato | px | Motivo | Dónde sale |
|---|---|---|---|---|
| `blog-caida.webp` | 3:2 | 1800x1200 | Silueta cayendo hacia atrás en penumbra roja, con humo, cinematográfico | entrada «La caída siempre fue parte del camino» |
| `blog-rendimiento-3d.webp` | 3:2 | 1800x1200 | Móvil viejo sobre una mesa oscura mostrando una escena 3D luminosa en rojo | entrada «3D que no derrite el móvil» |
| `blog-silencio.webp` | 3:2 | 1800x1200 | Sala vacía casi negra con una sola franja de luz roja en la pared | entrada «El valor del silencio en una web» |
