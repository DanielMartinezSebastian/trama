# Estudio en tierras

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./terracota.json).

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
  "id": "terracota",
  "source": "premiadas",
  "label": "Estudio en tierras",
  "note": "Blanco y negro con una grotesca neutra sin negritas y cinco colores tierra (taupe, óxido, azul pálido, salvia, salmón), uno por línea de trabajo, en paneles que se ensanchan.",
  "sectors": "Arquitectura, ingeniería, urbanismo, constructoras, interiorismo de contrato",
  "refs": [
    "LPAS",
    "Solera Arquitectura (/inspiraciones/solera)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#000000",
    "mut": "#6b6b6b",
    "acc": "#a65232",
    "acc2": "#c9d6e3",
    "card": "#f2f2f0",
    "ln": "rgba(0,0,0,0.14)",
    "r": 4,
    "font": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3.4rem, 9vw, 9rem)",
    "h1": "clamp(2.4rem, 4.6vw, 4.4rem)",
    "h2": "clamp(1.6rem, 2.4vw, 2.2rem)",
    "body": "0.9375rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 1,
    "tracking": -0.03,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(16px, 2.2vw, 32px)",
    "gutter": "12px",
    "cols": 12,
    "section": "clamp(80px, 10vw, 120px)",
    "header": "56px",
    "measure": "34em"
  },
  "surface": {
    "radius": 4,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "heroes": [
    "split-video",
    "marquee-window"
  ],
  "stories": [
    "index",
    "object"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"terracota\">",
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
| --fg | --bg | 21,00:1 | texto normal |
| --fg | --card | 18,73:1 | texto normal |
| --mut | --bg | 5,33:1 | texto normal |
| --mut | --card | 4,75:1 | texto normal |
| --acc | --bg | 5,42:1 | texto normal |
| --acc | --card | 4,84:1 | texto normal |
| --acc2 | --bg | 1,48:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,32:1 | decorativo: no usar para texto ni controles |

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
