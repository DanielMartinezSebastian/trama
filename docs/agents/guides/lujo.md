# Lujo tranquilo

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./lujo.json).

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
  "id": "lujo",
  "source": "premiadas",
  "label": "Lujo tranquilo",
  "note": "Hueso cálido, una tinta oliva, serifa fina en mayúsculas y vídeo a sangre. Calma, tiempo y oficio.",
  "sectors": "Hotel, clínica estética, inmobiliaria de lujo, bodega, joyería",
  "refs": [
    "Tengile Malamala",
    "Odyssée",
    "Son Daven",
    "White Desert"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#f5eee9",
    "fg": "#373f1d",
    "mut": "#5f5d4b",
    "acc": "#5c6e21",
    "acc2": "#373f1d",
    "card": "#ece3dc",
    "ln": "rgba(55,63,29,0.2)",
    "r": 2,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "accentFont": "var(--font-cormorant-garamond), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-cormorant-garamond), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3.5rem, 12vw, 13rem)",
    "h1": "clamp(2.75rem, 8.3vw, 9.5rem)",
    "h2": "clamp(2rem, 4.4vw, 4rem)",
    "body": "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
    "label": "0.8125rem",
    "weight": 300,
    "lineHeight": 0.9,
    "tracking": -0.02,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.03,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "16px",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(96px, 12vw, 200px)",
    "header": "40px",
    "measure": "24em"
  },
  "surface": {
    "radius": 2,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 1.2,
    "page": 1,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "split-video",
    "asym-editorial"
  ],
  "stories": [
    "timeline",
    "service",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"lujo\">",
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
    "--font-inter"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 9,67:1 | texto normal |
| --fg | --card | 8,77:1 | texto normal |
| --mut | --bg | 5,80:1 | texto normal |
| --mut | --card | 5,26:1 | texto normal |
| --acc | --bg | 4,93:1 | texto normal |
| --acc | --card | 4,47:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --bg | 9,67:1 | texto normal |
| --acc2 | --card | 8,77:1 | texto normal |

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
