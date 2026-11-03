/** ruta dentro de Grano: `granoHref("trabajo")` → `/inspiraciones/grano/trabajo` */
export const granoHref = (path = "") => `/inspiraciones/grano${path ? `/${path.replace(/^\//, "")}` : ""}`;
