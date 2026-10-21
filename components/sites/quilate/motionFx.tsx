"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Color, FogExp2, HalfFloatType, LinearFilter, MeshBasicMaterial, RGBAFormat, ShaderMaterial, UnsignedByteType, Vector2, Vector3, WebGLRenderTarget, type Camera, type Material, type Mesh, type Object3D, type Scene, type WebGLRenderer } from "three";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass.js";

/*
 * Desenfoque de movimiento y «tilt-shift» para las transiciones del recorrido de Quilate (docs/19 §7). Una sola pasada a
 * pantalla completa, después del render y antes del paso de color:
 *   - desenfoque direccional en el sentido en que se mueve el anillo en pantalla (su velocidad proyectada), 12 muestras;
 *   - tilt-shift: una franja nítida a la altura del anillo y el resto cada vez más borroso hacia arriba y hacia abajo, como
 *     una lente basculada (efecto maqueta / macro de joyería).
 * Las dos cosas solo se encienden mientras hay transición (cuánto cambia la pose por segundo) y se apagan suaves en reposo:
 * la imagen quieta queda nítida. Sin efecto en pantallas táctiles (coste de GPU) ni con movimiento reducido (allí no hay 3D).
 * Además, el velo de los cambios de material (`veil`, lo da la escena): desenfoque en toda la imagen y brillo en las luces
 * altas, para que el cambio (boceto → cera → metal, oro amarillo → rosa…) ocurra tapado y no a la vista.
 */

const MotionShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVel: { value: new Vector2() },
    uFocus: { value: 0.5 },
    uTilt: { value: 0 },
    uAspect: { value: 1 },
    uVeil: { value: 0 },
    uVignette: { value: 0.38 },
  },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uVel;
    uniform float uFocus;
    uniform float uTilt;
    uniform float uAspect;
    uniform float uVeil;
    uniform float uVignette;
    varying vec2 vUv;
    void main() {
      // tilt-shift: radio de desenfoque según la distancia vertical a la franja nítida (con una zona muerta alrededor)
      float d = max(0.0, abs(vUv.y - uFocus) - 0.12);
      // el velo de los cambios de material: desenfoque en toda la imagen, además del de la lente
      float r = uTilt * d * 0.02 + uVeil * 0.009;
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
      vec4 col = sum / wsum;
      // y un brillo que sube las luces altas (la piedra y los reflejos del metal), no las sombras
      col.rgb += uVeil * 0.9 * col.rgb * col.rgb;
      vec2 vignetteUv = (vUv - 0.5) * 2.0;
      vignetteUv.x *= uAspect;
      float vignette = smoothstep(0.38, 1.45, dot(vignetteUv, vignetteUv));
      col.rgb *= 1.0 - vignette * uVignette;
      gl_FragColor = col;
    }`,
};

const CopyShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: "uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tDiffuse, vUv); }",
};

const GemCompositeShader = {
  uniforms: {
    tProcessed: { value: null },
    tSharp: { value: null },
    tObjectMask: { value: null },
    uRingSharpness: { value: 1.2 },
  },
  vertexShader: CopyShader.vertexShader,
  fragmentShader: /* glsl */ `
    uniform sampler2D tProcessed;
    uniform sampler2D tSharp;
    uniform sampler2D tObjectMask;
    uniform float uRingSharpness;
    varying vec2 vUv;
    void main() {
      vec4 processed = texture2D(tProcessed, vUv);
      vec4 sharp = texture2D(tSharp, vUv);
      vec2 masks = texture2D(tObjectMask, vUv).rg;
      vec3 ring = mix(processed.rgb, sharp.rgb, masks.g * uRingSharpness);
      gl_FragColor = vec4(mix(ring, sharp.rgb, masks.r), processed.a);
    }`,
};

class GemMaskPass extends Pass {
  readonly sharpTarget = new WebGLRenderTarget(1, 1, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
    type: HalfFloatType,
    depthBuffer: false,
  });
  readonly maskTarget = new WebGLRenderTarget(1, 1, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
    type: UnsignedByteType,
    depthBuffer: true,
  });
  private readonly copyMaterial = new ShaderMaterial(CopyShader);
  private readonly copyQuad = new FullScreenQuad(this.copyMaterial);
  private readonly gemMaterial = new MeshBasicMaterial({ color: 0xff0000, toneMapped: false });
  private readonly ringMaterial = new MeshBasicMaterial({ color: 0x00ff00, toneMapped: false });
  private readonly occluderMaterial = new MeshBasicMaterial({ color: 0x000000, colorWrite: false, depthWrite: true, toneMapped: false });

  constructor(private readonly scene: Scene, private readonly camera: Camera) {
    super();
    this.needsSwap = false;
  }

  render(renderer: WebGLRenderer, _writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    const previousTarget = renderer.getRenderTarget();
    const previousColor = renderer.getClearColor(new Color());
    const previousAlpha = renderer.getClearAlpha();
    const previousAutoClear = renderer.autoClear;
    const previousOverride = this.scene.overrideMaterial;
    const originalMaterials: { mesh: Mesh; material: Material | Material[] }[] = [];

    try {
      this.copyMaterial.uniforms.tDiffuse.value = readBuffer.texture;
      renderer.setRenderTarget(this.sharpTarget);
      this.copyQuad.render(renderer);

      this.scene.overrideMaterial = null;
      this.scene.traverse((object) => {
        const mesh = object as Mesh;
        if (!mesh.isMesh) return;
        const material = mesh.material;
        originalMaterials.push({ mesh, material });
        const materials = Array.isArray(material) ? material : [material];
        const isGem = materials.some((item) => item.userData.postFxGem === true);
        const isRing = materials.some((item) => item.userData.postFxRing === true);
        mesh.material = isGem ? this.gemMaterial : isRing ? this.ringMaterial : this.occluderMaterial;
      });

      renderer.autoClear = false;
      renderer.setRenderTarget(this.maskTarget);
      renderer.setClearColor(0x000000, 0);
      renderer.clear(true, true, true);
      renderer.render(this.scene, this.camera);
    } finally {
      for (const item of originalMaterials) item.mesh.material = item.material;
      this.scene.overrideMaterial = previousOverride;
      renderer.setRenderTarget(previousTarget);
      renderer.setClearColor(previousColor, previousAlpha);
      renderer.autoClear = previousAutoClear;
    }
  }

  setSize(width: number, height: number) {
    this.sharpTarget.setSize(width, height);
    this.maskTarget.setSize(width, height);
  }

  dispose() {
    this.sharpTarget.dispose();
    this.maskTarget.dispose();
    this.copyMaterial.dispose();
    this.copyQuad.dispose();
    this.gemMaterial.dispose();
    this.ringMaterial.dispose();
    this.occluderMaterial.dispose();
  }
}

class GemCompositePass extends Pass {
  private readonly material = new ShaderMaterial(GemCompositeShader);
  private readonly quad = new FullScreenQuad(this.material);

  constructor(private readonly mask: GemMaskPass) {
    super();
  }

  setRingSharpness(value: number) {
    this.material.uniforms.uRingSharpness.value = value;
  }

  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    this.material.uniforms.tProcessed.value = readBuffer.texture;
    this.material.uniforms.tSharp.value = this.mask.sharpTarget.texture;
    this.material.uniforms.tObjectMask.value = this.mask.maskTarget.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    if (this.clear) renderer.clear();
    this.quad.render(renderer);
  }

  dispose() {
    this.material.dispose();
    this.quad.dispose();
  }
}

export type MotionFxProps = {
  /** el objeto que se sigue (el grupo del anillo): su movimiento en pantalla da la dirección del desenfoque */
  target: MutableRefObject<Object3D | null>;
  /** cuánta transición hay ahora (0 = quieto); lo calcula la escena con la velocidad de la pose */
  amount: MutableRefObject<number>;
  /** velo de los cambios de material (0–1): desenfoque en toda la imagen y brillo en las luces altas */
  veil?: MutableRefObject<number>;
};

export default function MotionFx({ target, amount, veil }: MotionFxProps) {
  const { gl, scene, camera, size } = useThree();
  const { composer, pass, bokeh, ringComposite } = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const gemMask = new GemMaskPass(scene, camera);
    c.addPass(gemMask);

    // Si usamos esta constante en lugar de 0.0001 y 0.0095, se genera un efecto fractal muy chulo que ilumina todo
    // const depthOfField = new BokehPass(scene, camera, { focus: 0, aperture: 0.1, maxblur: 0.95 });

    const depthOfField = new BokehPass(scene, camera, { focus: 0, aperture: 0.0001, maxblur: 0.0095 });
    const bokehMaterial = depthOfField as typeof depthOfField & { materialBokeh: { fragmentShader: string; needsUpdate: boolean } };
    bokehMaterial.materialBokeh.fragmentShader = bokehMaterial.materialBokeh.fragmentShader.replace("gl_FragColor.a = 1.0;", "gl_FragColor.a = texture2D( tColor, vUv ).a;");
    bokehMaterial.materialBokeh.needsUpdate = true;
    c.addPass(depthOfField);
    const p = new ShaderPass(MotionShader);
    c.addPass(p);
    const ringComposite = new GemCompositePass(gemMask);
    c.addPass(ringComposite);
    c.addPass(new OutputPass());
    return { composer: c, pass: p, bokeh: depthOfField, ringComposite };
  }, [gl, scene, camera]);
  useEffect(() => {
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());
  }, [composer, size, gl]);
  useEffect(() => () => composer.dispose(), [composer]);
  useEffect(() => {
    const previousFog = scene.fog;
    let fogColor = "#100f0d";
    try {
      fogColor = getComputedStyle(gl.domElement).getPropertyValue("--bg").trim() || fogColor;
    } catch {}
    const homeFog = new FogExp2(new Color(fogColor), 0.06);
    scene.fog = homeFog;
    return () => {
      if (scene.fog === homeFog) scene.fog = previousFog;
    };
  }, [gl, scene]);

  const prev = useRef<Vector3 | null>(null);
  const vel = useRef(new Vector2());
  const tilt = useRef(10);
  const ringSharpness = useRef(1.2);
  const p = new Vector3();
  const world = new Vector3();

  useFrame((_, dt) => {
    const u = pass.uniforms;
    const o = target.current;
    if (o) {
      o.getWorldPosition(world);
      (bokeh.uniforms as { focus: { value: number } }).focus.value = world.distanceTo(camera.position);
      p.copy(world).project(camera);
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
    u.uVeil.value = veil?.current ?? 0;
    u.uAspect.value = size.width / Math.max(1, size.height);
    const transition = Math.min(1, Math.max(0, amount.current / 1.2));
    const easedTransition = transition * transition * (3 - 2 * transition);
    const targetSharpness = 1.2 * (1 - easedTransition);
    ringSharpness.current += (targetSharpness - ringSharpness.current) * Math.min(1, dt * 6);
    ringComposite.setRingSharpness(ringSharpness.current);
    composer.render(dt);
  }, 1);
  return null;
}
