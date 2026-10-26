import { splitEscaped } from "./list";

export type PricingPlan = {
  id?: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  yearlyPrice?: string;
  /** Duración, frecuencia o dato breve junto al precio. */
  meta?: string;
  /** Condición del precio, visible antes de elegir. */
  note?: string;
  cta?: string;
  href?: string;
};

/** Conserva el formato de texto del catálogo y permite datos tipados de un producto real. */
export function pricingPlans(input: string | PricingPlan[]): PricingPlan[] {
  if (Array.isArray(input)) return input;
  return input.split("\n").map(line=>splitEscaped(line,"|").map(s=>s.trim())).filter(r=>r[0]).map(([name,price,period,hl,features,description,yearlyPrice,meta,note])=>({name,price,period,highlighted:hl==="si",features:splitEscaped(features??"",";").filter(Boolean),description,yearlyPrice,meta,note}));
}

/** A price is shown as annual only when it is distinct from the monthly one. */
export function pricingSelection(plan: PricingPlan, yearly: boolean, yearlyPeriod: string) {
  const annual=yearly && !!plan.yearlyPrice && plan.yearlyPrice !== plan.price;
  return {name:plan.name,price:annual?plan.yearlyPrice!:plan.price,period:annual?yearlyPeriod:plan.period??"",yearly:annual,id:plan.id};
}
