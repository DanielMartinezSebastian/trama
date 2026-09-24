"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { resolveImage } from "@/lib/ui/placeholder";
import type { ASCII_STYLES } from "./AsciiBackground";
import { renderGlyph } from "./Icon";
import { vcls, type Variant } from "./variants";

export type VideoPlayerProps = {
  /** archivo (.mp4, .webm…), o un enlace de YouTube o Vimeo (se carga bajo demanda, sin cookies hasta pulsar play) */
  src: string;
  /** imagen previa: URL, ruta o `gen:N` (escena de ejemplo generada). En YouTube, si falta, se usa su miniatura */
  poster?: string;
  /** título: se muestra sobre el vídeo antes de empezar y sirve de nombre accesible */
  title?: string;
  /** subtítulos de un archivo: «url|idioma|etiqueta» (formato WebVTT), p. ej. `/subs/es.vtt|es|Español` */
  captions?: string;
  ratio?: "16/9" | "21/9" | "4/3" | "1/1" | "9/16";
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** full = barra completa · minimal = solo play, progreso y pantalla completa · none = sin controles (clic para pausar) */
  controls?: "full" | "minimal" | "none";
  /** segundo en el que empieza */
  startAt?: number;
  /**
   * Modo fondo: rellena su contenedor (que debe tener `position: relative` y tamaño), sin controles, mudo, en bucle y
   * decorativo — igual que los fondos de escena del kit. Se pausa fuera de pantalla y con `prefers-reduced-motion`.
   */
  background?: boolean;
  /** pausa el vídeo cuando sale de pantalla y lo reanuda al volver (por defecto sí) */
  pauseOffscreen?: boolean;
  /** capa de líneas de barrido tipo CRT sobre la imagen */
  scanlines?: boolean;
  /**
   * Convierte el vídeo en tiempo real a caracteres con asciify-engine (Studio) y lo dibuja encima del original, que sigue
   * reproduciéndose debajo — pensado para poder revelarlo más adelante (p. ej. con hover). Necesita que el servidor del
   * vídeo permita CORS (Cloudinary y los archivos del propio sitio lo permiten); si no, se avisa y se muestra el vídeo normal.
   * No aplica a YouTube/Vimeo.
   */
  ascii?: boolean;
  /** estilo del efecto ASCII (los mismos que `AsciiBackground`) */
  asciiStyle?: (typeof ASCII_STYLES)[number];
  /** tamaño de celda del efecto ASCII en px: menos = más detalle y más coste */
  asciiCell?: number;
  /** source = colores del vídeo · accent = monocromo con el acento · gray = grises */
  asciiColor?: "source" | "accent" | "gray";
  /** hover del efecto ASCII (los mismos que `AsciiBackground`): reacciona al puntero sobre el vídeo */
  asciiHover?: "none" | "trail" | "water" | "contour" | "dissolve" | "silk" | "vortex";
  /** 0–1: fuerza del hover ASCII */
  asciiHoverStrength?: number;
  /** 0–1: radio del hover ASCII, relativo al tamaño del vídeo */
  asciiHoverRadius?: number;
  variant?: Variant;
  className?: string;
};

type Embed = {
  kind: "youtube" | "vimeo";
  /** id del vídeo; vacío si el enlace es solo una lista de reproducción de YouTube */
  id: string;
  /** lista de reproducción de YouTube (`list=`) */
  list?: string;
  /** segundo de inicio (`t=` o `start=`) */
  start?: number;
  /** el enlace original, para ofrecer «abrir en YouTube» si el autor no permite incrustarlo */
  url: string;
};

/**
 * Reconoce enlaces de YouTube (watch, youtu.be, shorts, live, embed, playlist, con `list=` y `t=`) y de Vimeo; cualquier
 * otra cosa se trata como un archivo de vídeo.
 */
