// Revisa el sitio compilado (dist/) sin navegador:
// enlaces internos rotos, anclas que no existen, recursos que faltan, imágenes sin
// texto alternativo o sin dimensiones, títulos y descripciones duplicados.
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { resolveFile } from './serve.mjs';

const root = path.resolve('dist');
const SITE = 'https://daniscv15.github.io/';
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const errors = [];
const external = new Set();
const ids = new Map(); // página → ids que contiene
const parsed = new Map();

for (const page of pages) {
  const $ = cheerio.load(fs.readFileSync(path.join(root, page), 'utf8'));
  parsed.set(page, $);
  ids.set(page, new Set($('[id]').map((_, e) => $(e).attr('id')).get()));
}

const titles = new Map();
const descriptions = new Map();
for (const [page, $] of parsed) {
  const err = (msg) => errors.push(`${page}: ${msg}`);

  const title = $('title').text().trim();
  if (!title) err('sin <title>');
  else titles.set(title, [...(titles.get(title) ?? []), page]);
  const desc = $('meta[name=description]').attr('content');
  if (!desc) err('sin meta description');
  else if (page !== '404.html') descriptions.set(desc, [...(descriptions.get(desc) ?? []), page]);
  if ($('h1').length !== 1) err(`tiene ${$('h1').length} <h1>`);
  if ($('html').attr('lang') !== 'es') err('<html> sin lang="es"');

  $('img').each((_, e) => {
    const img = $(e);
    if (img.attr('alt') === undefined) err(`imagen sin alt: ${img.attr('src')}`);
    if (!img.attr('width') || !img.attr('height')) err(`imagen sin width/height: ${img.attr('src')}`);
  });

  const refs = [
    ...$('a[href]').map((_, e) => $(e).attr('href')).get(),
    ...$('img[src], script[src]').map((_, e) => $(e).attr('src')).get(),
    ...$('link[href]').map((_, e) => $(e).attr('href')).get(),
    ...$('meta[property="og:image"], meta[property="og:url"], link[rel=canonical]').map((_, e) => $(e).attr('content') ?? $(e).attr('href')).get(),
  ];
  for (let ref of refs) {
    if (!ref || /^(mailto:|tel:|javascript:)/.test(ref)) continue;
    if (ref.startsWith(SITE)) ref = '/' + ref.slice(SITE.length);
    if (/^https?:\/\//.test(ref)) { external.add(ref); continue; }
    const [refPath, hash] = ref.split('#');
    const targetPath = refPath === '' ? page : refPath.startsWith('/') ? refPath : '/' + refPath;
    const file = refPath === '' ? path.join(root, page) : resolveFile(root, targetPath === '/' ? '/index.html' : targetPath);
    if (!file) { err(`enlace roto: ${ref}`); continue; }
    if (hash) {
      const target = path.relative(root, file).replace(/\\/g, '/');
      if (ids.has(target) && !ids.get(target).has(hash)) err(`ancla inexistente: ${ref}`);
    }
  }
}

for (const [title, list] of titles) if (list.length > 1) errors.push(`título duplicado «${title}» en ${list.join(', ')}`);
for (const [desc, list] of descriptions) if (list.length > 1) errors.push(`descripción duplicada en ${list.join(', ')}: «${desc.slice(0, 60)}…»`);

console.log(`${pages.length} páginas revisadas · ${external.size} enlaces externos (no se comprueban aquí)`);
if (errors.length) {
  console.error(`\n${errors.length} problemas:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('Sin problemas.');
