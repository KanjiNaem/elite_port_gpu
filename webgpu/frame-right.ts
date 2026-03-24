import {
  type CockpitLayout,
  createCockpitLayout,
  flattenSegmentGroups,
  segmentsWithColor,
  type Segment2D,
  strokeSegments,
} from "./frame-geometry";

const R = {
  amber: "#FFB000",
  // rightMainWindowCol: "#FF00FF", // magenta
  // rightLeftBottomWindowCol: "#00FF00", // green
  // rightLeftTopWindowCol: "#FFFF00", // yellow
  // rightFrameSegInsideCol: "#FFFFFF", // white
} as const;

export function rightFrameSegmentGroups(
  layout: CockpitLayout,
): Record<string, Segment2D[]> {
  const { left, right, top, bottom, w, h } = layout;

  return {
    rightMainWindow: segmentsWithColor(R.amber, [
      {
        x0: left,
        y0: top + h(0.1),
        x1: right - w(0.5),
        y1: top + h(0.05),
      },
      {
        x0: left + w(0.185),
        y0: bottom - h(0.23),
        x1: right - w(0.25),
        y1: bottom - h(0.3),
      },
      {
        x0: right - w(0.25),
        y0: bottom - h(0.3),
        x1: right - w(0.2),
        y1: top + h(0.25),
      },
      {
        x0: left,
        y0: top + h(0.37),
        x1: left + w(0.185),
        y1: bottom - h(0.23),
      },
      {
        x0: right - w(0.5),
        y0: top + h(0.05),
        x1: right - w(0.2),
        y1: top + h(0.25),
      },
    ]),
    rightLeftBottomWindow: segmentsWithColor(R.amber, [
      {
        x0: left + w(0.14),
        y0: bottom - h(0.29),
        x1: left + w(0.1),
        y1: bottom - h(0.11),
      },
      {
        x0: left + w(0.1),
        y0: bottom - h(0.11),
        x1: left,
        y1: bottom - h(0.125),
      },
      {
        x0: left,
        y0: top + h(0.4),
        x1: left + w(0.14),
        y1: bottom - h(0.29),
      },
    ]),
    rightLeftTopWindow: segmentsWithColor(R.amber, [
      {
        x0: left,
        y0: top + h(0.08),
        x1: right - w(0.55),
        y1: top + h(0.035),
      },
      {
        x0: right - w(0.55),
        y0: top + h(0.035),
        x1: right - w(0.59),
        y1: top,
      },
    ]),
    rightFrameSegInside: segmentsWithColor(R.amber, [
      {
        x0: right - w(0.242),
        y0: bottom - h(0.275),
        x1: left + w(0.14),
        y1: bottom - h(0.2),
      },
      {
        x0: right - w(0.19),
        y0: top + h(0.24),
        x1: right - w(0.242),
        y1: bottom - h(0.275),
      },
      {
        x0: left + w(0.46),
        y0: top,
        x1: right - w(0.19),
        y1: top + h(0.24),
      },
      {
        x0: left + w(0.14),
        y0: bottom - h(0.2),
        x1: left + w(0.115),
        y1: bottom - h(0.09),
      },
      {
        x0: left + w(0.115),
        y0: bottom - h(0.09),
        x1: left,
        y1: bottom - h(0.11),
      },
    ]),
  };
}

export function rightFrameSegments(layout: CockpitLayout): Segment2D[] {
  return flattenSegmentGroups(rightFrameSegmentGroups(layout));
}

export function drawFrameRight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  const layout = createCockpitLayout(width, height, insetX, insetY);
  strokeSegments(ctx, rightFrameSegments(layout));
}
