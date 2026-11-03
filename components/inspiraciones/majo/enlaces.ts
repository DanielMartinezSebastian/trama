/** ruta dentro de Majo: `majoHref("producto")` → `/inspiraciones/majo/producto` */
export const majoHref = (path = "") => `/inspiraciones/majo${path ? `/${path.replace(/^\//, "")}` : ""}`;
