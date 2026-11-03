/** ruta dentro de Llave: `llaveHref("residencias")` → `/inspiraciones/llave/residencias` */
export const llaveHref = (path = "") => `/inspiraciones/llave${path ? `/${path.replace(/^\//, "")}` : ""}`;
