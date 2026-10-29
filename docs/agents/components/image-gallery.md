# Galería de imágenes

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./image-gallery.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/ImageGallery.d.ts)
- [Índice piloto](../README.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## component

ImageGallery

## description

Ocho presentaciones de las mismas fotos: imagen grande con miniaturas, coverflow 3D, baraja, fundido, cubo, creativa, tira libre y mosaico de dos filas. Táctil, con teclado y flechas; sin imágenes propias usa escenas pixel art generadas.

## category

galerias

## import

import ImageGallery from "trama-ui/ImageGallery";

## api

```json
{
  "module": "trama-ui/ImageGallery",
  "props": "React.ComponentProps<typeof ImageGallery>",
  "declaration": "types/components/ui/ImageGallery.d.ts",
  "packageDeclaration": "./dist/components/ui/ImageGallery.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "layout",
    "label": "Presentación",
    "type": "select",
    "default": "thumbs",
    "options": [
      "thumbs",
      "coverflow",
      "cards",
      "fade",
      "cube",
      "creative",
      "filmstrip",
      "mosaic"
    ],
    "hint": "thumbs · coverflow · cards · fade · cube · creative · filmstrip · mosaic"
  },
  {
    "key": "images",
    "label": "Imágenes (una por línea, «imagen|título|texto»)",
    "type": "text",
    "multiline": true,
    "default": "gen:0|Amanecer|Primera luz sobre la bahía\ngen:1|Mediodía|Mar limpio y viento suave\ngen:2|Atardecer|La hora dorada del swell\ngen:3|Noche|Luna llena y marea alta\ngen:4|Cala|Aguas verdes entre rocas\ngen:5|Ocaso|Rojos y naranjas en el horizonte\ngen:6|Bruma|Mañana de niebla fina\ngen:7|Aurora|Cielo violeta sobre el agua"
  },
  {
    "key": "ratio",
    "label": "Proporción",
    "type": "select",
    "default": "4/3",
    "options": [
      "4/3",
      "16/9",
      "21/9",
      "1/1",
      "3/4"
    ]
  },
  {
    "key": "captions",
    "label": "Pies de foto",
    "type": "boolean",
    "default": true
  },
  {
    "key": "autoplay",
    "label": "Reproducción automática (s, 0 = manual)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 8,
    "step": 1
  },
  {
    "key": "loop",
    "label": "Bucle",
    "type": "boolean",
    "default": false
  },
  {
    "key": "zoom",
    "label": "Zoom",
    "type": "boolean",
    "default": false
  },
  {
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "retro",
    "options": [
      "glass",
      "solid",
      "outline",
      "neon",
      "retro",
      "terminal",
      "minimal",
      "dotmatrix",
      "editorial"
    ],
    "hint": "Cambia superficie, borde, radio, sombra y tipografía"
  }
]
```

## notes

```json
[
  "Cada línea de «imágenes» es «imagen|título|texto». La imagen puede ser una URL o ruta, o `gen:N` (0, 1, 2…) para una escena de ejemplo generada, sin descargas.",
  "Las flechas, los puntos y las imágenes toman borde, radio y sombra de la variante de estilo (variables --s-*).",
  "El zoom (doble clic o pellizco) solo se aplica a los modos thumbs y fade."
]
```

## requirements

```json
[
  "import \"trama-ui/styles.css\" una vez; tema/guía en contenedor."
]
```

## dependencies

```json
{
  "components": [],
  "packages": [
    {
      "name": "react",
      "version": "^19.3.0"
    },
    {
      "name": "swiper",
      "version": "^14.2.0"
    }
  ]
}
```

## Ejemplos

Sin ejemplo específico; consultar receta/guía y declaración completa.

## limitations

```json
[]
```
