import type { DemoMeta } from "./demos";

/**
 * Landings temáticas: fork de las demos de scroll donde las cards también tienen
 * efectos ASCII (asciify-engine), revelados propios, inclinación hacia el puntero y un
 * fondo que cambia de escena con el contenido. El fondo lo renderiza asciify-engine
 * (Studio) o textmode.js según el tema.
 */
const base = { family: "landing" as const, reactive: true, lib: "ambas" as const };

export const themeDemos: DemoMeta[] = [
  {
    ...base,
    slug: "th-tide",
    theme: "tide",
    render: "asciify",
    title: "Maré · surf",
    blurb: "Escuela de surf: el sol cruza el cielo del amanecer a la noche sobre olas de puntos. Cards con barrido.",
    hint: "Desplaza: amanecer, mediodía y noche · las cards se inclinan hacia el puntero",
    accent: "#ff8a5c",
  },
  {
    ...base,
    slug: "th-brew",
    theme: "brew",
    render: "asciify",
    title: "Grano · café",
    blurb: "Tostador artesanal: de los granos al vapor y al latte art en mosaico. Cards que suben con elegancia serif.",
    hint: "Desplaza: granos, vapor y taza · el puntero ilumina los granos",
    accent: "#e0a458",
  },
  {
    ...base,
    slug: "th-orbit",
    theme: "orbit",
    render: "textmode",
    title: "Órbita · espacial",
    blurb: "Agencia aeroespacial en textmode.js: del cohete en la rampa al limbo del planeta y la luna. Cards que se disuelven en ASCII.",
    hint: "Desplaza para ascender · el botón final es magnético",
    accent: "#7cc4ff",
  },
  {
    ...base,
    slug: "th-pulse",
    theme: "pulse",
    render: "textmode",
    title: "Pulso · club",
    blurb: "Club nocturno cyberpunk en textmode.js: skyline con lluvia y neón que vira de rosa a cian. Hover con glitch de texto.",
    hint: "Desplaza para subir a las azoteas · pasa el puntero por las cards para el glitch",
    accent: "#ff3fa4",
  },
  {
    ...base,
    slug: "th-bloom",
    theme: "bloom",
    render: "asciify",
    title: "Hoja · plantas",
    blurb: "Vivero: enredaderas que crecen con el scroll hasta florecer, en trazos de línea. Cards de cristal redondeadas.",
    hint: "Desplaza para hacer crecer la planta · el puntero la mece",
    accent: "#ff8fb8",
  },
  {
    ...base,
    slug: "th-arcade",
    theme: "arcade",
    render: "asciify",
    title: "Pixel Club · arcade",
    blurb: "Salón recreativo en píxel Game Boy: bloques, invasores e INSERT COIN. Cards con borde grueso y disolución.",
    hint: "Desplaza por los tres niveles · el puntero mueve la nave",
    accent: "#9bbc0f",
  },
];
