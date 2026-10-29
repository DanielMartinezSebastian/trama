# Terminal de neón

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./terminal.json).

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
  "id": "terminal",
  "source": "repo",
  "label": "Terminal de neón",
  "note": "Negro tintado del color del acento, todo en monoespaciada, titulares gruesos en mayúsculas y un solo neón para lo que se puede tocar.",
  "sectors": "Herramientas para desarrolladores, ciberseguridad, infraestructura, datos, lanzamientos técnicos",
  "refs": [
    "CIPHERGRID (/demo/th-ciphergrid)",
    "MYCEL (/demo/th-mycel)",
    "Kernel Log (/sitios/kernel-log)"
  ],
  "variant": "outline",
  "tokens": {
    "bg": "#08020f",
    "fg": "#f4ecff",
    "mut": "#a78bc7",
    "acc": "#ff2fd0",
    "acc2": "#67e38a",
    "card": "#120a1c",
    "ln": "rgba(244,236,255,0.14)",
    "r": 4,
    "font": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "display": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "accentFont": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace"
  },
  "fonts": {
    "display": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "body": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "accent": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace",
    "mono": "var(--font-jetbrains-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(3rem, 13vw, 12rem)",
    "h1": "clamp(2.25rem, 4.4vw, 4.25rem)",
    "h2": "clamp(1.5rem, 2.4vw, 2.25rem)",
    "body": "0.875rem",
    "label": "0.75rem",
    "weight": 800,
    "lineHeight": 1,
    "tracking": -0.02,
    "upper": true,
    "labelUpper": true,
    "labelTracking": 0.08,
    "bodyLineHeight": 1.6
  },
  "space": {
    "margin": "max(24px, calc((100vw - 1100px) / 2))",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 128px)",
    "header": "56px",
    "measure": "34em"
  },
  "surface": {
    "radius": 4,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.15,
    "reveal": 0.6,
    "page": 0.4,
    "stagger": 0.03,
    "ease": "steps(4, end)",
    "easeReveal": "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  "heroes": [
    "dark-data",
    "product-center"
  ],
  "stories": [
    "product",
    "timeline"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"terminal\">",
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
    "--font-jetbrains-mono"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 17,83:1 | texto normal |
| --fg | --card | 16,84:1 | texto normal |
| --mut | --bg | 6,98:1 | texto normal |
| --mut | --card | 6,59:1 | texto normal |
| --acc | --bg | 6,40:1 | texto normal |
| --acc | --card | 6,05:1 | texto normal |
| --acc2 | --bg | 12,60:1 | texto normal |
| --acc2 | --card | 11,91:1 | texto normal |

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
