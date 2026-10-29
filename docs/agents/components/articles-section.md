# Sección de blog

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./articles-section.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/ArticlesSection.d.ts)
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

ArticlesSection

## description

Cabecera + artículos (BlogCard) en rejilla, destacado (el primero grande con imagen de fondo), lista o carrusel. Cada tarjeta varía trama y acento sola.

## category

secciones

## import

import ArticlesSection from "trama-ui/ArticlesSection";

## api

```json
{
  "module": "trama-ui/ArticlesSection",
  "props": "React.ComponentProps<typeof ArticlesSection>",
  "declaration": "types/components/ui/ArticlesSection.d.ts",
  "packageDeclaration": "./dist/components/ui/ArticlesSection.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "kicker",
    "label": "Sobretítulo",
    "type": "text",
    "default": "El blog"
  },
  {
    "key": "title",
    "label": "Titular",
    "type": "text",
    "default": "Últimas entradas"
  },
  {
    "key": "articles",
    "label": "Artículos (uno por línea: «categoría|título|extracto|fecha|min de lectura|imagen (URL o gen:N)|enlace»; los dos últimos opcionales)",
    "type": "text",
    "multiline": true,
    "default": "Técnica|Cinco errores al remar que te frenan la primera ola|El remo cuenta más que la fuerza: la postura y el timing son lo que de verdad te sube a la tabla.|12 mar 2026|4 min|gen:1\nEquipo|Cómo elegir tu primera tabla de espuma|Volumen, largo y flotabilidad explicados sin tecnicismos, para acertar a la primera.|2 mar 2026|6 min|gen:4\nComunidad|Un fin de semana de surf trip por la costa norte|Crónica de nuestra última salida, con el mapa de las playas que visitamos.|21 feb 2026|5 min|gen:2"
  },
  {
    "key": "layout",
    "label": "Disposición",
    "type": "select",
    "default": "grid",
    "options": [
      "grid",
      "featured",
      "list",
      "carousel"
    ],
    "labels": {
      "grid": "rejilla",
      "featured": "destacado + columna",
      "list": "lista",
      "carousel": "carrusel (Swiper)"
    }
  },
  {
    "key": "cardLayout",
    "label": "Tarjetas",
    "type": "select",
    "default": "stacked",
    "options": [
      "stacked",
      "overlay",
      "minimal"
    ],
    "labels": {
      "stacked": "apiladas",
      "overlay": "superpuestas (imagen de fondo)",
      "minimal": "mínimas"
    }
  },
  {
    "key": "fill",
    "label": "Fondo",
    "type": "select",
    "default": "surface",
    "options": [
      "surface",
      "tint",
      "gradient"
    ],
    "labels": {
      "surface": "el de la variante",
      "tint": "tinte de acento",
      "gradient": "degradado"
    }
  },
  {
    "key": "vary",
    "label": "Variar trama y acento por tarjeta",
    "type": "boolean",
    "default": true
  },
  {
    "key": "perView",
    "label": "Visibles en pantalla ancha",
    "type": "number",
    "default": 3,
    "min": 1,
    "max": 4,
    "step": 1
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
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "glass",
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
[]
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
  "components": [
    "BlogCard",
    "Carousel",
    "CarouselLazy",
    "SectionHeader"
  ],
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
