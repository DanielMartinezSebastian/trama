/** ruta dentro de Brasa: `brasaHref("trabajos")` → `/inspiraciones/brasa/trabajos` */
export const brasaHref = (path = "") => `/inspiraciones/brasa${path ? `/${path.replace(/^\//, "")}` : ""}`;
