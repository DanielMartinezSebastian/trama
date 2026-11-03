# Foro en blanco y negro

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./foro.json).

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
  "id": "foro",
  "source": "premiadas",
  "label": "Foro en blanco y negro",
  "note": "Blanco y negro, fotos de escenario a sangre bajo un titular centrado en serifa de mayúsculas, un logotipo de formas ultranegras y fechas en un recuadro de filete fino. Píldoras con filete.",
  "sectors": "Festivales, congresos, ferias, escuelas de diseño, ciclos culturales",
  "refs": [
    "OFFF Forum",
    "PLENO (/inspiraciones/pleno)"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#000000",
    "mut": "#5e5e5e",
    "acc": "#000000",
    "acc2": "#ff3b1f",
    "card": "#f2f2f2",
    "ln": "rgba(0,0,0,0.85)",
    "r": 0,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-instrument-serif), Georgia, serif",
    "accentFont": "var(--font-instrument-serif), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-instrument-serif), Georgia, serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-instrument-serif), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 17vw, 16rem)",
    "h1": "clamp(2rem, 3.4vw, 3.2rem)",
    "h2": "clamp(2rem, 3.4vw, 3rem)",
    "body": "0.875rem",
    "label": "0.625rem",
    "weight": 400,
    "lineHeight": 0.95,
    "tracking": -0.02,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.06,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(12px, 1.4vw, 20px)",
    "gutter": "10px",
    "cols": 12,
    "section": "clamp(60px, 8vw, 80px)",
    "header": "80px",
    "measure": "34em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.8,
    "page": 0.6,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "heroes": [
    "wordmark",
    "split-video"
  ],
  "stories": [
    "index",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"foro\">",
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
    "--font-inter"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 21,00:1 | texto normal |
| --fg | --card | 18,76:1 | texto normal |
| --mut | --bg | 6,48:1 | texto normal |
| --mut | --card | 5,79:1 | texto normal |
| --acc | --bg | 21,00:1 | texto normal |
| --acc | --card | 18,76:1 | texto normal |
| --acc2 | --bg | 3,56:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 3,18:1 | solo texto grande, iconos o bordes de control |

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
