/** ruta dentro de Zanco: `zancoHref("tienda")` → `/inspiraciones/zanco/tienda` */
export const zancoHref = (path = "") => `/inspiraciones/zanco${path ? `/${path.replace(/^\//, "")}` : ""}`;
