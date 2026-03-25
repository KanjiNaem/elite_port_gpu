/**
 * Shared cockpit frame layout (proportional w/h) and 2D segment drawing.
 */

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

export type Segment2D = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** When set, this segment is stroked in this color; otherwise see `DEFAULT_FRAME_STROKE`. */
  color?: string;
};

/** DESIGN §1.4 cockpit UI; used when a segment omits `color`. */
export const DEFAULT_FRAME_STROKE = "#FFB000";

/** Attach the same `color` to every segment in a group (e.g. `lowerRib`). */
export function segmentsWithColor(
  color: string,
  segments: Array<{ x0: number; y0: number; x1: number; y1: number }>,
): Segment2D[] {
  return segments.map((s) => ({ ...s, color }));
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

export function seg(x0: number, y0: number, x1: number, y1: number): Segment2D {
  return { x0, y0, x1, y1 };
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

// draw line segments
export function strokeSegments(
  ctx: CanvasRenderingContext2D,
  segments: Segment2D[],
  defaultStrokeStyle: string = DEFAULT_FRAME_STROKE,
): void {
  for (const s of segments) {
    ctx.strokeStyle = s.color ?? defaultStrokeStyle;
    strokeSegment(ctx, s);
  }
}

// concatenate named groups
export function flattenSegmentGroups(
  groups: Record<string, Segment2D[]>,
): Segment2D[] {
  return Object.values(groups).flat();
}
