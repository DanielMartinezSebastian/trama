"""OpenStreetMap → maqueta de barrio (GLB por capas + plano SVG) para `ExplorableCanvas model`.

Uso (con `pip install shapely mapbox_earcut`):

    python -I scripts/maqueta/osm_to_glb.py <overpass.json> public/models/eixample <lat> <lon> <ancho m> <alto m> [lat,lon ...]

`overpass.json` es la respuesta de Overpass (`out body geom;`) con los `building`, `building:part` y los parques
(`leisure=park|garden`) de la zona. En España muchas piezas vienen del Catastro con su número de plantas
(`building:levels`): cada pieza se extruye a su altura real (3,1 m por planta, o `height` si lo trae) y desde
`building:min_level`. Los edificios que tienen piezas no se pintan enteros (las piezas ya los forman).

La planta se gira para que la trama de calles quede en horizontal (se mide la orientación dominante de las fachadas) y
se recorta a `ancho × alto` metros alrededor del centro. Los puntos `lat,lon` del final marcan con el acento el edificio
más cercano y se imprime su posición en % del recorte (y su altura en m), para colocar los puntos del mapa.

Capas: 0 parques · 1 piezas bajas (≤ 2 plantas: interiores de manzana) · 2 edificios · 3 torres (≥ 9 plantas).
Los datos de OpenStreetMap son © OpenStreetMap contributors, con licencia ODbL: hay que citarlos donde se vea el mapa.
"""
import json
import math
import os
import sys

import mapbox_earcut as earcut
import numpy as np
from shapely import affinity
from shapely.geometry import Point, Polygon, box
from shapely.ops import unary_union
from shapely.strtree import STRtree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glb import weld, write_glb  # noqa: E402

SRC, OUT = sys.argv[1], sys.argv[2]
LAT0, LON0, W, H = (float(a) for a in sys.argv[3:7])
MARKS = [tuple(float(v) for v in a.split(",")) for a in sys.argv[7:]]
os.makedirs(OUT, exist_ok=True)
LEVEL = 3.1
CHUNK = 120.0
KX = 111320 * math.cos(math.radians(LAT0))
KY = 110540


def xy(lat, lon):
    # x al este, y al sur (como la pantalla)
    return ((lon - LON0) * KX, -(lat - LAT0) * KY)


def rings_of(el):
    if el["type"] == "way":
        return [[xy(p["lat"], p["lon"]) for p in el["geometry"]]], []
    outer, inner = [], []
    for m in el.get("members", []):
        if m["type"] != "way" or "geometry" not in m:
            continue
        ring = [xy(p["lat"], p["lon"]) for p in m["geometry"]]
        (inner if m.get("role") == "inner" else outer).append(ring)
    return outer, inner


def polygon(el):
    outer, inner = rings_of(el)
    polys = []
    for o in outer:
        if len(o) < 4:
            continue
        p = Polygon(o, [i for i in inner if len(i) >= 4 and Polygon(o).contains(Polygon(i).representative_point())])
        if not p.is_valid:
            p = p.buffer(0)
        if not p.is_empty:
            polys.append(p)
    return unary_union(polys) if polys else None


def num(v):
    try:
        return float(str(v).split(";")[0].replace(",", ".").replace("m", "").strip())
    except (TypeError, ValueError):
        return None


data = json.load(open(SRC, encoding="utf-8"))["elements"]
parts, buildings, parks = [], [], []
for el in data:
    t = el.get("tags", {})
    if el["type"] == "way" and "geometry" not in el:
        continue
    p = polygon(el)
    if p is None or p.area < 4:
        continue
    lv = num(t.get("building:levels"))
    hgt = num(t.get("height"))
    minlv = num(t.get("building:min_level")) or 0
    item = {"poly": p, "levels": lv, "top": (hgt if hgt else (lv * LEVEL if lv is not None else None)), "base": num(t.get("min_height")) or minlv * LEVEL}
    if "building:part" in t:
        if lv == 0 and not hgt:
            continue  # sótanos y plantas bajo rasante
        parts.append(item)
    elif "building" in t:
        buildings.append(item)
    elif t.get("leisure") in ("park", "garden"):
        parks.append(item)

# orientación dominante de las fachadas (módulo 90°): la trama de calles queda en horizontal
hist = np.zeros(90)
for it in parts + buildings:
    c = np.array(it["poly"].geoms[0].exterior.coords if it["poly"].geom_type == "MultiPolygon" else it["poly"].exterior.coords)
    d = np.diff(c, axis=0)
    ln = np.hypot(d[:, 0], d[:, 1])
    ang = (np.degrees(np.arctan2(d[:, 1], d[:, 0])) % 90).astype(int) % 90
    np.add.at(hist, ang, ln)
smooth = np.convolve(np.r_[hist[-3:], hist, hist[:3]], np.ones(7), "valid")
theta = float(np.argmax(smooth))
if theta > 45:
    theta -= 90
clip = box(-W / 2, -H / 2, W / 2, H / 2)


def place(p):
    return affinity.rotate(p, -theta, origin=(0, 0)).intersection(clip)


# los edificios con piezas no se pintan enteros
tree = STRtree([it["poly"] for it in parts]) if parts else None
solo = []
for b in buildings:
    inside = [i for i in tree.query(b["poly"]) if b["poly"].contains(parts[i]["poly"].representative_point())] if tree is not None else []
    if not inside:
        solo.append(b)

marks = [Point(affinity.rotate(Point(*xy(la, lo)), -theta, origin=(0, 0)).coords[0]) for la, lo in MARKS]
groups: dict = {}


