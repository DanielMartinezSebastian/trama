/**
 * Color semántico común a todo el kit: la misma palabra y el mismo color en Button, Badge, Alert, TextField, Toast y
 * Modal. Las clases `.ui-intent--<intent>` (ui-kit.css) fijan `--tone` (lo que leen insignias, avisos y campos) y
 * `--acc` (lo que leen los botones y lo que va dentro), con los tokens semánticos `--ok --info --warn --bad`.
 *
 * - `accent`  el acento del tema (por defecto en botones e insignias)
 * - `neutral` el color del texto: sin connotación
 * - `success` bien hecho, guardado, disponible
 * - `info`    dato o aviso informativo
 * - `warning` atención: revisar antes de seguir
 * - `danger`  error, fallo o acción destructiva
 */
export const INTENTS = ["accent", "neutral", "success", "info", "warning", "danger"] as const;
export type Intent = (typeof INTENTS)[number];

/** Nombres antiguos que se siguen aceptando (Badge usaba `warn`; Alert, TextField y Toast usaban `error`). */
export type LegacyIntent = "warn" | "error";

/** Normaliza un intent que puede venir con un nombre antiguo. */
export function toIntent(value: Intent | LegacyIntent | undefined, fallback: Intent): Intent {
  if (value === "warn") return "warning";
  if (value === "error") return "danger";
  return value ?? fallback;
}

/** Clase CSS del intent. */
export const intentCls = (intent: Intent) => `ui-intent--${intent}`;
