# Club de alto contraste

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./club.json).

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
  "id": "club",
  "source": "sectores",
  "label": "Club de alto contraste",
  "note": "Negro absoluto y blanco con un acento saturado, condensada en mayúsculas gigante y muy apretada, píldoras de contorno y texto que rueda.",
  "sectors": "Gimnasio, artes marciales, entrenador personal, agencia creativa",
  "refs": [
    "FIT AND YOU",
    "Essor Fitness",
    "Skulpt",
    "Fenriz Gym",
    "K72"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#000000",
    "fg": "#ffffff",
    "mut": "#999999",
    "acc": "#cef952",
    "acc2": "#ffffff",
    "card": "#141414",
    "ln": "rgba(255,255,255,0.22)",
    "r": 0,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif",
    "accentFont": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif"
  },
  "fonts": {
    "display": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4.5rem, 14.4vw, 13rem)",
    "h1": "clamp(3rem, 11vw, 10rem)",
    "h2": "clamp(2.5rem, 6.8vw, 6rem)",
    "body": "clamp(1rem, 0.9rem + 0.3vw, 1.1875rem)",
    "label": "0.8125rem",
    "weight": 700,
    "lineHeight": 0.94,
    "tracking": -0.06,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.05,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(16px, 1.7vw, 24px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 10vw, 160px)",
    "header": "64px",
    "measure": "27em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.15,
    "reveal": 0.9,
    "page": 0.6,
    "stagger": 0.07,
    "ease": "cubic-bezier(0.215, 0.61, 0.355, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "wordmark",
    "split-video"
  ],
  "stories": [
    "chapters",
    "index"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"club\">",
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
    "--font-anton",
    "--font-antonio",
    "--font-geist-mono",
    "--font-inter"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 21,00:1 | texto normal |
| --fg | --card | 18,42:1 | texto normal |
| --mut | --bg | 7,37:1 | texto normal |
| --mut | --card | 6,47:1 | texto normal |
| --acc | --bg | 17,30:1 | texto normal |
| --acc | --card | 15,17:1 | texto normal |
| --acc2 | --bg | 21,00:1 | texto normal |
| --acc2 | --card | 18,42:1 | texto normal |

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
