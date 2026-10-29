# Barra de navegación

> Generado por npm run catalog. No editar. Estado piloto; no acredita recorrido en navegador.

Paquete: trama-ui@0.13.0 · esquema 1. [Ficha JSON y hashes de procedencia](./navbar.json).

- [API completa (snapshot de declaraciones)](../types/components/ui/NavBar.d.ts)
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

NavBar

## description

Barra de navegación completa: siete disposiciones (o piezas en el orden que quieras), seis formas de barra, submenús desplegables o mega menú con categorías, barra de búsqueda o paleta ⌘K, menú móvil propio, anuncio, dos llamadas a la acción y comportamiento al hacer scroll.

## category

navegacion

## import

import NavBar from "trama-ui/NavBar";

## api

```json
{
  "module": "trama-ui/NavBar",
  "props": "React.ComponentProps<typeof NavBar>",
  "declaration": "types/components/ui/NavBar.d.ts",
  "packageDeclaration": "./dist/components/ui/NavBar.d.ts",
  "complete": "Consultar declaración y sus imports transitivos; controles del visor no son la firma."
}
```

## playgroundProps

```json
[
  {
    "key": "layout",
    "label": "Disposición",
    "type": "select",
    "default": "classic",
    "options": [
      "classic",
      "left",
      "right",
      "center",
      "split",
      "stacked",
      "minimal"
    ],
    "labels": {
      "classic": "clásica (marca · enlaces · acciones)",
      "left": "enlaces junto a la marca",
      "right": "enlaces junto a las acciones",
      "center": "enlaces centrados",
      "split": "marca en el centro",
      "stacked": "dos filas (búsqueda arriba, secciones abajo)",
      "minimal": "mínima (marca + menú)"
    }
  },
  {
    "key": "slots",
    "label": "Piezas a medida (sustituye a la disposición)",
    "type": "text",
    "default": "",
    "hint": "brand links search actions spacer menu · | nueva fila · / columnas"
  },
  {
    "key": "shape",
    "label": "Forma de la barra",
    "type": "select",
    "default": "island",
    "options": [
      "island",
      "full",
      "contained",
      "floating",
      "transparent",
      "underline"
    ],
    "labels": {
      "island": "tarjeta",
      "full": "de borde a borde",
      "contained": "de borde a borde, contenido centrado",
      "floating": "píldora flotante",
      "transparent": "transparente",
      "underline": "solo línea inferior"
    }
  },
  {
    "key": "linkHover",
    "label": "Enlaces al pasar",
    "type": "select",
    "default": "color",
    "options": [
      "color",
      "underline"
    ],
    "labels": {
      "color": "cambian de color",
      "underline": "raya que crece"
    }
  },
  {
    "key": "size",
    "label": "Densidad",
    "type": "select",
    "default": "md",
    "options": [
      "sm",
      "md",
      "lg"
    ]
  },
  {
    "key": "bleed",
    "label": "Ocupar el ancho de la ventana",
    "type": "boolean",
    "default": false,
    "hint": "sale de los márgenes de su contenedor"
  },
  {
    "key": "search",
    "label": "Búsqueda",
    "type": "select",
    "default": "bar",
    "options": [
      "none",
      "bar",
      "inline",
      "button",
      "command"
    ],
    "labels": {
      "none": "sin búsqueda",
      "bar": "barra de búsqueda",
      "inline": "campo compacto",
      "button": "icono → paleta",
      "command": "botón ⌘K → paleta"
    }
  },
  {
    "key": "searchPlaceholder",
    "label": "Texto de la búsqueda",
    "type": "text",
    "default": "Buscar clases, tablas…"
  },
  {
    "key": "searchItems",
    "label": "Entradas extra de búsqueda",
    "type": "text",
    "default": "Horarios, Mareas de hoy, Bonos regalo"
  },
  {
    "key": "brand",
    "label": "Marca",
    "type": "text",
    "default": "Maré"
  },
  {
    "key": "links",
    "label": "Enlaces (una sección por línea)",
    "type": "text",
    "multiline": true,
    "default": "Clases > Iniciación|Grupos de seis y espuma blanda|icon:users; Perfeccionamiento|Vídeo-análisis de tus olas|icon:video; Privadas|Un monitor solo para ti|icon:user\nTienda > #Tablas; Softboard; Longboard; Shortboard; #Neoprenos; Primavera 3/2; Invierno 4/3; #Accesorios; Quillas; Leash; Parafina\nReservas=#reservas\nContacto [nuevo]"
  },
  {
    "key": "menuStyle",
    "label": "Submenús",
    "type": "select",
    "default": "auto",
    "options": [
      "auto",
      "dropdown",
      "mega"
    ],
    "labels": {
      "auto": "auto (mega con descripciones o categorías)",
      "dropdown": "desplegable",
      "mega": "mega menú"
    }
  },
  {
    "key": "openOn",
    "label": "Abrir submenús con",
    "type": "select",
    "default": "hover",
    "options": [
      "hover",
      "click"
    ]
  },
  {
    "key": "linksAlign",
    "label": "Alinear enlaces (clásica)",
    "type": "select",
    "default": "center",
    "options": [
      "start",
      "center",
      "end"
    ]
  },
  {
    "key": "cta",
    "label": "Botón principal",
    "type": "text",
    "default": "Reservar"
  },
  {
    "key": "secondaryCta",
    "label": "Botón secundario",
    "type": "text",
    "default": "Entrar"
  },
  {
    "key": "announcement",
    "label": "Anuncio",
    "type": "text",
    "default": ""
  },
  {
    "key": "utility",
    "label": "Barra de utilidades (corporativo)",
    "type": "text",
    "default": "",
    "hint": "Empleo=/empleo, Inversores=/inversores | ES, EN — tras | van a la derecha"
  },
  {
    "key": "collapseAt",
    "label": "Plegar por debajo de (px)",
    "type": "number",
    "default": 760,
    "min": 0,
    "max": 1400,
    "step": 20
  },
  {
    "key": "mobileMenu",
    "label": "Menú móvil",
    "type": "select",
    "default": "drawer",
    "options": [
      "drawer",
      "sheet"
    ],
    "labels": {
      "drawer": "cajón lateral",
      "sheet": "hoja bajo la barra"
    }
  },
  {
    "key": "defaultActive",
    "label": "Enlace activo",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 5,
    "step": 1
  },
  {
    "key": "variant",
    "label": "Variante de estilo",
    "type": "select",
    "default": "glass",
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
  },
  {
    "key": "previewWidth",
    "label": "Ancho de la vista previa (px, 0 = todo)",
    "type": "number",
    "default": 0,
    "min": 0,
    "max": 1400,
    "step": 20,
    "noCode": true
  }
]
```

## notes

```json
[
  "Enlaces como texto, una sección por línea: `Sección > Hijo|descripción|icon:nombre; Hijo=/ruta`. Dentro de un submenú, `#Categoría` abre una columna con título. `Etiqueta=#id` es un enlace real y `Etiqueta [nuevo]` lleva insignia.",
  "layout elige una disposición; slots la sustituye pieza a pieza: brand, links, search, actions, spacer y menu separadas por espacios, `|` para otra fila y `/` para columnas alineadas a izquierda, centro y derecha. Ej.: \"brand / links / search actions\".",
  "Se pliega en menú móvil según el ancho de su contenedor (collapseAt), no de la ventana: baja «Ancho de la vista previa» para verlo.",
  "Con search=\"button\" o \"command\" (y siempre en móvil), ⌘K / Ctrl+K y «/» abren la paleta; busca en los enlaces, sus categorías y searchItems.",
  "La paleta y el cajón móvil salen a document.body con los tokens copiados: un ancestro con backdrop-filter (glass, cabeceras con blur) atraparía su position: fixed."
]
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
    "Button",
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
    },
    {
      "name": "react-dom",
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
