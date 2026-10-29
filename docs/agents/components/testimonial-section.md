# Sección de testimonios

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./testimonial-section.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/TestimonialSection.d.ts)
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

TestimonialSection

## description

Prueba social lista para pegar: cabecera, resumen de valoraciones (media con estrellas parciales, número y fuente enlazada, reparto por estrellas que filtra las citas) y las citas en rejilla o en slider, siempre a la misma altura con el autor abajo. Con align="left" y quoteFont="display" encaja en webs editoriales.

## category

secciones

## import

import TestimonialSection from "trama-ui/TestimonialSection";

## api

```json
{
  "module": "trama-ui/TestimonialSection",
  "props": "React.ComponentProps<typeof TestimonialSection>",
  "declaration": "types/components/ui/TestimonialSection.d.ts",
  "packageDeclaration": "./dist/components/ui/TestimonialSection.d.ts",
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
    "default": "Lo que dicen"
  },
  {
    "key": "title",
    "label": "Titular",
    "type": "text",
    "default": "Alumnos que ya cogieron su ola"
  },
  {
    "key": "items",
    "label": "Reseñas (una por línea, «cita|autor|rol|valoración|avatar URL opcional»)",
    "type": "text",
    "multiline": true,
    "default": "Levanté la tabla el primer día. El equipo es paciente y el mar, una maravilla.|Lucía Pardo|Alumna, iniciación|5\nVinimos en familia y los peques no querían salir del agua.|Marcos Ibáñez|Curso familiar|5\nEl monitor grabó mis olas y corregimos la técnica al momento.|Diego Rus|Clases privadas|4"
  },
  {
    "key": "layout",
    "label": "Disposición",
    "type": "select",
    "default": "grid",
    "options": [
      "grid",
      "carousel"
    ],
    "hint": "carousel usa Swiper: arrastre, flechas y puntos"
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
    "key": "effect",
    "label": "Efecto del carrusel",
    "type": "select",
    "default": "slide",
    "options": [
      "slide",
      "fade",
      "cards"
    ],
    "hint": "fade = una cita que se funde con la siguiente"
  },
  {
    "key": "align",
    "label": "Alineación",
    "type": "select",
    "default": "center",
    "options": [
      "center",
      "left"
    ],
    "labels": {
      "center": "centrada (landing)",
      "left": "a la izquierda (editorial)"
    }
  },
  {
    "key": "rating",
    "label": "Nota media del resumen (0 = sin resumen)",
    "type": "number",
    "default": 4.8,
    "min": 0,
    "max": 5,
    "step": 0.1
  },
  {
    "key": "count",
    "label": "Número de reseñas",
    "type": "number",
    "default": 214,
    "min": 0,
    "max": 5000,
    "step": 1
  },
  {
    "key": "source",
    "label": "Fuente",
    "type": "text",
    "default": "Google"
  },
  {
    "key": "distribution",
    "label": "Reparto por estrellas (filtra las citas)",
    "type": "text",
    "default": "5:180, 4:26, 3:6, 2:1, 1:1"
  },
  {
    "key": "pageSize",
    "label": "Citas al principio (0 = todas; rejilla)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 6,
    "step": 1
  },
  {
    "key": "quoteFont",
    "label": "Fuente de la cita",
    "type": "select",
    "default": "body",
    "options": [
      "body",
      "display"
    ],
    "labels": {
      "body": "la del texto",
      "display": "la de titulares"
    }
  },
  {
    "key": "avatars",
    "label": "Mostrar avatares (foto o iniciales)",
    "type": "boolean",
    "default": true
  },
  {
    "key": "avatarSize",
    "label": "Tamaño de los retratos",
    "type": "select",
    "default": "md",
    "options": [
      "sm",
      "md",
      "lg"
    ]
  },
  {
    "key": "avatarShape",
    "label": "Forma del avatar",
    "type": "select",
    "default": "theme",
    "options": [
      "theme",
      "circle"
    ]
  },
  {
    "key": "presentation",
    "label": "Tratamiento de las citas",
    "type": "select",
    "default": "card",
    "options": [
      "card",
      "soft",
      "plain"
    ]
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
[
  "Las tarjetas llenan su celda (rejilla) o su diapositiva (slider): todas a la misma altura, con la cita arriba y el autor abajo.",
  "El reparto filtra por estrellas (aria-pressed); las estrellas sin citas quedan deshabilitadas. Ver /sitios/almibar."
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
  "components": [
    "Avatar",
    "Carousel",
    "CarouselLazy",
    "SectionHeader",
    "Testimonial"
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
