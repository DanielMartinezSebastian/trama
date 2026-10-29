# Mosaico de formas

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./shape-mosaic.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/ShapeMosaic.d.ts)
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

ShapeMosaic

## description

Rejilla de círculos y cuadrados en tres tonos del acento, con foto dentro de algunas formas. Al bajar, las columnas se desplazan en sentidos alternos y las fotos se disuelven en el color de su forma hasta dejar solo geometría (Il Colorista). Los tonos salen de --acc mezclado con --bg.

## category

galerias

## import

import ShapeMosaic from "trama-ui/ShapeMosaic";

## api

```json
{
  "module": "trama-ui/ShapeMosaic",
  "props": "React.ComponentProps<typeof ShapeMosaic>",
  "declaration": "types/components/ui/ShapeMosaic.d.ts",
  "packageDeclaration": "./dist/components/ui/ShapeMosaic.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "items",
    "label": "Formas (forma|tono|foto|texto alternativo)",
    "type": "text",
    "multiline": true,
    "default": "square|2\ncircle|0|/img/hebra/trabajo-ondas.webp|Melena ondulada\nsquare|3|/img/hebra/trabajo-balayage.webp|Balayage\ncircle|1\ncircle|3\nsquare|1|/img/hebra/trabajo-rizo.webp|Rizo definido\ncircle|2\nsquare|3|/img/hebra/trabajo-corte-corto.webp|Pixie",
    "hint": "Tono 1 = acento, 2 = aclarado, 3 = muy claro, 0 = hueco"
  },
  {
    "key": "columns",
    "label": "Columnas",
    "type": "number",
    "default": 4,
    "min": 2,
    "max": 8,
    "step": 1
  },
  {
    "key": "drift",
    "label": "Deriva de las columnas (px)",
    "type": "number",
    "default": 60,
    "min": 0,
    "max": 200,
    "step": 10
  },
  {
    "key": "dissolve",
    "label": "Las fotos se disuelven al bajar",
    "type": "boolean",
    "default": true
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
