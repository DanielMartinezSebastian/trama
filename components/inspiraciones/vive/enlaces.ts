/** ruta dentro de Vive: `viveHref("clases")` → `/inspiraciones/vive/clases` */
export const viveHref = (path = "") => `/inspiraciones/vive${path ? `/${path.replace(/^\//, "")}` : ""}`;
