---
titulo: Vive Club, réplica de FIT AND YOU
fecha: 2026-10-27
tipo: réplica
estado: hecho
referencias: [https://fit-and-you.webflow.io/]
fichas: [docs/50 §3.4 E3d]
ruta: /lab/estudios/vive
codigo: [components/lab/estudios/vive/Vive.tsx, components/lab/estudios/vive/vive.css]
colores: [#000000, #ffffff, #fb5607]
fuentes: [Antonio, Inter]
sector: [gimnasio]
guia: [club de alto contraste]
tono: [enérgico, comercial]
paleta: [fondo oscuro, acento único saturado]
tipografia: [condensada en mayúsculas, espaciado negativo, titular gigante]
patrones: [menú en isla, damero de fotos y círculos, círculo de llamada, lista gigante de nombres, cinta de cifras, tarjetas ladeadas, planes con conmutador, enlaces con corchetes, mapa de clubes, foto en el titular, pie con lema]
movimiento: [cinta que corre]
piezas: [PricingSection]
piezas-nuevas: []
relacionados: [estudio-gimnasio, replica-talla, demo-cadencia, herramienta-probe-par]
---

## Concepto

Una cadena de clubes con lema de anuncio:
- condensada naranja en mayúsculas enormes;
- «[+]» como firma de los enlaces;
- un damero de fotos y círculos;
- las clases como lista de nombres gigantes.

## Qué se midió

- Hecha con Webflow y GSAP.
- Antonio 700 a 158 px, con espaciado de −9,5 px; Inter de 12 a 14 px.
- Naranja #fb5607.

## Qué se hizo

- Menú en isla.
- Damero de fotos y círculos.
- «Membresía» con el círculo naranja.
- Clases por zona como lista gigante.
- Cinta de cifras.
- Ventajas en tarjetas ladeadas alrededor del titular.
- Planes de cuatro columnas con `PricingSection`.

## Diferencias con la referencia

- La lista de clases no tiene el vídeo en blanco y negro detrás.

## Aprendido

- `PricingSection` aguanta cuatro columnas sin tocar nada.

## Iteración con el par (27-10-2026)

`npm run refs:probe -- --par https://fit-and-you.webflow.io/ http://localhost:3020/lab/estudios/vive --nombre vive`, la
sonda de estilos y la tira del original. Informe en `.refs3d/pares/vive/par.md`.

- **Antes, 8 de 17 medidas cerca.**
  - **Letra**: el original usa **Antonio 700**, que es libre. La réplica usaba Anton, de un solo peso y más pesada, con
    −3 % en vez de −6 %.
  - **Largo**: 6,6 pantallas frente a 11,6. Faltaba el final: «Find your nearest gym» con mapa y ficha del club, «Put
    your fitness first today» con una foto metida en la línea, el círculo «Join now» y el pie «You are in control».
  - **Hover**: la isla tiene cinco enlaces que se vuelven píldora y «join now» se rellena y crece; la réplica no tenía
    ninguno.
- **Corregido**:
  - **Antonio en el kit** (`lib/ui/fonts.ts`, `--font-antonio`): condensada variable de 100 a 700, alternativa libre
    también para Pilat Condensed (Skulpt) o Kenyan Coffee (Fenriz);
  - titulares a 11 vw/0,94 con −6 %;
  - el final completo;
  - los hovers;
  - planes en tarjetas oscuras con la esquina doblada en naranja y el destacado en blanco;
  - márgenes de 17 px (21 px en móvil).
- **Después, 16 de 17.** Solo falta Arial, que el original usa en un botón.

## Aprendido en la iteración

- Medir el peso del titular separa letras que a ojo se confunden: Anton (400, un solo peso) no es Antonio (700). Si la
  referencia usa una libre, se trae al kit.
- Al pisar el relleno de las tarjetas de `PricingSection` hay que devolver el del destacado (`.ui-price--hl`): si no,
  queda texto oscuro sobre fondo oscuro.

## Siguiente

- La lista de clases cambia la foto al pasar por cada fila, con la barra naranja.
- El vídeo de la portada.
