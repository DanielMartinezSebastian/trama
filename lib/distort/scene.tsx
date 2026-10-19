"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, type Texture } from "three";

export type DistortPointer = { x: number; y: number; target: number };

export type DistortSceneProps = {
  src: string;
  effect: "ripple" | "liquid" | "rgb" | "lens";
  strength: number;
  radius: number;
  pointer: MutableRefObject<DistortPointer>;
  /** el lienzo ya pintó el primer fotograma con la textura */
  onReady: () => void;
  /** el efecto se apagó del todo (tras salir el puntero): se puede desmontar el lienzo */
  onIdle: () => void;
};

const EFFECT: Record<DistortSceneProps["effect"], number> = { ripple: 0, liquid: 1, rgb: 2, lens: 3 };

// Un cuadrilátero a pantalla completa (sin cámara): el vértice ya viene en coordenadas de recorte
const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uMouse;      // 0–1, origen abajo-izquierda
uniform float uHover;     // 0–1 suavizado
uniform float uTime;
uniform float uStrength;
uniform float uRadius;
uniform float uAspect;    // ancho / alto del lienzo
uniform float uImgAspect; // ancho / alto de la imagen
uniform int uEffect;

// «cover»: la imagen llena el lienzo recortando lo que sobra
vec2 cover(vec2 uv) {
  vec2 s = vec2(1.0);
  if (uAspect > uImgAspect) s.y = uImgAspect / uAspect; else s.x = uAspect / uImgAspect;
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 d = uv - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  float fall = smoothstep(uRadius, 0.0, dist) * uHover;
  vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
  vec2 off = vec2(0.0);
  vec3 col;

  if (uEffect == 0) { // ondas que salen del puntero
    off = dir * sin(dist * 38.0 - uTime * 5.0) * 0.02 * uStrength * fall;
    col = texture2D(uTex, cover(uv + off)).rgb;
  } else if (uEffect == 1) { // líquido: desplazamiento suave y orgánico
    off = vec2(sin(uv.y * 9.0 + uTime * 1.6), cos(uv.x * 9.0 + uTime * 1.3)) * 0.035 * uStrength * fall;
    col = texture2D(uTex, cover(uv + off)).rgb;
  } else if (uEffect == 2) { // separación de canales RGB
    vec2 o = dir * 0.025 * uStrength * fall;
    col = vec3(texture2D(uTex, cover(uv + o)).r, texture2D(uTex, cover(uv)).g, texture2D(uTex, cover(uv - o)).b);
  } else { // lupa
    float k = 1.0 - 0.45 * uStrength * fall;
    col = texture2D(uTex, cover(uMouse + (uv - uMouse) * k)).rgb;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

function Quad({ src, effect, strength, radius, pointer, onReady, onIdle }: DistortSceneProps) {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const tex = useRef<Texture | null>(null);
  const ready = useRef(false);
  const hover = useRef(0);
  const mouse = useRef(new Vector2(0.5, 0.5));

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uTex: { value: null },
          uMouse: { value: new Vector2(0.5, 0.5) },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uStrength: { value: strength },
          uRadius: { value: radius },
          uAspect: { value: 1 },
          uImgAspect: { value: 1 },
          uEffect: { value: EFFECT[effect] },
        },
        depthTest: false,
        depthWrite: false,
      }),
    // los uniforms que cambian se actualizan en useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    let dead = false;
    new TextureLoader().setCrossOrigin("anonymous").load(src, (t) => {
      if (dead) return t.dispose();
      t.colorSpace = SRGBColorSpace;
      tex.current = t;
      mat.uniforms.uTex.value = t;
      const img = t.image as { width: number; height: number };
      mat.uniforms.uImgAspect.value = img.width / img.height;
      invalidate();
    });
    return () => {
      dead = true;
      tex.current?.dispose();
      mat.dispose();
    };
  }, [src, mat, invalidate]);

  useFrame((state, dt) => {
    const u = mat.uniforms;
    const p = pointer.current;
    hover.current += (p.target - hover.current) * Math.min(1, dt * 7);
    mouse.current.x += (p.x - mouse.current.x) * Math.min(1, dt * 12);
    mouse.current.y += (p.y - mouse.current.y) * Math.min(1, dt * 12);
    u.uHover.value = hover.current;
    u.uMouse.value.copy(mouse.current);
    u.uTime.value = state.clock.elapsedTime;
    u.uStrength.value = strength;
    u.uRadius.value = radius;
    u.uEffect.value = EFFECT[effect];
    u.uAspect.value = size.width / Math.max(1, size.height);
    if (tex.current && !ready.current) {
      ready.current = true;
      onReady();
    }
    if (ready.current && p.target === 0 && hover.current < 0.01) onIdle();
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

export default function DistortScene(props: DistortSceneProps) {
  return (
    <Canvas flat dpr={[1, 2]} gl={{ alpha: false, antialias: false }} frameloop="always" style={{ pointerEvents: "none" }}>
      <Quad {...props} />
    </Canvas>
  );
}
