/** ruta dentro de Turia Grotesk: `turiaHref("probar")` → `/inspiraciones/turia/probar` */
export const turiaHref = (path = "") => `/inspiraciones/turia${path ? `/${path.replace(/^\//, "")}` : ""}`;
