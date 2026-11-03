/** ruta dentro de Nácar: `nacarHref("acceso")` → `/inspiraciones/nacar/acceso` */
export const nacarHref = (path = "") => `/inspiraciones/nacar${path ? `/${path.replace(/^\//, "")}` : ""}`;
