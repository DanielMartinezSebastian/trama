"use client";

import { useEffect, useId } from "react";
import { Toaster, toast as sonnerToast } from "sonner";
import Button from "./Button";
import { toIntent, type Intent } from "./intent";
import { vcls, type Variant } from "./variants";

export type ToastProps = {
  /** color semántico común (ver intent.ts); `accent` y `neutral` dan un mensaje sin icono de estado */
  intent?: Intent;
  /** notificación de «en curso», con indicador de carga (ignora `intent`) */
  loading?: boolean;
  /** @deprecated usa `intent` (y `loading`): "message" | "loading" | "success" | "info" | "warning" | "danger" | "error" */
  kind?: "message" | "loading" | "success" | "info" | "warning" | "danger" | "error";
  title?: string;
  description?: string;
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  variant?: Variant;
  /** cambia (a más de 0) para lanzar una notificación desde fuera, igual que Modal/Drawer */
  playKey?: number;
  /** id fijo del Toaster: con él, código externo puede lanzar en la misma instancia pasando `toasterId` */
  id?: string;
  /** oculta el botón de demostración «Mostrar notificación», cuando el disparo lo controla el proyecto */
  showTrigger?: boolean;
  className?: string;
};

/**
 * Notificación temporal apilable. Construida sobre `sonner` (apilado, temporizador, gestos táctiles
 * y accesibilidad ya resueltos por una librería consolidada) en vez de reimplementarlo: solo se le da
 * el aspecto del kit por encima, con `unstyled` + clases `ui-toast*` que leen tokens y `--s-*`.
 * Cada instancia usa un `id` propio (o el que le pases) para no cruzarse con otras — p. ej. en
 * «Comparar los 7 estilos», donde conviven 7 `<Toaster>` a la vez, o cuando otra parte de la página
 * necesita lanzar en la misma instancia con `toast.success(msg, { toasterId })`.
 */
export default function Toast({
  intent,
  loading,
  kind,
  title = "Cambios guardados",
  description = "Tu perfil se actualizó correctamente.",
  position = "bottom-right",
  variant = "glass",
  playKey = 0,
  id,
  showTrigger = true,
  className = "",
}: ToastProps) {
  const autoId = useId();
  const toasterId = id ?? autoId;

  const fire = () => {
    const opts = { description: description || undefined, toasterId };
    const isLoading = loading ?? kind === "loading";
    const i = intent ?? (kind === "message" ? "neutral" : kind === "loading" || kind === undefined ? "success" : toIntent(kind, "success"));
    if (isLoading) sonnerToast.loading(title, opts);
    else if (i === "accent" || i === "neutral") sonnerToast(title, opts);
    else sonnerToast[i === "danger" ? "error" : i](title, opts);
  };

  useEffect(() => {
    if (playKey > 0) fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playKey]);

  return (
    <div className={className}>
      <Toaster
        id={toasterId}
        position={position}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: `ui-toast ui-surface ${vcls(variant)}`,
            title: "ui-toast__title",
            description: "ui-toast__desc",
            actionButton: "ui-toast__action",
            cancelButton: "ui-toast__cancel",
            closeButton: "ui-toast__close",
            icon: "ui-toast__icon",
          },
        }}
      />
      {showTrigger && <Button label="Mostrar notificación" variant={variant} emphasis="primary" onClick={fire} />}
    </div>
  );
}
