# Pop de manchas

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./manchas.json).

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
  "id": "manchas",
  "source": "premiadas",
  "label": "Pop de manchas",
  "note": "Fondo de color pleno con manchas orgánicas, ultranegra enorme, tarjetas giradas y una manuscrita que comenta. Alegre y a todo volumen.",
  "sectors": "Clubes de suscripción, libros, cajas regalo, marcas jóvenes, comunidades",
  "refs": [
    "Aardvark Book Club",
    "Polilla (/inspiraciones/polilla)"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#ffd24a",
    "fg": "#000000",
    "mut": "#3d2f00",
    "acc": "#c4007a",
    "acc2": "#3b308f",
    "card": "#fffbe0",
    "ln": "#000000",
    "r": 18,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-bowlby-one), \"Arial Black\", sans-serif",
    "accentFont": "var(--font-caveat), cursive",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-bowlby-one), \"Arial Black\", sans-serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-caveat), cursive",
    "mono": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 14rem)",
    "h1": "clamp(3rem, 8vw, 7.5rem)",
    "h2": "clamp(2.25rem, 5vw, 4.5rem)",
    "body": "1.0625rem",
    "label": "0.8125rem",
    "weight": 400,
    "lineHeight": 0.92,
    "tracking": -0.03,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "15px",
    "gutter": "12px",
    "cols": 12,
    "section": "clamp(70px, 8vw, 120px)",
    "header": "70px",
    "measure": "24em"
  },
  "surface": {
    "radius": 24,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.2,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "easeReveal": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "product-center"
  ],
  "stories": [
    "product",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"manchas\">",
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
    "--font-bowlby-one",
    "--font-caveat",
    "--font-instrument-sans"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 14,57:1 | texto normal |
| --fg | --card | 20,13:1 | texto normal |
| --mut | --bg | 9,08:1 | texto normal |
| --mut | --card | 12,54:1 | texto normal |
| --acc | --bg | 4,02:1 | solo texto grande, iconos o bordes de control |
| --acc | --card | 5,55:1 | texto normal |
| --acc2 | --bg | 7,27:1 | texto normal |
| --acc2 | --card | 10,04:1 | texto normal |

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
