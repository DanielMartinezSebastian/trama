# Guía de estilo (sistema completo de una web premiada)

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./guide-frame.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/GuideFrame.d.ts)
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

GuideFrame

## description

Aplica una de las diecinueve guías de estilo (las ocho de las webs premiadas —lujo tranquilo, monocromo de agencia, técnico de producto, producto nocturno, acento eléctrico, rótulo cinético, editorial cálido, lúdico—, las siete de los estudios por sector —salón editorial claro, barbería de carácter, club de alto contraste, estudio boutique, academia de autor, escuela amarilla, producto de marca— y las cuatro de la estética propia del repo —terminal de neón, arcade pixel, matriz de puntos, estudio en papel—) a un contenedor: tema, par tipográfico, escala en dos escalones (marca y titular), margen y rejilla, superficies y movimiento, con los valores medidos en las webs premiadas. Dentro, las clases ui-g-* y cualquier componente del kit siguen la guía. Cada guía tiene su hoja de estilo en /guias/<id>; compara guías, portadas y relatos en /guias.

## category

secciones

## import

import GuideFrame from "trama-ui/GuideFrame";

## api

```json
{
  "module": "trama-ui/GuideFrame",
  "props": "React.ComponentProps<typeof GuideFrame>",
  "declaration": "types/components/ui/GuideFrame.d.ts",
  "packageDeclaration": "./dist/components/ui/GuideFrame.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "guide",
    "label": "Guía",
    "type": "select",
    "default": "lujo",
    "options": [
      "lujo",
      "monocromo",
      "tecnico",
      "nocturno",
      "electrico",
      "rotulo",
      "calido",
      "ludico",
      "salon",
      "barberia",
      "club",
      "boutique",
      "autor",
      "escuela",
      "marca",
      "terminal",
      "pixel",
      "puntos",
      "papel"
    ],
    "labels": {
      "lujo": "Lujo tranquilo",
      "monocromo": "Monocromo de agencia",
      "tecnico": "Técnico de producto",
      "nocturno": "Producto nocturno",
      "electrico": "Acento eléctrico",
      "rotulo": "Rótulo cinético",
      "calido": "Editorial cálido",
      "ludico": "Lúdico",
      "salon": "Salón editorial claro",
      "barberia": "Barbería de carácter",
      "club": "Club de alto contraste",
      "boutique": "Estudio boutique",
      "autor": "Academia de autor",
      "escuela": "Escuela amarilla",
      "marca": "Producto de marca",
      "terminal": "Terminal de neón",
      "pixel": "Arcade pixel",
      "puntos": "Matriz de puntos",
      "papel": "Estudio en papel"
    }
  },
  {
    "key": "textContrast",
    "label": "Contraste de texto 4,5:1",
    "type": "boolean",
    "default": false
  },
  {
    "key": "title",
    "label": "Titular",
    "type": "text",
    "default": "Luz que llega lejos",
    "noCode": true
  },
  {
    "key": "lead",
    "label": "Entradilla",
    "type": "text",
    "default": "Diseñamos lámparas y espacios que aprovechan la luz del día.",
    "noCode": true
  }
]
```

## notes

```json
[
  "Clases: ui-g-brand, ui-g-h1, ui-g-h2 (titulares), ui-g-body, ui-g-label, ui-g-mono, ui-g-btn (+ --ghost), ui-g-grid, ui-g-wrap, ui-g-section, ui-g-header, ui-g-card, ui-g-line y ui-g-rise (entrada escalonada; cada hijo lleva --i).",
  "Variables: --g-fs-*, --g-margin, --g-gutter, --g-cols, --g-section, --g-dur-*, --g-ease, --g-ease-reveal, --g-stagger (guideToStyle de lib/ui/guides).",
  "Switzer y General Sans (guía técnica) vienen de Fontshare: carga GUIDE_FONTSHARE_CSS o caen a Inter y Onest.",
  "textContrast es opt-in: calcula --mut-text y --acc-text a 4,5:1 sobre --bg para el texto del kit; no cambia --mut/--acc de fondos, bordes ni decoración. Usa colores sRGB opacos (hex o rgb); style se tiene en cuenta y puede sobrescribir los alias. No certifica superficies distintas, transparencias, colores semánticos, estados ni CSS propio que use directamente --mut/--acc."
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
    <GuideFrame guide={selected} textContrast>
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
