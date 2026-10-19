"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

export type Sticker = {
  id: string;
  /** imagen (data URI o URL) */
  src: string;
  /** posición del centro, en % del lienzo */
  x: number;
  y: number;
  /** ancho en px */
  width?: number;
  /** giro inicial en grados */
  rotate?: number;
  /** nombre accesible: «Pegatina de una estrella» */
  label: string;
};

export type StickerCollageProps = {
  stickers: Sticker[];
  /** contenido que va debajo de las pegatinas (titular, texto) */
  children?: ReactNode;
  /** alto mínimo (CSS) */
  height?: string;
  /** las pegatinas flotan suavemente cuando no se tocan */
  float?: boolean;
  className?: string;
};

/**
 * Collage de pegatinas arrastrables (Uncommon): vinilos de formas planas repartidos sobre un titular que la persona puede
 * mover, soltar y apilar. Cada pegatina es un botón: con **flechas** se mueve (Mayús = más), con el puntero se arrastra y sube al
 * frente. Se quedan dentro del lienzo. Flotan despacio salvo con `prefers-reduced-motion`. Es decorativo: el contenido que
 * importa va en `children` y no depende de las pegatinas.
 */
export default function StickerCollage({ stickers, children, height = "min(86vh, 760px)", float = true, className = "" }: StickerCollageProps) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>(() => Object.fromEntries(stickers.map((s) => [s.id, { x: s.x, y: s.y }])));
  const [order, setOrder] = useState<string[]>(() => stickers.map((s) => s.id));
  const [held, setHeld] = useState<string | null>(null);
  const drag = useRef<{ id: string; ox: number; oy: number } | null>(null);

  const front = (id: string) => setOrder((o) => [...o.filter((i) => i !== id), id]);
  const put = (id: string, x: number, y: number) => setPos((p) => ({ ...p, [id]: { x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) } }));

  const down = (e: PointerEvent<HTMLButtonElement>, s: Sticker) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = pos[s.id];
    drag.current = { id: s.id, ox: e.clientX - (r.left + (p.x / 100) * r.width), oy: e.clientY - (r.top + (p.y / 100) * r.height) };
    setHeld(s.id);
    front(s.id);
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const r = box.current?.getBoundingClientRect();
    if (!d || !r) return;
    put(d.id, ((e.clientX - d.ox - r.left) / r.width) * 100, ((e.clientY - d.oy - r.top) / r.height) * 100);
  };
  const up = () => {
    drag.current = null;
    setHeld(null);
  };
  const key = (e: KeyboardEvent, s: Sticker) => {
    const step = e.shiftKey ? 6 : 2;
    const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    front(s.id);
    put(s.id, pos[s.id].x + v[0], pos[s.id].y + v[1]);
  };

  return (
    <div ref={box} className={`ui-stk ${float ? "ui-stk--float" : ""} ${className}`.trim()} style={{ minHeight: height }}>
      <div className="ui-stk__body">{children}</div>
      {stickers.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className="ui-stk__s"
          data-held={held === s.id ? "" : undefined}
          aria-label={`${s.label}. Arrástala o usa las flechas para moverla`}
          style={{ left: `${pos[s.id].x}%`, top: `${pos[s.id].y}%`, width: s.width ?? 120, zIndex: 2 + order.indexOf(s.id), "--rot": `${s.rotate ?? 0}deg`, "--fd": `${(i % 5) * -1.3}s` } as CSSProperties}
          onPointerDown={(e) => down(e, s)}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={(e) => key(e, s)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.src} alt="" draggable={false} />
        </button>
      ))}
    </div>
  );
}
