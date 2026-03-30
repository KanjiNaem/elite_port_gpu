/** Friendly message when WebGPU init throws (e.g. GPU blocklist, no adapter). */
export function showWebGPUInitFailure(reason: unknown): void {
  document.body.replaceChildren();
  document.documentElement.style.background = "#1a1a1a";
  document.body.style.cssText =
    "margin:0;min-height:100vh;overflow:auto;background:#1a1a1a;color:#e8e8e8;";

  const wrap = document.createElement("div");
  wrap.style.cssText =
    "font-family: system-ui, sans-serif; padding: 1.25rem; max-width: 34rem; line-height: 1.55; overflow-wrap: anywhere;";

  const msg =
    reason instanceof DOMException
      ? reason.message
      : reason instanceof Error
        ? reason.message
        : String(reason);

  const title = document.createElement("p");
  title.style.fontWeight = "600";
  title.textContent = `WebGPU failed: ${msg}`;
  wrap.appendChild(title);

  if (/blocklist|disabled by/i.test(msg)) {
    const intro = document.createElement("p");
    intro.textContent =
      "The browser turned WebGPU off for this GPU or driver (safety blocklist). That can change after a driver or browser update.";
    wrap.appendChild(intro);

    const list = document.createElement("ul");
    list.style.cssText =
      "margin: 0.75rem 0 0; padding-left: 1.35rem; list-style: disc; list-style-position: outside;";
    for (const line of [
      "Update GPU drivers (Mesa, Vulkan stack, or NVIDIA/AMD proprietary if you use them).",
      "Try Chromium if you use Firefox (or the other way around).",
      "Firefox: about:support — Chromium: chrome://gpu — look for WebGPU / blocklist.",
      "Firefox only, optional: about:config → gfx.webgpu.ignore-blocklist = true, then restart. Ignores the blocklist; only if you accept possible instability.",
    ]) {
      const li = document.createElement("li");
      li.textContent = line;
      li.style.marginBottom = "0.35rem";
      list.appendChild(li);
    }
    wrap.appendChild(list);
  }

  document.body.appendChild(wrap);
}

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
