"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { CartLine } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import { lockScroll } from "@/lib/motion/lenis";
import { themeSnapshot } from "@/lib/ui/themeSnapshot";
import QuantityStepper from "./QuantityStepper";

export type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  onQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  currency?: string;
  title?: string;
  /** importe a partir del cual el envío es gratis (0 = sin barra de progreso) */
  freeShippingFrom?: number;
  /** enlace del botón de pedir */
  checkoutHref?: string;
  checkoutLabel?: string;
  /** se llama al pulsar «Finalizar pedido», además de seguir el enlace */
  onCheckout?: () => void;
  /** qué hay cuando no hay nada */
  emptyText?: string;
  /** contenido extra bajo el total (nota de devoluciones, métodos de pago) */
  footer?: ReactNode;
  /** enlace del botón de la vista vacía («Seguir comprando») */
  continueHref?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/**
 * Carrito lateral: líneas con cantidad y quitar, subtotal, barra de envío gratis y botón de pedir. Es un diálogo modal
 * (atrapa el foco, Esc y el fondo cierran, pausa el scroll y devuelve el foco a quien lo abrió) pintado en un portal con los
 * tokens de tu tema. Controlado: `open` y las líneas viven en tu página (con `useCart` de `trama-ui`).
 */
export default function CartDrawer({ open, onOpenChange, lines, onQty, onRemove, currency = "EUR", title = "Tu carrito", freeShippingFrom = 0, checkoutHref = "#", checkoutLabel = "Finalizar pedido", onCheckout, emptyText = "Tu carrito está vacío.", footer, continueHref = "#" }: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<CSSProperties>();
  const panel = useRef<HTMLDivElement>(null);
  const anchor = useRef<Element | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    anchor.current = document.activeElement;
    if (anchor.current) setTheme(themeSnapshot(anchor.current));
    const unlock = lockScroll();
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>(".ui-cart__close")?.focus(), 50);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onOpenChange(false);
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      clearTimeout(t);
      unlock();
      (anchor.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open, onOpenChange]);

  const subtotal = Math.round(lines.reduce((n, l) => n + l.price * l.qty, 0) * 100) / 100;
  const left = Math.max(0, freeShippingFrom - subtotal);
  const pct = freeShippingFrom > 0 ? Math.min(100, (subtotal / freeShippingFrom) * 100) : 0;

  const node = (
    <div className="ui-cart" data-open={open ? "" : undefined} style={theme} aria-hidden={!open} inert={!open}>
      <div className="ui-cart__scrim" onClick={() => onOpenChange(false)} />
      <div ref={panel} className="ui-cart__panel" role="dialog" aria-modal="true" aria-label={title}>
        <header className="ui-cart__head">
          <h2>{title} <span>({lines.reduce((n, l) => n + l.qty, 0)})</span></h2>
          <button type="button" className="ui-cart__close" onClick={() => onOpenChange(false)} aria-label="Cerrar carrito"><span aria-hidden>✕</span></button>
        </header>
        {lines.length === 0 ? (
          <div className="ui-cart__empty">
            <p>{emptyText}</p>
            <a href={continueHref} onClick={() => onOpenChange(false)}>Seguir comprando</a>
          </div>
        ) : (
          <>
            {freeShippingFrom > 0 && (
              <div className="ui-cart__ship">
                <p role="status">{left > 0 ? `Te faltan ${money(left, currency)} para el envío gratis` : "Tienes el envío gratis"}</p>
                <div className="ui-cart__bar" aria-hidden><span style={{ width: `${pct}%` }} /></div>
              </div>
            )}
            <ul className="ui-cart__lines">
              {lines.map((l) => (
                <li key={l.id} className="ui-cart__line">
                  {l.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.image} alt="" />
                  )}
                  <div className="ui-cart__info">
                    <b>{l.title}</b>
                    {l.meta && <span>{l.meta}</span>}
                    <QuantityStepper value={l.qty} onChange={(q) => onQty(l.id, q)} label={l.title} size="sm" min={1} />
                  </div>
                  <div className="ui-cart__side">
                    <span>{money(l.price * l.qty, currency)}</span>
                    <button type="button" onClick={() => onRemove(l.id)} aria-label={`Quitar ${l.title} del carrito`}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="ui-cart__foot">
              <p className="ui-cart__sub"><span>Subtotal</span><b>{money(subtotal, currency)}</b></p>
              <p className="ui-cart__note">Los gastos de envío se calculan al finalizar el pedido.</p>
              <a className="ui-cart__go" href={checkoutHref} onClick={() => { onCheckout?.(); onOpenChange(false); }}>{checkoutLabel}</a>
              {footer}
            </footer>
          </>
        )}
      </div>
    </div>
  );
  return mounted ? createPortal(node, document.body) : null;
}
