# Filmoteca

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./filmoteca.json).

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
  "id": "filmoteca",
  "source": "premiadas",
  "label": "Filmoteca",
  "note": "Gris plata y negro puro, didona muy apretada en mayúsculas, fichas técnicas a filete y críticas con estrellas. El catálogo es el protagonista.",
  "sectors": "Cine, distribuidoras, editoriales, galerías, sellos de música",
  "refs": [
    "A24 de Ravi Klaassens",
    "Sesión Doble (/inspiraciones/sesion-doble)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#f2f2f2",
    "fg": "#000000",
    "mut": "#595959",
    "acc": "#000000",
    "acc2": "#000000",
    "card": "#e6e6e6",
    "ln": "rgba(0,0,0,0.9)",
    "r": 0,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-bodoni-moda), Georgia, serif",
    "accentFont": "var(--font-bodoni-moda), Georgia, serif",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-bodoni-moda), Georgia, serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-bodoni-moda), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 14vw, 13rem)",
    "h1": "clamp(2.5rem, 6.4vw, 6rem)",
    "h2": "clamp(1.75rem, 3vw, 2.75rem)",
    "body": "0.875rem",
    "label": "0.625rem",
    "weight": 400,
    "lineHeight": 0.96,
    "tracking": -0.04,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.14,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "12px",
    "gutter": "8px",
    "cols": 12,
    "section": "clamp(64px, 7vw, 110px)",
    "header": "44px",
    "measure": "30em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.2,
    "reveal": 0.8,
    "page": 0.7,
    "stagger": 0.04,
    "ease": "cubic-bezier(0.87, 0, 0.13, 1)",
    "easeReveal": "cubic-bezier(0.32, 0.72, 0, 1)"
  },
  "heroes": [
    "framed-object",
    "wordmark"
  ],
  "stories": [
    "index",
    "object"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"filmoteca\">",
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
    "--font-bodoni-moda",
    "--font-geist-mono",
    "--font-inter",
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 18,76:1 | texto normal |
| --fg | --card | 16,83:1 | texto normal |
| --mut | --bg | 6,26:1 | texto normal |
| --mut | --card | 5,61:1 | texto normal |
| --acc | --bg | 18,76:1 | texto normal |
| --acc | --card | 16,83:1 | texto normal |
| --acc2 | --bg | 18,76:1 | texto normal |
| --acc2 | --card | 16,83:1 | texto normal |

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
