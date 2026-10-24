/**
 * Ficha de escena (docs/26): la descripción de una escena 3D cinemática con un vocabulario cerrado. La misma estructura
 * sirve para tres cosas, y por eso se pueden comparar:
 *   1. describir una referencia (lo rellena `cine:capture` con lo medido y se completa a mano con lo visto en el vídeo);
 *   2. montarla en el banco de pruebas (`/lab/cine/[estudio]`), que la lee tal cual;
 *   3. compararlas (`cine:compare`), eje por eje.
 *
 * Ocho ejes: cámara (planos), luz y materiales, atmósfera, posprocesado, movimiento, interacción, interfaz y presupuesto.
 * Cada valor puede llevar su origen en `origen` (ruta con puntos → «medido», «video», «ojo» o «codigo»): lo que no se vio
 * no se inventa (docs/07 §4).
 */

export type Vec3 = [number, number, number];

/** de dónde sale un valor: gancho de three, análisis del vídeo, observación a ojo o código fuente de la referencia */
export type Fuente = "medido" | "video" | "ojo" | "codigo";

/**
 * Curva de un movimiento. Familias de GSAP (`power1`–`power4`, `expo`, `sine`, `circ`, `back`) con `.in`, `.out` o `.inOut`,
 * `linear`, `cubic-bezier(x1,y1,x2,y2)` o `spring(k,c)` (muelle: rigidez y amortiguación, por fotograma a 60 Hz).
 */
export type Curva = string;

/* ------------------------------------------------------------------ 1. Plano y cámara */

/** tamaño de plano (shot size), del más cerrado al más abierto */
export const TAMANOS = ["detalle", "primerisimo", "primer", "medio", "americano", "general", "gran-general"] as const;
export type TamanoPlano = (typeof TAMANOS)[number];

/** angulación respecto al sujeto */
export const ANGULOS = ["cenital", "picado", "normal", "contrapicado", "nadir", "holandes"] as const;
export type AnguloPlano = (typeof ANGULOS)[number];

/**
 * Movimientos de cámara (término en español · inglés):
 * fijo · static, dolly (avanza o retrocede: cambia la distancia) · dolly, travelling lateral · truck, pedestal (sube o baja
 * sin girar) · pedestal, grúa (sube y gira) · crane, órbita (gira alrededor del sujeto) · orbit/arc, zoom (cambia el fov sin
 * moverse) · zoom, dolly-zoom (vértigo: avanza y abre el fov) · dolly zoom, panorámica (gira sobre sí, horizontal) · pan,
 * inclinación (gira sobre sí, vertical) · tilt, alabeo (gira sobre el eje de mirada) · roll, barrido (panorámica muy rápida)
 * · whip pan.
 */
export const MOVIMIENTOS = ["fijo", "dolly", "truck", "pedestal", "grua", "orbita", "zoom", "dolly-zoom", "panoramica", "inclinacion", "alabeo", "barrido"] as const;
export type Movimiento = (typeof MOVIMIENTOS)[number];

/** qué mueve la escena: el tiempo (intro, bucle), el scroll o el puntero */
export type Reloj = "tiempo" | "scroll" | "puntero";

export type PoseCamara = {
  pos: Vec3;
  /** punto al que mira */
  mira: Vec3;
  /** campo de visión vertical en grados (35 mm equivalente: `focalMM`) */
  fov: number;
  /** alabeo · roll: giro sobre el eje de mirada en grados (positivo = el horizonte baja por la derecha); sin él, horizonte recto */
  alabeo?: number;
};

export type Plano = {
  id: string;
  /** en segundos (reloj tiempo) o en progreso 0–1 (reloj scroll) */
  desde: number;
  hasta: number;
  tamano?: TamanoPlano;
  angulo?: AnguloPlano;
  movimientos: Movimiento[];
  camara: {
    desde: PoseCamara;
    hasta: PoseCamara;
    curva: Curva;
    /** fracción del plano quieta al final (0–1) */
    meseta?: number;
    /**
     * Puntos de paso entre `desde` y `hasta`, repartidos por distancia recorrida (los da la captura). Sin ellos el camino es
     * recto; con ellos es una curva suave (Catmull-Rom) por la que la cámara avanza según `curva`: una órbita no es una cuerda.
     */
    ruta?: Vec3[];
    /** puntos de paso del punto mirado, en los mismos instantes que `ruta` */
    rutaMira?: Vec3[];
    /** alabeo en los mismos puntos de paso que `ruta` */
    rutaAlabeo?: number[];
  };
  /** profundidad de campo: distancia de enfoque y apertura; `hasta` para un cambio de foco (rack focus) */
  foco?: { distancia: number; apertura: number; hasta?: number };
  nota?: string;
};

export type Camara = {
  near: number;
  far: number;
  planos: Plano[];
  /** temblor de cámara (camera shake): amplitud en unidades de escena y frecuencia en Hz */
  temblor?: { amplitud: number; frecuencia: number };
  /** respuesta al puntero: desplazamiento (parallax, unidades) e inclinación (grados), con su curva de seguimiento */
  puntero?: { parallax: number; inclinacion: number; curva: Curva };
};

