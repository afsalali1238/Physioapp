import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

export const areaSchema = z.object({
  id: z.string(),
  area_id: z.string().regex(/^[a-z0-9-]+$/),
  section: z.enum(['stretching', 'exercise']),
  name_en: z.string().min(1),
  name_ar: z.string().optional(),
  order: z.number().int(),
  status: z.enum(['published', 'draft', 'retired']),
  notes_internal: z.string().optional()
});

export const itemSchema = z.object({
  id: z.string().regex(/^(str|ex)-[a-z0-9-]+$/),
  section: z.enum(['stretching', 'exercise']),
  area_id: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  status: z.enum(['published', 'draft', 'retired']),
  name_en: z.string().min(1),
  name_ar: z.string().optional(),
  type: z.enum([
    'range-of-motion', 'mobility', 'isometric', 'concentric',
    'eccentric', 'isokinetic', 'stabilisation', 'activation',
    'offloading', 'strengthening', 'functional'
  ]).optional(),
  start_position_en: z.string().optional(),
  start_position_ar: z.string().optional(),
  movement_en: z.string().optional(),
  movement_ar: z.string().optional(),
  direction_en: z.string().optional(),
  direction_ar: z.string().optional(),
  return_en: z.string().optional(),
  return_ar: z.string().optional(),
  safety_en: z.string().optional(),
  safety_ar: z.string().optional(),
  target_muscles_en: z.string().optional(),
  target_muscles_ar: z.string().optional(),
  hold_seconds: z.number().int().optional(),
  reps: z.number().int().optional(),
  sets: z.number().int().optional(),
  rest_seconds: z.number().int().optional(),
  each_side: z.boolean().optional(),
  frequency_en: z.string().optional(),
  image_id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  image_alt_en: z.string().optional(),
  image_alt_ar: z.string().optional(),
  image_status: z.enum(['pending', 'generated', 'approved']).optional(),
  notes_internal: z.string().optional(),
  reviewed_by: z.string().optional(),
  reviewed_date: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.status === 'published') {
    if (!data.start_position_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "start_position_en is required", path: ["start_position_en"] });
    if (!data.movement_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "movement_en is required", path: ["movement_en"] });
    if (!data.safety_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "safety_en is required", path: ["safety_en"] });
    if (!data.target_muscles_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "target_muscles_en is required", path: ["target_muscles_en"] });
    if (!data.image_id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "image_id is required", path: ["image_id"] });
    if (!data.image_alt_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "image_alt_en is required", path: ["image_alt_en"] });
    
    if (data.section === 'exercise') {
      if (!data.type) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "type is required for exercises", path: ["type"] });
      if (!data.return_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "return_en is required for exercises", path: ["return_en"] });
    } else if (data.section === 'stretching') {
      if (!data.direction_en) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "direction_en is required for stretches", path: ["direction_en"] });
    }
    
    if (data.hold_seconds === undefined && data.reps === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one of hold_seconds or reps must be set", path: ["dosage"] });
    }
  }
});

const areas = defineCollection({
  loader: file("src/data/areas.json"),
  schema: areaSchema
});

const items = defineCollection({
  loader: file("src/data/items.json"),
  schema: itemSchema
});

export const collections = { areas, items };
