/**
 * Genera los registros de las familias de iconos alternativas a pixel art: `lib/ui/icons-phosphor.ts` y
 * `lib/ui/icons-lucide.ts`. Cada uno da a los ~120 nombres del set curado (`lib/ui/icons.ts`) su equivalente en esa
 * librería, para que cambiar de familia no cambie ningún `name`. Comprueba que cada icono existe en el paquete
 * instalado y falla si alguno no está. Uso: `node scripts/build-icon-sets.mjs` (tras actualizar las librerías).
 *
 * Lucide no dibuja logotipos de marca (lo deja a Simple Icons): sus marcas salen de Phosphor, que sí los tiene.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

// nombre del set → [Phosphor, Lucide]
const MAP = {
  plus: ["Plus", "Plus"], minus: ["Minus", "Minus"], close: ["X", "X"], check: ["Check", "Check"], pencil: ["PencilSimple", "Pencil"],
  trash: ["Trash", "Trash2"], copy: ["Copy", "Copy"], save: ["FloppyDisk", "Save"], download: ["DownloadSimple", "Download"], upload: ["UploadSimple", "Upload"],
  reload: ["ArrowClockwise", "RotateCw"], search: ["MagnifyingGlass", "Search"], filter: ["Funnel", "Funnel"], link: ["Link", "Link"], share: ["ShareNetwork", "Share2"],
  send: ["PaperPlaneTilt", "Send"], "arrow-left": ["ArrowLeft", "ArrowLeft"], "arrow-right": ["ArrowRight", "ArrowRight"], "arrow-up": ["ArrowUp", "ArrowUp"],
  "arrow-down": ["ArrowDown", "ArrowDown"], "chevron-left": ["CaretLeft", "ChevronLeft"], "chevron-right": ["CaretRight", "ChevronRight"], "chevron-up": ["CaretUp", "ChevronUp"],
  "chevron-down": ["CaretDown", "ChevronDown"], menu: ["List", "Menu"], home: ["House", "House"], "external-link": ["ArrowSquareOut", "ExternalLink"],
  "more-horizontal": ["DotsThree", "Ellipsis"], "more-vertical": ["DotsThreeVertical", "EllipsisVertical"], login: ["SignIn", "LogIn"], logout: ["SignOut", "LogOut"],
  "circle-info": ["Info", "Info"], "warning-diamond": ["WarningDiamond", "TriangleAlert"], "circle-question": ["Question", "CircleQuestionMark"], bell: ["Bell", "Bell"],
  heart: ["Heart", "Heart"], star: ["Star", "Star"], bookmark: ["BookmarkSimple", "Bookmark"], flag: ["Flag", "Flag"], lock: ["Lock", "Lock"], unlock: ["LockOpen", "LockOpen"],
  eye: ["Eye", "Eye"], "eye-off": ["EyeSlash", "EyeOff"], shield: ["Shield", "Shield"], user: ["User", "User"], users: ["Users", "Users"], mail: ["Envelope", "Mail"],
  message: ["ChatCircle", "MessageCircle"], phone: ["Phone", "Phone"], "at-sign": ["At", "AtSign"], terminal: ["TerminalWindow", "SquareTerminal"], code: ["Code", "Code"],
  cpu: ["Cpu", "Cpu"], database: ["Database", "Database"], server: ["HardDrives", "Server"], cloud: ["Cloud", "Cloud"], wifi: ["WifiHigh", "Wifi"],
  "battery-full": ["BatteryFull", "BatteryFull"], zap: ["Lightning", "Zap"], power: ["Power", "Power"], "settings-cog": ["Gear", "Settings"], bug: ["Bug", "Bug"],
  "git-branch": ["GitBranch", "GitBranch"], globe: ["Globe", "Globe"],
  github: ["GithubLogo", null], discord: ["DiscordLogo", null], linkedin: ["LinkedinLogo", null], instagram: ["InstagramLogo", null], youtube: ["YoutubeLogo", null],
  mastodon: ["MastodonLogo", null], bluesky: ["Butterfly", null], react: ["Atom", "Atom"], npm: ["Package", "Package"], vercel: ["Triangle", "Triangle"],
  file: ["File", "File"], "file-text": ["FileText", "FileText"], folder: ["Folder", "Folder"], image: ["Image", "Image"], camera: ["Camera", "Camera"],
  video: ["VideoCamera", "Video"], music: ["MusicNotes", "Music"], play: ["Play", "Play"], pause: ["Pause", "Pause"], volume: ["SpeakerHigh", "Volume2"],
  mic: ["Microphone", "Mic"], headphone: ["Headphones", "Headphones"], gamepad: ["GameController", "Gamepad2"], joystick: ["Joystick", "Joystick"], sword: ["Sword", "Sword"],
  skull: ["Skull", "Skull"], bomb: ["Bomb", "Bomb"], trophy: ["Trophy", "Trophy"], crown: ["Crown", "Crown"], coins: ["Coins", "Coins"], potion: ["Flask", "FlaskConical"],
  robot: ["Robot", "Bot"], alien: ["Alien", "Ghost"], castle: ["CastleTurret", "Castle"], chess: ["Horse", "ChessKnight"], fire: ["Fire", "Flame"], sparkles: ["Sparkle", "Sparkles"],
  leaf: ["Leaf", "Leaf"], tree: ["Tree", "TreePine"], sun: ["Sun", "Sun"], moon: ["Moon", "Moon"], snowflake: ["Snowflake", "Snowflake"], calendar: ["Calendar", "Calendar"],
  clock: ["Clock", "Clock"], "map-pin": ["MapPin", "MapPin"], "shopping-cart": ["ShoppingCart", "ShoppingCart"], gift: ["Gift", "Gift"], key: ["Key", "Key"],
  lightbulb: ["Lightbulb", "Lightbulb"], coffee: ["Coffee", "Coffee"], compass: ["Compass", "Compass"], target: ["Target", "Target"], hourglass: ["Hourglass", "Hourglass"],
  feather: ["Feather", "Feather"], wand: ["MagicWand", "WandSparkles"],
};

// los nombres del set curado deben estar todos
const pixel = readFileSync("lib/ui/icons.ts", "utf8");
const names = [...pixel.slice(pixel.indexOf("export const ICONS")).matchAll(/^ {2}"?([a-z0-9-]+)"?:/gm)].map((m) => m[1]);
const missing = names.filter((n) => !MAP[n]);
if (missing.length) throw new Error(`Sin equivalente: ${missing.join(", ")}`);

const ph = (c) => existsSync(`node_modules/@phosphor-icons/react/dist/ssr/${c}.es.js`);
const lucideExports = createRequire(import.meta.url)("lucide-react");
const lu = (c) => c in lucideExports;
const bad = names.flatMap((n) => [!ph(MAP[n][0]) && `Phosphor ${MAP[n][0]}`, MAP[n][1] && !lu(MAP[n][1]) && `Lucide ${MAP[n][1]}`]).filter(Boolean);
if (bad.length) throw new Error(`No existen: ${bad.join(", ")}`);

const head = (lib, why) => `/**
 * GENERADO por \`scripts/build-icon-sets.mjs\`: no editar a mano. Los ${names.length} nombres del set curado (\`lib/ui/icons.ts\`)
 * dibujados con ${lib}. ${why}
 * Se usa a través de \`IconSet\` (\`components/ui/Icon.tsx\`): solo lo descarga la web que lo elige.
 */
