import * as THREE from "three";
import { MeshBasicNodeMaterial, type Node, type UniformArrayNode } from "three/webgpu";
import {
  Fn, If, Loop, abs, attribute, cameraPosition, clamp, cross, dot, float, fract, fwidth, instancedBufferAttribute, int, length, max, min, mix, normalView,
  normalWorld, normalize, positionView, positionWorld, pow, reflect, refract, saturate, screenCoordinate, screenUV, select, sign, sqrt, sRGBTransferEOTF,
  sRGBTransferOETF, vec2, vec3, vec4, vertexStage, viewportMipTexture, viewportSharedTexture, cameraProjectionMatrix, cameraViewMatrix,
} from "three/tsl";

/*
 * El material de las cruces de `CrossCluster` (docs/31 §1), traducido a TSL del shader de lusion.co (three r158, su motor
 * propio). Sin luces ni mapa de entorno: cada píxel calcula de forma analítica, contra los tres cilindros de cada una de
 * las otras cruces, cuánto le tapan el cielo (oclusión), si le quitan la luz (sombra suave) y qué color ve reflejado
 * (el de la vecina que corta el rayo reflejado); el sombreado base es un matcap (aquí procedural: difuso en el canal r,
 * brillo ancho en g, el de las cajas de luz en b) y la sombra propia sale de la visibilidad horneada hacia los seis ejes.
 * Todo en el espacio de la referencia: colores tal cual (sRGB), elevado a 2,2 al final y curva fílmica de Hejl.
 * Las de cristal refractan lo ya pintado: la cara trasera, nítido; la delantera, desenfocado según el grosor.
 */

export type DatosRacimo = {
  /** centro (xyz) y radio (w) de cada cruz */
  posRad: UniformArrayNode<"vec4">;
  /** giro de cada cruz (cuaternión) */
  giro: UniformArrayNode<"vec4">;
  /** color sRGB (rgb) de cada cruz */
  color: UniformArrayNode<"vec4">;
  /** rugosidad, transparencia (0 opaca, 1 cristal) y luminancia de cada cruz */
  extra: UniformArrayNode<"vec4">;
  luz: Node<"vec3">;
  /** el fondo que el cristal ve detrás (sRGB): el de la página en la referencia, claro aunque la tarjeta sea oscura */
  fondoCristal: Node<"vec3">;
  n: number;
};

type V3 = Node<"vec3">;
type V4 = Node<"vec4">;
type F = Node<"float">;

const qrot = (v: V3, q: V4) => v.add(cross(q.xyz, cross(q.xyz, v).add(q.w.mul(v))).mul(2));

/** distancia por el rayo (ro, rd) al cilindro de a a b con radio ra; 200 si no lo corta */
const cilindro = Fn(([ro, rd, a, b, ra]: [V3, V3, V3, V3, F]) => {
  const ba = b.sub(a);
  const oc = ro.sub(a);
  const baba = dot(ba, ba);
  const bard = dot(ba, rd);
  const baoc = dot(ba, oc);
  const k2 = baba.sub(bard.mul(bard));
  const k1 = baba.mul(dot(oc, rd)).sub(baoc.mul(bard));
  const k0 = baba.mul(dot(oc, oc)).sub(baoc.mul(baoc)).sub(ra.mul(ra).mul(baba));
  const h = k1.mul(k1).sub(k2.mul(k0));
  const res = float(200).toVar();
  If(h.greaterThanEqual(0), () => {
    const hs = sqrt(h);
    const t = k1.negate().sub(hs).div(k2);
    const y = baoc.add(t.mul(bard));
    If(y.greaterThan(0).and(y.lessThan(baba)), () => {
      res.assign(t);
    }).Else(() => {
      const t2 = select(y.lessThan(0), float(0), baba).sub(baoc).div(bard);
      If(abs(k1.add(k2.mul(t2))).lessThan(hs), () => {
        res.assign(t2);
      });
    });
  });
  return res;
});

/**
 * Oclusión, sombra y distancia al reflejo que una cruz vecina (centro y radio `pr`, giro `q`) proyecta sobre el punto p
 * de normal n, con la luz en l y el rayo reflejado refl: la función getCrossAoShadowIntersect de la referencia.
 */
