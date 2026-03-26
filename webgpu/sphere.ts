export interface WireframeSphere {
  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  indexCount: number;
}

function sphericalToCartesian(
  r: number,
  phi: number,
  theta: number,
  out: number[],
  o: number,
): void {
  const sinPhi = Math.sin(phi);
  out[o] = r * sinPhi * Math.cos(theta);
  out[o + 1] = r * Math.cos(phi);
  out[o + 2] = r * sinPhi * Math.sin(theta);
}

export function buildSphereWireframeData(
  radius: number,
  latRings: number,
  lonSegments: number,
  meridianSteps: number,
): { vertices: Float32Array; indices: Uint32Array } {
  const verts: number[] = [];
  const indices: number[] = [];

  function pushVertex(phi: number, theta: number): number {
    const i = verts.length / 3;
    sphericalToCartesian(radius, phi, theta, verts, verts.length);
    return i;
  }

  function pushLine(a: number, b: number): void {
    indices.push(a, b);
  }

  // latitude rings (const phi)
  for (let k = 1; k <= latRings; k++) {
    const phi = (k * Math.PI) / (latRings + 1);
    for (let j = 0; j < lonSegments; j++) {
      const t0 = (j * 2 * Math.PI) / lonSegments;
      const t1 = ((j + 1) * 2 * Math.PI) / lonSegments;
      const a = pushVertex(phi, t0);
      const b = pushVertex(phi, t1);
      pushLine(a, b);
    }
  }

  // meridians (const theta)
  for (let j = 0; j < lonSegments; j++) {
    const theta = (j * 2 * Math.PI) / lonSegments;
    for (let i = 0; i < meridianSteps; i++) {
      const phi0 = (i * Math.PI) / meridianSteps;
      const phi1 = ((i + 1) * Math.PI) / meridianSteps;
      const a = pushVertex(phi0, theta);
      const b = pushVertex(phi1, theta);
      pushLine(a, b);
    }
  }

  return {
    vertices: new Float32Array(verts),
    indices: new Uint32Array(indices),
  };
}

export function createSphereWireframe(
  device: GPUDevice,
  radius = 0.5,
  latRings = 6,
  lonSegments = 12,
  meridianSteps = 8,
): WireframeSphere {
  const { vertices, indices } = buildSphereWireframeData(
    radius,
    latRings,
    lonSegments,
    meridianSteps,
  );

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(
    vertexBuffer,
    0,
    vertices.buffer,
    vertices.byteOffset,
    vertices.byteLength,
  );

  const indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(
    indexBuffer,
    0,
    indices.buffer,
    indices.byteOffset,
    indices.byteLength,
  );

  return {
    vertexBuffer,
    indexBuffer,
    indexCount: indices.length,
  };
}
