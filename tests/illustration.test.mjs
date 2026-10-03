import test from 'node:test';
import assert from 'node:assert/strict';
import { weightedExample, profile } from '../src/lib/illustration.mjs';
test('Worked explanation matches displayed score and contributions', () => {
  const r = weightedExample(profile, [3, 2, 1]);
  assert.equal(r.score, 70);
  assert.deepEqual(r.contributions, [45, 20, 5]);
});
test('Multiplying every priority preserves the result', () => {
  assert.deepEqual(
    weightedExample(profile, [6, 4, 2]),
    weightedExample(profile, [3, 2, 1]),
  );
});
test('A zero-priority brief has no score', () => {
  assert.equal(weightedExample(profile, [0, 0, 0]).score, null);
});
test('Weight on one dimension selects that percentile', () => {
  assert.equal(weightedExample(profile, [0, 1, 0]).score, 60);
});
test('Invalid vectors and priorities are rejected', () => {
  for (const [values, weights] of [
    [[90], [1, 2]],
    [[101], [1]],
    [[50], [-1]],
    [[50], [NaN]],
  ])
    assert.throws(() => weightedExample(values, weights));
});
test('Scores stay within the selected percentile bounds', () => {
  for (let a = 0; a <= 5; a++)
    for (let b = 0; b <= 5; b++)
      for (let c = 0; c <= 5; c++) {
        const r = weightedExample(profile, [a, b, c]);
        if (r.score !== null)
          assert.ok(r.score >= 30 - 1e-9 && r.score <= 90 + 1e-9);
      }
});
