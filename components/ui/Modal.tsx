"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import type { Intent } from "./intent";
import { vcls, type Variant } from "./variants";

export type ModalProps = {
  /** texto del botón que abre el diálogo */
  triggerLabel?: string;
  /** @deprecated usa `triggerLabel` */
  trigger?: string;
  title?: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  size?: "sm" | "md" | "lg";
  /** color del botón de confirmar (y del disparador): `danger` para acciones destructivas, como borrar */
  intent?: Intent;
  variant?: Variant;
  /** cambia para abrir el diálogo desde fuera (botón «Repetir animación» del catálogo) */
  playKey?: number;
  /**
   * Modo controlado: si se pasa (aunque sea `false`), sustituye al estado interno y el propio
   * `Modal` deja de pintar su botón `trigger` — es el propio proyecto quien decide cuándo se abre
   * (p. ej. al enviar un formulario). Se cierra llamando a `onOpenChange(false)`.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** se llama al pulsar «confirmar», antes de cerrar el diálogo */
  onConfirm?: () => void;
  /** se llama al pulsar «cancelar», el fondo o Escape, antes de cerrar el diálogo */
  onCancel?: () => void;
  className?: string;
};

/**
 * Diálogo modal: un botón lo abre, un fondo semitransparente cubre la página. Se cierra al pulsar
 * fuera, con Escape o con sus propios botones. `position: fixed` (no portal): escapa de cualquier
 * contenedor con `overflow` sin necesitar un `createPortal`.
 *
 * Sin `open`, es autónomo (pinta su propio botón `trigger` y lleva su estado). Con `open` pasa a
 * modo controlado: no pinta el botón `trigger` (se abre desde donde decida quien lo usa) y notifica
 * cada cambio por `onOpenChange`; `onConfirm`/`onCancel` avisan de qué botón se pulsó.
 */
export default function Modal({
  triggerLabel, trigger: legacyTrigger,
  title = "¿Seguro que quieres continuar?",
  body = "Esta acción no se puede deshacer. Se borrarán todos tus datos y no podrás recuperarlos.",
  confirmLabel = "Sí, eliminar",
  cancelLabel = "Cancelar",
  size = "md",
  intent = "accent",
  variant = "glass",
  playKey = 0,
  open: openProp,
  onOpenChange,
  onConfirm,
  onCancel,
  className = "",
}: ModalProps) {
  const trigger = triggerLabel ?? legacyTrigger ?? "Eliminar cuenta";
  const controlled = openProp !== undefined;
  const [openState, setOpenState] = useState(false);
  const open = controlled ? openProp : openState;
  const setOpen = (v: boolean) => (controlled ? onOpenChange?.(v) : setOpenState(v));
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playKey > 0) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel?.();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className={className}>
      {!controlled && <Button label={trigger} variant={variant} emphasis="primary" intent={intent} onClick={() => setOpen(true)} />}
      {open && (
        <div
          className="ui-modal__backdrop"
          onClick={() => {
            onCancel?.();
            setOpen(false);
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`ui-modal ui-modal--${size} ui-surface ${vcls(variant)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{title}</h3>
            <p>{body}</p>
            <div className="ui-modal__actions">
              <Button
                label={cancelLabel}
                variant={variant}
                emphasis="ghost"
                onClick={() => {
                  onCancel?.();
                  setOpen(false);
                }}
              />
              <Button
                label={confirmLabel}
                variant={variant}
                emphasis="primary"
                intent={intent}
                onClick={() => {
                  onConfirm?.();
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
