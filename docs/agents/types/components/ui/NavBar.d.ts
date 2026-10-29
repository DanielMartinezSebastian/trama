import { type ReactNode } from "react";
import { type Variant } from "./variants.js";
export type NavBarLayout = "classic" | "left" | "right" | "center" | "split" | "stacked" | "minimal";
export type NavBarProps = {
    brand?: string;
    /**
     * Enlaces. Simple: separados por comas ("Clases, Tablas, Precios"). Con submenús o descripciones: una sección por línea.
     * - `Etiqueta=/ruta` o `Etiqueta=#seccion` → enlace real (sin `=`, un botón que solo marca el activo)
     * - `Etiqueta [nuevo]` → insignia
     * - `Sección > Hijo; Hijo|descripción|icon:nombre; Hijo=/ruta` → submenú (hijos por `;`, campos por `|`)
     * - dentro de un submenú, `#Categoría` abre una columna con título: `Tienda > #Tablas; Softboard; Longboard; #Neoprenos; 3/2; 4/3`
     */
    links?: string;
    cta?: string;
    /** segunda llamada a la acción, más discreta ("Entrar") */
    secondaryCta?: string;
    onCta?: () => void;
    onSecondaryCta?: () => void;
    defaultActive?: number;
    /** click = el activo es el último pulsado · scroll = el de la sección visible (enlaces `=#id`) */
    activeOn?: "click" | "scroll";
    variant?: Variant;
    /**
     * disposición: classic = marca · enlaces · acciones · left = enlaces junto a la marca · right = enlaces junto a las acciones ·
     * center = enlaces centrados de verdad · split = marca en el centro · stacked = dos filas (arriba marca, búsqueda y
     * acciones; abajo las secciones) · minimal = marca y menú (siempre plegado)
     */
    layout?: NavBarLayout;
    /**
     * orden libre de las piezas (sustituye a `layout`): `brand links search actions spacer menu`, separadas por espacios.
     * `|` empieza otra fila y `/` separa columnas alineadas a izquierda, centro y derecha. Ej.: "brand / links / search actions"
     */
    slots?: string;
    /** forma de la barra: full = de borde a borde · contained = de borde a borde con el contenido centrado · floating = píldora ·
     * island = tarjeta con el radio de la variante (por defecto) · transparent = sin fondo (lo gana al bajar con sticky) · underline = solo una línea inferior */
    shape?: "full" | "contained" | "floating" | "island" | "transparent" | "underline";
    /** al pasar por un enlace: color = solo cambia de color · underline = además, una raya que crece de izquierda a derecha bajo
     * el texto (Hair Me Up, Marco Ambrosi, Core Atelier: docs/cuaderno, el hover de navegación más repetido) */
    linkHover?: "color" | "underline";
    /** ocupa el ancho de la ventana aunque su contenedor sea más estrecho (para barras de borde a borde dentro de un layout con márgenes) */
    bleed?: boolean;
    /** @deprecated usa `shape="floating"` */
    floating?: boolean;
    /** densidad */
    size?: "sm" | "md" | "lg";
    /** con `layout="classic"`: dónde van los enlaces entre la marca y las acciones */
    linksAlign?: "start" | "center" | "end";
    /** auto = mega si algún hijo lleva descripción, icono o categoría · dropdown = lista · mega = panel ancho */
    menuStyle?: "auto" | "dropdown" | "mega";
    /** hover = se abren al pasar el ratón (y con clic/teclado) · click = solo con clic/teclado */
    openOn?: "hover" | "click";
    /** none · bar = barra de búsqueda ancha · inline = campo compacto · button = icono → paleta · command = botón «Buscar… ⌘K» → paleta */
    search?: "none" | "bar" | "inline" | "button" | "command";
    searchPlaceholder?: string;
    /** entradas extra de la búsqueda, además de los enlaces: "Cambiar contraseña=/cuenta, Estado del servicio=/status" */
    searchItems?: string;
    /** al elegir un resultado o un enlace; si no se pasa, los que tienen ruta navegan */
    onNavigate?: (item: {
        label: string;
        href?: string;
    }) => void;
    /** al pulsar Enter en la búsqueda sin resultado elegido */
    onSearch?: (query: string) => void;
    /** ancho (px) del contenedor por debajo del cual se pliega en menú móvil · 0 = nunca */
    collapseAt?: number;
    /** drawer = panel lateral · sheet = hoja bajo la barra */
    mobileMenu?: "drawer" | "sheet";
    /** franja de anuncio sobre la barra ("" = sin franja) */
    announcement?: string;
    /**
     * barra de utilidades sobre la barra principal (webs corporativas: inversores, empleo, prensa, área de cliente, idioma).
     * Enlaces separados por comas (`Empleo=/empleo, Inversores=/inversores`); tras `|`, los de la derecha (`| ES=/es, EN=/en`)
     */
    utility?: string;
    /** `position: sticky` arriba del contenedor con scroll */
    sticky?: boolean;
    /** con sticky: elevate = sombra y fondo al bajar · hide = se oculta al bajar y vuelve al subir */
    scrollFx?: "none" | "elevate" | "hide" | "elevate-hide";
    /** acciones propias junto a las llamadas a la acción (selector de tema, avatar…) */
    children?: ReactNode;
    className?: string;
};
/**
 * Barra de navegación: marca, enlaces con submenús (desplegable o mega menú, con categorías), búsqueda (barra, campo o paleta
 * ⌘K), menú móvil propio, anuncio, llamadas a la acción y comportamiento al hacer scroll. La disposición sale de `layout` o,
 * pieza a pieza, de `slots`; la forma, de `shape`; el aspecto, de la variante y del tema.
 * Los overlays (paleta, cajón móvil) salen a `document.body` con los tokens copiados: un ancestro con `backdrop-filter`
 * (la propia variante glass, una cabecera con blur) atraparía su `position: fixed`.
 */
export default function NavBar({ brand, links, cta, secondaryCta, onCta, onSecondaryCta, defaultActive, activeOn, variant, layout, slots, shape, bleed, floating, size, linksAlign, menuStyle, openOn, linkHover, search, searchPlaceholder, searchItems, onNavigate, onSearch, collapseAt, mobileMenu, announcement, utility, sticky, scrollFx, children, className, }: NavBarProps): import("react").JSX.Element;
