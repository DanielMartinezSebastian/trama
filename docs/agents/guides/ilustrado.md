# Papel ilustrado

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./ilustrado.json).

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
  "id": "ilustrado",
  "source": "repo",
  "label": "Papel ilustrado",
  "note": "Papel cálido, tomate, ultramar y mantequilla como tintas planas. Serifa expresiva, mono en los metadatos y dibujos sueltos por la página.",
  "sectors": "Ilustración, editoriales infantiles, cultura, marcas artesanas",
  "refs": [
    "Inés Bruma (/demo/ines-bruma)"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#f4efdf",
    "fg": "#202221",
    "mut": "#55564f",
    "acc": "#b93228",
    "acc2": "#273f9b",
    "card": "#f2bd48",
    "ln": "rgba(32,34,33,0.3)",
    "r": 4,
    "font": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-instrument-serif), Georgia, serif",
    "accentFont": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-instrument-serif), Georgia, serif",
    "body": "var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-instrument-serif), Georgia, serif",
    "mono": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 14rem)",
    "h1": "clamp(3rem, 8vw, 7.5rem)",
    "h2": "clamp(2rem, 4.4vw, 4rem)",
    "body": "1.0625rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 0.94,
    "tracking": -0.02,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.45
  },
  "space": {
    "margin": "clamp(18px, 3.4vw, 50px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 130px)",
    "header": "60px",
    "measure": "28em"
  },
  "surface": {
    "radius": 4,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.25,
    "reveal": 0.8,
    "page": 0.7,
    "stagger": 0.07,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "asym-editorial"
  ],
  "stories": [
    "index",
    "world"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"ilustrado\">",
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
    "--font-instrument-sans",
    "--font-instrument-serif",
    "--font-jetbrains-mono"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 13,91:1 | texto normal |
| --fg | --card | 9,26:1 | texto normal |
| --mut | --bg | 6,45:1 | texto normal |
| --mut | --card | 4,29:1 | solo texto grande, iconos o bordes de control |
| --acc | --bg | 5,14:1 | texto normal |
| --acc | --card | 3,42:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --bg | 8,04:1 | texto normal |
| --acc2 | --card | 5,35:1 | texto normal |

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
