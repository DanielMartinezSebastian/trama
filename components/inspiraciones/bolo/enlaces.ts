/** ruta dentro de Bolo: `boloHref("flota")` → `/inspiraciones/bolo/flota` */
export const boloHref = (path = "") => `/inspiraciones/bolo${path ? `/${path.replace(/^\//, "")}` : ""}`;
