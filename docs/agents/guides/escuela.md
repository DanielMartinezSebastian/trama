# Escuela amarilla

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./escuela.json).

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
  "id": "escuela",
  "source": "sectores",
  "label": "Escuela amarilla",
  "note": "Amarillo saturado y negro, una grotesca en mayúsculas siempre apretada, recuadros con borde y sombra dura; fotos documentales de las clases.",
  "sectors": "Academia, escuela de diseño o negocio, formación profesional, bootcamp",
  "refs": [
    "Future London Academy",
    "Honhar"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#1a1a1a",
    "mut": "#6f6f6f",
    "acc": "#ffe32b",
    "acc2": "#1a1a1a",
    "card": "#ffe32b",
    "ln": "#1a1a1a",
    "r": 8,
    "font": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 14rem)",
    "h1": "clamp(2.5rem, 6.7vw, 6rem)",
    "h2": "clamp(2rem, 4.6vw, 4.125rem)",
    "body": "1.125rem",
    "label": "0.75rem",
    "weight": 500,
    "lineHeight": 0.97,
    "tracking": -0.05,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.02,
    "bodyLineHeight": 1.34
  },
  "space": {
    "margin": "clamp(16px, 2.5vw, 36px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(96px, 10vw, 140px)",
    "header": "96px",
    "measure": "28em"
  },
  "surface": {
    "radius": 8,
    "pill": false,
    "shadow": true
  },
  "motion": {
    "fast": 0.15,
    "reveal": 0.8,
    "page": 0.7,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "wordmark",
    "collage-manifesto"
  ],
  "stories": [
    "index",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"escuela\">",
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
    "--font-space-grotesk"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 17,40:1 | texto normal |
| --fg | --card | 13,49:1 | texto normal |
| --mut | --bg | 5,02:1 | texto normal |
| --mut | --card | 3,89:1 | solo texto grande, iconos o bordes de control |
| --acc | --bg | 1,29:1 | decorativo: no usar para texto ni controles |
| --acc | --card | 1,00:1 | decorativo: no usar para texto ni controles |
| --acc2 | --bg | 17,40:1 | texto normal |
| --acc2 | --card | 13,49:1 | texto normal |

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
