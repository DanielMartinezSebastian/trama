# Cartel de varietés

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./varietes.json).

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
  "id": "varietes",
  "source": "repo",
  "label": "Cartel de varietés",
  "note": "Crema, rojo telón y oro viejo, letra de cartel gruesa con serifa y etiquetas estrechas muy espaciadas. Noche de función en un pueblo con historia.",
  "sectors": "Restaurantes con espectáculo, teatros, tablaos, circos, salas de fiestas",
  "refs": [
    "La Tramoya (/sitios/la-tramoya)",
    "Délice",
    "Da Maria"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#f3e7d0",
    "fg": "#1c1420",
    "mut": "#5a4d4d",
    "acc": "#b3121f",
    "acc2": "#8a6417",
    "card": "#ecdcbd",
    "ln": "rgba(28,20,32,0.24)",
    "r": 2,
    "font": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-ultra), Georgia, serif",
    "accentFont": "var(--font-fraunces), Georgia, serif",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-ultra), Georgia, serif",
    "body": "var(--font-manrope), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-fraunces), Georgia, serif",
    "mono": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif"
  },
  "type": {
    "brand": "clamp(3.5rem, 13vw, 12rem)",
    "h1": "clamp(2.5rem, 7vw, 6.5rem)",
    "h2": "clamp(1.75rem, 4vw, 3.5rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 0.96,
    "tracking": -0.01,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.22,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(18px, 2.4vw, 34px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 130px)",
    "header": "62px",
    "measure": "28em"
  },
  "surface": {
    "radius": 2,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.9,
    "page": 0.7,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "wordmark",
    "split-video"
  ],
  "stories": [
    "timeline",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"varietes\">",
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
    "--font-anton",
    "--font-antonio",
    "--font-fraunces",
    "--font-manrope",
    "--font-ultra"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 14,66:1 | texto normal |
| --fg | --card | 13,28:1 | texto normal |
| --mut | --bg | 6,59:1 | texto normal |
| --mut | --card | 5,97:1 | texto normal |
| --acc | --bg | 5,67:1 | texto normal |
| --acc | --card | 5,14:1 | texto normal |
| --acc2 | --bg | 4,38:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 3,97:1 | solo texto grande, iconos o bordes de control |

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
