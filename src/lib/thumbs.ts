/** Ruta de la primera captura de un writeup en Markdown (`![alt](/shot-x.webp)`), o null. */
export const firstImage = (body: string | undefined) => body?.match(/!\[[^\]]*\]\((\/[^)\s]+)/)?.[1] ?? null;

/** URL de la miniatura de un laboratorio, si tiene capturas. */
export const thumbUrl = (id: string, body: string | undefined) => (firstImage(body) ? `/thumbs/${id}.webp` : null);
