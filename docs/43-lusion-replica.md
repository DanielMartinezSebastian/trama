# 43 · Lusion: réplica completa

> 26-10-2026. Nota del usuario: «revisa la demo de Lusion, esa no se parece en nada a la web; reusa nuestros componentes,
> readáptalos si es necesario y valora llevar los cambios a la librería tras las pruebas». El banco `/lab/cine/lusion`
> solo tenía el racimo de cruces (lo que mide `cine:vuelta`). La réplica de la web entera está en
> **`/lab/cine/lusion-web`** (`components/lab/cine/piezas/LusionWeb.tsx`).

## 1. Cómo es la referencia

Inventario hecho con el mapa de `cine:web` (40 pantallas a 1440 × 900) y un volcado del DOM visible con estilos
calculados (`.refs3d/lusion-web/dom-portada.txt`).

- **Todo es un lienzo WebGL a pantalla completa.** El DOM es una capa fija de 51 555 px de alto encima (scroll virtual).
  Las tarjetas, las imágenes, el reel y las cintas son planos de WebGL; por eso el reel se curva y las cintas tienen
  volumen.
- **Tipografía**: Aeonik (de pago) y IBM Plex Mono.

## 2. Inventario y estado

| # | Elemento | Referencia | En la réplica | Estado |
|---|---|---|---|---|
| L1 | Cabecera fija | Logo de 120 × 27 en (72, 59); sonido (lienzo de 45 px); «Let's talk» oscuro de 134 × 45 con flecha y puntos; «Menu» claro de 102 × 45 con dos puntos, que despliega Home, About us, Projects y Contact (26 px), el boletín «Subscribe to our newsletter» y Labs | Markup con hover; el menú abre enlaces y boletín | hecho (sin el enlace a Labs) |
| L2 | Portada | La frase «We create 3D visual storytelling…»; tarjeta oscura redondeada con el racimo de cruces; «SCROLL TO EXPLORE» entre cruces | `CrossCluster` con los colores medidos | hecho |
| L3 | «Bold Ideas, Brought to Life» | Titular, párrafo, «● Our approach»; una cinta azul gruesa en 3D que recorre la sección | **`LineDraw tube`** (ampliado: cinta 3D, `color`, `scrollRange`, amortiguado) | hecho |
| L4 | Reel | La tarjeta pequeña crece hasta el ancho completo, curvada como un plano 3D, con «PLAY ● REEL» y clips que cambian | **`ScrollExpand`** (nuevo) con cuatro vídeos libres de `public/video` que se funden cada 3 s | hecho (la curvatura es una inclinación CSS, no un plano curvo) |
| L5 | «Featured Work» | Doce proyectos en dos columnas (imagen 16:10, etiquetas en mono, título) y «● See all projects» | Markup con zoom al pasar; fotos de `public/img` | hecho |
| L6 | «Where Creative Ideas Become Immersive Experiences» | Titular de tres líneas, cinta cian, dos párrafos | `LineDraw tube` | hecho |
| L7 | Tableta → escena del astronauta | Una tableta con la Tierra que crece hasta la escena negra con un astronauta flotando en 3D | `ScrollExpand` con el vídeo de la Tierra desde la ISS (NASA, dominio público) y una foto de un paseo espacial (NASA, `images:fetch -- espacio`) fundida con una máscara | hecho (foto, no 3D) |
| L8 | Pie | (no se ve en el mapa) | «Let's work together» y correo | provisional |
| L9 | Transición al abrir un proyecto | Cambio de imagen cada 150 ms (`cine:web`) | — | pendiente |
| L11 | (nuevo, idea propia) Vídeo flotante | — | **`FloatingVideo`** (nueva) en «Featured Work»: un «Behind the scenes» ladeado que se mece, sigue un poco al cursor y acompaña al scroll; solo crece si se pulsa | hecho |
| L10 | Cruces de cristal | Piezas cerradas | `CrossCluster` (commit `01356ff`) | hecho |

## 2b. Cintas que no se dibujaban bien (nota del usuario, 26-10)

Fotogramas de la réplica a 1440 × 900 contra las pantallas 03–06 y 29–33 del mapa de `cine:web`:

- **Causa**: el SVG medía 1440 × 398 (`height: 100%` de la sección) y su `viewBox` 1440 × 1200. Con el encaje por
  defecto (`meet`) el dibujo se encogía a un tercio en el centro de la caja; el grosor, con `non-scaling-stroke`, se
  quedaba en 70 px. Salía un gusano gordo y corto en mitad de la sección en lugar de una cinta que cruza la página.
- **La referencia**: un tubo fino (~16 px a 1440) que entra por arriba a la izquierda, cruza el titular y baja a rodear
  la tarjeta del reel; la cian sale por la derecha junto a «See all projects» y baja hacia la tableta.
- **Arreglo**: la cinta tiene la proporción de su `viewBox` (`height: auto`) y sale de la sección hacia la tarjeta;
  trazados nuevos de 17 y 15 px; el avance sigue a la punta (`scrollRange` [0,8, −0,9]).
- **Kit**: `LineDraw fit` (`contain` · `cover` · `stretch`) para cuando la caja no tiene la proporción del dibujo, y la
  cinta (`tube`) sombreada con luz desde arriba (sombra que asoma por debajo, brillo arriba, desplazamientos en px de
  pantalla pasados al `viewBox` con `--ld-u`), en lugar de un contorno oscuro.
- **El play del reel**: el glifo ▶ caía fuera de su pastilla según la fuente; ahora es un triángulo SVG con el centro
  óptico corregido.

## 3. Cambios llevados a la librería

| Pieza | Cambio | Versátil porque |
|---|---|---|
| `LineDraw` | `tube` (cinta 3D en tres trazos), `color`, `scrollRange` y avance amortiguado con la sensación de la página | Sirve para firmas, subrayados y ahora cintas gruesas de cualquier color |
| `ScrollExpand` | Nueva: una tarjeta de medios que crece con el scroll, inclinada al principio, con contenido encima | El reel, la tableta o cualquier medio que deba pasar de tarjeta a pantalla completa |
| `LineDraw` (2) | `fit` y sombreado de la cinta con luz desde arriba | La causa del fallo (caja con otra proporción) le pasa a cualquier trazo de fondo |
| `FloatingVideo` | Nueva: miniatura de vídeo flotante que se mece, sigue al cursor y solo crece (FLIP) al pulsarla | Making of, teaser o segundo vídeo junto a un reel |
| `CrossCluster` | El plano de reserva redondea sus posiciones: daba un error de hidratación | — |
| `lib/scroll/track` | Sin GSAP, sobre la medida del kit | Un solo `trackScroll` (docs/42) |

## 4. Pendiente

- **El reel curvado de verdad**: en la referencia es un plano WebGL que se dobla. `ScrollExpand` podría aceptar un modo
  WebGL.
- **El astronauta en 3D**: hoy es una foto; un modelo libre con licencia sería lo fiel.
- **La transición al abrir un proyecto (L9)**: `PageTransition` del kit.
- **Medir la réplica** contra la referencia con `cine:ritmo` (scroll) y capturas lado a lado por sección.
