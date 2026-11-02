/** ruta dentro de Alba: `albaHref("viviendas")` → `/inspiraciones/alba/viviendas` */
export const albaHref = (path = "") => `/inspiraciones/alba${path ? `/${path.replace(/^\//, "")}` : ""}`;
