"use client";

import { useLayoutEffect } from "react";
import { pickTransitionAnimation, vtClasses, type PageTransitionPace, type PageTransitionTone, type TransitionChoice } from "./viewTransitions";

/*
 * Parte cliente de PageTransition: arma la animación de la RAÍZ (todo el viewport) en la transición que monta la página.
 *
 * Cómo encaja con React (react-dom, commitAfterMutationEffectsOnFiber, caso de la raíz): si en un commit con View
 * Transition no cambió el tamaño de ningún `<ViewTransition>`, React «cancela» la captura de la raíz poniendo
 * `view-transition-name: none` en línea en <html>, pero solo si ese estilo en línea está vacío. Esa comprobación ocurre
 * después de los efectos de layout del commit nuevo, dentro del callback de `document.startViewTransition`, y antes de
 * que el navegador capture el estado nuevo. Por eso, en un efecto de layout:
 *   1. se lee la transición en curso (`document.activeViewTransition` o la que guarda React) y sus tipos;
 *   2. se pone en <html> `view-transition-name: root` en línea (React ya no la cancela) y un `view-transition-class` con
 *      la animación, el ritmo y el tono (`ui-vt ui-vt-root ui-vt-wipe-left ui-vt--fast ui-vt--acc`), más `data-ui-vt`;
 *   3. al terminar la transición (`finished`), se deja <html> como estaba.
 * El CSS (ui-view-transitions.css) anima `::view-transition-old/new/group(root)` por esas clases.
 */

type ActiveVt = { types?: Iterable<string>; finished: Promise<unknown> };
type VtDocument = Document & { activeViewTransition?: ActiveVt | null; __reactViewTransition?: ActiveVt | null };

/** La transición del documento en curso, si la hay (estándar o la que registra React al iniciarla). */
function activeTransition(): ActiveVt | null {
  const doc = document as VtDocument;
  return doc.activeViewTransition ?? doc.__reactViewTransition ?? null;
}

let armed: object | null = null;

/** Deja <html> sin nuestras marcas (solo si siguen siendo las de esta transición). */
function disarm(token: object) {
  if (armed !== token) return;
  armed = null;
  const html = document.documentElement;
  if (html.style.viewTransitionName === "root") html.style.viewTransitionName = "";
  html.style.removeProperty("view-transition-class");
  html.removeAttribute("data-ui-vt");
}

export type PageTransitionRootProps = TransitionChoice & { pace: PageTransitionPace; tone: PageTransitionTone };

export default function PageTransitionRoot({ kind, direction, pace, tone, types }: PageTransitionRootProps) {
  // Solo al montar: la página nueva entra en el commit de la navegación. Las actualizaciones posteriores de la misma
  // página (un filtro, un estado) no deben animar la ventana entera.
  useLayoutEffect(() => {
    const vt = activeTransition();
    if (!vt) return; // sin API, primera carga o commit fuera de una transición: no se anima nada
    let list: string[] = [];
    try {
      list = vt.types ? Array.from(vt.types) : [];
    } catch {
      list = [];
    }
    const animation = pickTransitionAnimation(list, { kind, direction, types });
    const html = document.documentElement;
    const token = {};
    armed = token;
    html.style.viewTransitionName = "root";
    html.style.setProperty("view-transition-class", vtClasses(animation, "root", pace, tone));
    html.setAttribute("data-ui-vt", animation);
    vt.finished.then(
      () => disarm(token),
      () => disarm(token),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a propósito: solo en la navegación que monta la página
  }, []);
  return null;
}
