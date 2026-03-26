export type Vec3 = [number, number, number];

export type MovingSphere = {
  color: Float32Array;
  position: (t: number) => Vec3;
};

const ORIGIN: Vec3 = [
  0,
  0,
  0,
];

function add(a: Vec3, b: Vec3): Vec3 {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2],
  ];
}

export function vec3(x: number, y: number, z: number): Vec3 {
  return [
    x,
    y,
    z,
  ];
}

// --- movement patterns: local motion + optional `center` in world space ---

export function orbitHorizontal(params: {
  radius: number;
  angularSpeed: number;
  center?: Vec3;
}): (t: number) => Vec3 {
  const { radius, angularSpeed, center = ORIGIN } = params;
  return (t) => {
    const w = t * angularSpeed;
    const local: Vec3 = [
      radius * Math.cos(w),
      0,
      radius * Math.sin(w),
    ];
    return add(center, local);
  };
}

export function wobbleXZ(params: {
  amplitudeX: number;
  speed: number;
  center?: Vec3;
}): (t: number) => Vec3 {
  const { amplitudeX, speed, center = ORIGIN } = params;
  return (t) => {
    const local: Vec3 = [
      amplitudeX * Math.sin(t * speed),
      0,
      0,
    ];
    return add(center, local);
  };
}

export function lissajous3D(params: {
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  center?: Vec3;
}): (t: number) => Vec3 {
  const { ax, ay, fx, fy, center = ORIGIN } = params;
  return (t) => {
    const local: Vec3 = [
      ax * Math.sin(t * fx),
      ay * Math.sin(t * fy),
      0,
    ];
    return add(center, local);
  };
}

export function bounceDrift(params: {
  xAmp: number;
  xSpeed: number;
  yAmp: number;
  ySpeed: number;
  zAmp: number;
  zSpeed: number;
  center?: Vec3;
}): (t: number) => Vec3 {
  const { xAmp, xSpeed, yAmp, ySpeed, zAmp, zSpeed, center = ORIGIN } = params;
  return (t) => {
    const local: Vec3 = [
      xAmp * Math.sin(t * xSpeed),
      yAmp * Math.sin(t * ySpeed),
      zAmp * Math.cos(t * zSpeed),
    ];
    return add(center, local);
  };
}

export const MOVING_SPHERES: MovingSphere[] = [
  {
    color: new Float32Array([
      1,
      0,
      0,
      1,
    ]),
    position: wobbleXZ({
      amplitudeX: 10,
      speed: 0.7,
      center: vec3(0, 15, 30),
    }),
  },
  {
    color: new Float32Array([
      0,
      1,
      0,
      1,
    ]),
    position: wobbleXZ({
      amplitudeX: 10,
      speed: 0.7,
      center: vec3(0, 5, 20),
    }),
  },
  {
    color: new Float32Array([
      1,
      1,
      1,
      1,
    ]),
    position: orbitHorizontal({
      radius: 90,
      angularSpeed: 0.05,
      center: vec3(0, 20, 0),
    }),
  },
  {
    color: new Float32Array([
      1,
      1,
      0,
      1,
    ]),
    position: orbitHorizontal({
      radius: 10,
      angularSpeed: 1,
      center: vec3(0, 40, 15),
    }),
  },
  {
    color: new Float32Array([
      1,
      0.55,
      0.1,
      1,
    ]),
    position: orbitHorizontal({
      radius: 5.5,
      angularSpeed: 0.7,
      center: vec3(0, -25, -20),
    }),
  },
  {
    color: new Float32Array([
      0.2,
      1,
      0.45,
      1,
    ]),
    position: wobbleXZ({
      amplitudeX: 7,
      speed: 0.55,
      center: vec3(0, 0.25, -21.5),
    }),
  },
  {
    color: new Float32Array([
      0.45,
      0.65,
      1,
      1,
    ]),
    position: lissajous3D({
      ax: 4,
      ay: 2.5,
      fx: 0.9 * 2,
      fy: 0.9 * 3,
      center: vec3(0, -10, -18.5),
    }),
  },
  {
    color: new Float32Array([
      1,
      0.35,
      0.85,
      1,
    ]),
    position: bounceDrift({
      xAmp: 3.5,
      xSpeed: 0.12,
      yAmp: 1.8,
      ySpeed: 1.4,
      zAmp: 3,
      zSpeed: 0.25,
      center: vec3(0, 0, -22),
    }),
  },
];

/** World positions for every sphere at time `t` (seconds). */
export function sphereWorldPositionsAt(t: number): Vec3[] {
  return MOVING_SPHERES.map((s) => s.position(t));
}
