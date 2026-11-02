import type { Metadata } from "next";
import DecisionMap from "@/components/decision-map/decision-map";

export const metadata: Metadata = {
  title: "Cómo deciden las skills · Trama",
  description: "Mapa interactivo de las decisiones documentadas en las skills de Trama.",
};

export default function DecisionMapPage() {
  return <DecisionMap />;
}
