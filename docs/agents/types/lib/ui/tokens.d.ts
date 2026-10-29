import type { CSSProperties } from "react";
/**
 * Tokens de diseño que consumen todos los componentes de `components/ui/`.
 * Un tema es solo un objeto de tokens: cambiarlo no toca ningún componente.
 */
export type TokenSet = {
    bg: string;
    fg: string;
    mut: string;
    acc: string;
    acc2: string;
    card: string;
    ln: string;
    /** radio en px */
    r: number;
    font: string;
    /** fuente de los titulares (h1–h3); sin ella heredan `font` */
    display?: string;
    /** halo de legibilidad (texto encima de un fondo animado); de serie, ninguno */
    legibility?: boolean;
    /** fuente de acento (cursiva dentro de un titular, `<em>`); se publica como `--font-accent` */
    accentFont?: string;
    /** fuerza los brillos de texto (neón, dot matrix…) a true/false; por defecto, solo con texto claro */
    glow?: boolean;
};
/** Tema por defecto del kit: el mismo que fija `:root` en `components/ui/styles/kit.css`. */
export declare const neutralTokens: TokenSet;
/**
 * Tema monocromo de matriz de puntos: negro puro, texto gris claro, acento blanco. Pensado para la variante `dotmatrix` y para
 * `RetroCanvas` (ASCII de puntos + scanlines), pero es un tema más: vale con cualquier variante.
 */
export declare const dotmatrixTokens: TokenSet;
/**
 * Tema editorial claro («papel»): fondo hueso, tinta casi negra y un acento naranja. Pensado para la variante `editorial`
 * (estudios, portfolios, marcas con fotografía) y para tipografía grande; vale con cualquier variante. Titulares en Inter Tight,
 * texto en Inter y cursiva de acento en Instrument Serif (`FONT_PAIRINGS`, par «estudio»).
 */
export declare const editorialTokens: TokenSet;
/** Tema editorial oscuro («tinta»): el mismo carácter sobre negro cálido. */
export declare const editorialDarkTokens: TokenSet;
/**
 * Tema «plano técnico» (fórmula de Heron AI): papel hueso con grano, tinta casi negra y un único acento naranja. Pensado para webs
 * de producto técnico: marcos de línea fina, etiquetas mono en mayúsculas y titulares gruesos y apretados.
 */
export declare const blueprintTokens: TokenSet;
/**
 * Tema «bosque» (fórmula de Belgrade Arbor): verde profundo, crema y oro, con serif elegante en los titulares. Pensado para
 * arquitectura, inmobiliario, hostelería y marcas de lujo tranquilo.
 */
export declare const forestTokens: TokenSet;
/**
 * Tema «voltaje» (fórmula de Lando Norris, sitio del año 2025): verde oliva casi negro, texto hueso y un único amarillo ácido.
 * Titulares en palo seco grueso y mayúsculas con palabras sueltas en serifa de alto contraste (`SplitText emphasis`). Deporte,
 * atletas, motor, marcas personales con mucha fotografía.
 */
export declare const voltTokens: TokenSet;
/**
 * Tema «producto nocturno» (Linear, Raycast): negro casi puro, texto blanco roto, grises fríos y un violeta de acento que se usa
 * poco. Titulares en Inter de peso medio y tracking negativo; etiquetas en mono. SaaS, herramientas para desarrolladores.
 */
export declare const nightTokens: TokenSet;
/**
 * Tema «escritorio Y2K» (Poolsuite): rosa de piscina, ventanas de sistema operativo antiguo con borde de tinta y un azul de
 * botón. Cuerpo en mono, titulares en pixel. Radios, música, comunidades y marcas con humor; con la variante `retro`.
 */
export declare const poolTokens: TokenSet;
/**
 * Registro de temas del kit. **Añadir un tema = añadir una entrada aquí**: el selector de `/componentes`, el paquete
 * (`trama-ui/tokens`) y la tabla de `docs/README.md` lo recogen solos (la última, con `npm run catalog`). No hay límite:
 * un tema es solo un objeto de tokens (ver «Temas del kit» en la guía, §2.5).
 * `variant` es la variante de estilo que mejor le sienta (una sugerencia: cualquier tema vale con cualquier variante).
 */
export type KitTheme = {
    id: string;
    label: string;
    note: string;
    variant: string;
    tokens: TokenSet;
};
export declare const TOKEN_THEMES: KitTheme[];
/**
 * ¿Es oscuro el texto de este tema? Con texto oscuro sobre fondo claro **no debe haber brillos ni sombras de texto**: un
 * brillo oscuro alrededor de letras oscuras las empasta y estorba la lectura. El kit lo resuelve con la variable `--glow`
 * (0 = sin brillos, 1 = con ellos) que escala todos los `text-shadow` de color. Se decide por la luminancia del texto (o,
 * si no se puede leer, por la del fondo); sin datos, se asume tema oscuro (el de por defecto del kit).
 */
export declare function hasDarkText(t: Pick<TokenSet, "fg" | "bg">): boolean;
/** Convierte tokens en variables CSS para el contenedor (`style={tokensToStyle(...)}`). */
export declare function tokensToStyle(t: TokenSet): CSSProperties;
/** Lee un token desde el DOM (para canvas): `token(el, "--acc")`. */
export declare function token(el: Element, name: string, fallback?: string): string;
/**
 * Tipografías que ofrece el selector de tokens del catálogo (`/componentes`).
 * Las que llevan `var(--font-*)` vienen de Google, autoalojadas por `next/font`
 * en `lib/ui/fonts.ts` (sin petición externa en runtime); las "del sistema" son
 * el *fallback* sin fuente web, para cuando no hace falta descargar nada. Una
 * fuente local propia (de marca) se añade igual: `next/font/local` en
 * `lib/ui/fonts.ts` + una entrada aquí con su `var(--font-...)`.
 */
export declare const FONT_PRESETS: {
    id: string;
    label: string;
    stack: string;
}[];
export type TokenOverrides = Partial<{
    bg: string;
    fg: string;
    mut: string;
    acc: string;
    acc2: string;
    r: number;
    font: string;
}>;
/** Aplica cambios manuales sobre un tema; card y ln se derivan de fg si este se modifica. */
export declare function applyOverrides(base: TokenSet, o: TokenOverrides): TokenSet;
/** Valor válido para `<input type="color">` (solo acepta #rrggbb). */
export declare const toHex: (c: string, fallback?: string) => string;
/**
 * Pares tipográficos para la variante `editorial`: `display` para titulares (con tracking negativo), `body` para texto,
 * `accent` para palabras en cursiva dentro de un titular (`<em>`) y `mono` para etiquetas. Los stacks son los de `FONT_PRESETS`.
 * Uso: `tokensToStyle({ ..., font: pair.body, display: pair.display })` y `--font-accent: pair.accent` en el contenedor.
 */
export declare const FONT_PAIRINGS: {
    id: string;
    label: string;
    note: string;
    display: string;
    body: string;
    accent: string;
    mono: string;
}[];
