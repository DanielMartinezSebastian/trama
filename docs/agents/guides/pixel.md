# Arcade pixel

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./pixel.json).

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
  "id": "pixel",
  "source": "repo",
  "label": "Arcade pixel",
  "note": "Ciruela de noche, letra de píxel solo en los titulares, monoespaciada para leer, un amarillo de moneda y esquinas que no se redondean.",
  "sectors": "Videojuegos indie, estudios creativos, eventos, merchandising, comunidades",
  "refs": [
    "Pixelforge (/sitios/pixelforge)",
    "Hamaca (/sitios/hamaca)",
    "MINIMAL (/demo/th-minimal)"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#140b26",
    "fg": "#f4efff",
    "mut": "#a99cc9",
    "acc": "#ffcc4d",
    "acc2": "#ff6b8b",
    "card": "#2b1e2a",
    "ln": "rgba(244,239,255,0.18)",
    "r": 0,
    "font": "var(--font-space-mono), ui-monospace, Consolas, monospace",
    "display": "var(--font-silkscreen), ui-monospace, Consolas, monospace",
    "accentFont": "var(--font-silkscreen), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-silkscreen), ui-monospace, Consolas, monospace",
    "body": "var(--font-space-mono), ui-monospace, Consolas, monospace",
    "accent": "var(--font-silkscreen), ui-monospace, Consolas, monospace",
    "mono": "var(--font-space-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 12vw, 11rem)",
    "h1": "clamp(2rem, 4.4vw, 4rem)",
    "h2": "clamp(1.5rem, 2.4vw, 2.25rem)",
    "body": "1.0625rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 1,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.06,
    "bodyLineHeight": 1.6
  },
  "space": {
    "margin": "max(24px, calc((100vw - 1160px) / 2))",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 128px)",
    "header": "64px",
    "measure": "33em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.12,
    "reveal": 0.5,
    "page": 0.4,
    "stagger": 0.04,
    "ease": "steps(3, end)",
    "easeReveal": "steps(6, end)"
  },
  "heroes": [
    "wordmark",
    "framed-object"
  ],
  "stories": [
    "product",
    "world",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"pixel\">",
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
    "--font-silkscreen",
    "--font-space-mono"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,86:1 | texto normal |
| --fg | --card | 14,10:1 | texto normal |
| --mut | --bg | 7,49:1 | texto normal |
| --mut | --card | 6,27:1 | texto normal |
| --acc | --bg | 12,66:1 | texto normal |
| --acc | --card | 10,59:1 | texto normal |
| --acc2 | --bg | 6,99:1 | texto normal |
| --acc2 | --card | 5,85:1 | texto normal |

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
