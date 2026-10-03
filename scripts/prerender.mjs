// Prerenders the homepage into dist/index.html so all content, contact
// details and structured data are present before any JavaScript runs.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { render } = await import(path.join(root, 'dist-ssr', 'entry-server.js'));
const file = path.join(root, 'dist', 'index.html');
const html = await readFile(file, 'utf8');
if (!html.includes('<!--app-html-->')) throw new Error('Missing <!--app-html--> placeholder');
await writeFile(file, html.replace('<!--app-html-->', render()));
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('Prerendered dist/index.html');
