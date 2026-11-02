# Mando orbital

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./orbital.json).

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
  "id": "orbital",
  "source": "premiadas",
  "label": "Mando orbital",
  "note": "Negro espacial con un globo de datos, titular extendido en mayúsculas y cifras enormes sobre blanco. Naranja y azul solo en la atmósfera.",
  "sectors": "Logística, aeroespacial, energía, telecomunicaciones, infraestructura global",
  "refs": [
    "United Carriers",
    "Ultramar (/inspiraciones/ultramar)"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#000000",
    "fg": "#ffffff",
    "mut": "#b8b8b8",
    "acc": "#ff6e28",
    "acc2": "#265cff",
    "card": "#111111",
    "ln": "rgba(255,255,255,0.25)",
    "r": 0,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-unbounded), \"Arial Black\", sans-serif",
    "accentFont": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-unbounded), \"Arial Black\", sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 12vw, 11rem)",
    "h1": "clamp(2.25rem, 5.6vw, 5rem)",
    "h2": "clamp(1.75rem, 3.6vw, 3.25rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 700,
    "lineHeight": 1.1,
    "tracking": 0,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.04,
    "bodyLineHeight": 1.35
  },
  "space": {
    "margin": "clamp(16px, 2.3vw, 33px)",
    "gutter": "20px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 130px)",
    "header": "64px",
    "measure": "28em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.445, 0.05, 0.55, 0.95)"
  },
  "heroes": [
    "dark-data",
    "split-video"
  ],
  "stories": [
    "object",
    "timeline"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"orbital\">",
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
    "--font-unbounded"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 21,00:1 | texto normal |
| --fg | --card | 18,88:1 | texto normal |
| --mut | --bg | 10,59:1 | texto normal |
| --mut | --card | 9,52:1 | texto normal |
| --acc | --bg | 7,51:1 | texto normal |
| --acc | --card | 6,76:1 | texto normal |
| --acc2 | --bg | 4,06:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 3,65:1 | solo texto grande, iconos o bordes de control |

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
