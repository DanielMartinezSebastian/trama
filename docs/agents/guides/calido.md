# Editorial cálido

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./calido.json).

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
  "id": "calido",
  "source": "premiadas",
  "label": "Editorial cálido",
  "note": "Crema, tinta verde y una serifa de contraste enorme; telón de color entre páginas. Arquitectura y cultura.",
  "sectors": "Arquitectura, cultura, editoriales, gastronomía de autor",
  "refs": [
    "Belgrade Arbor",
    "Akaru",
    "David Whyte",
    "Iventions"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#fdfbef",
    "fg": "#2e3a26",
    "mut": "#5b6150",
    "acc": "#8a5a1f",
    "acc2": "#2e3a26",
    "card": "#f3efdc",
    "ln": "rgba(46,58,38,0.18)",
    "r": 20,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-gloock), Georgia, serif",
    "accentFont": "var(--font-gloock), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-gloock), Georgia, serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-gloock), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 16.7vw, 15rem)",
    "h1": "clamp(2.5rem, 6vw, 6.5rem)",
    "h2": "clamp(2rem, 3.9vw, 3.5rem)",
    "body": "clamp(1rem, 0.9rem + 0.35vw, 1.25rem)",
    "label": "0.8125rem",
    "weight": 400,
    "lineHeight": 0.95,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.06,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(20px, 4.4vw, 64px)",
    "gutter": "24px",
    "cols": 12,
    "section": "clamp(112px, 12vw, 200px)",
    "header": "72px",
    "measure": "33em"
  },
  "surface": {
    "radius": 20,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.5,
    "reveal": 1.1,
    "page": 0.9,
    "stagger": 0.07,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "wordmark",
    "split-video"
  ],
  "stories": [
    "timeline",
    "chapters",
    "manifesto"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"calido\">",
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
    "--font-gloock",
    "--font-instrument-sans"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 11,56:1 | texto normal |
| --fg | --card | 10,40:1 | texto normal |
| --mut | --bg | 6,18:1 | texto normal |
| --mut | --card | 5,56:1 | texto normal |
| --acc | --bg | 5,68:1 | texto normal |
| --acc | --card | 5,11:1 | texto normal |
| --acc2 | --bg | 11,56:1 | texto normal |
| --acc2 | --card | 10,40:1 | texto normal |

## requirements

```json
[
  "En Next.js: fuentes requeridas desde trama-ui/fonts en layout de servidor, transpilePackages: ['trama-ui']; verificar build y carga con next/font/google.",
  "Usar las clases ui-g-* para escala y composición; pasar variante sugerida a las piezas que la admitan.",
  "Nombrar las fuentes por su variable (`var(--font-cormorant-garamond)`, ver fontVariables) o heredarlas de ui-g-*; el nombre literal ('Cormorant') no coincide con la familia que registra next/font y cae a una fuente del sistema.",
  "Los pares de `contrast` por debajo de 4,5:1 no sirven para texto normal tal cual: oscurecer ese rol en un tema local (style con --mut/--acc) y registrar la razón; las piezas del kit usan --mut y --acc para etiquetas, metadatos y botones."
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
