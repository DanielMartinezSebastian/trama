---
titulo: Q47, réplica de K72
fecha: 2026-10-27
tipo: réplica
estado: en curso
referencias: [https://k72.ca/en]
fichas: [docs/50 §3.9]
ruta: /lab/estudios/q47
codigo: [components/lab/estudios/q47/Q47.tsx, components/lab/estudios/q47/q47.css]
colores: [#000000, #ffffff, #d3fd50, #9a9a9a]
fuentes: [Inter Tight, Inter]
sector: [agencia]
guia: [club de alto contraste]
tono: [seguro, descarado]
paleta: [fondo oscuro, acento único saturado]
tipografia: [grotesca en mayúsculas, titular gigante]
patrones: [portada sin scroll, reel de vídeo, vídeo en el titular, píldoras de contorno, hora local, menú a pantalla completa, rejilla de proyectos, barra del proyecto en vista]
movimiento: [transición en escalera, fila que gira a marquesina, vídeos que se suceden, trazo que se dibuja]
piezas: [FullscreenMenu, LineDraw, LocalTime]
piezas-nuevas: [FullscreenMenu, viewTransitions]
relacionados: [pieza-fullscreen-menu, pieza-page-transition-stairs, replica-impulso, herramienta-probe-par]
---

## Concepto

Una agencia cuya firma es la navegación:
- una portada de una sola pantalla con un reel de vídeos;
- un vídeo pequeño metido en el titular como si fuera una palabra;
- un menú cuyas filas giran a una banda lima con marquesina;
- una transición en escalera de bloques negros.

## Qué se midió

- Mapa (`cine:web`): scroll virtual, sin librerías a la vista, la letra Lausanne.
- Fotogramas de la navegación en `.refs3d/webs/k72-ca-en/nav/`, cada 100–150 ms:
  - menú;
  - hover de las filas;
  - paso a Work;
  - scroll y hover de la rejilla.

## Qué se hizo

- Reel con vídeos de stock.
- Titular con un vídeo en píldora y una elipse lima (`LineDraw`).
- Píldoras gigantes y la hora de Madrid (`LocalTime`).
- Menú con `FullscreenMenu reveal="stairs" linkHover="marquee" rules cover`.
- Escalera local al pasar a Trabajo.
- «TRABAJO» con el número en superíndice y la barra del proyecto en vista.

## Diferencias con la referencia

- Falta la página de proyecto y su transición.
- Falta el conmutador EN/FR.
- La escalera de la réplica es un gancho local. `PageTransition kind="stairs"` existe en el kit, pero la réplica no la
  usa porque cambia de vista sin cambiar de ruta.
- Lausanne está sustituida por Inter Tight, a peso 300.
- El vídeo del titular y el reel son de stock, no campañas.

## Aprendido

- Dentro de `FullscreenMenu`, con `align="center"` las filas no ocupan el ancho: hace falta `justify-items: stretch`.
- Lo que a ojo parecía igual no lo era: el peso del titular (300 frente a 500) cambia el carácter de la página entera.
  Hay que medir el par antes de dar una réplica por buena.
- El gesto del botón de K72 vive en un `::after`: la sonda de hover mira también los pseudoelementos.
- La escalera vale igual para abrir un menú que para cambiar de página: es un concepto de cortinilla, no de ruta.

## Iteración con el par (27-10-2026)

Con `npm run refs:probe -- --par https://k72.ca/en http://localhost:3020/lab/estudios/q47 --nombre q47`, más una sonda de
elementos y fotogramas del botón. Informe en `.refs3d/pares/q47/par.md`; detalle en docs/53 §4.

- **Antes, 10 de 20 medidas cerca.** El titular era medio (500) y K72 es ligero (300). Faltaban 2 vw de tamaño, el
  tracking era negativo y el párrafo iba a 11 px.
- Lo corregido:
  - el titular, el párrafo (14/21 con sangría de 70 px), las píldoras (7 vw, 400, borde de 3 px) y el margen de 10 px;
  - el botón de menú de 224 × 50 con el relleno lima que baja (`triggerHover="fill"`, nuevo en el kit);
  - el icono de líneas largas;
  - la composición móvil de K72.
- **Después, 19 de 20.** La que falta es el margen móvil, que en Q47 no tiene dato porque no hay tres bloques alineados.

## Siguiente

- La página de proyecto y su transición.
- Un par de la página de trabajo con su URL: hoy Trabajo es un estado de la réplica, no una ruta.
- El ritmo de la escalera, medido con fotogramas.
