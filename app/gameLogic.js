export function createPipe(x, random = Math.random) {
  const gapTop = 125 + random() * 315;
  return { x, gapTop, scored: false };
}

export function collidesWithPipe(playerBox, pipe, settings) {
  const overlapsX = playerBox.x + playerBox.width > pipe.x
    && playerBox.x < pipe.x + settings.pipeWidth;
  const gapBottom = pipe.gapTop + settings.gap;
  return overlapsX && (playerBox.y < pipe.gapTop || playerBox.y + playerBox.height > gapBottom);
}