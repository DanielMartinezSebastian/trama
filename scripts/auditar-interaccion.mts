import type { Page } from "playwright";

/**
 * «Nada muerto» medido (docs/56 §2.5): cada enlace lleva a algún sitio y cada botón hace algo visible. Lo usa
 * `npm run smoke -- <url> --auditar`.
 *   - Enlaces: sin `href`, `#` o `javascript:` son muertos; un `#ancla` tiene que existir en la página; una ruta interna
 *     tiene que responder (se pide una vez cada una).
 *   - Botones visibles y activos: se pulsan uno a uno y se mira si cambia algo (el DOM, la dirección, el scroll, un
 *     `aria-expanded`/`aria-pressed` o el foco). Tras cada uno se pulsa Escape y, si navegó, se vuelve.
 * No pulsa enlaces (navegarían) ni botones de enviar formularios (se cuentan como vivos si el formulario tiene acción).
 */
export async function auditarInteraccion(page: Page, base: string, max = 80): Promise<string[]> {
  const avisos: string[] = [];
  const inicio = page.url();

  // enlaces
  const enlaces = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>("a")]
      .filter((a) => a.getClientRects().length && getComputedStyle(a).visibility !== "hidden" && !a.closest("[inert], [aria-hidden='true']"))
      .map((a) => ({ href: a.getAttribute("href"), texto: (a.textContent || a.getAttribute("aria-label") || "").trim().slice(0, 40), existe: a.hash ? !!document.getElementById(decodeURIComponent(a.hash.slice(1))) : true, mismo: a.pathname === location.pathname })),
  );
  const rutas = new Set<string>();
  for (const e of enlaces) {
    if (!e.href || e.href === "#" || e.href.startsWith("javascript:")) avisos.push(`enlace muerto: «${e.texto}» (${e.href ?? "sin href"})`);
    else if (e.href.includes("#") && e.mismo && !e.existe) avisos.push(`ancla que no existe: «${e.texto}» (${e.href})`);
    else if (e.href.startsWith("/")) rutas.add(e.href.split("#")[0]);
  }
  for (const r of rutas) {
    const res = await page.request.get(new URL(r, base).href).catch(() => null);
    if (!res || res.status() >= 400) avisos.push(`ruta que no responde: ${r} (${res?.status() ?? "error"})`);
  }

  // botones
  const n = await page.evaluate(() => {
    const bs = [...document.querySelectorAll<HTMLElement>("button, [role='button'], summary")].filter((b) => b.getClientRects().length && !(b as HTMLButtonElement).disabled && getComputedStyle(b).visibility !== "hidden" && !b.closest("[inert], [aria-hidden='true']") && !((b as HTMLButtonElement).type === "submit" && b.closest("form")));
    bs.forEach((b, i) => b.setAttribute("data-auditar", String(i)));
    return bs.length;
  });
  for (let i = 0; i < Math.min(n, max); i++) {
    const sel = `[data-auditar="${i}"]`;
    const el = page.locator(sel);
    if (!(await el.isVisible().catch(() => false))) continue;
    const texto = ((await el.textContent().catch(() => "")) || (await el.getAttribute("aria-label").catch(() => "")) || "").trim().slice(0, 40);
    const antes = await page.evaluate((s) => {
      (window as unknown as { __mut: number }).__mut = 0;
      const w = window as unknown as { __obs?: MutationObserver; __mut: number };
      w.__obs?.disconnect();
      w.__obs = new MutationObserver((m) => (w.__mut += m.length));
      w.__obs.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
      const b = document.querySelector(s);
      return { url: location.href, y: scrollY, exp: b?.getAttribute("aria-expanded"), pre: b?.getAttribute("aria-pressed") };
    }, sel);
    await el.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(350);
    const despues = await page
      .evaluate((s) => {
        const b = document.querySelector(s);
        return { url: location.href, y: scrollY, exp: b?.getAttribute("aria-expanded"), pre: b?.getAttribute("aria-pressed"), mut: (window as unknown as { __mut: number }).__mut };
      }, sel)
      .catch(() => null);
    const vivo = !despues || despues.url !== antes.url || Math.abs(despues.y - antes.y) > 4 || despues.exp !== antes.exp || despues.pre !== antes.pre || despues.mut > 0;
    // una opción ya elegida (aria-pressed o aria-selected) no tiene que cambiar nada al volver a pulsarla
    if (!vivo && antes.pre !== "true") avisos.push(`botón sin efecto: «${texto || sel}»`);
    if (despues && despues.url !== inicio) {
      await page.goto(inicio, { waitUntil: "networkidle" }).catch(() => {});
      await page.evaluate(() => {
        const bs = [...document.querySelectorAll<HTMLElement>("button, [role='button'], summary")].filter((b) => b.getClientRects().length && !(b as HTMLButtonElement).disabled && getComputedStyle(b).visibility !== "hidden" && !b.closest("[inert], [aria-hidden='true']") && !((b as HTMLButtonElement).type === "submit" && b.closest("form")));
        bs.forEach((b, i) => b.setAttribute("data-auditar", String(i)));
      });
    } else {
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(150);
    }
  }
  return avisos;
}
