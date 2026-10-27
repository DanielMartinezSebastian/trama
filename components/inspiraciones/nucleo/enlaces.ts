/** ruta dentro de Núcleo: `nucleoHref("clases")` → `/inspiraciones/nucleo/clases` */
export const nucleoHref = (path = "") => `/inspiraciones/nucleo${path ? `/${path.replace(/^\//, "")}` : ""}`;
