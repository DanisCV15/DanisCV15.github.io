import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TECHNIQUES } from './lib/attack';

const tecnica = z.string().refine((id) => id in TECHNIQUES, {
  error: (issue) => `Técnica ATT&CK desconocida: ${String(issue.input)}. Añádela en src/lib/attack.ts`,
});

const labs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/labs' }),
  schema: z.object({
    title: z.string(),
    cardTitle: z.string().optional(),
    system: z.enum(['Linux', 'Windows']),
    kind: z.string().default('Laboratorio'),
    number: z.number().int(),
    order: z.number().int(),
    summary: z.string(),
    cardSummary: z.string().optional(),
    tags: z.array(z.string()),
    tagLine: z.string().optional(),
    eyebrow: z.string().optional(),
    pageTitle: z.string().optional(),
    description: z.string().optional(),
    readLabel: z.string().default('Leer el recorrido'),
    keywords: z.string().optional(),
    /** Plataforma del laboratorio (HTB, Hack4u, DockerLabs…), si se quiere mostrar en la tarjeta. */
    plataforma: z.string().optional(),
    /** Cadena de ataque: cada sección del writeup con las técnicas ATT&CK que usa. */
    cadena: z.array(z.object({ seccion: z.string(), tecnicas: z.array(tecnica).min(1) })).default([]),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/proyectos' }),
  schema: z.object({
    title: z.string(),
    cardTitle: z.string(),
    kind: z.string(),
    year: z.string(),
    summary: z.string(),
    cardSummary: z.string(),
    tagLine: z.string(),
    cardTags: z.string(),
    eyebrow: z.string(),
    pageTitle: z.string(),
    description: z.string(),
    ogDescription: z.string().optional(),
    image: z.string().optional(),
    cardImage: z.string(),
    cardImageAlt: z.string(),
    readLabel: z.string().default('Ver el proyecto'),
    order: z.number().int(),
  }),
});

export const collections = { labs, proyectos };
