"use client";

import { useEffect, useState } from "react";
import { vcls, type Variant } from "./variants";

export type PaginationProps = {
  total?: number;
  defaultPage?: number;
  siblingCount?: number;
  variant?: Variant;
  className?: string;
};

/** Paginación numérica con elipsis cuando hay muchas páginas. Gestiona su propia página activa. */
export default function Pagination({ total = 9, defaultPage = 1, siblingCount = 1, variant = "glass", className = "" }: PaginationProps) {
  const [page, setPage] = useState(() => Math.min(Math.max(1, defaultPage), Math.max(1, total)));
  useEffect(() => setPage(Math.min(Math.max(1, defaultPage), Math.max(1, total))), [defaultPage, total]);

  const pages = new Set<number>([1, total, page]);
  for (let d = 1; d <= siblingCount; d++) {
    pages.add(page - d);
    pages.add(page + d);
  }
  const list = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const withGaps: (number | "gap")[] = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) withGaps.push("gap");
    withGaps.push(p);
  });

  return (
    <nav aria-label="Paginación" className={`ui-page ${vcls(variant)} ${className}`}>
      <button type="button" className="ui-page__nav" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Página anterior">
        ‹
      </button>
      {withGaps.map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="ui-page__gap">
            …
          </span>
        ) : (
          <button key={p} type="button" className={`ui-page__num ${p === page ? "is-on" : ""}`} aria-current={p === page || undefined} onClick={() => setPage(p)}>
            {p}
          </button>
        ),
      )}
      <button type="button" className="ui-page__nav" disabled={page >= total} onClick={() => setPage((p) => p + 1)} aria-label="Página siguiente">
        ›
      </button>
    </nav>
  );
}
