"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, type RefObject } from "react";
import * as THREE from "three";
import { MeshBasicNodeMaterial, type Scene } from "three/webgpu";
import { float, sin, step, time, vec3 } from "three/tsl";
import { cieloAlba, type CieloOpciones } from "./sky";
import { geometriaAla, geometriaMotor, materialAla } from "./wing";
import { geometriaChapa, geometriaCristal, geometriaPanel, materialCristal, materialPanel } from "./cabin";
import { useRigVentanilla } from "./rig";

export type PortholeContentProps = {
  cielo?: CieloOpciones;
  /** color de la librea (la punta del ala y el winglet), un color CSS */
  librea?: string;
  /** elemento que recibe el puntero (por defecto, la ventana) */
  objetivo?: RefObject<HTMLElement | null>;
  /** false = cámara quieta (movimiento reducido) */
  interactivo?: boolean;
  onCambio?: (fuera: boolean) => void;
};

/**
 * La escena de la ventanilla sin lienzo (para montarla en el banco o en `PortholeScene`): cielo y suelo como fondo, ala
 * con su motor y su luz de navegación, cabina con la ventanilla y la cámara que se asoma y sale al arrastrar.
 * Requiere un WebGPURenderer (WebGPU o su reserva WebGL2): todo son materiales de nodos.
 */
export default function PortholeContent({ cielo: opciones, librea = "#c0161b", objetivo, interactivo = true, onCambio }: PortholeContentProps) {
  const scene = useThree((s) => s.scene) as unknown as Scene;
  const cielo = useMemo(() => cieloAlba(opciones), [opciones]);
  useLayoutEffect(() => {
    scene.backgroundNode = cielo.nodo;
    return () => {
      scene.backgroundNode = null;
      cielo.rampa.dispose();
    };
  }, [scene, cielo]);
  useRigVentanilla({ objetivo, activo: interactivo, onCambio });

  const piezas = useMemo(() => {
    const mAla = materialAla(cielo.reflejo, new THREE.Color(librea));
    // la luz que entra por la ventanilla: el cielo hacia fuera (−z, un poco hacia el resplandor)
    const luzVentana = cielo.reflejo(vec3(-0.25, 0.04, -1));
    const resplandor = cielo.reflejo(vec3(0, 0.0, -1));
    // luz de navegación del ala izquierda: roja fija, con el destello blanco del estroboscopio cada 1,2 s
    const mLuz = new MeshBasicNodeMaterial();
    const destello = step(0.94, sin(time.mul((Math.PI * 2) / 1.2)).mul(0.5).add(0.5));
    mLuz.colorNode = vec3(6, 0.25, 0.15).add(vec3(30).mul(destello)).mul(float(1));
    return {
      ala: new THREE.Mesh(geometriaAla(), mAla),
      motor: new THREE.Mesh(geometriaMotor(), mAla),
      luz: new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), mLuz),
      panel: new THREE.Mesh(geometriaPanel(), materialPanel(luzVentana)),
      chapa: new THREE.Mesh(geometriaChapa(), materialPanel(luzVentana, new THREE.Color("#01030a"))),
      cristal: new THREE.Mesh(geometriaCristal(), materialCristal(resplandor)),
    };
  }, [cielo, librea]);
  useLayoutEffect(() => {
    piezas.luz.position.set(-7.93, -0.36, -17.49);
    piezas.cristal.renderOrder = 2;
    return () => Object.values(piezas).forEach((m) => (m.geometry.dispose(), (m.material as THREE.Material).dispose()));
  }, [piezas]);

  return (
    <group>
      {Object.entries(piezas).map(([k, m]) => (
        <primitive key={k} object={m} />
      ))}
    </group>
  );
}
