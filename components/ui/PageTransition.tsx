import { Children, Fragment, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import PageTransitionRoot from "@/lib/ui/pageTransitionRoot";
import { ViewTransition, type PageTransitionAnimation, type PageTransitionDirection, type PageTransitionKind, type PageTransitionPace, type PageTransitionTone } from "@/lib/ui/viewTransitions";

/*
 * Transiciones de página a pantalla completa con la View Transitions API del navegador, a través del `<ViewTransition>`
 * de React. Anima la RAÍZ del documento (`::view-transition-old/new(root)`): todo el viewport —fondos fijos, pie,
 * márgenes— salvo lo que se excluya con `PageTransitionPersist` (cabecera, navegación). Las animaciones son CSS puro
 * (components/ui/styles/ui-view-transitions.css) con los tokens del tema.
 *
 * Sin "use client": funciona en páginas y plantillas de servidor. La parte que toca <html> vive en un componente cliente
 * diminuto (lib/ui/pageTransitionRoot.tsx) que se renderiza a `null`.
 */

export {
  PAGE_TRANSITION_KINDS,
  PAGE_TRANSITION_ANIMATIONS,
  NAV_FORWARD,
  NAV_BACK,
  pageTransitionType,
  pickTransitionAnimation,
  markPageTransition,
  pageTransitionsSupported,
  type PageTransitionKind,
  type PageTransitionDirection,
  type PageTransitionAnimation,
  type PageTransitionPace,
  type PageTransitionTone,
} from "@/lib/ui/viewTransitions";

export type PageTransitionProps = {
  /** animación de las navegaciones sin tipo (y base de `nav-forward` / `nav-back`); `none` = la página cambia sin animar salvo en navegaciones con tipo */
  kind?: PageTransitionKind;
  /** hacia dónde se mueve el contenido en `slide` y `wipe`; `nav-back` usa la contraria */
  direction?: PageTransitionDirection;
  /** duración: `fast` ≈ 240 ms, `normal` ≈ 380 ms, `slow` ≈ 560 ms */
  pace?: PageTransitionPace;
  /** color de barridos, aro, cursor y separación RGB (token del tema) */
  tone?: PageTransitionTone;
  /** tipo de transición → animación, p. ej. `{ "abrir-ficha": "iris" }`; tiene prioridad sobre los tipos automáticos */
  types?: Record<string, PageTransitionAnimation | PageTransitionKind>;
  children: ReactNode;
};

/**
 * Anima la ventana entera al llegar a esta página (App Router de Next: en cada `page.tsx` o en un `template.tsx`, nunca
 * en un `layout`, que no se vuelve a montar). La animación la decide la página de DESTINO. No añade nodos al DOM.
 * Sin soporte (React sin `ViewTransition` o navegador sin la API), la página cambia sin animar.
 */
export default function PageTransition({ kind = "fade", direction = "left", pace = "normal", tone = "acc", types, children }: PageTransitionProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  // El `<ViewTransition>` con todas las clases a "none" no captura nada por su cuenta: solo hace que React envuelva la
  // navegación en `document.startViewTransition` (se monta un boundary). La animación es la de la raíz.
  return (
    <ViewTransition enter="none" exit="none" update="none" share="none" default="none">
      <PageTransitionRoot kind={kind} direction={direction} pace={pace} tone={tone} types={types} />
      {children}
    </ViewTransition>
  );
}

export type PageTransitionPersistProps = {
  /** nombre único en la página (`view-transition-name`); uno distinto por cada elemento fijo */
  name?: string;
  children: ReactNode;
};

/**
 * Deja fuera de la animación de página lo que envuelve (cabecera, barra de navegación, reproductor, índice lateral…):
 * se captura aparte, se queda quieto y por encima mientras el resto de la ventana transiciona. Todo elemento que deba
 * quedarse quieto lo necesita, esté en el layout o en la página.
 *
 * Si el hijo es UN elemento HTML (`<header>`, `<nav>`, `<aside>`…), se le pone `view-transition-name` en su `style`
 * de forma permanente: así queda excluido aunque viva en un layout que React no vuelve a tocar en la navegación (React
 * solo nombra los `<ViewTransition>` de las partes del árbol que cambian). Con otro hijo (un componente, varios nodos)
 * solo actúa el `<ViewTransition>` de React: vale para lo que se vuelve a renderizar con la página, no para un layout.
 */
export function PageTransitionPersist({ name = "ui-site-header", children }: PageTransitionPersistProps) {
  if (!ViewTransition) return <Fragment>{children}</Fragment>;
  let child = children;
  if (Children.count(children) === 1 && isValidElement(children) && typeof children.type === "string") {
    const el = children as ReactElement<{ style?: CSSProperties }>;
    child = cloneElement(el, { style: { ...el.props.style, viewTransitionName: name, viewTransitionClass: "ui-vt-persist" } as CSSProperties });
  }
  return (
    <ViewTransition name={name} default="ui-vt-persist" share="ui-vt-persist" enter="ui-vt-persist" exit="ui-vt-persist" update="ui-vt-persist">
      {child}
    </ViewTransition>
  );
}
