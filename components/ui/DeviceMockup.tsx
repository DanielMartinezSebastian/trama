"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cameraDistance, deviceGeometry, deviceViewport, pointerSideClamp, type DevicePointerSide, type DeviceGeometry, type DeviceKind, type DeviceOrientation, type DevicePlatform, type DeviceRect, type DeviceViewport } from "@/lib/ui/devices";
import { resolveImage } from "@/lib/ui/placeholder";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { tcls, type Tone } from "./variants";

export const DEVICE_MOTIONS = ["none", "float", "sway", "spin", "pointer"] as const;

export type DeviceMockupProps = {
  /** phone = móvil · tablet · laptop = portátil · desktop = monitor con peana · browser = ventana de navegador */
  device?: DeviceKind;
  /** aspecto del móvil: ios = isla alargada (iPhone, 390 × 844) · android = cámara frontal redonda (412 × 915) */
  platform?: DevicePlatform;
  /** solo móvil y tablet: orientación inicial */
  orientation?: DeviceOrientation;
  /** móvil y tablet: muestra bajo el aparato un botón para que el visitante lo gire entre vertical y horizontal */
  rotatable?: boolean;
  /** nombre accesible (y título) del botón de girar */
  rotateLabel?: string;
  /** web real en un iframe, a tamaño de viewport del dispositivo. La web debe permitir incrustarse (sin `X-Frame-Options: DENY`) */
  url?: string;
  /** captura: URL, ruta o `gen:N`. Sola, es el contenido; junto a `url` o `video`, es la imagen previa y la del modo estático */
  image?: string;
  /** vídeo (.mp4, .webm): mudo, en bucle y sin controles, como una grabación de pantalla */
  video?: string;
  /** contenido React dentro de la pantalla, maquetado al ancho del viewport simulado */
  children?: ReactNode;
  /** descripción para lectores de pantalla (y título del iframe). Vacío = decorativo */
  alt?: string;
  /** texto de la barra de direcciones de `browser`; sin él se usa el dominio de `url`. "" con `url` vacío la deja en blanco */
  urlLabel?: string;
  /** capturas más altas que la pantalla: hover (por defecto) = recorre la página al pasar el puntero · auto = sube y baja sola · none = recortada arriba */
  imageScroll?: "none" | "hover" | "auto";
  /** deja usar el contenido (scroll, clics, foco). Por defecto no: una vista previa no debe atrapar el scroll de la página */
  interactive?: boolean;
  /** ancho del viewport simulado en px (0 = el propio del dispositivo: 390, 820, 1440, 1920, 1280). El alto guarda la proporción */
  viewportWidth?: number;
  /**
   * reserva la franja de la isla del móvil (arriba; a la izquierda en horizontal) y pinta la web debajo, como el área segura
   * de un teléfono real: úsalo si la isla tapa el menú o la cabecera. La franja toma el color `--device-safe` (negro por defecto)
   */
  safeArea?: boolean;
  /**
   * móvil y tablet: pinta la navegación del sistema y deja la web por encima. Con `platform="ios"`, el indicador de inicio;
   * con `android`, los tres botones (atrás, inicio, recientes), que pasan a la derecha con el móvil en horizontal
   */
  systemNav?: boolean;
  /** token del que sale el color de la carcasa (mezclado con `--bg`) */
  tone?: Tone;
  /** inclinación en grados (0 = de frente): positivo = visto desde arriba */
  rotateX?: number;
  /** giro en grados (0 = de frente): negativo = el lado derecho se acerca */
  rotateY?: number;
  /** float = flota · sway = se balancea · spin = gira sobre sí mismo (en CSS, balanceo amplio) · pointer = sigue al puntero */
  motion?: (typeof DEVICE_MOTIONS)[number];
  /** con `motion="pointer"`: grados máximos de giro horizontal al seguir al puntero (0 = no gira a los lados) */
  pointerX?: number;
  /** con `motion="pointer"`: grados máximos de inclinación vertical al seguir al puntero (0 = no se inclina arriba ni abajo) */
  pointerY?: number;
  /** con `motion="pointer"`: lado hacia el que puede girar. left = solo cuando el puntero está a su izquierda · right = solo a su derecha */
  pointerSide?: DevicePointerSide;
  /** multiplicador de la velocidad del movimiento y del recorrido de la captura (1 = normal) */
  speed?: number;
  shadow?: boolean;
  /** reflejo del cristal sobre la pantalla */
  glare?: boolean;
  /** intensidad de brillos y reflejos (0 = mate, 1 = normal, hasta 2): en 3D, los de la carcasa, que cambian al moverse el aparato; y, si no se pasa `screenShine`, también el reflejo del cristal */
  shine?: number;
  /** intensidad del reflejo del cristal sobre la pantalla (0–2), aparte de la carcasa. Sin él, sigue a `shine` */
  screenShine?: number;
  /** imagen fija: sin movimiento y, si hay `image`, se muestra en lugar de la web o el vídeo */
  still?: boolean;
  /** false = no carga la web ni el vídeo: solo `image` (o la pantalla apagada) */
  live?: boolean;
  className?: string;
};

