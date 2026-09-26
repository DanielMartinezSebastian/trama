"use client";

import { useState } from "react";

/** `npm i trama-ui` que se copia al pulsar. */
export default function InstallChip({ className = "", command = "npm i trama-ui" }: { className?: string; command?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* portapapeles no disponible */
    }
  };
  return (
    <button type="button" className={`tr-install ${className}`} onClick={copy} aria-label={`Copiar el comando ${command}`}>
      <span aria-hidden>$</span> <span aria-hidden>{command}</span>
      <em aria-hidden>{copied ? "copiado" : "copiar"}</em>
      <span className="ui-sr-only" role="status">
        {copied ? "Comando copiado" : ""}
      </span>
    </button>
  );
}
