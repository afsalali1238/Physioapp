import { z } from 'zod';
import { areaSchema, itemSchema } from './schemas';

export type Area = z.infer<typeof areaSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Section = 'stretching' | 'exercise';
