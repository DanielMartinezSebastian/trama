/** ruta dentro de Pulso Lento: `pulsoHref("gira")` → `/inspiraciones/pulso-lento/gira` */
export const pulsoHref = (path = "") => `/inspiraciones/pulso-lento${path ? `/${path.replace(/^\//, "")}` : ""}`;
