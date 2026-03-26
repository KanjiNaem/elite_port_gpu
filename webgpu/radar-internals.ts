import { getForwardFrameBottomRibY } from "./frame-forward";
import {
  circleSegmentsWithColor,
  lineSegmentsWithColor,
  type CircleSegment2D,
  type RadarLayout,
  type Segment2D,
} from "./frame-geometry";

const RADAR_MARGIN_LINE = 2;

const RADAR_COLORS = {
  AMBER: "#FFB000",
  RED: "#FF0000",
  DARK_RED: "#800000",
  GREEN: "#00FF00",
} as const;

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

  const circles = circleSegmentsWithColor(RADAR_COLORS.RED, "solid", [
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

  const lines: Segment2D[] = [
    ...lineSegmentsWithColor(RADAR_COLORS.RED, "solid", [
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
    ]),
    ...lineSegmentsWithColor(RADAR_COLORS.DARK_RED, "dashed", [
      // horizontal
      {
        x0: a(0.75).x,
        y0: a(1.76).y,
        x1: b(1.75).x,
        y1: b(1.76).y,
      },
      {
        x0: a(0.79).x,
        y0: a(0.8).y,
        x1: b(1.79).x,
        y1: b(0.8).y,
      },
      // vertical
      {
        x0: a(1.75).x,
        y0: a(0.75).y,
        x1: b(1.6).x,
        y1: b(1.6).y,
      },
      {
        x0: a(0.75).x,
        y0: a(0.75).y,
        x1: b(0.6).x,
        y1: b(1.6).y,
      },
    ]),
  ];

  return {
    circles,
    lines,
  };
}
