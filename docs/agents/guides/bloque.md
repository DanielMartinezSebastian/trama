# Bloque nocturno

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./bloque.json).

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
  "id": "bloque",
  "source": "premiadas",
  "label": "Bloque nocturno",
  "note": "Negro carbón y un solo acento saturado; titulares de palo muy pesado en mayúsculas que llenan la pantalla palabra a palabra, con fotos metidas entre las líneas. Esquinas casi rectas y texto pequeño de grotesca.",
  "sectors": "Logística y producción de eventos, productoras, agencias de marca, deporte, música, festivales",
  "refs": [
    "Truck'N Roll (https://trucknroll.com/)",
    "Glitch&Grit (https://glitchandgrit.com/)",
    "K72 (Brasa)",
    "Essor Fitness (Impulso)",
    "Bolo (/inspiraciones/bolo)",
    "Grano (/inspiraciones/grano)"
  ],
  "variant": "editorial",
  "tokens": {
    "bg": "#131313",
    "fg": "#f3f2ee",
    "mut": "#c4c1ba",
    "acc": "#7a64ff",
    "acc2": "#9be59a",
    "card": "#3d2bb8",
    "ln": "rgba(243,242,238,0.2)",
    "r": 2,
    "font": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "display": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "accentFont": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
  },
  "fonts": {
    "display": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "body": "var(--font-inter-tight), var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    "accent": "var(--font-archivo), ui-sans-serif, system-ui, sans-serif",
    "mono": "var(--font-geist-mono), ui-monospace, Consolas, monospace"
  },
  "type": {
    "brand": "clamp(5rem, 22vw, 22rem)",
    "h1": "clamp(3.4rem, 12vw, 13rem)",
    "h2": "clamp(2.4rem, 6vw, 6rem)",
    "body": "1rem",
    "label": "0.75rem",
    "weight": 900,
    "lineHeight": 0.84,
    "tracking": -0.02,
    "upper": true,
    "labelUpper": false,
    "labelTracking": 0,
    "bodyLineHeight": 1.4
  },
  "space": {
    "margin": "clamp(14px, 1.6vw, 24px)",
    "gutter": "clamp(14px, 1.6vw, 24px)",
    "cols": 12,
    "section": "clamp(90px, 10vw, 150px)",
    "header": "64px",
    "measure": "30em"
  },
  "surface": {
    "radius": 2,
    "pill": false,
    "shadow": false
  },
  "motion": {
    "fast": 0.15,
    "reveal": 0.7,
    "page": 0.6,
    "stagger": 0.06,
    "ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easeReveal": "cubic-bezier(0.19, 1, 0.22, 1)"
  },
  "heroes": [
    "split-video",
    "wordmark"
  ],
  "stories": [
    "product",
    "chapters"
  ]
}
```

## application

```json
{
  "component": "GuideFrame",
  "import": "import GuideFrame from \"trama-ui/GuideFrame\";",
  "usage": "<GuideFrame guide=\"bloque\">",
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
    "--font-geist-mono",
    "--font-inter",
    "--font-inter-tight"
  ]
}
```

## Contraste

| Texto | Fondo | Ratio | Uso |
| --- | --- | --- | --- |
| --fg | --bg | 16,59:1 | texto normal |
| --fg | --card | 8,38:1 | texto normal |
| --mut | --bg | 10,34:1 | texto normal |
| --mut | --card | 5,23:1 | texto normal |
| --acc | --bg | 4,51:1 | texto normal |
| --acc | --card | 2,28:1 | decorativo: no usar para texto ni controles |
| --acc2 | --bg | 12,45:1 | texto normal |
| --acc2 | --card | 6,29:1 | texto normal |

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
