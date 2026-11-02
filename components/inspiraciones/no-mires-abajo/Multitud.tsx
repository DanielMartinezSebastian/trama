"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { FRASES } from "./data";

/*
 * El dibujo de la partida, en lienzo 2D y a tinta: dos zapatos enormes que entran por arriba y una multitud de muñecos que
 * andan a sus pies, con bocadillos. El color rojo y las prisas suben con el enfado. Se dibuja con `requestAnimationFrame`
 * leyendo una referencia para no pasar por React en cada fotograma.
 */

export type Escena = { gente: number; enfado: number };
type Muneco = { x: number; y: number; fase: number; vel: number; dir: number; frase: string; hasta: number };

const TINTA = "#14140f";
const ROJO = "#c0342a";

function zapato(c: CanvasRenderingContext2D, x: number, y: number, e: number, flip: number) {
  c.save();
  c.translate(x, y);
  c.scale(e * flip, e);
  c.fillStyle = "#fff";
  c.strokeStyle = TINTA;
  c.lineWidth = 2.4 / e;
  c.beginPath();
  c.moveTo(-34, -260);
  c.lineTo(-30, -60);
  c.bezierCurveTo(-34, -24, -44, -8, -38, 8);
  c.lineTo(120, 12);
  c.bezierCurveTo(140, 10, 134, -26, 96, -36);
  c.bezierCurveTo(60, -46, 44, -56, 34, -78);
  c.lineTo(34, -260);
  c.fill();
  c.stroke();
  for (let i = 0; i < 4; i++) {
    c.beginPath();
    c.moveTo(36 + i * 12, -60 + i * 6);
    c.lineTo(58 + i * 12, -72 + i * 6);
    c.stroke();
  }
  c.restore();
}

function muneco(c: CanvasRenderingContext2D, m: Muneco, t: number, enfado: number, rojo: boolean) {
  const salta = Math.abs(Math.sin(t * 5 * m.vel + m.fase)) * (2 + enfado * 0.05);
  const y = m.y - salta;
  c.lineWidth = 1.8;
  c.strokeStyle = TINTA;
  c.fillStyle = rojo ? ROJO : "#fff";
  c.beginPath();
  c.ellipse(m.x, y - 15, 8, 12, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(m.x - 4, y - 3);
  c.lineTo(m.x - 5 + Math.sin(t * 8 + m.fase) * 3, y + 6);
  c.moveTo(m.x + 4, y - 3);
  c.lineTo(m.x + 5 - Math.sin(t * 8 + m.fase) * 3, y + 6);
  c.stroke();
  c.fillStyle = TINTA;
  c.beginPath();
  c.arc(m.x + m.dir * 3, y - 18, 1.4, 0, Math.PI * 2);
  c.fill();
}

function bocadillo(c: CanvasRenderingContext2D, x: number, y: number, s: string) {
  c.font = "15px var(--font-patrick-hand), cursive";
  const w = c.measureText(s).width + 14;
  c.fillStyle = "#fff";
  c.strokeStyle = TINTA;
  c.lineWidth = 1.4;
  c.beginPath();
  c.roundRect(x - w / 2, y - 22, w, 20, 8);
  c.fill();
  c.stroke();
  c.fillStyle = TINTA;
  c.fillText(s, x - w / 2 + 7, y - 7);
}

export default function Multitud({ escena, className = "" }: { escena: MutableRefObject<Escena>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const c = cv?.getContext("2d");
    if (!cv || !c) return;
    const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    const gente: Muneco[] = [];
    const ajusta = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(devicePixelRatio, 2);
      W = r.width;
      H = r.height;
      cv.width = W * d;
      cv.height = H * d;
      c.setTransform(d, 0, 0, d, 0, 0);
    };
    const nuevo = (): Muneco => ({ x: Math.random() * W, y: H * 0.34 + Math.random() * H * 0.62, fase: Math.random() * 7, vel: 0.5 + Math.random(), dir: Math.random() < 0.5 ? -1 : 1, frase: "", hasta: 0 });
    ajusta();
    const ro = new ResizeObserver(ajusta);
    ro.observe(cv);
    const dibuja = (ms: number) => {
      const t = ms / 1000;
      const { gente: g, enfado } = escena.current;
      const n = Math.min(160, Math.round(g));
      while (gente.length < n) gente.push(nuevo());
      gente.length = n;
      c.clearRect(0, 0, W, H);
      c.strokeStyle = "rgba(20,20,15,0.08)";
      c.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        c.beginPath();
        c.ellipse(W / 2, H * 0.3, i * W * 0.14, i * H * 0.1, 0, 0, Math.PI * 2);
        c.stroke();
      }
      const e = Math.min(1.25, W / 900);
      zapato(c, W / 2 - 150 * e, H * 0.3, e, -1);
      zapato(c, W / 2 + 150 * e, H * 0.3 + Math.sin(t * 0.8) * 3, e, 1);
      const cx = W / 2;
      const cy = H * 0.36;
      const prisa = 0.15 + enfado * 0.012;
      gente.sort((a, b) => a.y - b.y).forEach((m, i) => {
        if (!quieto) {
          const hacia = enfado > 55 ? 0.35 : 0;
          m.x += m.dir * m.vel * prisa + (cx - m.x) * 0.0012 * hacia * 4;
          m.y += (cy + 60 - m.y) * 0.0009 * hacia * 4;
          if (m.x < 0 || m.x > W) m.dir *= -1;
        }
        muneco(c, m, quieto ? 0 : t, enfado, (i * 37) % 100 < enfado - 8);
        if (m.hasta < t && Math.random() < 0.0012 + enfado * 0.00004) {
          const banco = enfado > 66 ? FRASES.furiosa : enfado > 33 ? FRASES.molesta : FRASES.tranquila;
          m.frase = banco[Math.floor(Math.random() * banco.length)];
          m.hasta = t + 2.4;
        }
      });
      gente.forEach((m) => m.hasta > t && m.frase && bocadillo(c, m.x, m.y - 34, m.frase));
      raf = requestAnimationFrame(dibuja);
    };
    raf = requestAnimationFrame(dibuja);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [escena]);
  return <canvas ref={ref} className={className} role="img" aria-label="Dos zapatos gigantes y una multitud de muñecos a sus pies" />;
}
