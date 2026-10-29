# Cabecera de sección

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./section-header.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/SectionHeader.d.ts)
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

SectionHeader

## description

Sobretítulo, titular, subtítulo y regla decorativa; titular gigante y palabra de fondo opcionales.

## category

texto

## import

import SectionHeader from "trama-ui/SectionHeader";

## api

```json
{
  "module": "trama-ui/SectionHeader",
  "props": "React.ComponentProps<typeof SectionHeader>",
  "declaration": "types/components/ui/SectionHeader.d.ts",
  "packageDeclaration": "./dist/components/ui/SectionHeader.d.ts",
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
    "default": "Cómo funciona"
  },
  {
    "key": "title",
    "label": "Titular",
    "type": "text",
    "default": "Tres pasos y estás en el agua"
  },
  {
    "key": "subtitle",
    "label": "Subtítulo",
    "type": "text",
    "default": "Reserva, elige tu horario y nosotros nos ocupamos del resto."
  },
  {
    "key": "align",
    "label": "Alineación",
    "type": "select",
    "default": "left",
    "options": [
      "left",
      "center"
    ]
  },
  {
    "key": "rule",
    "label": "Regla",
    "type": "select",
    "default": "line",
    "options": [
      "none",
      "line",
      "ascii",
      "dots"
    ]
  },
  {
    "key": "titleSize",
    "label": "Titular",
    "type": "select",
    "default": "md",
    "options": [
      "md",
      "giant"
    ],
    "hint": "giant: a lo ancho y apretado, como los «Locations» de las barberías"
  },
  {
    "key": "backdrop",
    "label": "Palabra de fondo",
    "type": "text",
    "default": "",
    "hint": "Enorme y tenue en una franja recortada sobre el texto («blog», «tienda»)"
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
  "packages": []
}
```

## Ejemplos

### salon-style

La generación no acredita compilación o navegador; validar tipos, build y recorrido en el proyecto consumidor. Los ensayos del paquete se registran en el informe de entrega.

```tsx
import GuideFrame from "trama-ui/GuideFrame";
import SectionHeader from "trama-ui/SectionHeader";
import Button from "trama-ui/Button";
import { guide } from "trama-ui";
import "trama-ui/styles.css";

export default function SalonStyleSample() {
  const selected = guide("salon");
  return (
    <GuideFrame guide={selected}>
      <main className="ui-g-wrap ui-g-section">
        <h1 className="ui-g-brand">Linde</h1>
        <p className="ui-g-body">Corte y color. Tiempo para escucharte.</p>
        <SectionHeader title="Oficio, sin prisa." kicker="EL SALÓN" subtitle="Un salón ficticio para probar Trama." backdrop="oficio" variant={selected.variant} />
        <Button label="Reservar una cita de prueba" href="/reservar" variant={selected.variant} />
      </main>
    </GuideFrame>
  );
}
```

## limitations

```json
[]
```