const vecina = Fn(([p0, n0, l0, refl0, pr, q, cerca]: [V3, V3, V3, V3, V4, V4, F]) => {
  const R = pr.w.mul(2 / 3);
  const r = pr.w.mul(1 / 3);
  const iq = vec4(q.xyz.negate(), q.w);
  const p = qrot(p0.sub(pr.xyz), iq);
  const l = normalize(qrot(l0.sub(pr.xyz), iq));
  const n = qrot(n0, iq);
  const refl = qrot(refl0, iq);
  const pa = vec3(R.negate());
  const ba = vec3(R.mul(2));
  const oa = p.sub(pa);
  const oaX = vec3(oa.x, p.y, p.z);
  const oaY = vec3(p.x, oa.y, p.z);
  const oaZ = vec3(p.x, p.y, oa.z);
  const baba = ba.mul(ba);
  const oaba = oa.mul(ba);
  const h3 = clamp(oaba.div(baba), 0, 1);
  const odX = oaX.sub(vec3(h3.x.mul(ba.x), 0, 0));
  const odY = oaY.sub(vec3(0, h3.y.mul(ba.y), 0));
  const odZ = oaZ.sub(vec3(0, 0, h3.z.mul(ba.z)));
  const dl3 = vec3(length(odX), length(odY), length(odZ));
  const o3a = vec3(1).sub(saturate(vec3(dot(odX.negate(), n), dot(odY.negate(), n), dot(odZ.negate(), n)).mul(r.mul(r)).div(dl3.mul(dl3).mul(dl3))));
  const o3 = sqrt(o3a.mul(o3a).mul(o3a));
  const ao = o3.x.mul(o3.y).mul(o3.z);
  const oad = vec3(dot(oaX, l), dot(oaY, l), dot(oaZ, l));
  const dba = l.mul(ba);
  const thDiv = vec3(1).div(baba.sub(dba.mul(dba)));
  const thX3 = max(oad.negate().mul(baba).add(dba.mul(oaba)).mul(thDiv), vec3(0.0001));
  const thY3 = saturate(oaba.sub(oad.mul(dba)).mul(thDiv));
  const pp = pa.add(ba.mul(thY3));
  const qqX = p.add(l.mul(thX3.x));
  const qqY = p.add(l.mul(thX3.y));
  const qqZ = p.add(l.mul(thX3.z));
  const dd = vec3(length(vec3(pp.x, 0, 0).sub(qqX)), length(vec3(0, pp.y, 0).sub(qqY)), length(vec3(0, 0, pp.z).sub(qqZ))).sub(r);
  const s0 = saturate(dd.div(thX3).add(0.5));
  const s = s0.mul(s0).mul(vec3(3).sub(s0.mul(2)));
  const sombra = s.x.mul(s.y).mul(s.z);
  const corte = float(100).toVar();
  // el rayo reflejado solo se prueba si la vecina puede quedar más cerca que lo ya encontrado y la esfera que la
  // envuelve está en su camino
  const b = dot(p, refl);
  const c = dot(p, p).sub(pr.w.mul(1.1).mul(pr.w.mul(1.1)));
  If(cerca.add(2.05).greaterThan(length(p).sub(pr.w)).and(b.mul(b).sub(c).greaterThanEqual(0)), () => {
    const w = pr.w;
    const rr = r.mul(0.9);
    corte.assign(min(corte, cilindro(p, refl, vec3(w.negate(), 0, 0), vec3(w, 0, 0), rr)));
    corte.assign(min(corte, cilindro(p, refl, vec3(0, w.negate(), 0), vec3(0, w, 0), rr)));
    corte.assign(min(corte, cilindro(p, refl, vec3(0, 0, w.negate()), vec3(0, 0, w), rr)));
  });
  return vec3(ao, sombra, corte);
});

/** matcap procedural (la referencia lee una textura): r difuso, g brillo ancho (rugosas), b cajas de luz (pulidas) */
const matcap = Fn(([uvm]: [Node<"vec2">]) => {
  const q = uvm.mul(2).sub(1);
  const nz = sqrt(saturate(float(1).sub(dot(q, q))));
  const n = vec3(q, nz);
  // difuso envolvente: la luz de arriba y de frente, sin caras negras (las mates de la referencia son claras y suaves)
  const dif = pow(saturate(dot(n, normalize(vec3(-0.3, 0.7, 0.65))).mul(0.75).add(0.25)), float(2.4)).mul(0.9);
  const ancho = pow(saturate(dot(n, normalize(vec3(-0.3, 0.55, 0.78)))), float(10)).mul(0.22);
  // reflejos de estudio: dos tiras finas (arriba a la izquierda y a la derecha) y un punto; en la referencia son líneas
  // y puntos sobre las negras pulidas, no franjas anchas
  const tira = (cx: number, cy: number, w: number, h: number) =>
    saturate(float(1).sub(abs(q.x.sub(cx)).div(w)).mul(4)).mul(saturate(float(1).sub(abs(q.y.sub(cy)).div(h)).mul(4)));
  const fino = max(tira(-0.46, 0.52, 0.025, 0.22), tira(0.6, 0.45, 0.02, 0.1).mul(0.7)).add(pow(saturate(dot(n, normalize(vec3(-0.45, 0.6, 0.66)))), float(400)).mul(0.9));
  return vec3(dif, ancho, fino);
});

