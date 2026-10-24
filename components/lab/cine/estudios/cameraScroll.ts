import type { Ficha } from "@/lib/cine/schema";

/**
 * Calibración de cámara (docs/26 §6): el ejemplo camera-scroll de React Three Fiber, montado desde la ficha que sacó
 * `cine:capture` (planos, rutas, curvas, amortiguado y recorrido del scroll, render, luces, materiales y la animación del
 * GLB atada al scroll, todo medido). A mano solo el contenido (su GLB, sin Draco) y el entorno (el HDR que se vio en la
 * red: el preset «city» de drei), descargados a public/lab-assets/ solo para estudio local. Falta la flotación de las
 * piezas (drei Float): docs/26 §6.
 */
export const cameraScroll: Ficha = {
  "id": "camera-scroll",
  "titulo": "r3f · camera-scroll (desde la ficha capturada)",
  "fuente": {
    "url": "https://pmndrs.github.io/examples/camera-scroll/",
    "fecha": "2026-10-24",
    "autor": "pmndrs",
    "licencia": "Ejemplo MIT; modelo y HDR de pmndrs, solo estudio local"
  },
  "reloj": "scroll",
  "suavizado": 0.95,
  "duracion": 3.1,
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
        "hasta": 0.632,
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
              -5.6616,
              0.2653,
              19.3145
            ],
            "mira": [
              5.804,
              3.063,
              0.895
            ],
            "fov": 28,
            "alabeo": 0.02
          },
          "curva": "sine.in",
          "ruta": [
            [
              -10.602,
              -5.236,
              5.121
            ],
            [
              -10.348,
              -4.473,
              7.797
            ],
            [
              -9.92,
              -3.617,
              10.568
            ],
            [
              -9.34,
              -2.762,
              13.079
            ],
            [
              -8.509,
              -1.832,
              15.488
            ],
            [
              -7.384,
              -0.86,
              17.579
            ]
          ],
          "rutaMira": [
            [
              3.045,
              2.982,
              7.485
            ],
            [
              3.845,
              2.85,
              8.063
            ],
            [
              4.947,
              2.937,
              8.22
            ],
            [
              6.104,
              3.14,
              7.69
            ],
            [
              7.065,
              3.326,
              6.234
            ],
            [
              7.227,
              3.344,
              3.902
            ]
          ],
          "rutaAlabeo": [
            0,
            0,
            0,
            0.01,
            0.02,
            0.04
          ]
        }
      },
      {
        "id": "p2",
        "desde": 0.6437,
        "hasta": 1,
        "movimientos": [
          "orbita",
          "dolly"
        ],
        "camara": {
          "desde": {
            "pos": [
              -5.3173,
              0.4538,
              19.5136
            ],
            "mira": [
              5.386,
              2.99,
              0.439
            ],
            "fov": 28,
            "alabeo": 0.01
          },
          "hasta": {
            "pos": [
              8.7689,
              4.3838,
              16.0372
            ],
            "mira": [
              -1.999,
              2.364,
              1.013
            ],
            "fov": 28,
            "alabeo": 0.01
          },
          "curva": "power1.in",
          "ruta": [
            [
              -2.489,
              1.688,
              19.937
            ],
            [
              0.008,
              2.475,
              19.505
            ],
            [
              2.578,
              3.134,
              18.746
            ],
            [
              4.88,
              3.641,
              17.865
            ],
            [
              7.306,
              4.118,
              16.773
            ],
            [
              9.104,
              4.441,
              15.855
            ]
          ],
          "rutaMira": [
            [
              1.833,
              2.455,
              -1.479
            ],
            [
              -0.365,
              2.223,
              -1.445
            ],
            [
              -1.63,
              2.165,
              -0.774
            ],
            [
              -2.099,
              2.205,
              -0.047
            ],
            [
              -2.131,
              2.298,
              0.654
            ],
            [
              -1.953,
              2.38,
              1.081
            ]
          ],
          "rutaAlabeo": [
            0.02,
            0.02,
            0.02,
            0.01,
            0.01,
            0.01
          ]
        }
      },
      {
        "id": "p3",
        "desde": 1,
        "hasta": 1,
        "movimientos": [
          "fijo"
        ],
        "camara": {
          "desde": {
            "pos": [
              8.7648,
              4.3831,
              16.0394
            ],
            "mira": [
              -2,
              2.364,
              1.011
            ],
            "fov": 28
          },
          "hasta": {
            "pos": [
              8.6917,
              4.3706,
              16.0793
            ],
            "mira": [
              -2.01,
              2.36,
              0.997
            ],
            "fov": 28,
            "alabeo": -0.01
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
      "src": "/lab-assets/r3f/camera-scroll.glb",
      "animacion": "CameraAction.005",
      "animacionReloj": {
        "desde": 0.0008,
        "hasta": 1.1766
      }
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
    "escena.0.animacionReloj": "medido",
    "luz.entorno": "codigo"
  }
};
