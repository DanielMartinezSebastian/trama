/** ruta dentro de Matiz: `matizHref("servicios")` → `/inspiraciones/matiz/servicios` */
export const matizHref = (path = "") => `/inspiraciones/matiz${path ? `/${path.replace(/^\//, "")}` : ""}`;
