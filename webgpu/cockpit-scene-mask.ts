import { createCockpitLayout, type CockpitLayout } from "./frame-geometry";
const MASK_BLACK = "#000000";

export function forwardMaskHolePolygons(
  layout: CockpitLayout,
): [number, number][][] {
  const { left: L, right: R, top: T, bottom: B, w, h } = layout;

  const main: [number, number][] = [
    [
      L + w(0.26),
      B - h(0.194),
    ],
    [
      R - w(0.26),
      B - h(0.194),
    ],
    [
      R - w(0.26),
      B - h(0.193),
    ],
    [
      R - w(0.115),
      T + h(0.278),
    ],
    [
      R - w(0.27),
      T + h(0.228),
    ],
    [
      L + w(0.27),
      T + h(0.228),
    ],
    [
      L + w(0.115),
      T + h(0.278),
    ],
    [
      L + w(0.26),
      B - h(0.193),
    ],
  ];

  const leftMiddle: [number, number][] = [
    [
      L,
      T + h(0.33),
    ],
    [
      L + w(0.07),
      T + h(0.288),
    ],
    [
      L + w(0.117),
      T + h(0.318),
    ],
    [
      L + w(0.25),
      B - h(0.193),
    ],
    [
      L,
      B - h(0.148),
    ],
  ];

  const rightMiddle: [number, number][] = [
    [
      R,
      T + h(0.33),
    ],
    [
      R - w(0.07),
      T + h(0.288),
    ],
    [
      R - w(0.117),
      T + h(0.318),
    ],
    [
      R - w(0.25),
      B - h(0.193),
    ],
    [
      R,
      B - h(0.148),
    ],
  ];

  const middleTop: [number, number][] = [
    [
      L,
      T,
    ],
    [
      R,
      T,
    ],
    [
      R,
      T + h(0.1),
    ],
    [
      R - w(0.107),
      T + h(0.248),
    ],
    [
      R - w(0.27),
      T + h(0.215),
    ],
    [
      L + w(0.27),
      T + h(0.215),
    ],
    [
      L + w(0.107),
      T + h(0.248),
    ],
    [
      L,
      T + h(0.1),
    ],
  ];

  const leftTop: [number, number][] = [
    [
      L,
      T,
    ],
    [
      L,
      T + h(0.305),
    ],
    [
      L + w(0.055),
      T + h(0.27),
    ],
    [
      L + w(0.06),
      T + h(0.21),
    ],
    [
      L,
      T + h(0.13),
    ],
  ];

  const rightTop: [number, number][] = [
    [
      R,
      T,
    ],
    [
      R,
      T + h(0.13),
    ],
    [
      R - w(0.06),
      T + h(0.21),
    ],
    [
      R - w(0.055),
      T + h(0.27),
    ],
    [
      R,
      T + h(0.305),
    ],
  ];

  return [
    main,
    leftMiddle,
    rightMiddle,
    middleTop,
    leftTop,
    rightTop,
  ];
}

export function leftMaskHolePolygons(
  layout: CockpitLayout,
): [number, number][][] {
  const { left: L, right: R, top: T, bottom: B, w, h } = layout;

  const main: [number, number][] = [
    [
      L + w(0.5),
      T + h(0.05),
    ],
    [
      L + w(0.2),
      T + h(0.25),
    ],
    [
      L + w(0.25),
      B - h(0.3),
    ],
    [
      R - w(0.185),
      B - h(0.23),
    ],
    [
      R,
      T + h(0.37),
    ],
    [
      R,
      T + h(0.1),
    ],
  ];

  const rightBottom: [number, number][] = [
    [
      R,
      T + h(0.4),
    ],
    [
      R,
      B - h(0.125),
    ],
    [
      R - w(0.1),
      B - h(0.11),
    ],
    [
      R - w(0.14),
      B - h(0.29),
    ],
  ];

  const rightTop: [number, number][] = [
    [
      L,
      T,
    ],
    [
      R,
      T,
    ],
    [
      R,
      T + h(0.08),
    ],
    [
      L + w(0.55),
      T + h(0.035),
    ],
    [
      L + w(0.59),
      T,
    ],
  ];

  return [
    main,
    rightBottom,
    rightTop,
  ];
}

export function rightMaskHolePolygons(
  layout: CockpitLayout,
): [number, number][][] {
  const { left: L, right: R, top: T, bottom: B, w, h } = layout;

  const main: [number, number][] = [
    [
      R - w(0.5),
      T + h(0.05),
    ],
    [
      R - w(0.2),
      T + h(0.25),
    ],
    [
      R - w(0.25),
      B - h(0.3),
    ],
    [
      L + w(0.185),
      B - h(0.23),
    ],
    [
      L,
      T + h(0.37),
    ],
    [
      L,
      T + h(0.1),
    ],
  ];

  const leftBottom: [number, number][] = [
    [
      L,
      T + h(0.4),
    ],
    [
      L,
      B - h(0.125),
    ],
    [
      L + w(0.1),
      B - h(0.11),
    ],
    [
      L + w(0.14),
      B - h(0.29),
    ],
  ];

  const leftTop: [number, number][] = [
    [
      R,
      T,
    ],
    [
      L,
      T,
    ],
    [
      L,
      T + h(0.08),
    ],
    [
      R - w(0.55),
      T + h(0.035),
    ],
    [
      R - w(0.59),
      T,
    ],
  ];

  return [
    main,
    leftBottom,
    leftTop,
  ];
}

export function cutoutForwardWindow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  const layout = createCockpitLayout(width, height, insetX, insetY);
  const holes = forwardMaskHolePolygons(layout);

  ctx.fillStyle = MASK_BLACK;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#ffffff";
  for (const pts of holes) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function cutoutLeftWindow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  const layout = createCockpitLayout(width, height, insetX, insetY);
  const holes = leftMaskHolePolygons(layout);

  ctx.fillStyle = MASK_BLACK;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#ffffff";
  for (const pts of holes) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function cutoutRightWindow(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  const layout = createCockpitLayout(width, height, insetX, insetY);
  const holes = rightMaskHolePolygons(layout);

  ctx.fillStyle = MASK_BLACK;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#ffffff";
  for (const pts of holes) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}
