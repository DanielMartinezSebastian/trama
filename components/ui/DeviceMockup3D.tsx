"use client";

import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { deviceGeometry, deviceViewport } from "@/lib/ui/devices";
import { useReducedMotion } from "@/lib/ui/useReducedMotion";
import { useTokens } from "@/lib/ui/useTokens";
import DeviceMockup, { DeviceScreen, deviceVars, useDeviceRotation, type DeviceMockupProps } from "./DeviceMockup";
import { tcls } from "./variants";

// three y react-three-fiber solo se descargan cuando de verdad se va a dibujar en 3D
const DeviceScene = lazy(() => import("@/lib/device3d/scene"));

export type DeviceMockup3DProps = DeviceMockupProps & {
  /**
   * auto = 3D si el equipo puede y no pide reducir movimiento; si no, imagen fija · 3d = siempre 3D (si hay WebGL) ·
   * flat = versión CSS, sin WebGL · static = versión CSS quieta, con `image` en lugar de la web
   */
  render?: "auto" | "3d" | "flat" | "static";
};

let webgl: boolean | null = null;
/** ¿se puede crear un contexto WebGL2? Se comprueba una vez por página */
function hasWebGL(): boolean {
  if (webgl !== null) return webgl;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    webgl = Boolean(gl);
  } catch {
    webgl = false;
  }
  return webgl;
}

/** equipo modesto o que pide ahorrar datos: poca memoria, pocos núcleos o `Save-Data` */
function lowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return Boolean(nav.connection?.saveData) || (nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2;
}

/** si el lienzo falla (sin WebGL, contexto perdido al crear), se cae a la versión CSS */
class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * `DeviceMockup` con volumen: la carcasa es un modelo three.js generado (canto, cristal, reflejos, sombra) y la pantalla sigue
 * siendo DOM real —web en vivo, captura, vídeo o React— colocado en 3D. Mismas props que `DeviceMockup`, más `render`.
 * Mientras carga, y siempre que el equipo no pueda o pida reducir movimiento, pinta la versión CSS en la misma caja.
 *
 * Requiere `three` y `@react-three/fiber` (dependencias opcionales del paquete): se importa por subruta, `trama-ui/DeviceMockup3D`.
 */
export default function DeviceMockup3D({ render = "auto", ...props }: DeviceMockup3DProps) {
  const { device = "phone", platform = "ios", orientation = "portrait", rotatable = false, rotateLabel = "Girar el dispositivo", url, image, video, children, alt = "", urlLabel, imageScroll = "hover", interactive = false, viewportWidth = 0, safeArea = false, systemNav = false, tone = "mut", rotateX = 0, rotateY = 0, motion = "float", speed = 1, shadow = true, glare = true, shine = 1, still = false, live = true, className = "" } = props;
  const root = useRef<HTMLDivElement>(null);
  const tokens = useTokens(root);
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [screenEl, setScreenEl] = useState<HTMLElement | null>(null);
  const [cssHost, setCssHost] = useState<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rotation = useDeviceRotation(device, orientation, rotatable, rotateLabel);
  const geo = deviceGeometry(device, rotation.orient, platform);
  const vp = deviceViewport(geo, viewportWidth, safeArea, systemNav);
  const want3d = render === "3d" || (render === "auto" && !reduced);
  const use3d = want3d && capable !== false && !failed;

  useEffect(() => {
    if (!want3d) return;
    setCapable(hasWebGL() && (render === "3d" || !lowPower()));
    const el = document.createElement("div");
    el.className = "ui-device__screen3d";
    setScreenEl(el);
  }, [want3d, render]);

  // la pantalla mide lo que el viewport simulado; la escena la escala hasta el hueco del modelo
  useEffect(() => {
    if (!screenEl) return;
    screenEl.style.width = `${vp.vw}px`;
    screenEl.style.height = `${vp.vh + vp.bar}px`;
    screenEl.style.borderRadius = `${geo.face.r * vp.s}px`;
  }, [screenEl, vp.vw, vp.vh, vp.bar, vp.s, geo.face.r]);

  // el lienzo se crea al acercarse a la pantalla y deja de dibujar al alejarse
  useEffect(() => {
    const el = root.current;
    if (!el || !use3d) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [use3d]);

  if (!use3d) return <DeviceMockup {...props} still={still || render !== "flat" && render !== "3d"} />;

  const quiet = still || reduced;
  const bodyColor = tokens ? `color-mix(in oklab, ${tokens[`--${tone}`]} 38%, ${tokens["--bg"]})` : "#3a3f4b";

  return (
    <div ref={root} className={`ui-device ui-device--3d ${tcls(tone)} ${className}`} style={deviceVars(geo, vp, speed)} role={alt && !interactive && !rotation.can ? "img" : alt ? "group" : undefined} aria-label={alt || undefined}>
      {/* reserva con la misma caja y la misma pose: se ve mientras llegan three y el primer fotograma */}
      {!ready && <DeviceMockup {...props} orientation={rotation.orient} rotatable={false} alt="" live={false} motion="none" className="" />}
      {mounted && screenEl && (
        <div className={`ui-device__box${ready ? "" : " is-loading"}`} style={{ aspectRatio: `${geo.tw} / ${geo.th}` }}>
          <div className="ui-device__css3d" ref={setCssHost} />
          <div className="ui-device__gl" aria-hidden>
            {cssHost && (
              <Boundary onError={() => setFailed(true)}>
                <Suspense fallback={null}>
                  <DeviceScene device={device} geo={geo} vp={vp} bodyColor={bodyColor} rotateX={rotateX} rotateY={rotateY} motion={quiet ? "none" : motion} speed={speed} shadow={shadow} glare={glare} shine={Math.max(0, shine)} active={near} screenEl={screenEl} cssHost={cssHost} root={root} onReady={() => setReady(true)} />
                </Suspense>
              </Boundary>
            )}
          </div>
        </div>
      )}
      {mounted &&
        screenEl &&
        createPortal(
          <DeviceScreen url={url} image={image} video={video} alt={alt} urlLabel={urlLabel} imageScroll={imageScroll} interactive={interactive} live={live} vp={vp} quiet={quiet} preferImage={still}>
            {children}
          </DeviceScreen>,
          screenEl,
        )}
      {rotation.button}
    </div>
  );
}
