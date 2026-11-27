// Pruebas en un Chrome real sobre el sitio compilado (dist/):
// accesibilidad con axe en todas las páginas, buscador, filtro, visor de capturas,
// diseño en móvil y errores de consola.
// Chrome: variable CHROME_PATH o la ruta habitual en Windows / Linux / macOS.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const chrome = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find((p) => p && fs.existsSync(p));
if (!chrome) throw new Error('No encuentro Chrome. Indica su ruta en CHROME_PATH.');

const { server, url: BASE } = await serve('dist');
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
const failures = [];
const check = (ok, msg) => { console.log(`${ok ? '✓' : '✗'} ${msg}`); if (!ok) failures.push(msg); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let errors = []; // errores de la página abierta en ese momento
function watch(page) {
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('requestfailed', (r) => !r.url().startsWith('https://fonts.') && errors.push(`no carga ${r.url()}`));
}

async function open(page, p, viewport = { width: 1366, height: 900 }) {
  errors = [];
  await page.setViewport(viewport);
  await page.goto(BASE + p, { waitUntil: 'networkidle0' });
  return errors;
}

try {
  const page = await browser.newPage();
  watch(page);

  // 1) Accesibilidad (WCAG 2.2 AA) y errores de consola en todas las páginas
  const pages = fs.readdirSync('dist').filter((f) => f.endsWith('.html'));
  let a11yProblems = 0;
  for (const p of pages) {
    const errors = await open(page, p);
    await page.evaluate(axeSource);
    const { violations } = await page.evaluate(() =>
      window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
    for (const v of violations) {
      a11yProblems++;
      failures.push(`${p}: [${v.impact}] ${v.id}: ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
    }
    for (const e of errors) failures.push(`${p}: error en consola: ${e}`);
  }
  check(a11yProblems === 0, `accesibilidad: ${pages.length} páginas revisadas con axe, ${a11yProblems} problemas`);

  // 2) Buscador de texto completo y filtro por sistema
  await open(page, 'index.html');
  const total = await page.$$eval('.card', (c) => c.length);
  const search = async (q, system = '') => {
    await page.$eval('#search', (e) => { e.value = ''; });
    await page.select('#system', system);
    await page.type('#search', q);
    await wait(900);
    return page.$$eval('.card', (cs) => cs.filter((c) => !c.hidden).map((c) => c.querySelector('.card-title').textContent));
  };
  let r = await search('rockyou');
  check(r.length === 1 && r[0] === 'Bizness', `buscar «rockyou» (solo está en el texto) → ${r.join(', ') || 'nada'}`);
  check(await page.$('.card:not([hidden]) .hit mark') !== null, 'el resultado muestra el fragmento con la palabra resaltada');
  r = await search('xyzzyqwerty');
  check(r.length === 0, `una búsqueda inventada no devuelve nada (${r.length})`);
  check(await page.$eval('#empty', (e) => !e.hidden), 'se muestra el mensaje de «sin resultados»');
  r = await search('suid', 'Windows');
  check(r.length === 0, `«suid» filtrado a Windows → ${r.length}`);
  r = await search('');
  check(r.length === total, `sin búsqueda se ven los ${total} laboratorios`);

  // 3) Visor de capturas con teclado
  await open(page, 'lab-bank.html');
  const figures = await page.$$eval('.article figure > a', (a) => a.length);
  await page.click('.article figure > a');
  await wait(200);
  const visor = () => page.evaluate(() => {
    const d = document.querySelector('dialog.visor');
    return { open: d.open, src: d.querySelector('img').getAttribute('src'), focusInside: d.contains(document.activeElement) };
  });
  let v = await visor();
  check(v.open && v.focusInside, 'el visor se abre y el foco queda dentro');
  const first = v.src;
  await page.keyboard.press('ArrowRight');
  v = await visor();
  check(v.src !== first, 'la flecha derecha pasa a la siguiente captura');
  await page.keyboard.press('Escape');
  v = await visor();
  check(!v.open && page.url().endsWith('lab-bank.html'), `Escape cierra el visor sin salir de la página (${figures} capturas)`);

  // 4) Móvil: nada se sale de la pantalla
  const mobile = { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  const wide = [];
  for (const p of ['index.html', 'lab-bank.html', 'lab-windows-blue-team.html', 'proyecto-observatorio.html', 'etiqueta-web.html', '404.html']) {
    await open(page, p, mobile);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) wide.push(`${p} (+${overflow}px)`);
  }
  check(wide.length === 0, `sin desbordamiento horizontal a 390 px${wide.length ? ': ' + wide.join(', ') : ''}`);

  // 5) Una ruta inexistente devuelve la 404 con estilos
  await page.setViewport({ width: 1366, height: 900 });
  const res = await page.goto(BASE + 'carpeta/que/no/existe', { waitUntil: 'networkidle0' });
  const styled = await page.evaluate(() => getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)');
  check(res.status() === 404 && styled, 'una ruta anidada inexistente muestra la 404 con estilos');
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`\n${failures.length} fallos:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nTodo correcto.');