/* ------------------------------------------------------------------ 2. Luz y materiales */

export const TONE_MAPPINGS = ["none", "linear", "reinhard", "cineon", "aces", "agx", "neutral"] as const;
export type ToneMapping = (typeof TONE_MAPPINGS)[number];

export type Entorno =
  /** RoomEnvironment de three (estudio neutro generado, sin descargas) */
  | { tipo: "estudio"; intensidad: number; fondo?: boolean; desenfoque?: number }
  /** mapa HDR/EXR equirectangular (IBL) */
  | { tipo: "hdri"; src: string; intensidad: number; fondo?: boolean; desenfoque?: number; rotacion?: number }
  | { tipo: "ninguno" };

export type Luz = {
  tipo: "ambiente" | "hemisferio" | "direccional" | "puntual" | "foco" | "rectangular";
  color: string;
  /** color del suelo (hemisferio) */
  suelo?: string;
  intensidad: number;
  pos?: Vec3;
  mira?: Vec3;
  distancia?: number;
  decaimiento?: number;
  /** foco: ángulo de apertura (rad) y penumbra (0–1) */
  angulo?: number;
  penumbra?: number;
  sombra?: { mapa: number; sesgo?: number; radio?: number };
  /** va pegada a la cámara (la sigue): `pos` es relativa a ella */
  deCamara?: boolean;
  /** papel en el esquema de iluminación de tres puntos */
  papel?: "principal" | "relleno" | "contra" | "ambiente" | "practica";
};

export type Material = {
  /** nombre con el que se asigna a las piezas de la escena */
  id: string;
  modelo: "estandar" | "fisico" | "basico" | "lambert" | "toon" | "matcap" | "shader";
  color?: string;
  rugosidad?: number;
  /** cuánto refleja el entorno (envMapIntensity): bajarlo apaga los brillos del HDRI sin tocar las luces */
  intensidadEntorno?: number;
  metalico?: number;
  emisivo?: string;
  intensidadEmisiva?: number;
  transmision?: number;
  grosor?: number;
  ior?: number;
  dispersion?: number;
  barniz?: number;
  rugosidadBarniz?: number;
  brillo?: number;
  iridiscencia?: number;
  opacidad?: number;
  /** mapas que usa (nombre → ruta), para la ficha; el banco solo pinta los que entiende */
  mapas?: Record<string, string>;
};

/* ------------------------------------------------------------------ 3. Atmósfera */

export type Atmosfera = {
  niebla?: { tipo: "lineal"; color: string; near: number; far: number } | { tipo: "exp2"; color: string; densidad: number } | { tipo: "altura"; color: string; densidad: number; altura: number };
  fondo?: string;
  /** partículas, volumétricos, cáusticas…: descripción libre hasta que el banco las soporte */
  efectos?: { tipo: "particulas" | "volumetrico" | "rayos" | "causticas" | "cielo" | "otro"; nota: string }[];
};

/* ------------------------------------------------------------------ 4. Posprocesado (en el orden en que se aplica) */

export type Pase =
  | { tipo: "ao"; metodo: "ssao" | "gtao"; radio: number; intensidad: number }
  | { tipo: "ssr"; intensidad: number }
  | { tipo: "bloom"; fuerza: number; radio: number; umbral: number; selectivo?: boolean }
  /** profundidad de campo: distancia de enfoque, rango enfocado alrededor (focal) y tamaño del bokeh (nodo dof de TSL) */
  | { tipo: "dof"; foco: number; focal: number; bokeh: number }
  | { tipo: "desenfoque-movimiento"; fuerza: number }
  | { tipo: "lut"; src: string; intensidad: number }
  | { tipo: "aberracion"; fuerza: number }
  | { tipo: "destello"; nota?: string }
  | { tipo: "grano"; intensidad: number }
  | { tipo: "vineta"; fuerza: number; suavidad: number }
  | { tipo: "aa"; metodo: "fxaa" | "smaa" | "traa" | "msaa" };

/** orden canónico de la pila (docs/26 §4): AO → SSR → bloom → DOF → movimiento → (tone mapping) → LUT → lente → AA */
export const ORDEN_PASES: Pase["tipo"][] = ["ao", "ssr", "bloom", "dof", "desenfoque-movimiento", "lut", "aberracion", "destello", "grano", "vineta", "aa"];

/* ------------------------------------------------------------------ 5–7. Movimiento, interacción e interfaz */

/** los doce principios de la animación que más pesan en una web 3D, con lo observado en cada uno */
export const PRINCIPIOS = ["anticipacion", "aceleracion", "inercia", "solapamiento", "arcos", "exageracion", "puesta-en-escena", "ritmo"] as const;
export type Principio = (typeof PRINCIPIOS)[number];

