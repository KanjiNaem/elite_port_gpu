import {
  type CockpitLayout,
  createCockpitLayout,
  flattenSegmentGroups,
  lineSegmentsWithColor,
  type Segment2D,
  strokeSegments,
} from "./frame-geometry";

const FWD = {
  amber: "#FFB000",
  // centerMainWindowCol: "#FF0000", // red
  // centerRightMiddleWindowCol: "#00FF00", // green
  // centerLeftMiddleWindowCol: "#0000FF", // blue
  // centerMiddleTopWindowCol: "#FFFF00", // yellow
  // centerRightTopWindowCol: "#FF00FF", // magenta
  // centerLeftTopWindowCol: "#00FFFF", // cyan
  // centerMiddleBottomInsideCol: "#FFFFFF", // white
} as const;

export function getForwardFrameBottomRibY(
  height: number,
  insetY: number,
): number {
  const bottom = height - insetY;
  return bottom - height * 0.185;
}

export function forwardFrameSegmentGroups(
  layout: CockpitLayout,
): Record<string, Segment2D[]> {
  const { left, right, top, bottom, w, h } = layout;

  return {
    centerMainWindow: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: right - w(0.26),
        y0: bottom - h(0.193),
        x1: right - w(0.115),
        y1: top + h(0.278),
      },
      {
        x0: right - w(0.115),
        y0: top + h(0.278),
        x1: right - w(0.27),
        y1: top + h(0.228),
      },
      {
        x0: left + w(0.27),
        y0: top + h(0.228),
        x1: right - w(0.27),
        y1: top + h(0.228),
      },
      {
        x0: left + w(0.26),
        y0: bottom - h(0.193),
        x1: left + w(0.115),
        y1: top + h(0.278),
      },
      {
        x0: left + w(0.115),
        y0: top + h(0.278),
        x1: left + w(0.27),
        y1: top + h(0.228),
      },
      {
        x0: left + w(0.26),
        y0: bottom - h(0.194),
        x1: right - w(0.26),
        y1: bottom - h(0.194),
      },
    ]),
    centerRightMiddleWindow: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: right - w(0.25),
        y0: bottom - h(0.193),
        x1: right - w(0.117),
        y1: top + h(0.318),
      },
      {
        x0: right - w(0.117),
        y0: top + h(0.318),
        x1: right - w(0.07),
        y1: top + h(0.288),
      },
      {
        x0: right - w(0.07),
        y0: top + h(0.288),
        x1: right,
        y1: top + h(0.33),
      },
      {
        x0: right - w(0.25),
        y0: bottom - h(0.193),
        x1: right,
        y1: bottom - h(0.148),
      },
    ]),
    centerLeftMiddleWindow: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: left,
        y0: bottom - h(0.148),
        x1: left + w(0.25),
        y1: bottom - h(0.193),
      },
      {
        x0: left + w(0.25),
        y0: bottom - h(0.193),
        x1: left + w(0.117),
        y1: top + h(0.318),
      },
      {
        x0: left + w(0.117),
        y0: top + h(0.318),
        x1: left + w(0.07),
        y1: top + h(0.288),
      },
      {
        x0: left + w(0.07),
        y0: top + h(0.288),
        x1: left,
        y1: top + h(0.33),
      },
    ]),
    centerMiddleTopWindow: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: left + w(0.27),
        y0: top + h(0.215),
        x1: right - w(0.27),
        y1: top + h(0.215),
      },
      {
        x0: left + w(0.27),
        y0: top + h(0.215),
        x1: left + w(0.107),
        y1: top + h(0.248),
      },
      {
        x0: right - w(0.27),
        y0: top + h(0.215),
        x1: right - w(0.107),
        y1: top + h(0.248),
      },
      {
        x0: left + w(0.107),
        y0: top + h(0.248),
        x1: left,
        y1: top + h(0.1),
      },
      {
        x0: right - w(0.107),
        y0: top + h(0.248),
        x1: right,
        y1: top + h(0.1),
      },
    ]),
    centerRightTopWindow: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: right - w(0.06),
        y0: top + h(0.21),
        x1: right - w(0.055),
        y1: top + h(0.27),
      },
      {
        x0: right - w(0.06),
        y0: top + h(0.21),
        x1: right,
        y1: top + h(0.13),
      },
      {
        x0: right - w(0.055),
        y0: top + h(0.27),
        x1: right,
        y1: top + h(0.305),
      },
    ]),
    centerLeftTopWindow: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: left + w(0.06),
        y0: top + h(0.21),
        x1: left + w(0.055),
        y1: top + h(0.27),
      },
      {
        x0: left + w(0.06),
        y0: top + h(0.21),
        x1: left,
        y1: top + h(0.13),
      },
      {
        x0: left + w(0.055),
        y0: top + h(0.27),
        x1: left,
        y1: top + h(0.305),
      },
    ]),
    centerMiddleBottomInside: lineSegmentsWithColor(FWD.amber, "solid", [
      {
        x0: left,
        y0: bottom - h(0.139),
        x1: left + w(0.26),
        y1: bottom - h(0.185),
      },
      {
        x0: left + w(0.26),
        y0: bottom - h(0.185),
        x1: right - w(0.26),
        y1: bottom - h(0.185),
      },
      {
        x0: right - w(0.26),
        y0: bottom - h(0.185),
        x1: right,
        y1: bottom - h(0.139),
      },
    ]),
  };
}

export function forwardFrameSegments(layout: CockpitLayout): Segment2D[] {
  return flattenSegmentGroups(forwardFrameSegmentGroups(layout));
}

export function drawFrameForward(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  const layout = createCockpitLayout(width, height, insetX, insetY);
  strokeSegments(ctx, forwardFrameSegments(layout));
}
