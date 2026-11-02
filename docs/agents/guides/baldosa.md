# Mosaico de baldosas

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./baldosa.json).

- [GuideFrame y API](../components/guide-frame.md)
- [Índice piloto](../README.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## guide

```json
{
  "id": "baldosa",
  "source": "premiadas",
  "label": "Mosaico de baldosas",
  "note": "La página es una rejilla de baldosas a filete fino: palabra enorme, semitono, una baldosa negra y otra menta. Grotesca suiza muy apretada y relojes en la cabecera.",
  "sectors": "Selección de personal, consultoría, servicios financieros, despachos, B2B con criterio",
  "refs": [
    "Aspen Search",
    "Cantera (/inspiraciones/cantera)"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#232323",
    "mut": "#5e5e5e",
    "acc": "#0a7a4b",
    "acc2": "#a1ffcb",
    "card": "#e0e0e0",
    "ln": "#232323",
    "r": 0,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4.5rem, 12.5vw, 13rem)",
    "h1": "clamp(3rem, 7.6vw, 7rem)",
    "h2": "clamp(2.25rem, 4.2vw, 3.75rem)",
    "body": "1rem",
    "label": "0.6875rem",
    "weight": 450,
    "lineHeight": 1,
    "tracking": -0.04,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.02,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "14px",
    "gutter": "0px",
    "cols": 12,
    "section": "clamp(64px, 7vw, 100px)",
    "header": "38px",
    "measure": "24em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.8,
    "page": 0.65,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.16, 1, 0.3, 1)",
    "easeReveal": "cubic-bezier(0.87, 0, 0.13, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "wordmark"
  ],
  "stories": [
    "manifesto",
    "index"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"baldosa\">",
  "css": "trama-ui/styles.css",
  "classes": [
    "ui-g-body",
    "ui-g-brand",
    "ui-g-btn",
    "ui-g-btn--ghost",
    "ui-g-card",
    "ui-g-grid",
    "ui-g-h1",
    "ui-g-h2",
    "ui-g-header",
    "ui-g-label",
    "ui-g-line",
    "ui-g-mono",
    "ui-g-muted",
    "ui-g-rise",
    "ui-g-section",
    "ui-g-wrap"
  ],
  "fontVariables": [
    "--font-geist-mono",
    "--font-inter",
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,72:1 | texto normal |
| --fg | --card | 11,91:1 | texto normal |
| --mut | --bg | 6,48:1 | texto normal |
| --mut | --card | 4,91:1 | texto normal |
| --acc | --bg | 5,39:1 | texto normal |
| --acc | --card | 4,08:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --bg | 1,19:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,11:1 | decorativo: no usar para texto ni controles |

## requirements

```json
[
  "En Next.js: fuentes requeridas desde trama-ui/fonts en layout de servidor, transpilePackages: ['trama-ui']; verificar build y carga con next/font/google.",
  "Usar las clases ui-g-* para escala y composición; pasar variante sugerida a las piezas que la admitan.",
  "Nombrar las fuentes por su variable (`var(--font-cormorant-garamond)`, ver fontVariables) o heredarlas de ui-g-*; el nombre literal ('Cormorant') no coincide con la familia que registra next/font y cae a una fuente del sistema.",
  "Los pares de `contrast` por debajo de 4,5:1 no sirven para texto normal tal cual: GuideFrame textContrast calcula --mut-text/--acc-text para el texto del kit sobre --bg (sRGB opaco), conservando --mut/--acc decorativos. Consultar sus límites en la API; para otras superficies/estados o CSS propio, adaptar y medir el tema local."
]
```

## Ejemplos

Sin ejemplo específico; consultar receta/guía y declaración completa.

## limitations

```json
[
  "La tabla de contraste mide tokens sobre fondos lisos; revisar la aplicación visual en cada proyecto (imágenes, transparencias, estados). Una guía no certifica accesibilidad.",
  "Fotos, vídeos y fuentes Fontshare no se redistribuyen por esta ficha.",
  "No se declara soporte universal de Next.js o de React genérico a partir de un consumidor piloto."
]
```
