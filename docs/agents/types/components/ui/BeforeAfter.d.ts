import { type ReactNode } from "react";
import { type Variant } from "./variants.js";
export type BeforeAfterProps = {
    /** lo de antes: una imagen (`<img>`), un vídeo o cualquier contenido; ocupa toda la caja */
    before: ReactNode;
    /** lo de después, encima; el deslizador lo recorta */
    after: ReactNode;
    /** rótulos de cada lado ("" para ocultarlos) */
    beforeLabel?: string;
    afterLabel?: string;
    /** posición inicial del corte, 0–100 (% de lo de después que se ve desde la izquierda o desde arriba) */
    initial?: number;
    /** horizontal = el corte es vertical y se mueve a izquierda y derecha · vertical = se mueve arriba y abajo */
    orientation?: "horizontal" | "vertical";
    /** slider = arrastrar el corte · toggle = un botón alterna entre los dos (día/noche, apagado/encendido) */
    mode?: "slider" | "toggle";
    /** proporción de la caja (ancho / alto) */
    ratio?: number;
    /** nombre accesible del control ("Comparar antes y después") */
    label?: string;
    variant?: Variant;
    className?: string;
};
/**
 * Antes / después con control del usuario (docs/11 §5, docs/15 §3): un corte que se arrastra (`role="slider"`, teclado con
 * flechas, Inicio y Fin) o un botón que alterna. Para limpiezas, reformas, tratamientos, día/noche. Regla de honestidad
 * (docs/19 §5): las dos imágenes con la misma luz y el mismo encuadre; el componente no añade filtros a ninguna.
 */
export default function BeforeAfter({ before, after, beforeLabel, afterLabel, initial, orientation, mode, ratio, label, variant, className }: BeforeAfterProps): import("react").JSX.Element;
