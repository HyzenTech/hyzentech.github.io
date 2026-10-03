import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const html = (route) =>
  readFile(new URL('../dist/' + route + 'index.html', import.meta.url), 'utf8');
test('Every Writing article has canonical chapters and a complete readable visual fallback', async () => {
  for (const [slug, count, marks] of [
    ['football-recruitment-intelligence-engine', 8, 303],
    ['breast-thermal-classification', 8, 121],
    ['football-tracking-compactness', 6, 10],
    ['badi-analytics', 6, 36],
  ]) {
    const body = await html('writing/' + slug + '/');
    const ids = [...body.matchAll(/data-writing-step="([^"]+)"/g)].map(
      (m) => m[1],
    );
    assert.equal(ids.length, count, slug);
    assert.equal(new Set(ids).size, count);
    assert.equal((body.match(/data-writing-inline=/g) || []).length, count);
    assert.equal((body.match(/data-writing-stage/g) || []).length, 1);
    for (const id of ids) {
      assert.ok(body.includes('href="#' + id + '"'), slug + ': ' + id);
      assert.ok(body.includes('data-writing-inline="' + id + '"'));
    }
    if (slug === 'football-recruitment-intelligence-engine') {
      assert.equal((body.match(/data-recruitment-step=/g) || []).length, 8);
      assert.equal((body.match(/data-recruitment-canvas/g) || []).length, 1);
      // Persistent profile identities are retained in the approved canvas.
      const stage = body.split('data-recruitment-canvas')[1].split('</svg>')[0];
      assert.equal((stage.match(/data-profile=/g) || []).length, marks);
    } else {
      const stage = body.split('data-writing-stage')[1].split('</svg>')[0];
      assert.equal((stage.match(/data-shared-mark=/g) || []).length, marks);
      assert.equal((stage.match(/data-visual-layer=/g) || []).length, count);
      assert.equal((body.match(/data-scene-config/g) || []).length, 1);
    }
  }
});

test('Published articles and cases are searchable with explicit content types', async () => {
  for (const [route, type] of [
    ['work/football-recruitment-engine/', 'Work'],
    ['work/breast-thermal-classification/', 'Work'],
    ['work/badi/', 'Work'],
    ['writing/football-recruitment-intelligence-engine/', 'Writing'],
    ['writing/football-tracking-compactness/', 'Writing'],
    ['writing/breast-thermal-classification/', 'Writing'],
    ['writing/badi-analytics/', 'Writing'],
    ['notes/thermal-metric-reconciliation/', 'Notes'],
  ]) {
    const body = await html(route);
    assert.ok(body.includes('data-pagefind-body'));
    const meta = body
      .match(/data-pagefind-meta="type"[^>]*>([^<]*)</)?.[1]
      .trim();
    assert.equal(meta, type, route);
    assert.equal((body.match(/<h1[ >]/g) || []).length, 1);
  }
});
test('Research discrepancy stays labeled, with no invented test accuracy', async () => {
  const body = await html('work/breast-thermal-classification/');
  for (const text of ['85.63%', '73.17%', '72.89%', 'reconciled'])
    assert.ok(body.includes(text));
  assert.ok(body.includes('No test-set accuracy is invented'));
});
test('Legacy article URLs forward to the published Writing route', async () => {
  const body = await html('blog/football-recruitment-intelligence-engine/');
  assert.ok(
    body.includes('/writing/football-recruitment-intelligence-engine/'),
  );
});
test('Resume links serve the unchanged user-supplied PDF', async () => {
  const body = await html('resume/');
  assert.ok(body.includes('View Resume'));
  assert.ok(body.includes('Download PDF'));
  assert.ok(body.includes('download="Muhammad_Hafiz_CV_AI_Engineer.pdf"'));
  const pdf = await readFile(
    new URL(
      '../dist/resume/Muhammad_Hafiz_CV_AI_Engineer.pdf',
      import.meta.url,
    ),
  );
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  const { createHash } = await import('node:crypto');
  assert.equal(
    createHash('sha256').update(pdf).digest('hex'),
    '53154ff36ece6702a5b8c6954e8def64a8838906fe759d852d20095e5e4659f2',
  );
});
