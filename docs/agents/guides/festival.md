# Festival pastel

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./festival.json).

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
  "id": "festival",
  "source": "repo",
  "label": "Festival pastel",
  "note": "Rosa pastel, azul real y amarillo, titular gigante de grotesca redonda y etiquetas en píxel. Una fiesta que se organiza en serio.",
  "sectors": "Festivales, cultura de barrio, ferias, escuelas de música, eventos",
  "refs": [
    "UMBRAL (docs/cuaderno/demo-umbral-skills.md)"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#f4d4d4",
    "fg": "#2b1d1d",
    "mut": "#5e4545",
    "acc": "#2f5be0",
    "acc2": "#ffcf4a",
    "card": "#fff7f0",
    "ln": "rgba(43,29,29,0.3)",
    "r": 14,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-silkscreen), ui-monospace, Consolas, monospace",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-silkscreen), ui-monospace, Consolas, monospace",
    "mono": "var(--font-silkscreen), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4.5rem, 16vw, 15rem)",
    "h1": "clamp(3rem, 8vw, 7.5rem)",
    "h2": "clamp(2rem, 4.6vw, 4rem)",
    "body": "1.0625rem",
    "label": "0.75rem",
    "weight": 500,
    "lineHeight": 0.9,
    "tracking": -0.03,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "20px",
    "gutter": "14px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 130px)",
    "header": "62px",
    "measure": "26em"
  },
  "surface": {
    "radius": 14,
    "pill": true,
    "shadow": true
  },
  "motion": {
    "fast": 0.2,
    "reveal": 0.6,
    "page": 0.5,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  "heroes": [
    "wordmark",
    "collage-manifesto"
  ],
  "stories": [
    "timeline",
    "world"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"festival\">",
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
    "--font-bricolage-grotesque",
    "--font-instrument-sans",
    "--font-silkscreen"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 11,74:1 | texto normal |
| --fg | --card | 15,29:1 | texto normal |
| --mut | --bg | 6,30:1 | texto normal |
| --mut | --card | 8,21:1 | texto normal |
| --acc | --bg | 4,12:1 | solo texto grande, iconos o bordes de control |
| --acc | --card | 5,36:1 | texto normal |
| --acc2 | --bg | 1,07:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,39:1 | decorativo: no usar para texto ni controles |

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
