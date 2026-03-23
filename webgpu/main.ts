import { mat4 } from "wgpu-matrix";
import { quitIfWebGPUNotAvailableOrMissingFeatures } from "./utils";
import { createWireframePipeline } from "./renderer";
import { createCubeWireframe } from "./wireframe";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

async function init() {
  const adapter = await navigator.gpu?.requestAdapter({
    featureLevel: "compatibility",
  });
  const device = quitIfWebGPUNotAvailableOrMissingFeatures(
    adapter,
    await adapter?.requestDevice(),
  );

  const contextOrNull = canvas.getContext("webgpu");
  if (!contextOrNull) {
    throw new Error("WebGPU context not available");
  }
  const context: GPUCanvasContext = contextOrNull;

  function resizeCanvas() {
    const devicePixelRatio = window.devicePixelRatio;
    const width = Math.max(
      1,
      Math.floor(canvas.clientWidth * devicePixelRatio),
    );
    const height = Math.max(
      1,
      Math.floor(canvas.clientHeight * devicePixelRatio),
    );
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return { width, height };
  }

  resizeCanvas();
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "opaque",
  });

  new ResizeObserver(resizeCanvas).observe(canvas);

  const { pipeline, mvpBuffer, colorBuffer, bindGroup } =
    createWireframePipeline(device, presentationFormat);

  const cube = createCubeWireframe(device);

  const lineColor = new Float32Array([1, 0, 0, 0]);
  device.queue.writeBuffer(colorBuffer, 0, lineColor);

  let rotationAngle = 0;
  const rotationSpeed = (20 * Math.PI) / 180;

  function frame() {
    if (document.hidden) {
      setTimeout(() => requestAnimationFrame(frame), 500);
      return;
    }

    const { width, height } = resizeCanvas();
    if (width === 0 || height === 0) {
      requestAnimationFrame(frame);
      return;
    }

    rotationAngle += rotationSpeed / 60;

    const aspect = width / height;
    const fov = (60 * Math.PI) / 180;
    const projection = mat4.perspective(fov, aspect, 0.1, 1000);

    const eye = [0, 0, 0] as const;
    const target = [0, 0, -5] as const;
    const up = [0, 1, 0] as const;
    const view = mat4.lookAt(eye, target, up);

    const translation = mat4.translation([0, 0, -5]);
    const rotation = mat4.rotationY(rotationAngle);
    const model = mat4.multiply(translation, rotation);

    const mvp = mat4.multiply(projection, mat4.multiply(view, model));
    device.queue.writeBuffer(
      mvpBuffer,
      0,
      mvp.buffer,
      mvp.byteOffset,
      mvp.byteLength,
    );

    const view_ = context.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: view_,
          clearValue: [0, 0, 0, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.setVertexBuffer(0, cube.vertexBuffer);
    passEncoder.setIndexBuffer(cube.indexBuffer, "uint32");
    passEncoder.drawIndexed(cube.indexCount);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

init();
