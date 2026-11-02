/** ruta dentro de Sesión Doble: `sesionHref("indice")` → `/inspiraciones/sesion-doble/indice` */
export const sesionHref = (path = "") => `/inspiraciones/sesion-doble${path ? `/${path.replace(/^\//, "")}` : ""}`;
