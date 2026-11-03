/** ruta dentro de Tueste: `tuesteHref("catalogo")` → `/inspiraciones/tueste/catalogo` */
export const tuesteHref = (path = "") => `/inspiraciones/tueste${path ? `/${path.replace(/^\//, "")}` : ""}`;
