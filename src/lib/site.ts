// Datos y utilidades compartidas por las páginas.
export const AUTHOR = {
  name: 'Daniel Escolar',
  jobTitle: 'Ciberseguridad junior · SOC / Blue Team',
  linkedin: 'https://www.linkedin.com/in/daniel-escolar-martin-b644a6249/',
  github: 'https://github.com/DanisCV15',
};

/** «Subida de archivos» → «subida-de-archivos». */
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const tagHref = (tag: string) => `etiqueta-${slugify(tag)}.html`;

export const personJsonLd = (site: URL | undefined) => ({
  '@type': 'Person',
  name: AUTHOR.name,
  url: site?.href,
  sameAs: [AUTHOR.linkedin, AUTHOR.github],
});
