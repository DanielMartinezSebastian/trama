# 41 · Meer Mohsin: réplica completa

> 26-10-2026. Tras la puntuación del usuario: «la hero es muy deficiente», «la demo se siente vacía e incompleta», «el
> logo 3D que da vueltas es feo y no acaba bien al desaparecer sobre ChapterStage». La demo tiene que aproximarse a la
> **web entera y funcional**, no a la sección que mide el comparador (memoria `demos-replica-completa`).
>
> Inventario hecho con `cine:web` (34 pantallas), `cine:explora`, `cine:sonda`, `cine:capture --drive pointer` y un volcado del
> DOM visible con estilos calculados (`.refs3d/mm-hero/`). Cada punto se tacha cuando está en el banco y se ha mirado a
> tamaño real.

## 1. Portada (medida exacta)

| # | Elemento | Medida en la referencia | Pieza | Estado |
|---|---|---|---|---|
| P1 | Fondo | `linear-gradient(223.86deg, rgba(192,4,6,.894) 0%, rgba(0,0,0,.894) 89.5%)` | CSS | hecho |
| P2 | Retrato a sangre | Recortado sobre el degradado, 1394 × 959 en (23, 31) con 1440 × 900; sombra abajo (`shade.webp`, 495 px) | foto CC0 virada a rojo con fusión | hecho: retrato CC0 n.º 11 (cabeza y hombros, fondo oscuro), virado a rojo con fusión screen y máscara radial |
| P3 | Cinta de texto | «It Was Always Going to Be This Way.» a 228 px, Stack Sans Headline ExtraLight, blanco, dos copias de 4000 px; por encima de la cara y por debajo de la máscara | `Marquee` del kit | hecho: `Marquee` con Stack Sans Headline 200 |
| P4 | Máscara 3D sobre los ojos | Lienzo fijo por encima de todo. Malla roja emisiva (65 000 y 55 000 vértices) y otra negra metálica (21 000); hemisférica × 2 y dos direccionales #ff4444 | `ThornEmblem` rehecho: tribal ornamental con rizos, no púas | v1: `ThornEmblem shape="mask"` (`lib/emblem/mascara.ts`) |
| P5 | Humo con el ratón | Fluido de Pavel Dobryakov (MIT) a pantalla completa, opacidad 0,6, sin eventos. `SIM_RESOLUTION` 48, `DYE_RESOLUTION` 384, `DENSITY_DISSIPATION` 5,5, `VELOCITY_DISSIPATION` 3,8, `PRESSURE` 0,12 (6 iteraciones), `CURL` 1,2, `SPLAT_RADIUS` 0,035, `SPLAT_FORCE` 1700. Color: r 0,8–1, g < 0,01, b < 0,02 | **nueva**: `FluidCursor` | hecho: `FluidCursor` (kit, nuevo) |
| P6 | Logo arriba a la izquierda | Tarjeta CSS 3D de 120 × 120 que gira, con el logo blanco por delante y por detrás | `ThornEmblem` pequeño en blanco, o tarjeta CSS | hecho: `ThornEmblem` blanco en una tarjeta que gira (CSS 3D) |
| P7 | Navegación | Dos columnas (HOME · ABOUT · SERVICES · WORK · BLOG · CONTACT US / TIKTOK · INSTAGRAM · BEHANCE), 14,4 px ExtraLight; letra a letra con una cruz al pasar | `RollLink` / `SplitText` | hecho (la cruz al pasar; falta el letra a letra) |
| P8 | Párrafo | «I create digital experiences…», 13,2 px, cinco líneas en (43, 189) | texto | hecho |
| P9 | Roles | VISUAL STORYTELLER · UI/UX DESIGNER · 3D WEB DEVELOPER, a la derecha en (1256, 630) | texto | hecho |
| P10 | CTA «ONLINE · Let's Connect» | Fijo abajo a la derecha, 138 × 42, avatar y punto que parpadea (`liveBlink` 1,5 s); al pasar, fondo #cf0808 | **nueva** o `Badge` | hecho |
| P11 | Botón de sonido | Ondas (`wave-sm/md/lg`), fusión `difference`, fijo abajo a la izquierda (158 × 10) | `SoundToggle` con ondas | hecho (ondas animadas) |
| P12 | Barra inferior | Fija, 47 px: cruces que giran y TENSION · IMMERSION · IMPACT | **nueva** o markup | hecho (cruces que giran) |
| P13 | Cursor propio | Imagen de 45 px | `CustomCursor` | |
| P14 | Grano | `noiseMovement` | `CrtOverlay` o grano | |

