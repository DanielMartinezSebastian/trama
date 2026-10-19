import type { ReactNode } from "react";

export type KbdProps = {
  /** la tecla o combinación: `⌘K`, `Ctrl`, `Esc`… */
  children: ReactNode;
  className?: string;
};

/** Tecla de teclado (`<kbd>`) para atajos en menús, paletas y ayudas. */
export default function Kbd({ children, className = "" }: KbdProps) {
  return <kbd className={`ui-kbd ${className}`.trim()}>{children}</kbd>;
}