export type Movimientos = {
  principios?: Partial<Record<Principio, string>>;
  transiciones?: { tipo: "fundido" | "mascara" | "portal" | "corte" | "barrido" | "otro"; nota: string }[];
};

export type Interaccion = {
  puntero?: string;
  clic?: string;
  fisicas?: string;
  audio?: string;
};

export type Interfaz = {
  /** texto como DOM encima del lienzo, DOM proyectado sobre la escena, o texto dentro de WebGL (SDF/MSDF) */
  texto?: "dom" | "dom-proyectado" | "webgl";
  nota?: string;
};

/* ------------------------------------------------------------------ 8. Presupuesto técnico */

export type Presupuesto = {
  drawCalls?: number;
  triangulos?: number;
  texturas?: number;
  pasadasPorFotograma?: number;
  gpuMs?: number;
  dprMax?: number;
  cargaMB?: number;
  respaldo?: string;
};

/* ------------------------------------------------------------------ Contenido de la escena (para el banco) */

/**
 * Qué hay en la escena. Lo que se puede describir como datos (un GLB, una primitiva) va aquí; lo que no (un shader propio,
 * una simulación) es un `componente` registrado en el banco por su id.
 */
export type Pieza =
  | {
      tipo: "gltf";
      src: string;
      escala?: number;
      pos?: Vec3;
      rot?: Vec3;
      /** clip que se reproduce («*» = el primero) */
      animacion?: string;
      /** el clip no corre solo: su tiempo sigue al reloj de la ficha, de `desde` (reloj 0) a `hasta` (reloj 1) */
      animacionReloj?: { desde: number; hasta: number };
      material?: string;
    }
  | { tipo: "primitiva"; forma: "esfera" | "caja" | "toro" | "nudo" | "plano" | "cilindro"; material: string; escala?: number | Vec3; pos?: Vec3; rot?: Vec3; giro?: Vec3 }
  | { tipo: "componente"; id: string; props?: Record<string, unknown> };

/* ------------------------------------------------------------------ Rúbrica y notas */

export const EJES = ["camara", "luz", "atmosfera", "post", "movimiento", "interaccion", "interfaz", "presupuesto"] as const;
export type Eje = (typeof EJES)[number];

/** nota de 1 a 5 por eje, con su justificación (anclas en lib/cine/rubric.ts) */
export type Rubrica = Partial<Record<Eje, { nota: 1 | 2 | 3 | 4 | 5; porque: string }>>;

/** observación con su momento: segundos o progreso de scroll, según el reloj */
export type Nota = { t: number; eje: Eje; texto: string };

/* ------------------------------------------------------------------ La ficha */

export type Ficha = {
  id: string;
  titulo: string;
  fuente: { url: string; fecha: string; autor?: string; licencia?: string };
  reloj: Reloj;
  /**
   * Amortiguado del reloj de scroll (el «smooth scroll» de Lenis o drei ScrollControls): la fracción de la distancia al
   * objetivo que queda tras un fotograma a 60 Hz (0 = sin suavizado, 0,9 = muy suave). Las curvas de los planos se miden
   * contra el scroll ya suavizado. Sale de cómo frena la cámara después del último golpe de rueda.
   */
  suavizado?: number;
  /** segundos (tiempo) o pantallas de scroll (scroll) */
  duracion: number;
  /** relación de aspecto del lienzo en que se midió */
  aspecto: number;
  render: {
    renderer: "webgpu" | "webgl2";
    toneMapping: ToneMapping;
    exposicion: number;
    colorSpace: "srgb" | "display-p3" | "linear";
    dprMax: number;
    sombras?: "pcf" | "pcf-soft" | "vsm" | "ninguna";
    /**
     * Solo para el banco: «nodos» (por defecto) = WebGPURenderer con materiales de nodos y posprocesado TSL; «clasico» =
     * WebGLRenderer de siempre, sin posprocesado. Con los mismos valores no iluminan igual (docs/26 §6): para calibrar
     * contra una referencia WebGL, primero con «clasico».
     */
    motor?: "nodos" | "clasico";
  };
  camara: Camara;
  luz: { entorno: Entorno; luces: Luz[] };
  materiales: Material[];
  atmosfera: Atmosfera;
  post: Pase[];
  escena: Pieza[];
  movimiento?: Movimientos;
  interaccion?: Interaccion;
  interfaz?: Interfaz;
  presupuesto?: Presupuesto;
  rubrica?: Rubrica;
  notas?: Nota[];
  /** de dónde sale cada valor: ruta con puntos («camara.planos.0.camara.desde.fov») → fuente */
  origen?: Record<string, Fuente>;
};

/** fov vertical (grados) → distancia focal equivalente en mm, como `getFocalLength` de three (filmGauge de 35 mm sobre el lado largo) */
export const focalMM = (fov: number, filmGauge = 35, aspect = 1.5) => {
  const filmHeight = filmGauge / Math.max(aspect, 1);
  return (0.5 * filmHeight) / Math.tan((fov * Math.PI) / 360);
};
