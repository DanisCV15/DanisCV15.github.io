// Imágenes de vista previa (1200×630) para compartir en LinkedIn y otras redes.
// Se generan al compilar con satori (HTML → SVG) y resvg (SVG → PNG).
import fs from 'node:fs';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const font = (pkg: string, file: string) => fs.readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`);
const fonts = [
  { name: 'Space Grotesk', data: font('space-grotesk', 'space-grotesk-latin-700-normal.woff'), weight: 700 as const },
  { name: 'DM Sans', data: font('dm-sans', 'dm-sans-latin-400-normal.woff'), weight: 400 as const },
  { name: 'DM Sans', data: font('dm-sans', 'dm-sans-latin-500-normal.woff'), weight: 500 as const },
];

const C = { bg: '#0b1118', panel: '#111c26', line: '#283642', text: '#edf2f5', muted: '#aab7c2', accent: '#b9ef76' };
type Card = { eyebrow: string; title: string; summary: string; tags: string };

export const getStaticPaths = (async () => {
  const labs = await getCollection('labs');
  const pages = labs.map(({ id, data }) => ({
    params: { page: `lab-${id}` },
    props: { eyebrow: `${data.system} · ${data.kind}`, title: data.cardTitle ?? data.title, summary: data.cardSummary ?? data.summary, tags: data.tags.join(' · ') },
  }));
  pages.push({
    params: { page: 'index' },
    props: { eyebrow: 'Ciberseguridad junior · SOC / Blue Team', title: 'Daniel Escolar', summary: `Proyectos propios y ${labs.length} laboratorios de Linux y Windows explicados paso a paso, con capturas.`, tags: 'SOC · Blue Team · Pentesting · Desarrollo web' },
  });
  return pages;
}) satisfies GetStaticPaths;

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export const GET: APIRoute = async ({ props }) => {
  const { eyebrow, title, summary, tags } = props as Card;
  const tree = el('div', { width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: C.bg, padding: '64px 72px', fontFamily: 'DM Sans', color: C.text, borderTop: `10px solid ${C.accent}` }, [
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { fontSize: 24, fontWeight: 500, letterSpacing: 4, textTransform: 'uppercase', color: C.accent }, eyebrow),
      el('div', { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: title.length > 28 ? 64 : 84, lineHeight: 1.05, letterSpacing: -2, marginTop: 28 }, title),
      el('div', { fontSize: 32, lineHeight: 1.4, color: C.muted, marginTop: 28, maxWidth: 980 }, summary),
    ]),
    el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${C.line}`, paddingTop: 28 }, [
      el('div', { fontSize: 26, color: C.accent, maxWidth: 760 }, tags),
      el('div', { display: 'flex', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 40 }, [
        el('span', {}, 'DE'), el('span', { color: C.accent }, '.'),
      ]),
    ]),
  ]);
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
