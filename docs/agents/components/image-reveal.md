# Imagen que se descubre

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./image-reveal.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/ImageReveal.d.ts)
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

ImageReveal

## description

Imagen que se abre con una máscara (clip-path) mientras se asienta de una ampliación a su tamaño. Reserva su hueco con ratio y espera al Preloader.

## category

galerias

## import

import ImageReveal from "trama-ui/ImageReveal";

## api

```json
{
  "module": "trama-ui/ImageReveal",
  "props": "React.ComponentProps<typeof ImageReveal>",
  "declaration": "types/components/ui/ImageReveal.d.ts",
  "packageDeclaration": "./dist/components/ui/ImageReveal.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "from",
    "label": "Se abre desde",
    "type": "select",
    "default": "bottom",
    "options": [
      "bottom",
      "top",
      "left",
      "right",
      "center"
    ]
  },
  {
    "key": "ratio",
    "label": "Relación de aspecto",
    "type": "text",
    "default": "4 / 5"
  },
  {
    "key": "zoom",
    "label": "Ampliación inicial",
    "type": "number",
    "default": 1.25,
    "min": 1,
    "max": 2,
    "step": 0.05
  },
  {
    "key": "duration",
    "label": "Duración (s)",
    "type": "number",
    "default": 1.2,
    "min": 0.3,
    "max": 3,
    "step": 0.1
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
