/** ruta dentro de Bocado: `bocadoHref("carta")` → `/inspiraciones/bocado/carta` */
export const bocadoHref = (path = "") => `/inspiraciones/bocado${path ? `/${path.replace(/^\//, "")}` : ""}`;
