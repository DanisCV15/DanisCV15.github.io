import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeFigures from './src/lib/rehype-figures.mjs';

export default defineConfig({
  site: 'https://daniscv15.github.io',
  // Genera lab-bank.html en vez de lab-bank/index.html para conservar las URL publicadas.
  build: { format: 'file' },
  markdown: {
    syntaxHighlight: false,
    // smartypants desactivado: el texto se publica tal cual está escrito.
    processor: unified({ smartypants: false, rehypePlugins: [rehypeFigures] }),
  },
});
