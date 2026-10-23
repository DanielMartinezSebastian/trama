import type { Ficha } from "@/lib/cine/schema";

/**
 * Calibración de cámara (docs/26 §6): el ejemplo camera-scroll de React Three Fiber, montado desde la ficha que sacó
 * `cine:capture` (planos, rutas, curvas, amortiguado del scroll, render, luces y materiales medidos). A mano solo el
 * contenido (su GLB, sin Draco) y el entorno (el HDR que se vio en la red: el preset «city» de drei), descargados a
 * public/lab-assets/ solo para estudio local. Se compara con `cine:compare` contra la misma captura.
 */
export const cameraScroll: Ficha = {
  "id": "camera-scroll",
  "titulo": "r3f · camera-scroll (desde la ficha capturada)",
  "fuente": {
    "url": "https://pmndrs.github.io/examples/camera-scroll/",
    "fecha": "2026-10-23",
    "autor": "pmndrs",
    "licencia": "Ejemplo MIT; modelo y HDR de pmndrs, solo estudio local"
  },
  "reloj": "scroll",
  "suavizado": 0.95,
  "duracion": 8.3,
  "aspecto": 1.7778,
  "render": {
    "renderer": "webgl2",
    "toneMapping": "aces",
    "exposicion": 1,
    "colorSpace": "srgb",
    "dprMax": 1,
    "sombras": "pcf"
  },
  "camara": {
    "near": 0.1,
    "far": 100,
    "planos": [
      {
        "id": "p1",
        "desde": 0,
        "hasta": 0.237,
        "movimientos": [
          "orbita",
          "dolly"
        ],
        "camara": {
          "desde": {
            "pos": [
              -10.7223,
              -5.9812,
              2.2973
            ],
            "mira": [
              2.46,
              3.392,
              6.625
            ],
            "fov": 28
          },
          "hasta": {
            "pos": [
              -5.6575,
              0.2677,
              19.3175
            ],
            "mira": [
              5.798,
              3.064,
              0.889
            ],
            "fov": 28
          },
          "curva": "sine.in",
          "ruta": [
            [
              -10.6,
              -5.226,
              5.158
            ],
            [
              -10.343,
              -4.464,
              7.829
            ],
            [
              -9.915,
              -3.609,
              10.592
            ],
            [
              -9.335,
              -2.756,
              13.097
            ],
            [
              -8.504,
              -1.827,
              15.499
            ],
            [
              -7.379,
              -0.857,
              17.586
            ]
          ],
          "rutaMira": [
            [
              3.054,
              2.978,
              7.495
            ],
            [
              3.855,
              2.849,
              8.067
            ],
            [
              4.959,
              2.94,
              8.217
            ],
            [
              6.113,
              3.14,
              7.684
            ],
            [
              7.069,
              3.327,
              6.224
            ],
            [
              7.225,
              3.342,
              3.893
            ]
          ]
        }
      },
      {
        "id": "p2",
        "desde": 0.2414,
        "hasta": 0.9984,
        "movimientos": [
          "orbita",
          "dolly"
        ],
        "camara": {
          "desde": {
            "pos": [
              -5.4082,
              0.4078,
              19.476
            ],
            "mira": [
              5.495,
              3.01,
              0.551
            ],
            "fov": 28
          },
          "hasta": {
            "pos": [
              8.6964,
              4.3714,
              16.0767
            ],
            "mira": [
              -2.008,
              2.361,
              0.999
            ],
            "fov": 28
          },
          "curva": "circ.out",
          "meseta": 0.019,
          "ruta": [
            [
              -2.985,
              1.503,
              19.967
            ],
            [
              -0.048,
              2.459,
              19.518
            ],
            [
              2.221,
              3.052,
              18.873
            ],
            [
              4.679,
              3.599,
              17.947
            ],
            [
              7.075,
              4.076,
              16.888
            ],
            [
              9.046,
              4.431,
              15.886
            ]
          ],
          "rutaMira": [
            [
              2.406,
              2.531,
              -1.341
            ],
            [
              -0.327,
              2.226,
              -1.456
            ],
            [
              -1.518,
              2.163,
              -0.878
            ],
            [
              -2.075,
              2.2,
              -0.112
            ],
            [
              -2.15,
              2.288,
              0.596
            ],
            [
              -1.961,
              2.379,
              1.071
            ]
          ]
        }
      },
      {
        "id": "p3",
        "desde": 0.9984,
        "hasta": 0.9993,
        "movimientos": [
          "fijo"
        ],
        "camara": {
          "desde": {
            "pos": [
              8.6959,
              4.3713,
              16.077
            ],
            "mira": [
              -2.009,
              2.361,
              1
            ],
            "fov": 28
          },
          "hasta": {
            "pos": [
              8.691,
              4.3705,
              16.0797
            ],
            "mira": [
              -2.008,
              2.362,
              0.998
            ],
            "fov": 28
          },
          "curva": "linear"
        }
      }
    ]
  },
  "luz": {
    "entorno": {
      "tipo": "hdri",
      "src": "/lab-assets/r3f/potsdamer_platz_1k.hdr",
      "intensidad": 1
    },
    "luces": [
      {
        "tipo": "ambiente",
        "color": "#ffffff",
        "intensidad": 3.142,
        "pos": [
          0,
          0,
          0
        ]
      },
      {
        "tipo": "direccional",
        "color": "#ffffff",
        "intensidad": 6.283,
        "pos": [
          10,
          20,
          15
        ],
        "deCamara": true,
        "sombra": {
          "mapa": 1024
        }
      }
    ]
  },
  "materiales": [
    {
      "id": "M_Headphone",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2
    },
    {
      "id": "M_Notebook",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2
    },
    {
      "id": "M_Rocket",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2
    },
    {
      "id": "M_Roundcube",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2
    },
    {
      "id": "M_Table",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2
    },
    {
      "id": "M_Headset",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2
    },
    {
      "id": "M_Zeppelin",
      "modelo": "estandar",
      "color": "#f9f9f9",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 1
    }
  ],
  "atmosfera": {},
  "post": [],
  "escena": [
    {
      "tipo": "gltf",
      "src": "/lab-assets/r3f/camera-scroll.glb"
    }
  ],
  "presupuesto": {
    "drawCalls": 8,
    "triangulos": 8932,
    "texturas": 9,
    "pasadasPorFotograma": 22,
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
    "escena": "codigo",
    "luz.entorno": "codigo"
  }
};
