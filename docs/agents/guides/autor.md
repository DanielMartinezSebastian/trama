# Academia de autor

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./autor.json).

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
  "id": "autor",
  "source": "sectores",
  "label": "Academia de autor",
  "note": "Gris claro con dos acentos, todo en minúsculas, títulos entre paréntesis, garabatos a mano y botones con sombra dura: la marca es la persona.",
  "sectors": "Formación de una persona, coaching, viajes guiados, creadores con comunidad",
  "refs": [
    "Surfing Academy"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#ededed",
    "fg": "#17191a",
    "mut": "#555555",
    "acc": "#ff4f28",
    "acc2": "#39be91",
    "card": "#ffffff",
    "ln": "rgba(23,25,26,0.6)",
    "r": 0,
    "font": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-onest), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-onest), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(4rem, 20vw, 18rem)",
    "h1": "clamp(2.5rem, 6.9vw, 6.25rem)",
    "h2": "clamp(2rem, 3.1vw, 2.8125rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 400,
    "lineHeight": 1,
    "tracking": 0,
    "upper": false,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "clamp(20px, 8vw - 10px, 120px)",
    "gutter": "16px",
    "cols": 12,
    "section": "clamp(80px, 9vw, 120px)",
    "header": "24px",
    "measure": "30em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": true
  },
  "motion": {
    "fast": 0.2,
    "reveal": 1,
    "page": 0.8,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.165, 0.84, 0.44, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "collage-manifesto",
    "asym-editorial"
  ],
  "stories": [
    "timeline",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"autor\">",
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
    "--font-onest"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,07:1 | texto normal |
| --fg | --card | 17,64:1 | texto normal |
| --mut | --bg | 6,37:1 | texto normal |
| --mut | --card | 7,46:1 | texto normal |
| --acc | --bg | 2,80:1 | decorativo: no usar para texto ni controles |
| --acc | --card | 3,28:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --bg | 2,00:1 | decorativo: no usar para texto ni controles |
| --acc2 | --card | 2,35:1 | decorativo: no usar para texto ni controles |

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
