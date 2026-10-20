"use client";

import { useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import AudioPlayer from "@/components/ui/AudioPlayer";
import Button from "@/components/ui/Button";
import GridBackground from "@/components/ui/GridBackground";
import Icon from "@/components/ui/Icon";
import LocalTime from "@/components/ui/LocalTime";
import TextField from "@/components/ui/TextField";
import { poolTokens, tokensToStyle } from "@/lib/ui/tokens";
import { SiteFrame } from "../shared";
import { DOCK, POSTCARDS, SHOWS, TRACKS, type WinId } from "./data";
import "./hamaca.css";

const TOKENS = { ...tokensToStyle(poolTokens), "--sel-bg": poolTokens.acc, "--sel-fg": "#ffffff" } as CSSProperties;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <SiteFrame tokens={TOKENS} className="hm">
      {children}
    </SiteFrame>
  );
}

/* Posición inicial de cada ventana en el escritorio (% del ancho, px desde arriba) */
const START: Record<WinId, { x: number; y: number; w: number }> = {
  radio: { x: 50, y: 40, w: 400 },
  agenda: { x: 14, y: 120, w: 300 },
  postales: { x: 80, y: 150, w: 340 },
  club: { x: 22, y: 380, w: 320 },
};

/**
 * Ventana de sistema antiguo: barra de título que se arrastra (puntero) y botón de cerrar. Es un diálogo no modal
 * (`role="dialog"` con nombre); al pulsarla sube al frente. En pantallas estrechas no se arrastra: se apila (CSS).
 */
function Win({ id, title, z, onFront, onClose, children }: { id: WinId; title: string; z: number; onFront: () => void; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const s = START[id];
  const down = (e: RPointerEvent) => {
    if ((e.target as HTMLElement).closest("button") || !matchMedia("(min-width: 760px)").matches) return;
    drag.current = { x: e.clientX, y: e.clientY, ox: off.x, oy: off.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: RPointerEvent) => {
    const d = drag.current;
    if (d) setOff({ x: d.ox + e.clientX - d.x, y: d.oy + e.clientY - d.y });
  };
  const up = () => {
    drag.current = null;
  };
  return (
    <section
      ref={ref}
      className="hm-win"
      role="dialog"
      aria-labelledby={`hm-${id}-t`}
      style={{ "--x": `${s.x}%`, "--y": `${s.y}px`, "--w": `${s.w}px`, "--dx": `${off.x}px`, "--dy": `${off.y}px`, zIndex: z } as CSSProperties}
      onPointerDownCapture={onFront}
      onFocusCapture={onFront}
    >
      <header className="hm-win__bar" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <button type="button" className="hm-win__close" onClick={onClose} aria-label={`Cerrar ${title}`} />
        <h2 id={`hm-${id}-t`}>{title}</h2>
        <span className="hm-win__grip" aria-hidden />
      </header>
      <div className="hm-win__body">{children}</div>
    </section>
  );
}

export function Page({ path }: { path: string[] }) {
  const [open, setOpen] = useState<WinId[]>(["agenda", "radio", "postales"]);
  const [joined, setJoined] = useState(false);
  const show = (id: WinId) => setOpen((o) => [...o.filter((x) => x !== id), id]);
  const close = (id: WinId) => setOpen((o) => o.filter((x) => x !== id));
  if (path.length) return null;
  const z = (id: WinId) => 10 + open.indexOf(id);
  const win = (id: WinId, title: string, body: ReactNode) =>
    open.includes(id) && (
      <Win key={id} id={id} title={title} z={z(id)} onFront={() => open[open.length - 1] !== id && show(id)} onClose={() => close(id)}>
        {body}
      </Win>
    );
  return (
    <div className="hm-desk">
      <GridBackground kind="lines" cellSize={22} opacity={0.35} fade={false} position="fixed" className="hm-paper" />
      <div className="hm-menubar">
        <span className="hm-menubar__brand">☼ Hamaca FM</span>
        <span className="hm-menubar__on">● En directo · Hora de la siesta</span>
        <LocalTime city="Cadaqués" timeZone="Europe/Madrid" className="hm-menubar__clock" />
      </div>
      <h1 className="hm-sr">Hamaca FM, la radio de verano</h1>
      <main id="contenido" className="hm-windows">
        {win(
          "radio",
          "Hamaca.fm",
          <>
            <figure className="hm-halftone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/${POSTCARDS[0].file}`} alt="Puesta de sol en la orilla, en semitono" />
            </figure>
            <AudioPlayer tracks={TRACKS} layout="full" visualizer="bars" showPlaylist={false} variant="retro" defaultVolume={0.6} />
          </>,
        )}
        {win(
          "agenda",
          "Agenda.txt",
          <ol className="hm-agenda">
            {SHOWS.map((s) => (
              <li key={s.time}>
                <b>{s.time}</b>
                <span>{s.name}</span>
                <small>{s.host}</small>
              </li>
            ))}
          </ol>,
        )}
        {win(
          "postales",
          "Postales",
          <ul className="hm-cards">
            {POSTCARDS.map((p) => (
              <li key={p.file}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/img/${p.file}`} alt={p.alt} loading="lazy" />
                <span>{p.place}</span>
              </li>
            ))}
          </ul>,
        )}
        {win(
          "club",
          "Club de la tumbona",
          joined ? (
            <p className="hm-ok">¡Dentro! Te llegará la lista del verano el viernes. (Demo: no se ha enviado nada).</p>
          ) : (
            <form
              className="hm-club"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <p>Una lista al mes y avisos de las fiestas en la playa. Sin spam, palabra de socorrista.</p>
              <TextField label="Correo" type="email" name="email" required placeholder="tu@correo.example" variant="retro" />
              <Button label="Apuntarme" variant="retro" type="submit" />
            </form>
          ),
        )}
      </main>
      <nav className="hm-dock" aria-label="Abrir ventanas">
        {DOCK.map((d) => (
          <button key={d.id} type="button" className="hm-dock__b" aria-pressed={open.includes(d.id)} onClick={() => show(d.id)}>
            <Icon name={d.icon} iconSize={28} />
            <span>{d.label}</span>
          </button>
        ))}
        <a className="hm-dock__b" href="/creditos">
          <Icon name="file-text" iconSize={28} />
          <span>Créditos</span>
        </a>
      </nav>
    </div>
  );
}
