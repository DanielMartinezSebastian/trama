"""Escritor mínimo de GLB (glTF 2.0 binario): una malla por nodo, solo posiciones e índices, y `extras` en cada nodo
(three los deja en `userData`). Sin normales: la escena las calcula planas al cargar (aristas vivas de maqueta)."""
import json
import struct

import numpy as np


def write_glb(path, nodes, asset_extras=None):
    """nodes: [{"name", "verts": (n, 3) float, "faces": (m, 3) int, "extras": {...}}]"""
    blob = bytearray()
    views, accessors, meshes, gnodes = [], [], [], []

    def add_view(data: bytes, target):
        while len(blob) % 4:
            blob.append(0)
        views.append({"buffer": 0, "byteOffset": len(blob), "byteLength": len(data), "target": target})
        blob.extend(data)
        return len(views) - 1

    for n in nodes:
        v = np.asarray(n["verts"], dtype=np.float32)
        f = np.asarray(n["faces"], dtype=np.uint32).reshape(-1)
        if not len(v) or not len(f):
            continue
        small = len(v) < 65536
        idx = f.astype(np.uint16 if small else np.uint32)
        pv = add_view(v.tobytes(), 34962)
        iv = add_view(idx.tobytes(), 34963)
        accessors.append({"bufferView": pv, "componentType": 5126, "count": len(v), "type": "VEC3", "min": v.min(0).tolist(), "max": v.max(0).tolist()})
        accessors.append({"bufferView": iv, "componentType": 5123 if small else 5125, "count": len(idx), "type": "SCALAR"})
        meshes.append({"primitives": [{"attributes": {"POSITION": len(accessors) - 2}, "indices": len(accessors) - 1}]})
        gnodes.append({"name": n["name"], "mesh": len(meshes) - 1, "extras": n.get("extras", {})})

    gltf = {
        "asset": {"version": "2.0", "generator": "trama scripts/maqueta", **({"extras": asset_extras} if asset_extras else {})},
        "scene": 0,
        "scenes": [{"nodes": list(range(len(gnodes)))}],
        "nodes": gnodes,
        "meshes": meshes,
        "accessors": accessors,
        "bufferViews": views,
        "buffers": [{"byteLength": len(blob)}],
    }
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * ((4 - len(js) % 4) % 4)
    while len(blob) % 4:
        blob.append(0)
    with open(path, "wb") as fh:
        fh.write(struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(blob)))
        fh.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        fh.write(struct.pack("<II", len(blob), 0x004E4942) + bytes(blob))


def weld(verts, faces, tol=1e-4):
    """Une vértices repetidos (IfcOpenShell los duplica por cara) para que el archivo pese menos."""
    v = np.asarray(verts, dtype=np.float64)
    if not len(v):
        return v, np.asarray(faces)
    key = np.round(v / tol).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    f = inv.reshape(-1)[np.asarray(faces)]
    f = f[(f[:, 0] != f[:, 1]) & (f[:, 1] != f[:, 2]) & (f[:, 0] != f[:, 2])]
    return v[first], f


BOX_FACES = np.array([[0, 1, 3], [0, 3, 2], [4, 6, 7], [4, 7, 5], [0, 4, 5], [0, 5, 1], [2, 3, 7], [2, 7, 6], [0, 2, 6], [0, 6, 4], [1, 5, 7], [1, 7, 3]])


def box_corners(c, R, h):
    """8 esquinas de una caja orientada (centro, ejes en columnas, semilados), en el orden de BOX_FACES."""
    out = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            for sz in (-1, 1):
                out.append(c + R @ (h * np.array([sx, sy, sz])))
    return np.array(out)
