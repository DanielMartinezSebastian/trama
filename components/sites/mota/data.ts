/** Mota — estudio ficticio de interiorismo y marca. Fórmulas: 'kin y Neutomni (wordmark gigante en una pantalla, cambio de vista), Uncommon (pegatinas) y Mat Voyce (tipografía elástica). Datos puros. */
export const SLUG = "mota";

export const meta = {
  slug: SLUG,
  name: "Mota",
  title: "Mota · interiorismo y marca con carácter",
  blurb:
    "Web de un estudio de interiorismo con la fórmula «estudio con personalidad»: wordmark monoespaciado gigante en una sola pantalla, collage de pegatinas arrastrables, frase con letras elásticas que reaccionan al scroll, proyectos con cambio de vista animado (lista, cuadrícula, índice) y aviso de cookies con la marca. Usa FitText, StickerCollage, ElasticText, WorkViews, CookieBanner y CustomCursor.",
  accent: "#ff5a36",
  tag: "estudio · pegatinas",
};

export const ROUTES = [
  { path: "", title: "Inicio" },
  { path: "proyectos", title: "Proyectos" },
];

export type Job = { title: string; kind: string; year: string; topic: "interiores" | "gastronomia" | "estudio" | "objetos" | "arquitectura"; i: number; alt: string };

export const JOBS: Job[] = [
  { title: "Casa Lúa", kind: "Vivienda", year: "2026", topic: "interiores", i: 4, alt: "Salón luminoso con sofá y plantas" },
  { title: "Café Brasa", kind: "Hostelería", year: "2026", topic: "interiores", i: 1, alt: "Conversación en una cafetería" },
  { title: "Taller Nube", kind: "Estudio de diseño", year: "2025", topic: "estudio", i: 2, alt: "Mesa de trabajo con tableta gráfica" },
  { title: "Pan de Barrio", kind: "Marca y local", year: "2025", topic: "gastronomia", i: 1, alt: "Pan recién hecho" },
  { title: "Librería Ala", kind: "Comercio", year: "2024", topic: "interiores", i: 2, alt: "Cuadros en la pared sobre una mesa" },
  { title: "Hotel Alba", kind: "Hotel", year: "2024", topic: "arquitectura", i: 4, alt: "Fachada con ventanas regulares" },
  { title: "Pico & Pala", kind: "Tienda", year: "2023", topic: "objetos", i: 0, alt: "Mesa de madera frente a una pared blanca" },
];
