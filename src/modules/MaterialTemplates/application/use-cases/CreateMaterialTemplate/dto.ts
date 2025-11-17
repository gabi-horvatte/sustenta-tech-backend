import { z } from 'zod';

export const createMaterialTemplateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  authors: z.string().min(1),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  material_type: z.string().default('video'),
  created_by: z.string().min(1),
});

export type CreateMaterialTemplateInput = z.infer<typeof createMaterialTemplateInputSchema>;

export type CreateMaterialTemplateOutput = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  thumbnail: string | null;
  material_type: string;
  created_by: string;
  created_at: Date;
};
