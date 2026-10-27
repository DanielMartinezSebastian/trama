"use client";

import { useState } from "react";
import { cardError } from "@/lib/commerce/card";
import type { CartLine } from "@/lib/commerce/cart";
import { money } from "@/lib/commerce/money";
import Button from "./Button";
import QuantityStepper from "./QuantityStepper";
import Stepper from "./Stepper";
import TextField from "./TextField";
import { vcls, type Variant } from "./variants";

export type CheckoutPickup = { id: string; name: string; address?: string };
export type CheckoutOrder = { code: string; total: number; delivery: "shipping" | "pickup"; place?: string; name: string; email: string };

export type CheckoutFlowProps = {
  /** las líneas del carrito (`useCart`) */
  lines: CartLine[];
  onQty: (id: string, qty: number) => void;
  /** vacía el carrito al confirmar */
  onClear: () => void;
  /** formas de entrega que ofreces: envío a casa, recogida en tienda o las dos */
  delivery?: "shipping" | "pickup" | "both";
  /** coste del envío y a partir de qué importe es gratis */
  shippingCost?: number;
  freeShippingFrom?: number;
  /** tiendas o puntos de recogida */
  pickups?: CheckoutPickup[];
  /** prefijo del número de pedido («PT» → PT-4821) */
  orderPrefix?: string;
  /** enlace de «Seguir comprando» (carrito vacío y confirmación) */
  shopHref?: string;
  /** aviso bajo el pago (que es una demo, devoluciones…) */
  note?: string;
  onOrder?: (o: CheckoutOrder) => void;
  variant?: Variant;
  className?: string;
};

/**
 * Cierre de un pedido en pasos: datos, entrega (envío a casa o recogida en tienda) y pago, con un resumen al lado que
 * deja cambiar cantidades. El pago se simula: valida titular, número (Luhn), caducidad y CVC, o «pagas al recoger». La
 * confirmación da un número de pedido y vacía el carrito. No cobra ni envía nada: conecta `onOrder` a tu pasarela.
 */
