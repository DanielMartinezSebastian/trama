---
titulo: Lobo Gym, réplica de Fenriz Gym
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://www.fenriz-gym.com/]
fichas: [docs/50 §3.4 E3f]
ruta: /lab/estudios/lobo
codigo: [components/lab/estudios/lobo/Lobo.tsx, components/lab/estudios/lobo/lobo.css]
colores: [#e8e8e8, #1c1c1c, #ffd53d, #f5a623, #e2452b, #7a3fbf, #2251d1]
fuentes: [Anton, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [enérgico, de barrio]
paleta: [blanco y negro, degradado de marca]
tipografia: [condensada en mayúsculas, sans fina]
patrones: [disciplinas en tarjetas de retrato, clase de prueba gratis, carteles a duotono, horario de clases, menú lateral, franja de degradado]
movimiento: [menú que cae]
piezas: [ClassSchedule]
piezas-nuevas: [ClassSchedule]
relacionados: [estudio-gimnasio, pieza-class-schedule, demo-forja]
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

## Siguiente

Medir el par.
