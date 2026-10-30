import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { chromiumPath } from "../chromium-path.mts";

const input = process.argv[2];
if (!input) throw new Error("Uso: npm run qa:visual-text -- http://127.0.0.1:3000 [--widths 320,390,768,830,1024,1072,1150,1440] [--path /]");
const base = new URL(input);
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("qa:visual-text solo admite servidores locales");
const arg = (name: string) => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const widths = (arg("--widths") ?? "320,390,768,830,1024,1072,1150,1440").split(",").map(Number);
const path = arg("--path") ?? "/";
if (widths.some((width) => !Number.isInteger(width) || width < 240 || width > 3000)) throw new Error("Ancho inválido en --widths");
const out = resolve(`.refs3d/visual-text/${base.port || "80"}-${Date.now()}`);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: chromiumPath() });
const reports = [];
try {
  const page = await browser.newPage({ viewport: { width: widths[0], height: 900 } });
  await page.addInitScript("window.__name = (f) => f");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(new URL(path, base).href, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (!response || response.status() >= 400) throw new Error(`${path} respondió ${response?.status() ?? "sin respuesta"} a ${width}px`);
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 10000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = [...document.images];
      images.forEach((image) => { image.loading = "eager"; });
      await Promise.race([
        Promise.all(images.map((image) => image.decode().catch(() => undefined))),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    });
    await page.screenshot({ path: resolve(out, `${width}.png`), fullPage: true });
    const review = await page.evaluate(() => {
      type Line = { text: string; tag: string; className: string; ariaHidden: boolean; fontSize: number; rect: { x: number; y: number; width: number; height: number } };
      const lines: Line[] = [];
      const clipped: { text: string; clippedBy: string; axis: string }[] = [];
      const mediaIntersections: { text: string; textClass: string; media: string; ratio: number }[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
        const element = node.parentElement;
        const closedDetails = element?.closest("details:not([open])");
        if (!text || !element || (closedDetails && !element.closest("summary"))) continue;
        const style = getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || !element.checkVisibility({ checkOpacity: true })) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of Array.from(range.getClientRects())) {
          if (rect.width < 1 || rect.height < 1) continue;
          let fullyClipped = false;
          for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
            const ancestorStyle = getComputedStyle(ancestor);
            const box = ancestor.getBoundingClientRect();
            const axes = [];
            const clipsX = /hidden|clip|scroll|auto/.test(ancestorStyle.overflowX);
            const clipsY = /hidden|clip|scroll|auto/.test(ancestorStyle.overflowY);
            if (clipsX && (rect.left < box.left - 2 || rect.right > box.right + 2)) axes.push("x");
            if (clipsY && (rect.top < box.top - 2 || rect.bottom > box.bottom + 2)) axes.push("y");
            if (axes.length) {
              const visibleWidth = Math.max(0, Math.min(rect.right, clipsX ? box.right : rect.right) - Math.max(rect.left, clipsX ? box.left : rect.left));
              const visibleHeight = Math.max(0, Math.min(rect.bottom, clipsY ? box.bottom : rect.bottom) - Math.max(rect.top, clipsY ? box.top : rect.top));
              if (visibleWidth < 1 || visibleHeight < 1) fullyClipped = true;
              else clipped.push({ text: text.slice(0, 100), clippedBy: `${ancestor.tagName.toLowerCase()}.${typeof ancestor.className === "string" ? ancestor.className : ""}`, axis: axes.join("") });
            }
          }
          if (fullyClipped) continue;
          lines.push({
            text: text.slice(0, 100), tag: element.tagName.toLowerCase(),
            className: typeof element.className === "string" ? element.className : "",
            ariaHidden: Boolean(element.closest('[aria-hidden="true"]')),
            fontSize: parseFloat(style.fontSize),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          });
        }
      }
      const collisions = [];
      for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
        const a = lines[i], b = lines[j];
        if (a.tag === b.tag && a.className === b.className && a.text === b.text) continue;
        const x = Math.max(0, Math.min(a.rect.x + a.rect.width, b.rect.x + b.rect.width) - Math.max(a.rect.x, b.rect.x));
        const y = Math.max(0, Math.min(a.rect.y + a.rect.height, b.rect.y + b.rect.height) - Math.max(a.rect.y, b.rect.y));
        const area = x * y;
        const minArea = Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height);
        if (x > 2 && y > 2 && area > Math.max(12, minArea * .04)) collisions.push({ a, b, intersection: { x, y, area: Math.round(area) } });
      }
      const smallText = [...new Map(lines.filter((line) => line.fontSize < 12).map((line) => [`${line.tag}.${line.className}:${line.text}`, { tag: line.tag, className: line.className, text: line.text, fontSize: line.fontSize, ariaHidden: line.ariaHidden }])).values()];
      const media = [...document.querySelectorAll<HTMLElement>("img,svg,video,canvas")].filter((element) => element.checkVisibility({ checkOpacity: true })).map((element) => ({ element, rect: element.getBoundingClientRect(), name: `${element.tagName.toLowerCase()}.${typeof element.className === "string" ? element.className : element.getAttribute("class") ?? ""}` }));
      for (const line of lines) for (const item of media) {
        const x = Math.max(0, Math.min(line.rect.x + line.rect.width, item.rect.right) - Math.max(line.rect.x, item.rect.left));
        const y = Math.max(0, Math.min(line.rect.y + line.rect.height, item.rect.bottom) - Math.max(line.rect.y, item.rect.top));
        const area = x * y;
        const ratio = area / Math.max(1, line.rect.width * line.rect.height);
        if (area > 16 && ratio > .02) mediaIntersections.push({ text: line.text, textClass: `${line.tag}.${line.className}`, media: item.name, ratio: +ratio.toFixed(2) });
      }
      return { viewport: innerWidth, document: document.documentElement.scrollWidth, collisionCount: collisions.length, collisions: collisions.slice(0, 100), mediaIntersectionCount: mediaIntersections.length, mediaIntersections: mediaIntersections.slice(0, 100), smallText, clipped: [...new Map(clipped.map((item) => [`${item.text}|${item.clippedBy}|${item.axis}`, item])).values()] };
    });
    reports.push(review);
    console.log(JSON.stringify({ width, document: review.document, collisionCount: review.collisionCount, mediaIntersectionCount: review.mediaIntersectionCount, clippedCount: review.clipped.length, smallTextCount: review.smallText.length, candidates: review.collisions.slice(0, 5), mediaCandidates: review.mediaIntersections.slice(0, 5), smallText: review.smallText.slice(0, 5) }));
  }
  writeFileSync(resolve(out, "resultado.json"), JSON.stringify({ url: base.href, path, widths, reports, criterio: "Las colisiones y el microtexto son candidatos para inspección visual; la herramienta no los declara error automáticamente." }, null, 2) + "\n");
  console.log(`Capturas e informe: ${out}`);
} finally {
  await browser.close();
}
