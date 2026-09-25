/**
 * Ilustraciones SVG de las webs completas (`/sitios/*`), como data URI: deterministas (misma semilla, misma imagen), sin red
 * ni archivos. Cada web tiene su familia: portadas técnicas (blog), sprites y tiles (tienda de assets), cámaras (seguridad),
 * aparatos de audio (fabricante musical) y composiciones sobrias (moda).
 */

// Las cifras se redondean a 2 decimales: servidor y navegador pueden diferir en el último dígito de un seno o un coseno, y
// entonces el SVG (y el atributo src) no coincidiría al hidratar.
const uri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/-?\d+\.\d{3,}/g, (m) => String(Math.round(Number(m) * 100) / 100)))}`;
const rnd = (seed: number, i: number) => {
  const x = Math.sin((seed + 1) * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const svg = (w: number, h: number, body: string, extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" ${extra}>${body}</svg>`;

/* ---------- Blog de tecnología: portada con rejilla, líneas de código y un glifo grande ---------- */
export function techCover(seed: number, glyph: string, a = "#5eead4", b = "#a78bfa") {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const w = 120 + rnd(seed, i) * 380;
    const x = 60 + (rnd(seed, i + 40) > 0.6 ? 40 : 0);
    const c = rnd(seed, i + 80) > 0.7 ? a : rnd(seed, i + 90) > 0.6 ? b : "#ffffff";
    return `<rect x="${x}" y="${70 + i * 44}" width="${w.toFixed(0)}" height="10" rx="5" fill="${c}" opacity="${c === "#ffffff" ? 0.12 : 0.55}"/>`;
  }).join("");
  return uri(
    svg(
      1200,
      560,
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#111a2e"/></linearGradient>
       <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".05"/></pattern>
       <radialGradient id="r" cx="${0.6 + rnd(seed, 3) * 0.3}" cy="${0.3 + rnd(seed, 4) * 0.4}" r=".6"><stop offset="0" stop-color="${a}" stop-opacity=".35"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient></defs>
       <rect width="1200" height="560" fill="url(#g)"/><rect width="1200" height="560" fill="url(#p)"/><rect width="1200" height="560" fill="url(#r)"/>${lines}
       <text x="880" y="340" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="220" font-weight="700" fill="${b}" opacity=".9">${glyph}</text>`,
    ),
  );
}

/* ---------- Tienda de assets: sprite, tiles, sonido, fuente, interfaz ---------- */
export type AssetKind = "sprite" | "tiles" | "sfx" | "font" | "ui" | "fx";
export function assetArt(seed: number, kind: AssetKind, pal: string[] = ["#1b1033", "#ffcc4d", "#ff5c8a", "#5ce1e6", "#7c5cff"]) {
  const [bg, c1, c2, c3, c4] = pal;
  const px = (x: number, y: number, c: string, s = 20) => `<rect x="${x * s}" y="${y * s}" width="${s}" height="${s}" fill="${c}"/>`;
  let body = `<rect width="480" height="360" fill="${bg}"/>`;
  body += `<pattern id="d" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#fff" opacity=".12"/></pattern><rect width="480" height="360" fill="url(#d)"/>`;
  if (kind === "sprite") {
    // criatura simétrica 8×10 en el centro
    const colors = [c1, c2, c3, c4];
    const main = colors[seed % 4];
    const dark = colors[(seed + 2) % 4];
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 4; x++) {
        const r = rnd(seed, y * 4 + x);
        if (r < 0.55 - Math.abs(y - 5) * 0.03) continue;
        const c = r > 0.9 ? dark : main;
        body += px(8 + x, 3 + y, c) + px(15 - x, 3 + y, c);
      }
    body += px(9, 6, "#fff") + px(14, 6, "#fff") + px(9, 7, bg) + px(14, 7, bg);
  } else if (kind === "tiles") {
    const t = [c3, c4, c1, "#2a1a55"];
    for (let y = 0; y < 18; y++) for (let x = 0; x < 24; x++) body += px(x, y, t[Math.floor(rnd(seed, y * 24 + x) * 2.2 + (y > 10 ? 1.6 : 0)) % 4], 20);
    body += `<rect width="480" height="360" fill="${bg}" opacity=".25"/>`;
  } else if (kind === "sfx") {
    for (let i = 0; i < 40; i++) {
      const h = 20 + Math.abs(Math.sin(i * 0.5 + seed)) * 140 * (0.4 + rnd(seed, i) * 0.6);
      body += `<rect x="${40 + i * 10}" y="${180 - h / 2}" width="6" height="${h.toFixed(0)}" fill="${i % 7 === 0 ? c2 : c3}"/>`;
    }
  } else if (kind === "font") {
    body += `<text x="240" y="230" text-anchor="middle" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="700" font-size="180" fill="${c1}">Aa</text><rect x="100" y="270" width="280" height="8" fill="${c2}"/>`;
  } else if (kind === "ui") {
    body += `<rect x="90" y="70" width="300" height="220" fill="#2a1a55" stroke="${c1}" stroke-width="8"/><rect x="120" y="100" width="240" height="30" fill="${c4}"/><rect x="120" y="150" width="110" height="36" fill="${c2}"/><rect x="250" y="150" width="110" height="36" fill="${c3}"/><rect x="120" y="210" width="240" height="14" fill="${c1}" opacity=".6"/><rect x="120" y="236" width="170" height="14" fill="${c1}" opacity=".35"/>`;
  } else {
    for (let i = 0; i < 26; i++) {
      const x = 240 + Math.cos(i * 0.9 + seed) * (40 + rnd(seed, i) * 120);
      const y = 180 + Math.sin(i * 0.9 + seed) * (30 + rnd(seed, i + 9) * 100);
      body += px(Math.round(x / 20), Math.round(y / 20), [c1, c2, c3][i % 3]);
    }
    body += px(12, 9, "#fff");
  }
  return uri(svg(480, 360, body, 'shape-rendering="crispEdges"'));
}