export function parseEmbed(src: string): Embed | null {
  const url = src.trim();
  const yt = /(?:(?:www\.|m\.|music\.)?youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  const list = /[?&]list=([\w-]+)/.exec(url)?.[1];
  const t = /[?&#](?:t|start)=(\d+)/.exec(url)?.[1];
  const start = t ? parseInt(t, 10) : undefined;
  if (yt) return { kind: "youtube", id: yt[1], list, start, url };
  if (list && /youtube\.com\/playlist/.test(url)) return { kind: "youtube", id: "", list, url };
  const vm = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  if (vm) return { kind: "vimeo", id: vm[1], start, url };
  return null;
}

/**
 * Carátula de un vídeo alojado en Cloudinary: la propia URL con otra extensión y una transformación que extrae un fotograma
 * (`so_` = segundo, `w_` = ancho). Devuelve `undefined` para cualquier otra fuente.
 */
export function cloudinaryPoster(src: string, second = 1, width = 960): string | undefined {
  if (!/res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(src)) return undefined;
  return src.replace("/video/upload/", `/video/upload/so_${second},w_${width}/`).replace(/\.[a-z0-9]+$/i, ".jpg");
}

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};
const SPEEDS = [0.5, 1, 1.25, 1.5, 2];

/** Barra de valor 0..1 con relleno cuadrado, arrastrable y accesible (progreso y volumen comparten esta pieza). */
function Bar({ value, buffered = 0, onChange, label, valueText, step = 0.05, className = "" }: { value: number; buffered?: number; onChange: (v: number) => void; label: string; valueText?: string; step?: number; className?: string }) {
  const drag = useRef(false);
  const set = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };
  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowUp" ? step : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -step : e.key === "Home" ? -1 : e.key === "End" ? 1 : 0;
    if (!d) return;
    e.preventDefault();
    e.stopPropagation(); // que la barra no dispare también los atajos del reproductor
    onChange(Math.min(1, Math.max(0, value + d)));
  };
  return (
    <div
      className={`ui-vid__bar ${className}`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={valueText}
      onPointerDown={(e) => {
        drag.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        set(e);
      }}
      onPointerMove={(e) => drag.current && set(e)}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
      onKeyDown={onKey}
    >
      <span className="ui-vid__bar-buf" style={{ width: `${buffered * 100}%` }} />
      <span className="ui-vid__bar-fill" style={{ width: `${value * 100}%` }} />
      <span className="ui-vid__bar-thumb" style={{ left: `${value * 100}%` }} />
    </div>
  );
}

/** YouTube/Vimeo bajo demanda: hasta pulsar play solo hay una imagen; el iframe (sin cookies) se crea entonces. */
function EmbedFrame({ embed, poster, title }: { embed: Embed; poster?: string; title: string }) {
  const [on, setOn] = useState(false);
  const thumb = poster ? resolveImage(poster) : embed.kind === "youtube" && embed.id ? `https://i.ytimg.com/vi/${embed.id}/hqdefault.jpg` : undefined;
  const q = new URLSearchParams({ autoplay: "1", playsinline: "1" });
  if (embed.start) q.set(embed.kind === "youtube" ? "start" : "t", embed.kind === "youtube" ? String(embed.start) : `${embed.start}s`);
  let url: string;
  if (embed.kind === "youtube") {
    q.set("rel", "0");
    q.set("modestbranding", "1");
    if (embed.list) q.set("list", embed.list);
    // Solo una lista de reproducción: YouTube la sirve como «videoseries»
    url = `https://www.youtube-nocookie.com/embed/${embed.id || "videoseries"}?${q}`;
  } else {
    q.set("dnt", "1");
    url = `https://player.vimeo.com/video/${embed.id}?${q}`;
  }
  const label = embed.kind === "youtube" ? "YouTube" : "Vimeo";
  if (on)
    return (
      <>
        {/* referrerPolicy: YouTube rechaza (error 153) los incrustados sin referer */}
        <iframe className="ui-vid__frame" src={url} title={title} referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        <a className="ui-vid__tag ui-vid__tag--link" href={embed.url} target="_blank" rel="noopener noreferrer">
          Abrir en {label} ↗
        </a>
      </>
    );
  return (
    <button type="button" className="ui-vid__facade" onClick={() => setOn(true)} aria-label={`Reproducir: ${title}`}>
      {thumb && <img src={thumb} alt="" loading="lazy" draggable={false} />}
      <span className="ui-vid__big" aria-hidden>
        {renderGlyph("icon:play", 34)}
      </span>
      <span className="ui-vid__tag">
        {label}
        {embed.list ? " · lista" : ""} · se carga al pulsar
      </span>
    </button>
  );
}

