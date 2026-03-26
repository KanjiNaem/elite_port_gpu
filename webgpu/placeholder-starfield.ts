import starfieldVertWGSL from "../shaders/starfield.vert.wgsl?raw";
import starfieldFragWGSL from "../shaders/starfield.frag.wgsl?raw";

export const PLACEHOLDER_STARFIELD_ENABLED = true;

const STAR_COUNT = 3200;
const SKY_RADIUS = 420;

/** Uniform random on unit sphere (y-up), with mild shell thickness and per-star brightness. */
function randomSphereStarPoints(count: number, baseRadius: number): Float32Array {
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const sinPhi = Math.sin(phi);
    const x = sinPhi * Math.cos(theta);
    const y = Math.cos(phi);
    const z = sinPhi * Math.sin(theta);
    const shell = baseRadius * (0.94 + Math.random() * 0.12);
    out[i * 4] = x * shell;
    out[i * 4 + 1] = y * shell;
    out[i * 4 + 2] = z * shell;
    out[i * 4 + 3] = 0.35 + Math.random() * 0.65;
  }
  return out;
}

export interface PlaceholderStarfield {
  pipeline: GPURenderPipeline;
  mvpBuffer: GPUBuffer;
  colorBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  vertexBuffer: GPUBuffer;
  vertexCount: number;
}

export function createPlaceholderStarfield(
  device: GPUDevice,
  format: GPUTextureFormat,
): PlaceholderStarfield {
  const vertModule = device.createShaderModule({ code: starfieldVertWGSL });
  const fragModule = device.createShaderModule({ code: starfieldFragWGSL });

  const mvpBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const colorBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "uniform" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: { type: "uniform" },
      },
    ],
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [
      bindGroupLayout,
    ],
  });

  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: vertModule,
      buffers: [
        {
          arrayStride: 16,
          attributes: [
            { format: "float32x3", offset: 0, shaderLocation: 0 },
            { format: "float32", offset: 12, shaderLocation: 1 },
          ],
        },
      ],
    },
    fragment: {
      module: fragModule,
      targets: [
        { format },
      ],
    },
    primitive: {
      topology: "point-list",
    },
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: mvpBuffer } },
      { binding: 1, resource: { buffer: colorBuffer } },
    ],
  });

  const positions = randomSphereStarPoints(STAR_COUNT, SKY_RADIUS);
  const vertexBuffer = device.createBuffer({
    size: positions.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(
    vertexBuffer,
    0,
    positions.buffer,
    positions.byteOffset,
    positions.byteLength,
  );

  return {
    pipeline,
    mvpBuffer,
    colorBuffer,
    bindGroup,
    vertexBuffer,
    vertexCount: STAR_COUNT,
  };
}
