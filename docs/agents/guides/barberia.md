# Barbería de carácter

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./barberia.json).

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
  "id": "barberia",
  "source": "sectores",
  "label": "Barbería de carácter",
  "note": "Hueso y negro con un acento saturado, condensada o serifa enorme con la cursiva para el énfasis, datos en mayúsculas y botones en óvalo.",
  "sectors": "Barbería, sastrería, tatuaje, coctelería, tienda de oficio",
  "refs": [
    "Rendezvous",
    "Don Barber & Groom",
    "Marco Ambrosi"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#eceae0",
    "fg": "#111111",
    "mut": "#5c5c5c",
    "acc": "#ff622b",
    "acc2": "#7e929c",
    "card": "#f6f4ee",
    "ln": "rgba(17,17,17,0.18)",
    "r": 0,
    "font": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif",
    "accentFont": "var(--font-playfair-display), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-antonio), var(--font-anton), \"Arial Narrow\", sans-serif",
    "body": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-playfair-display), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4.5rem, 23.6vw, 21rem)",
    "h1": "clamp(3rem, 8.6vw, 8rem)",
    "h2": "clamp(2.25rem, 6.6vw, 6rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 0.9,
    "tracking": -0.01,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.02,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(16px, 3vw, 44px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 140px)",
    "header": "64px",
    "measure": "26em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.9,
    "page": 0.8,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "split-video",
    "wordmark"
  ],
  "stories": [
    "service",
    "before-after"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"barberia\">",
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
    "--font-archivo",
    "--font-geist-mono",
    "--font-playfair-display"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,66:1 | texto normal |
| --fg | --card | 17,17:1 | texto normal |
| --mut | --bg | 5,54:1 | texto normal |
| --mut | --card | 6,08:1 | texto normal |
| --acc | --bg | 2,48:1 | decorativo: no usar para texto ni controles |
| --acc | --card | 2,71:1 | decorativo: no usar para texto ni controles |
| --acc2 | --bg | 2,69:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 2,95:1 | decorativo: no usar para texto ni controles |

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
