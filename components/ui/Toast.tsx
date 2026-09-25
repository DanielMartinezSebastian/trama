"use client";

import { useEffect, useId, type CSSProperties } from "react";
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
  /**
   * cómo se muestra el color del `intent`: bar = barra lateral + icono · icon = solo el icono · tint = fondo teñido ·
   * mono = sin color de estado (icono en el acento del tema; para temas monocromos)
   */
  intentStyle?: "bar" | "icon" | "tint" | "mono";
  /** svg = iconos de sonner · glyph = glifos de texto (✓ i ! ×) · none = sin icono · auto = glyph en terminal, retro y dotmatrix */
  icons?: "auto" | "svg" | "glyph" | "none";
  /** botón × para cerrar */
  closeButton?: boolean;
  /** segundos en pantalla */
  duration?: number;
  /** texto de un botón de acción dentro de la notificación ("" = sin botón) */
  actionLabel?: string;
  /** qué hace el botón de acción (por defecto, solo cierra la notificación) */
  onAction?: () => void;
  /** muestra la pila desplegada en vez de amontonada */
  expand?: boolean;
  /** cambia (a más de 0) para lanzar una notificación desde fuera, igual que Modal/Drawer */
  playKey?: number;
  /** id fijo del Toaster: con él, código externo puede lanzar en la misma instancia pasando `toasterId` */
  id?: string;
  /** oculta el botón de demostración «Mostrar notificación», cuando el disparo lo controla el proyecto */
  showTrigger?: boolean;
  className?: string;
};

const GLYPH_VARIANTS: Variant[] = ["terminal", "retro", "dotmatrix"];
const glyph = (c: string) => <span className="ui-toast__glyph">{c}</span>;
const GLYPHS = { success: glyph("✓"), info: glyph("i"), warning: glyph("!"), error: glyph("×") };
const NO_ICONS = { success: null, info: null, warning: null, error: null, loading: null };

/**
 * Notificación temporal apilable. Construida sobre `sonner` (apilado, temporizador, gestos táctiles
 * y accesibilidad ya resueltos por una librería consolidada) en vez de reimplementarlo: solo se le da
 * el aspecto del kit por encima, con `unstyled` + clases `ui-toast*` que leen tokens y `--s-*`.
 * Cada instancia usa un `id` propio (o el que le pases) para no cruzarse con otras — p. ej. en
 * «Comparar los estilos», donde conviven varios `<Toaster>` a la vez, o cuando otra parte de la página
 * necesita lanzar en la misma instancia con `toast.success(msg, { toasterId })`.
 *
 * Se adapta al tema sin reglas por proyecto: hereda la tipografía del contenedor (sonner impone la suya y aquí se anula),
 * tiene siempre una base opaca bajo la superficie de la variante (flota sobre cualquier contenido) y el color de estado
 * se puede atenuar hasta desaparecer (`intentStyle="mono"`) en temas monocromos.
 */
export default function Toast({
  intent,
  loading,
  kind,
  title = "Cambios guardados",
  description = "Tu perfil se actualizó correctamente.",
  position = "bottom-right",
  variant = "glass",
  intentStyle = "bar",
  icons = "auto",
  closeButton = false,
  duration = 4,
  actionLabel = "",
  onAction,
  expand = false,
  playKey = 0,
  id,
  showTrigger = true,
  className = "",
}: ToastProps) {
  const autoId = useId();
  const toasterId = id ?? autoId;
  const iconSet = icons === "auto" ? (GLYPH_VARIANTS.includes(variant) ? "glyph" : "svg") : icons;

  const fire = () => {
    const opts = {
      description: description || undefined,
      toasterId,
      action: actionLabel ? { label: actionLabel, onClick: () => onAction?.() } : undefined,
    };
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
        duration={duration * 1000}
        closeButton={closeButton}
        expand={expand}
        icons={iconSet === "glyph" ? GLYPHS : iconSet === "none" ? NO_ICONS : undefined}
        // sonner fija su propia fuente en el contenedor: se devuelve la del tema
        style={{ fontFamily: "inherit" } as CSSProperties}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: `ui-toast ui-toast--${intentStyle} ui-surface ${vcls(variant)}`,
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
