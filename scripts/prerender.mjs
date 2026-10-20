// Runs after `vite build`: renders the page to HTML and puts it inside
// <div id="root"> in dist/index.html. Visitors then see the full page as soon
// as the HTML and CSS arrive, before the JavaScript has loaded.
// It also adds a preload for the main font file.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);

const file = 'dist/index.html';
const template = await readFile(file, 'utf8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('Could not find <div id="root"></div> in dist/index.html');
}
// Preload the main (Latin) Geist font file so text appears in Geist right away.
// Its file name includes a hash that changes on every build, so it is looked up here.
const font = (await readdir('dist/assets')).find((name) => /^geist-latin-wght-normal-.*\.woff2$/.test(name));
const fontPreload = font
  ? `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />\n  `
  : '';

const html = template
  .replace('</head>', `${fontPreload}</head>`)
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`);
await writeFile(file, html);
await rm('dist-ssr', { recursive: true, force: true });

console.log('Pre-rendered dist/index.html');
