// Convierte cada imagen que va sola en un párrafo en una figura ampliable:
//   ![texto alternativo](captura.webp "pie opcional")
// Lee las dimensiones del archivo en public/ para reservar el espacio y evitar saltos al cargar.
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';

const publicDir = path.resolve('public');
const sizes = new Map();

function dimensions(src) {
  if (!sizes.has(src)) {
    const file = path.join(publicDir, src);
    if (!fs.existsSync(file)) throw new Error(`No existe la captura ${src} en public/`);
    sizes.set(src, imageSize(fs.readFileSync(file)));
  }
  return sizes.get(src);
}

const text = (node) => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
const isBlank = (node) => node.type === 'text' && !node.value.trim();

export default function rehypeFigures() {
  return (tree) => {
    let section = '';
    const walk = (parent) => {
      parent.children?.forEach((node, i) => {
        if (node.type !== 'element') return;
        if (node.tagName === 'h2') section = text(node).trim();
        const content = node.tagName === 'p' ? node.children.filter((c) => !isBlank(c)) : [];
        if (content.length === 1 && content[0].tagName === 'img') {
          const img = content[0];
          const { src, alt, title } = img.properties;
          const { width, height } = dimensions(src);
          const label = section ? `Ampliar captura: ${section}` : `Ampliar captura: ${alt}`;
          const children = [{
            type: 'element', tagName: 'a',
            properties: { href: src, target: '_blank', rel: ['noopener'], ariaLabel: label },
            children: [{
              type: 'element', tagName: 'img',
              properties: { src, alt, width, height, loading: 'lazy', decoding: 'async' }, children: [],
            }],
          }];
          if (title) children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: title }] });
          parent.children[i] = { type: 'element', tagName: 'figure', properties: {}, children };
          return;
        }
        walk(node);
      });
    };
    walk(tree);
  };
}
