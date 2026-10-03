import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const json = async (name) =>
  JSON.parse(
    await readFile(
      new URL('../src/data/writing/' + name + '.json', import.meta.url),
      'utf8',
    ),
  );
const html = (route) =>
  readFile(new URL('../dist/' + route + 'index.html', import.meta.url), 'utf8');

test('Tracking measurements agree with the exported observations and preserve missing data', async () => {
  const data = await json('tracking');
  assert.equal(data.snapshots.length, 8);
  assert.equal(data.metrics.length, 257);
  for (const frame of data.snapshots) {
    assert.equal(frame.players.length, 10);
    assert.ok(
      frame.players.every(
        (p) =>
          p.id !== 'Player11' &&
          p.x >= 0 &&
          p.x <= 105 &&
          p.y >= 0 &&
          p.y <= 68,
      ),
    );
    for (const [axis, key] of [
      [0, 'x'],
      [1, 'y'],
    ]) {
      const mean = frame.players.reduce((sum, p) => sum + p[key], 0) / 10;
      assert.ok(Math.abs(mean - frame.centroid[axis]) < 0.001);
    }
    assert.ok(
      frame.hull.every((v) =>
        frame.players.some(
          (p) => Math.abs(p.x - v[0]) < 0.001 && Math.abs(p.y - v[1]) < 0.001,
        ),
      ),
    );
  }
  for (const [frame, row] of [
    [data.snapshots[0], data.metrics[0]],
    [data.snapshots.at(-1), data.metrics.at(-1)],
  ]) {
    const ys = frame.players.map((p) => p.y),
      xs = frame.players.map((p) => p.x);
    assert.ok(
      Math.abs(Math.max(...ys) - Math.min(...ys) - row.width_m) < 0.001,
    );
    assert.ok(
      Math.abs(Math.max(...xs) - Math.min(...xs) - row.length_m) < 0.001,
    );
  }
  assert.ok(data.snapshots[5].ball);
  assert.ok(!data.metrics.some((r) => r.time_s > 307.92 && r.time_s < 308.96));
  assert.ok(
    data.metrics.some(
      (r, i) =>
        i && Math.abs(r.time_s - data.metrics[i - 1].time_s - 1.04) < 0.001,
    ),
  );
  const body = await html('writing/football-tracking-compactness/');
  assert.ok(body.includes('Away recovery'));
  assert.ok(body.includes('no interpolation'));
});

test('Thermal source discrepancies remain visible and unreported evidence stays unknown', async () => {
  const data = await json('thermal');
  assert.equal(
    data.splits.reduce((sum, s) => sum + s.total, 0),
    data.curated,
  );
  assert.equal(
    data.splits.reduce((sum, s) => sum + s.perClass, 0),
    data.perClass,
  );
  assert.equal(data.confusionMatrix, null);
  assert.equal(data.testAccuracy, null);
  assert.equal(data.notebook.savedOutputs, 0);
  const body = await html('writing/breast-thermal-classification/');
  for (const v of [
    '85.63',
    '73.17',
    '72.89',
    'Counts unavailable',
    'not a patient image',
  ])
    assert.ok(body.includes(v), v);
  assert.ok(!body.includes('five-fold search'));
});

test('BADI distinguishes observed example records, basket counts and an unverified forecast contract', async () => {
  const data = await json('badi');
  assert.equal(data.seriesCount, 334);
  assert.equal(data.series.length, 36);
  assert.equal(data.settings.window, 12);
  assert.equal(data.settings.forecast, 12);
  assert.equal(data.baskets, 9465);
  assert.equal(data.pair.count, 852);
  assert.equal(data.pair.support, 852 / 9465);
  const body = await html('writing/badi-analytics/');
  for (const text of [
    'Monthly items sold',
    '12 monthly steps',
    'Returned records',
    'returned forecasts',
    'original dataframe records',
  ])
    assert.ok(body.toLowerCase().includes(text.toLowerCase()), text);
});

test('The index, homepage and previews share canonical publication metadata without shipping scene code', async () => {
  const index = await html('writing/'),
    home = await html('');
  const files = await readdir(
    new URL('../src/content/writing/', import.meta.url),
  );
  for (const file of files.filter((f) => f.endsWith('.mdx'))) {
    const slug = file.slice(0, -4);
    assert.ok(index.includes('/writing/' + slug + '/'));
    assert.ok(index.includes('/previews/' + slug + '.svg'));
    const preview = await readFile(
      new URL('../dist/previews/' + slug + '.svg', import.meta.url),
      'utf8',
    );
    assert.ok(preview.includes('role="img"'));
    assert.ok(!preview.includes('<script'));
  }
  for (const body of [index, home]) {
    assert.ok(!body.includes('data-scene-config'));
    assert.ok(!body.includes('RecruitmentLayout.astro_astro_type_script'));
    assert.ok(!body.includes('VisualWritingLayout.astro_astro_type_script'));
  }
});
