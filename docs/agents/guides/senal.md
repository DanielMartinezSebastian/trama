# Señal corporativa

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./senal.json).

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
  "id": "senal",
  "source": "repo",
  "label": "Señal corporativa",
  "note": "Papel mineral con azul eléctrico, lima y coral, grotesca de escala grande y datos monoespaciados. Una empresa de software que no parece de plantilla.",
  "sectors": "Software B2B, consultoras tecnológicas, startups, eventos de empresa",
  "refs": [
    "RIZO (docs/cuaderno/demo-rizo-empresa-tecnologica.md)"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#f2f1eb",
    "fg": "#151922",
    "mut": "#555a66",
    "acc": "#2839dd",
    "acc2": "#b04218",
    "card": "#d7ff39",
    "ln": "rgba(21,25,34,0.22)",
    "r": 6,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 14rem)",
    "h1": "clamp(2.75rem, 7vw, 7rem)",
    "h2": "clamp(2rem, 4vw, 3.75rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 500,
    "lineHeight": 0.96,
    "tracking": -0.04,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.04,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "clamp(18px, 3vw, 44px)",
    "gutter": "14px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 130px)",
    "header": "62px",
    "measure": "30em"
  },
  "surface": {
    "radius": 6,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.2,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "marquee-window",
    "collage-manifesto"
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
  "usage": "<GuideFrame guide=\"senal\">",
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
    "--font-instrument-sans",
    "--font-jetbrains-mono",
    "--font-space-grotesk"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,54:1 | texto normal |
| --fg | --card | 15,29:1 | texto normal |
| --mut | --bg | 6,10:1 | texto normal |
| --mut | --card | 6,00:1 | texto normal |
| --acc | --bg | 6,82:1 | texto normal |
| --acc | --card | 6,71:1 | texto normal |
| --acc2 | --bg | 5,10:1 | texto normal |
| --acc2 | --card | 5,02:1 | texto normal |

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
