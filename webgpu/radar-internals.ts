import { getForwardFrameBottomRibY } from "./frame-forward";
import {
  circleSegmentsWithColor,
  lineSegmentsWithColor,
  type CircleSegment2D,
  type RadarLayout,
  type Segment2D,
} from "./frame-geometry";
import { worldToRadarCanvas, type RadarContact } from "./radar-moving-parts";

const RADAR_MARGIN_LINE = 2;

const RADAR_FRAME_RED = "#FF0000";

const RADAR_CONTACT_MARKER_PX = 3.5;
const RADAR_CONTACT_LINE_WIDTH = 1;

export function computeRadarLayout(
  width: number,
  height: number,
  insetY: number,
): RadarLayout {
  const ribY = getForwardFrameBottomRibY(height, insetY);
  const margin = Math.max(RADAR_MARGIN_LINE, height * 0.004);
  const top = ribY + margin;
  const usableBottom = height - insetY;
  const radarHeight = Math.max(usableBottom - top, 1);
  const centerX = width / 2;
  const centerY = top + radarHeight / 2;
  const radiusX = (width * 0.27) / 2;
  const radiusY = radarHeight / 3;
  return {
    ribY,
    margin,
    top,
    usableBottom,
    radarHeight,
    centerX,
    centerY,
    radiusX,
    radiusY,
    width,
    height,
  };
}

export function getRadarDrawData(layout: RadarLayout): {
  circles: CircleSegment2D[];
  lines: Segment2D[];
} {
  const { centerX, centerY, radiusX, radiusY } = layout;

  const circles = circleSegmentsWithColor(RADAR_FRAME_RED, "solid", [
    {
      x: centerX,
      y: centerY,
      radiusX,
      radiusY,
    },
  ]);

  const lines: Segment2D[] = lineSegmentsWithColor(RADAR_FRAME_RED, "solid", [
    {
      x0: centerX - radiusX,
      y0: centerY,
      x1: centerX + radiusX,
      y1: centerY,
    },
    {
      x0: centerX,
      y0: centerY - radiusY,
      x1: centerX,
      y1: centerY + radiusY,
    },
  ]);

  return {
    circles,
    lines,
  };
}

export function drawRadarContacts(
  ctx: CanvasRenderingContext2D,
  layout: RadarLayout,
  view: Float32Array,
  contacts: RadarContact[],
): void {
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = RADAR_CONTACT_LINE_WIDTH;
  ctx.lineCap = "round";
  for (const c of contacts) {
    const proj = worldToRadarCanvas(layout, view, c.world);
    ctx.strokeStyle = c.color;
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.moveTo(proj.baseX, proj.baseY);
    ctx.lineTo(proj.dotX, proj.dotY);
    ctx.stroke();
    const half = RADAR_CONTACT_MARKER_PX / 2;
    ctx.fillRect(
      proj.dotX - half,
      proj.dotY - half,
      RADAR_CONTACT_MARKER_PX,
      RADAR_CONTACT_MARKER_PX,
    );
  }
  ctx.restore();
}
