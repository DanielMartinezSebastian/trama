import { Ruthie, Stack_Sans_Headline } from "next/font/google";

// la caligráfica de la referencia para las palabras gigantes (su web la carga como «ruthie»)
export const ruthie = Ruthie({ weight: "400", subsets: ["latin"], variable: "--font-ruthie" });
// la de palo seco de la referencia (StackSansHeadline ExtraLight y Regular)
export const stack = Stack_Sans_Headline({ weight: ["200", "400"], subsets: ["latin"], variable: "--font-stack" });
