"""IFC → maqueta (GLB por capas + plano SVG) para `ExplorableCanvas model`.

Uso (con IfcOpenShell: `pip install ifcopenshell`):

    python -I scripts/maqueta/ifc_to_glb.py <carpeta con los IFC> public/models/clinica 1o9xg7659EAwIy114fX_ow

Pensado para el modelo de muestra «Medical-Dental Clinic» de buildingSMART (CC BY 4.0), un edificio real de dos plantas
con modelos de arquitectura, estructura y climatización por separado:
https://github.com/buildingsmart-community/Community-Sample-Test-Files/tree/main/IFC%202.3.0.1%20(IFC%202x3)/Medical-Dental%20Clinic

Qué hace con cada elemento (y por qué):
- Muros, forjados, cubiertas y escaleras: su geometría real (con los huecos de puertas y ventanas).
- Pilares, vigas, conductos y ventanas: la caja orientada que los envuelve, como el listón de balsa o la tira de
  metacrilato de una maqueta. Un perfil en I o una junta de conducto en geometría real pesan cientos de miles de
  triángulos y a esta escala no se distinguen.
- Fuera: cimentación (bajo el tablero), mobiliario, puertas (quedan los huecos), barandillas, falsos techos, terminales
  y accesorios pequeños.

Capas del despiece (`extras.layer`): 0 base · 1 estructura · 2 instalaciones · 3 muros · 4 cubierta. Material
(`extras.mat`): paper · wood · acrylic · accent. Los nodos se agrupan por capa, material y una rejilla de 12 m para que la
intro de la maqueta crezca desde el centro.

Ejes: el GLB está en metros, con el origen en el centro de la planta a cota 0 y la planta girada para que el lado largo
quede en horizontal (x = norte del IFC, z = este). Saca además `plan.svg` (la planta baja: muros y huecos de puerta) e
imprime su tamaño y el centro de la planta en coordenadas del IFC (para colocar puntos en el mundo).

Tercer argumento opcional: GlobalId de los elementos que van con el acento del tema (separados por comas).
"""
import json
import multiprocessing
import os
import sys

import numpy as np
import ifcopenshell
import ifcopenshell.geom
import ifcopenshell.util.shape as us

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glb import BOX_FACES, box_corners, weld, write_glb  # noqa: E402

SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
LIFT = 0.16  # la solera (cara superior a 0, 15 cm de canto) se apoya en el tablero
CHUNK = 12.0
ACCENT_GUIDS = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else set()


def settings(world):
    s = ifcopenshell.geom.settings()
    s.set("use-world-coords", world)
    return s


def iterate(model, types, world):
    items = [e for t in types for e in model.by_type(t)]
    if not items:
        return
    it = ifcopenshell.geom.iterator(settings(world), model, multiprocessing.cpu_count(), include=items)
    if it.initialize():
        while True:
            yield it.get()
            if not it.next():
                break


def obb(sh):
    v = np.array(sh.geometry.verts).reshape(-1, 3)
    if not len(v):
        return None
    M = np.array(us.get_shape_matrix(sh))
    lo, hi = v.min(0), v.max(0)
    R = M[:3, :3]
    return {"c": R @ ((lo + hi) / 2) + M[:3, 3], "R": R, "h": (hi - lo) / 2}


# grupos (capa, material, celda) → listas de (verts, faces) en coordenadas del IFC
groups: dict = {}
plan = {"walls": [], "doors": []}


def add(layer, mat, verts, faces):
    verts = np.asarray(verts, dtype=np.float64)
    c = verts.mean(0)
    key = (layer, mat, int(np.floor(c[0] / CHUNK)), int(np.floor(c[1] / CHUNK)))
    groups.setdefault(key, []).append((verts, np.asarray(faces)))


def add_mesh(layer, mat, sh):
    v = np.array(sh.geometry.verts).reshape(-1, 3)
    f = np.array(sh.geometry.faces).reshape(-1, 3)
    if len(v) and v[:, 2].max() > -0.05:
        add(layer, mat, v, f)


def add_box(layer, mat, b, minsize=0.0):
    if b is None or sorted(2 * b["h"])[1] < minsize:
        return
    if b["c"][2] + np.abs(b["R"] @ b["h"]).max() < -0.05:
        return
    faces = BOX_FACES if np.linalg.det(b["R"]) > 0 else BOX_FACES[:, ::-1]
    add(layer, mat, box_corners(b["c"], b["R"], np.maximum(b["h"], 0.01)), faces)


arch = ifcopenshell.open(os.path.join(SRC, "Clinic_Architectural.ifc"))
struct = ifcopenshell.open(os.path.join(SRC, "Clinic_Structural.ifc"))
hvac = ifcopenshell.open(os.path.join(SRC, "Clinic_HVAC.ifc"))

# --- estructura ---
for sh in iterate(struct, ["IfcSlab"], True):
    e = struct.by_id(sh.id)
    name = e.Name or ""
    v = np.array(sh.geometry.verts).reshape(-1, 3)
    if "Roof" in name:
        add_mesh(4, "paper", sh)
    elif v[:, 2].max() < 0.5:
        add_mesh(0, "paper", sh)  # solera
    else:
        add_mesh(1, "paper", sh)  # forjado de planta 1
for sh in iterate(struct, ["IfcRoof"], True):
    add_mesh(4, "paper", sh)
for sh in iterate(struct, ["IfcRampFlight", "IfcStairFlight"], True):
    add_mesh(0, "paper", sh)
