import triangleVertWGSL from "../shaders/triangle.vert.wgsl?raw";
import redFragWGSL from "../shaders/red.frag.wgsl?raw";
import { quitIfWebGPUNotAvailableOrMissingFeatures } from "./utils";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const adapter = await navigator.gpu?.requestAdapter({
  featureLevel: "compatibility",
});
const device = quitIfWebGPUNotAvailableOrMissingFeatures(
  adapter,
  await adapter?.requestDevice()
);

const context = canvas.getContext("webgpu");
if (!context) {
  throw new Error("WebGPU canvas context not available");
}
const gpuContext = context;

const devicePixelRatio = window.devicePixelRatio;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

gpuContext.configure({
  device,
  format: presentationFormat,
});

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: {
    module: device.createShaderModule({
      code: triangleVertWGSL,
    }),
  },
  fragment: {
    module: device.createShaderModule({
      code: redFragWGSL,
    }),
    targets: [
      {
        format: presentationFormat,
      },
    ],
  },
  primitive: {
    topology: "triangle-list",
  },
});

function frame() {
  const commandEncoder = device.createCommandEncoder();
  const textureView = gpuContext.getCurrentTexture().createView();

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: textureView,
        clearValue: [0, 0, 0, 0],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.draw(3);
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
