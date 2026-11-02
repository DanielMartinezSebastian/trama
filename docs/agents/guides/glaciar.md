# Archivo glaciar

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./glaciar.json).

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
  "id": "glaciar",
  "source": "repo",
  "label": "Archivo glaciar",
  "note": "Azul glaciar muy oscuro y hielo claro, grotesca contenida con serifa en cursiva, mono técnico y un naranja de expedición. Ciencia contada como aventura.",
  "sectors": "Ciencia, exploración, archivos culturales, documentales, museos",
  "refs": [
    "POLARIS (/demo/polaris-archivo)",
    "Igloo Inc."
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#101821",
    "fg": "#e9edf0",
    "mut": "#a3b1bd",
    "acc": "#e75f3d",
    "acc2": "#83cbd9",
    "card": "#1a2531",
    "ln": "rgba(233,237,240,0.16)",
    "r": 2,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-newsreader), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-newsreader), Georgia, serif",
    "mono": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 14vw, 13rem)",
    "h1": "clamp(2.5rem, 6.4vw, 6rem)",
    "h2": "clamp(2rem, 3.6vw, 3.25rem)",
    "body": "1rem",
    "label": "0.6875rem",
    "weight": 400,
    "lineHeight": 0.98,
    "tracking": -0.03,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.1,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(18px, 3.2vw, 48px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(96px, 11vw, 170px)",
    "header": "60px",
    "measure": "30em"
  },
  "surface": {
    "radius": 2,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 1,
    "page": 0.9,
    "stagger": 0.07,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "dark-data",
    "framed-object"
  ],
  "stories": [
    "timeline",
    "webfilm"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"glaciar\">",
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
    "--font-inter",
    "--font-jetbrains-mono",
    "--font-newsreader"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,18:1 | texto normal |
| --fg | --card | 13,18:1 | texto normal |
| --mut | --bg | 8,16:1 | texto normal |
| --mut | --card | 7,08:1 | texto normal |
| --acc | --bg | 5,19:1 | texto normal |
| --acc | --card | 4,51:1 | texto normal |
| --acc2 | --bg | 9,80:1 | texto normal |
| --acc2 | --card | 8,51:1 | texto normal |

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
