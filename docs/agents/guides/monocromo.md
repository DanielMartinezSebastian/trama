# Monocromo de agencia

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./monocromo.json).

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
  "id": "monocromo",
  "source": "premiadas",
  "label": "Monocromo de agencia",
  "note": "Blanco y negro, una grotesca gigante en peso normal con tracking muy negativo, rejilla fina. El trabajo pone el color.",
  "sectors": "Estudios, agencias, portfolios, productoras",
  "refs": [
    "twks",
    "bleibtgleich",
    "Huy Phan",
    "Obys",
    "Signal-A"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#0e0e0e",
    "mut": "#5c5c5c",
    "acc": "#0e0e0e",
    "acc2": "#0e0e0e",
    "card": "#f2f2f2",
    "ln": "rgba(14,14,14,0.14)",
    "r": 0,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-instrument-serif), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-instrument-serif), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 17rem)",
    "h1": "clamp(2.5rem, 6.4vw, 7rem)",
    "h2": "clamp(2rem, 3.7vw, 3.5rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 500,
    "lineHeight": 0.88,
    "tracking": -0.045,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "12px",
    "gutter": "10px",
    "cols": 12,
    "section": "clamp(80px, 10vw, 160px)",
    "header": "40px",
    "measure": "28em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.4,
    "reveal": 0.9,
    "page": 0.8,
    "stagger": 0.04,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "wordmark",
    "collage-manifesto"
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
  "usage": "<GuideFrame guide=\"monocromo\">",
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
    "--font-instrument-serif",
    "--font-inter",
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 19,30:1 | texto normal |
| --fg | --card | 17,24:1 | texto normal |
| --mut | --bg | 6,69:1 | texto normal |
| --mut | --card | 5,97:1 | texto normal |
| --acc | --bg | 19,30:1 | texto normal |
| --acc | --card | 17,24:1 | texto normal |
| --acc2 | --bg | 19,30:1 | texto normal |
| --acc2 | --card | 17,24:1 | texto normal |

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
