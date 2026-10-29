# Sección de equipo

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./team-section.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/TeamSection.d.ts)
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

TeamSection

## description

Cabecera de sección + perfiles del equipo: foto con marco y tratamiento (o avatar de iniciales), biografía y enlace por persona para reservar con ella; en rejilla, carrusel o filas.

## category

secciones

## import

import TeamSection from "trama-ui/TeamSection";

## api

```json
{
  "module": "trama-ui/TeamSection",
  "props": "React.ComponentProps<typeof TeamSection>",
  "declaration": "types/components/ui/TeamSection.d.ts",
  "packageDeclaration": "./dist/components/ui/TeamSection.d.ts",
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
    "default": "El equipo"
  },
  {
    "key": "title",
    "label": "Titular",
    "type": "text",
    "default": "Quién te va a enseñar"
  },
  {
    "key": "people",
    "label": "Personas (una por línea, «nombre|rol|foto|bio|enlace»)",
    "type": "text",
    "multiline": true,
    "default": "Marta Solé|Directora y monitora|/img/retratos/03-pixie-cut-unsplash.jpg|Doce años en el agua y una regla: nadie sale sin coger su ola.|#reservar\nEnzo Rial|Monitor de iniciación|/img/retratos/06-man-with-crossed-arms-unsplash.jpg|Paciencia infinita con el primer remo.|#reservar\nCarla Duque|Monitora y fotógrafa|/img/retratos/01-a-friend-unsplash.jpg|Te enseña y luego te lo enseña en foto.|#reservar",
    "hint": "Sin foto, avatar de iniciales; sin enlace, sin botón"
  },
  {
    "key": "layout",
    "label": "Disposición",
    "type": "select",
    "default": "grid",
    "options": [
      "grid",
      "carousel",
      "rows",
      "wall"
    ],
    "hint": "carousel usa Swiper; rows es una fila por persona, como en los salones; wall es un muro denso de retratos"
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
    "key": "shape",
    "label": "Marco de la foto",
    "type": "select",
    "default": "portrait",
    "options": [
      "portrait",
      "square",
      "circle",
      "oval"
    ]
  },
  {
    "key": "photoTone",
    "label": "Tratamiento",
    "type": "select",
    "default": "color",
    "options": [
      "color",
      "mono",
      "mono-hover"
    ],
    "hint": "mono-hover: blanco y negro que se colorea al pasar"
  },
  {
    "key": "align",
    "label": "Alineación",
    "type": "select",
    "default": "center",
    "options": [
      "center",
      "left"
    ]
  },
  {
    "key": "linkLabel",
    "label": "Texto del enlace",
    "type": "text",
    "default": "Reservar"
  },
  {
    "key": "rowLink",
    "label": "Fila entera como enlace (filas)",
    "type": "boolean",
    "default": false
  },
  {
    "key": "titleSize",
    "label": "Titular",
    "type": "select",
    "default": "md",
    "options": [
      "md",
      "giant"
    ]
  },
  {
    "key": "backdrop",
    "label": "Palabra de fondo",
    "type": "text",
    "default": ""
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
