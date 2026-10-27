---
titulo: Impulso, réplica de Essor Fitness
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://coachsportifecublens.com/]
fichas: [docs/50 §3.4 E3b]
ruta: /lab/estudios/impulso
codigo: [components/lab/estudios/impulso/Impulso.tsx, components/lab/estudios/impulso/impulso.css]
colores: [#000000, #ffffff, #999999, #bbbbbb]
fuentes: [Inter Tight, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [enérgico, seguro]
paleta: [fondo oscuro, blanco y negro]
tipografia: [grotesca apretada, espaciado negativo, titular gigante]
patrones: [titular a todo el ancho, cinta de texto, fichas numeradas, filas numeradas, logos de socios, manifiesto con retratos, píldoras de contorno, nota con estrellas, diplomas, muro de la fama, testimonios, tarifas en tarjetas, preguntas frecuentes, tira de instagram]
movimiento: [titular que cruza, cinta que corre, crecer con el scroll, scroll suavizado, texto que rueda]
piezas: [Marquee, ProjectList, LogoCloud, TestimonialSection, PricingSection, FAQSection, SmoothScroll, RollLink]
piezas-nuevas: []
relacionados: [estudio-gimnasio, replica-q47, demo-forja, herramienta-probe-par]
---

## Concepto

Entrenador personal con estética de agencia:
- negro absoluto;
- una sans apretada a todo el ancho, con espaciado muy negativo;
- cintas blancas de texto que separan secciones;
- un titular que cruza la pantalla con el scroll.

## Qué se midió

- Hecha con Framer.
- Inter Display 600 a 208 px, con espaciado de −8 px.
- Grises #999 y #bbb.
- Botones en píldora de contorno.

## Qué se hizo

- Titular a todo el ancho.
- Nota y objetivos.
- Logos con `LogoCloud`.
- Titular que cruza con el scroll.
- Fichas numeradas que crecen desde una miniatura.
- Servicios con `ProjectList`.
- Manifiesto con retratos detrás.
- Cintas con `Marquee variant="minimal"`.

## Diferencias con la referencia

- No hay vídeo del diploma en la portada.

## Aprendido

- Esta guía se parece más a una agencia como K72 que a un gimnasio: el negro absoluto con píldoras de contorno es una
  familia transversal.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://coachsportifecublens.com/ http://localhost:3020/lab/estudios/impulso --nombre impulso`,
la sonda de estilos y el montaje de las 26 pantallas del original. Informe en `.refs3d/pares/impulso/par.md`.

- **Antes, 10 de 20 medidas cerca, y la réplica era media web.** El original ocupa 26 pantallas y la réplica 5. Faltaban
  nueve secciones:
  - diplomas;
  - «me apunto al reto», cruzando la pantalla;
  - «Bienestar.»;
  - el muro de la fama;
  - los testimonios, cruzando;
  - las tarifas en seis tarjetas;
  - las preguntas frecuentes;
  - el contacto;
  - la tira de Instagram.
- **Añadido**: todas ellas, con `TestimonialSection`, `PricingSection` (seis planes), `FAQSection` (filas, en dos
  columnas) y piezas propias para los diplomas y el muro.
- **Corregido**:
  - Los gigantes **cruzan la pantalla con la sección fijada**: `position: sticky` dentro de una caja de 180–220 vh, con
    el titular desplazado por el progreso. Antes cruzaban sin fijarse.
  - Las fichas: la foto nítida dentro de su versión desenfocada, escalonadas con mucho aire.
  - Las medidas: titulares de 49 px con tracking −1,6 %; gigantes de 14,4 vw/0,81 con −3,8 %; la marca a −5,4 %/0,9
    (15,2 vw en móvil); texto de 19/1,33; margen de 24 px; cintas finas a 11 px.
  - `SmoothScroll` (Lenis, como el original).
  - `RollLink` en la navegación y las píldoras: el texto rueda, como el «rolling text» del original.
- **Después, 18 de 20, y 22 pantallas.** Quedan el margen (el original alinea algunos bloques a 10 px) y la letra
  (Inter Display es de pago; Inter Tight la sustituye).

La sonda mejoró al medir este par:
- vuelve arriba con la rueda y espera, porque con Lenis `scrollTo` no basta;
- mide el tamaño **pintado** del titular: Framer escribe 397 px y lo encoge con `transform`;
- junta las familias que solo cambian de mayúsculas.

## Aprendido en la iteración

- Una réplica que solo cubre el primer tercio de la web parece completa si no se mide el largo de página: el par lo
  delata (5 pantallas frente a 26).
- El kit ya tenía `SmoothScroll` y `RollLink`. Antes de copiar un gesto, hay que buscarlo por su efecto («rueda»,
  «suaviza») y no por su nombre en la web original.

## Siguiente

- La pestaña fija «Honors» de la izquierda es de Awwwards: no se replica.
- El vídeo del diploma en la portada.
