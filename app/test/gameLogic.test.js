import assert from 'node:assert/strict';
import test from 'node:test';
import { collidesWithPipe, createPipe } from '../gameLogic.js';

const settings = { pipeWidth: 92, gap: 235 };

test('createPipe creates an unscored pipe with a bounded gap', () => {
  const pipe = createPipe(760, () => 0.5);

  assert.deepEqual(pipe, { x: 760, gapTop: 282.5, scored: false });
});

test('createPipe supports the minimum and maximum gap positions', () => {
  assert.equal(createPipe(760, () => 0).gapTop, 125);
  assert.equal(createPipe(760, () => 1).gapTop, 440);
});

test('collidesWithPipe detects hits outside the gap', () => {
  const pipe = { x: 200, gapTop: 200 };

  assert.equal(collidesWithPipe({ x: 210, y: 100, width: 50, height: 50 }, pipe, settings), true);
  assert.equal(collidesWithPipe({ x: 210, y: 250, width: 50, height: 50 }, pipe, settings), false);
});

test('collidesWithPipe ignores pipes without horizontal overlap', () => {
  const pipe = { x: 200, gapTop: 200 };

  assert.equal(collidesWithPipe({ x: 100, y: 100, width: 50, height: 50 }, pipe, settings), false);
});

test('collidesWithPipe treats the gap boundaries as safe', () => {
  const pipe = { x: 200, gapTop: 200 };
  const gapBottom = pipe.gapTop + settings.gap;

  assert.equal(collidesWithPipe({ x: 210, y: pipe.gapTop, width: 50, height: 50 }, pipe, settings), false);
  assert.equal(collidesWithPipe({ x: 210, y: gapBottom - 50, width: 50, height: 50 }, pipe, settings), false);
});

test('collidesWithPipe ignores objects touching but not crossing a pipe edge', () => {
  const pipe = { x: 200, gapTop: 200 };

  assert.equal(collidesWithPipe({ x: 150, y: 100, width: 50, height: 50 }, pipe, settings), false);
  assert.equal(collidesWithPipe({ x: 292, y: 100, width: 50, height: 50 }, pipe, settings), false);
});


