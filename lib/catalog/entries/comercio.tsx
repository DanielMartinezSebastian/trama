"use client";

import { useState } from "react";
import CartDrawer from "@/components/ui/CartDrawer";
import FilterBar from "@/components/ui/FilterBar";
import OptionPicker from "@/components/ui/OptionPicker";
import PriceTag from "@/components/ui/PriceTag";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/ui/ProductGallery";
import QuantityStepper from "@/components/ui/QuantityStepper";
import type { CartLine } from "@/lib/commerce/cart";
import { potteryArt } from "@/lib/sites/art";
import type { CatalogEntry } from "../schema";

/** Comercio (ver docs/06-indice-replicar-webs-premiadas.md, bloque J). */
const A = potteryArt(0, "vase", "#b5532f");
const B = potteryArt(2, "vase", "#b5532f");
const C = potteryArt(3, "bowl", "#7d8f69");
const EDITORIAL = ["editorial", "minimal", "solid"] as CatalogEntry["styles"];

function QtyDemo({ label }: { label: string }) {
  const [n, setN] = useState(1);
  return <QuantityStepper value={n} onChange={setN} label={label} max={10} />;
}
function PickerDemo({ kind, label }: { kind: "swatch" | "chip"; label: string }) {
  const [v, setV] = useState(kind === "swatch" ? "terracota" : "m");
  const opts = kind === "swatch"
    ? [{ value: "terracota", label: "Terracota", color: "#b5532f" }, { value: "salvia", label: "Salvia", color: "#7d8f69" }, { value: "hueso", label: "Hueso", color: "#d9cdb8", disabled: true }, { value: "carbon", label: "Carbón", color: "#34322f" }]
    : [{ value: "s", label: "Pequeño" }, { value: "m", label: "Mediano" }, { value: "l", label: "Grande" }, { value: "xl", label: "Extra", disabled: true }];
  return <OptionPicker label={label} kind={kind} options={opts} value={v} onChange={setV} />;
}
function FilterDemo({ total }: { total: boolean }) {
  const [values, setValues] = useState<Record<string, string[]>>({ tipo: ["Tazas"], material: [] });
  const [sort, setSort] = useState("destacados");
  return (
    <FilterBar
      groups={[
        { id: "tipo", label: "Tipo", options: ["Jarrones", "Cuencos", "Tazas", "Platos"].map((t, i) => ({ value: t, label: t, count: 4 - i })) },
        { id: "material", label: "Material", options: ["Gres", "Porcelana", "Terracota"].map((m) => ({ value: m, label: m })) },
      ]}
      values={values}
      onChange={setValues}
      sort={{ value: sort, onChange: setSort, options: [{ value: "destacados", label: "Destacados" }, { value: "asc", label: "Precio ascendente" }, { value: "desc", label: "Precio descendente" }] }}
      total={total ? 12 : undefined}
      noun="piezas"
    />
  );
}
function CartDemo({ free, empty }: { free: number; empty: boolean }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([
    { id: "a", title: "Jarrón Ola", price: 48, qty: 1, image: A, meta: "Terracota · Pequeño" },
    { id: "b", title: "Cuenco Brisa", price: 28, qty: 2, image: C, meta: "Salvia · Mediano" },
  ]);
  const shown = empty ? [] : lines;
  return (
    <>
      <button type="button" className="ui-cmdk__btn" onClick={() => setOpen(true)} aria-haspopup="dialog">Abrir carrito ({shown.length})</button>
      <CartDrawer
        open={open}
        onOpenChange={setOpen}
        lines={shown}
        onQty={(id, q) => setLines((cur) => cur.map((l) => (l.id === id ? { ...l, qty: q } : l)))}
        onRemove={(id) => setLines((cur) => cur.filter((l) => l.id !== id))}
        freeShippingFrom={free}
        continueHref="#"
        checkoutHref="#"
      />
    </>
  );
}

