# Cinta de luz

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./cinta.json).

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
  "id": "cinta",
  "source": "premiadas",
  "label": "Cinta de luz",
  "note": "Negro violáceo con una cinta de luz magenta y gris claro con azul marino para la parte técnica; grotesca fina grande, mono en mayúsculas para etiquetas y tarjetas blancas con datos vivos.",
  "sectors": "Software, infraestructura, IA, API, herramientas para desarrolladores",
  "refs": [
    "Cerebrium",
    "Nimbo (/inspiraciones/nimbo)"
  ],
  "variant": "glass",
  "tokens": {
    "bg": "#07030c",
    "fg": "#f2eef8",
    "mut": "#a79fb6",
    "acc": "#ff3d8b",
    "acc2": "#5b6fd6",
    "card": "#1a1024",
    "ln": "rgba(242,238,248,0.14)",
    "r": 14,
    "font": "var(--font-mona-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-mona-sans), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-mona-sans), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-mona-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 12vw, 10rem)",
    "h1": "clamp(2.8rem, 6vw, 5.4rem)",
    "h2": "clamp(2rem, 3.6vw, 3.2rem)",
    "body": "0.9375rem",
    "label": "0.6875rem",
    "weight": 300,
    "lineHeight": 1,
    "tracking": -0.025,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.06,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(16px, 2.2vw, 32px)",
    "gutter": "14px",
    "cols": 12,
    "section": "clamp(90px, 10vw, 110px)",
    "header": "58px",
    "measure": "32em"
  },
  "surface": {
    "radius": 14,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.7,
    "page": 0.5,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "heroes": [
    "dark-data",
    "split-video"
  ],
  "stories": [
    "product",
    "index"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"cinta\">",
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
    "--font-mona-sans"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 17,87:1 | texto normal |
| --fg | --card | 16,06:1 | texto normal |
| --mut | --bg | 8,06:1 | texto normal |
| --mut | --card | 7,24:1 | texto normal |
| --acc | --bg | 6,12:1 | texto normal |
| --acc | --card | 5,50:1 | texto normal |
| --acc2 | --bg | 4,56:1 | texto normal |
| --acc2 | --card | 4,10:1 | solo texto grande, iconos o bordes de control |

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
