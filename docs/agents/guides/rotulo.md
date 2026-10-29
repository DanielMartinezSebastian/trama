# Rótulo cinético

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./rotulo.json).

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
  "id": "rotulo",
  "source": "premiadas",
  "label": "Rótulo cinético",
  "note": "Blanco y un azul marino, una frase gigante que se mueve y una foto que hace de ventana; chips en letra extendida.",
  "sectors": "Inmobiliaria, inversión, turismo, agencias de servicios",
  "refs": [
    "Realevate",
    "Pensatori Irrazionali"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#ffffff",
    "fg": "#1f2b5e",
    "mut": "#4f5880",
    "acc": "#1f2b5e",
    "acc2": "#1f2b5e",
    "card": "#f1f2f7",
    "ln": "rgba(31,43,94,0.2)",
    "r": 0,
    "font": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
  },
  "type": {
    "brand": "clamp(5rem, 15.2vw, 15rem)",
    "h1": "clamp(2.5rem, 5.2vw, 5.5rem)",
    "h2": "clamp(2rem, 3vw, 3rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 500,
    "lineHeight": 1,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.12,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(16px, 4.2vw, 60px)",
    "gutter": "20px",
    "cols": 12,
    "section": "clamp(96px, 10vw, 160px)",
    "header": "72px",
    "measure": "30em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 0.8,
    "page": 0.75,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "marquee-window",
    "collage-manifesto"
  ],
  "stories": [
    "index",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"rotulo\">",
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
    "--font-archivo",
    "--font-onest"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 13,41:1 | texto normal |
| --fg | --card | 12,00:1 | texto normal |
| --mut | --bg | 6,91:1 | texto normal |
| --mut | --card | 6,18:1 | texto normal |
| --acc | --bg | 13,41:1 | texto normal |
| --acc | --card | 12,00:1 | texto normal |
| --acc2 | --bg | 13,41:1 | texto normal |
| --acc2 | --card | 12,00:1 | texto normal |

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
