# Ronda 3 de webs premiadas (19-10-2026)

> Fuente: lista de «Sites of the Day» de Awwwards (de Format, 19-oct, a Pensatori Irrazionali, 20-sep) y portfolios 2026.
> Se **abrieron en Chrome** Neutomni, Overworld Audio, 'kin, Uncommon y la puerta de edad de Santioni Spirits; del resto
> (Format/Obys, Mat Voyce, Active Theory, Lusion…) solo se leyó la descripción, así que no hay medidas propias.
> Complementa [`07-formulas-webs-top.md`](./07-formulas-webs-top.md).

## Observado

| Web | Fórmula | En Trama |
|---|---|---|
| [Neutomni](https://neutomni.com/) (Webflow, GSAP 3.15, Lenis, rojo + blanco) | Wordmark de borde a borde en rojo, microtextos mono, serif cursiva de acento, aviso de cookies con la marca (rojo) y «Rechazar» tan visible como «Permitir» | `FitText`, `CookieBanner` |
| [Overworld Audio](https://overworldaudio.com/) (Three.js, Nuxt, Sanity) | Entrada «con sonido / sin sonido»; mapa 3D que se arrastra con puntos clicables; menú mínimo; botón «lista» como alternativa | `EntryGate`, `SoundToggle`, `ExplorableCanvas` (versión 2D) |
| ['kin](https://by-kin.com/) | Home de una sola pantalla: wordmark mono gigante en coral sobre crema, selector «Layout ① ②» que reordena los trabajos | `WorkViews` (cambio de vista con Flip) |
| [Uncommon](https://uncommondesign.group/) | Collage de pegatinas, cursor con etiqueta «Play reel» sobre una frase, píldora «Menu», rótulos laterales | `StickerCollage`, `CustomCursor` (ya existía) |
| [Santioni Spirits](https://santionispirits.com/) (Active Theory) | Puerta de edad con tipografía display, mundo ilustrado con sonido | `EntryGate variant="age"` |
| Mat Voyce / By-Kin (según reseñas, sin medir) | Letras que se estiran y recomponen al hacer scroll, sin perder legibilidad | `ElasticText` |

## Qué se construyó

Componentes: `EntryGate`, `SoundToggle`, `ElasticText`, `WorkViews`, `ExplorableCanvas`, `StickerCollage`, `CookieBanner`
(estilos en `ui-showcase.css`). Demos: **Sonar** (`/sitios/sonar`) y **Mota** (`/sitios/mota`).

## Aviso: revisión de modularidad pendiente

Varias de estas piezas se solapan con otras del kit y deben fundirse (ver
[`04-pendientes.md` §6](./04-pendientes.md)). No se deben añadir más componentes parecidos hasta hacer esa revisión.

## Pendiente de esta ronda

Selector de tema claro/oscuro, deslizador con shader, vídeo de fondo, mapa 3D real (Three) para `ExplorableCanvas`, y probar
las dos demos en móvil (390 px), con teclado y con axe.
