/** ruta dentro de Nimbo: `nimboHref("precios")` → `/inspiraciones/nimbo/precios` */
export const nimboHref = (path = "") => `/inspiraciones/nimbo${path ? `/${path.replace(/^\//, "")}` : ""}`;
