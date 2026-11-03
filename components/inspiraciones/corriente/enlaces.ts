/** ruta dentro de Nada Corriente: `corrienteHref("proyectos")` → `/inspiraciones/corriente/proyectos` */
export const corrienteHref = (path = "") => `/inspiraciones/corriente${path ? `/${path.replace(/^\//, "")}` : ""}`;
