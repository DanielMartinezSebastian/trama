# Tinta a mano

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./tinta.json).

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
  "id": "tinta",
  "source": "premiadas",
  "label": "Tinta a mano",
  "note": "Papel, tinta y un rojo para lo que va mal. Letra gorda de cómic, texto manuscrito, línea dibujada y sombra dura de viñeta. Todo parece hecho con rotulador.",
  "sectors": "Videojuegos, humor, divulgación, ONG, productos que no se toman en serio",
  "refs": [
    "Don't Look Up",
    "No mires abajo (/inspiraciones/no-mires-abajo)"
  ],
  "variant": "retro",
  "tokens": {
    "bg": "#f4f3ef",
    "fg": "#14140f",
    "mut": "#55554d",
    "acc": "#c0342a",
    "acc2": "#14140f",
    "card": "#ffffff",
    "ln": "#14140f",
    "r": 12,
    "font": "var(--font-patrick-hand), cursive",
    "display": "var(--font-titan-one), \"Arial Black\", sans-serif",
    "accentFont": "var(--font-patrick-hand), cursive",
    "glow": false
  },
  "fonts": {
    "display": "var(--font-titan-one), \"Arial Black\", sans-serif",
    "body": "var(--font-patrick-hand), cursive",
    "accent": "var(--font-patrick-hand), cursive",
    "mono": "var(--font-patrick-hand), cursive"
  },
  "type": {
    "brand": "clamp(4rem, 13vw, 11rem)",
    "h1": "clamp(3rem, 7.6vw, 6rem)",
    "h2": "clamp(1.75rem, 3.4vw, 3rem)",
    "body": "1.1875rem",
    "label": "0.9375rem",
    "weight": 400,
    "lineHeight": 0.92,
    "tracking": 0,
    "upper": true,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.3
  },
  "space": {
    "margin": "18px",
    "gutter": "12px",
    "cols": 12,
    "section": "clamp(70px, 8vw, 110px)",
    "header": "54px",
    "measure": "26em"
  },
  "surface": {
    "radius": 12,
    "pill": true,
    "shadow": true
  },
  "motion": {
    "fast": 0.14,
    "reveal": 0.5,
    "page": 0.4,
    "stagger": 0.05,
    "ease": "ease-out",
    "easeReveal": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  },
  "heroes": [
    "product-center",
    "collage-manifesto"
  ],
  "stories": [
    "world",
    "service"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"tinta\">",
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
    "--font-patrick-hand",
    "--font-titan-one"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,64:1 | texto normal |
| --fg | --card | 18,47:1 | texto normal |
| --mut | --bg | 6,77:1 | texto normal |
| --mut | --card | 7,52:1 | texto normal |
| --acc | --bg | 5,02:1 | texto normal |
| --acc | --card | 5,58:1 | texto normal |
| --acc2 | --bg | 16,64:1 | texto normal |
| --acc2 | --card | 18,47:1 | texto normal |

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
