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
const RADAR_FRAME_DARK_RED = "#800000";
const RADAR_PLAYER_GREEN = "#00FF00";
const RADAR_FRAME_DARK_GREEN = "#008000";

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
  solidRedLines: Segment2D[];
  dashedRedLines: Segment2D[];
  dashedGreenLines: Segment2D[];
  playerTriangleAtCenter: Segment2D[];
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

  const onEllipse = (theta: number) => ({
    x: centerX + radiusX * Math.cos(theta),
    y: centerY + radiusY * Math.sin(theta),
  });

  const a = (t: number) => onEllipse(Math.PI * t);
  const b = (t: number) => onEllipse(Math.PI * t);

  const solidRedLines: Segment2D[] = lineSegmentsWithColor(
    RADAR_FRAME_RED,
    "solid",
    [],
  );

  const dashedRedLines: Segment2D[] = lineSegmentsWithColor(
    RADAR_FRAME_DARK_RED,
    "dashed",
    [
      // horizontal chords — endpoints on the radar ellipse
      {
        x0: a(0.75).x + 3,
        y0: a(1.76).y,
        // unlucky dashed line allignment --> offset by 5 here instead of 3
        x1: b(1.75).x - 5,
        y1: b(1.75).y,
      },
      {
        x0: a(0.79).x + 3,
        y0: a(0.8).y,
        x1: b(1.79).x - 3,
        y1: b(0.8).y,
      },
      // vertical chords
      {
        x0: a(1.75).x,
        y0: a(0.75).y - 3,
        x1: b(1.62).x,
        y1: b(1.62).y + 3,
      },
      {
        x0: a(0.75).x,
        y0: a(0.75).y - 3,
        x1: b(0.62).x,
        y1: b(1.62).y + 3,
      },
      // radar crosshair
      {
        x0: centerX - radiusX + 3,
        y0: centerY,
        x1: centerX + radiusX - 3,
        y1: centerY,
      },
      {
        x0: centerX,
        y0: centerY - radiusY + 3,
        x1: centerX,
        y1: centerY + radiusY - 3,
      },
    ],
  );
  const dashedGreenLines: Segment2D[] = lineSegmentsWithColor(
    RADAR_FRAME_DARK_GREEN,
    "dashed",
    [
      {
        x0: centerX,
        y0: centerY,
        x1: b(1.8).x,
        y1: b(1.8).y,
      },
      {
        x0: centerX,
        y0: centerY,
        x1: b(0.8).x,
        y1: b(1.8).y,
      },
    ],
  );

  const playerTriangleAtCenter = lineSegmentsWithColor(
    RADAR_PLAYER_GREEN,
    "solid",
    [
      {
        x0: centerX - 10,
        y0: centerY,
        x1: centerX + 10,
        y1: centerY,
      },
      {
        x0: centerX + 10,
        y0: centerY,
        x1: centerX + 3,
        y1: centerY - 4,
      },
      {
        x0: centerX + 3,
        y0: centerY - 4,
        x1: centerX - 3,
        y1: centerY - 4,
      },
      {
        x0: centerX - 3,
        y0: centerY - 4,
        x1: centerX - 10,
        y1: centerY,
      },
    ],
    true,
  );
  return {
    circles,
    solidRedLines,
    dashedRedLines,
    dashedGreenLines,
    playerTriangleAtCenter,
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
