# Estudio en papel

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./papel.json).

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
  "id": "papel",
  "source": "repo",
  "label": "Estudio en papel",
  "note": "Papel crudo y tinta casi negra, grotesca ajustada a medio peso, filetes finos en vez de cajas y un solo color de óxido para lo importante.",
  "sectors": "Estudios de arquitectura y diseño, consultoras, cerámica, oficios, portfolios",
  "refs": [
    "Alzado (/sitios/alzado)",
    "Estudio (/sitios/estudio)",
    "Barro (/sitios/barro)",
    "Plano (/sitios/plano)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#f2efe9",
    "fg": "#121110",
    "mut": "#625d54",
    "acc": "#b9501d",
    "acc2": "#121110",
    "card": "#e8e4dc",
    "ln": "rgba(18,17,16,0.14)",
    "r": 6,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-geist-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 15vw, 14rem)",
    "h1": "clamp(2.25rem, 5vw, 4.75rem)",
    "h2": "clamp(2rem, 3.2vw, 3rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 500,
    "lineHeight": 1.02,
    "tracking": -0.035,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.06,
    "bodyLineHeight": 1.55
  },
  "space": {
    "margin": "clamp(20px, 2.8vw, 40px)",
    "gutter": "20px",
    "cols": 12,
    "section": "clamp(96px, 11vw, 168px)",
    "header": "64px",
    "measure": "30em"
  },
  "surface": {
    "radius": 6,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.3,
    "reveal": 1,
    "page": 0.7,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "heroes": [
    "asym-editorial",
    "framed-object"
  ],
  "stories": [
    "chapters",
    "index"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"papel\">",
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
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,44:1 | texto normal |
| --fg | --card | 14,88:1 | texto normal |
| --mut | --bg | 5,70:1 | texto normal |
| --mut | --card | 5,15:1 | texto normal |
| --acc | --bg | 4,33:1 | solo texto grande, iconos o bordes de control |
| --acc | --card | 3,92:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --bg | 16,44:1 | texto normal |
| --acc2 | --card | 14,88:1 | texto normal |

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
