---
titulo: Estudio de peluquerías y barberías (Awwwards)
fecha: 2026-10-26
tipo: estudio
estado: hecho
referencias: [https://ilcolorista.salon/, https://www.alicehairart.se/, https://www.myrendezvous.ca/, https://hairmeup.pl, https://www.marcoambrosi.salon/, https://don-barber.gr/en]
fichas: [docs/50 §3.1, docs/50 §3.2, docs/50 §3.3]
ruta: /lab/cine/docs/50-estudios-sectores
codigo: []
colores: []
fuentes: []
sector: [peluquería, barbería]
guia: []
tono: []
paleta: []
tipografia: []
patrones: [equipo con fotos, reserva externa, reserva fija, palabra gigante de sección, carta de servicios, noticias en rejilla, tienda, titular con palabra en cursiva]
movimiento: []
piezas: []
piezas-nuevas: [TeamSection, SectionHeader]
relacionados: [replica-matiz, replica-nura, replica-cita, replica-melena, replica-raiz, replica-patron, demo-hebra, demo-esparta]
---

## Concepto

Qué hace reconocible una web de salón premiada y qué se repite entre seis: Il Colorista, ALICE, Rendezvous, Hair Me Up,
Marco Ambrosi y Don Barber. Fruits Hair Lab se descartó porque la web premiada ya no existe.

## Qué se midió

- `cine:web` en escritorio y móvil.
- Un perfil propio con Playwright:
  - tipos y colores por superficie;
  - navegación y enlaces de reserva;
  - precios y titulares;
  - ocho pantallas con rueda real.
- `cine:sintesis` de las seis.

El material está en `.refs3d/webs/<slug>/` y `.refs3d/sintesis/peluqueria/`.

## Qué se hizo

- La ficha larga de cada web y la síntesis, en docs/50 §3.1–3.3.
- De ahí salieron `TeamSection` con fotos y `SectionHeader` con palabra de fondo.
- Con lo aprendido se reformaron Hebra y Esparta.

## Aprendido

- Ninguna usa 3D: lo que se repite es de maquetación y de contenido.
- Rasgos repetidos:
  - equipo con fotos (en blanco y negro en cuatro);
  - reserva fuera de la web (Bokadirekt, Booksy, WhatsApp, app), siempre a la vista;
  - palabra gigante como título de sección;
  - precios en carta o en una página propia.
- Salen dos familias:
  - **salón editorial claro**: pastel cálido o grises con grano, serif fina o una sola grotesca, mucho aire;
  - **barbería de carácter**: acento saturado o metálico, titulares enormes en serif con cursiva o en gótica condensada, botones en óvalo.
- Plantilla:
  1. portada;
  2. manifiesto;
  3. servicios;
  4. equipo con reserva por persona;
  5. trabajos;
  6. reseñas;
  7. locales y horario;
  8. blog o tienda;
  9. pie.

## Siguiente

Guías de estilo de las dos familias en docs/16 (E10) y receta de salón en el catálogo (E11).
