"use client";

import { useState } from "react";

/** Construcción local de la versión de esta rama, sin resolver el latest público. */
export default function InstallChip({ className = "", command = "npm run pkg:pack" }: { className?: string; command?: string }) {
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
    <button type="button" className={`tr-install ${className}`} onClick={copy} aria-label={`Copiar el comando ${command}`} title="Desde el repositorio de Trama; después instala el .tgz en tu proyecto">
      <span aria-hidden>$</span> <span aria-hidden>{command}</span>
      <em aria-hidden>{copied ? "copiado" : "copiar"}</em>
      <span className="ui-sr-only" role="status">
        {copied ? "Comando copiado" : ""}
      </span>
    </button>
  );
}
