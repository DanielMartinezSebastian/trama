/** ruta dentro de Impulso: `impulsoHref("tarifas")` → `/inspiraciones/impulso/tarifas` */
export const impulsoHref = (path = "") => `/inspiraciones/impulso${path ? `/${path.replace(/^\//, "")}` : ""}`;
