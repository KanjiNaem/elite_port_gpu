import { GUI } from 'dat.gui';
import triangleVertWGSL from '../shaders/triangle.vert.wgsl?raw';
import redFragWGSL from '../shaders/red.frag.wgsl?raw';
import { quitIfWebGPUNotAvailableOrMissingFeatures } from './utils';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

async function init() {
  const adapter = await navigator.gpu?.requestAdapter({
    featureLevel: 'compatibility',
  });
  const device = quitIfWebGPUNotAvailableOrMissingFeatures(
    adapter,
    await adapter?.requestDevice()
  );

  const settings = { transientAttachment: false };
  if ('TRANSIENT_ATTACHMENT' in GPUTextureUsage) {
    const gui = new GUI();
    gui.add(settings, 'transientAttachment');
  }

  const contextOrNull = canvas.getContext('webgpu');
  if (!contextOrNull) {
    throw new Error('WebGPU context not available');
  }
  const context: GPUCanvasContext = contextOrNull;

  function resizeCanvas() {
    const devicePixelRatio = window.devicePixelRatio;
    const width = Math.max(1, Math.floor(canvas.clientWidth * devicePixelRatio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * devicePixelRatio));
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
    alphaMode: 'opaque',
  });

  new ResizeObserver(resizeCanvas).observe(canvas);

  const sampleCount = 4;
  let msaaTexture: GPUTexture | null = null;
  let lastWidth = 0;
  let lastHeight = 0;

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
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
      topology: 'triangle-list',
    },
    multisample: {
      count: sampleCount,
    },
  });

  async function frame() {
    // Pause rendering when tab is hidden to reduce resource usage
    if (document.hidden) {
      setTimeout(() => requestAnimationFrame(frame), 500);
      return;
    }

    const { width, height } = resizeCanvas();
    if (width === 0 || height === 0) {
      requestAnimationFrame(frame);
      return;
    }

    // Reuse texture; only create new one when size changes
    if (!msaaTexture || lastWidth !== width || lastHeight !== height) {
      // Wait for GPU to finish before destroying the old texture
      await device.queue.onSubmittedWorkDone();
      msaaTexture?.destroy();
      lastWidth = width;
      lastHeight = height;
      let usage = GPUTextureUsage.RENDER_ATTACHMENT;
      if (settings.transientAttachment) {
        usage |= GPUTextureUsage.TRANSIENT_ATTACHMENT;
      }
      msaaTexture = device.createTexture({
        size: [width, height],
        sampleCount,
        format: presentationFormat,
        usage,
      });
    }
    const view = msaaTexture!.createView();

    const commandEncoder = device.createCommandEncoder();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view,
          resolveTarget: context.getCurrentTexture().createView(),
          clearValue: [0, 0, 0, 1],
          loadOp: 'clear',
          storeOp: 'discard',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    // Wait for GPU to finish before next frame - prevents command buffer buildup
    await device.queue.onSubmittedWorkDone();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

init();