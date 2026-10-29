# Técnico de producto

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./tecnico.json).

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
  "id": "tecnico",
  "source": "premiadas",
  "label": "Técnico de producto",
  "note": "Gris frío y pizarra, grotesca suiza fina con mono, el visual dentro de un marco, datos y reloj en la cabecera.",
  "sectors": "Hardware, IA, ingeniería, industria, B2B técnico",
  "refs": [
    "Lidar Drone Scanning",
    "Heron AI",
    "CoMinVi",
    "Terminal Industries"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#24363f",
    "mut": "#5b6b73",
    "acc": "#c2410c",
    "acc2": "#24363f",
    "card": "#eef1f3",
    "ln": "rgba(36,54,63,0.16)",
    "r": 4,
    "font": "\"Switzer\", var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "\"Switzer\", var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-martian-mono), var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "\"Switzer\", var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "\"Switzer\", var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-martian-mono), var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-martian-mono), var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 16.7vw, 15rem)",
    "h1": "clamp(2.25rem, 4.4vw, 4.5rem)",
    "h2": "clamp(2rem, 2.2vw, 2.25rem)",
    "body": "0.9375rem",
    "label": "0.75rem",
    "weight": 300,
    "lineHeight": 1,
    "tracking": -0.04,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "24px",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(96px, 10vw, 160px)",
    "header": "64px",
    "measure": "30em"
  },
  "surface": {
    "radius": 4,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.8,
    "page": 0.6,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.165, 0.84, 0.44, 1)"
  },
  "heroes": [
    "framed-object",
    "dark-data"
  ],
  "stories": [
    "object",
    "product",
    "before-after"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"tecnico\">",
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
    "--font-martian-mono"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 12,54:1 | texto normal |
| --fg | --card | 11,06:1 | texto normal |
| --mut | --bg | 5,53:1 | texto normal |
| --mut | --card | 4,88:1 | texto normal |
| --acc | --bg | 5,18:1 | texto normal |
| --acc | --card | 4,56:1 | texto normal |
| --acc2 | --bg | 12,54:1 | texto normal |
| --acc2 | --card | 11,06:1 | texto normal |

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
