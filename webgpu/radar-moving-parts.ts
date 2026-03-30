import { vec3 } from "wgpu-matrix";
import type { RadarLayout } from "./frame-geometry";

// space pos
export type RadarContact = {
  world: [number, number, number];
  color: string;
};

/**
 * World units (camera-relative axes used in {@link worldToRadarCanvas}): a contact
 * with |rel[0]| or |rel[2]| equal to this value sits on the radar ellipse border
 * before clamping (pure +X / +Z in view space).
 */
export const RADAR_WORLD_RANGE = 200;

export const RADAR_MAX_RANGE_XZ = RADAR_WORLD_RANGE;
/** Stick height: same scale as horizontal plane so vertical offsets match range feel. */
export const RADAR_MAX_RANGE_Y = RADAR_WORLD_RANGE;

// ellipse interior clamp
export function clampPointToEllipse(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): { x: number; y: number } {
  const dx = px - cx;
  const dy = py - cy;
  const denom = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
  if (denom <= 1) {
    return {
      x: px,
      y: py,
    };
  }
  const t = 1 / Math.sqrt(denom);
  return {
    x: cx + dx * t,
    y: cy + dy * t,
  };
}

export type RadarCanvasProjection = {
  baseX: number;
  baseY: number;
  dotX: number;
  dotY: number;
};

// player relative pos in camera space
export function worldToRadarCanvas(
  layout: RadarLayout,
  view: Float32Array,
  world: [number, number, number],
): RadarCanvasProjection {
  const rel = vec3.transformMat4(world, view);

  const { centerX, centerY, radiusX, radiusY } = layout;
  const scaleX = radiusX / RADAR_MAX_RANGE_XZ;
  const scaleZ = radiusY / RADAR_MAX_RANGE_XZ;
  const scaleY = radiusY / RADAR_MAX_RANGE_Y;

  let baseX = centerX + scaleX * rel[0];
  let baseY = centerY + scaleZ * rel[2];

  const clamped = clampPointToEllipse(
    baseX,
    baseY,
    centerX,
    centerY,
    radiusX,
    radiusY,
  );
  baseX = clamped.x;
  baseY = clamped.y;

  const dotX = baseX;
  const dotY = baseY - scaleY * rel[1];

  return {
    baseX,
    baseY,
    dotX,
    dotY,
  };
}
