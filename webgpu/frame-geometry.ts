export type CockpitLayout = {
  width: number;
  height: number;
  insetX: number;
  insetY: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  w: (f: number) => number;
  h: (f: number) => number;
};

/** Pure geometry for the forward HUD radar ellipse (no canvas — see `radar-internals`). */
export type RadarLayout = {
  ribY: number;
  margin: number;
  top: number;
  usableBottom: number;
  radarHeight: number;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  width: number;
  height: number;
};

export type Segment2D = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  lineType?: "solid" | "dashed";
  color?: string;
};

export type CircleSegment2D = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  lineType?: "solid" | "dashed";
  color?: string;
};

export const dash = Math.max(3, 4); // [dash len, gap len]
export const DEFAULT_FRAME_STROKE = "#FFB000";

export function lineSegmentsWithColor(
  color: string,
  lineType: "solid" | "dashed",
  segments: Array<{ x0: number; y0: number; x1: number; y1: number }>,
): Segment2D[] {
  return segments.map((s) => ({ ...s, lineType, color }));
}

/** @deprecated Use `lineSegmentsWithColor` */
export const segmentsWithColor = lineSegmentsWithColor;

export function circleSegmentsWithColor(
  color: string,
  lineType: "solid" | "dashed",
  segments: Array<{
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
  }>,
): CircleSegment2D[] {
  return segments.map((s) => ({ ...s, lineType, color }));
}

export function createCockpitLayout(
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): CockpitLayout {
  const left = insetX;
  const right = width - insetX;
  const top = insetY;
  const bottom = height - insetY;
  const w = (f: number) => width * f;
  const h = (f: number) => height * f;
  return {
    width,
    height,
    insetX,
    insetY,
    left,
    right,
    top,
    bottom,
    w,
    h,
  };
}

export function strokeSegment(
  ctx: CanvasRenderingContext2D,
  s: Segment2D,
): void {
  ctx.beginPath();
  ctx.moveTo(s.x0, s.y0);
  ctx.lineTo(s.x1, s.y1);
  ctx.stroke();
}

export function strokeSegments(
  ctx: CanvasRenderingContext2D,
  segments: Segment2D[],
  defaultStrokeStyle: string = DEFAULT_FRAME_STROKE,
): void {
  for (const s of segments) {
    ctx.strokeStyle = s.color ?? defaultStrokeStyle;
    if (s.lineType === "dashed") {
      ctx.setLineDash([
        dash,
        dash,
      ]);
    } else {
      ctx.setLineDash([]);
    }
    strokeSegment(ctx, s);
  }
}

export function strokeCircleSegments(
  ctx: CanvasRenderingContext2D,
  segments: CircleSegment2D[],
  defaultStrokeStyle: string = DEFAULT_FRAME_STROKE,
): void {
  for (const s of segments) {
    ctx.strokeStyle = s.color ?? defaultStrokeStyle;
    if (s.lineType === "dashed") {
      ctx.setLineDash([
        dash,
        dash,
      ]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.radiusX, s.radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// concatenate named groups
export function flattenSegmentGroups(
  groups: Record<string, Segment2D[]>,
): Segment2D[] {
  return Object.values(groups).flat();
}
