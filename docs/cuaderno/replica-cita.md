---
titulo: Cita Barbers, réplica de Rendezvous
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.myrendezvous.ca/]
fichas: [docs/50 §3.2 E2b]
ruta: /lab/estudios/cita
codigo: [components/lab/estudios/cita/Cita.tsx, components/lab/estudios/cita/cita.css]
colores: [#ffffff, #000000, #ff622b]
fuentes: [Playfair Display, Inter, Space Mono, IBM Plex Mono]
sector: [barbería]
guia: [barbería de carácter]
tono: [urbano, seguro]
paleta: [fondo claro, acento único saturado]
tipografia: [serif con cursiva, máquina de escribir, titular gigante]
patrones: [vídeo que crece, palabra gigante de sección, locales en tarjetas, reseñas, app con QR, titular con palabra en cursiva, blog]
movimiento: [crecer con el scroll, palabras que asoman]
piezas: [ScrollExpand, DeviceMockup, QRCode]
piezas-nuevas: []
relacionados: [estudio-peluqueria, demo-esparta]
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

## Siguiente

Medir el par y estudiar el ritmo con `cine:ritmo`, para decidir si el kit necesita un suavizado de scroll opcional.
