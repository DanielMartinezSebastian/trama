/*
 * Gancho del DOM para cine:capture (docs/30 §1): los textos visibles por fotograma, para medir cómo entra y sale el
 * relato escrito y cómo va sincronizado con la escena 3D. Cada unidad es un bloque de texto; el texto partido en letras
 * o palabras (un span por letra, lo que hacen SplitText y compañía) se agrupa en su bloque padre y se mide la media de
 * sus trozos: así un titular que aparece letra a letra es una unidad con su progreso, no cuarenta letras sueltas.
 *
 *   window.__cineDom.sample() → [{ k, txt, r: [x, y, w, h], op, dy, clip, blur, col, fs }]
 *   op: opacidad efectiva media de los trozos (con la de sus antepasados) · dy: desplazamiento medio de los trozos
 *   respecto al bloque (px; un «sube desde abajo» empieza positivo y llega a 0) · clip: si algún trozo tiene clip-path
 *   o el bloque recorta (overflow) · blur: desenfoque en px · col: color del texto · fs: cuerpo en px
 *   vis: lo que se ve de verdad, 0–1: la fracción de la caja que dejan sus contenedores con overflow oculto (y la
 *   ventana), por 0 si en su centro hay otra capa opaca encima. Un lienzo con pointer-events: none no sale en la pila
 *   y puede tapar o no según lo que pinte: lo decide el análisis mirando los píxeles del fotograma (scripts/cine/dom.mts)
 */
(() => {
  const ids = new WeakMap();
  let siguiente = 1;
  const clave = (el) => {
    if (!ids.has(el)) ids.set(el, siguiente++);
    return ids.get(el);
  };
  const opEfectiva = (el) => {
    let op = 1;
    for (let e = el, n = 0; e && e.nodeType === 1 && n < 12; e = e.parentElement, n++) {
      const cs = getComputedStyle(e);
      op *= parseFloat(cs.opacity || "1");
      if (cs.visibility === "hidden" || cs.display === "none") return 0;
      if (op < 0.001) return 0;
    }
    return op;
  };
  const textoPropio = (el) => {
    let t = "";
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
    return t.trim();
  };
  // el bloque de un trozo: sube mientras el trozo sea corto (una letra, una palabra) y el padre siga siendo en línea
  const bloqueDe = (el) => {
    let b = el;
    for (let n = 0; n < 4; n++) {
      const p = b.parentElement;
      if (!p || p === document.body) break;
      const corto = (b.textContent || "").trim().length <= 14;
      // solo los trozos en línea (inline, inline-block): un span con display: block es una línea propia
      const enLinea = getComputedStyle(b).display.startsWith("inline");
      if (corto && enLinea) b = p;
      else break;
    }
    return b;
  };
  // z-index en la raíz: el del antepasado posicionado más externo con z-index (los contextos de apilamiento se comparan ahí)
  const zRaiz = (el) => {
    let z = 0;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.position !== "static" && cs.zIndex !== "auto") z = parseInt(cs.zIndex) || 0;
    }
    return z;
  };
  const visible = (b, rb) => {
    let x0 = Math.max(0, rb.left), y0 = Math.max(0, rb.top), x1 = Math.min(innerWidth, rb.right), y1 = Math.min(innerHeight, rb.bottom);
    for (let e = b.parentElement, n = 0; e && e !== document.body && n < 14; e = e.parentElement, n++) {
      const cs = getComputedStyle(e);
      if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible" || (cs.clipPath && cs.clipPath !== "none")) {
        const r = e.getBoundingClientRect();
        x0 = Math.max(x0, r.left); y0 = Math.max(y0, r.top); x1 = Math.min(x1, r.right); y1 = Math.min(y1, r.bottom);
      }
    }
    const area = Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
    const frac = area / Math.max(1, rb.width * rb.height);
    if (frac <= 0) return 0;
    // la pila de capas en el centro de lo visible: tapado si antes que el bloque hay algo opaco (un fondo con alfa, un
    // lienzo, una imagen, un vídeo)
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    let encima = 1;
    for (const e of document.elementsFromPoint(cx, cy)) {
      if (e === b || b.contains(e) || e.contains(b)) break;
      const t = e.tagName;
      const fondo = getComputedStyle(e).backgroundColor;
      const alfa = /rgba([^)]*,s*([d.]+))/.exec(fondo);
      // un lienzo no cuenta: puede ser transparente donde no pinta (lo decide el análisis con los píxeles)
      const opaco = t === "IMG" || t === "VIDEO" || (fondo !== "transparent" && (!alfa || parseFloat(alfa[1]) > 0.5) && fondo !== "rgba(0, 0, 0, 0)");
      if (opaco && parseFloat(getComputedStyle(e).opacity) > 0.3) {
        encima = 0;
        break;
      }
    }
    return Math.round(frac * encima * 1000) / 1000;
  };
  window.__cineDom = {
    sample() {
      const W = innerWidth;
      const H = innerHeight;
      const bloques = new Map();
      const todos = document.body ? document.body.querySelectorAll("*") : [];
      for (const el of todos) {
        if (el.closest("script,style,noscript,svg,canvas")) continue;
        const t = textoPropio(el);
        if (!t) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1 || r.bottom < -H * 0.25 || r.top > H * 1.25 || r.right < 0 || r.left > W) continue;
        const b = bloqueDe(el);
        if (!bloques.has(b)) bloques.set(b, []);
        bloques.get(b).push({ el, r });
      }
      const out = [];
      for (const [b, trozos] of bloques) {
        const rb = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        const fs = parseFloat(cs.fontSize) || 0;
        let op = 0;
        let dy = 0;
        let clip = cs.clipPath && cs.clipPath !== "none" ? 1 : 0;
        let blur = 0;
        for (const { el, r } of trozos) {
          op += opEfectiva(el);
          dy += r.top - rb.top;
          const ce = getComputedStyle(el);
          if (ce.clipPath && ce.clipPath !== "none") clip = 1;
          const m = /blur\(([\d.]+)px\)/.exec(ce.filter || "");
          if (m) blur = Math.max(blur, parseFloat(m[1]));
        }
        if (cs.overflow === "hidden" || cs.overflowY === "hidden") clip = clip || 0.5;
        const txt = (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48);
        // la caja real de las letras (se mueven con su transform): un bloque cuyas letras están fuera de su máscara no se
        // ve aunque la caja del bloque siga en su sitio (palabras apiladas en el mismo hueco, docs/30 trampa)
        let l = Infinity, t = Infinity, rr = -Infinity, bb = -Infinity;
        for (const { r } of trozos) {
          l = Math.min(l, r.left); t = Math.min(t, r.top); rr = Math.max(rr, r.right); bb = Math.max(bb, r.bottom);
        }
        const rl = { left: l, top: t, right: rr, bottom: bb, width: rr - l, height: bb - t };
        const vis = visible(b, rl);
        const rd = rl;
        out.push({ k: clave(b), txt, vis, r: [Math.round(rd.left), Math.round(rd.top), Math.round(rd.width), Math.round(rd.height)], op: Math.round((op / trozos.length) * 1000) / 1000, dy: Math.round((dy / trozos.length) * 10) / 10, clip, blur, col: cs.color, fs: Math.round(fs) });
      }
      // los 40 más grandes: titulares y textos de primer plano antes que la letra pequeña
      return out.sort((a, b) => b.fs * b.r[2] - a.fs * a.r[2]).slice(0, 40);
    },
  };
})();
