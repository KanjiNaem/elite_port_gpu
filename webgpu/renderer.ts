import cubeVertWGSL from "../shaders/cube.vert.wgsl?raw";
import cubeFragWGSL from "../shaders/cube.frag.wgsl?raw";

export interface WireframePipeline {
  pipeline: GPURenderPipeline;
  mvpBuffer: GPUBuffer;
  colorBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
}

export function createWireframePipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
): WireframePipeline {
  const vertModule = device.createShaderModule({
    code: cubeVertWGSL,
  });
  const fragModule = device.createShaderModule({
    code: cubeFragWGSL,
  });

  const mvpBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const colorBuffer = device.createBuffer({
    size: 16, // vec4 = 16 bytes
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
      topology: "line-list",
    },
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: mvpBuffer } },
      {
        binding: 1,
        resource: { buffer: colorBuffer },
      },
    ],
  });

  return {
    pipeline,
    mvpBuffer,
    colorBuffer,
    bindGroup,
  };
}
