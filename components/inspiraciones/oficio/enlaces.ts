/** ruta dentro de Oficio: `oficioHref("programas")` → `/inspiraciones/oficio/programas` */
export const oficioHref = (path = "") => `/inspiraciones/oficio${path ? `/${path.replace(/^\//, "")}` : ""}`;
