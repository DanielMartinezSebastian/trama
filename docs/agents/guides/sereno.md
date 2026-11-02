# Ingeniería serena

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./sereno.json).

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
  "id": "sereno",
  "source": "premiadas",
  "label": "Ingeniería serena",
  "note": "La web cabe en una tarjeta con una columna de bloques de arena a bosque. Serifa fina y clara sobre imagen a sangre, mono en los botones. Tecnología que no grita.",
  "sectors": "Robótica, energía, clima, ciencia aplicada, defensa civil, hardware con propósito",
  "refs": [
    "Seasats",
    "Marejada (/inspiraciones/marejada)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#fffdfd",
    "fg": "#232323",
    "mut": "#5e5e58",
    "acc": "#2c3a24",
    "acc2": "#6d7763",
    "card": "#efeeea",
    "ln": "rgba(35,35,35,0.16)",
    "r": 8,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-newsreader), Georgia, serif",
    "accentFont": "var(--font-newsreader), Georgia, serif",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-newsreader), Georgia, serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-newsreader), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 12.5vw, 11rem)",
    "h1": "clamp(3rem, 7.8vw, 7.75rem)",
    "h2": "clamp(2.5rem, 5.6vw, 5rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 300,
    "lineHeight": 1,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.04,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(16px, 2.2vw, 32px)",
    "gutter": "10px",
    "cols": 12,
    "section": "clamp(90px, 9vw, 130px)",
    "header": "24px",
    "measure": "32em"
  },
  "surface": {
    "radius": 8,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.4,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.215, 0.61, 0.355, 1)",
    "easeReveal": "cubic-bezier(0.215, 0.61, 0.355, 1)"
  },
  "heroes": [
    "split-video",
    "framed-object"
  ],
  "stories": [
    "object",
    "product"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"sereno\">",
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
    "--font-instrument-sans",
    "--font-newsreader"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,51:1 | texto normal |
| --fg | --card | 13,54:1 | texto normal |
| --mut | --bg | 6,44:1 | texto normal |
| --mut | --card | 5,62:1 | texto normal |
| --acc | --bg | 11,92:1 | texto normal |
| --acc | --card | 10,41:1 | texto normal |
| --acc2 | --bg | 4,64:1 | texto normal |
| --acc2 | --card | 4,05:1 | solo texto grande, iconos o bordes de control |

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
