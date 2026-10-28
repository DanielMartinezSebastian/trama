/** ruta dentro de Remada: `remadaHref("viajes")` → `/inspiraciones/remada/viajes` */
export const remadaHref = (path = "") => `/inspiraciones/remada${path ? `/${path.replace(/^\//, "")}` : ""}`;
