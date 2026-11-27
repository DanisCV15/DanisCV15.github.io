import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import rehypeFigures from './src/lib/rehype-figures.mjs';
import shikiTheme from './src/lib/shiki-theme.mjs';

export default defineConfig({
  site: 'https://daniscv15.github.io',
  // Genera lab-bank.html en vez de lab-bank/index.html para conservar las URL publicadas.
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => !/\/404(\.html)?$/.test(page),
      // Con build.format 'file' las páginas se publican como .html: el sitemap usa esa misma URL.
      serialize: (item) => ({ ...item, url: item.url.replace(/^(https:\/\/[^/]+\/.+?)(\.html)?$/, '$1.html') }),
    }),
  ],
  markdown: {
    shikiConfig: { theme: shikiTheme },
    // smartypants desactivado: el texto se publica tal cual está escrito.
    processor: unified({ smartypants: false, rehypePlugins: [rehypeFigures] }),
  },
});
