import { mat4 } from "wgpu-matrix";
import { quitIfWebGPUNotAvailableOrMissingFeatures } from "./utils";
import { createWireframePipeline } from "./renderer";
import { createCubeWireframe } from "./cube";
import { createSphereWireframe } from "./sphere";
import {
  createProjection,
  createViewFromYaw,
  createViewFromYawPitch,
} from "./camera";
import { renderCockpitOverlay } from "./cockpit-overlay";
import {
  PLACEHOLDER_STARFIELD_ENABLED,
  createPlaceholderStarfield,
} from "./placeholder-starfield";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const cockpitOverlayCanvas = document.querySelector(
  "#cockpit-overlay",
) as HTMLCanvasElement;
const dockedOverlay = document.querySelector(
  "#docked-overlay",
) as HTMLDivElement;

// yaw angles in radians for view snap/ distance-based projection keeps cube size constant
const YAW_FORWARD = 0;
const YAW_LEFT = (-90 * Math.PI) / 180;
const YAW_RIGHT = (90 * Math.PI) / 180;
// time constant for yaw easing (lower = faster snap between forward / left / right)
const SNAP_DURATION_MS = 200 / 3;

function yawViewBucket(yaw: number): "left" | "forward" | "right" {
  const leftMid = (YAW_FORWARD + YAW_LEFT) / 2;
  const rightMid = (YAW_FORWARD + YAW_RIGHT) / 2;
  if (yaw < leftMid) return "left";
  if (yaw > rightMid) return "right";
  return "forward";
}

