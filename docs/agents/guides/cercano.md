# Aprendizaje cercano

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./cercano.json).

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
  "id": "cercano",
  "source": "sectores",
  "label": "Aprendizaje cercano",
  "note": "Rosa vivo, tinta casi negra y retratos protagonistas. Titulares contundentes, controles rectangulares y una conversación como prueba del servicio.",
  "sectors": "Idiomas, formación individual, mentoría, plataformas de profesionales",
  "refs": [
    "Preply (https://preply.com/, inspección 01-11-2026)",
    "Parla (/demo/th-parla), interpretación con Trama"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#121117",
    "mut": "#56535e",
    "acc": "#ff7aac",
    "acc2": "#c5b8f4",
    "card": "#f6f5f3",
    "ln": "#dcd9df",
    "r": 8,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 8vw, 7rem)",
    "h1": "clamp(2.5rem, 4.45vw, 4rem)",
    "h2": "clamp(2rem, 3.35vw, 3rem)",
    "body": "1rem",
    "label": "0.875rem",
    "weight": 700,
    "lineHeight": 1.0625,
    "tracking": -0.005,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(20px, 4.45vw, 64px)",
    "gutter": "24px",
    "cols": 12,
    "section": "clamp(64px, 7vw, 104px)",
    "header": "80px",
    "measure": "32em"
  },
  "surface": {
    "radius": 8,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.22,
    "reveal": 0.5,
    "page": 0.4,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "heroes": [
    "split-video",
    "collage-manifesto"
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
  "usage": "<GuideFrame guide=\"cercano\">",
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
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 18,78:1 | texto normal |
| --fg | --card | 17,24:1 | texto normal |
| --mut | --bg | 7,51:1 | texto normal |
| --mut | --card | 6,90:1 | texto normal |
| --acc | --bg | 2,43:1 | decorativo: no usar para texto ni controles |
| --acc | --card | 2,23:1 | decorativo: no usar para texto ni controles |
| --acc2 | --bg | 1,82:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,67:1 | decorativo: no usar para texto ni controles |

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
