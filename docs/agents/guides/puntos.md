# Matriz de puntos

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./puntos.json).

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
  "id": "puntos",
  "source": "repo",
  "label": "Matriz de puntos",
  "note": "Negro puro, titulares de puntos como un panel de leds, texto en mono gris y un rojo de piloto encendido como único color.",
  "sectors": "Hardware, audio, gadgets, relojes, transporte, señalética",
  "refs": [
    "DOTMATRIX (/demo/th-dotmatrix)",
    "Almíbar Barrio (/sitios/almibar-barrio)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#000000",
    "fg": "#e6e6e6",
    "mut": "#8c8c8c",
    "acc": "#ff3b3b",
    "acc2": "#e6e6e6",
    "card": "#0d0d0d",
    "ln": "rgba(230,230,230,0.14)",
    "r": 6,
    "font": "var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace",
    "display": "var(--font-doto), var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace",
    "accentFont": "var(--font-doto), var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-doto), var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace",
    "body": "var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace",
    "accent": "var(--font-doto), var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-ibm-plex-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3.5rem, 14vw, 13rem)",
    "h1": "clamp(2.25rem, 5vw, 4.5rem)",
    "h2": "clamp(1.5rem, 2.6vw, 2.5rem)",
    "body": "0.875rem",
    "label": "0.75rem",
    "weight": 800,
    "lineHeight": 1,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.1,
    "bodyLineHeight": 1.6
  },
  "space": {
    "margin": "max(24px, calc((100vw - 1100px) / 2))",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 140px)",
    "header": "56px",
    "measure": "34em"
  },
  "surface": {
    "radius": 6,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.2,
    "reveal": 0.8,
    "page": 0.5,
    "stagger": 0.04,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.165, 0.84, 0.44, 1)"
  },
  "heroes": [
    "product-center",
    "dark-data"
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
  "usage": "<GuideFrame guide=\"puntos\">",
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
    "--font-doto",
    "--font-ibm-plex-mono"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,83:1 | texto normal |
| --fg | --card | 15,57:1 | texto normal |
| --mut | --bg | 6,25:1 | texto normal |
| --mut | --card | 5,78:1 | texto normal |
| --acc | --bg | 5,94:1 | texto normal |
| --acc | --card | 5,50:1 | texto normal |
| --acc2 | --bg | 16,83:1 | texto normal |
| --acc2 | --card | 15,57:1 | texto normal |

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
