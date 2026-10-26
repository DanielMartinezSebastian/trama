import * as THREE from "three";

/** Segmento macizo de 45°: TorusGeometry deja sus dos cortes abiertos. */
export function closedRingSegment(radius: number, tube: number) {
  const radial = 16;
  const arc = Math.PI / 4;
  const geometry = new THREE.TorusGeometry(radius, tube, radial, 32, arc);
  const positions = Array.from(geometry.attributes.position.array);
  const normals = Array.from(geometry.attributes.normal.array);
  const uvs = Array.from(geometry.attributes.uv.array);
  const indices = Array.from(geometry.index!.array);
  for (const end of [0, 1]) {
    const angle = end * arc;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const normal = end ? [-sin, cos, 0] : [sin, -cos, 0];
    const center = positions.length / 3;
    positions.push(radius * cos, radius * sin, 0);
    normals.push(...normal); uvs.push(.5, .5);
    for (let j = 0; j <= radial; j++) {
      const v = j / radial * Math.PI * 2;
      positions.push((radius + tube * Math.cos(v)) * cos, (radius + tube * Math.cos(v)) * sin, tube * Math.sin(v));
      normals.push(...normal); uvs.push(.5 + Math.cos(v) * .5, .5 + Math.sin(v) * .5);
      if (j < radial) {
        const a = center + 1 + j, b = a + 1;
        indices.push(center, end ? b : a, end ? a : b);
      }
    }
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  geometry.userData.closedSegment = true;
  return geometry;
}
