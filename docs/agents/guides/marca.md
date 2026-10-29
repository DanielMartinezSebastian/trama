# Producto de marca

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./marca.json).

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
  "id": "marca",
  "source": "sectores",
  "label": "Producto de marca",
  "note": "Dos tintas como una serigrafía, grotesca estrecha y gruesa a tamaño de cartel, texto grande en mayúsculas y el producto fijo mientras pasa la página.",
  "sectors": "Salsas, conservas, bebidas, cosmética de marca, producto de autor",
  "refs": [
    "Peppa Sauce"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#141329",
    "fg": "#feeee2",
    "mut": "#8f93b8",
    "acc": "#feeee2",
    "acc2": "#e8612c",
    "card": "#141329",
    "ln": "rgba(254,238,226,0.9)",
    "r": 28,
    "font": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(5rem, 17vw, 16rem)",
    "h1": "clamp(3rem, 13vw, 12rem)",
    "h2": "clamp(1.75rem, 3.5vw, 3.125rem)",
    "body": "clamp(1rem, 0.6rem + 1.4vw, 1.5rem)",
    "label": "0.875rem",
    "weight": 800,
    "lineHeight": 0.85,
    "tracking": -0.03,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.04,
    "bodyLineHeight": 1.2
  },
  "space": {
    "margin": "clamp(16px, 2.5vw, 36px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 140px)",
    "header": "56px",
    "measure": "24em"
  },
  "surface": {
    "radius": 28,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.9,
    "page": 0.8,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "product-center",
    "wordmark"
  ],
  "stories": [
    "product",
    "object"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"marca\">",
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
    "--font-archivo",
    "--font-geist-mono",
    "--font-space-grotesk"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,06:1 | texto normal |
| --fg | --card | 16,06:1 | texto normal |
| --mut | --bg | 6,09:1 | texto normal |
| --mut | --card | 6,09:1 | texto normal |
| --acc | --bg | 16,06:1 | texto normal |
| --acc | --card | 16,06:1 | texto normal |
| --acc2 | --bg | 5,35:1 | texto normal |
| --acc2 | --card | 5,35:1 | texto normal |

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