export const comercio: CatalogEntry[] = [
  {
    id: "price-tag",
    component: "PriceTag",
    path: "@/components/ui/PriceTag",
    name: "Precio con rebaja",
    category: "feedback",
    styles: EDITORIAL,
    description: "Precio con precio anterior tachado y porcentaje de descuento. El tachado y la rebaja llevan texto accesible: no dependen del color ni del tachado.",
    stageHeight: 140,
    props: [
      { key: "price", label: "Precio", type: "number", default: 28, min: 0, max: 999, step: 1 },
      { key: "compareAt", label: "Precio anterior (0 = sin rebaja)", type: "number", default: 34, min: 0, max: 999, step: 1 },
      { key: "size", label: "Tamaño", type: "select", default: "lg", options: ["sm", "md", "lg"] },
      { key: "currency", label: "Moneda", type: "select", default: "EUR", options: ["EUR", "USD", "GBP"] },
    ],
    render: (p) => (
      <div className="ui-center">
        <PriceTag price={p.price as number} compareAt={(p.compareAt as number) || undefined} size={p.size as never} currency={p.currency as string} />
      </div>
    ),
  },
  {
    id: "quantity-stepper",
    component: "QuantityStepper",
    path: "@/components/ui/QuantityStepper",
    name: "Selector de cantidad",
    category: "formularios",
    styles: EDITORIAL,
    description: "− y + con el producto nombrado en cada botón («Quitar una unidad de Taza») y el valor anunciado al cambiar.",
    stageHeight: 140,
    props: [
      { key: "label", label: "Producto", type: "text", default: "Taza Alba" },
      { key: "size", label: "Tamaño", type: "select", default: "md", options: ["sm", "md"] },
    ],
    render: (p) => (
      <div className="ui-center">
        <QtyDemo label={(p.label as string) || "producto"} />
      </div>
    ),
  },
  {
    id: "option-picker",
    component: "OptionPicker",
    path: "@/components/ui/OptionPicker",
    name: "Selector de variante (color, talla)",
    category: "formularios",
    styles: EDITORIAL,
    description: "Círculos de color (con su nombre accesible) o chips de texto. Botones de radio nativos: flechas para moverse, la elegida se anuncia y las agotadas quedan tachadas y deshabilitadas.",
    stageHeight: 200,
    props: [
      { key: "kind", label: "Tipo", type: "select", default: "swatch", options: ["swatch", "chip"], labels: { swatch: "círculos de color", chip: "chips de texto" } },
      { key: "label", label: "Título", type: "text", default: "Esmalte" },
    ],
    render: (p) => (
      <div className="ui-center" style={{ width: "min(100%, 360px)" }}>
        <PickerDemo key={p.kind as string} kind={p.kind as never} label={p.label as string} />
      </div>
    ),
  },
  {
    id: "product-card",
    component: "ProductCard",
    path: "@/components/ui/ProductCard",
    name: "Tarjeta de producto",
    category: "tarjetas",
    styles: EDITORIAL,
    description: "Imagen con segunda imagen al pasar el puntero, etiqueta, título, material y precio. Todo el cuadro es un único enlace con nombre claro. Sin JS: el cambio de imagen es CSS.",
    stageHeight: 420,
    props: [
      { key: "title", label: "Título", type: "text", default: "Jarrón Ola" },
      { key: "price", label: "Precio", type: "number", default: 48, min: 0, max: 999, step: 1 },
      { key: "compareAt", label: "Precio anterior (0 = sin rebaja)", type: "number", default: 0, min: 0, max: 999, step: 1 },
      { key: "badge", label: "Etiqueta", type: "text", default: "Novedad" },
      { key: "meta", label: "Línea secundaria", type: "text", default: "Jarrones · gres" },
      { key: "soldOut", label: "Agotado", type: "boolean", default: false },
      { key: "ratio", label: "Relación de aspecto", type: "text", default: "4 / 5" },
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 260px)", padding: 16 }}>
        <ProductCard title={p.title as string} price={p.price as number} compareAt={(p.compareAt as number) || undefined} badge={p.badge as string} meta={p.meta as string} soldOut={p.soldOut as boolean} ratio={p.ratio as string} image={A} hoverImage={B} alt={p.title as string} />
      </div>
    ),
  },
  {
    id: "product-gallery",
    component: "ProductGallery",
    path: "@/components/ui/ProductGallery",
    name: "Galería de producto",
    category: "galerias",
    styles: EDITORIAL,
    description: "Imagen principal con zoom que sigue al puntero y miniaturas que son botones reales (aria-pressed). En táctil no hay zoom: la imagen se ve entera.",
    stageHeight: 460,
    props: [
      { key: "thumbs", label: "Miniaturas", type: "select", default: "below", options: ["below", "side"], labels: { below: "debajo", side: "al lado" } },
      { key: "zoom", label: "Zoom", type: "number", default: 1.8, min: 1, max: 3, step: 0.1 },
      { key: "ratio", label: "Relación de aspecto", type: "text", default: "4 / 5" },
    ],
    render: (p) => (
      <div style={{ width: "min(100%, 380px)", padding: 16 }}>
        <ProductGallery thumbs={p.thumbs as never} zoom={p.zoom as number} ratio={p.ratio as string} images={[{ src: A, alt: "Jarrón terracota, vista 1" }, { src: B, alt: "Jarrón terracota, vista 2" }, { src: C, alt: "Cuenco salvia" }]} />
      </div>
    ),
  },
  {
    id: "filter-bar",
    component: "FilterBar",
    path: "@/components/ui/FilterBar",
    name: "Filtros y orden",
    category: "navegacion",
    styles: EDITORIAL,
    description: "Grupos de chips (aria-pressed) con contador, selector de orden, número de resultados anunciado con aria-live y «Quitar filtros». Controlada: el estado vive en tu página.",
    stageHeight: 260,
    props: [{ key: "total", label: "Mostrar resultados", type: "boolean", default: true }],
    render: (p) => (
      <div style={{ width: "100%", padding: 16 }}>
        <FilterDemo total={p.total as boolean} />
      </div>
    ),
  },
  {
    id: "cart-drawer",
    component: "CartDrawer",
    path: "@/components/ui/CartDrawer",
    name: "Carrito lateral",
    category: "overlays",
    styles: EDITORIAL,
    description: "Líneas con cantidad y quitar, subtotal, barra de envío gratis y botón de pedir. Diálogo modal: atrapa el foco, Esc y el fondo cierran, devuelve el foco. Pensado para usarse con useCart.",
    stageHeight: 200,
    notes: ["El estado del carrito lo trae useCart (de trama-ui), con persistencia en localStorage; este componente solo lo pinta."],
    props: [
      { key: "freeShippingFrom", label: "Envío gratis desde (0 = sin barra)", type: "number", default: 60, min: 0, max: 300, step: 5 },
      { key: "empty", label: "Carrito vacío", type: "boolean", default: false },
    ],
    render: (p) => (
      <div className="ui-center">
        <CartDemo free={p.freeShippingFrom as number} empty={p.empty as boolean} />
      </div>
    ),
  },
];
