# Trattoria de barrio

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./trattoria.json).

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
  "id": "trattoria",
  "source": "premiadas",
  "label": "Trattoria de barrio",
  "note": "Rojo pleno de fondo con texto crema, y bloques de color que se suceden (turquesa, verde botella, granate); serifa blanda con cursiva para los subtítulos y una sans redonda en mayúsculas para botones.",
  "sectors": "Restaurantes, pizzerías, bares, cafeterías, panaderías, mercados",
  "refs": [
    "Délice",
    "Bocado (/inspiraciones/bocado)"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#b8202a",
    "fg": "#f8efdc",
    "mut": "#f3d2c0",
    "acc": "#f8efdc",
    "acc2": "#7cc3bd",
    "card": "#9e1b24",
    "ln": "rgba(248,239,220,0.3)",
    "r": 0,
    "font": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-fraunces), Georgia, serif",
    "accentFont": "var(--font-fraunces), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-fraunces), Georgia, serif",
    "body": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-fraunces), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(5rem, 18vw, 18rem)",
    "h1": "clamp(3rem, 7.4vw, 7.4rem)",
    "h2": "clamp(2.4rem, 5vw, 4.4rem)",
    "body": "0.9375rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 0.92,
    "tracking": -0.03,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.06,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(16px, 4vw, 56px)",
    "gutter": "24px",
    "cols": 12,
    "section": "clamp(70px, 9vw, 120px)",
    "header": "84px",
    "measure": "30em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.6,
    "page": 0.5,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "easeReveal": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "split-video"
  ],
  "stories": [
    "service",
    "product"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"trattoria\">",
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
    "--font-fraunces",
    "--font-geist-mono",
    "--font-manrope"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 5,60:1 | texto normal |
| --fg | --card | 6,97:1 | texto normal |
| --mut | --bg | 4,51:1 | texto normal |
| --mut | --card | 5,61:1 | texto normal |
| --acc | --bg | 5,60:1 | texto normal |
| --acc | --card | 6,97:1 | texto normal |
| --acc2 | --bg | 3,17:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 3,94:1 | solo texto grande, iconos o bordes de control |

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
