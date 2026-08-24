import type { z } from 'astro:content';
import type { areaSchema, itemSchema } from '../content.config';

export type Area = z.infer<typeof areaSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Section = 'stretching' | 'exercise';