type ScreenProps = Pick<DeviceMockupProps, "url" | "image" | "video" | "children" | "alt" | "urlLabel" | "imageScroll" | "interactive" | "live"> & {
  vp: DeviceViewport;
  /** sin recorrido de captura ni autoplay */
  quiet: boolean;
  /** la imagen sustituye a la web o al vídeo */
  preferImage: boolean;
};

const hostOf = (url: string) => url.replace(/^[a-z]+:\/\//i, "").replace(/\/$/, "");

/**
 * Lo que se ve en la pantalla (y la barra de `browser`), maquetado a tamaño real de viewport: quien lo monta lo escala.
 * Lo comparten la versión CSS y la 3D, que lo coloca con CSS 3D detrás del lienzo.
 */
export function DeviceScreen({ url = "", image = "", video = "", children, alt = "", urlLabel, imageScroll = "hover", interactive = false, live = true, vp, quiet, preferImage }: ScreenProps) {
  const [loaded, setLoaded] = useState(false);
  const shot = useRef<HTMLImageElement>(null);
  const img = image ? resolveImage(image) : "";
  const hasLive = Boolean(url || video || children);
  const onlyImage = Boolean(img) && (!hasLive || preferImage || !live);
  const scroll = imageScroll !== "none" && !quiet ? ` ui-device__img--scroll is-${imageScroll}` : "";
  const label = urlLabel ?? hostOf(url);
  // el nombre accesible lo lleva la raíz (role="img"); dentro, la imagen es decorativa
  const scrolls = onlyImage && scroll !== "";
  const picture = img ? <img ref={shot} className={`ui-device__img${scrolls ? scroll : ""}`} src={img} alt="" draggable={false} /> : null;

  // Recorrido de la captura: cuánto sobresale de la pantalla, medido en px de viewport. Solo se anima `transform` (un
  // `top` a la vez iría por otro hilo y la imagen temblaría); si la captura cabe entera, el recorrido es 0 y no se mueve.
  useEffect(() => {
    const el = shot.current;
    const page = el?.parentElement;
    if (!el || !page || !scrolls) return;
    const measure = () => {
      const shift = Math.max(0, el.offsetHeight - page.clientHeight);
      el.style.setProperty("--dv-shift", `${shift}px`);
      el.style.setProperty("--dv-pages", (shift / Math.max(1, page.clientHeight)).toFixed(3));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(page);
    return () => ro.disconnect();
  }, [scrolls, img]);

  return (
    <div className="ui-device__scaled" style={{ width: vp.vw, height: vp.vh + vp.bar, fontSize: 16 * vp.s, paddingTop: vp.safeTop, paddingLeft: vp.safeLeft, paddingRight: vp.navRight }}>
      {vp.bar > 0 && (
        <div className="ui-device__bar" style={{ height: vp.bar }} aria-hidden>
          <i />
          <i />
          <i />
          <span className="ui-device__url">{label}</span>
        </div>
      )}
      <div className="ui-device__page" style={{ height: vp.vh - vp.safeTop - vp.navBottom }} inert={!interactive}>
        {onlyImage ? (
          picture
        ) : url ? (
          live && (
            <>
              {!loaded && picture}
              <iframe className={`ui-device__frame-el${loaded ? " is-loaded" : ""}`} src={url} title={alt || label} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" tabIndex={interactive ? 0 : -1} onLoad={() => setLoaded(true)} />
            </>
          )
        ) : video ? (
          live && <video className="ui-device__video" src={video} poster={img || undefined} muted loop playsInline autoPlay={!quiet} preload={quiet ? "none" : "metadata"} />
        ) : (
          children
        )}
      </div>
      {vp.navBottom + vp.navRight > 0 && (
        <div className={`ui-device__nav ui-device__nav--${vp.navKind}${vp.navRight ? " is-side" : ""}`} style={vp.navRight ? { width: vp.navRight } : { height: vp.navBottom }} aria-hidden>
          {vp.navKind === "ios" ? (
            <i />
          ) : (
            <>
              <svg viewBox="0 0 24 24"><path d="M16 5 7 12l9 7z" /></svg>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5" /></svg>
              <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Orientación en uso y botón de girar (móvil y tablet con `rotatable`). El botón va fuera del dibujo, debajo, para no tapar
 * la pantalla; lo comparten la versión CSS y la 3D.
 */
export function useDeviceRotation(device: DeviceKind, orientation: DeviceOrientation, rotatable: boolean, rotateLabel: string) {
  const [flipped, setFlipped] = useState(false);
  const can = rotatable && (device === "phone" || device === "tablet");
  const orient: DeviceOrientation = can && flipped ? (orientation === "portrait" ? "landscape" : "portrait") : orientation;
  const button = can ? (
    <button type="button" className="ui-device__rotate" aria-label={rotateLabel} title={rotateLabel} aria-pressed={flipped} onClick={() => setFlipped((f) => !f)}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
        <rect x="8" y="3" width="8" height="14" rx="1.5" transform="rotate(-25 12 10)" />
        <path d="M4 17a9 9 0 0 0 14 3M18 20v-3.5M18 20h-3.5" />
      </svg>
    </button>
  ) : null;
  return { orient, button, can };
}

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

/** rectángulo de la geometría → posición absoluta en porcentajes de la caja total */
export const rectStyle = (r: DeviceRect, geo: DeviceGeometry, flatTop = false): CSSProperties => {
  const rx = pct(r.r, r.w);
  const ry = pct(r.r, r.h);
  return { left: pct(r.x, geo.tw), top: pct(r.y, geo.th), width: pct(r.w, geo.tw), height: pct(r.h, geo.th), borderRadius: flatTop ? `0 0 ${rx} ${rx} / 0 0 ${ry} ${ry}` : `${rx} / ${ry}` };
};

/** variables comunes a la versión CSS y a la 3D: ancho máximo, escala inicial y tamaño del viewport */
export const deviceVars = (geo: DeviceGeometry, vp: DeviceViewport, speed: number) =>
  ({
    "--dv-max": `${geo.maxWidth}px`,
    // hasta que el ResizeObserver mida, se supone el ancho máximo: es lo habitual y evita el salto al hidratar
    "--dv-g": geo.maxWidth / geo.tw,
    "--dv-s": vp.s,
    "--dv-ring": geo.ring,
    "--dv-scroll": `${(vp.vh / 120 / Math.max(0.1, speed)).toFixed(2)}s`,
  }) as CSSProperties;

/**
 * Vista previa de una web dentro de un dispositivo dibujado con CSS: móvil, tablet, portátil, monitor o ventana de navegador.
 * La pantalla simula el viewport real del aparato (un móvil mide 390 px de ancho aunque el mockup se pinte a 240) y admite
 * una web en vivo (`url`), una captura (`image`), un vídeo o contenido React. Ocupa el ancho de su contenedor hasta
 * `--device-max`. Sin WebGL: para la versión con volumen y luz, `DeviceMockup3D`, que usa esta de reserva.
 */
export default function DeviceMockup({ device = "phone", platform = "ios", orientation = "portrait", rotatable = false, rotateLabel = "Girar el dispositivo", url, image, video, children, alt = "", urlLabel, imageScroll = "hover", interactive = false, viewportWidth = 0, safeArea = false, systemNav = false, tone = "mut", rotateX = 0, rotateY = 0, motion = "float", pointerX = 16, pointerY = 10, pointerSide = "both", speed = 1, shadow = true, glare = true, shine = 1, screenShine, still = false, live = true, className = "" }: DeviceMockupProps) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rotation = useDeviceRotation(device, orientation, rotatable, rotateLabel);
  const geo = deviceGeometry(device, rotation.orient, platform);
  const vp = deviceViewport(geo, viewportWidth, safeArea, systemNav);
  const quiet = still || reduced;
  const move = quiet ? "none" : motion;

  // escala real: px de página por px de dispositivo. De ella salen el tamaño del contenido, los bordes y la perspectiva
  useEffect(() => {
    const el = body.current;
    const rootEl = root.current;
    if (!el || !rootEl) return;
    const ro = new ResizeObserver(() => rootEl.style.setProperty("--dv-g", String(el.clientWidth / geo.tw)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [geo.tw]);

  useEffect(() => {
    const el = root.current;
    if (!el || move !== "pointer" || matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      el.style.setProperty("--dv-px", pointerSideClamp(clamp((e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)), pointerSide).toFixed(3));
      el.style.setProperty("--dv-py", clamp((e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)).toFixed(3));
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      el.style.removeProperty("--dv-px");
      el.style.removeProperty("--dv-py");
    };
  }, [move, pointerSide]);

  const style = { ...deviceVars(geo, vp, speed), "--dv-p": cameraDistance(geo), "--dv-rx": `${rotateX}deg`, "--dv-ry": `${rotateY}deg`, "--dv-speed": Math.max(0.1, speed), "--dv-shine": Math.max(0, screenShine ?? shine), "--dv-pmx": `${pointerX}deg`, "--dv-pmy": `${pointerY}deg` } as CSSProperties;

  return (
    <div ref={root} className={`ui-device ui-device--${device} ui-device--${move} ${tcls(tone)} ${className}`} style={style} role={alt && !interactive && !rotation.can ? "img" : alt ? "group" : undefined} aria-label={alt || undefined}>
      <div ref={body} className="ui-device__body" style={{ aspectRatio: `${geo.tw} / ${geo.th}` }}>
        {shadow && <span className="ui-device__shadow" aria-hidden />}
        {geo.parts.map((p, i) => (
          <span key={i} className="ui-device__part" style={rectStyle(p, geo, device === "laptop")} aria-hidden />
        ))}
        <div className="ui-device__frame" style={rectStyle(geo.frame, geo)} aria-hidden />
        <div className="ui-device__face" style={rectStyle(geo.face, geo)}>
          <DeviceScreen url={url} image={image} video={video} alt={alt} urlLabel={urlLabel} imageScroll={imageScroll} interactive={interactive} live={live} vp={vp} quiet={quiet} preferImage={still}>
            {children}
          </DeviceScreen>
          {glare && <span className="ui-device__glare" aria-hidden />}
        </div>
        {geo.notch && <span className={`ui-device__notch ui-device__notch--${geo.notch.kind}`} style={rectStyle(geo.notch, geo)} aria-hidden />}
      </div>
      {rotation.button}
    </div>
  );
}