/* ---------- Seguridad: cámaras, alarmas, accesos, monitorización ---------- */
export type CamKind = "dome" | "bullet" | "alarm" | "access" | "monitor" | "map";
export function securityArt(seed: number, kind: CamKind, acc = "#38bdf8") {
  let body = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a30"/><stop offset="1" stop-color="#050b16"/></linearGradient>
    <pattern id="s" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#fff" opacity=".04"/></pattern></defs>
    <rect width="600" height="400" fill="url(#g)"/>`;
  const glow = `<circle cx="300" cy="190" r="170" fill="${acc}" opacity=".07"/>`;
  if (kind === "dome") body += `${glow}<rect x="200" y="110" width="200" height="22" rx="6" fill="#dfe7f1"/><path d="M215 132h170a85 85 0 0 1-170 0z" fill="#1e2b3d" stroke="#dfe7f1" stroke-width="6"/><circle cx="300" cy="170" r="28" fill="#0a0f18" stroke="${acc}" stroke-width="4"/><circle cx="292" cy="162" r="7" fill="#fff" opacity=".7"/>`;
  else if (kind === "bullet") body += `${glow}<rect x="140" y="160" width="260" height="80" rx="16" fill="#dfe7f1"/><rect x="380" y="150" width="60" height="100" rx="10" fill="#1e2b3d"/><circle cx="410" cy="200" r="26" fill="#0a0f18" stroke="${acc}" stroke-width="4"/><rect x="230" y="240" width="18" height="70" fill="#c3cfdd"/><rect x="190" y="306" width="100" height="16" rx="6" fill="#c3cfdd"/><path d="M440 200 L590 120 L590 280 Z" fill="${acc}" opacity=".12"/>`;
  else if (kind === "alarm") body += `${glow}<rect x="220" y="100" width="160" height="200" rx="24" fill="#dfe7f1"/><circle cx="300" cy="170" r="42" fill="#1e2b3d"/><circle cx="300" cy="170" r="16" fill="#ef4444"/><rect x="250" y="240" width="100" height="12" rx="6" fill="#9fb0c5"/><path d="M180 140 q-30 30 0 60 M150 120 q-50 50 0 100 M420 140 q30 30 0 60 M450 120 q50 50 0 100" stroke="${acc}" stroke-width="6" fill="none" opacity=".6"/>`;
  else if (kind === "access") body += `${glow}<rect x="230" y="80" width="140" height="240" rx="18" fill="#dfe7f1"/><rect x="250" y="104" width="100" height="70" rx="8" fill="#0a0f18"/><text x="300" y="150" text-anchor="middle" font-family="ui-monospace,monospace" font-size="26" fill="${acc}">OK</text>${Array.from({ length: 9 }, (_, i) => `<circle cx="${270 + (i % 3) * 30}" cy="${205 + Math.floor(i / 3) * 34}" r="11" fill="#1e2b3d"/>`).join("")}`;
  else if (kind === "monitor") {
    body += `<rect x="70" y="60" width="460" height="260" rx="14" fill="#0a0f18" stroke="#dfe7f1" stroke-width="6"/>`;
    for (let i = 0; i < 4; i++) {
      const x = 90 + (i % 2) * 215, y = 80 + Math.floor(i / 2) * 115;
      body += `<rect x="${x}" y="${y}" width="205" height="105" fill="#12223a"/><rect x="${x + 8}" y="${y + 8}" width="${40 + rnd(seed, i) * 60}" height="8" fill="${i === 1 ? "#ef4444" : acc}" opacity=".8"/><path d="M${x} ${y + 105} L${x + 60 + rnd(seed, i + 4) * 60} ${y + 50} L${x + 205} ${y + 105}Z" fill="#1e3a5f"/>`;
    }
    body += `<rect x="250" y="320" width="100" height="20" fill="#9fb0c5"/>`;
  } else {
    for (let i = 0; i < 14; i++) body += `<line x1="0" y1="${i * 30}" x2="600" y2="${i * 30 + 40}" stroke="#1e3a5f"/><line x1="${i * 46}" y1="0" x2="${i * 46 - 30}" y2="400" stroke="#1e3a5f"/>`;
    for (let i = 0; i < 7; i++) {
      const x = 60 + rnd(seed, i) * 480, y = 50 + rnd(seed, i + 9) * 300;
      body += `<circle cx="${x}" cy="${y}" r="42" fill="${acc}" opacity=".12"/><circle cx="${x}" cy="${y}" r="7" fill="${acc}"/>`;
    }
  }
  return uri(svg(600, 400, body + `<rect width="600" height="400" fill="url(#s)"/>`));
}