export default function CheckoutFlow({
  lines,
  onQty,
  onClear,
  delivery = "both",
  shippingCost = 4.9,
  freeShippingFrom = 50,
  pickups = [],
  orderPrefix = "PD",
  shopHref = "/",
  note = "Pedido de demostración: no se cobra ni se envía nada. Prueba con la tarjeta 4242 4242 4242 4242.",
  onOrder,
  variant = "minimal",
  className = "",
}: CheckoutFlowProps) {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({ name: "", email: "", phone: "" });
  const [entrega, setEntrega] = useState<"shipping" | "pickup">(delivery === "pickup" ? "pickup" : "shipping");
  const [dir, setDir] = useState({ street: "", city: "", zip: "" });
  const [punto, setPunto] = useState(pickups[0]?.id ?? "");
  const [pago, setPago] = useState<"card" | "store">("card");
  const [tarjeta, setTarjeta] = useState({ holder: "", number: "", exp: "", cvc: "" });
  const [error, setError] = useState("");
  const [hecho, setHecho] = useState<CheckoutOrder | null>(null);

  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const envio = entrega === "pickup" || subtotal >= freeShippingFrom ? 0 : shippingCost;
  const total = Math.round((subtotal + envio) * 100) / 100;
  const pasos = "Tus datos, Entrega, Pago";

  if (hecho)
    return (
      <section className={`ui-checkout ui-checkout--done ${className}`} aria-live="polite">
        <div className={`ui-checkout__main ui-surface ${vcls(variant)}`}>
          <p className="ui-book__ok" role="status">
            <span aria-hidden>✓</span> Pedido confirmado
          </p>
          <h2>{hecho.code}</h2>
          <p>
            {hecho.delivery === "pickup" ? `Te lo apartamos en ${pickups.find((p) => p.id === hecho.place)?.name ?? "la tienda"}: te avisamos cuando esté listo.` : "Lo preparamos hoy y te escribimos cuando salga."} Total {money(hecho.total)}.
          </p>
          <p className="ui-book__note">Hemos enviado el resumen a {hecho.email} (demostración: no sale nada).</p>
          <div className="ui-book__actions">
            <Button label="Seguir comprando" href={shopHref} variant={variant} />
          </div>
        </div>
      </section>
    );

  if (!lines.length)
    return (
      <section className={`ui-checkout ui-checkout--done ${className}`}>
        <div className={`ui-checkout__main ui-surface ${vcls(variant)}`}>
          <h2>Tu bolsa está vacía</h2>
          <p className="ui-book__note">Añade algo de la tienda y vuelve aquí para cerrar el pedido.</p>
          <div className="ui-book__actions">
            <Button label="Ir a la tienda" href={shopHref} variant={variant} />
          </div>
        </div>
      </section>
    );

  const siguiente = () => {
    setError("");
    if (paso === 0) {
      if (datos.name.trim().length < 2) return setError("Escribe tu nombre.");
      if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return setError("Revisa el correo (por ejemplo, alex@ejemplo.com).");
    }
    if (paso === 1 && entrega === "shipping" && (!dir.street.trim() || !dir.city.trim() || !/^\d{5}$/.test(dir.zip.trim()))) return setError("Completa la dirección: calle, ciudad y un código postal de cinco cifras.");
    if (paso === 1 && entrega === "pickup" && !punto) return setError("Elige dónde lo recoges.");
    setPaso(paso + 1);
  };
  const pagar = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (pago === "card" || entrega === "shipping") {
      const e = cardError(tarjeta);
      if (e) return setError(e);
    }
    const o: CheckoutOrder = { code: `${orderPrefix}-${String(1000 + ((Date.now() / 1000) % 9000) | 0)}`, total, delivery: entrega, place: entrega === "pickup" ? punto : undefined, name: datos.name.trim(), email: datos.email.trim() };
    setHecho(o);
    onClear();
    onOrder?.(o);
  };

  return (
    <section className={`ui-checkout ${className}`}>
      <div className={`ui-checkout__main ui-surface ${vcls(variant)}`}>
        <Stepper steps={pasos} current={paso} variant={variant} />
        {paso === 0 && (
          <div className="ui-book__step ui-book__form">
            <TextField label="Nombre y apellidos" value={datos.name} onChange={(v) => setDatos({ ...datos, name: v })} autoComplete="name" required variant={variant} />
            <TextField label="Correo" type="email" value={datos.email} onChange={(v) => setDatos({ ...datos, email: v })} autoComplete="email" required variant={variant} />
            <TextField label="Teléfono (opcional)" type="tel" value={datos.phone} onChange={(v) => setDatos({ ...datos, phone: v })} autoComplete="tel" variant={variant} />
          </div>
        )}
        {paso === 1 && (
          <div className="ui-book__step">
            {delivery === "both" && (
              <fieldset className="ui-book__group">
                <legend>¿Cómo lo quieres?</legend>
                <div className="ui-book__choices">
                  <button type="button" aria-pressed={entrega === "shipping"} onClick={() => setEntrega("shipping")}>
                    <span>
                      <b>Envío a casa</b>
                      <small>{subtotal >= freeShippingFrom ? "gratis" : `${money(shippingCost)} · gratis desde ${money(freeShippingFrom, "EUR", "es-ES", true)}`}</small>
                    </span>
                  </button>
                  <button type="button" aria-pressed={entrega === "pickup"} onClick={() => setEntrega("pickup")}>
                    <span>
                      <b>Recoger en tienda</b>
                      <small>gratis</small>
                    </span>
                  </button>
                </div>
              </fieldset>
            )}
            {entrega === "shipping" ? (
              <div className="ui-book__form">
                <TextField label="Calle y número" value={dir.street} onChange={(v) => setDir({ ...dir, street: v })} autoComplete="street-address" required variant={variant} />
                <div className="ui-checkout__fila">
                  <TextField label="Ciudad" value={dir.city} onChange={(v) => setDir({ ...dir, city: v })} autoComplete="address-level2" required variant={variant} />
                  <TextField label="Código postal" value={dir.zip} onChange={(v) => setDir({ ...dir, zip: v })} autoComplete="postal-code" required variant={variant} />
                </div>
              </div>
            ) : (
              <fieldset className="ui-book__group">
                <legend>¿Dónde lo recoges?</legend>
                <div className="ui-book__choices">
                  {pickups.map((p) => (
                    <button key={p.id} type="button" aria-pressed={punto === p.id} onClick={() => setPunto(p.id)}>
                      <span>
                        <b>{p.name}</b>
                        {p.address && <small>{p.address}</small>}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}
        {paso === 2 && (
          <form className="ui-book__step ui-book__form" onSubmit={pagar} noValidate>
            {entrega === "pickup" && (
              <div className="ui-book__choices">
                <button type="button" aria-pressed={pago === "card"} onClick={() => setPago("card")}>
                  <b>Pagar ahora con tarjeta</b>
                </button>
                <button type="button" aria-pressed={pago === "store"} onClick={() => setPago("store")}>
                  <b>Pagar al recoger</b>
                </button>
              </div>
            )}
            {pago === "card" || entrega === "shipping" ? (
              <>
                <TextField label="Titular" value={tarjeta.holder} onChange={(v) => setTarjeta({ ...tarjeta, holder: v })} autoComplete="cc-name" required variant={variant} />
                <TextField label="Número de tarjeta" value={tarjeta.number} onChange={(v) => setTarjeta({ ...tarjeta, number: v.replace(/[^\d ]/g, "").slice(0, 23) })} autoComplete="cc-number" placeholder="4242 4242 4242 4242" required variant={variant} />
                <div className="ui-checkout__fila">
                  <TextField label="Caducidad" value={tarjeta.exp} onChange={(v) => setTarjeta({ ...tarjeta, exp: v.slice(0, 5) })} autoComplete="cc-exp" placeholder="MM/AA" required variant={variant} />
                  <TextField label="CVC" value={tarjeta.cvc} onChange={(v) => setTarjeta({ ...tarjeta, cvc: v.replace(/\D/g, "").slice(0, 4) })} autoComplete="cc-csc" placeholder="123" required variant={variant} />
                </div>
              </>
            ) : (
              <p className="ui-book__note">Lo pagas en la tienda al recogerlo: tarjeta, Bizum o efectivo.</p>
            )}
            <p className="ui-book__note">{note}</p>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              <Button label="Atrás" onClick={() => { setError(""); setPaso(1); }} emphasis="outline" variant={variant} />
              <Button label={`Pagar ${money(total)}`} type="submit" variant={variant} />
            </div>
          </form>
        )}
        {paso < 2 && (
          <>
            {error && (
              <p className="ui-book__error" role="alert">
                {error}
              </p>
            )}
            <div className="ui-book__actions">
              {paso > 0 && <Button label="Atrás" onClick={() => { setError(""); setPaso(paso - 1); }} emphasis="outline" variant={variant} />}
              <Button label="Continuar" glyph="→" onClick={siguiente} variant={variant} />
            </div>
          </>
        )}
      </div>
      <aside className={`ui-book__summary ui-checkout__sum ui-surface ${vcls(variant)}`} aria-label="Resumen del pedido">
        <p className="ui-book__kicker">Tu pedido</p>
        <ul>
          {lines.map((l) => (
            <li key={l.id}>
              <span>
                <b>{l.title}</b>
                {l.meta && <small>{l.meta}</small>}
              </span>
              <QuantityStepper value={l.qty} onChange={(q) => onQty(l.id, q)} label={l.title} max={20} size="sm" />
              <b>{money(l.price * l.qty)}</b>
            </li>
          ))}
        </ul>
        <p className="ui-checkout__linea">
          <span>Envío</span>
          <span>{envio ? money(envio) : "gratis"}</span>
        </p>
        <p className="ui-checkout__linea ui-checkout__total">
          <span>Total</span>
          <b>{money(total)}</b>
        </p>
      </aside>
    </section>
  );
}
