/** ruta dentro de Cantera: `canteraHref("ofertas")` → `/inspiraciones/cantera/ofertas` */
export const canteraHref = (path = "") => `/inspiraciones/cantera${path ? `/${path.replace(/^\//, "")}` : ""}`;