def extrude(poly, z0, z1):
    """Prisma de `z0` a `z1` sobre la huella, ya en ejes de three (x este, y arriba, z sur) y con las caras hacia fuera."""
    vs, fs, base = [], [], 0
    for g in getattr(poly, "geoms", [poly]):
        if g.geom_type != "Polygon" or g.area < 2:
            continue
        g = g.simplify(0.25, preserve_topology=True)
        if g.is_empty or g.geom_type != "Polygon":
            continue
        rings = [np.array(g.exterior.coords)[:-1]] + [np.array(r.coords)[:-1] for r in g.interiors]
        pts = np.concatenate(rings)
        ends = np.cumsum([len(r) for r in rings]).astype(np.uint32)
        tri = earcut.triangulate_float64(pts, ends).reshape(-1, 3).astype(np.int64)
        n = len(pts)
        verts = np.concatenate([np.c_[pts[:, 0], np.full(n, z1), pts[:, 1]], np.c_[pts[:, 0], np.full(n, z0), pts[:, 1]]])
        faces = [tri] + ([tri + n] if z0 > 0.01 else [])
        want = [np.array([0, 1, 0])] * len(tri) + ([np.array([0, -1, 0])] * len(tri) if z0 > 0.01 else [])
        start = 0
        for r in rings:
            k = len(r)
            area = 0.5 * np.sum(r[:, 0] * np.roll(r[:, 1], -1) - np.roll(r[:, 0], -1) * r[:, 1])
            for i in range(k):
                a, b = start + i, start + (i + 1) % k
                d = pts[b] - pts[a]
                # hacia fuera del material: a un lado del contorno exterior y al otro en los patios
                out = np.array([d[1], 0, -d[0]]) * (1 if area > 0 else -1) * (1 if r is rings[0] else -1)
                faces.append(np.array([[a, n + a, n + b], [a, n + b, b]]))
                want += [out, out]
            start += k
        f = np.concatenate(faces)
        # cada triángulo, mirando hacia donde debe
        p0, p1, p2 = verts[f[:, 0]], verts[f[:, 1]], verts[f[:, 2]]
        nrm = np.cross(p1 - p0, p2 - p0)
        flip = np.einsum("ij,ij->i", nrm, np.array(want)) < 0
        f[flip] = f[flip][:, ::-1]
        vs.append(verts)
        fs.append(f + base)
        base += len(verts)
    if not vs:
        return None
    return np.concatenate(vs), np.concatenate(fs)


def add(layer, mat, poly, z0, z1):
    r = extrude(poly, z0, z1)
    if r is None:
        return
    c = poly.centroid
    key = (layer, mat, int(math.floor(c.x / CHUNK)), int(math.floor(c.y / CHUNK)))
    groups.setdefault(key, []).append(r)


placed = []
for it in parts + solo:
    p = place(it["poly"])
    if p.is_empty or p.area < 2:
        continue
    top = it["top"] if it["top"] is not None else 5 * LEVEL  # sin dato: la altura típica de la manzana
    placed.append((p, top, it["base"] if it["base"] < top else 0))
# cada punto marca el edificio de más de dos plantas más cercano (a menos de 25 m) y se coloca en su centro
picked = {}
for k, m in enumerate(marks):
    near = [(p.distance(m), i) for i, (p, top, _) in enumerate(placed) if top > 2.2 * LEVEL and p.distance(m) < 25]
    if near:
        picked[min(near)[1]] = k
accent_at = [None] * len(marks)
plan_paths = []
for i, (p, top, z0) in enumerate(placed):
    lv = top / LEVEL
    layer = 1 if lv <= 2.2 else 3 if lv >= 9 else 2
    mat = "paper"
    if i in picked:
        mat = "accent"
        c = p.representative_point()
        accent_at[picked[i]] = [round(50 + c.x / W * 100, 2), round(50 + c.y / H * 100, 2), round(top, 1)]
    add(layer, mat, p, z0, top)
    if z0 < 0.5:
        plan_paths.append(p)
for it in parks:
    p = place(it["poly"])
    if not p.is_empty and p.area > 20:
        add(0, "wood", p, 0, 0.6)

nodes, tris = [], 0
for (layer, mat, i, j), parts_ in sorted(groups.items()):
    vs, fs, off = [], [], 0
    for v, f in parts_:
        vs.append(v)
        fs.append(f + off)
        off += len(v)
    v, f = weld(np.concatenate(vs), np.concatenate(fs), 1e-3)
    tris += len(f)
    nodes.append({"name": f"l{layer}-{mat}-{i}_{j}", "verts": v, "faces": f, "extras": {"layer": layer, "mat": mat}})
write_glb(os.path.join(OUT, "modelo.glb"), nodes, {"source": "© OpenStreetMap contributors (ODbL)", "rotation_deg": theta})


def svg_path(p):
    out = []
    for g in getattr(p, "geoms", [p]):
        if g.geom_type != "Polygon":
            continue
        for r in [g.exterior, *g.interiors]:
            c = np.array(r.coords)
            out.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in c) + "Z")
    return "".join(out)


svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-W / 2} {-H / 2} {W} {H}" width="{W * 2:.0f}" height="{H * 2:.0f}"><path fill="#1d1c1a" fill-opacity=".14" stroke="#1d1c1a" stroke-opacity=".55" stroke-width=".5" fill-rule="evenodd" d="{"".join(svg_path(p) for p in plan_paths)}"/></svg>'
open(os.path.join(OUT, "plan.svg"), "w", encoding="utf-8").write(svg)
print(json.dumps({"rotation_deg": theta, "nodes": len(nodes), "triangles": tris, "marks": accent_at}))
