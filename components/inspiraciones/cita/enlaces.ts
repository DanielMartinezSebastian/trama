/** ruta dentro de Cita: `citaHref("locales/chueca")` → `/inspiraciones/cita/locales/chueca` */
export const citaHref = (path = "") => `/inspiraciones/cita${path ? `/${path.replace(/^\//, "")}` : ""}`;
