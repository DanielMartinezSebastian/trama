/** ruta dentro de Melena: `melenaHref("tienda")` → `/inspiraciones/melena/tienda` */
export const melenaHref = (path = "") => `/inspiraciones/melena${path ? `/${path.replace(/^\//, "")}` : ""}`;
