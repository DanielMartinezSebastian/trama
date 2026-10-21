"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Vector2, Vector3, type Object3D } from "three";

/*
 * Desenfoque de movimiento y «tilt-shift» para las transiciones del recorrido de Quilate (docs/19 §7). Una sola pasada a
 * pantalla completa, después del render y antes del paso de color:
 *   - desenfoque direccional en el sentido en que se mueve el anillo en pantalla (su velocidad proyectada), 12 muestras;
 *   - tilt-shift: una franja nítida a la altura del anillo y el resto cada vez más borroso hacia arriba y hacia abajo, como
 *     una lente basculada (efecto maqueta / macro de joyería).
 * Las dos cosas solo se encienden mientras hay transición (cuánto cambia la pose por segundo) y se apagan suaves en reposo:
 * la imagen quieta queda nítida. Sin efecto en pantallas táctiles (coste de GPU) ni con movimiento reducido (allí no hay 3D).
 */

const MotionShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVel: { value: new Vector2() },
    uFocus: { value: 0.5 },
    uTilt: { value: 0 },
    uAspect: { value: 1 },
  },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uVel;
    uniform float uFocus;
    uniform float uTilt;
    uniform float uAspect;
    varying vec2 vUv;
    void main() {
      // tilt-shift: radio de desenfoque según la distancia vertical a la franja nítida (con una zona muerta alrededor)
      float d = max(0.0, abs(vUv.y - uFocus) - 0.12);
      float r = uTilt * d * 0.02;
      // movimiento: un trazo a lo largo de la velocidad, centrado en el píxel
      vec2 mv = uVel;
      vec4 sum = vec4(0.0);
      float wsum = 0.0;
      for (int i = 0; i < 12; i++) {
        float t = float(i) / 11.0 - 0.5;
        // muestras en espiral pequeña para el tilt-shift y en línea para el movimiento
        float a = float(i) * 2.399;
        vec2 o = mv * t + vec2(cos(a), sin(a) * uAspect) * r * (0.35 + float(i) / 11.0);
        float w = 1.0 - abs(t) * 0.6;
        sum += texture2D(tDiffuse, vUv + o) * w;
        wsum += w;
      }
      gl_FragColor = sum / wsum;
    }`,
};

export type MotionFxProps = {
  /** el objeto que se sigue (el grupo del anillo): su movimiento en pantalla da la dirección del desenfoque */
  target: MutableRefObject<Object3D | null>;
  /** cuánta transición hay ahora (0 = quieto); lo calcula la escena con la velocidad de la pose */
  amount: MutableRefObject<number>;
};

export default function MotionFx({ target, amount }: MotionFxProps) {
  const { gl, scene, camera, size } = useThree();
  const { composer, pass } = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const p = new ShaderPass(MotionShader);
    c.addPass(p);
    c.addPass(new OutputPass());
    return { composer: c, pass: p };
  }, [gl, scene, camera]);
  useEffect(() => {
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());
  }, [composer, size, gl]);
  useEffect(() => () => composer.dispose(), [composer]);

  const prev = useRef<Vector3 | null>(null);
  const vel = useRef(new Vector2());
  const tilt = useRef(0);
  const p = new Vector3();

  useFrame((_, dt) => {
    const u = pass.uniforms;
    const o = target.current;
    if (o) {
      o.getWorldPosition(p).project(camera);
      const now = p.clone();
      const a = Math.min(1, amount.current);
      if (prev.current && dt > 0) {
        // velocidad en UV por segundo → longitud del trazo (lo que se movería en ~1/30 s), acotada
        const v = new Vector2((now.x - prev.current.x) * 0.5, (now.y - prev.current.y) * 0.5).divideScalar(Math.max(dt, 1 / 120)).multiplyScalar(1 / 30);
        if (v.length() > 0.035) v.setLength(0.035);
        vel.current.lerp(v.multiplyScalar(0.4 + 0.6 * a), Math.min(1, dt * 10));
      }
      prev.current = now;
      u.uFocus.value = now.y * 0.5 + 0.5;
      tilt.current += (a - tilt.current) * Math.min(1, dt * 4);
    }
    u.uVel.value.copy(vel.current);
    u.uTilt.value = tilt.current;
    u.uAspect.value = size.width / Math.max(1, size.height);
    composer.render(dt);
  }, 1);
  return null;
}
