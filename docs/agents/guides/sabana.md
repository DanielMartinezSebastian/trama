# Sabana tranquila

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./sabana.json).

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
  "id": "sabana",
  "source": "premiadas",
  "label": "Sabana tranquila",
  "note": "Crema y verde oliva, una serifa finísima en mayúsculas para titulares enormes y párrafos de serifa grandes; fotos de naturaleza sueltas que flotan a distinta velocidad.",
  "sectors": "Hoteles de naturaleza, safari, turismo rural de lujo, conservación, bodegas",
  "refs": [
    "Tengile MalaMala Collection",
    "Tierra Ancha (/inspiraciones/tierra-ancha)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#f5eee9",
    "fg": "#373f1d",
    "mut": "#6b6a52",
    "acc": "#8b5a2b",
    "acc2": "#c8b48a",
    "card": "#ece3d9",
    "ln": "rgba(55,63,29,0.2)",
    "r": 0,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "accentFont": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3.4rem, 14vw, 14rem)",
    "h1": "clamp(3rem, 7.4vw, 7rem)",
    "h2": "clamp(2rem, 3.1vw, 2.75rem)",
    "body": "0.9375rem",
    "label": "0.6875rem",
    "weight": 300,
    "lineHeight": 0.92,
    "tracking": -0.02,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.12,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "clamp(16px, 3.4vw, 48px)",
    "gutter": "24px",
    "cols": 12,
    "section": "clamp(90px, 12vw, 160px)",
    "header": "70px",
    "measure": "34em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.4,
    "reveal": 1,
    "page": 0.8,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "asym-editorial",
    "split-video"
  ],
  "stories": [
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
  "usage": "<GuideFrame guide=\"sabana\">",
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
    "--font-cormorant-garamond",
    "--font-geist-mono",
    "--font-inter",
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 9,67:1 | texto normal |
| --fg | --card | 8,75:1 | texto normal |
| --mut | --bg | 4,80:1 | texto normal |
| --mut | --card | 4,35:1 | solo texto grande, iconos o bordes de control |
| --acc | --bg | 5,09:1 | texto normal |
| --acc | --card | 4,61:1 | texto normal |
| --acc2 | --bg | 1,77:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,60:1 | decorativo: no usar para texto ni controles |

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
