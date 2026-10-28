/** ruta dentro de Abuela Rosa: `abuelaHref("tienda")` → `/inspiraciones/abuela-rosa/tienda` */
export const abuelaHref = (path = "") => `/inspiraciones/abuela-rosa${path ? `/${path.replace(/^\//, "")}` : ""}`;
