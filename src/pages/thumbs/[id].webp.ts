// Miniatura de cada laboratorio para su tarjeta (640×320, WebP), recortada de la
// primera captura del writeup. Los laboratorios sin capturas no tienen miniatura.
import path from 'node:path';
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { firstImage } from '../../lib/thumbs';

export const getStaticPaths = (async () => {
  const labs = await getCollection('labs');
  return labs
    .map((lab) => ({ id: lab.id, src: firstImage(lab.body) }))
    .filter((l): l is { id: string; src: string } => l.src !== null)
    .map(({ id, src }) => ({ params: { id }, props: { src } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const file = path.join('public', (props as { src: string }).src);
  const webp = await sharp(file)
    .resize({ width: 640, height: 320, fit: 'cover', position: 'top' })
    .webp({ quality: 72 })
    .toBuffer();
  return new Response(new Uint8Array(webp), { headers: { 'Content-Type': 'image/webp' } });
};