/* ---------- Fabricante musical: controladora, sintetizador, monitor, auriculares, mezclador, caja de ritmos ---------- */
export type GearKind = "controller" | "synth" | "monitor" | "headphones" | "mixer" | "drum";
export function gearArt(seed: number, kind: GearKind, acc = "#ff6a1a") {
  const body0 = `<defs><radialGradient id="l" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#26262b"/><stop offset="1" stop-color="#0b0b0c"/></radialGradient></defs><rect width="800" height="600" fill="url(#l)"/><ellipse cx="400" cy="500" rx="300" ry="30" fill="#000" opacity=".5"/>`;
  const knob = (x: number, y: number, r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2c2c31" stroke="#3d3d44" stroke-width="3"/><line x1="${x}" y1="${y}" x2="${x + r * 0.7 * Math.cos(-2 + rnd(seed, x) * 3)}" y2="${y + r * 0.7 * Math.sin(-2 + rnd(seed, x) * 3)}" stroke="${acc}" stroke-width="3" stroke-linecap="round"/>`;
  let d = "";
  if (kind === "controller") {
    d += `<rect x="90" y="220" width="620" height="260" rx="22" fill="#1b1b1f" stroke="#333" stroke-width="3"/>`;
    for (const cx of [230, 570]) d += `<circle cx="${cx}" cy="330" r="92" fill="#111" stroke="#2c2c31" stroke-width="6"/><circle cx="${cx}" cy="330" r="60" fill="#18181c"/><circle cx="${cx}" cy="330" r="10" fill="${acc}"/>`;
    for (let i = 0; i < 8; i++) d += `<rect x="${130 + (i % 4) * 50 + (i > 3 ? 340 : 0)}" y="440" width="40" height="26" rx="5" fill="${i % 3 === 0 ? acc : "#34343a"}" opacity="${i % 3 === 0 ? 0.9 : 1}"/>`;
    d += `<rect x="385" y="250" width="30" height="170" rx="6" fill="#111"/><rect x="380" y="${300 + rnd(seed, 1) * 60}" width="40" height="22" rx="4" fill="#ddd"/>${knob(360, 260)}${knob(440, 260)}`;
  } else if (kind === "synth") {
    d += `<rect x="70" y="200" width="660" height="290" rx="18" fill="#1b1b1f" stroke="#333" stroke-width="3"/>`;
    for (let i = 0; i < 10; i++) d += knob(120 + i * 62, 250);
    for (let i = 0; i < 10; i++) d += knob(120 + i * 62, 305, 11);
    for (let i = 0; i < 21; i++) d += `<rect x="${90 + i * 30}" y="350" width="28" height="120" rx="3" fill="#ececec"/>`;
    for (let i = 0; i < 21; i++) if (![2, 6, 9, 13, 16, 20].includes(i % 21)) d += `<rect x="${90 + i * 30 + 19}" y="350" width="18" height="72" rx="2" fill="#141416"/>`;
  } else if (kind === "monitor") {
    d += `<rect x="270" y="90" width="260" height="400" rx="20" fill="#1b1b1f" stroke="#333" stroke-width="3"/><circle cx="400" cy="200" r="46" fill="#111" stroke="#2c2c31" stroke-width="6"/><circle cx="400" cy="200" r="14" fill="#2c2c31"/><circle cx="400" cy="355" r="100" fill="#111" stroke="#2c2c31" stroke-width="8"/><circle cx="400" cy="355" r="70" fill="${acc}" opacity=".85"/><circle cx="400" cy="355" r="26" fill="#1b1b1f"/>`;
  } else if (kind === "headphones") {
    d += `<path d="M230 330 C230 150 570 150 570 330" fill="none" stroke="#1b1b1f" stroke-width="34" stroke-linecap="round"/><path d="M230 330 C230 170 570 170 570 330" fill="none" stroke="${acc}" stroke-width="6" opacity=".8"/>`;
    for (const x of [230, 570]) d += `<rect x="${x - 55}" y="300" width="110" height="150" rx="45" fill="#1b1b1f" stroke="#333" stroke-width="3"/><rect x="${x - 38}" y="318" width="76" height="114" rx="32" fill="#26262b"/>`;
  } else if (kind === "mixer") {
    d += `<rect x="190" y="110" width="420" height="380" rx="18" fill="#1b1b1f" stroke="#333" stroke-width="3"/>`;
    for (let c = 0; c < 4; c++) {
      const x = 250 + c * 100;
      for (let k = 0; k < 3; k++) d += knob(x, 160 + k * 52, 13);
      d += `<rect x="${x - 5}" y="320" width="10" height="130" rx="5" fill="#111"/><rect x="${x - 16}" y="${340 + rnd(seed, c) * 80}" width="32" height="20" rx="4" fill="#ddd"/>`;
    }
    d += `<rect x="260" y="465" width="280" height="10" rx="5" fill="${acc}"/>`;
  } else {
    d += `<rect x="120" y="170" width="560" height="310" rx="20" fill="#1b1b1f" stroke="#333" stroke-width="3"/><rect x="160" y="200" width="200" height="70" rx="6" fill="#0a0a0b"/><text x="260" y="248" text-anchor="middle" font-family="ui-monospace,monospace" font-size="34" fill="${acc}">${120 + Math.floor(rnd(seed, 2) * 40)}</text>`;
    for (let i = 0; i < 16; i++) d += `<rect x="${160 + (i % 4) * 60 + (i % 4 > 1 ? 0 : 0)}" y="${290 + Math.floor(i / 4) * 44}" width="50" height="36" rx="6" fill="${rnd(seed, i + 5) > 0.7 ? acc : "#34343a"}"/>`;
    for (let i = 0; i < 6; i++) d += knob(440 + (i % 3) * 70, 240 + Math.floor(i / 3) * 70, 18);
    d += `<rect x="430" y="400" width="200" height="50" rx="8" fill="#26262b"/>`;
  }
  return uri(svg(800, 600, body0 + d));
}

/* ---------- Moda: composiciones claras y sobrias (arcos, siluetas de prendas, tejido) ---------- */
const SAND = ["#efe9e1", "#e7ded2", "#f3efe9", "#e9e4dc", "#ece7e0", "#dfe3e6", "#e8e1d9"];
const INK = ["#1d1d1f", "#6b5d4f", "#8a7b6b", "#3a3a3c", "#a39382", "#56606b"];
export type LookKind = "coat" | "dress" | "shirt" | "arch" | "fabric" | "still";
export function fashionArt(seed: number, kind: LookKind) {
  const bg = SAND[seed % SAND.length];
  const ink = INK[(seed * 3) % INK.length];
  const soft = INK[(seed * 3 + 2) % INK.length];
  let d = `<rect width="800" height="1000" fill="${bg}"/><ellipse cx="400" cy="900" rx="220" ry="18" fill="#000" opacity=".06"/>`;
  if (kind === "coat") d += `<path d="M330 170 L400 200 L470 170 L560 230 L590 520 L540 530 L530 360 L520 880 L280 880 L270 360 L260 530 L210 520 L240 230 Z" fill="${ink}"/><path d="M400 200 L370 520 L400 880 M400 200 L430 520" stroke="${bg}" stroke-width="3" fill="none" opacity=".5"/>`;
  else if (kind === "dress") d += `<path d="M350 170 L450 170 L470 330 L600 880 L200 880 L330 330 Z" fill="${ink}"/><path d="M340 330 L460 330" stroke="${bg}" stroke-width="5" opacity=".5"/>`;
  else if (kind === "shirt") d += `<path d="M320 220 L400 250 L480 220 L600 300 L560 420 L510 390 L510 760 L290 760 L290 390 L240 420 L200 300 Z" fill="${soft}"/><path d="M400 250 L400 760" stroke="${bg}" stroke-width="3" opacity=".6"/>${Array.from({ length: 6 }, (_, i) => `<circle cx="412" cy="${310 + i * 70}" r="6" fill="${bg}"/>`).join("")}`;
  else if (kind === "arch") d += `<path d="M180 900 L180 420 A220 220 0 0 1 620 420 L620 900 Z" fill="${soft}" opacity=".55"/><circle cx="${300 + rnd(seed, 1) * 200}" cy="${330 + rnd(seed, 2) * 80}" r="60" fill="${ink}" opacity=".85"/><line x1="120" y1="900" x2="680" y2="900" stroke="${ink}" stroke-width="2"/>`;
  else if (kind === "fabric") {
    for (let i = 0; i < 14; i++) d += `<path d="M0 ${100 + i * 64} C 200 ${60 + i * 64 + rnd(seed, i) * 60} 600 ${140 + i * 64 - rnd(seed, i + 3) * 60} 800 ${100 + i * 64}" stroke="${i % 2 ? ink : soft}" stroke-width="${i % 2 ? 22 : 30}" fill="none" opacity="${i % 2 ? 0.75 : 0.45}"/>`;
  } else d += `<rect x="240" y="520" width="320" height="360" rx="10" fill="${soft}" opacity=".7"/><rect x="300" y="380" width="200" height="160" rx="80" fill="${ink}"/><circle cx="560" cy="300" r="44" fill="${ink}" opacity=".35"/>`;
  return uri(svg(800, 1000, d));
}
