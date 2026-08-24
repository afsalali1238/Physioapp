import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { areaSchema, itemSchema } from './lib/schemas';

const areas = defineCollection({
  loader: file("src/data/areas.json"),
  schema: areaSchema
});

const items = defineCollection({
  loader: file("src/data/items.json"),
  schema: itemSchema
});

export const collections = { areas, items };
