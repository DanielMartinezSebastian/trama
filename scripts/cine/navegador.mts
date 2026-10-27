/**
 * Lo común de las herramientas que abren una web para mirarla (docs/33 §2): el Chromium de la caché de Playwright con la
 * GPU real, los ganchos, la espera a que haya escena, los pasos escritos en una línea y los avisos que hay que pasar.
 * Lo usan cine:explora, cine:sonda y cine:conjunto; cine:capture lleva su propio arranque (reloj virtual, red).
 */
import { join, resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

export const HOOKS = resolve("scripts/cine/hooks");

/** iPhone 15 en vertical: lo que mide `--movil` (docs/33 §2) */
export const MOVIL = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" };

export type OpcionesNavegador = { size?: [number, number]; movil?: boolean; dom?: boolean; shaders?: boolean; gl?: boolean };

export async function abrir(op: OpcionesNavegador = {}): Promise<{ browser: Browser; page: Page; errores: string[] }> {
  const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
  const [w, h] = op.size ?? [1280, 720];
  const context = await browser.newContext(op.movil ? { viewport: { width: MOVIL.width, height: MOVIL.height }, deviceScaleFactor: MOVIL.deviceScaleFactor, isMobile: true, hasTouch: true, userAgent: MOVIL.userAgent, bypassCSP: true } : { viewport: { width: w, height: h }, deviceScaleFactor: 1, bypassCSP: true });
  const page = await context.newPage();
  const errores: string[] = [];
  page.on("pageerror", (e) => errores.push(e.message.slice(0, 300)));
  page.on("console", (m) => m.type() === "error" && errores.push(m.text().slice(0, 300)));
  // tsx envuelve las funciones con __name: en la página no existe
  await page.addInitScript("window.__name = (f) => f;");
  await page.addInitScript({ path: join(HOOKS, "three.js") });
  if (op.shaders) await page.addInitScript({ path: join(HOOKS, "shaders.js") });
  if (op.dom) await page.addInitScript({ path: join(HOOKS, "dom.js") });
  if (op.gl) await page.addInitScript({ path: join(HOOKS, "gl.js") });
  return { browser, page, errores };
}

/** espera a que haya mallas y su número no cambie en 1,5 s (o se acabe el plazo); devuelve cuántas */
export async function esperarEscena(page: Page, plazo = 30_000) {
  const t0 = Date.now();
  let last = -1, stable = Date.now();
  while (Date.now() - t0 < plazo) {
    const n = await page.evaluate(() => (window as unknown as { __cine?: { meshes(): number } }).__cine?.meshes() ?? 0);
    if (n !== last) (last = n), (stable = Date.now());
    if (n > 0 && Date.now() - stable > 1500) break;
    await page.waitForTimeout(250);
  }
  return Math.max(0, last);
}

/** botones visibles con su texto y su centro en píxeles */
export async function botones(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("button, a, [role=button], [onclick]")]
      .filter((e) => (e as HTMLElement).offsetParent !== null)
      .map((e) => {
        const r = e.getBoundingClientRect();
        let texto = (e.textContent || e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
        // el texto animado letra a letra suele ir duplicado («EnterEnter»): una copia
        const m = texto.length % 2 === 0 ? texto.slice(0, texto.length / 2) : "";
        if (m && m + m === texto) texto = m;
        return { texto: texto.slice(0, 50), x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
      })
      .filter((b) => b.texto && b.x > 0 && b.y > 0 && b.x < innerWidth && b.y < innerHeight),
  );
}

/** botones de avisos de cookies (solo cookies: los de «entrar» o «explorar» de AVISO navegan en una web normal); lo usan
 * refs:probe y cine:capture --avisos */
export const COOKIES = /^(accept|accept all|accept cookies|accepter|tout accepter|aceptar|aceptar todo|acepto|accetta|accetta tutti|accetto|akzeptieren|alle akzeptieren|aceitar|agree|i agree|allow|allow all|got it|ok|okay|entendido|zustimmen|zaakceptuj|zaakceptuj wszystkie|akceptuj|accepteren|alles accepteren|acceptera|godkänn|hyväksy)\b/i;

/**
 * Pulsa los avisos de cookies visibles: solo botones o enlaces que no navegan, de verdad visibles (lo que hay en su centro es
 * el botón: el «Accetta tutti» del panel de preferencias oculto de Il Colorista tiene `offsetParent` y no se ve) y con un clic de ratón
 * real en su centro (algunas librerías de consentimiento no atienden a `click()`). Devuelve cuántos pulsó.
 */
export async function aceptarCookies(page: Page, esperaMs = 0) {
  let total = 0;
  // hay avisos que salen con un temporizador (Il Colorista): se espera a que aparezcan hasta `esperaMs`
  const hasta = Date.now() + esperaMs;
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    const punto = await page.evaluate((re) => {
      const aviso = new RegExp(re, "i");
      const b = [...document.querySelectorAll("button, [role=button], a:not([href]), a[href^='#'], a[href^='javascript']")].find((e) => {
        const r = e.getBoundingClientRect();
        if (!(r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && aviso.test((e.textContent || "").trim()))) return false;
        // visible de verdad = lo que hay en su centro es él (checkVisibility falla con avisos que entran con un fundido)
        const centro = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return !!centro && (centro === e || e.contains(centro));
      });
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, COOKIES.source);
    if (!punto) {
      if (total === 0 && Date.now() < hasta) {
        vuelta--;
        await page.waitForTimeout(400);
        continue;
      }
      break;
    }
    await page.mouse.click(punto.x, punto.y);
    total++;
    await page.waitForTimeout(900);
  }
  return total;
}

/** avisos que hay que pasar para ver la escena: cookies, edad, «entrar», sonido */
export const AVISO = /^(enter|entrer|entrar|entra|accept|accepter|aceptar|accetta|accetto|akzeptieren|alle akzeptieren|aceitar|agree|ok|yes|oui|sí|start|explore|begin|continue|discover|i agree|allow|got it|enter site|enter experience)\b/i;

/**
 * Pasos en una línea, separados por «;» (coordenadas relativas 0–1 al viewport):
 *   clic:0.5,0.74 · rueda:400x6 (píxeles × golpes) · espera:2.5 (s) · tecla:Enter · arrastre:0.3,0.5>0.7,0.5 ·
 *   mueve:0.2,0.5 · avisos (pulsa los botones que parecen avisos de cookies o de edad)
 * Devuelve lo que hizo, para dejarlo escrito.
 */
export async function pasos(page: Page, linea: string) {
  const hechos: string[] = [];
  const vp = page.viewportSize() ?? { width: 1280, height: 720 };
  const px = (s: string) => {
    const [x, y] = s.split(",").map(Number);
    return [Math.round(x * vp.width), Math.round(y * vp.height)] as const;
  };
  for (const p of linea.split(";").map((x) => x.trim()).filter(Boolean)) {
    const [k, v = ""] = p.split(":");
    if (k === "clic") {
      const [x, y] = px(v);
      await page.mouse.click(x, y);
    } else if (k === "rueda") {
      const [d, n = "1"] = v.split("x");
      for (let i = 0; i < Number(n); i++) (await page.mouse.wheel(0, Number(d)), await page.waitForTimeout(120));
    } else if (k === "espera") await page.waitForTimeout(Number(v) * 1000);
    else if (k === "tecla") await page.keyboard.press(v);
    else if (k === "mueve") {
      const [x, y] = px(v);
      await page.mouse.move(x, y, { steps: 8 });
    } else if (k === "arrastre") {
      const [a, b] = v.split(">");
      const [x0, y0] = px(a), [x1, y1] = px(b);
      await page.mouse.move(x0, y0);
      await page.mouse.down();
      await page.mouse.move(x1, y1, { steps: 20 });
      await page.mouse.up();
    } else if (k === "avisos") {
      // varias vueltas: tras las cookies suele venir el aviso de edad
      const vistos = new Set<string>();
      for (let vuelta = 0; vuelta < 3; vuelta++) {
        const nuevos = (await botones(page)).filter((b) => AVISO.test(b.texto) && !vistos.has(b.texto));
        if (!nuevos.length) break;
        for (const b of nuevos) {
          vistos.add(b.texto);
          await page.mouse.click(b.x, b.y);
          hechos.push(`aviso «${b.texto}» en ${(b.x / vp.width).toFixed(2)},${(b.y / vp.height).toFixed(2)}`);
          await page.waitForTimeout(800);
        }
        await page.waitForTimeout(1500);
      }
      continue;
    } else throw new Error(`paso desconocido: ${p}`);
    hechos.push(p);
  }
  return hechos;
}

/** la cámara de la escena principal ahora mismo (posición, dirección, fov) */
export async function camara(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __cine?: { snapshot(): { camera: { pos: number[]; dir: number[]; fov?: number } | null; scroll: { y: number } } } };
    const s = w.__cine?.snapshot();
    return s ? { cam: s.camera, scrollY: s.scroll.y } : null;
  });
}
