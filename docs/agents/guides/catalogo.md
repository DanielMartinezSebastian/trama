# Catálogo de color

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./catalogo.json).

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
  "id": "catalogo",
  "source": "premiadas",
  "label": "Catálogo de color",
  "note": "Beige y arena con objetos de colores vivos en baldosas escalonadas, grotesca a 600 apretada y botones en píldora. La tienda es la portada.",
  "sectors": "Mobiliario, diseño de producto, tiendas de objetos, moda sostenible",
  "refs": [
    "Noho",
    "Zanco (/inspiraciones/zanco)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#f1eee9",
    "fg": "#3c3c3c",
    "mut": "#6e6a63",
    "acc": "#b52a12",
    "acc2": "#cdc0b0",
    "card": "#e7e2da",
    "ln": "rgba(60,60,60,0.2)",
    "r": 0,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 12vw, 10rem)",
    "h1": "clamp(2.5rem, 4.2vw, 3.75rem)",
    "h2": "clamp(2.25rem, 4.2vw, 3.75rem)",
    "body": "0.9375rem",
    "label": "0.8125rem",
    "weight": 600,
    "lineHeight": 1,
    "tracking": -0.04,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "clamp(16px, 2.1vw, 30px)",
    "gutter": "10px",
    "cols": 12,
    "section": "clamp(80px, 8vw, 120px)",
    "header": "56px",
    "measure": "28em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.8,
    "page": 0.6,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "product-center"
  ],
  "stories": [
    "product",
    "index"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"catalogo\">",
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
    "--font-instrument-sans"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 9,53:1 | texto normal |
| --fg | --card | 8,56:1 | texto normal |
| --mut | --bg | 4,65:1 | texto normal |
| --mut | --card | 4,17:1 | solo texto grande, iconos o bordes de control |
| --acc | --bg | 5,49:1 | texto normal |
| --acc | --card | 4,93:1 | texto normal |
| --acc2 | --bg | 1,54:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,38:1 | decorativo: no usar para texto ni controles |

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
