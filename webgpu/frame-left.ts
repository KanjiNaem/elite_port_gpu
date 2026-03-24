export function drawFrameLeft(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  // TODO: draw left ship frame
  const left = insetX;
  const right = width - insetX;
  const top = insetY;
  const bottom = height - insetY;

  const w = (f: number) => width * f;
  const h = (f: number) => height * f;

  //top
  ctx.beginPath();
  ctx.moveTo(right, top + h(0.1));
  ctx.lineTo(left + w(0.5), top + h(0.05));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right, top + h(0.08));
  ctx.lineTo(left + w(0.55), top + h(0.035));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.55), top + h(0.035));
  ctx.lineTo(left + w(0.59), top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.5), top + h(0.05));
  ctx.lineTo(left + w(0.2), top + h(0.25));
  ctx.stroke();

  // middle right
  ctx.beginPath();
  ctx.moveTo(right, top + h(0.37));
  ctx.lineTo(right - w(0.185), bottom - h(0.23));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right, top + h(0.4));
  ctx.lineTo(right - w(0.14), bottom - h(0.29));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.14), bottom - h(0.29));
  ctx.lineTo(right - w(0.1), bottom - h(0.11));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.1), bottom - h(0.11));
  ctx.lineTo(right, bottom - h(0.125));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.46), top);
  ctx.lineTo(left + w(0.19), top + h(0.24));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.14), bottom - h(0.2));
  ctx.lineTo(right - w(0.115), bottom - h(0.09));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.115), bottom - h(0.09));
  ctx.lineTo(right, bottom - h(0.11));
  ctx.stroke();
  // middle left
  ctx.beginPath();
  ctx.moveTo(left + w(0.25), bottom - h(0.3));
  ctx.lineTo(left + w(0.2), top + h(0.25));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.19), top + h(0.24));
  ctx.lineTo(left + w(0.242), bottom - h(0.275));
  ctx.stroke();

  //bottom
  ctx.beginPath();
  ctx.moveTo(right - w(0.185), bottom - h(0.23));
  ctx.lineTo(left + w(0.25), bottom - h(0.3));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.242), bottom - h(0.275));
  ctx.lineTo(right - w(0.14), bottom - h(0.2));
  ctx.stroke();
}

// // top left trapezoid c
// ctx.beginPath();
// ctx.moveTo(left + w(0.06), top + h(0.21));
// ctx.lineTo(left + w(0.055), top + h(0.27));
// ctx.stroke();
// // top left trapezoid d
// ctx.beginPath();
// ctx.moveTo(left + w(0.06), top + h(0.21));
// ctx.lineTo(left, top + h(0.13));
// ctx.stroke();
// // top left trapezoid b
// ctx.beginPath();
// ctx.moveTo(left + w(0.055), top + h(0.27));
// ctx.lineTo(left, top + h(0.305));
// ctx.stroke();
// // top right trapezoid c
// ctx.beginPath();
// ctx.moveTo(right - w(0.06), top + h(0.21));
// ctx.lineTo(right - w(0.055), top + h(0.27));
// ctx.stroke();
// // top right trapezoid d
// ctx.beginPath();
// ctx.moveTo(right - w(0.06), top + h(0.21));
// ctx.lineTo(right, top + h(0.13));
// ctx.stroke();
// // top right trapezoid b
// ctx.beginPath();
// ctx.moveTo(right - w(0.055), top + h(0.27));
// ctx.lineTo(right,
