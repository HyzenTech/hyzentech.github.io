import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const data = JSON.parse(
  await readFile(
    new URL('../src/data/scrolly/recruitment-data.json', import.meta.url),
    'utf8',
  ),
);
test('The displayed population matches the verified frozen season', () => {
  assert.equal(data.points.length, 303);
  assert.equal(new Set(data.points.map((p) => p.id)).size, 303);
  assert.equal(
    new Set(data.points.map((p) => p.id.split(':statsbomb:team:')[0])).size,
    295,
  );
  assert.equal(data.points.filter((p) => p.eligible).length, 139);
  for (const [group, count] of Object.entries(data.counts.eligibleByPosition))
    assert.equal(
      data.points.filter((p) => p.eligible && p.group === group).length,
      count,
      group,
    );
  assert.equal(data.counts.matches, 132);
  assert.equal(data.counts.events, 495189);
  assert.equal(
    data.source.revision,
    '4b73468fc5b0f1950f9f66fada70ad3a4f9327cb',
  );
});
test('Similarity and recruitment really answer different questions', () => {
  const closest = data.peers.reduce((a, b) =>
    a.distance < b.distance ? a : b,
  );
  assert.equal(closest.name, 'Josie Green');
  assert.equal(data.peers.length, 31);
  const green = data.candidates.find((c) => c.name === 'Josie Green');
  const winner = data.candidates.find((c) => c.rank === 1);
  assert.equal(green.similarityRank, 1);
  assert.equal(green.rank, 10);
  assert.equal(winner.name, 'Kadeisha Buchanan');
  assert.equal(winner.similarityRank, 14);
  assert.ok(Math.abs(winner.score - 91.6666666667) < 1e-8);
  assert.equal(data.featureNames.length, 12);
  for (const p of data.peers)
    assert.ok(Math.abs(p.similarity - 100 / (1 + p.distance)) < 1e-10);
});
test('Every displayed brief score is reconstructible from its components', () => {
  for (const c of data.candidates) {
    let total = 0;
    for (const [metric, part] of Object.entries(c.components)) {
      assert.ok(
        Math.abs(
          part.normalized_weight - data.brief.normalizedWeights[metric],
        ) < 1e-12,
      );
      assert.ok(
        Math.abs(part.percentile * part.normalized_weight - part.contribution) <
          1e-10,
      );
      total += part.contribution;
    }
    assert.ok(Math.abs(total - c.score) < 1e-10, c.name);
  }
});
