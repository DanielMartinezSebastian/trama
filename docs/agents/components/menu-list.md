# Carta con alérgenos

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./menu-list.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/MenuList.d.ts)
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

MenuList

## description

Carta en HTML con secciones, precios con puntos guía, etiquetas, los 14 alérgenos del Reglamento UE 1169/2011 (abreviatura visible y nombre para el lector de pantalla), filtro «Sin gluten / sin leche…» que oculta lo que no puedes tomar, agotados del día y botón de añadir para el pedido en mesa o para recoger.

## category

contenido

## import

import MenuList from "trama-ui/MenuList";

## api

```json
{
  "module": "trama-ui/MenuList",
  "props": "React.ComponentProps<typeof MenuList>",
  "declaration": "types/components/ui/MenuList.d.ts",
  "packageDeclaration": "./dist/components/ui/MenuList.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "layout",
    "label": "Forma",
    "type": "select",
    "default": "list",
    "options": [
      "list",
      "columns",
      "cards"
    ],
    "labels": {
      "list": "lista con puntos guía",
      "columns": "dos columnas",
      "cards": "tarjetas"
    }
  },
  {
    "key": "filter",
    "label": "Filtro de alérgenos",
    "type": "boolean",
    "default": true
  },
  {
    "key": "add",
    "label": "Botón «Añadir» (onAdd)",
    "type": "boolean",
    "default": false,
    "noCode": true
  },
  {
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "minimal",
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
  "La carta como texto: `#Sección|nota` y una línea por plato `Nombre|descripción|precio|alérgenos|etiquetas`. O como datos: `MenuSection[]` con `soldOut` e `image` por plato.",
  "Es la carta que abre el QR de la mesa: ver QRCode y /sitios/almibar-barrio/mesa/7."
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
