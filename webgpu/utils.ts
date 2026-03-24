export function quitIfWebGPUNotAvailableOrMissingFeatures(
  adapter: GPUAdapter | null | undefined,
  device: GPUDevice | null | undefined,
): GPUDevice {
  if (!navigator.gpu) {
    document.body.innerHTML = "<p>WebGPU is not supported in this browser.</p>";
    throw new Error("WebGPU not available");
  }
  if (!adapter) {
    document.body.innerHTML = "<p>No WebGPU adapter found.</p>";
    throw new Error("No WebGPU adapter");
  }
  if (!device) {
    document.body.innerHTML = "<p>Failed to get WebGPU device.</p>";
    throw new Error("No WebGPU device");
  }
  return device;
}
