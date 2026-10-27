/** ruta dentro de Talla: `tallaHref("horario")` → `/inspiraciones/talla/horario` */
export const tallaHref = (path = "") => `/inspiraciones/talla${path ? `/${path.replace(/^\//, "")}` : ""}`;
