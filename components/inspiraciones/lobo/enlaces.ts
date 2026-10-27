/** ruta dentro de Lobo: `loboHref("clases")` → `/inspiraciones/lobo/clases` */
export const loboHref = (path = "") => `/inspiraciones/lobo${path ? `/${path.replace(/^\//, "")}` : ""}`;
