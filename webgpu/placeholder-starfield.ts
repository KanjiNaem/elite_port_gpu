import starfieldVertWGSL from "../shaders/starfield.vert.wgsl?raw";
import starfieldFragWGSL from "../shaders/starfield.frag.wgsl?raw";

export const PLACEHOLDER_STARFIELD_ENABLED = true;

const STAR_COUNT = 720;
const SKY_RADIUS = 420;

function fibonacciSpherePoints(count: number, radius: number): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    out[i * 3] = x * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = z * radius;
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
          arrayStride: 12,
          attributes: [
            { format: "float32x3", offset: 0, shaderLocation: 0 },
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

  const positions = fibonacciSpherePoints(STAR_COUNT, SKY_RADIUS);
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
