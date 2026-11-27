// Servidor estático para las pruebas. Se comporta como GitHub Pages:
// sirve /pagina y /pagina.html igual, y responde con 404.html a lo que no existe.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream', '.pf_index': 'application/octet-stream', '.pf_fragment': 'application/octet-stream', '.pagefind': 'application/octet-stream',
};

export function resolveFile(root, urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const base = path.join(root, path.normalize(clean).replace(/^([/\\])+/, ''));
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, `${base}.html`, path.join(base, 'index.html')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export function serve(root = path.resolve('dist'), port = 0) {
  root = path.resolve(root);
  const server = http.createServer((req, res) => {
    const file = resolveFile(root, req.url);
    const target = file ?? path.join(root, '404.html');
    res.writeHead(file ? 200 : 404, { 'Content-Type': TYPES[path.extname(target)] ?? 'application/octet-stream' });
    fs.createReadStream(target).pipe(res);
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}/` })));
}