for sh in iterate(struct, ["IfcColumn", "IfcBeam"], False):
    b = obb(sh)
    # las vigas y viguetas de cubierta van con la cubierta: al quitarla se ven las salas de la planta 1
    add_box(4 if b is not None and b["c"][2] > 8 else 1, "wood", b)
for sh in iterate(arch, ["IfcStairFlight"], True):
    add_mesh(1, "paper", sh)
for e in arch.by_type("IfcSlab"):
    if "Stair" in (e.Name or ""):
        try:
            add_mesh(1, "paper", ifcopenshell.geom.create_shape(settings(True), e))
        except Exception:
            pass

# --- muros, ventanas y muros cortina ---
for sh in iterate(arch, ["IfcWallStandardCase", "IfcWall"], True):
    e = arch.by_id(sh.id)
    if "Foundation" in (e.Name or ""):
        continue
    add_mesh(3, "paper", sh)
for sh in iterate(arch, ["IfcWallStandardCase", "IfcWall"], False):
    e = arch.by_id(sh.id)
    b = obb(sh)
    if b is None or "Foundation" in (e.Name or ""):
        continue
    cs = box_corners(b["c"], b["R"], b["h"])
    if cs[:, 2].min() < 1.0 and cs[:, 2].max() > 1.0:
        plan["walls"].append(cs[:, :2])
for sh in iterate(arch, ["IfcDoor"], False):
    b = obb(sh)
    if b is not None and box_corners(b["c"], b["R"], b["h"])[:, 2].min() < 1.0:
        plan["doors"].append(box_corners(b["c"], b["R"], b["h"])[:, :2])
for sh in iterate(arch, ["IfcWindow"], False):
    add_box(3, "acrylic", obb(sh))
for cw in arch.by_type("IfcCurtainWall"):
    if "Chain Link" in (cw.Name or ""):
        continue
    parts = [r.RelatedObjects for r in cw.IsDecomposedBy] if cw.IsDecomposedBy else []
    for objs in parts:
        for p in objs:
            try:
                sh = ifcopenshell.geom.create_shape(settings(False), p)
            except Exception:
                continue
            add_box(3, "acrylic" if p.is_a("IfcPlate") else "paper", obb(sh))

# --- instalaciones: conductos (sin los de menos de 15 cm), accesorios grandes y equipos ---
for sh in iterate(hvac, ["IfcFlowSegment"], False):
    e = hvac.by_id(sh.id)
    add_box(2, "accent" if e.GlobalId in ACCENT_GUIDS else "paper", obb(sh), 0.15)
for sh in iterate(hvac, ["IfcFlowFitting"], False):
    b = obb(sh)
    if b is not None and (2 * b["h"]).max() < 3:
        add_box(2, "paper", b, 0.15)
for sh in iterate(hvac, ["IfcEnergyConversionDevice", "IfcFlowMovingDevice"], False):
    add_box(2, "paper", obb(sh))

# --- ejes: centro de la planta, lado largo en horizontal ---
allv = np.concatenate([v for g in groups.values() for v, _ in g])
lo, hi = allv.min(0), allv.max(0)
cx, cy = (lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2


def to_glb(v):
    # IFC (x este, y norte, z arriba) → three (x = norte, y = arriba, z = este): permutación cíclica, conserva el giro
    return np.stack([v[:, 1] - cy, v[:, 2] + LIFT, v[:, 0] - cx], axis=1)


nodes = []
tris = 0
for (layer, mat, i, j), parts in sorted(groups.items()):
    vs, fs, off = [], [], 0
    for v, f in parts:
        vs.append(v)
        fs.append(f + off)
        off += len(v)
    v, f = weld(np.concatenate(vs), np.concatenate(fs))
    tris += len(f)
    nodes.append({"name": f"l{layer}-{mat}-{i}_{j}", "verts": to_glb(v), "faces": f, "extras": {"layer": layer, "mat": mat}})

size = {"w": float(hi[1] - lo[1]), "d": float(hi[0] - lo[0]), "h": float(hi[2] + LIFT)}
write_glb(os.path.join(OUT, "modelo.glb"), nodes, {"source": "buildingSMART Medical-Dental Clinic (CC BY 4.0), simplificado", "size_m": size})


# --- plano: planta baja en metros sobre el mismo origen (x = norte, y = este hacia abajo) ---
def path(pts):
    q = np.stack([pts[:, 1] - cy, pts[:, 0] - cx], axis=1)
    # las 4 esquinas de la base de la caja (las de z = −1), en orden alrededor
    hull = q[[0, 2, 6, 4]]
    return "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in hull) + "Z"


W, D = size["w"] + 4, size["d"] + 4
svg = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-W / 2:.2f} {-D / 2:.2f} {W:.2f} {D:.2f}" width="{W * 20:.0f}" height="{D * 20:.0f}">',
    '<path fill="#1d1c1a" fill-opacity=".72" d="' + "".join(path(p) for p in plan["walls"]) + '"/>',
    '<path fill="#f1efe9" d="' + "".join(path(p) for p in plan["doors"]) + '"/>',
    "</svg>",
]
with open(os.path.join(OUT, "plan.svg"), "w", encoding="utf-8") as fh:
    fh.write("".join(svg))

# lo que necesita la web: `plan` para `MapModel.plan` y el centro para pasar coordenadas del IFC al mundo
print(json.dumps({"plan_m": {"w": round(W, 2), "h": round(D, 2)}, "size_m": size, "center_ifc": [cx, cy], "lift": LIFT, "nodes": len(nodes), "triangles": tris}))
