# Ámbar nocturno

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./ambar.json).

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
  "id": "ambar",
  "source": "repo",
  "label": "Ámbar nocturno",
  "note": "Negro cálido y un ámbar que parece luz. Serifa grande y lenta, muy pocas palabras y un objeto que se toca. Una experiencia, no un folleto.",
  "sectors": "Perfumes, bebidas, cosmética, hospitalidad nocturna, experiencias de marca",
  "refs": [
    "SONDA · Ritual (/producto/ritual)",
    "The Magic Bottle"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#11100f",
    "fg": "#f4ead9",
    "mut": "#b3a48e",
    "acc": "#ffac65",
    "acc2": "#f4ead9",
    "card": "#1d1a17",
    "ln": "rgba(244,234,217,0.16)",
    "r": 2,
    "font": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-fraunces), Georgia, serif",
    "accentFont": "var(--font-fraunces), Georgia, serif"
  },
  "fonts": {
    "display": "var(--font-fraunces), Georgia, serif",
    "body": "var(--font-geist), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-fraunces), Georgia, serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 14rem)",
    "h1": "clamp(2.75rem, 7vw, 7rem)",
    "h2": "clamp(2rem, 4vw, 3.5rem)",
    "body": "1.0625rem",
    "label": "0.75rem",
    "weight": 300,
    "lineHeight": 0.98,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.14,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(20px, 4vw, 60px)",
    "gutter": "20px",
    "cols": 12,
    "section": "clamp(110px, 13vw, 200px)",
    "header": "72px",
    "measure": "26em"
  },
  "surface": {
    "radius": 2,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.5,
    "reveal": 1.4,
    "page": 1.1,
    "stagger": 0.12,
    "ease": "cubic-bezier(0.45, 0, 0.55, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "product-center",
    "split-video"
  ],
  "stories": [
    "object",
    "webfilm"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"ambar\">",
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
    "--font-fraunces",
    "--font-geist",
    "--font-geist-mono",
    "--font-inter"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,95:1 | texto normal |
| --fg | --card | 14,53:1 | texto normal |
| --mut | --bg | 7,80:1 | texto normal |
| --mut | --card | 7,11:1 | texto normal |
| --acc | --bg | 10,26:1 | texto normal |
| --acc | --card | 9,35:1 | texto normal |
| --acc2 | --bg | 15,95:1 | texto normal |
| --acc2 | --card | 14,53:1 | texto normal |

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
