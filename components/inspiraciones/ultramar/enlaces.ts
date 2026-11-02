/** ruta dentro de Ultramar: `ultramarHref("seguimiento")` → `/inspiraciones/ultramar/seguimiento` */
export const ultramarHref = (path = "") => `/inspiraciones/ultramar${path ? `/${path.replace(/^\//, "")}` : ""}`;
