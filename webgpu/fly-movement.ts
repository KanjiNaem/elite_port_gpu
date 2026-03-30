/**
 * Rudimentary exploration: WASD on the horizontal (XZ) plane relative to yaw only;
 * Space / Shift for world +Y / −Y. (Pre–camera-relative-look version.)
 */
export const FLY_MOVE_SPEED = 22;
export const FLY_VERTICAL_SPEED = 14;

export function flyMovementDelta(
  keys: ReadonlySet<string>,
  yawRad: number,
  deltaTime: number,
): [number, number, number] {
  const sinY = Math.sin(yawRad);
  const cosY = Math.cos(yawRad);
  const forwardX = sinY;
  const forwardZ = -cosY;
  const rightX = cosY;
  const rightZ = sinY;

  let mx = 0;
  let mz = 0;
  if (keys.has("w")) {
    mx += forwardX;
    mz += forwardZ;
  }
  if (keys.has("s")) {
    mx -= forwardX;
    mz -= forwardZ;
  }
  if (keys.has("d")) {
    mx += rightX;
    mz += rightZ;
  }
  if (keys.has("a")) {
    mx -= rightX;
    mz -= rightZ;
  }

  const hLen = Math.hypot(mx, mz);
  if (hLen > 1e-6) {
    mx = (mx / hLen) * FLY_MOVE_SPEED * deltaTime;
    mz = (mz / hLen) * FLY_MOVE_SPEED * deltaTime;
  } else {
    mx = 0;
    mz = 0;
  }

  let my = 0;
  if (keys.has(" ")) my += FLY_VERTICAL_SPEED * deltaTime;
  if (keys.has("shift")) my -= FLY_VERTICAL_SPEED * deltaTime;

  return [
    mx,
    my,
    mz,
  ];
}
