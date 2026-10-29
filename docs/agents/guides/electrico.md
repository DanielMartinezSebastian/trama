# Acento eléctrico

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./electrico.json).

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
  "id": "electrico",
  "source": "premiadas",
  "label": "Acento eléctrico",
  "note": "Casi negro y un acento ácido, condensada gruesa en mayúsculas y grotesca variable para leer. Velocidad.",
  "sectors": "Deporte, motor, música, eventos, marcas personales",
  "refs": [
    "Lando Norris",
    "Nick Ho",
    "Neutomni"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#282c20",
    "fg": "#e8eadf",
    "mut": "#a3a893",
    "acc": "#d2ff00",
    "acc2": "#b3c43c",
    "card": "rgba(232,234,223,0.06)",
    "ln": "rgba(232,234,223,0.16)",
    "r": 6,
    "font": "var(--font-mona-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-anton), Impact, \"Arial Narrow\", sans-serif",
    "accentFont": "var(--font-instrument-serif), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-anton), Impact, \"Arial Narrow\", sans-serif",
    "body": "var(--font-mona-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-instrument-serif), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4.5rem, 16vw, 16rem)",
    "h1": "clamp(3rem, 7.6vw, 8rem)",
    "h2": "clamp(2rem, 4.4vw, 4rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 0.85,
    "tracking": -0.01,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.04,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "16px",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(96px, 12vw, 180px)",
    "header": "56px",
    "measure": "26em"
  },
  "surface": {
    "radius": 10,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.5,
    "page": 0.7,
    "stagger": 0.04,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "dark-data",
    "wordmark"
  ],
  "stories": [
    "object",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"electrico\">",
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
    "--font-geist-mono",
    "--font-instrument-serif",
    "--font-mona-sans"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 11,73:1 | texto normal |
| --mut | --bg | 5,83:1 | texto normal |
| --acc | --bg | 12,26:1 | texto normal |
| --acc2 | --bg | 7,39:1 | texto normal |

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
