/* Validación de una tarjeta en un pago simulado (CheckoutFlow, EnrollmentFlow). No sustituye a una pasarela: solo hace
   que el formulario se comporte como uno real. */

/** Luhn: la tarjeta de prueba 4242 4242 4242 4242 pasa; un número tecleado al azar, casi nunca */
export function cardNumberOk(n: string) {
  const d = n.replace(/\D/g, "");
  if (d.length < 13 || d.length > 19) return false;
  let s = 0;
  for (let i = 0; i < d.length; i++) {
    let x = Number(d[d.length - 1 - i]);
    if (i % 2) x = x * 2 > 9 ? x * 2 - 9 : x * 2;
    s += x;
  }
  return s % 10 === 0;
}

/** «MM/AA» y en el futuro */
export function cardExpiryOk(v: string) {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim());
  if (!m) return false;
  const mes = Number(m[1]);
  return mes >= 1 && mes <= 12 && new Date(2000 + Number(m[2]), mes, 1).getTime() > Date.now();
}

export type CardData = { holder: string; number: string; exp: string; cvc: string };

/** el primer error de una tarjeta, o "" si está bien */
export function cardError(c: CardData) {
  if (c.holder.trim().length < 2) return "Escribe el nombre que aparece en la tarjeta.";
  if (!cardNumberOk(c.number)) return "El número de tarjeta no es válido. Para probar: 4242 4242 4242 4242.";
  if (!cardExpiryOk(c.exp)) return "La caducidad va como MM/AA y tiene que ser futura.";
  if (!/^\d{3,4}$/.test(c.cvc.trim())) return "El CVC son los tres números del dorso.";
  return "";
}
