import type { CSSProperties } from "react";
/**
 * Tokens del tema vigentes en `el`, como estilo en línea. Sirve a los overlays que tienen que salir a `document.body` con un
 * portal (porque algún ancestro con `backdrop-filter`, `transform` o `filter` atraparía su `position: fixed`) sin perder el
 * tema: el nodo del portal lleva los mismos tokens y la misma tipografía base que el sitio donde vive el componente.
 */
export declare function themeSnapshot(el: Element): CSSProperties;
