# Obsidiana

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./obsidiana.json).

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
  "id": "obsidiana",
  "source": "premiadas",
  "label": "Obsidiana",
  "note": "Piedra casi negra y gris plata; grotesca de peso medio en mayúsculas con interlineado 1, píldoras grises y un objeto metálico en 3D. Un solo respiro claro en toda la portada.",
  "sectors": "Banca privada, tarjetas, clubes de socios, aviación privada, lujo discreto",
  "refs": [
    "Moto",
    "Nácar (/inspiraciones/nacar)"
  ],
  "variant": "glass",
  "tokens": {
    "bg": "#080808",
    "fg": "#e1e5e5",
    "mut": "#8d9393",
    "acc": "#e1e5e5",
    "acc2": "#6f7678",
    "card": "#141515",
    "ln": "rgba(225,229,229,0.16)",
    "r": 18,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-instrument-serif), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-instrument-serif), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 12vw, 10rem)",
    "h1": "clamp(2.2rem, 4.4vw, 4rem)",
    "h2": "clamp(1.8rem, 3vw, 2.8rem)",
    "body": "0.875rem",
    "label": "0.6875rem",
    "weight": 500,
    "lineHeight": 1,
    "tracking": -0.01,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.1,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "clamp(16px, 2vw, 30px)",
    "gutter": "12px",
    "cols": 12,
    "section": "clamp(90px, 10vw, 120px)",
    "header": "56px",
    "measure": "30em"
  },
  "surface": {
    "radius": 18,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 1.1,
    "page": 0.9,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "product-center",
    "dark-data"
  ],
  "stories": [
    "object",
    "world"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"obsidiana\">",
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
    "--font-inter",
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,77:1 | texto normal |
| --fg | --card | 14,41:1 | texto normal |
| --mut | --bg | 6,42:1 | texto normal |
| --mut | --card | 5,86:1 | texto normal |
| --acc | --bg | 15,77:1 | texto normal |
| --acc | --card | 14,41:1 | texto normal |
| --acc2 | --bg | 4,33:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 3,95:1 | solo texto grande, iconos o bordes de control |

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
