import { mat4 } from "wgpu-matrix";
import { AXIS_X, AXIS_Y, AXIS_Z } from "./coord";

export function createProjection(
  fovYRadians: number,
  aspect: number,
  near: number,
  far: number,
): Float32Array {
  return mat4.perspective(fovYRadians, aspect, near, far);
}

export function createView(
  eye: [number, number, number],
  target: [number, number, number],
): Float32Array {
  return mat4.lookAt(eye, target, [
    ...AXIS_Y,
  ]);
}
