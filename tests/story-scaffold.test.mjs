import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

test('The authoring scaffold creates a registered draft and refuses overwrite or reserved routes', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'portfolio-story-'));
  try {
    for (const dir of [
      'scripts',
      'src/content/writing',
      'src/visual/writing',
      'src/data/writing',
    ])
      await mkdir(path.join(temp, dir), { recursive: true });
    await cp(
      new URL('../templates', import.meta.url),
      path.join(temp, 'templates'),
      { recursive: true },
    );
    await cp(
      new URL('../scripts/new-story.mjs', import.meta.url),
      path.join(temp, 'scripts/new-story.mjs'),
    );
    await writeFile(path.join(temp, 'src/data/writing/stories.json'), '{}');
    await writeFile(
      path.join(temp, 'src/visual/writing/registry.ts'),
      "import configs from '../../data/writing/stories.json';\nexport const storyRegistry:Record<string,unknown>={};\n",
    );
    const run = (slug) =>
      spawnSync(
        process.execPath,
        [path.join(temp, 'scripts/new-story.mjs'), slug],
        { encoding: 'utf8' },
      );
    const created = run('signal-investigation');
    assert.equal(created.status, 0, created.stderr);
    const mdx = await readFile(
      path.join(temp, 'src/content/writing/signal-investigation.mdx'),
      'utf8',
    );
    assert.ok(mdx.includes('draft: true') && mdx.includes('status: Draft'));
    assert.ok(!mdx.includes('__SLUG__'));
    const registry = await readFile(
      path.join(temp, 'src/visual/writing/registry.ts'),
      'utf8',
    );
    assert.ok(
      registry.includes(
        "import * as scene_signal_investigation from './signal-investigation'",
      ),
    );
    assert.ok(registry.includes("'signal-investigation':"));
    assert.notEqual(run('signal-investigation').status, 0);
    assert.equal(
      await readFile(
        path.join(temp, 'src/content/writing/signal-investigation.mdx'),
        'utf8',
      ),
      mdx,
    );
    assert.notEqual(run('research').status, 0);
    assert.notEqual(run('../escape').status, 0);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
