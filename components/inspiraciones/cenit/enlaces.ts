/** ruta dentro de Cénit: `cenitHref("proyectos")` → `/inspiraciones/cenit/proyectos` */
export const cenitHref = (path = "") => `/inspiraciones/cenit${path ? `/${path.replace(/^\//, "")}` : ""}`;
