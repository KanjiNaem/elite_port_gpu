/** Cube wireframe: 8 vertices, 12 edges. Vertices at ±0.5 on each axis. */
const CUBE_VERTICES = new Float32Array([
  -0.5, -0.5, -0.5, // 0
  0.5, -0.5, -0.5,  // 1
  0.5, 0.5, -0.5,   // 2
  -0.5, 0.5, -0.5, // 3
  -0.5, -0.5, 0.5, // 4
  0.5, -0.5, 0.5,  // 5
  0.5, 0.5, 0.5,   // 6
  -0.5, 0.5, 0.5,  // 7
]);

/** 12 edges as index pairs (line-list: 24 indices) */
const CUBE_INDICES = new Uint32Array([
  0, 1, 1, 2, 2, 3, 3, 0, // front face
  4, 5, 5, 6, 6, 7, 7, 4, // back face
  0, 4, 1, 5, 2, 6, 3, 7, // connecting edges
]);

export interface WireframeCube {
  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  indexCount: number;
}

export function createCubeWireframe(device: GPUDevice): WireframeCube {
  const vertexBuffer = device.createBuffer({
    size: CUBE_VERTICES.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, CUBE_VERTICES);

  const indexBuffer = device.createBuffer({
    size: CUBE_INDICES.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, CUBE_INDICES);

  return {
    vertexBuffer,
    indexBuffer,
    indexCount: CUBE_INDICES.length,
  };
}
