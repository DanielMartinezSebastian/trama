/** ruta dentro de Vencejo: `vencejoHref("configurador")` → `/inspiraciones/vencejo/configurador` */
export const vencejoHref = (path = "") => `/inspiraciones/vencejo${path ? `/${path.replace(/^\//, "")}` : ""}`;
