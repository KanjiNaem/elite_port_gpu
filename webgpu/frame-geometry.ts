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
  filled?: boolean;
  color?: string;
};

export type CircleSegment2D = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  lineType?: "solid" | "dashed";
  filled?: boolean;
  color?: string;
};

export const dash = Math.max(3, 4); // [dash len, gap len]
export const DEFAULT_FRAME_STROKE = "#FFB000";

export function lineSegmentsWithColor(
  color: string,
  lineType: "solid" | "dashed",
  segments: Array<{ x0: number; y0: number; x1: number; y1: number }>,
  filled?: boolean,
): Segment2D[] {
  return segments.map((s) => ({
    ...s,
    lineType,
    color,
    ...(filled ? { filled: true as const } : {}),
  }));
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
  filled?: boolean,
): CircleSegment2D[] {
  return segments.map((s) => ({
    ...s,
    lineType,
    color,
    ...(filled ? { filled: true as const } : {}),
  }));
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
  if (segments.length > 0 && segments.every((s) => s.filled)) {
    const c = segments[0].color ?? defaultStrokeStyle;
    ctx.fillStyle = c;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(segments[0].x0, segments[0].y0);
    for (const s of segments) {
      ctx.lineTo(s.x1, s.y1);
    }
    ctx.closePath();
    ctx.fill();
    return;
  }

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
    if (s.filled) {
      ctx.fillStyle = s.color ?? defaultStrokeStyle;
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }
}

// concatenate named groups
export function flattenSegmentGroups(
  groups: Record<string, Segment2D[]>,
): Segment2D[] {
  return Object.values(groups).flat();
}