/** curva fílmica de Jim Hejl (incluye la gamma): la de la referencia */
const filmica = (c: V3) => {
  const x = max(vec3(0), c.sub(0.004));
  return x.mul(x.mul(6.2).add(0.5)).div(x.mul(x.mul(6.2).add(1.7)).add(0.06));
};

const hue = (h: F) => {
  const rgb = clamp(abs(vec3(h.mul(6)).add(vec3(0, 4, 2)).mod(6).sub(3)).sub(1), 0, 1);
  return rgb.mul(rgb).mul(vec3(3).sub(rgb.mul(2)));
};

export type ModoCruz = "opaca" | "cristal-detras" | "cristal";

/**
 * Material de un InstancedMesh de cruces. `indices` dice qué cruz de los datos es cada instancia (las opacas y las de
 * cristal van en mallas distintas pero se ven entre todas).
 */
export function materialCruz(datos: DatosRacimo, indices: THREE.InstancedBufferAttribute, modo: ModoCruz) {
  const m = new MeshBasicNodeMaterial({ side: modo === "cristal-detras" ? THREE.BackSide : THREE.FrontSide, transparent: modo !== "opaca", depthWrite: modo === "opaca" });
  const yo = int((instancedBufferAttribute(indices) as Node<"float">).add(0.5));
  const aoV = attribute<"float">("ao", "float");
  const grosor = attribute<"float">("thickness", "float");
  // sombra propia: la visibilidad horneada hacia el eje de donde viene la luz (en el espacio de la pieza)
  const sombraPropia = vertexStage(
    Fn(() => {
      const pr = datos.posRad.element(yo);
      const q = datos.giro.element(yo);
      const Lw = datos.luz.sub(positionWorld).div(pr.w);
      const L = normalize(qrot(Lw, vec4(q.xyz.negate(), q.w)));
      const dao = mix(attribute<"vec3">("daoN", "vec3"), attribute<"vec3">("daoP", "vec3"), sign(L).mul(0.5).add(0.5));
      const a = abs(L);
      const s = dot(a, dao).div(a.x.add(a.y).add(a.z));
      return min(pow(s.mul(3), float(0.3)).mul(1.45), 1);
    })(),
  );

  m.colorNode = Fn(() => {
    const extraYo = datos.extra.element(yo);
    const albedoYo = datos.color.element(yo).xyz;
    // ruido por píxel (la referencia usa ruido azul) para abrir el reflejo de las rugosas
    const ruido = fract(float(52.9829189).mul(fract(dot(screenCoordinate.xy, vec2(0.06711056, 0.00583715)))));
    const ruido3 = vec3(ruido, fract(ruido.mul(7.13)), fract(ruido.mul(3.71)));
    const N = normalize(normalWorld);
    const V = normalize(cameraPosition.sub(positionWorld));
    const nv = normalize(normalView);
    const rug = min(0.9, extraYo.x.add(dot(vec3(1), fwidth(nv))));
    const reflejo = normalize(reflect(V.negate(), N).add(ruido3.sub(0.5).mul(select(rug.greaterThan(0.5), float(0.5), float(0.01)))));
    const haciaLuz = datos.luz.sub(positionWorld);

    const gi = vec3(1).toVar();
    const refl = vec4(0, 0, 0, 100).toVar();
    const ao = float(1).toVar();
    const sombra = float(1).toVar();
    Loop(datos.n, ({ i }) => {
      If(i.notEqual(yo), () => {
        const r = vecina(positionWorld, N, haciaLuz, reflejo, datos.posRad.element(i), datos.giro.element(i), refl.w);
        const ex = datos.extra.element(i);
        const col = datos.color.element(i).xyz;
        const a = saturate(r.x.add(ex.y.mul(0.5)));
        ao.mulAssign(a);
        sombra.mulAssign(r.y);
        gi.addAssign(float(1).sub(ex.z.mul(0.9)).mul(col).mul(3).mul(min(1, float(1).sub(a.mul(a)).div(0.7))));
        If(r.z.lessThan(refl.w).and(r.z.greaterThan(0.0001)), () => {
          refl.assign(vec4(col.mul(float(1).sub(ex.y.mul(0.5))), r.z));
        });
      });
    });
    const reflCol = refl.xyz.div(float(0.2).add(rug.mul(0.8)).mul(refl.w).mul(10).add(4)).mul(ao).mul(aoV);
    const giN = gi.div(datos.n);

    // matcap con la normal de vista, como la referencia
    const vista = normalize(positionView.negate());
    const ex = normalize(vec3(vista.z, 0, vista.x.negate()));
    const ey = cross(vista, ex);
    const mc = matcap(vec2(dot(ex, nv), dot(ey, nv)).mul(0.5).add(0.5));
    const difuso = mc.x.mul(0.75).add(0.25);
    const brillo = select(rug.greaterThan(0.5), mc.y, mc.z);
    const reflFinal = reflCol.mul(float(0.75).add(sombra.mul(0.25).mul(sombraPropia)));
    const sombraS = sombra.mul(0.4).add(0.6);

    let color: V3;
    if (modo === "opaca") {
      color = albedoYo.mul(difuso).add(brillo).add(reflFinal).mul(ao).add(giN).mul(sombraPropia).mul(sombraS);
    } else {
      // proyección a la pantalla de un punto del mundo, como desplazamiento sobre screenUV (y hacia abajo)
      const aPantalla = (p: V3) => {
        const c = cameraProjectionMatrix.mul(cameraViewMatrix).mul(vec4(p, 1));
        return c.xy.div(c.w).mul(vec2(0.5, -0.5));
      };
      const ior = 2.4;
      // la referencia refracta una imagen de las cruces sobre el fondo claro de la página: donde detrás solo hay fondo
      // oscuro (luminancia baja) se ve el claro
      const claro = (c: V3) => mix(datos.fondoCristal.mul(0.6), c, saturate(dot(c, vec3(0.299, 0.587, 0.114)).sub(0.03).mul(6)));
      let albedo: V3;
      if (modo === "cristal") {
        const dir = refract(V.negate(), N, float(1 / ior));
        const uvR = screenUV.add(aPantalla(positionWorld.add(dir.mul(0.3))).sub(aPantalla(positionWorld)));
        const mip = viewportMipTexture(uvR) as unknown as { level(l: F): V4 };
        const borroso = claro((sRGBTransferOETF(mip.level(float(3.5).add(grosor))) as V4).xyz);
        const a0 = borroso.mul(albedoYo.mul(0.4).add(0.75));
        albedo = a0.mul(0.8).add(float(0.125).add(sombraPropia.mul(0.2).mul(aoV)).mul(albedoYo)).mul(albedoYo);
      } else {
        const dir = refract(V.negate(), N.negate(), float(ior));
        const uvR = screenUV.add(aPantalla(positionWorld.add(dir.mul(ao).mul(0.5))).sub(aPantalla(positionWorld)));
        const nitido = claro((sRGBTransferOETF(viewportSharedTexture(uvR) as unknown as V4) as V4).xyz);
        albedo = nitido.mul(0.5).add(float(0.05).add(sombraPropia.mul(0.2).mul(aoV)).mul(albedoYo)).mul(albedoYo);
      }
      const fresnel = float(1).sub(clamp(abs(dot(N, V)), 0.001, 1)).mul(float(1).sub(grosor));
      let c = albedo.add(difuso.mul(0.15)).add(fresnel.mul(albedo).mul(0.5));
      if (modo === "cristal") {
        const luma = dot(albedo, vec3(0.299, 0.587, 0.114));
        c = c.add(reflFinal).add(hue(nv.z.mul(aoV).mul(1.5)).mul(pow(float(1).sub(grosor.mul(0.75)), float(2))).mul(max(vec3(0), vec3(1).sub(difuso))).mul(0.2).mul(luma));
      }
      color = c.mul(sombraPropia.mul(0.35).add(0.65)).mul(ao.mul(sombraS).mul(0.75).add(0.25));
    }
    // el espacio de la referencia: elevar a 2,2 y curva fílmica (que ya da la imagen para la pantalla); el renderer
    // codifica a sRGB al final, así que se devuelve en lineal
    return (sRGBTransferEOTF(vec4(filmica(pow(max(color, vec3(0)), vec3(2.2))), 1)) as V4).xyz;
  })();
  return m;
}
