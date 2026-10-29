# Lúdico

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./ludico.json).

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
  "id": "ludico",
  "source": "premiadas",
  "label": "Lúdico",
  "note": "Pareja de colores vivos, una grotesca redonda y gruesa, pixel en las etiquetas. Para jugar y explorar.",
  "sectors": "Cultura joven, juegos, música, comunidades, marcas con humor",
  "refs": [
    "Ponpon Mania",
    "Bruno Simon",
    "Lacoste Polo Factory",
    "Poolsuite"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#f4d4d4",
    "fg": "#2b1d1d",
    "mut": "#6b4a4a",
    "acc": "#2f5be0",
    "acc2": "#ffcf4a",
    "card": "#fff7f0",
    "ln": "rgba(43,29,29,0.55)",
    "r": 3,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-vt323), ui-monospace, monospace"
  },
  "fonts": {
    "display": "var(--font-bricolage-grotesque), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-silkscreen), ui-monospace, Consolas, monospace",
    "mono": "var(--font-silkscreen), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 13vw, 12rem)",
    "h1": "clamp(2.5rem, 7vw, 7rem)",
    "h2": "clamp(2rem, 3.6vw, 3.25rem)",
    "body": "1.0625rem",
    "label": "0.75rem",
    "weight": 800,
    "lineHeight": 0.92,
    "tracking": -0.03,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "20px",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 10vw, 140px)",
    "header": "64px",
    "measure": "28em"
  },
  "surface": {
    "radius": 16,
    "pill": true,
    "shadow": true
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "product-center"
  ],
  "stories": [
    "world",
    "webfilm"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"ludico\">",
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
| --mut | --bg | 5,63:1 | texto normal |
| --mut | --card | 7,33:1 | texto normal |
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
