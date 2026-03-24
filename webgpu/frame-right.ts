export function drawFrameRight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  const left = insetX;
  const right = width - insetX;
  const top = insetY;
  const bottom = height - insetY;

  const w = (f: number) => width * f;
  const h = (f: number) => height * f;

  // top (mirror of left frame)
  ctx.beginPath();
  ctx.moveTo(left, top + h(0.1));
  ctx.lineTo(right - w(0.5), top + h(0.05));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left, top + h(0.08));
  ctx.lineTo(right - w(0.55), top + h(0.035));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.55), top + h(0.035));
  ctx.lineTo(right - w(0.59), top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.5), top + h(0.05));
  ctx.lineTo(right - w(0.2), top + h(0.25));
  ctx.stroke();

  // middle left (mirror of left's middle right)
  ctx.beginPath();
  ctx.moveTo(left, top + h(0.37));
  ctx.lineTo(left + w(0.185), bottom - h(0.23));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left, top + h(0.4));
  ctx.lineTo(left + w(0.14), bottom - h(0.29));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.14), bottom - h(0.29));
  ctx.lineTo(left + w(0.1), bottom - h(0.11));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.1), bottom - h(0.11));
  ctx.lineTo(left, bottom - h(0.125));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.46), top);
  ctx.lineTo(right - w(0.19), top + h(0.24));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.14), bottom - h(0.2));
  ctx.lineTo(left + w(0.115), bottom - h(0.09));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.115), bottom - h(0.09));
  ctx.lineTo(left, bottom - h(0.11));
  ctx.stroke();
  // middle right (mirror of left's middle left)
  ctx.beginPath();
  ctx.moveTo(right - w(0.25), bottom - h(0.3));
  ctx.lineTo(right - w(0.2), top + h(0.25));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.19), top + h(0.24));
  ctx.lineTo(right - w(0.242), bottom - h(0.275));
  ctx.stroke();

  // bottom
  ctx.beginPath();
  ctx.moveTo(left + w(0.185), bottom - h(0.23));
  ctx.lineTo(right - w(0.25), bottom - h(0.3));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.242), bottom - h(0.275));
  ctx.lineTo(left + w(0.14), bottom - h(0.2));
  ctx.stroke();
}
