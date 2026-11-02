# Mineral y bosque

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./mineral.json).

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
  "id": "mineral",
  "source": "repo",
  "label": "Mineral y bosque",
  "note": "Gris mineral y verde bosque, Geist amplia, producto explorable y datos de materiales. Comercio narrativo con los pies en el suelo.",
  "sectors": "Audio, electrónica de consumo, materiales, comercio narrativo",
  "refs": [
    "SONDA · Materia (/producto/materia)",
    "Floema"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#d7d7c9",
    "fg": "#24473b",
    "mut": "#42594f",
    "acc": "#24473b",
    "acc2": "#8b5a2b",
    "card": "#c9c9ba",
    "ln": "rgba(36,71,59,0.26)",
    "r": 6,
    "font": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 14vw, 13rem)",
    "h1": "clamp(2.5rem, 6vw, 6rem)",
    "h2": "clamp(2rem, 3.8vw, 3.5rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 0.96,
    "tracking": -0.04,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.05,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "clamp(18px, 3vw, 44px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(90px, 10vw, 150px)",
    "header": "60px",
    "measure": "30em"
  },
  "surface": {
    "radius": 6,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.9,
    "page": 0.8,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "framed-object",
    "product-center"
  ],
  "stories": [
    "object",
    "product"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"mineral\">",
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
    "--font-geist",
    "--font-geist-mono",
    "--font-inter"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 7,09:1 | texto normal |
| --fg | --card | 6,15:1 | texto normal |
| --mut | --bg | 5,21:1 | texto normal |
| --mut | --card | 4,52:1 | texto normal |
| --acc | --bg | 7,09:1 | texto normal |
| --acc | --card | 6,15:1 | texto normal |
| --acc2 | --bg | 4,02:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 3,49:1 | solo texto grande, iconos o bordes de control |

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
