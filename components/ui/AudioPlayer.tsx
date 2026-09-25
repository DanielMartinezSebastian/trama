"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { createEngine, formatTime, parseTime, type AudioEngine } from "@/lib/ui/audio";
import { resolveImage } from "@/lib/ui/placeholder";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";
import { useTokens } from "@/lib/ui/useTokens";
import { renderGlyph } from "./Icon";
import { vcls, type Variant } from "./variants";

export type AudioPlayerProps = {
  /**
   * Pistas, una por línea: `Título|Artista|src|duración|portada`. `src` es la URL de un archivo (mp3, ogg…) o
   * `synth:estilo:bpm:semilla` para música generada en el navegador (estilos `hardtechno`, `techno`, `ambient`). La duración
   * («3:12») es obligatoria para las sintetizadas; la portada (URL o `gen:N`), opcional.
   */
  tracks?: string;
  /** full = tarjeta con visualizador y lista · bar = barra horizontal · minimal = botón, título y una línea de progreso */
  layout?: "full" | "bar" | "minimal";
  /** dibujo del sonido: barras de frecuencia · onda · puntos en matriz · ninguno */
  visualizer?: "bars" | "wave" | "dots" | "none";
  /** lista de pistas debajo (en `full` y `bar`) */
  showPlaylist?: boolean;
  /** pista inicial (0 = la primera) */
  defaultTrack?: number;
  /** off = se para al terminar · all = pasa a la siguiente y vuelve a empezar · one = repite la pista */
  repeat?: "off" | "all" | "one";
  /** 0–1 */
  defaultVolume?: number;
  /** pista elegida desde fuera (p. ej. una lista de discos de la página); junto con `playKey`, la carga y la reproduce */
  track?: number;
  /** cambia su valor (un contador) para reproducir `track` desde un clic fuera del reproductor */
  playKey?: number;
  /** al cambiar de pista */
  onTrackChange?: (index: number) => void;
  /**
   * mini reproductor fijo cuando el reproductor sale de la pantalla (una vez que ha sonado): pausa, silencio, pista siguiente
   * y progreso siempre a mano. `bottom`/`top` = barra de lado a lado · `bottom-left`/`bottom-right` = píldora en la esquina
   */
  dock?: "none" | "bottom" | "top" | "bottom-left" | "bottom-right";
  /** separación en px del borde de la pantalla (p. ej. para no tapar una barra fija de la página) */
  dockOffset?: number;
  /** clase extra para el dock (vive en `document.body`, fuera del contenedor de la página) */
  dockClassName?: string;
  /**
   * el dock se puede arrastrar con un asa y soltar en cualquier punto de la pantalla (se vuelve una píldora flotante).
   * La posición se recuerda en este navegador; con el asa enfocada, flechas para moverlo y doble clic o Supr para devolverlo
   */
  dockDraggable?: boolean;
  /** visualizador mini del dock (por defecto, el mismo que el reproductor; barras si este no tiene) */
  dockVisualizer?: "bars" | "wave" | "dots" | "none";
  variant?: Variant;
  className?: string;
};

const DOCK_KEY = "trama-audio-dock";

type Track = { title: string; artist: string; src: string; duration: number; cover?: string };

const DEFAULT_TRACKS =
  "Mar de fondo|Maré Surf Club|synth:ambient:80:2|1:40\nSerie grande|Maré Surf Club|synth:techno:124:5|2:10\nMarea viva|Maré Surf Club|synth:hardtechno:150:7|2:30";

function parseTracks(s: string): Track[] {
  return s
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((r) => r[0] && r[2])
    .map(([title, artist = "", src, dur = "", cover = ""]) => ({ title, artist, src, duration: parseTime(dur), cover: cover || undefined }));
}

/**
 * Reproductor de música con lista, visualizador y teclado. Reproduce archivos reales o música sintetizada en el navegador
 * (`synth:…`, para demos sin archivos). Los colores del visualizador salen de los tokens del tema; el resto, de la variante.
 * Se integra con los controles multimedia del sistema (Media Session) cuando está sonando.
 */
