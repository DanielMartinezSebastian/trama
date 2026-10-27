/** ruta dentro de Raíz: `raizHref("trabajos")` → `/inspiraciones/raiz/trabajos` */
export const raizHref = (path = "") => `/inspiraciones/raiz${path ? `/${path.replace(/^\//, "")}` : ""}`;
