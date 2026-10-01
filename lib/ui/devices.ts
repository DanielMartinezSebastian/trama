/**
 * Geometría de los dispositivos de `DeviceMockup` / `DeviceMockup3D`. Todo en «píxeles de dispositivo»: la pantalla mide lo
 * que su viewport CSS (un móvil, 390 × 844) y el resto de la carcasa se da en esa misma unidad, con el origen arriba a la
 * izquierda de la caja total. La versión CSS lo pasa a porcentajes y la 3D lo usa como unidades de escena, así las dos
 * dibujan exactamente el mismo aparato y se pueden intercambiar sin salto de layout.
 */

export const DEVICES = ["phone", "tablet", "laptop", "desktop", "browser"] as const;
export type DeviceKind = (typeof DEVICES)[number];
export type DeviceOrientation = "portrait" | "landscape";
export const DEVICE_PLATFORMS = ["ios", "android"] as const;
/** aspecto del móvil: ios = isla alargada y esquinas muy redondas · android = cámara redonda y esquinas más cerradas */
export type DevicePlatform = (typeof DEVICE_PLATFORMS)[number];

/** rectángulo redondeado en la caja del dispositivo (y hacia abajo) */
export type DeviceRect = { x: number; y: number; w: number; h: number; r: number };

export type DeviceGeometry = {
  /** caja total (carcasa + base o peana) */
  tw: number;
  th: number;
  /** carcasa que rodea la pantalla (la tapa en un portátil) */
  frame: DeviceRect;
  /** cara visible: la pantalla (en `browser` incluye la barra de direcciones) */
  face: DeviceRect;
  /** viewport CSS por defecto que simula la pantalla */
  screen: { w: number; h: number };
  /** alto de la barra del navegador dentro de `face` (0 si no la hay) */
  bar: number;
  /** grosor del aro de la carcasa alrededor del cristal */
  ring: number;
  /** grosor del aparato (solo 3D) */
  depth: number;
  /** zona de la pantalla que tapa la isla, medida desde el borde (arriba en vertical, a la izquierda en horizontal); 0 si no hay */
  safe: { top: number; left: number };
  /**
   * navegación del sistema (móvil y tablet): ios = indicador de inicio abajo · android = tres botones, abajo o, con el móvil en
   * horizontal, a la derecha. Tamaño de la franja que ocupa, 0 si el aparato no la tiene
   */
  nav: { kind: "ios" | "android"; bottom: number; right: number };
  /** isla o cámara frontal */
  notch: (DeviceRect & { kind: "island" | "hole" | "dot" }) | null;
  /** piezas extra en 2D: base del portátil, cuello y pie del monitor */
  parts: DeviceRect[];
  /** ancho máximo por defecto en la página, en px CSS (se cambia con `--device-max`) */
  maxWidth: number;
};

/** Campo de visión de la cámara 3D y margen del lienzo alrededor de la caja: la perspectiva CSS usa la misma distancia. */
export const DEVICE_FOV = 30;
export const DEVICE_MARGIN = 1.3;
/** distancia de la cámara (px de dispositivo) a la que la caja ocupa 1 / DEVICE_MARGIN del alto del lienzo */
export const cameraDistance = (geo: DeviceGeometry) => (DEVICE_MARGIN * geo.th) / (2 * Math.tan((DEVICE_FOV * Math.PI) / 360));

