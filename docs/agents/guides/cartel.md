# Cartel suizo

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./cartel.json).

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
  "id": "cartel",
  "source": "premiadas",
  "label": "Cartel suizo",
  "note": "Blanco, negro y bloques planos de verde y naranja. Grotesca 700 con interlineado cerrado, fotos en gris dentro de la palabra y años a toda la página.",
  "sectors": "Música, festivales, museos, fotografía, marcas personales",
  "refs": [
    "Paul Kalkbrenner",
    "Pulso Lento (/inspiraciones/pulso-lento)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#000000",
    "mut": "#555555",
    "acc": "#c43e0d",
    "acc2": "#a7ff9c",
    "card": "#c5c5c5",
    "ln": "#000000",
    "r": 0,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 16vw, 16rem)",
    "h1": "clamp(3rem, 7.8vw, 7.5rem)",
    "h2": "clamp(2.25rem, 6.4vw, 6.5rem)",
    "body": "0.875rem",
    "label": "0.75rem",
    "weight": 700,
    "lineHeight": 0.84,
    "tracking": -0.05,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "12px",
    "gutter": "8px",
    "cols": 12,
    "section": "clamp(60px, 7vw, 100px)",
    "header": "44px",
    "measure": "26em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.55,
    "page": 0.55,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.625, 0.05, 0, 1)",
    "easeReveal": "cubic-bezier(0.87, 0, 0.13, 1)"
  },
  "heroes": [
    "wordmark",
    "marquee-window"
  ],
  "stories": [
    "timeline",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"cartel\">",
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
| --fg | --bg | 21,00:1 | texto normal |
| --fg | --card | 12,17:1 | texto normal |
| --mut | --bg | 7,46:1 | texto normal |
| --mut | --card | 4,32:1 | solo texto grande, iconos o bordes de control |
| --acc | --bg | 5,20:1 | texto normal |
| --acc | --card | 3,01:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --bg | 1,21:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,43:1 | decorativo: no usar para texto ni controles |

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
