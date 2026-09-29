"use client";

import { useLayoutEffect } from "react";
import { pickTransitionAnimation, vtClasses, type PageTransitionPace, type PageTransitionTone, type TransitionChoice } from "./viewTransitions";

/*
 * Parte cliente de PageTransition: arma la animación de la RAÍZ (todo el viewport) en las transiciones que monta y
 * desmonta la página.
 *
 * Cómo encaja con React (react-dom, commitAfterMutationEffectsOnFiber, caso de la raíz): si en un commit con View
 * Transition no cambió el tamaño de ningún `<ViewTransition>`, React «cancela» la captura de la raíz poniendo
 * `view-transition-name: none` en línea en <html>, pero solo si ese estilo en línea está vacío. Esa comprobación ocurre
 * después de los efectos de layout del commit, dentro del callback de `document.startViewTransition`, y antes de que
 * el navegador capture el estado nuevo. Por eso, en un efecto de layout se arma `<html>`:
 *   1. se lee la transición en curso (`document.activeViewTransition` o la que guarda React) y sus tipos;
 *   2. se pone en <html> `view-transition-name: root` en línea (React ya no la cancela) y un `view-transition-class` con
 *      la animación, el ritmo y el tono (`ui-vt ui-vt-root ui-vt-wipe-left ui-vt--fast ui-vt--acc`), más `data-ui-vt`;
 *   3. al terminar esa transición (`finished`), se deja <html> como estaba.
 * El CSS (ui-view-transitions.css) anima `::view-transition-old/new/group(root)` por esas clases.
 *
 * Por qué también al desmontar: una navegación puede llegarle a React en DOS commits independientes en vez de uno —
 * uno que desmonta la página de origen (nada nuevo aparece todavía) y, después, otro que monta la de destino. Cada
 * commit con un `<ViewTransition>` afectado dispara su propio `document.startViewTransition`. Si solo armamos al
 * montar, el commit de salida (que no monta ningún `PageTransitionRoot` nuevo) no tiene quién lo arme: React lo
 * cancela y ese commit cae al cross-fade por defecto del navegador, sin nuestro CSS, justo al lado de los elementos
 * persistentes (la cabecera) que sí se quedan quietos — se percibe como que la página entera parpadea. Armar también
 * en la limpieza del efecto le da a ese commit de salida el mismo tratamiento que esta página ya tenía configurado.
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

/**
 * Arma <html> para la transición ACTIVA en este momento (si la hay y nadie la ha armado ya): calcula la animación a
 * partir de sus tipos y la deja marcada hasta que esa transición termine. Sirve tanto al montar (la transición que
 * trae la página nueva) como al desmontar (la transición, si la hay, que se lleva la vieja en un commit aparte).
 */
function arm(choice: TransitionChoice, pace: PageTransitionPace, tone: PageTransitionTone) {
  if (armed) return; // esta transición ya la armó otra instancia (o esta misma, antes)
  const vt = activeTransition();
  if (!vt) return; // sin API, o este commit no es una transición: no hay nada que armar
  let list: string[] = [];
  try {
    list = vt.types ? Array.from(vt.types) : [];
  } catch {
    list = [];
  }
  const animation = pickTransitionAnimation(list, choice);
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
}

export type PageTransitionRootProps = TransitionChoice & { pace: PageTransitionPace; tone: PageTransitionTone };

export default function PageTransitionRoot({ kind, direction, pace, tone, types }: PageTransitionRootProps) {
  useLayoutEffect(() => {
    // Al montar: la página nueva entra en el commit de la navegación (o en el segundo commit, si hubo dos).
    arm({ kind, direction, types }, pace, tone);
    // Al desmontarse esta instancia (la página deja de ser la actual): si ese desmontaje ocurre en su propio commit
    // de transición —el caso de las navegaciones en dos commits—, arma ese commit también, con la misma animación
    // que tenía esta página. Si el desmontaje no es parte de ninguna transición (recarga completa, navegación sin
    // View Transitions…), `arm` no encuentra ninguna activa y no hace nada.
    return () => arm({ kind, direction, types }, pace, tone);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a propósito: solo en la navegación que monta/desmonta la página
  }, []);
  return null;
}
