import type { CSSProperties } from "react";
import { type TokenSet } from "./tokens.js";
/**
 * Guías de estilo: sistemas completos sacados de lo que comparten las webs premiadas (docs/16-guias-de-estilo-plan.md).
 *
 * Un tema (`TokenSet`) solo fija colores y fuentes. Una guía fija además la **escala tipográfica** (dos escalones de titular:
 * marca 12–18 vw y titular 3–8 vw), el **espacio** (margen lateral, columnas, separación, aire entre secciones), las
 * **superficies** (radio, línea, sombra) y el **movimiento** (duraciones, curvas, stagger), con los valores medidos en las
 * premiadas. `guideToStyle()` lo publica como variables CSS `--g-*` en un contenedor y las clases `ui-g-*`
 * (`components/ui/styles/ui-guides.css`) las aplican; `GuideFrame` hace las dos cosas.
 *
 * Las siete últimas (salón, barbería, club, boutique, academia de autor, escuela amarilla, producto de marca) son las
 * familias de los estudios por sector: salen del cuaderno del laboratorio (docs/cuaderno, docs/53) y sus valores, de los
 * pares medidos con `refs:probe --par` contra las webs de referencia (docs/50 E10).
 *
 * Las cuatro del final (terminal, pixel, puntos, papel) son la estética propia del repo: las páginas de Trama que
 * `refs:probe --repo` no podía asignar a ninguna de las anteriores, con sus valores medidos en ellas (docs/54).
 *
 * Fuentes: todas libres. Switzer y General Sans (Fontshare, licencia ITF: uso comercial y web, pero sin redistribuir los
 * archivos) se nombran por familia con una de Google detrás: si la web carga la hoja de Fontshare, se usan; si no, cae a la
 * alternativa (`GUIDE_FONTSHARE_CSS`).
 */
export type GuideHero = "split-video" | "framed-object" | "marquee-window" | "asym-editorial" | "product-center" | "collage-manifesto" | "dark-data" | "wordmark";
export type GuideStory = "chapters" | "object" | "product" | "manifesto" | "index" | "world" | "timeline" | "before-after" | "webfilm" | "service";
export type StyleGuide = {
    id: string;
    label: string;
    /** para qué sirve, en una frase */
    note: string;
    /** sectores donde encaja */
    sectors: string;
    /** webs premiadas medidas de las que sale (docs/16 §5.1) */
    refs: string[];
    /** de dónde sale: premiadas = webs de Awwwards medidas (docs/16) · sectores = estudios por sector y sus réplicas medidas
     * (docs/50) · repo = la estética propia de las demos y webs de Trama (docs/54) */
    source?: "premiadas" | "sectores" | "repo";
    /** variante de estilo sugerida para los componentes del kit (`variant`) */
    variant: "editorial" | "minimal" | "outline" | "retro" | "glass";
    tokens: TokenSet;
    fonts: {
        display: string;
        body: string;
        accent: string;
        mono: string;
    };
    type: {
        /** marca o portada, con clamp() */
        brand: string;
        /** titular de sección */
        h1: string;
        h2: string;
        body: string;
        label: string;
        weight: number;
        lineHeight: number;
        /** tracking del titular, en em */
        tracking: number;
        upper: boolean;
        /** mayúsculas y tracking de las etiquetas (o mono a 0) */
        labelUpper: boolean;
        labelTracking: number;
        bodyLineHeight: number;
    };
    space: {
        margin: string;
        gutter: string;
        cols: number;
        section: string;
        header: string;
        measure: string;
    };
    surface: {
        radius: number;
        pill: boolean;
        shadow: boolean;
    };
    motion: {
        fast: number;
        reveal: number;
        page: number;
        stagger: number;
        ease: string;
        easeReveal: string;
    };
    /** composiciones del primer pantallazo que mejor le van (docs/16 §3) */
    heroes: GuideHero[];
    /** estructuras de relato que mejor le van (docs/16 §4) */
    stories: GuideStory[];
};
/** Curvas medidas (docs/16 §2): `expo.out` en CSS, la estándar de Material y la `easeOutQuart` de muchas premiadas. */
export declare const GUIDE_EASES: {
    expoOut: string;
    expoInOut: string;
    standard: string;
    quartOut: string;
    power2InOut: string;
    quintOut: string;
};
/** Hoja oficial de Fontshare con Switzer y General Sans (se sirve desde sus servidores; ver la nota de licencia arriba). */
export declare const GUIDE_FONTSHARE_CSS = "https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600&f[]=general-sans@400,500,600&display=swap";
export declare const STYLE_GUIDES: StyleGuide[];
/**
 * Las once reglas con las que `refs:probe --guides` mide cada guía (docs/16 §2): los rangos de las webs premiadas. La
 * lógica está en `scripts/probe-refs.mts`; aquí, el nombre de cada regla (el mismo texto en los dos sitios).
 */
export declare const GUIDE_RULES: readonly ["familias ≤ 3", "titular 3–8 vw, marca 12–18 vw o de borde a borde ≤ 50 vw", "interlineado del titular 0,8–1", "peso del titular 300–500 (o condensada/lúdica)", "tracking del titular 0 a −5 %", "texto 14–20 px", "interlineado del texto 1,3–1,6", "margen lateral 10–80 px o contenido centrado (escritorio)", "margen lateral 8–29 px (móvil)", "titular móvil 8–16 vw (marca hasta 50)", "sombras ≤ 2 (salvo lúdico o sombra dura)"];
/**
 * Excepciones medidas: rasgos de una familia que salen de los rangos de las premiadas generalistas y son justo lo que la
 * hace reconocible. Cada una lleva su medida y la web donde se midió (docs/16 §5.1b); sin eso sería un fallo.
 */
export declare const GUIDE_EXCEPTIONS: Record<string, {
    rule: (typeof GUIDE_RULES)[number];
    why: string;
}[]>;
export type StyleGuideId = (typeof STYLE_GUIDES)[number]["id"];
/** Guía por id (o la primera). */
export declare const guide: (id: string) => StyleGuide;
/**
 * Variables CSS de una guía para un contenedor: los tokens del tema (`tokensToStyle`) más `--g-*` (tipografía, espacio,
 * superficies y movimiento). Las clases `ui-g-*` de `ui-guides.css` las leen.
 */
export declare function guideToStyle(g: StyleGuide): CSSProperties;
