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
  ctx.beginPath();
  ctx.moveTo(right, top);
  ctx.lineTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);

  ctx.stroke();
}
