/** ruta dentro de Solera: `soleraHref("proyectos")` → `/inspiraciones/solera/proyectos` */
export const soleraHref = (path = "") => `/inspiraciones/solera${path ? `/${path.replace(/^\//, "")}` : ""}`;
