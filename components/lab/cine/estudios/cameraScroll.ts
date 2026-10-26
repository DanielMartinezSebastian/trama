import type { Ficha } from "@/lib/cine/schema";

/**
 * Calibración de cámara (docs/26 §6): el ejemplo camera-scroll de React Three Fiber, montado desde dos capturas: con
 * scroll (cámara de autor animada por el clip del GLB, que va atado al scroll suavizado; planos y curvas como
 * descripción; render y luces) y en reposo (materiales asentados con su transición de entrada, flotación de cada pieza y
 * qué piezas no dan sombra). Todo medido. A mano solo el contenido (su GLB, sin Draco) y el entorno (el HDR que se vio en
 * la red: el preset «city» de drei), descargados a public/lab-assets/ solo para estudio local.
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
  "suavizado": 0.949,
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
        "hasta": 0.6359,
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
              -5.6586,
              0.267,
              19.3167
            ],
            "mira": [
              5.798,
              3.063,
              0.892
            ],
            "fov": 28,
            "alabeo": 0.02
          },
          "curva": "sine.in",
          "ruta": [
            [
              -10.601,
              -5.229,
              5.148
            ],
            [
              -10.345,
              -4.466,
              7.821
            ],
            [
              -9.916,
              -3.611,
              10.585
            ],
            [
              -9.336,
              -2.758,
              13.092
            ],
            [
              -8.505,
              -1.828,
              15.496
            ],
            [
              -7.38,
              -0.858,
              17.584
            ]
          ],
          "rutaMira": [
            [
              3.051,
              2.979,
              7.492
            ],
            [
              3.852,
              2.849,
              8.066
            ],
            [
              4.956,
              2.938,
              8.217
            ],
            [
              6.111,
              3.14,
              7.685
            ],
            [
              7.067,
              3.325,
              6.226
            ],
            [
              7.225,
              3.343,
              3.897
            ]
          ],
          "rutaAlabeo": [
            0,
            0.01,
            0.01,
            0.01,
            0.02,
            0.03
          ]
        }
      },
      {
        "id": "p2",
        "desde": 0.6477,
        "hasta": 1,
        "movimientos": [
          "orbita",
          "dolly"
        ],
        "camara": {
          "desde": {
            "pos": [
              -5.4093,
              0.4072,
              19.4755
            ],
            "mira": [
              5.495,
              3.009,
              0.554
            ],
            "fov": 28,
            "alabeo": 0.01
          },
          "hasta": {
            "pos": [
              8.6966,
              4.3714,
              16.0766
            ],
            "mira": [
              -2.008,
              2.361,
              0.999
            ],
            "fov": 28,
            "alabeo": -0.01
          },
          "curva": "power1.in",
          "ruta": [
            [
              -2.986,
              1.503,
              19.967
            ],
            [
              -0.065,
              2.454,
              19.523
            ],
            [
              2.237,
              3.056,
              18.867
            ],
            [
              4.69,
              3.601,
              17.943
            ],
            [
              7.142,
              4.089,
              16.855
            ],
            [
              9.087,
              4.438,
              15.863
            ]
          ],
          "rutaMira": [
            [
              2.407,
              2.53,
              -1.342
            ],
            [
              -0.315,
              2.227,
              -1.458
            ],
            [
              -1.523,
              2.163,
              -0.874
            ],
            [
              -2.077,
              2.2,
              -0.107
            ],
            [
              -2.145,
              2.292,
              0.612
            ],
            [
              -1.955,
              2.381,
              1.078
            ]
          ],
          "rutaAlabeo": [
            0.03,
            0.02,
            0,
            0.01,
            0,
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
              8.6961,
              4.3714,
              16.0769
            ],
            "mira": [
              -2.008,
              2.361,
              0.999
            ],
            "fov": 28,
            "alabeo": -0.01
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
    ],
    "deModelo": {
      "nodo": "Camera",
      "clip": "CameraAction.005"
    }
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
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
    },
    {
      "id": "M_Notebook",
      "modelo": "estandar",
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
    },
    {
      "id": "M_Rocket",
      "modelo": "estandar",
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
    },
    {
      "id": "M_Roundcube",
      "modelo": "estandar",
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
    },
    {
      "id": "M_Table",
      "modelo": "estandar",
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
    },
    {
      "id": "M_Headset",
      "modelo": "estandar",
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 0.2,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
    },
    {
      "id": "M_Zeppelin",
      "modelo": "estandar",
      "color": "#202020",
      "rugosidad": 0.5,
      "metalico": 0,
      "emisivo": "#000000",
      "intensidadEmisiva": 1,
      "opacidad": 1,
      "intensidadEntorno": 1,
      "transicion": {
        "desde": "#f9f9f9",
        "suavizado": 0.95
      }
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
        "desde": -0.0013,
        "hasta": 1.1753
      },
      "flotacion": [
        {
          "pieza": "Headphones",
          "pivote": [
            0.06,
            4.0403,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.24992,
            "fase": -0.0025
          },
          "giro": [
            {
              "amp": 0.05515,
              "fase": -0.7444
            },
            {
              "amp": 0.10194,
              "fase": 1.5869
            },
            {
              "amp": 0.05515,
              "fase": -0.7444
            }
          ]
        },
        {
          "pieza": "Notebook",
          "pivote": [
            0.06,
            4.0399,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.25002,
            "fase": 0.9698
          },
          "giro": [
            {
              "amp": 0.07372,
              "fase": 0.0577
            },
            {
              "amp": 0.10061,
              "fase": 2.5595
            },
            {
              "amp": 0.07372,
              "fase": 0.0577
            }
          ]
        },
        {
          "pieza": "Rocket003",
          "pivote": [
            0.06,
            4.0396,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.24968,
            "fase": 1.9434
          },
          "giro": [
            {
              "amp": 0.09058,
              "fase": 0.5022
            },
            {
              "amp": 0.09979,
              "fase": -2.739
            },
            {
              "amp": 0.09058,
              "fase": 0.5022
            }
          ]
        },
        {
          "pieza": "Roundcube001",
          "pivote": [
            0.06,
            4.0397,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.24983,
            "fase": 2.9182
          },
          "giro": [
            {
              "amp": 0.08601,
              "fase": 0.9348
            },
            {
              "amp": 0.09971,
              "fase": -1.7715
            },
            {
              "amp": 0.08601,
              "fase": 0.9348
            }
          ]
        },
        {
          "pieza": "Table",
          "pivote": [
            0.06,
            4.04,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.25006,
            "fase": -2.3925
          },
          "giro": [
            {
              "amp": 0.06702,
              "fase": 1.5798
            },
            {
              "amp": 0.09802,
              "fase": -0.8029
            },
            {
              "amp": 0.06702,
              "fase": 1.5798
            }
          ]
        },
        {
          "pieza": "VR_Headset",
          "pivote": [
            0.06,
            4.0404,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.24974,
            "fase": -1.4194
          },
          "giro": [
            {
              "amp": 0.06048,
              "fase": 2.5511
            },
            {
              "amp": 0.09789,
              "fase": 0.1744
            },
            {
              "amp": 0.06048,
              "fase": 2.5511
            }
          ]
        },
        {
          "pieza": "Zeppelin",
          "pivote": [
            0.06,
            4.0404,
            0.35
          ],
          "periodo": 12.55,
          "y": {
            "amp": 0.24975,
            "fase": -0.4446
          },
          "giro": [
            {
              "amp": 0.0787,
              "fase": -2.9709
            },
            {
              "amp": 0.09789,
              "fase": 1.1309
            },
            {
              "amp": 0.0787,
              "fase": -2.9709
            }
          ]
        }
      ],
      "sinSombra": [
        "Zeppelin"
      ]
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
    "escena.0.flotacion": "medido",
    "escena.0.sinSombra": "medido",
    "camara.deModelo": "medido",
    "luz.entorno": "codigo"
  }
};