`;

// Phosphor: imports por archivo (versión SSR, sin contexto de React) para no cargar los ~1.500 iconos del paquete
const phImports = [...new Set(names.map((n) => MAP[n][0]))].sort();
writeFileSync(
  "lib/ui/icons-phosphor.ts",
  head("Phosphor (MIT, phosphoricons.com)", "Seis pesos dibujados a mano: `thin`, `light`, `regular`, `bold`, `fill` y `duotone`.") +
    `import type { IconSetDef } from "@/components/ui/Icon";\n` +
    phImports.map((c) => `import { ${c} } from "@phosphor-icons/react/dist/ssr/${c}";`).join("\n") +
    `\n\nexport const PHOSPHOR_ICONS = {\n${names.map((n) => `  "${n}": ${MAP[n][0]},`).join("\n")}\n};\n\n` +
    `/** familia Phosphor: el peso sale de \`weight\` del icono o del \`IconSet\` */\nexport const phosphor: IconSetDef = {\n  id: "phosphor",\n  icons: PHOSPHOR_ICONS,\n  props: (w) => ({ weight: w }),\n};\n`,
);

// Phosphor de un solo peso: cada icono de `dist/ssr` trae sus seis pesos (~3,4 KB), y una web usa uno. Estos módulos
// guardan solo el SVG de ese peso (los mismos trazos, serializados con react-dom) y pesan ~1/6 del set completo.
const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"];
const defs = {};
for (const c of phImports) defs[c] = (await import(`../node_modules/@phosphor-icons/react/dist/defs/${c}.es.js`)).default;
const cap = (s) => s[0].toUpperCase() + s.slice(1);
for (const w of WEIGHTS) {
  const svg = (c) => renderToStaticMarkup(React.createElement(React.Fragment, null, defs[c].get(w)));
  writeFileSync(
    `lib/ui/icons-phosphor-${w}.ts`,
    head("Phosphor (MIT, phosphoricons.com)", `Solo el peso \`${w}\`: ~1/6 de \`icons-phosphor\` (los seis pesos). Para una web que usa un único peso.`) +
      `import { phosphorSvg } from "@/lib/ui/phosphorSvg";\n\n` +
      `const SVG: Record<string, string> = {\n${names.map((n) => `  "${n}": ${JSON.stringify(svg(MAP[n][0]))},`).join("\n")}\n};\n\n` +
      `/** familia Phosphor en peso \`${w}\`: el \`weight\` del icono o del \`IconSet\` se ignora (para mezclar pesos, \`phosphor\`) */\n` +
      `export const phosphor${cap(w)} = phosphorSvg("phosphor", SVG);\n`,
  );
}