## 2. El resto de la web

| # | Sección (pantallas del mapa) | Qué tiene | Estado en el banco |
|---|---|---|---|
| S1 | «THIS WILL FEEL DIFFERENT» (01–02) | La máscara baja; letras rojas que se revelan; «F» caligráfica; «DIFFERENT»; palabras dispersas (ABOUT THE · FROM THE FIRST · BUILD · TO THE SMALLEST · AND · DETAIL) | falta |
| S2 | Llamas y manos (03–05) | Hecho (`FlameHorizon`). Falta «25+» en caligráfica y los textos | a medias |
| S3 | Escenario por capítulos (06–14) | Hecho (`ChapterStage`). La máscara se apaga encima: rehacer su salida | a medias |
| S4 | Papel rasgado (15) | Hecho (`TornPaper`). Falta la figura que cae | a medias |
| S5 | «My work» y carrusel (16–23) | Hecho (`ProjectReel`). Faltan «My work» y los textos por proyecto | a medias |
| S6 | Proceso (24–26) | Haz de luz rojo vertical; la máscara en el haz; cuatro títulos en caligráfica (Discovery, Creative Direction, Digital Craftsmanship, Launch & Evolution) que alternan a los lados con su párrafo; «From the First Idea to the Final Frame…» | falta |
| S7 | Silueta a contraluz (27) | Una figura de pie en el haz rojo | falta |
| S8 | «VISUAL JOURNAL» (28–29) | Titular en caligráfica y palo seco; tres tarjetas de blog (imagen, título, fecha); modal de blog | falta |
| S9 | «AWARDS & RECOGNIZATIONS» (30–33) | Titular gigante; diplomas 3D sobre un suelo rojo agrietado de polígonos; la cámara recorre | falta |
| S10 | Modales | Contacto (formulario), blog y caso de estudio (barra lateral) | falta |

## 3. Orden

1. **Portada entera** (P1–P14), porque es lo que el usuario ha señalado:
   - nueva pieza `FluidCursor`, versátil (color fijo o al azar, intensidad, los parámetros de la referencia);
   - máscara tribal nueva.
2. Rehacer la salida de la máscara sobre el escenario por capítulos (S3).
3. S1, S6 y S7: el resto del relato.
4. S8 y S9: el diario y los premios (suelo agrietado y diplomas en 3D).
5. Textos y detalles que faltan en S2, S4 y S5. Modales (S10).

Cada fase: capturas a tamaño real del banco junto a la referencia, sin defectos visibles, y después las cifras.

## 4. Estado (26-10-2026)

**Hecho:**

- **Portada** (commit `424b827`):
  - P1–P3 y P5–P12;
  - P4 en una primera versión: máscara procedural, más sencilla que el modelo de la referencia;
  - ver la tabla de §1.
- **Fuera de la portada**:
  - llamas, escenario por capítulos, papel rasgado y carrusel de proyectos (ronda 25, docs/40);
  - Lusion: cruces de cristal cerradas (commit `01356ff`).

**Pendiente, por orden:**

1. Build: hay cambios en páginas del laboratorio y en el CSS desde el último. Con el servidor parado; después, borrar
   `.next/dev` y relanzarlo.
2. La salida de la máscara sobre el escenario por capítulos (S3).
3. S1, S6 y S7: «THIS WILL FEEL DIFFERENT», el proceso con el haz y la silueta.
4. S8 y S9: el diario y los premios.
5. Portada: P13 (cursor), P14 (grano) y la navegación letra a letra.
6. Lusion y Chartogne: inventario completo y réplica con contenido, como aquí.
