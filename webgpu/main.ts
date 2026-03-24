import { mat4 } from "wgpu-matrix";
import { quitIfWebGPUNotAvailableOrMissingFeatures } from "./utils";
import { createWireframePipeline } from "./renderer";
import { createCubeWireframe } from "./wireframe";
import { createProjection, createViewFromYaw } from "./camera";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

/** Yaw angles (radians) for view snap positions. Design: Forward 0°, Left -65°, Right +65°. */
const YAW_FORWARD = 0;
const YAW_LEFT = (-65 * Math.PI) / 180;
const YAW_RIGHT = (65 * Math.PI) / 180;
const SNAP_DURATION_MS = 200;

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

  let targetYaw = YAW_FORWARD;
  let currentYaw = YAW_FORWARD;
  let lastFrameTime = performance.now();

  window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey) return;
    switch (e.key) {
      case "ArrowUp":
        targetYaw = YAW_FORWARD;
        e.preventDefault();
        break;
      case "ArrowLeft":
        targetYaw = YAW_LEFT;
        e.preventDefault();
        break;
      case "ArrowRight":
        targetYaw = YAW_RIGHT;
        e.preventDefault();
        break;
    }
  });

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

    const now = performance.now();
    const deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    const snapFactor = Math.min(1, deltaTime / (SNAP_DURATION_MS / 1000));
    currentYaw += (targetYaw - currentYaw) * snapFactor;

    rotationAngle += rotationSpeed * deltaTime;

    const aspect = width / height;
    const fov = (60 * Math.PI) / 180;
    const projection = createProjection(fov, aspect, 0.1, 1000);

    const view = createViewFromYaw(currentYaw);

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
