/** ruta dentro de No mires abajo: `abajoHref("jugar")` → `/inspiraciones/no-mires-abajo/jugar` */
export const abajoHref = (path = "") => `/inspiraciones/no-mires-abajo${path ? `/${path.replace(/^\//, "")}` : ""}`;
