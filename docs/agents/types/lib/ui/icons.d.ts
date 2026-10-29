/**
 * Registro curado de iconos pixel art: 119 de los ~640 de Pixelarticons (MIT, © Gerrit Halfmann —
 * npm `pixelarticons`, pixelarticons.com), dibujados sobre una rejilla de 24×24. Lo consume `components/ui/Icon.tsx`.
 *
 * Por qué curado y con imports profundos (`pixelarticons/react/Heart`, no el barrel `pixelarticons/react`): el
 * paquete no declara `sideEffects: false`, así que importar por el barrel puede meter los 1037 componentes en el
 * bundle de cualquier página que use un solo icono. Cada icono aquí es su propio módulo de ~0,5 KB.
 *
 * Para un icono que no esté en el registro no hace falta tocarlo: `<Icon icon={Zap} />` acepta cualquier componente
 * de `pixelarticons/react/*` (incluidas las variantes `…Solid` y `…Glyph`). Para añadirlo al registro (y al selector
 * del catálogo): un `import` arriba, una línea en `ICONS` y su clave en `ICON_GROUPS`. Claves = kebab-case del nombre
 * del componente. `sharp` = variante de esquinas duras, que Pixelarticons solo dibuja para ~1 de cada 2 iconos.
 */
import type { ReactElement, SVGProps } from "react";
export type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;
export type IconEntry = {
    base: IconComponent;
    sharp?: IconComponent;
};
export declare const ICONS: {
    plus: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    minus: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    close: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    check: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    pencil: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    trash: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    copy: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    save: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    download: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    upload: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    reload: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    search: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    filter: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    link: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    share: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    send: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "arrow-left": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "arrow-right": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "arrow-up": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "arrow-down": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "chevron-left": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "chevron-right": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "chevron-up": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "chevron-down": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    menu: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    home: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "external-link": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "more-horizontal": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "more-vertical": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    login: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    logout: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "circle-info": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "warning-diamond": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "circle-question": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    bell: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    heart: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    star: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    bookmark: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    flag: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    lock: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    unlock: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    eye: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "eye-off": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    shield: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    user: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    users: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    mail: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    message: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    phone: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "at-sign": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    terminal: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    code: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    cpu: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    database: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    server: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    cloud: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    wifi: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "battery-full": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    zap: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    power: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "settings-cog": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    bug: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "git-branch": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    globe: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    github: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    discord: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    linkedin: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    instagram: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    youtube: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    mastodon: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    bluesky: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    react: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    npm: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    vercel: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    file: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "file-text": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    folder: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    image: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    camera: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    video: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    music: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    play: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    pause: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    volume: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    mic: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    headphone: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    gamepad: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    joystick: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    sword: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    skull: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    bomb: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    trophy: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    crown: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    coins: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    potion: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    robot: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    alien: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    castle: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    chess: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    fire: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    sparkles: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    leaf: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    tree: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    sun: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    moon: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    snowflake: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    calendar: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    clock: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "map-pin": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    "shopping-cart": {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    gift: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    key: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    lightbulb: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    coffee: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    compass: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    target: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    hourglass: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
        sharp: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    feather: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
    wand: {
        base: (props: SVGProps<SVGSVGElement>) => import("react").JSX.Element;
    };
};
export type IconName = keyof typeof ICONS;
/** Agrupación para el selector del catálogo y para documentar el set. */
export declare const ICON_GROUPS: {
    label: string;
    names: IconName[];
}[];
export declare const ICON_NAMES: IconName[];