export function deviceGeometry(device: DeviceKind, orientation: DeviceOrientation = "portrait", platform: DevicePlatform = "ios"): DeviceGeometry {
  const land = orientation === "landscape";
  if (device === "phone" || device === "tablet") {
    const phone = device === "phone";
    const android = phone && platform === "android";
    const [pw, ph] = android ? [412, 915] : phone ? [390, 844] : [820, 1180];
    const [w, h] = land ? [ph, pw] : [pw, ph];
    const b = phone ? 12 : 30;
    const tw = w + b * 2;
    const th = h + b * 2;
    // la isla (móvil) va dentro de la pantalla; la cámara (tablet), en el marco. En horizontal, las dos pasan al lado izquierdo
    const along = android ? 24 : phone ? 100 : 10;
    const across = android ? 24 : phone ? 28 : 10;
    // separación entre el borde de la pantalla y la isla; el área segura deja la misma por debajo, así la isla queda centrada en la franja
    const gap = 12;
    const off = phone ? b + gap : (b - across) / 2;
    const band = phone ? gap * 2 + across : 0;
    const notch = land
      ? { x: off, y: (th - along) / 2, w: across, h: along, r: across / 2 }
      : { x: (tw - along) / 2, y: off, w: along, h: across, r: across / 2 };
    return {
      tw,
      th,
      frame: { x: 0, y: 0, w: tw, h: th, r: android ? 50 : phone ? 62 : 54 },
      face: { x: b, y: b, w, h, r: android ? 38 : phone ? 50 : 24 },
      screen: { w, h },
      bar: 0,
      ring: 4,
      depth: phone ? 40 : 30,
      safe: { top: land ? 0 : band, left: land ? band : 0 },
      nav: platform === "android" ? { kind: "android", bottom: phone && land ? 0 : 48, right: phone && land ? 48 : 0 } : { kind: "ios", bottom: land ? 22 : 34, right: 0 },
      notch: { ...notch, kind: android ? "hole" : phone ? "island" : "dot" },
      parts: [],
      maxWidth: phone ? (land ? 620 : android ? 310 : 300) : land ? 680 : 460,
    };
  }
  if (device === "laptop") {
    const lid = { x: 100, y: 0, w: 1480, h: 960, r: 22 };
    return {
      tw: 1680,
      th: 996,
      frame: lid,
      face: { x: 120, y: 26, w: 1440, h: 900, r: 6 },
      screen: { w: 1440, h: 900 },
      bar: 0,
      ring: 3,
      depth: 16,
      safe: { top: 0, left: 0 },
      nav: { kind: "ios", bottom: 0, right: 0 },
      notch: { kind: "dot", x: 835, y: 8, w: 10, h: 10, r: 5 },
      parts: [{ x: 0, y: 960, w: 1680, h: 36, r: 18 }],
      maxWidth: 860,
    };
  }
  if (device === "desktop") {
    return {
      tw: 1968,
      th: 1368,
      frame: { x: 0, y: 0, w: 1968, h: 1128, r: 22 },
      face: { x: 24, y: 24, w: 1920, h: 1080, r: 6 },
      screen: { w: 1920, h: 1080 },
      bar: 0,
      ring: 3,
      depth: 40,
      safe: { top: 0, left: 0 },
      nav: { kind: "ios", bottom: 0, right: 0 },
      notch: null,
      parts: [
        { x: 844, y: 1128, w: 280, h: 212, r: 0 },
        { x: 644, y: 1338, w: 680, h: 30, r: 15 },
      ],
      maxWidth: 900,
    };
  }
  return {
    tw: 1280,
    th: 848,
    frame: { x: 0, y: 0, w: 1280, h: 848, r: 14 },
    face: { x: 0, y: 0, w: 1280, h: 848, r: 14 },
    screen: { w: 1280, h: 800 },
    bar: 48,
    ring: 0,
    depth: 10,
    safe: { top: 0, left: 0 },
    nav: { kind: "ios", bottom: 0, right: 0 },
    notch: null,
    parts: [],
    maxWidth: 900,
  };
}

export const DEVICE_POINTER_SIDES = ["both", "left", "right"] as const;
/** hacia qué lado puede girar el aparato al seguir al puntero */
export type DevicePointerSide = (typeof DEVICE_POINTER_SIDES)[number];

/**
 * Posición horizontal del puntero (−1 izquierda … 1 derecha) tras aplicar `pointerSide`: con `left` el aparato solo gira
 * cuando el puntero está a su izquierda (a la derecha se queda de frente), y con `right`, al revés.
 */
export const pointerSideClamp = (x: number, side: DevicePointerSide) => (side === "left" ? Math.min(0, x) : side === "right" ? Math.max(0, x) : x);

export type DeviceViewport = {
  /** viewport CSS simulado */
  vw: number;
  vh: number;
  /** alto de la barra del navegador en px de ese viewport */
  bar: number;
  /** px de viewport por px de dispositivo (1 = el viewport propio del aparato) */
  s: number;
  /** franja reservada bajo la isla, en px de viewport (0 sin `safeArea`): la página ocupa el resto */
  safeTop: number;
  safeLeft: number;
  /** franja de la navegación del sistema, en px de viewport (0 sin `systemNav`) */
  navBottom: number;
  navRight: number;
  navKind: "ios" | "android";
};

/**
 * Viewport que simula la pantalla: el del dispositivo o, con `viewportWidth` > 0, ese ancho con la misma proporción.
 * Con `safeArea`, la franja de la isla queda fuera de la página (como el área segura de un móvil real); con `systemNav`,
 * también la de la navegación del sistema.
 */
export function deviceViewport(geo: DeviceGeometry, viewportWidth = 0, safeArea = false, systemNav = false): DeviceViewport {
  const vw = viewportWidth > 0 ? viewportWidth : geo.screen.w;
  const s = vw / geo.screen.w;
  const on = (flag: boolean, n: number) => (flag ? n * s : 0);
  return { vw, vh: geo.screen.h * s, bar: geo.bar * s, s, safeTop: on(safeArea, geo.safe.top), safeLeft: on(safeArea, geo.safe.left), navBottom: on(systemNav, geo.nav.bottom), navRight: on(systemNav, geo.nav.right), navKind: geo.nav.kind };
}