// --- DEBUG CAMERA ---
const DEBUG_MOUSE_CAMERA = true;
const MOUSE_SENSITIVITY = 0.003;
// --- END DEBUG ---

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
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    const width = Math.max(1, Math.floor(displayWidth * devicePixelRatio));
    const height = Math.max(1, Math.floor(displayHeight * devicePixelRatio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    if (
      cockpitOverlayCanvas.width !== width ||
      cockpitOverlayCanvas.height !== height
    ) {
      cockpitOverlayCanvas.width = width;
      cockpitOverlayCanvas.height = height;
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
  window.addEventListener("resize", resizeCanvas);

  const { pipeline, mvpBuffers, colorBuffers, bindGroups } =
    createWireframePipeline(device, presentationFormat, 5);

  const starfield = PLACEHOLDER_STARFIELD_ENABLED
    ? createPlaceholderStarfield(device, presentationFormat)
    : null;
  const starfieldColor = new Float32Array([
    0.55,
    0.58,
    0.72,
    1,
  ]);
  if (starfield) {
    device.queue.writeBuffer(starfield.colorBuffer, 0, starfieldColor);
  }

  const cube = createCubeWireframe(device);
  const sphere = createSphereWireframe(device);

  const cubeColor = new Float32Array([
    1,
    0,
    0,
    1,
  ]);
  const ballColors = [
    new Float32Array([
      1,
      0.55,
      0.1,
      1,
    ]), // orbit — orange
    new Float32Array([
      0.2,
      1,
      0.45,
      1,
    ]), // oscillate — green
    new Float32Array([
      0.45,
      0.65,
      1,
      1,
    ]), // Lissajous — blue
    new Float32Array([
      1,
      0.35,
      0.85,
      1,
    ]), // bounce / drift — magenta
  ];

  let rotationAngle = 0;
  const rotationSpeed = (20 * Math.PI) / 180;

  let targetYaw = YAW_FORWARD;
  let currentYaw = YAW_FORWARD;
  let lastFrameTime = performance.now();
  let isDocked = true;

  // camera for perspective debugging (free look)
  let debugYaw = 0;
  let debugPitch = 0;
  let isMouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  if (DEBUG_MOUSE_CAMERA) {
    canvas.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;
      debugYaw += (e.clientX - lastMouseX) * MOUSE_SENSITIVITY;
      debugPitch += (e.clientY - lastMouseY) * MOUSE_SENSITIVITY;
      debugPitch = Math.max(
        -Math.PI / 2 + 0.01,
        Math.min(Math.PI / 2 - 0.01, debugPitch),
      );
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    window.addEventListener("mouseup", () => {
      isMouseDown = false;
    });
    window.addEventListener("mouseleave", () => {
      isMouseDown = false;
    });
  }
  // --- END PERSPECTIVE DEBUG ---

  window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey) return;
    switch (e.key) {
      case "c":
        if (DEBUG_MOUSE_CAMERA) {
          debugYaw = 0;
          debugPitch = 0;
        }
        e.preventDefault();
        break;
      case "ArrowUp":
        targetYaw = YAW_FORWARD;
        e.preventDefault();
        break;
      case "ArrowLeft": {
        const v = yawViewBucket(currentYaw);
        targetYaw = v === "right" ? YAW_FORWARD : YAW_LEFT;
        e.preventDefault();
        break;
      }
      case "ArrowRight": {
        const v = yawViewBucket(currentYaw);
        targetYaw = v === "left" ? YAW_FORWARD : YAW_RIGHT;
        e.preventDefault();
        break;
      }
      case "e":
        isDocked = !isDocked;
        dockedOverlay.style.display = isDocked ? "flex" : "none";
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

    if (!isDocked) {
      rotationAngle += rotationSpeed * deltaTime;
    }

    const aspect = width / height;
    const fov = (60 * Math.PI) / 180;
    const near = 0.1;
    const far = 1000;
    const projection = createProjection(fov, aspect, near, far);

    const view = DEBUG_MOUSE_CAMERA
      ? createViewFromYawPitch(currentYaw + debugYaw, debugPitch)
      : createViewFromYaw(currentYaw);

    const view_ = context.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: view_,
          clearValue: [
            0,
            0,
            0,
            1,
          ],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    if (!isDocked) {
      const t = now / 1000;

      if (starfield) {
        const skyMvp = mat4.multiply(projection, view);
        device.queue.writeBuffer(
          starfield.mvpBuffer,
          0,
          skyMvp.buffer,
          skyMvp.byteOffset,
          skyMvp.byteLength,
        );
        passEncoder.setPipeline(starfield.pipeline);
        passEncoder.setBindGroup(0, starfield.bindGroup);
        passEncoder.setVertexBuffer(0, starfield.vertexBuffer);
        passEncoder.draw(starfield.vertexCount);
      }

      passEncoder.setPipeline(pipeline);

      const cubeTranslation = mat4.translation([
        0,
        0,
        -20,
      ]);
      const cubeRotation = mat4.rotationY(rotationAngle);
      const cubeModel = mat4.multiply(cubeTranslation, cubeRotation);
      const cubeMvp = mat4.multiply(projection, mat4.multiply(view, cubeModel));
      device.queue.writeBuffer(colorBuffers[0]!, 0, cubeColor);
      device.queue.writeBuffer(
        mvpBuffers[0]!,
        0,
        cubeMvp.buffer,
        cubeMvp.byteOffset,
        cubeMvp.byteLength,
      );
      passEncoder.setBindGroup(0, bindGroups[0]!);
      passEncoder.setVertexBuffer(0, cube.vertexBuffer);
      passEncoder.setIndexBuffer(cube.indexBuffer, "uint32");
      passEncoder.drawIndexed(cube.indexCount);

      // 4 wireframe spheres
      const orbitR = 5.5;
      const ballPositions: [number, number, number][] = [
        // horizontal orbit around a point
        [
          orbitR * Math.cos(t * 0.7),
          0,
          -20 + orbitR * Math.sin(t * 0.7),
        ],
        // linear-ish oscillation along X
        [
          7 * Math.sin(t * 0.55),
          0.25,
          -21.5,
        ],
        // lissajous style path
        [
          4 * Math.sin(t * 0.9 * 2),
          2.5 * Math.sin(t * 0.9 * 3),
          -18.5,
        ],
        // vertical bounce with slow drift in XZ
        [
          3.5 * Math.sin(t * 0.12),
          1.8 * Math.sin(t * 1.4),
          -22 + 3 * Math.cos(t * 0.25),
        ],
      ];

      passEncoder.setVertexBuffer(0, sphere.vertexBuffer);
      passEncoder.setIndexBuffer(sphere.indexBuffer, "uint32");

      for (let i = 0; i < 4; i++) {
        const [
          bx,
          by,
          bz,
        ] = ballPositions[i]!;
        const ballModel = mat4.translation([
          bx,
          by,
          bz,
        ]);
        const slot = i + 1;
        const ballMvp = mat4.multiply(
          projection,
          mat4.multiply(view, ballModel),
        );
        device.queue.writeBuffer(colorBuffers[slot]!, 0, ballColors[i]!);
        device.queue.writeBuffer(
          mvpBuffers[slot]!,
          0,
          ballMvp.buffer,
          ballMvp.byteOffset,
          ballMvp.byteLength,
        );
        passEncoder.setBindGroup(0, bindGroups[slot]!);
        passEncoder.drawIndexed(sphere.indexCount);
      }
    }

    passEncoder.end();

    device.queue.submit([
      commandEncoder.finish(),
    ]);

    const overlayCtx = cockpitOverlayCanvas.getContext("2d");
    if (overlayCtx) {
      renderCockpitOverlay(overlayCtx, width, height, currentYaw, isDocked);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

init();
