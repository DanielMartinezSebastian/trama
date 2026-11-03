# Clínica serena

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./clinica.json).

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
  "id": "clinica",
  "source": "premiadas",
  "label": "Clínica serena",
  "note": "Marfil y azul tinta; una serifa de libro para todo lo que se lee, con sangría en los párrafos grandes, y una grotesca diminuta en mayúsculas para navegar. Fotos en duotono azul.",
  "sectors": "Medicina estética, dermatología, odontología, fisioterapia, psicología, farmacia de autor",
  "refs": [
    "Odyssée",
    "Pausa (/inspiraciones/pausa)"
  ],
  "variant": "minimal",
  "tokens": {
    "bg": "#fffcf8",
    "fg": "#1e305e",
    "mut": "#5a6584",
    "acc": "#1e305e",
    "acc2": "#a9b4d6",
    "card": "#f4f1ea",
    "ln": "rgba(30,48,94,0.18)",
    "r": 0,
    "font": "var(--font-newsreader), Georgia, serif",
    "display": "var(--font-newsreader), Georgia, serif",
    "accentFont": "var(--font-inter), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-newsreader), Georgia, serif",
    "body": "var(--font-newsreader), Georgia, serif",
    "accent": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(5rem, 22vw, 22rem)",
    "h1": "clamp(2.6rem, 5vw, 4.6rem)",
    "h2": "clamp(1.6rem, 2.9vw, 2.6rem)",
    "body": "1.0625rem",
    "label": "0.625rem",
    "weight": 400,
    "lineHeight": 1,
    "tracking": -0.015,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.1,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(16px, 2.2vw, 32px)",
    "gutter": "2px",
    "cols": 12,
    "section": "clamp(80px, 10vw, 150px)",
    "header": "52px",
    "measure": "30em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.35,
    "reveal": 0.9,
    "page": 0.7,
    "stagger": 0.07,
    "ease": "cubic-bezier(0.22, 1, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "split-video",
    "asym-editorial"
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
  "usage": "<GuideFrame guide=\"clinica\">",
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
| --fg | --bg | 12,52:1 | texto normal |
| --fg | --card | 11,35:1 | texto normal |
| --mut | --bg | 5,66:1 | texto normal |
| --mut | --card | 5,13:1 | texto normal |
| --acc | --bg | 12,52:1 | texto normal |
| --acc | --card | 11,35:1 | texto normal |
| --acc2 | --bg | 2,02:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 1,83:1 | decorativo: no usar para texto ni controles |

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
