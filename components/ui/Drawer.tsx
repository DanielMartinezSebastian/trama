"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { vcls, type Variant } from "./variants";

export type DrawerProps = {
  /** texto del botón que abre el panel */
  triggerLabel?: string;
  /** @deprecated usa `triggerLabel` */
  trigger?: string;
  side?: "left" | "right";
  title?: string;
  body?: string;
  variant?: Variant;
  /** cambia para abrir el panel desde fuera (botón «Repetir animación» del catálogo) */
  playKey?: number;
  className?: string;
};

/** Panel lateral deslizante (menú móvil, carrito, filtros). Se cierra con el fondo, Escape o su botón. */
export default function Drawer({
  triggerLabel, trigger: legacyTrigger,
  side = "left",
  title = "Menú",
  body = "Clases, Tablas, Reservas, Contacto, Ayuda.",
  variant = "glass",
  playKey = 0,
  className = "",
}: DrawerProps) {
  const trigger = triggerLabel ?? legacyTrigger ?? "Abrir menú";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (playKey > 0) setOpen(true);
  }, [playKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={className}>
      <Button label={trigger} variant={variant} emphasis="primary" onClick={() => setOpen(true)} />
      {open && (
        <div className="ui-drawer__backdrop" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`ui-drawer ui-drawer--${side} ui-surface ${vcls(variant)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ui-drawer__head">
              <strong>{title}</strong>
              <button type="button" className="ui-drawer__close" aria-label="Cerrar" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <p>{body}</p>
          </div>
        </div>
      )}
    </div>
  );
}
