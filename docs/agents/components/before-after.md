# Antes / después con control

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./before-after.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/BeforeAfter.d.ts)
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

BeforeAfter

## description

Comparador de dos imágenes (o de dos contenidos cualesquiera): un corte que se arrastra, accesible como deslizador (flechas, Inicio, Fin), o un botón que alterna entre los dos (día/noche, apagado/encendido). Para limpiezas, reformas, tratamientos y restauraciones; las dos imágenes con la misma luz.

## category

interaccion

## import

import BeforeAfter from "trama-ui/BeforeAfter";

## api

```json
{
  "module": "trama-ui/BeforeAfter",
  "props": "React.ComponentProps<typeof BeforeAfter>",
  "declaration": "types/components/ui/BeforeAfter.d.ts",
  "packageDeclaration": "./dist/components/ui/BeforeAfter.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "mode",
    "label": "Modo",
    "type": "select",
    "default": "slider",
    "options": [
      "slider",
      "toggle"
    ]
  },
  {
    "key": "orientation",
    "label": "Orientación",
    "type": "select",
    "default": "horizontal",
    "options": [
      "horizontal",
      "vertical"
    ]
  },
  {
    "key": "initial",
    "label": "Posición inicial (%)",
    "type": "number",
    "default": 50,
    "min": 0,
    "max": 100
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
  "Lo pedían la docs/11 §5 (clínicas, reformas) y la docs/15 (Colonia Zacamil); la primera web que lo usa es Quilate (limpieza de una joya)."
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