// Lucide: nombres del paquete (Next optimiza sus imports); las marcas, de Phosphor
const luImports = [...new Set(names.map((n) => MAP[n][1]).filter(Boolean))].sort();
const brands = names.filter((n) => !MAP[n][1]);
writeFileSync(
  "lib/ui/icons-lucide.ts",
  head("Lucide (ISC, lucide.dev)", "Trazo técnico: el peso cambia el grosor de la línea (fino 1 · ligero 1,5 · normal 2 · grueso 2,5). Las marcas, que Lucide no dibuja, salen de Phosphor en el mismo peso.") +
    `import type { IconSetDef } from "@/components/ui/Icon";\n` +
    `import { ${luImports.join(", ")} } from "lucide-react";\n` +
    brands.map((n) => `import { ${MAP[n][0]} } from "@phosphor-icons/react/dist/ssr/${MAP[n][0]}";`).join("\n") +
    `\n\nexport const LUCIDE_ICONS = {\n${names.map((n) => `  "${n}": ${MAP[n][1] ?? MAP[n][0]},`).join("\n")}\n};\n\n` +
    `const BRANDS = new Set([${brands.map((n) => `"${n}"`).join(", ")}]);\nconst STROKE = { thin: 1, light: 1.5, regular: 2, bold: 2.5, fill: 2, duotone: 2 } as const;\n\n` +
    `/** familia Lucide: el peso se traduce a grosor de trazo; en las marcas (Phosphor) se pasa tal cual */\nexport const lucide: IconSetDef = {\n  id: "lucide",\n  icons: LUCIDE_ICONS,\n  props: (w, name) => (BRANDS.has(name) ? { weight: w === "fill" || w === "duotone" ? w : "regular" } : { strokeWidth: STROKE[w], absoluteStrokeWidth: false }),\n};\n`,
);
console.log(`✓ ${names.length} iconos · Phosphor ${phImports.length} · Lucide ${luImports.length} (+${brands.length} marcas de Phosphor)`);
