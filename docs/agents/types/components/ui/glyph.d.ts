import { type ReactNode } from "react";
/**
 * Para los componentes del kit que reciben un "glifo" como texto (`glyph="→"`, los `items` de FeatureGrid…):
 * `"icon:heart"` (o `"icon:heart:sharp"`) se dibuja como el icono de ese nombre en la familia del `IconSet` que lo rodea
 * (pixel art si no hay); cualquier otra cadena pasa tal cual, así que lo existente no cambia. Un nombre que no está en
 * el set se devuelve como texto — el error de tecleo se ve en pantalla en vez de desaparecer.
 *
 * Vive fuera de `Icon.tsx` («use client») para que Button, Footer, Timeline… puedan llamarla desde un Server Component.
 */
export declare function renderGlyph(glyph: string, size?: number | string): ReactNode;