export default function AudioPlayer({
  tracks = DEFAULT_TRACKS,
  layout = "full",
  visualizer = "bars",
  showPlaylist = true,
  defaultTrack = 0,
  repeat: repeatProp = "all",
  defaultVolume = 0.8,
  track: trackProp,
  playKey,
  onTrackChange,
  dock = "none",
  dockOffset = 0,
  dockClassName = "",
  dockDraggable = false,
  dockVisualizer,
  variant = "glass",
  className = "",
}: AudioPlayerProps) {
  const list = useMemo(() => parseTracks(tracks), [tracks]);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const dockCanvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<AudioEngine | null>(null);
  const tokens = useTokens(root);
  const [index, setIndex] = useState(() => Math.min(Math.max(0, trackProp ?? defaultTrack), Math.max(0, list.length - 1)));
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(defaultVolume);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState(repeatProp);
  const [error, setError] = useState("");
  const wantPlay = useRef(false);
  // dock: visible si el reproductor está fuera de la pantalla, ya ha sonado y no se ha cerrado
  const [offscreen, setOffscreen] = useState(false);
  const [started, setStarted] = useState(false);
  const [dockClosed, setDockClosed] = useState(false);
  const [dockStyle, setDockStyle] = useState<CSSProperties>({});
  useEffect(() => {
    if (playing) {
      setStarted(true);
      setDockClosed(false);
    }
  }, [playing]);
  useEffect(() => {
    const el = root.current;
    if (!el || dock === "none") return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [dock]);
  const docked = dock !== "none" && offscreen && started && !dockClosed;
  const dockViz = dockVisualizer ?? (visualizer === "none" ? "bars" : visualizer);
  useEffect(() => {
    if (docked && root.current) setDockStyle(themeSnapshot(root.current));
  }, [docked, tokens]);

  // dock arrastrable: posición libre (px desde arriba a la izquierda) o null = la de `dock`
  const dockEl = useRef<HTMLDivElement>(null);
  const [free, setFree] = useState<{ x: number; y: number } | null>(null);
  const grab = useRef<{ dx: number; dy: number; sx: number; sy: number; moved: boolean } | null>(null);
  const clampPos = useCallback((x: number, y: number) => {
    const el = dockEl.current;
    // si aún es la barra de lado a lado, se mide como la píldora que va a ser
    const w = Math.min(el?.offsetWidth ?? 320, el?.classList.contains("ui-audio-dock--free") ? Infinity : 460);
    const h = el?.offsetHeight ?? 48;
    const m = 8;
    return { x: Math.round(Math.min(Math.max(m, x), innerWidth - w - m)), y: Math.round(Math.min(Math.max(m, y), innerHeight - h - m)) };
  }, []);
  const savePos = (pos: { x: number; y: number } | null) => {
    try {
      if (pos) localStorage.setItem(DOCK_KEY, JSON.stringify(pos));
      else localStorage.removeItem(DOCK_KEY);
    } catch {}
  };
  useEffect(() => {
    if (!dockDraggable) return setFree(null);
    try {
      const v = JSON.parse(localStorage.getItem(DOCK_KEY) || "null");
      if (v && typeof v.x === "number" && typeof v.y === "number") setFree(v);
    } catch {}
  }, [dockDraggable]);
  // al aparecer, al cambiar de tamaño la ventana o al pasar de barra a píldora, se reajusta dentro de la pantalla
  useEffect(() => {
    if (!docked || !free) return;
    const fit = () =>
      setFree((f) => {
        if (!f) return f;
        const c = clampPos(f.x, f.y);
        return c.x === f.x && c.y === f.y ? f : c;
      });
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, [docked, free, clampPos]);
  const gripProps = {
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0 || !dockEl.current) return;
      const r = dockEl.current.getBoundingClientRect();
      // desde una barra de lado a lado, la píldora nace con el asa bajo el puntero
      grab.current = { dx: free ? e.clientX - r.left : Math.min(e.clientX - r.left, 20), dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    },
    onPointerMove: (e: ReactPointerEvent<HTMLButtonElement>) => {
      const g = grab.current;
      if (!g) return;
      // un clic (o el doble clic que la devuelve a su sitio) no la suelta: hace falta moverla unos píxeles
      if (!g.moved && Math.hypot(e.clientX - g.sx, e.clientY - g.sy) < 4) return;
      g.moved = true;
      setFree(clampPos(e.clientX - g.dx, e.clientY - g.dy));
    },
    onPointerUp: () => {
      const moved = grab.current?.moved;
      grab.current = null;
      if (moved) setFree((f) => (savePos(f), f));
    },
    onPointerCancel: () => (grab.current = null),
    onDoubleClick: () => {
      setFree(null);
      savePos(null);
    },
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      const step = e.shiftKey ? 64 : 16;
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (d || e.key === "Delete" || e.key === "Backspace") e.stopPropagation(); // ni al reproductor (buscaría) ni a la página
      if (d && dockEl.current) {
        e.preventDefault();
        const r = dockEl.current.getBoundingClientRect();
        const next = clampPos((free?.x ?? r.left) + d[0], (free?.y ?? r.top) + d[1]);
        setFree(next);
        savePos(next);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        setFree(null);
        savePos(null);
      }
    },
  };
  useEffect(() => setRepeat(repeatProp), [repeatProp]);
  const track = list[index];

  // control externo: `track` + `playKey` cargan y reproducen (el clic que lo provoca cuenta como gesto del usuario)
  // se compara con lo último visto (y no con «¿es el primer render?») para que el doble efecto de StrictMode no reproduzca solo
  const seen = useRef({ track: trackProp, key: playKey });
  useEffect(() => {
    if (seen.current.track === trackProp && seen.current.key === playKey) return;
    seen.current = { track: trackProp, key: playKey };
    if (trackProp == null || !list.length) return;
    const n = Math.min(Math.max(0, trackProp), list.length - 1);
    if (n === index) {
      engine.current?.seek(0);
      setTime(0);
      void engine.current?.play().then(() => setPlaying(true), () => setPlaying(false));
    } else {
      wantPlay.current = true;
      setIndex(n);
      onTrackChange?.(n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackProp, playKey]);

  const go = useCallback(
    (i: number, autoplay = playing) => {
      if (!list.length) return;
      const n = (i + list.length) % list.length;
      wantPlay.current = autoplay;
      setIndex(n);
      onTrackChange?.(n);
    },
    [list.length, onTrackChange, playing],
  );

  // un motor por pista: se crea al cambiar y se destruye al salir
  useEffect(() => {
    if (!track) return;
    const e = createEngine(track.src, track.duration);
    engine.current = e;
    setTime(0);
    setDuration(e.duration);
    setError("");
    e.setVolume(muted ? 0 : volume);
    if (wantPlay.current)
      e.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    else setPlaying(false);
    return () => {
      e.destroy();
      if (engine.current === e) engine.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.src, track?.duration]);

  // final de pista según la repetición
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    e.onEnded = () => {
      if (repeat === "one") {
        e.seek(0);
        void e.play();
      } else if (repeat === "all" || index < list.length - 1) go(index + 1, true);
      else setPlaying(false);
    };
  }, [repeat, index, list.length, go]);

  useEffect(() => engine.current?.setVolume(muted ? 0 : volume), [volume, muted]);

  // reloj: por intervalo (sigue aunque la pestaña esté en segundo plano) · visualizador: por rAF
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const e = engine.current;
      if (!e) return;
      setTime(e.currentTime);
      if (e.duration && e.duration !== duration) setDuration(e.duration);
    }, 200);
    return () => window.clearInterval(id);
  }, [playing, duration]);

  // un solo bucle pinta el visualizador del reproductor y el mini del dock (misma señal, densidad según el tamaño)
  useEffect(() => {
    const targets = [
      { c: canvas.current, kind: visualizer },
      { c: dockCanvas.current, kind: dockViz },
    ].flatMap(({ c, kind }) => {
      const ctx = c && kind !== "none" ? c.getContext("2d") : null;
      return c && ctx ? [{ c, ctx, kind }] : [];
    });
    if (!targets.length) return;
    let raf = 0;
    const acc = tokens?.["--acc"] || "#7cc4ff";
    const fg = tokens?.["--fg"] || "#e8ecf4";
    const mut = tokens?.["--mut"] || "#9aa3b5";
    const freq = new Uint8Array(128);
    const wave = new Uint8Array(256);
    // reparto con más peso en graves y medios: en música electrónica casi toda la energía cae en el primer tercio de bandas
    const band = (t: number) => Math.min(1, (freq[Math.floor(Math.pow(t, 1.6) * 64)] / 255) * 1.1);
    const paint = ({ c, ctx, kind }: (typeof targets)[number]) => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const small = h < 40;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (kind === "wave") {
        ctx.strokeStyle = acc;
        ctx.lineWidth = small ? 1.5 : 2;
        ctx.beginPath();
        for (let i = 0; i < wave.length; i++) {
          const x = (i / (wave.length - 1)) * w;
          const y = h / 2 + ((wave[i] - 128) / 128) * (h * 0.45);
          if (i) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
      } else if (kind === "dots") {
        const gap = small ? 4 : 7;
        const rad = small ? 1 : 1.5;
        const cols = Math.max(8, Math.floor(w / gap));
        const rows = Math.max(3, Math.floor(h / gap));
        for (let x = 0; x < cols; x++) {
          const v = band(x / cols);
          const lit = Math.round(v * rows);
          for (let y = 0; y < rows; y++) {
            ctx.fillStyle = rows - y <= lit ? fg : mut;
            ctx.globalAlpha = rows - y <= lit ? 1 : 0.18;
            ctx.beginPath();
            ctx.arc(x * gap + gap / 2, y * gap + gap / 2, rad, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      } else {
        const n = Math.max(8, Math.min(64, Math.floor(w / (small ? 5 : 9))));
        const bw = w / n;
        for (let i = 0; i < n; i++) {
          const v = band(i / n);
          const bh = Math.max(small ? 1 : 2, v * h);
          ctx.fillStyle = i % 2 ? acc : fg;
          ctx.globalAlpha = 0.35 + v * 0.65;
          ctx.fillRect(i * bw + (small ? 0.5 : 1), h - bh, Math.max(1, bw - (small ? 1 : 2)), bh);
        }
        ctx.globalAlpha = 1;
      }
    };
    const draw = () => {
      const an = engine.current?.analyser;
      const live = !!an && playing;
      if (live) {
        an!.getByteFrequencyData(freq);
        an!.getByteTimeDomainData(wave);
      } else {
        freq.fill(0);
        wave.fill(128);
      }
      targets.forEach(paint);
      if (live) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [playing, visualizer, dockViz, tokens, index, docked, free]);

  // controles del sistema (teclas multimedia, pantalla de bloqueo)
  useEffect(() => {
    if (!("mediaSession" in navigator) || !track) return;
    const ms = navigator.mediaSession;
    ms.metadata = new MediaMetadata({ title: track.title, artist: track.artist, artwork: track.cover && !track.cover.startsWith("gen:") ? [{ src: track.cover }] : [] });
    ms.setActionHandler("play", () => void toggle(true));
    ms.setActionHandler("pause", () => void toggle(false));
    ms.setActionHandler("previoustrack", () => go(index - 1));
    ms.setActionHandler("nexttrack", () => go(index + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, index]);

  const toggle = async (force?: boolean) => {
    const e = engine.current;
    if (!e) return;
    const next = force ?? !e.playing;
    if (next) {
      try {
        await e.play();
        setPlaying(true);
        setError("");
      } catch {
        setError("No se pudo reproducir este archivo.");
        setPlaying(false);
      }
    } else {
      e.pause();
      setPlaying(false);
      setTime(e.currentTime);
    }
  };
  const seekTo = (t: number) => {
    engine.current?.seek(t);
    setTime(t);
  };
  const prev = () => (time > 3 ? seekTo(0) : go(index - 1));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement).tagName;
    // los atajos del reproductor no llegan a la página (que puede usar las flechas para otra cosa)
    if (e.key.startsWith("Arrow") || e.key === " " || e.key === "k" || e.key === "m") e.stopPropagation();
    if (tag === "INPUT" && (e.target as HTMLInputElement).type === "range" && e.key.startsWith("Arrow")) return;
    if (e.key === " " || e.key === "k") {
      if (tag === "BUTTON" && e.key === " ") return;
      e.preventDefault();
      void toggle();
    } else if (e.key === "ArrowRight") seekTo(Math.min(duration, time + 5));
    else if (e.key === "ArrowLeft") seekTo(Math.max(0, time - 5));
    else if (e.key === "m") setMuted((m) => !m);
  };

  if (!track) return null;
  const pct = duration ? (time / duration) * 100 : 0;
  const volPct = (muted ? 0 : volume) * 100;

  const playBtn = (
    <button type="button" className="ui-audio__play" onClick={() => void toggle()} aria-label={playing ? "Pausa" : "Reproducir"}>
      {renderGlyph(playing ? "icon:pause" : "icon:play", layout === "minimal" ? 16 : 20)}
    </button>
  );
  const seek = (
    <div className="ui-audio__seek">
      <span className="ui-audio__time">{formatTime(time)}</span>
      <input type="range" min={0} max={duration || 1} step={0.1} value={Math.min(time, duration || 1)} onChange={(e) => seekTo(Number(e.target.value))} aria-label="Posición" aria-valuetext={`${formatTime(time)} de ${formatTime(duration)}`} style={{ "--p": `${pct}%` } as CSSProperties} />
      <span className="ui-audio__time">{formatTime(duration)}</span>
    </div>
  );
  const meta = (
    <div className="ui-audio__meta">
      <strong>{track.title}</strong>
      {track.artist && <span>{track.artist}</span>}
    </div>
  );
  const volumeCtl = (
    <div className="ui-audio__vol">
      <button type="button" className="ui-audio__btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Activar sonido" : "Silenciar"}>
        {renderGlyph("icon:volume", 18)}
        {muted && <i className="ui-audio__mute" aria-hidden />}
      </button>
      <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }} aria-label="Volumen" style={{ "--p": `${volPct}%` } as CSSProperties} />
    </div>
  );
  const transport = (
    <div className="ui-audio__transport">
      <button type="button" className="ui-audio__btn" onClick={prev} aria-label="Anterior" disabled={list.length < 2 && time < 3}>
        {renderGlyph("icon:chevron-left", 20)}
      </button>
      {playBtn}
      <button type="button" className="ui-audio__btn" onClick={() => go(index + 1)} aria-label="Siguiente" disabled={list.length < 2}>
        {renderGlyph("icon:chevron-right", 20)}
      </button>
    </div>
  );
  const repeatBtn = (
    <button type="button" className={`ui-audio__btn ui-audio__repeat ${repeat !== "off" ? "is-on" : ""}`} onClick={() => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"))} aria-label={`Repetir: ${repeat === "off" ? "no" : repeat === "all" ? "todas" : "esta pista"}`} aria-pressed={repeat !== "off"}>
      {renderGlyph("icon:reload", 16)}
      {repeat === "one" && <b>1</b>}
    </button>
  );
  const playlist = showPlaylist && layout !== "minimal" && list.length > 1 && (
    <ol className="ui-audio__list" aria-label="Lista de pistas">
      {list.map((t, i) => (
        <li key={t.title + i}>
          <button type="button" className="ui-audio__item" aria-current={i === index || undefined} onClick={() => (i === index ? void toggle() : go(i, true))}>
            <span className="ui-audio__n">{i === index && playing ? "▶" : String(i + 1).padStart(2, "0")}</span>
            <span className="ui-audio__itext">
              <strong>{t.title}</strong>
              {t.artist && <span>{t.artist}</span>}
            </span>
            <span className="ui-audio__time">{formatTime(t.duration)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
  const viz = visualizer !== "none" && <canvas ref={canvas} className="ui-audio__viz" aria-hidden />;

  return (
    <div ref={root} className={`ui-audio ui-audio--${layout} ${playing ? "is-playing" : ""} ui-surface ${vcls(variant)} ${className}`} role="region" aria-label={`Reproductor: ${track.title}`} tabIndex={-1} onKeyDown={onKey}>
      {layout === "full" && (
        <>
          <div className="ui-audio__stage">
            {track.cover && <img className="ui-audio__cover" src={resolveImage(track.cover)} alt="" aria-hidden />}
            {viz}
          </div>
          {meta}
          {seek}
          <div className="ui-audio__controls">
            {repeatBtn}
            {transport}
            {volumeCtl}
          </div>
          {playlist}
        </>
      )}
      {layout === "bar" && (
        <>
          <div className="ui-audio__row">
            {transport}
            {meta}
            {viz}
            {seek}
            {repeatBtn}
            {volumeCtl}
          </div>
          {playlist}
        </>
      )}
      {layout === "minimal" && (
        <div className="ui-audio__row">
          {playBtn}
          {meta}
          {viz}
          <span className="ui-audio__time">
            {formatTime(time)} / {formatTime(duration)}
          </span>
          <div className="ui-audio__line" style={{ "--p": `${pct}%` } as CSSProperties} aria-hidden />
        </div>
      )}
      {error && (
        <p className="ui-audio__err" role="alert">
          {error}
        </p>
      )}
      {docked &&
        createPortal(
          <div
            ref={dockEl}
            className={`ui-audio-dock ui-audio-dock--${dock} ${free ? "ui-audio-dock--free" : ""} ${playing ? "is-playing" : ""} ui-surface ${vcls(variant)} ${dockClassName}`}
            style={{ ...dockStyle, "--dock-off": `${dockOffset}px`, "--p": `${pct}%`, ...(free ? { "--x": `${free.x}px`, "--y": `${free.y}px` } : null) } as CSSProperties}
            role="region"
            aria-label={`Reproductor en curso: ${track.title}`}
          >
            {dockDraggable && (
              <button type="button" className="ui-audio-dock__grip" aria-label="Mover el reproductor: arrastra o usa las flechas; doble clic o Supr lo devuelve a su sitio" title="Arrastra para moverlo · doble clic: a su sitio" {...gripProps}>
                <i aria-hidden />
              </button>
            )}
            <button type="button" className="ui-audio__play" onClick={() => void toggle()} aria-label={playing ? "Pausa" : "Reproducir"}>
              {renderGlyph(playing ? "icon:pause" : "icon:play", 14)}
            </button>
            <button type="button" className="ui-audio-dock__meta" onClick={() => root.current?.scrollIntoView({ behavior: "smooth", block: "center" })} aria-label={`Ir al reproductor: ${track.title}`}>
              <strong>{track.title}</strong>
              {track.artist && <span>{track.artist}</span>}
            </button>
            {dockViz !== "none" && <canvas ref={dockCanvas} className={`ui-audio-dock__viz ui-audio-dock__viz--${dockViz}`} aria-hidden />}
            <span className="ui-audio__time">
              {formatTime(time)} / {formatTime(duration)}
            </span>
            {list.length > 1 && (
              <button type="button" className="ui-audio__btn" onClick={() => go(index + 1)} aria-label="Siguiente">
                {renderGlyph("icon:chevron-right", 16)}
              </button>
            )}
            <button type="button" className="ui-audio__btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Activar sonido" : "Silenciar"} aria-pressed={muted}>
              {renderGlyph("icon:volume", 16)}
              {muted && <i className="ui-audio__mute" aria-hidden />}
            </button>
            <button
              type="button"
              className="ui-audio__btn"
              onClick={() => {
                void toggle(false);
                setDockClosed(true);
              }}
              aria-label="Parar y cerrar"
            >
              {renderGlyph("icon:close", 14)}
            </button>
            <i className="ui-audio-dock__line" aria-hidden />
          </div>,
          document.body,
        )}
    </div>
  );
}
