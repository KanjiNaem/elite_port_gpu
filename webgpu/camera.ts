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
  return mat4.lookAt(eye, target, [...AXIS_Y]);
}

/** Creates view matrix from yaw (radians) around Y, camera at origin looking forward. */
export function createViewFromYaw(
  yawRad: number,
  distance = 5,
): Float32Array {
  const target: [number, number, number] = [
    distance * Math.sin(yawRad),
    0,
    -distance * Math.cos(yawRad),
  ];
  return createView([0, 0, 0], target);
}
