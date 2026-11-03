/** ruta dentro de PLENO: `plenoHref("programa")` → `/inspiraciones/pleno/programa` */
export const plenoHref = (path = "") => `/inspiraciones/pleno${path ? `/${path.replace(/^\//, "")}` : ""}`;
