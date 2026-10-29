# Pie de página

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./footer.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/Footer.d.ts)
- [Índice piloto](../README.md)

## validation

```json
{
  "publicTypes": "generated-from-source",
  "packageExamples": "not-certified-by-generation",
  "browserFlow": "not-certified-by-generation"
}
```

## component

Footer

## description

Marca, columnas de enlaces, redes y línea de copyright: el cierre habitual de cualquier landing.

## category

secciones

## import

import Footer from "trama-ui/Footer";

## api

```json
{
  "module": "trama-ui/Footer",
  "props": "React.ComponentProps<typeof Footer>",
  "declaration": "types/components/ui/Footer.d.ts",
  "packageDeclaration": "./dist/components/ui/Footer.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "brand",
    "label": "Marca",
    "type": "text",
    "default": "Maré Surf Club"
  },
  {
    "key": "tagline",
    "label": "Eslogan",
    "type": "text",
    "default": "Del primer remo a tu primera ola verde."
  },
  {
    "key": "columns",
    "label": "Columnas («Título: enlace, enlace; Título: enlace»)",
    "type": "text",
    "multiline": true,
    "default": "Escuela: Clases, Monitores, Ubicación; Ayuda: Reservas, Cancelaciones, FAQ; Legal: Privacidad, Términos, Cookies"
  },
  {
    "key": "social",
    "label": "Redes (separadas por comas)",
    "type": "text",
    "default": "X, IG, YT",
    "hint": "Escribe \\, para una coma dentro de un elemento (\"99\\,5 %\")"
  },
  {
    "key": "copyright",
    "label": "Copyright",
    "type": "text",
    "default": "© 2026 Maré Surf Club. Todos los derechos reservados."
  },
  {
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "minimal",
    "options": [
      "glass",
      "solid",
      "outline",
      "neon",
      "retro",
      "terminal",
      "minimal",
      "dotmatrix",
      "editorial"
    ],
    "hint": "Cambia superficie, borde, radio, sombra y tipografía"
  }
]
```

## notes

```json
[]
```

## requirements

```json
[
  "import \"trama-ui/styles.css\" una vez; tema/guía en contenedor."
]
```

## dependencies

```json
{
  "components": [
    "Icon"
  ],
  "packages": [
    {
      "name": "pixelarticons",
      "version": "^2.4.1"
    },
    {
      "name": "react",
      "version": "^19.3.0"
    }
  ]
}
```

## Ejemplos

Sin ejemplo específico; consultar receta/guía y declaración completa.

## limitations

```json
[]
```
