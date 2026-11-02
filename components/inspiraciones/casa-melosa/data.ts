import type { BriefService } from "@/components/ui/BriefFlow";

/* Datos de Casa Melosa (docs/58): espacios, objetos a la venta, consultorio y servicios. Datos puros. */

const I = "/img/inspiraciones/casa-melosa/";

export const PORTADA = `${I}portada-salon.webp`;
export const ESTUDIO = `${I}estudio-equipo.webp`;

export type Espacio = { id: string; nombre: string; lugar: string; ano: string; img: string; extra: [string, string]; texto: string; datos: [string, string][] };
export const ESPACIOS: Espacio[] = [
  { id: "casa-de-los-naranjos", nombre: "Casa de los Naranjos", lugar: "Sevilla", ano: "2026", img: `${I}naranjos.webp`, extra: [`${I}naranjos-a.webp`, `${I}naranjos-b.webp`], texto: "Un patio de 1910, cal de verdad y un sofá curvo que pide sobremesa. Lo más difícil fue convencer a la familia de pintar el techo de rosa.", datos: [["Superficie", "320 m²"], ["Alcance", "Interiorismo y mobiliario"], ["Foto", "Sesión de demostración"]] },
  { id: "atico-gran-via", nombre: "Ático Gran Vía", lugar: "Madrid", ano: "2025", img: `${I}atico.webp`, extra: [`${I}atico-a.webp`, `${I}atico-b.webp`], texto: "Para una pareja que recibe seis noches al mes. La cocina es el escenario y el salón, el patio de butacas.", datos: [["Superficie", "180 m²"], ["Alcance", "Reforma integral"], ["Foto", "Sesión de demostración"]] },
  { id: "hotel-la-perdiz", nombre: "Hotel La Perdiz", lugar: "Pollença", ano: "2025", img: `${I}perdiz.webp`, extra: [`${I}perdiz-a.webp`, `${I}perdiz-b.webp`], texto: "Doce habitaciones, ninguna igual. Mantas de lana mallorquina y bañeras frente a la ventana.", datos: [["Superficie", "1.100 m²"], ["Alcance", "Interiorismo y objetos"], ["Foto", "Sesión de demostración"]] },
  { id: "bodega-tres-robles", nombre: "Bodega Tres Robles", lugar: "La Rioja", ano: "2024", img: `${I}bodega.webp`, extra: [`${I}bodega-a.webp`, `${I}bodega-b.webp`], texto: "Un comedor largo bajo una bóveda de piedra. La mesa la hizo un carpintero del pueblo con un roble caído.", datos: [["Superficie", "640 m²"], ["Alcance", "Sala de catas y comedor"], ["Foto", "Sesión de demostración"]] },
];

export type Objeto = { id: string; nombre: string; precio: number; img: string; nota: string; colores: string[] };
export const OBJETOS: Objeto[] = [
  { id: "lampara-ortiga", nombre: "Lámpara Ortiga", precio: 340, img: `${I}obj-lampara.webp`, nota: "Latón y seda plisada, hecha en Toledo.", colores: ["Rosa", "Hueso"] },
  { id: "butaca-sobremesa", nombre: "Butaca Sobremesa", precio: 1280, img: `${I}obj-butaca.webp`, nota: "Respaldo curvo y patas de nogal.", colores: ["Teja", "Oliva"] },
  { id: "jarron-panal", nombre: "Jarrón Panal", precio: 120, img: `${I}obj-jarron.webp`, nota: "Gres torneado a mano en La Bisbal.", colores: ["Miel", "Tinta"] },
  { id: "manta-perdiz", nombre: "Manta Perdiz", precio: 210, img: `${I}obj-manta.webp`, nota: "Lana mallorquina, 140 × 200 cm.", colores: ["Rosa", "Teja"] },
  { id: "mesa-bola", nombre: "Mesa Bola", precio: 690, img: `${I}obj-mesa.webp`, nota: "Auxiliar lacada, de pie único.", colores: ["Chocolate", "Rosa"] },
  { id: "bandeja-tertulia", nombre: "Bandeja Tertulia", precio: 95, img: `${I}obj-bandeja.webp`, nota: "Madera de olivo aceitada.", colores: ["Natural"] },
];

export type Carta = { id: string; asunto: string; firma: string; img: string; pregunta: string; respuesta: string[] };
export const CARTAS: Carta[] = [
  { id: "como-recibir", asunto: "Hazme caso: sé recibir", firma: "Agobiada en Chamberí", img: `${I}carta-mesa.webp`, pregunta: "Vienen doce a cenar y tengo una mesa para seis. ¿Qué hago?", respuesta: ["Pon dos mesas distintas y no intentes disimularlo: la gracia está en el desnivel.", "Velas bajas para que todo el mundo se vea la cara, y nada de centros que obliguen a asomarse."] },
  { id: "el-sofa-de-mi-suegra", asunto: "El sofá de mi suegra", firma: "Yerno en apuros", img: `${I}carta-sofa.webp`, pregunta: "Nos ha regalado un sofá horrible y viene cada domingo. Ayuda.", respuesta: ["Una funda de lino lo arregla casi todo, y una funda de lino se quita los domingos.", "Lo que no vamos a hacer es comprar otro por no tener esa conversación."] },
  { id: "pintar-el-techo", asunto: "Pinta el techo, cobarde", firma: "Blanco roto y triste", img: `${I}carta-techo.webp`, pregunta: "Llevo diez años con todo en blanco roto. ¿Me atrevo con el color?", respuesta: ["Empieza por arriba. Un techo de color cambia la luz sin que el resto se entere.", "Si no te gusta, es una tarde de brocha. Si te gusta, es otra casa."] },
];

export const SERVICIOS: BriefService[] = [
  { label: "Vivienda", hint: "Interiorismo completo de una casa." },
  { label: "Hotel o restaurante", hint: "Espacios que reciben a gente." },
  { label: "Una sola habitación", hint: "Nos centramos en lo que más te duele." },
  { label: "Selección de objetos", hint: "Buscamos las piezas que faltan." },
];

export const PRENSA = ["Casas Reales", "Revista Sobremesa", "El Interior", "Mesa Puesta", "Domingo"];

export const PAGINAS = [
  { path: "estudio", titulo: "Estudio" },
  { path: "espacios", titulo: "Espacios" },
  ...ESPACIOS.map((e) => ({ path: `espacios/${e.id}`, titulo: e.nombre })),
  { path: "tienda", titulo: "Tienda" },
  ...OBJETOS.map((o) => ({ path: `tienda/${o.id}`, titulo: o.nombre })),
  { path: "pedido", titulo: "Pedido" },
  { path: "querida", titulo: "Querida Melosa" },
  ...CARTAS.map((c) => ({ path: `querida/${c.id}`, titulo: c.asunto })),
  { path: "contacto", titulo: "Contacto" },
];
