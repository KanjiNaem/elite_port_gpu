/** Y of the lowest forward-view horizontal rib (closest to screen bottom); UI below the frame should start under this. */
export function getForwardFrameBottomRibY(
  height: number,
  insetY: number,
): number {
  const bottom = height - insetY;
  return bottom - height * 0.185;
}

// proportional coords so frame scales correctly on resize/ fullscreen
export function drawFrameForward(
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

  const h = (f: number) => height * f;
  const w = (f: number) => width * f;

  // lower cockpit frame
  // left side
  ctx.beginPath();
  ctx.moveTo(left, bottom - h(0.139));
  ctx.lineTo(left + w(0.26), bottom - h(0.185));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left, bottom - h(0.148));
  ctx.lineTo(left + w(0.25), bottom - h(0.193));
  ctx.stroke();
  // right side
  ctx.beginPath();
  ctx.moveTo(right - w(0.26), bottom - h(0.185));
  ctx.lineTo(right, bottom - h(0.139));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.25), bottom - h(0.193));
  ctx.lineTo(right, bottom - h(0.148));
  ctx.stroke();
  // center
  ctx.beginPath();
  ctx.moveTo(left + w(0.26), bottom - h(0.185));
  ctx.lineTo(right - w(0.26), bottom - h(0.185));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.26), bottom - h(0.194));
  ctx.lineTo(right - w(0.26), bottom - h(0.194));
  ctx.stroke();

  // middle cockpit frame
  // left lower
  ctx.beginPath();
  ctx.moveTo(left + w(0.25), bottom - h(0.193));
  ctx.lineTo(left + w(0.117), top + h(0.318));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.26), bottom - h(0.193));
  ctx.lineTo(left + w(0.115), top + h(0.278));
  ctx.stroke();
  //left->right upper
  ctx.beginPath();
  ctx.moveTo(left + w(0.115), top + h(0.278));
  ctx.lineTo(left + w(0.27), top + h(0.228));
  ctx.stroke();
  //left->left upper
  ctx.beginPath();
  ctx.moveTo(left + w(0.117), top + h(0.318));
  ctx.lineTo(left + w(0.07), top + h(0.288));
  ctx.stroke();
  // right lower
  ctx.beginPath();
  ctx.moveTo(right - w(0.25), bottom - h(0.193));
  ctx.lineTo(right - w(0.117), top + h(0.318));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(right - w(0.26), bottom - h(0.193));
  ctx.lineTo(right - w(0.115), top + h(0.278));
  ctx.stroke();
  // right->left upper
  ctx.beginPath();
  ctx.moveTo(right - w(0.115), top + h(0.278));
  ctx.lineTo(right - w(0.27), top + h(0.228));
  ctx.stroke();
  //right->right upper
  ctx.beginPath();
  ctx.moveTo(right - w(0.117), top + h(0.318));
  ctx.lineTo(right - w(0.07), top + h(0.288));
  ctx.stroke();

  // top cockpit frame
  ctx.beginPath();
  ctx.moveTo(left + w(0.27), top + h(0.228));
  ctx.lineTo(right - w(0.27), top + h(0.228));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(left + w(0.27), top + h(0.215));
  ctx.lineTo(right - w(0.27), top + h(0.215));
  ctx.stroke();
  // top middle left
  ctx.beginPath();
  ctx.moveTo(left + w(0.27), top + h(0.215));
  ctx.lineTo(left + w(0.107), top + h(0.248));
  ctx.stroke();
  // top middle right
  ctx.beginPath();
  ctx.moveTo(right - w(0.27), top + h(0.215));
  ctx.lineTo(right - w(0.107), top + h(0.248));
  ctx.stroke();
  // top left->left up
  ctx.beginPath();
  ctx.moveTo(left + w(0.107), top + h(0.248));
  ctx.lineTo(left, top + h(0.1));
  ctx.stroke();
  // top right->right up
  ctx.beginPath();
  ctx.moveTo(right - w(0.107), top + h(0.248));
  ctx.lineTo(right, top + h(0.1));
  ctx.stroke();
  // top left->left down
  ctx.beginPath();
  ctx.moveTo(left + w(0.07), top + h(0.288));
  ctx.lineTo(left, top + h(0.33));
  ctx.stroke();
  // top right->right down
  ctx.beginPath();
  ctx.moveTo(right - w(0.07), top + h(0.288));
  ctx.lineTo(right, top + h(0.33));
  ctx.stroke();
  // top left trapezoid c
  ctx.beginPath();
  ctx.moveTo(left + w(0.06), top + h(0.21));
  ctx.lineTo(left + w(0.055), top + h(0.27));
  ctx.stroke();
  // top left trapezoid d
  ctx.beginPath();
  ctx.moveTo(left + w(0.06), top + h(0.21));
  ctx.lineTo(left, top + h(0.13));
  ctx.stroke();
  // top left trapezoid b
  ctx.beginPath();
  ctx.moveTo(left + w(0.055), top + h(0.27));
  ctx.lineTo(left, top + h(0.305));
  ctx.stroke();
  // top right trapezoid c
  ctx.beginPath();
  ctx.moveTo(right - w(0.06), top + h(0.21));
  ctx.lineTo(right - w(0.055), top + h(0.27));
  ctx.stroke();
  // top right trapezoid d
  ctx.beginPath();
  ctx.moveTo(right - w(0.06), top + h(0.21));
  ctx.lineTo(right, top + h(0.13));
  ctx.stroke();
  // top right trapezoid b
  ctx.beginPath();
  ctx.moveTo(right - w(0.055), top + h(0.27));
  ctx.lineTo(right, top + h(0.305));
  ctx.stroke();
}
