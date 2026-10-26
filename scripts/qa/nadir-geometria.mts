import assert from "node:assert/strict";
import { Vector3 } from "three";
import { closedRingSegment } from "../../components/sites/nadir/geometry";

for (const [radius, tube] of [[2.68, .145], [2.26, .095], [1.84, .095], [1.42, .095]]) {
  const geometry = closedRingSegment(radius, tube);
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const index = geometry.index!;
  const edges = new Map<string, number>();
  const pointKey = (i: number) => [positions.getX(i), positions.getY(i), positions.getZ(i)].map((n) => Math.round(n * 1e5)).join(",");
  const a = new Vector3(), b = new Vector3(), c = new Vector3(), normal = new Vector3(), cross = new Vector3();
  let volume = 0;
  for (let i = 0; i < index.count; i += 3) {
    const ids = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
    const keys = ids.map(pointKey);
    for (let j = 0; j < 3; j++) {
      const edge = [keys[j], keys[(j + 1) % 3]].sort().join("|");
      edges.set(edge, (edges.get(edge) ?? 0) + 1);
    }
    a.fromBufferAttribute(positions, ids[0]); b.fromBufferAttribute(positions, ids[1]); c.fromBufferAttribute(positions, ids[2]);
    volume += a.dot(cross.crossVectors(b, c)) / 6;
    cross.subVectors(b, a).cross(c.clone().sub(a));
    normal.fromBufferAttribute(normals, ids[0]);
    assert.ok(cross.dot(normal) > 0, "caras exteriores y tapas orientadas hacia fuera");
  }
  assert.ok([...edges.values()].every((n) => n === 2), `segmento ${radius}: sin bordes abiertos ni aristas no manifold`);
  assert.ok(volume > 0, "volumen cerrado positivo");
  const rotation = Math.PI / 4;
  for (let row = 0; row <= geometry.parameters.radialSegments; row++) {
    const start = row * (geometry.parameters.tubularSegments + 1);
    const end = start + geometry.parameters.tubularSegments;
    a.fromBufferAttribute(positions, end);
    b.fromBufferAttribute(positions, start).applyAxisAngle(new Vector3(0, 0, 1), rotation);
    assert.ok(a.distanceTo(b) < 1e-6, "segmentos contiguos encajan sin huecos");
    a.fromBufferAttribute(normals, end);
    b.fromBufferAttribute(normals, start).applyAxisAngle(new Vector3(0, 0, 1), rotation);
    assert.ok(a.distanceTo(b) < 1e-6, "normal continua en la unión, sin costura de iluminación");
  }
  geometry.dispose();
}
console.log("Cuatro segmentos estancos, sin bordes abiertos, tapas exteriores y volumen positivo.");
