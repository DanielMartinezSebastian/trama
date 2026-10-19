"use client";

import { useRef, useState, type CSSProperties } from "react";

export type GalleryImage = { src: string; alt: string };

export type ProductGalleryProps = {
  images: GalleryImage[];
  /** relación de aspecto «ancho / alto» de la imagen principal */
  ratio?: string;
  /** ampliación al pasar el puntero (1 = sin zoom) */
  zoom?: number;
  /** miniaturas: debajo (`below`) o a un lado (`side`, en pantallas anchas) */
  thumbs?: "below" | "side";
  className?: string;
};

/**
 * Galería de ficha de producto: imagen principal con zoom que sigue al puntero y miniaturas que son botones reales (con la
 * imagen elegida marcada con `aria-pressed`). Si cambian las imágenes (otra variante de color), vuelve a la primera.
 * En táctil no hay zoom: la imagen se ve entera. Con `prefers-reduced-motion` el zoom se mantiene pero sin transición.
 */
export default function ProductGallery({ images, ratio = "4 / 5", zoom = 1.8, thumbs = "below", className = "" }: ProductGalleryProps) {
  const [i, setI] = useState(0);
  const main = useRef<HTMLDivElement>(null);
  const cur = images[Math.min(i, images.length - 1)];
  if (!cur) return null;

  const aim = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = main.current?.getBoundingClientRect();
    if (!r) return;
    main.current!.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    main.current!.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div className={`ui-pgal ui-pgal--${thumbs} ${className}`.trim()}>
      <div ref={main} className="ui-pgal__main" style={{ aspectRatio: ratio, "--zoom": zoom } as CSSProperties} onPointerMove={aim}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cur.src} alt={cur.alt} decoding="async" />
      </div>
      {images.length > 1 && (
        <ul className="ui-pgal__thumbs" aria-label="Imágenes del producto">
          {images.map((im, k) => (
            <li key={im.src + k}>
              <button type="button" className="ui-pgal__t" aria-pressed={k === i} aria-label={`Ver imagen ${k + 1}: ${im.alt}`} onClick={() => setI(k)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.src} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
