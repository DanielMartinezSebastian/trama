# Sección de precios

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./pricing-section.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/PricingSection.d.ts)
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

PricingSection

## description

Precios con datos tipados o texto, selector mensual/anual y condiciones visibles. Tarjetas, columnas unidas, lista, carrusel, carta de servicios (menu) y tabla comparativa accesible (comparison). El mismo componente se adapta a una peluquería o un club sin duplicar su lógica.

## category

secciones

## import

import PricingSection from "trama-ui/PricingSection";

## api

```json
{
  "module": "trama-ui/PricingSection",
  "props": "React.ComponentProps<typeof PricingSection>",
  "declaration": "types/components/ui/PricingSection.d.ts",
  "packageDeclaration": "./dist/components/ui/PricingSection.d.ts",
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
    "default": "Precios"
  },
  {
    "key": "title",
    "label": "Titular",
    "type": "text",
    "default": "Un plan para cada tamaño"
  },
  {
    "key": "subtitle",
    "label": "Subtítulo",
    "type": "text",
    "default": "Cambia o cancela cuando quieras."
  },
  {
    "key": "plans",
    "label": "Planes (uno por línea: «nombre|precio|periodo|destacado si/no|características;…|descripción|precio anual»; «-» delante = no incluida)",
    "type": "text",
    "multiline": true,
    "default": "Básico|9 €|/ mes|no|Un proyecto;Exportación PNG;Soporte por email;-Dominio propio|Para probar sin compromiso|90 €\nPro|29 €|/ mes|si|Proyectos ilimitados;Soporte prioritario;Exportación a PNG y SVG;Dominio propio|Para quien publica cada semana|290 €\nEquipo|79 €|/ mes|no|Todo lo de Pro;5 puestos;Panel de administración;Facturación centralizada|Para estudios y agencias|790 €"
  },
  {
    "key": "layout",
    "label": "Disposición",
    "type": "select",
    "default": "grid",
    "options": [
      "grid",
      "joined",
      "list",
      "carousel",
      "menu",
      "comparison"
    ],
    "labels": {
      "grid": "rejilla",
      "joined": "una pieza con columnas",
      "list": "lista horizontal",
      "carousel": "carrusel",
      "menu": "carta de servicios",
      "comparison": "tabla comparativa"
    }
  },
  {
    "key": "comparison",
    "label": "Comparación: prestación|plan 1|plan 2|plan 3",
    "type": "text",
    "multiline": true,
    "default": "Proyectos|1|Sin límite|Sin límite\nPuestos|1|1|5\nSoporte|Email|Prioritario|Prioritario"
  },
  {
    "key": "caption",
    "label": "Nombre accesible de la tabla",
    "type": "text",
    "default": "Comparación de planes"
  },
  {
    "key": "footnote",
    "label": "Condiciones bajo los precios",
    "type": "text",
    "default": ""
  },
  {
    "key": "cardLayout",
    "label": "Tarjetas",
    "type": "select",
    "default": "classic",
    "options": [
      "classic",
      "compact"
    ]
  },
  {
    "key": "highlight",
    "label": "Plan destacado",
    "type": "select",
    "default": "invert",
    "options": [
      "invert",
      "glow",
      "border",
      "lift"
    ],
    "labels": {
      "invert": "invertido (fondo de acento)",
      "glow": "halo de acento",
      "border": "borde grueso",
      "lift": "luz cenital (producto)"
    }
  },
  {
    "key": "badge",
    "label": "Insignia del destacado",
    "type": "text",
    "default": "Más popular"
  },
  {
    "key": "planCase",
    "label": "Nombre del plan",
    "type": "select",
    "default": "upper",
    "options": [
      "upper",
      "none"
    ],
    "labels": {
      "upper": "versalitas",
      "none": "tal cual"
    }
  },
  {
    "key": "marker",
    "label": "Marca de las características",
    "type": "select",
    "default": "plus",
    "options": [
      "plus",
      "check"
    ],
    "labels": {
      "plus": "+",
      "check": "✓ fina (no incluidas sin tachar)"
    }
  },
  {
    "key": "toggle",
    "label": "Selector mensual/anual",
    "type": "select",
    "default": "accent",
    "options": [
      "accent",
      "neutral"
    ],
    "labels": {
      "accent": "en el acento",
      "neutral": "neutro"
    }
  },
  {
    "key": "fill",
    "label": "Fondo del resto",
    "type": "select",
    "default": "surface",
    "options": [
      "surface",
      "tint",
      "gradient",
      "pattern"
    ],
    "labels": {
      "surface": "el de la variante",
      "tint": "tinte de acento",
      "gradient": "degradado",
      "pattern": "trama"
    }
  },
  {
    "key": "yearlyNote",
    "label": "Etiqueta de ahorro anual",
    "type": "text",
    "default": "2 meses gratis"
  },
  {
    "key": "cta",
    "label": "Botón de cada plan",
    "type": "text",
    "default": "Empezar ahora"
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
[
  "Fórmula de producto: joined + lift. Servicios: menu + planes tipados con meta (duración), note (condición) y href. Club social: comparison con filas de prestaciones; gimnasio de fuerza: list. Ejemplos en Hebra, Esparta, Cadencia y Forja.",
  "plans acepta PricingPlan[] además del texto. El texto permite dos columnas nuevas al final: meta y nota. Un precio anual igual al mensual mantiene su periodo. El total anual no se presenta como una equivalencia mensual sin calcular."
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
    "Badge",
    "Button",
    "Carousel",
    "CarouselLazy",
    "Icon",
    "PricingCard",
    "SectionHeader"
  ],
  "packages": [
    {
      "name": "pixelarticons",
      "version": "^2.4.1"
    },
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
