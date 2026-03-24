export function drawFrameRight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  insetX: number,
  insetY: number,
): void {
  // TODO: draw ship right frame
  const left = insetX;
  const right = width - insetX;
  const top = insetY;
  const bottom = height - insetY;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.lineTo(right, bottom);
  ctx.lineTo(left, bottom);
  ctx.stroke();
}
