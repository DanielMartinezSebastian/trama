/** ruta dentro de Marejada: `marejadaHref("flota")` → `/inspiraciones/marejada/flota` */
export const marejadaHref = (path = "") => `/inspiraciones/marejada${path ? `/${path.replace(/^\//, "")}` : ""}`;
