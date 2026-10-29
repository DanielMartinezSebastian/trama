# Estudio boutique

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./boutique.json).

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
  "id": "boutique",
  "source": "sectores",
  "label": "Estudio boutique",
  "note": "Rosa empolvado y marrón tierra, serifa con media frase en cursiva, sans limpia con aire y reserva siempre a mano.",
  "sectors": "Pilates, yoga, estudio privado, fisioterapia, spa urbano",
  "refs": [
    "Core Atelier Pilates"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#f7e7de",
    "fg": "#25140c",
    "mut": "#7c5a48",
    "acc": "#744c32",
    "acc2": "#25140c",
    "card": "#fbf1ec",
    "ln": "rgba(37,20,12,0.22)",
    "r": 0,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "accentFont": "var(--font-cormorant-garamond), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-cormorant-garamond), Georgia, serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-cormorant-garamond), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3.5rem, 12vw, 11rem)",
    "h1": "clamp(2.75rem, 5.6vw, 5rem)",
    "h2": "clamp(2.5rem, 4.9vw, 4.375rem)",
    "body": "1.125rem",
    "label": "0.8125rem",
    "weight": 400,
    "lineHeight": 0.86,
    "tracking": -0.01,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.08,
    "bodyLineHeight": 1.39
  },
  "space": {
    "margin": "clamp(20px, 2.2vw, 32px)",
    "gutter": "20px",
    "cols": 12,
    "section": "clamp(96px, 10vw, 160px)",
    "header": "65px",
    "measure": "25em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 1.1,
    "page": 0.9,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "asym-editorial",
    "split-video"
  ],
  "stories": [
    "service",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"boutique\">",
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
    "--font-cormorant-garamond",
    "--font-geist-mono",
    "--font-inter"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 14,73:1 | texto normal |
| --fg | --card | 15,96:1 | texto normal |
| --mut | --bg | 5,11:1 | texto normal |
| --mut | --card | 5,54:1 | texto normal |
| --acc | --bg | 6,18:1 | texto normal |
| --acc | --card | 6,69:1 | texto normal |
| --acc2 | --bg | 14,73:1 | texto normal |
| --acc2 | --card | 15,96:1 | texto normal |

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
