"use client";

import { useEffect, useRef } from "react";
import Button, { type ButtonProps } from "./Button";

export type MagneticButtonProps = Omit<ButtonProps, "className"> & {
  /** cuánto se acerca al puntero (0 = nada, 1 = pegado) */
  strength?: number;
  /** distancia en px a la que empieza a atraerse */
  radius?: number;
  /** giro sutil hacia el puntero, en grados */
  tilt?: number;
  className?: string;
};

/** `Button` que se desplaza hacia el puntero cuando este se acerca. Sin efecto en táctil. */
export default function MagneticButton({ strength = 0.35, radius = 160, tilt = 0, className = "", ...button }: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn || window.matchMedia("(pointer: coarse)").matches) return;
    let disposed = false;
    let off: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (disposed) return;
      const qx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      const qy = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      const qr = gsap.quickTo(btn, "rotation", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < radius) {
          qx(dx * strength);
          qy(dy * strength);
          qr((dx / (r.width / 2)) * tilt);
        } else {
          qx(0);
          qy(0);
          qr(0);
        }
      };
      window.addEventListener("pointermove", move);
      off = () => {
        window.removeEventListener("pointermove", move);
        gsap.killTweensOf(btn);
        gsap.set(btn, { x: 0, y: 0, rotation: 0 });
      };
    })();

    return () => {
      disposed = true;
      off?.();
    };
  }, [strength, radius, tilt]);

  return <Button ref={ref} className={className} {...button} />;
}
