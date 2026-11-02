# Residencia burdeos

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./burdeos.json).

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
  "id": "burdeos",
  "source": "premiadas",
  "label": "Residencia burdeos",
  "note": "Burdeos profundo y hueso, didona centrada, una caligrafía gigante casi invisible detrás, marco de esquinas biseladas y etiquetas muy espaciadas.",
  "sectors": "Promociones residenciales, bodegas, joyería, hoteles, restaurantes de firma",
  "refs": [
    "ERA Residence",
    "Alba Residencia (/inspiraciones/alba)"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#340c24",
    "fg": "#f3f3ec",
    "mut": "#c9b5bf",
    "acc": "#b5cedb",
    "acc2": "#e1c9a4",
    "card": "#47152f",
    "ln": "rgba(243,243,236,0.22)",
    "r": 0,
    "font": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-bodoni-moda), Georgia, serif",
    "accentFont": "var(--font-pinyon-script), cursive",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-bodoni-moda), Georgia, serif",
    "body": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-pinyon-script), cursive",
    "mono": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
  },
  "type": {
    "brand": "clamp(4rem, 13vw, 12rem)",
    "h1": "clamp(3rem, 7.4vw, 7rem)",
    "h2": "clamp(2.25rem, 5vw, 4.5rem)",
    "body": "0.9375rem",
    "label": "0.625rem",
    "weight": 400,
    "lineHeight": 1,
    "tracking": 0,
    "upper": false,
    "labelUpper": true,
    "labelTracking": 0.26,
    "bodyLineHeight": 1.5
  },
  "space": {
    "margin": "clamp(18px, 2.5vw, 36px)",
    "gutter": "20px",
    "cols": 12,
    "section": "clamp(100px, 11vw, 170px)",
    "header": "90px",
    "measure": "30em"
  },
  "surface": {
    "radius": 0,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.4,
    "reveal": 1,
    "page": 0.8,
    "stagger": 0.08,
    "ease": "cubic-bezier(0.76, 0, 0.24, 1)",
    "easeReveal": "cubic-bezier(0.25, 1, 0.5, 1)"
  },
  "heroes": [
    "wordmark",
    "framed-object"
  ],
  "stories": [
    "chapters",
    "timeline"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"burdeos\">",
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
    "--font-archivo",
    "--font-bodoni-moda",
    "--font-pinyon-script"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 15,39:1 | texto normal |
| --fg | --card | 13,30:1 | texto normal |
| --mut | --bg | 8,86:1 | texto normal |
| --mut | --card | 7,66:1 | texto normal |
| --acc | --bg | 10,47:1 | texto normal |
| --acc | --card | 9,05:1 | texto normal |
| --acc2 | --bg | 10,70:1 | texto normal |
| --acc2 | --card | 9,24:1 | texto normal |

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
