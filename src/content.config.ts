import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
