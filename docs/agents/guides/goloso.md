# Rosa y chocolate

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./goloso.json).

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
  "id": "goloso",
  "source": "premiadas",
  "label": "Rosa y chocolate",
  "note": "Rosa empolvado y chocolate alternando secciones, una ultranegra de borde a borde cruzada por una caligráfica y serifa en mayúsculas a tamaño de frase.",
  "sectors": "Interiorismo, hoteles con carácter, pastelería, moda, tiendas de objetos",
  "refs": [
    "House of Honey",
    "Casa Melosa (/inspiraciones/casa-melosa)"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#edccbe",
    "fg": "#331917",
    "mut": "#6a4438",
    "acc": "#331917",
    "acc2": "#a81f78",
    "card": "#f4dfd6",
    "ln": "rgba(51,25,23,0.3)",
    "r": 0,
    "font": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-archivo-black), \"Arial Black\", sans-serif",
    "accentFont": "var(--font-pinyon-script), cursive",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-archivo-black), \"Arial Black\", sans-serif",
    "body": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-pinyon-script), cursive",
    "mono": "var(--font-playfair-display), Georgia, serif"
  },
  "type": {
    "brand": "clamp(3rem, 12vw, 19rem)",
    "h1": "clamp(2.75rem, 7.6vw, 7.5rem)",
    "h2": "clamp(1.75rem, 4vw, 3.5rem)",
    "body": "0.9375rem",
    "label": "0.8125rem",
    "weight": 400,
    "lineHeight": 0.92,
    "tracking": -0.03,
    "upper": true,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.35
  },
  "space": {
    "margin": "12px",
    "gutter": "8px",
    "cols": 12,
    "section": "clamp(80px, 8vw, 130px)",
    "header": "32px",
    "measure": "26em"
  },
  "surface": {
    "radius": 0,
    "pill": true,
    "shadow": false
  },
  "motion": {
    "fast": 0.4,
    "reveal": 0.65,
    "page": 0.65,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.65, 0.05, 0.36, 1)",
    "easeReveal": "cubic-bezier(0.65, 0.05, 0.36, 1)"
  },
  "heroes": [
    "wordmark",
    "split-video"
  ],
  "stories": [
    "chapters",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"goloso\">",
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
    "--font-archivo-black",
    "--font-inter",
    "--font-pinyon-script",
    "--font-playfair-display"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 10,82:1 | texto normal |
| --fg | --card | 12,67:1 | texto normal |
| --mut | --bg | 5,60:1 | texto normal |
| --mut | --card | 6,56:1 | texto normal |
| --acc | --bg | 10,82:1 | texto normal |
| --acc | --card | 12,67:1 | texto normal |
| --acc2 | --bg | 4,46:1 | solo texto grande, iconos o bordes de control |
| --acc2 | --card | 5,23:1 | texto normal |

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
