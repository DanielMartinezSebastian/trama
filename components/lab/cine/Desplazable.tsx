"use client";

import { useEffect } from "react";

/** el sitio fija html y body (overflow: hidden); las páginas largas del laboratorio se desplazan como las landings */
export default function Desplazable() {
  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    return () => document.documentElement.classList.remove("scrollable");
  }, []);
  return null;
}
