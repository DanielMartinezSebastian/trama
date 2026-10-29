# Tarjeta de producto

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./product-card.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/ProductCard.d.ts)
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

ProductCard

## description

Imagen con segunda imagen al pasar el puntero, etiqueta, título, material y precio. Todo el cuadro es un único enlace con nombre claro. Sin JS: el cambio de imagen es CSS.

## category

tarjetas

## import

import ProductCard from "trama-ui/ProductCard";

## api

```json
{
  "module": "trama-ui/ProductCard",
  "props": "React.ComponentProps<typeof ProductCard>",
  "declaration": "types/components/ui/ProductCard.d.ts",
  "packageDeclaration": "./dist/components/ui/ProductCard.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "title",
    "label": "Título",
    "type": "text",
    "default": "Jarrón Ola"
  },
  {
    "key": "price",
    "label": "Precio",
    "type": "number",
    "default": 48,
    "min": 0,
    "max": 999,
    "step": 1
  },
  {
    "key": "compareAt",
    "label": "Precio anterior (0 = sin rebaja)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 999,
    "step": 1
  },
  {
    "key": "badge",
    "label": "Etiqueta",
    "type": "text",
    "default": "Novedad"
  },
  {
    "key": "meta",
    "label": "Línea secundaria",
    "type": "text",
    "default": "Jarrones · gres"
  },
  {
    "key": "soldOut",
    "label": "Agotado",
    "type": "boolean",
    "default": false
  },
  {
    "key": "ratio",
    "label": "Relación de aspecto",
    "type": "text",
    "default": "4 / 5"
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
    "PriceTag"
  ],
  "packages": []
}
```

## Ejemplos

Sin ejemplo específico; consultar receta/guía y declaración completa.

## limitations

```json
[]
```
