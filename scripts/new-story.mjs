import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const reserved = [
  'engineering',
  'ml-ai',
  'research',
  'football-analytics',
  'build-logs',
  'index',
];
if (
  !slug ||
  !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug) ||
  reserved.includes(slug)
)
  throw new Error(
    'Use a unique lower-case slug: npm run new:story -- my-investigation',
  );
const target = (name) => path.join(root, name);
const configsPath = target('src/data/writing/stories.json');
const registryPath = target('src/visual/writing/registry.ts');
const configs = JSON.parse(await readFile(configsPath, 'utf8'));
const mdxPath = target(`src/content/writing/${slug}.mdx`);
const scenePath = target(`src/visual/writing/${slug}.ts`);
for (const file of [mdxPath, scenePath]) {
  let exists = true;
  try {
    await access(file);
  } catch {
    exists = false;
  }
  if (exists) throw new Error('Refusing to overwrite ' + file);
}
if (configs[slug] || slug === 'football-recruitment-intelligence-engine')
  throw new Error('Story already exists');
const replace = (value) =>
  value
    .replaceAll('__SLUG__', slug)
    .replaceAll('__DATE__', new Date().toISOString().slice(0, 10));
const mdx = replace(
  await readFile(target('templates/visual-story/article.mdx.template'), 'utf8'),
);
const scene = replace(
  await readFile(target('templates/visual-story/scene.ts.template'), 'utf8'),
);
const config = JSON.parse(
  await readFile(target('templates/visual-story/story.json'), 'utf8'),
);
const registry = await readFile(registryPath, 'utf8');
const marker = 'export const storyRegistry';
if (!registry.includes(marker))
  throw new Error('Registry structure changed; add this renderer manually');
const alias = 'scene_' + slug.replaceAll('-', '_');
const imported = `import * as ${alias} from './${slug}';\n`;
const registration = `\n  '${slug}': {...configs['${slug}'], id:'${slug}', render:${alias}.render, state:${alias}.state, opening:${alias}.opening},`;
const updated = registry
  .replace(marker, imported + marker)
  .replace(/(storyRegistry[^=]*=\s*\{)/, '$1' + registration);
configs[slug] = config;
await writeFile(mdxPath, mdx);
await writeFile(scenePath, scene);
await writeFile(configsPath, JSON.stringify(configs, null, 2) + '\n');
await writeFile(registryPath, updated);
console.log(
  `Created draft ${slug}.mdx, its scene renderer, configuration, and registry entry.\nFollow WRITING_SYSTEM.md before setting draft:false and status:Published.`,
);
