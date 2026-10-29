export type ImageRevealProps = {
    src: string;
    /** texto alternativo (vacío = decorativa) */
    alt?: string;
    /** relación de aspecto «ancho / alto» fija: reserva el hueco y evita saltos de maquetación */
    ratio?: string;
    /** lado desde el que se abre la máscara */
    from?: "bottom" | "top" | "left" | "right" | "center";
    /** la imagen arranca ampliada y se asienta mientras se abre */
    zoom?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    className?: string;
};
/**
 * Imagen que se descubre con una máscara (`clip-path`) mientras la propia imagen se asienta de una ampliación a su tamaño.
 * Espera al `Preloader` si lo hay. Reserva su hueco con `ratio`, carga diferida y sin JS o con `prefers-reduced-motion` se
 * ve ya abierta. El estado cerrado viene en el HTML del servidor (sin parpadeo).
 */
export default function ImageReveal({ src, alt, ratio, from, zoom, duration, delay, once, className }: ImageRevealProps): import("react").JSX.Element;
