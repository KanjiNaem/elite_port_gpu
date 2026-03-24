import { drawFrameForward, getForwardFrameBottomRibY } from "./frame-forward";
import { drawFrameLeft } from "./frame-left";
import { drawFrameRight } from "./frame-right";

const AMBER = "#FFB000";
const UI_BLUE = "#0055FF";
/** Fraction of width/height inset for the wireframe (0 = lines meet canvas edges). */
const FRAME_INSET = 0;
const LINE_WIDTH = 2;

// must match main.ts yaw angles
const YAW_FORWARD = 0;
const YAW_LEFT = (-90 * Math.PI) / 180;
const YAW_RIGHT = (90 * Math.PI) / 180;

const SLIDE_AMOUNT_FACTOR = 1.1;
const VIEW_SNAP_EPSILON = 0.005;

export type CockpitView = "forward" | "left" | "right";

type ViewState =
  | { kind: "forward" }
  | { kind: "left" }
  | { kind: "right" }
  | { kind: "transition"; to: "left"; t: number }
  | { kind: "transition"; to: "right"; t: number };

function getViewState(yaw: number): ViewState {
  if (yaw >= YAW_FORWARD && yaw <= YAW_RIGHT) {
    const t =
      yaw >= YAW_RIGHT ? 1 : (yaw - YAW_FORWARD) / (YAW_RIGHT - YAW_FORWARD);
    if (t <= VIEW_SNAP_EPSILON) return { kind: "forward" };
    if (t >= 1 - VIEW_SNAP_EPSILON) return { kind: "right" };
    return { kind: "transition", to: "right", t };
  }
  if (yaw <= YAW_FORWARD && yaw >= YAW_LEFT) {
    const t =
      yaw <= YAW_LEFT ? 1 : (YAW_FORWARD - yaw) / (YAW_FORWARD - YAW_LEFT);
    if (t <= VIEW_SNAP_EPSILON) return { kind: "forward" };
    if (t >= 1 - VIEW_SNAP_EPSILON) return { kind: "left" };
    return { kind: "transition", to: "left", t };
  }
  return { kind: "forward" };
}

type FrameParams = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  insetX: number;
  insetY: number;
};

function drawForwardFrame(params: FrameParams): void {
  const { ctx, width, height, insetX, insetY } = params;
  drawFrameForward(ctx, width, height, insetX, insetY);
}

function drawLeftFrame(params: FrameParams): void {
  const { ctx, width, height, insetX, insetY } = params;
  drawFrameLeft(ctx, width, height, insetX, insetY);
}

function drawRightFrame(params: FrameParams): void {
  const { ctx, width, height, insetX, insetY } = params;
  drawFrameRight(ctx, width, height, insetX, insetY);
}

// ─── UI elements (radar, hints) ────────────────────────────────────────────

function drawRadarArea(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetY: number,
): void {
  const ribY = getForwardFrameBottomRibY(height, insetY);
  const margin = Math.max(LINE_WIDTH, height * 0.004);
  const top = ribY + margin;
  const usableBottom = height - insetY;
  const radarHeight = Math.max(usableBottom - top, 1);
  const centerX = width / 2;
  const centerY = top + radarHeight / 2;
  const radiusX = (width * 0.27) / 2;
  const radiusY = radarHeight / 3;

  ctx.strokeStyle = AMBER;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawDockedHints(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const fontSize = Math.min(24, Math.max(14, width * 0.03));
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = UI_BLUE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("take off: ctrl + e", width / 2, height / 2);
  if (!isFullscreen()) {
    ctx.fillText("full screen: fn + f11", width / 2, height / 2 - 60);
  }
}

function isFullscreen(): boolean {
  const el =
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element })
      .webkitFullscreenElement;
  if (el) return true;
  return (
    window.innerWidth >= screen.width * 0.95 &&
    window.innerHeight >= screen.height * 0.95
  );
}

// ─── Main render: view state → frame selection ─────────────────────────────

export function renderCockpitOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentYaw: number,
  isDocked: boolean,
): void {
  ctx.clearRect(0, 0, width, height);

  const insetX = width * FRAME_INSET;
  const insetY = height * FRAME_INSET;
  const params: FrameParams = { ctx, width, height, insetX, insetY };

  ctx.strokeStyle = AMBER;
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const state = getViewState(currentYaw);

  switch (state.kind) {
    case "forward":
      drawForwardFrame(params);
      drawRadarArea(ctx, width, height, insetY);
      if (isDocked) drawDockedHints(ctx, width, height);
      return;

    case "left":
      drawLeftFrame(params);
      return;

    case "right":
      drawRightFrame(params);
      return;

    case "transition": {
      const slideAmount = width * SLIDE_AMOUNT_FACTOR;
      const { t, to } = state;

      // outgoing frame slide
      ctx.save();
      ctx.translate(to === "right" ? -slideAmount * t : slideAmount * t, 0);
      drawForwardFrame(params);
      drawRadarArea(ctx, width, height, insetY);
      if (isDocked) drawDockedHints(ctx, width, height);
      ctx.restore();

      // incomming frame slide
      ctx.save();
      const incomingOffset =
        to === "right"
          ? slideAmount * (1 - t) // right frame enters from right
          : -slideAmount * (1 - t); // left frame enters from left
      ctx.translate(incomingOffset, 0);
      if (to === "right") drawRightFrame(params);
      else drawLeftFrame(params);
      ctx.restore();
      return;
    }
  }
}