/**
 * Reproductor de vídeo del kit, construido sobre el `<video>` nativo: sin dependencias, con controles propios del estilo
 * (cuadrados, borde duro, acento) y todo lo que una landing necesita — poster, atajos de teclado, arrastre en la barra,
 * velocidad, volumen, subtítulos, imagen en imagen, pantalla completa, pausa fuera de pantalla y modo fondo.
 * Los enlaces de YouTube/Vimeo se cargan con una carátula que solo crea el iframe (sin cookies) al pulsar play.
 *
 * Atajos con el reproductor enfocado: espacio/K play·pausa, ←/→ ±5 s (J/L ±10 s), ↑/↓ volumen, M silencio, F pantalla completa, C subtítulos, 0–9 salta al 0–90 %.
 */
export default function VideoPlayer({ src, poster, title = "Vídeo", captions, ratio = "16/9", autoplay = false, muted = false, loop = false, controls = "full", startAt = 0, background = false, pauseOffscreen = true, scanlines = false, ascii = false, asciiStyle = "ascii", asciiCell = 6, asciiColor = "source", asciiHover = "water", asciiHoverStrength = 0.7, asciiHoverRadius = 0.28, variant = "retro", className = "" }: VideoPlayerProps) {
  const embed = background ? null : parseEmbed(src);
  const asciiHost = useRef<HTMLDivElement>(null);
  const asciiPlayer = useRef<{ update: (s: never) => void; pause: (v?: boolean) => void; redraw: () => void } | null>(null);
  const [asciiFailed, setAsciiFailed] = useState(false);
  const asciiOn = ascii && !embed && !asciiFailed;
  useEffect(() => setAsciiFailed(false), [src, ascii]); // otra fuente o volver a activarlo: se vuelve a intentar
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const autoPaused = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isMuted, setIsMuted] = useState(muted || background || autoplay);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [full, setFull] = useState(false);
  const [idle, setIdle] = useState(false);
  const [capOn, setCapOn] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  const cap = captions?.split("|");
  const bg = background;
  const showControls = !bg && controls !== "none";

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const play = useCallback(() => {
    const v = video.current;
    if (!v) return;
    autoPaused.current = false;
    void v.play().catch(() => {});
  }, []);
  const pause = useCallback(() => video.current?.pause(), []);
  const toggle = useCallback(() => (video.current?.paused ? play() : pause()), [play, pause]);
  const seek = useCallback((t: number) => {
    const v = video.current;
    if (v && isFinite(v.duration)) v.currentTime = Math.min(v.duration, Math.max(0, t));
  }, []);
  const setVol = useCallback((x: number) => {
    const v = video.current;
    if (!v) return;
    v.volume = x;
    v.muted = x === 0;
  }, []);
  const toggleMute = useCallback(() => {
    const v = video.current;
    if (v) v.muted = !v.muted;
  }, []);
  const toggleFull = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  }, []);
  const toggleCap = useCallback(() => {
    const v = video.current;
    const track = v?.textTracks[0];
    if (!track) return;
    const on = track.mode !== "showing";
    track.mode = on ? "showing" : "hidden";
    setCapOn(on);
  }, []);

  // Autoplay / modo fondo: solo si el usuario no pidió menos movimiento, y siempre mudo (política de los navegadores)
  useEffect(() => {
    const v = video.current;
    if (!v || embed) return;
    if ((autoplay || bg) && !reduced) {
      v.muted = true;
      void v.play().catch(() => {});
    } else if (bg && reduced) v.pause();
  }, [autoplay, bg, reduced, embed, src]);

  // Pausa fuera de pantalla: ahorra CPU y batería en landings con varios vídeos
  useEffect(() => {
    const el = wrap.current;
    if (!el || embed || !pauseOffscreen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = video.current;
        if (!v) return;
        if (!e.isIntersecting && !v.paused) {
          autoPaused.current = true;
          v.pause();
        } else if (e.isIntersecting && autoPaused.current && !reduced) {
          autoPaused.current = false;
          void v.play().catch(() => {});
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pauseOffscreen, embed, reduced]);

  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  // Efecto ASCII: asciify-engine Studio toma el propio <video> como fuente y pinta encima. Se monta una vez por vídeo y los
  // ajustes se aplican en caliente (efecto de abajo); se pausa con el vídeo para no gastar CPU en un fotograma que no cambia.
  const asciiSettings = useCallback(
    () => ({
      style: asciiStyle,
      cellSize: asciiCell,
      colorMode: asciiColor,
      ink: (wrap.current && getComputedStyle(wrap.current).getPropertyValue("--acc").trim()) || "#7cc4ff",
      effects: { bloom: 0, scanlines: 0, vignette: 0, grain: 0, glitch: 0 },
      hover: { effect: asciiHover, strength: asciiHoverStrength, radius: asciiHoverRadius },
    }),
    [asciiStyle, asciiCell, asciiColor, asciiHover, asciiHoverStrength, asciiHoverRadius],
  );
  const settingsRef = useRef(asciiSettings);
  settingsRef.current = asciiSettings;
  // El lienzo solo corre si está a la vista y hay algo que animar: el vídeo reproduciéndose o un hover que reaccione al puntero
  const asciiLive = useRef({ visible: true, playing: false, hover: asciiHover });
  asciiLive.current.hover = asciiHover;
  const syncAscii = useCallback(() => {
    const l = asciiLive.current;
    asciiPlayer.current?.pause(!(l.visible && (l.playing || l.hover !== "none")));
  }, []);

  useEffect(() => {
    const host = asciiHost.current;
    const v = video.current;
    if (!asciiOn || !host || !v) return;
    let disposed = false;
    let ro: ResizeObserver | undefined;
    const canvas = document.createElement("canvas");
    canvas.className = "ui-fill-canvas";
    host.appendChild(canvas);

    const start = async () => {
      const { mountStudioMedia, normalizeStudioSettings } = await import("asciify-engine/studio");
      if (disposed) return;
      const media = { source: v, width: v.videoWidth || 640, height: v.videoHeight || 360, duration: v.duration || 0, animated: true, seek: async () => {}, frame: () => v, destroy: () => {} };
      const w = Math.max(2, Math.round(host.clientWidth));
      const h = Math.max(2, Math.round(host.clientHeight));
      const p = mountStudioMedia(canvas, media, {
        settings: normalizeStudioSettings(settingsRef.current() as never),
        width: w,
        height: h,
        fps: 30,
        onError: () => setAsciiFailed(true), // p. ej. lienzo contaminado: el servidor del vídeo no permite CORS
      });
      p.resize(w, h, Math.min(devicePixelRatio || 1, 2));
      asciiPlayer.current = p as never;
      syncAscii();
      ro = new ResizeObserver(() => {
        const rw = Math.round(host.clientWidth);
        const rh = Math.round(host.clientHeight);
        if (rw > 1 && rh > 1) p.resize(rw, rh, Math.min(devicePixelRatio || 1, 2));
      });
      ro.observe(host);
    };
    if (v.readyState >= 1) void start();
    else v.addEventListener("loadedmetadata", () => void start(), { once: true });
    const io = new IntersectionObserver(([e]) => {
      asciiLive.current.visible = e.isIntersecting;
      syncAscii();
    });
    io.observe(host);
    const redraw = () => asciiPlayer.current?.redraw();
    v.addEventListener("seeked", redraw);
    v.addEventListener("loadeddata", redraw);

    return () => {
      disposed = true;
      v.removeEventListener("seeked", redraw);
      v.removeEventListener("loadeddata", redraw);
      ro?.disconnect();
      io.disconnect();
      try {
        (asciiPlayer.current as unknown as { destroy?: () => void } | null)?.destroy?.();
      } catch {
        /* ya liberado */
      }
      asciiPlayer.current = null;
      canvas.remove();
    };
  }, [asciiOn, src, syncAscii]);

  useEffect(() => {
    asciiPlayer.current?.update(settingsRef.current() as never);
  }, [asciiStyle, asciiCell, asciiColor, asciiHover, asciiHoverStrength, asciiHoverRadius]);
  useEffect(() => {
    asciiLive.current.playing = playing;
    syncAscii();
    if (!playing) asciiPlayer.current?.redraw();
  }, [playing, asciiHover, syncAscii]);

  // Controles que se ocultan tras unos segundos sin movimiento mientras se reproduce
  const wake = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 2600);
  }, []);
  useEffect(() => () => clearTimeout(idleTimer.current), []);

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (bg || embed || controls === "none") return;
    const v = video.current;
    if (!v) return;
    const k = e.key.toLowerCase();
    let handled = true;
    if (k === " " || k === "k") toggle();
    else if (k === "arrowleft") seek(v.currentTime - 5);
    else if (k === "arrowright") seek(v.currentTime + 5);
    else if (k === "j") seek(v.currentTime - 10);
    else if (k === "l") seek(v.currentTime + 10);
    else if (k === "arrowup") setVol(Math.min(1, v.volume + 0.1));
    else if (k === "arrowdown") setVol(Math.max(0, v.volume - 0.1));
    else if (k === "m") toggleMute();
    else if (k === "f") toggleFull();
    else if (k === "c") toggleCap();
    else if (/^[0-9]$/.test(k)) seek((v.duration || 0) * (parseInt(k, 10) / 10));
    else handled = false;
    if (handled) {
      e.preventDefault();
      wake();
    }
  };

  const cls = ["ui-vid", bg ? "ui-vid--bg" : `ui-surface ${vcls(variant)}`, playing ? "is-playing" : "", started ? "is-started" : "", idle && playing ? "is-idle" : "", full ? "is-full" : "", failed ? "is-failed" : "", scanlines ? "has-scan" : "", className].filter(Boolean).join(" ");
  const style = { "--vid-ratio": ratio } as CSSProperties;
  const pos = poster ? resolveImage(poster) : undefined;
  const canPip = typeof document !== "undefined" && "pictureInPictureEnabled" in document && document.pictureInPictureEnabled;

  if (embed) {
    return (
      <div className={`${cls} ui-vid--embed`} style={style}>
        <EmbedFrame embed={embed} poster={poster} title={title} />
        {ascii && <span className="ui-vid__tag ui-vid__tag--note">El efecto ASCII no aplica a enlaces de YouTube/Vimeo</span>}
      </div>
    );
  }

  return (
    <div ref={wrap} className={cls} style={style} tabIndex={bg ? -1 : 0} role={bg ? undefined : "group"} aria-label={bg ? undefined : title} aria-hidden={bg ? true : undefined} onKeyDown={onKey} onMouseMove={bg ? undefined : wake} onMouseLeave={() => playing && setIdle(true)}>
      <video
        // Con ASCII el motor lee los píxeles del vídeo, y eso exige CORS; cambiar el atributo obliga a montar de nuevo el elemento
        key={`${src}-${asciiOn}`}
        ref={video}
        className="ui-vid__video"
        crossOrigin={asciiOn ? "anonymous" : undefined}
        src={src}
        poster={pos}
        muted={isMuted}
        loop={loop || bg}
        playsInline
        preload={autoplay || bg ? "auto" : "metadata"}
        onClick={bg || controls === "none" ? undefined : toggle}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          wake();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setIdle(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          if (startAt > 0) e.currentTarget.currentTime = startAt;
          const t = e.currentTarget.textTracks[0];
          if (t) t.mode = "hidden";
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length && v.duration) setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
        }}
        onVolumeChange={(e) => {
          setIsMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
        onRateChange={(e) => setSpeed(e.currentTarget.playbackRate)}
        onError={() => {
          // Con CORS activado un servidor que no lo permite hace fallar la carga: se reintenta sin ASCII antes de dar el error
          if (asciiOn) setAsciiFailed(true);
          else setFailed(true);
        }}
      >
        {cap?.[0] && <track kind="subtitles" src={cap[0]} srcLang={cap[1] || "es"} label={cap[2] || "Subtítulos"} />}
      </video>
      {asciiOn && <div ref={asciiHost} className={`ui-vid__ascii ${asciiHover !== "none" ? "has-hover" : ""}`} aria-hidden onClick={bg || controls === "none" ? undefined : toggle} />}
      {ascii && asciiFailed && !embed && <span className="ui-vid__tag ui-vid__tag--top">ASCII no disponible: el servidor del vídeo no permite CORS</span>}
      {scanlines && <span className="ui-vid__scan" aria-hidden />}

      {failed && (
        <div className="ui-vid__err" role="alert">
          <strong>No se pudo cargar el vídeo</strong>
          <span>{src}</span>
        </div>
      )}

      {!bg && !failed && !started && (
        <button type="button" className="ui-vid__cover" onClick={play} aria-label={`Reproducir: ${title}`}>
          <span className="ui-vid__big" aria-hidden>
            {renderGlyph("icon:play", 34)}
          </span>
          <span className="ui-vid__title">{title}</span>
        </button>
      )}

      {showControls && started && (
        <div className="ui-vid__ctl" role="toolbar" aria-label="Controles del vídeo">
          <button type="button" className="ui-vid__btn" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>
            {renderGlyph(playing ? "icon:pause" : "icon:play", 18)}
          </button>
          <span className="ui-vid__time">
            {fmt(time)}
            {controls === "full" && <> / {fmt(duration)}</>}
          </span>
          <Bar className="ui-vid__seek" value={duration ? time / duration : 0} buffered={buffered} onChange={(r) => seek(r * duration)} label="Progreso" valueText={`${fmt(time)} de ${fmt(duration)}`} step={0.02} />
          {controls === "full" && (
            <>
              <button type="button" className={`ui-vid__btn ${isMuted ? "is-off" : ""}`} onClick={toggleMute} aria-label={isMuted ? "Activar sonido" : "Silenciar"} aria-pressed={isMuted}>
                {renderGlyph("icon:volume", 18)}
              </button>
              <Bar className="ui-vid__vol" value={isMuted ? 0 : volume} onChange={setVol} label="Volumen" step={0.1} />
              <button type="button" className="ui-vid__btn ui-vid__btn--txt" onClick={() => video.current && (video.current.playbackRate = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])} aria-label={`Velocidad ${speed}x`}>
                {speed}x
              </button>
              {cap?.[0] && (
                <button type="button" className={`ui-vid__btn ui-vid__btn--txt ${capOn ? "is-on" : ""}`} onClick={toggleCap} aria-label="Subtítulos" aria-pressed={capOn}>
                  CC
                </button>
              )}
              {canPip && (
                <button type="button" className="ui-vid__btn ui-vid__btn--txt" onClick={() => void (document.pictureInPictureElement ? document.exitPictureInPicture() : video.current?.requestPictureInPicture())} aria-label="Imagen en imagen">
                  PiP
                </button>
              )}
            </>
          )}
          <button type="button" className="ui-vid__btn" onClick={toggleFull} aria-label={full ? "Salir de pantalla completa" : "Pantalla completa"}>
            <svg width="18" height="18" viewBox="0 0 18 18" shapeRendering="crispEdges" fill="currentColor" aria-hidden>
              {full ? <path d="M6 2h2v6H2V6h4V2Zm4 0h2v4h4v2h-6V2ZM2 10h6v6H6v-4H2v-2Zm8 0h6v2h-4v4h-2v-6Z" /> : <path d="M2 2h6v2H4v4H2V2Zm8 0h6v6h-2V4h-4V2ZM2 10h2v4h4v2H2v-6Zm12 0h2v6h-6v-2h4v-4Z" />}
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
