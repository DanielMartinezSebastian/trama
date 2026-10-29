# Producto nocturno

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./nocturno.json).

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
  "id": "nocturno",
  "source": "premiadas",
  "label": "Producto nocturno",
  "note": "Negro azulado, grises de la misma tinta, Inter a 510 de peso y la interfaz real como imagen.",
  "sectors": "SaaS, herramientas para desarrolladores, IA",
  "refs": [
    "Linear",
    "Raycast"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#08090a",
    "fg": "#f7f8f8",
    "mut": "#8a8f98",
    "acc": "#7170ff",
    "acc2": "#e2e4e7",
    "card": "rgba(255,255,255,0.035)",
    "ln": "rgba(255,255,255,0.09)",
    "r": 10,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-newsreader), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 8vw, 7rem)",
    "h1": "clamp(2.25rem, 5vw, 4.5rem)",
    "h2": "clamp(2rem, 3.3vw, 3rem)",
    "body": "0.9375rem",
    "label": "0.8125rem",
    "weight": 510,
    "lineHeight": 1,
    "tracking": -0.022,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.6
  },
  "space": {
    "margin": "max(24px, calc((100vw - 1200px) / 2))",
    "gutter": "24px",
    "cols": 12,
    "section": "128px",
    "header": "72px",
    "measure": "32em"
  },
  "surface": {
    "radius": 8,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.16,
    "reveal": 0.7,
    "page": 0.5,
    "stagger": 0.05,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.165, 0.84, 0.44, 1)"
  },
  "heroes": [
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
  "usage": "<GuideFrame guide=\"nocturno\">",
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
    "--font-newsreader"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 18,73:1 | texto normal |
| --mut | --bg | 6,13:1 | texto normal |
| --acc | --bg | 5,18:1 | texto normal |
| --acc2 | --bg | 15,64:1 | texto normal |

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
