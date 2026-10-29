# Barra de acciones en móvil

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./action-bar.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/ActionBar.d.ts)
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

ActionBar

## description

Llamar, WhatsApp, cómo llegar y la acción principal (reservar, pedir, pedir cita) fijos abajo en móvil, en la zona del pulgar: objetivos de 56 px, safe-area-inset-bottom y un hueco al final de la página para no tapar el pie. Por encima de 760 px se oculta (show="mobile"). Con soft, sin bandeja ni botón relleno: vidrio que se difumina hacia arriba, acciones iguales e iconos con brillo (la principal, en el acento).

## category

navegacion

## import

import ActionBar from "trama-ui/ActionBar";

## api

```json
{
  "module": "trama-ui/ActionBar",
  "props": "React.ComponentProps<typeof ActionBar>",
  "declaration": "types/components/ui/ActionBar.d.ts",
  "packageDeclaration": "./dist/components/ui/ActionBar.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "actions",
    "label": "Acciones (etiqueta|enlace|icono|primary)",
    "type": "text",
    "default": "Llamar|tel:+34976000000|phone\nWhatsApp|https://wa.me/34600000000|message\nCómo llegar|https://maps.google.com/?q=Zaragoza|map-pin\nReservar|#reservar|calendar|primary",
    "multiline": true
  },
  {
    "key": "show",
    "label": "Cuándo",
    "type": "select",
    "default": "mobile",
    "options": [
      "mobile",
      "always"
    ],
    "labels": {
      "mobile": "solo en móvil",
      "always": "siempre"
    }
  },
  {
    "key": "position",
    "label": "Posición",
    "type": "select",
    "default": "static",
    "options": [
      "fixed",
      "static"
    ],
    "labels": {
      "fixed": "fija abajo",
      "static": "en el flujo"
    }
  },
  {
    "key": "soft",
    "label": "Suave (vidrio difuminado)",
    "type": "boolean",
    "default": false
  },
  {
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "solid",
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
  "En el catálogo va «en el flujo» para verla en la ficha; en una web, position=\"fixed\" (el valor por defecto).",
  "Una sola acción primary: es la que el negocio quiere que hagas (B15 en docs/11)."
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
    "Icon"
  ],
  "packages": [
    {
      "name": "pixelarticons",
      "version": "^2.4.1"
    },
    {
      "name": "react",
      "version": "^19.3.0"
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
