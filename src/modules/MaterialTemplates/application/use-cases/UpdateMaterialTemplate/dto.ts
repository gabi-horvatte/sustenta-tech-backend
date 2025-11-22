import { z } from 'zod';

export const updateMaterialTemplateInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  authors: z.string().min(1),
  url: z.string().url(),
  thumbnail: z.string().url().optional().nullable(),
  material_type: z.string().default('video'),
});

export type UpdateMaterialTemplateInput = z.infer<typeof updateMaterialTemplateInputSchema>;

export type UpdateMaterialTemplateOutput = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  thumbnail: string | null;
  material_type: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
};
