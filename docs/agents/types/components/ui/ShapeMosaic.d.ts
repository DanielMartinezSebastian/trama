import { type CSSProperties } from "react";
export type ShapeMosaicItem = {
    shape: "circle" | "square";
    /** 1 = el acento · 2 = el acento aclarado · 3 = el acento muy claro · 0 = hueco */
    tone?: 0 | 1 | 2 | 3;
    /** foto dentro de la forma (opcional) */
    src?: string;
    alt?: string;
};
export type ShapeMosaicProps = {
    /** las formas en orden de lectura, o una por línea: «circle|1|/img/foto.jpg|texto alternativo» */
    items?: ShapeMosaicItem[] | string;
    columns?: number;
    /** separación entre formas en cualquier unidad CSS */
    gap?: string;
    /** las fotos se funden en el color de su forma a medida que el mosaico sale por arriba */
    dissolve?: boolean;
    /** px que se desplazan las columnas, en sentidos alternos, mientras el mosaico cruza la pantalla (0 = quietas) */
    drift?: number;
    className?: string;
    style?: CSSProperties;
};
/**
 * Mosaico de formas (círculos y cuadrados) en tres tonos del acento, con foto dentro de algunas; al bajar, las columnas se
 * desplazan en sentidos alternos y las fotos se disuelven en el color de su forma hasta dejar pura geometría (Il Colorista,
 * docs/50 §3.1). Los tonos salen de `--acc` mezclado con `--bg`, así que cambian con el tema. Con movimiento reducido,
 * quieto y con las fotos.
 */
export default function ShapeMosaic({ items, columns, gap, dissolve, drift, className, style }: ShapeMosaicProps): import("react").JSX.Element;
