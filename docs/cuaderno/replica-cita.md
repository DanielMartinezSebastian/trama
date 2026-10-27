---
titulo: Cita Barbers, réplica de Rendezvous
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.myrendezvous.ca/]
fichas: [docs/50 §3.2 E2b]
ruta: /inspiraciones/cita
codigo: [components/inspiraciones/cita/Cita.tsx, components/inspiraciones/cita/cita.css]
colores: [#ffffff, #000000, #ff622b]
fuentes: [Playfair Display, Inter, Space Mono, IBM Plex Mono]
sector: [barbería]
guia: [barbería de carácter]
tono: [urbano, seguro]
paleta: [fondo claro, acento único saturado]
tipografia: [serif con cursiva, máquina de escribir, titular gigante]
patrones: [vídeo que crece, palabra gigante de sección, locales en tarjetas, reseñas, app con QR, titular con palabra en cursiva, blog, preguntas frecuentes, final en negro, pie con foto]
movimiento: [crecer con el scroll, palabras que asoman, scroll suavizado]
piezas: [ScrollExpand, DeviceMockup, QRCode, FAQSection, SmoothScroll]
piezas-nuevas: []
relacionados: [estudio-peluqueria, demo-esparta, herramienta-probe-par]
---

## Concepto

Una cadena de barberías con voz de revista:
- serif enorme, con la cursiva para el énfasis;
- el naranja como única tinta;
- datos en máquina de escribir;
- palabras gigantes («Locations», «Clients») que asoman desde el borde de su sección.

## Qué se midió

- Librerías: GSAP, ScrollTrigger y Lenis.
- Letras: GT Super de 40 a 200 px, GT Walsheim y GT Alpina Typewriter en mayúsculas.
- Naranja #ff622b.

## Qué se hizo

- Titular centrado con cursiva.
- Vídeo que crece (`ScrollExpand`).
- Locales en retratos con «+».
- «Clientes» con reseñas en blanco y negro.
- La app en un móvil (`DeviceMockup`) con su QR (`QRCode`).

## Diferencias con la referencia

- No tiene el suavizado de Lenis: el scroll es el nativo.
- Las palabras gigantes no se recortan contra el borde con la misma precisión.

## Aprendido

- Tres letras con papeles claros (titular, texto, datos) dan carácter sin desordenar.
- La app de la marca se resuelve entera con piezas del kit.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://www.myrendezvous.ca/ http://localhost:3020/lab/estudios/cita --nombre cita`, la sonda
de estilos y la tira del original. Informe en `.refs3d/pares/cita/par.md`.

- **Antes, 10 de 20 medidas cerca.** Faltaba el final de la web y la escala se quedaba corta:
  - el original cierra **en negro**: preguntas frecuentes en dos columnas («Services & Conditions», «Booking &
    Cancellation»), «Book now… or via app» gigante y el pie con una foto a sangre («Meet your best self at Rendezvous»);
  - el titular va a **124 px** (8,6 vw)/0,95 con −5,2 %, y la réplica iba a 6,4 vw;
  - la frase en cursiva 300 va a 140 px con −6,3 %;
  - los gigantes en cursiva, a **340 px** (23,6 vw)/0,8 con −6,1 %;
  - las reseñas y las respuestas, a 20/1,2 en columnas estrechas (15 em).
- **Corregido**:
  - el final en negro, con dos `FAQSection` en filas, la reserva gigante y el pie con foto;
  - las medidas;
  - `SmoothScroll` (Lenis, como el original);
  - el botón «Descarga la app» se rellena al pasar, como el del original;
  - la portada deja asomar el vídeo.
- **Después, 18 de 20.** Quedan la letra (GT Super y GT Walsheim son de pago; Playfair e Inter las sustituyen) y las
  sombras del móvil de la app.

## Aprendido en la iteración

- El final de una web (preguntas, reserva, pie) es lo primero que se olvida al replicar de memoria, y es donde estas webs
  cierran la venta. El largo de página del par lo delata.
- La trampa de los heredocs de Bash con Python volvió: `\n` acabó en salto de línea real dentro de una cadena. Los
  scripts de edición se escriben en un archivo.

## Movimiento por scroll (E14e, 27-10-2026)

`cine:capture --drive scroll` de las dos y `cine:compare --emparejar posicion` (docs/53 §3.2): los textos entran en el
mismo punto del recorrido (5 % de error medio). Rendezvous hace **subir** sus titulares y gigantes al entrar, y Cita solo
los hacía aparecer: ahora suben con `Reveal` (deslizamiento hacia arriba). El titular de la portada aún se mide como
«aparece», porque el `Reveal` de montaje termina antes de empezar la grabación; en el original la subida llega más tarde.

## Siguiente

- La tarjeta naranja con el horario que se abre en cada local («+»).
- El vídeo en la portada móvil, con «Download app» debajo.
