import type { Ficha } from "@/lib/cine/schema";

/**
 * Primer estudio real (docs/27): Plain Sight, de motion-pieces (portada de threejs.org). Un suelo de 56 × 23 columnas-letra
 * con palabras escondidas que suben con el scroll mientras el resto se hunde. Render, luz y sombra, niebla, cámara (con
 * alabeo), rejilla, tamaños, palabras con su color y celda, y tiempos del scroll: medidos con cine:capture; el muelle sale
 * del vídeo (31 % de rebote) y la fuente es nuestra (la suya no es un recurso que se copie).
 */
export const plainSight: Ficha = {
  "id": "plain-sight",
  "titulo": "Plain Sight (motion-pieces) · campo tipográfico",
  "fuente": {
    "url": "https://motion-pieces.pages.dev/plain-sight/",
    "fecha": "2026-10-24",
    "autor": "motion-pieces",
    "licencia": "Estudio: concepto y medidas; fuente propia (Anton, OFL) y letras de relleno nuestras"
  },
  "reloj": "scroll",
  "duracion": 12.5,
  "aspecto": 1.7778,
  "render": {
    "renderer": "webgl2",
    "toneMapping": "neutral",
    "exposicion": 1,
    "colorSpace": "srgb",
    "dprMax": 1,
    "sombras": "pcf",
    "motor": "clasico"
  },
  "camara": {
    "near": 1,
    "far": 400,
    "planos": [
      {
        "id": "p1",
        "desde": 0,
        "hasta": 1,
        "movimientos": [
          "fijo"
        ],
        "camara": {
          "desde": {
            "pos": [
              -2.4481,
              -11.5174,
              17.4567
            ],
            "mira": [
              0.316,
              1.482,
              -2.244
            ],
            "fov": 28,
            "alabeo": -14.39
          },
          "hasta": {
            "pos": [
              -2.4481,
              -11.5174,
              17.4567
            ],
            "mira": [
              0.316,
              1.482,
              -2.244
            ],
            "fov": 28,
            "alabeo": -14.39
          },
          "curva": "linear"
        }
      }
    ]
  },
  "luz": {
    "entorno": {
      "tipo": "ninguno"
    },
    "luces": [
      {
        "tipo": "hemisferio",
        "color": "#ffffff",
        "suelo": "#8c8177",
        "intensidad": 1.6,
        "pos": [
          0,
          0,
          1
        ]
      },
      {
        "tipo": "direccional",
        "color": "#ffffff",
        "intensidad": 2.4,
        "pos": [
          -9,
          7,
          11
        ],
        "sombra": {
          "mapa": 2048,
          "sesgo": -0.0004,
          "sesgoNormal": 0.02,
          "radio": 3,
          "caja": [
            -15.609,
            15.609,
            15.609,
            -15.609,
            0.5,
            80
          ]
        }
      }
    ]
  },
  "materiales": [],
  "atmosfera": {
    "niebla": {
      "tipo": "lineal",
      "color": "#e4ddd3",
      "near": 20.64,
      "far": 29.9
    }
  },
  "post": [],
  "escena": [
    {
      "tipo": "componente",
      "id": "campo-tipografico",
      "props": {
        "fuente": "/fonts/anton/anton.typeface.json",
        "columnas": 56,
        "filas": 23,
        "paso": [
          0.44,
          1
        ],
        "letra": [
          0.466,
          0.996
        ],
        "profundidad": 6.535,
        "variacion": 0.02,
        "color": "#e9e2d8",
        "rugosidad": 0.82,
        "subida": 1.4,
        "hundimiento": 0.7,
        "tramo": [
          0.055,
          0.065,
          0.302,
          0.312
        ],
        "muelle": [
          0.034,
          0.14
        ],
        "muellePalabras": [
          0.052,
          0.22,
          0.16
        ],
        "escalonado": 0.0104,
        "escalonadoVuelta": 0.0083,
        "muelleVuelta": [
          0.034,
          0.14
        ],
        "onda": {
          "origen": [
            0,
            0
          ],
          "retraso": 0.0047,
          "retrasoSubida": 0.0047
        },
        "puntero": {
          "radio": 2.5,
          "hundir": 0.3,
          "curva": 1.4,
          "borde": 0.025,
          "tinte": "#d4d7ff"
        },
        "palabras": [
          {
            "texto": "ABOUT",
            "color": "#0916ff",
            "celda": [
              14,
              4
            ]
          },
          {
            "texto": "CONTACT",
            "color": "#017e4b",
            "celda": [
              19,
              -2
            ]
          },
          {
            "texto": "WORKS",
            "color": "#ff1704",
            "celda": [
              32,
              4
            ],
            "vertical": true
          },
          {
            "texto": "NEWS",
            "color": "#ffbd04",
            "celda": [
              42,
              0
            ],
            "vertical": true
          }
        ]
      }
    }
  ],
  "presupuesto": {
    "drawCalls": 44,
    "triangulos": 356184,
    "texturas": 3,
    "pasadasPorFotograma": 1,
    "dprMax": 1
  },
  "origen": {
    "render": "medido",
    "camara": "medido",
    "luz": "medido",
    "materiales": "medido",
    "atmosfera": "medido",
    "post": "medido",
    "presupuesto": "medido",
    "escena": "medido",
    "escena.0.props.fuente": "ojo",
    "escena.0.props.muelle": "video",
    "escena.0.props.puntero": "ojo"
  }
};
