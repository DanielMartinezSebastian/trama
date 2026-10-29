# Horario con estado (abierto ahora)

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./opening-hours.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/OpeningHours.d.ts)
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

OpeningHours

## description

«Abierto ahora · cierra a las 20:30» calculado en la zona horaria del negocio, con tramos partidos, días cerrados, festivos y aperturas especiales. La semana se pinta en el servidor y el estado al montar. openingHoursSchema() da el mismo horario en schema.org para el JSON-LD.

## category

datos

## import

import OpeningHours from "trama-ui/OpeningHours";

## api

```json
{
  "module": "trama-ui/OpeningHours",
  "props": "React.ComponentProps<typeof OpeningHours>",
  "declaration": "types/components/ui/OpeningHours.d.ts",
  "packageDeclaration": "./dist/components/ui/OpeningHours.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "hours",
    "label": "Horario (días|tramos)",
    "type": "text",
    "default": "L-V|07:30-14:00 17:00-20:30\nS|08:00-14:30\nD|cerrado",
    "multiline": true,
    "hint": "Días L M X J V S D, en rango (L-V) o lista (L,X); tramos 07:30-14:00 17:00-20:30 o «cerrado»"
  },
  {
    "key": "exceptions",
    "label": "Festivos (fecha|motivo|tramos)",
    "type": "text",
    "default": "2026-12-25|Navidad\n2026-12-24|Nochebuena|08:00-14:00",
    "multiline": true
  },
  {
    "key": "layout",
    "label": "Forma",
    "type": "select",
    "default": "full",
    "options": [
      "full",
      "compact",
      "badge"
    ],
    "labels": {
      "full": "semana completa",
      "compact": "solo hoy",
      "badge": "solo el estado"
    }
  },
  {
    "key": "timeZone",
    "label": "Zona horaria",
    "type": "text",
    "default": "Europe/Madrid"
  },
  {
    "key": "soonMinutes",
    "label": "«Cierra pronto» (min antes)",
    "type": "number",
    "default": 30,
    "min": 0,
    "max": 120,
    "step": 5
  },
  {
    "key": "title",
    "label": "Título",
    "type": "text",
    "default": "Horario"
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
  "El estado depende de la hora del navegador convertida a la zona del negocio: un visitante de otro país ve si abre según la hora de allí.",
  "Para la ficha de Google y la búsqueda con IA: <JsonLd data={{ \"@type\": \"Bakery\", openingHoursSpecification: openingHoursSchema(hours, exceptions) }} />."
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
