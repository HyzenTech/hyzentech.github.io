import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const common = {
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
};
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    ...common,
    year: z.number(),
    status: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    domains: z.array(z.string()),
    cover: z.string().optional(),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    paper: z.string().url().optional(),
    writing: z.string().optional(),
  }),
});
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    ...common,
    category: z.enum([
      'Engineering',
      'ML / AI',
      'Research',
      'Football Analytics',
      'Build Logs',
    ]),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    cover: z.string().optional(),
    work: z.string().optional(),
    updated: z.coerce.date().optional(),
    status: z.enum(['Published', 'Draft']).default('Published'),
    authors: z.array(z.string()).min(1).default(['Muhammad Hafiz']),
    story: z.object({
      type: z.literal('scrolly'),
      id: z.string().regex(/^[a-z0-9-]+$/),
      chapters: z
        .array(z.string().regex(/^[a-z0-9-]+$/))
        .min(1)
        .refine(
          (ids) => new Set(ids).size === ids.length,
          'Scene IDs must be unique',
        ),
      estimatedReadTime: z.number().positive(),
    }),
    sources: z
      .array(
        z.object({
          label: z.string(),
          url: z
            .string()
            .refine(
              (url) => url.startsWith('/') || URL.canParse(url),
              'Expected an absolute URL or site path',
            ),
        }),
      )
      .default([]),
    project: z
      .object({
        repository: z.string().url().optional(),
        demo: z.string().url().optional(),
        paper: z.string().url().optional(),
      })
      .optional(),
  }),
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    ...common,
    status: z.enum(['Observation', 'Experiment', 'Build note']),
  }),
});
export const collections = { work, writing, notes };
