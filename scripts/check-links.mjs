import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = await walk(root);
const errors = [];
if (!files.length)
  throw new Error('No built pages found. Run the production build first.');
let checked = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const relative = path
    .relative(root, path.dirname(file))
    .split(path.sep)
    .join('/');
  const base = new URL(
    '/' + (relative ? relative + '/' : ''),
    'https://hyzentech.github.io',
  );
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(mailto:|tel:|data:|javascript:)/.test(value)) continue;
    const url = new URL(value, base);
    if (url.origin !== base.origin) continue;
    checked++;
    const decoded = decodeURIComponent(url.pathname);
    const target = path.join(root, decoded);
    let found;
    for (const candidate of [
      target,
      path.join(target, 'index.html'),
      target + '.html',
    ]) {
      try {
        if ((await stat(candidate)).isFile()) {
          found = candidate;
          break;
        }
      } catch {}
    }
    if (!found) {
      errors.push(path.relative(root, file) + ': missing ' + value);
      continue;
    }
    if (url.hash && found.endsWith('.html')) {
      const body = await readFile(found, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      if (!body.includes('id="' + id + '"'))
        errors.push(path.relative(root, file) + ': missing anchor ' + value);
    }
  }
}
console.log(
  JSON.stringify(
    { pages: files.length, internalReferences: checked, errors },
    null,
    2,
  ),
);
if (errors.length) process.exitCode = 1;
