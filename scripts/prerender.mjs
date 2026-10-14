// Prerenders every page into dist/ so content, contact details and
// structured data are present before any JavaScript runs.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(path.join(root, 'dist-ssr', 'entry-server.js'));
const pages = { home: 'index.html', prodotti: 'prodotti/index.html', negozio: 'negozio/index.html' };

for (const [id, rel] of Object.entries(pages)) {
  const file = path.join(root, 'dist', rel);
  const html = await readFile(file, 'utf8');
  if (!html.includes('<!--app-html-->')) throw new Error(`Missing <!--app-html--> in ${rel}`);
  await writeFile(file, html.replace('<!--app-html-->', render(id)));
  console.log(`Prerendered dist/${rel}`);
}
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
