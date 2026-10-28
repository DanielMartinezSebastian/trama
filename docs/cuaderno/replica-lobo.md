---
titulo: Lobo Gym, réplica de Fenriz Gym
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.fenriz-gym.com/]
fichas: [docs/50 §3.4 E3f]
ruta: /inspiraciones/lobo
codigo: [components/inspiraciones/lobo/Lobo.tsx, components/inspiraciones/lobo/lobo.css, components/inspiraciones/lobo/Sitio.tsx, components/inspiraciones/lobo/data.ts]
colores: [#e8e8e8, #1c1c1c, #ffd53d, #f5a623, #e2452b, #7a3fbf, #2251d1]
fuentes: [Antonio, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [enérgico, de barrio]
paleta: [blanco y negro, degradado de marca]
tipografia: [condensada en mayúsculas, sans fina]
patrones: [disciplinas en tarjetas de retrato, clase de prueba gratis, carteles a duotono, horario de clases, menú lateral, franja de degradado, bandas de foto, preguntas frecuentes, mapa de clubes, tienda]
movimiento: [menú que cae, texto que rueda]
piezas: [ClassSchedule, FAQSection, LogoCloud, ProductCard, RollLink, CartDrawer, CheckoutFlow, ContactForm, EnrollmentFlow, MemberArea, MembershipFlow, OptionPicker]
piezas-nuevas: [ClassSchedule]
relacionados: [estudio-gimnasio, pieza-class-schedule, demo-forja, herramienta-probe-par]
---

## Concepto

Artes marciales en un barrio, en blanco y negro, con un solo degradado de marca (amarillo, rojo y azul) en franjas y
subrayados.

## Qué se midió

- Librería: GSAP.
- Kenyan Coffee 700 condensada a 90 px y Roboto 300.

## Qué se hizo

- Disciplinas en tarjetas de retrato en blanco y negro, con el nombre encima.
- Clase de prueba.
- Eventos en carteles a duotono.
- Horario de la semana (`ClassSchedule layout="week"`).
- Menú que cae desde «MENÚ ≡».

## Diferencias con la referencia

- No tiene el conmutador DE/EN.

## Aprendido

- Un degradado de marca hace de acento sin romper el blanco y negro: va en franjas y subrayados, nunca en fondos
  grandes.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://www.fenriz-gym.com/ http://localhost:3020/lab/estudios/lobo --nombre lobo`, la sonda
de estilos y la tira del original. Informe en `.refs3d/pares/lobo/par.md`.

- **Antes, 11 de 20 medidas cerca, y 5 pantallas frente a 11.**
  - Faltaban:
    - las **bandas de foto a sangre en blanco y negro** entre secciones;
    - los socios;
    - «FAQ & Contact» con mapa;
    - la tienda de cuatro productos;
    - el pie oscuro centrado.
  - **Escala**: titular de 120 px (8,4 vw) con peso 700, secciones de 90 px y texto Roboto 300 a 16/1,4. La réplica iba
    a 6 vw, con peso 400 y texto a 13 px.
  - **Hover**: el botón de la portada hace «rolling text».
- **Corregido**:
  - Antonio 700;
  - las medidas, con un margen de 144 px (10 vw) y una línea por frase en el titular;
  - las secciones que faltaban, con `LogoCloud`, `FAQSection` y `ProductCard`;
  - `RollLink` en los botones.
- **Después, 19 de 20.** Falta el fundido dentro del texto que rueda: `RollLink` desplaza, no funde.

## Aprendido en la iteración

- El «rolling text» sale ya en tres webs (Essor, Fenriz y, en el menú, K72). `RollLink` lo cubre; un fundido opcional
  (`fade`) lo acercaría.
- Las bandas de foto a sangre entre secciones son el ritmo de las webs de deporte en blanco y negro: dan respiro sin
  añadir texto.

## Siguiente

- Valorar `RollLink fade`.
- El menú lateral que cae, con el degradado arriba, como el de Fenriz.

## Páginas y flujo (28-10-2026, docs/56)

- Páginas: portada, clases y ficha, prueba, eventos y evento, horario, cuotas, mi cuenta, tienda y ficha, pedido, contacto.
- Flujo de negocio, probado de punta a punta con Playwright: clase de prueba gratis, cuota, apuntarse a un evento y compra.
- Marco en `Sitio.tsx` (`Shell`: cabecera, menú a pantalla completa en el móvil, estado y pie); datos y `PAGINAS` en
  `data.ts`. Revisor de interacción (`smoke --auditar`) sin enlaces muertos ni botones sin efecto.
