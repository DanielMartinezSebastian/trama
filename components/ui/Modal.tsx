"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { lockScroll } from "@/lib/motion/lenis";
import Button, { type ButtonEmphasis } from "./Button";
import type { Intent } from "./intent";
import { vcls, type Variant } from "./variants";
import { prefersReducedMotion } from "@/lib/ui/useReducedMotion";

export type ModalAction = {
  label: string;
  /** valor que recibe `onAction` */
  value?: string;
  emphasis?: ButtonEmphasis;
  /** recibe el foco al abrir */
  autoFocus?: boolean;
  /** si lleva `href` es un enlace (p. ej. «No» → otra web) y no cierra el diálogo */
  href?: string;
};

export type ModalProps = {
  /** texto del botón que abre el diálogo */
  triggerLabel?: string;
  /** @deprecated usa `triggerLabel` */
  trigger?: string;
  title?: ReactNode;
  body?: string;
  /** contenido propio en lugar de `body` (formularios, textos con enlaces…) */
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** botones propios en lugar de confirmar / cancelar; cada uno cierra el diálogo y avisa con `onAction` */
  actions?: ModalAction[];
  onAction?: (value: string) => void;
  /** `full` = pantalla completa con el fondo de la web (pantalla de entrada «con / sin sonido», «¿eres mayor de edad?») */
  size?: "sm" | "md" | "lg" | "full";
  /** false: no se cierra con Escape ni pulsando fuera (hay que elegir un botón) */
  dismissible?: boolean;
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

const FOCUSABLE = 'button:not(:disabled), a[href], input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal: un botón lo abre, un fondo semitransparente cubre la página. Se cierra al pulsar
 * fuera, con Escape o con sus propios botones (salvo `dismissible={false}`). Mientras está abierto pausa el scroll y el
 * tabulador no sale de él. `position: fixed` (no portal): escapa de cualquier contenedor con `overflow` sin `createPortal`.
 *
 * Sin `open`, es autónomo (pinta su propio botón `trigger` y lleva su estado). Con `open` pasa a
 * modo controlado: no pinta el botón `trigger` (se abre desde donde decida quien lo usa) y notifica
 * cada cambio por `onOpenChange`; `onConfirm`/`onCancel` avisan de qué botón se pulsó.
 *
 * Con `size="full"` es una pantalla de entrada a toda la ventana (titular grande, el fondo de la web y salida con fundido):
 * una elección declarada por la persona, no una verificación de edad.
 */
export default function Modal({
  triggerLabel, trigger: legacyTrigger,
  title = "¿Seguro que quieres continuar?",
  body = "Esta acción no se puede deshacer. Se borrarán todos tus datos y no podrás recuperarlos.",
  children,
  confirmLabel = "Sí, eliminar",
  cancelLabel = "Cancelar",
  actions,
  onAction,
  size = "md",
  dismissible = true,
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
  const [leaving, setLeaving] = useState(false);
  const open = controlled ? openProp : openState;
  const setOpen = (v: boolean) => (controlled ? onOpenChange?.(v) : setOpenState(v));
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const full = size === "full";

  const close = () => {
    if (!full || prefersReducedMotion()) return setOpen(false);
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      setOpen(false);
    }, 500);
  };
  const cancel = () => {
    if (!dismissible) return;
    onCancel?.();
    close();
  };

  useEffect(() => {
    if (playKey > 0) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const p = panelRef.current;
    const af = actions?.findIndex((a) => a.autoFocus) ?? -1;
    (af >= 0 ? p?.querySelectorAll<HTMLElement>(".ui-modal__actions > *")[af] : p)?.focus();
    return unlock;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") return cancel();
    if (e.key !== "Tab") return;
    // el foco no sale del diálogo
    const els = [...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
    if (!els.length) return e.preventDefault();
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const Heading = full ? "h2" : "h3";
  const buttons = actions ? (
    actions.map((a, i) =>
      a.href ? (
        <Button key={i} label={a.label} href={a.href} variant={variant} emphasis={a.emphasis ?? "outline"} />
      ) : (
        <Button
          key={i}
          label={a.label}
          variant={variant}
          emphasis={a.emphasis ?? (i === 0 ? "primary" : "outline")}
          intent={intent}
          onClick={() => {
            onAction?.(a.value ?? a.label);
            close();
          }}
        />
      ),
    )
  ) : (
    <>
      <Button label={cancelLabel} variant={variant} emphasis="ghost" onClick={() => { onCancel?.(); close(); }} />
      <Button label={confirmLabel} variant={variant} emphasis="primary" intent={intent} onClick={() => { onConfirm?.(); close(); }} />
    </>
  );

  return (
    <div className={className}>
      {!controlled && <Button label={trigger} variant={variant} emphasis="primary" intent={intent} onClick={() => setOpen(true)} />}
      {open && (
        <div className={`ui-modal__backdrop ${full ? "ui-modal__backdrop--full" : ""} ${leaving ? "is-leaving" : ""}`} onClick={cancel}>
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`ui-modal ui-modal--${size} ${full ? "" : `ui-surface ${vcls(variant)}`}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKey}
          >
            <Heading id={titleId}>{title}</Heading>
            {children ?? <p>{body}</p>}
            <div className="ui-modal__actions">{buttons}</div>
          </div>
        </div>
      )}
    </div>
  );
}
