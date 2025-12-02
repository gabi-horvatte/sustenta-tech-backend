import { z } from 'zod';

export const getMaterialTemplateInputSchema = z.object({
  id: z.string().min(1),
});

export type GetMaterialTemplateInput = z.infer<typeof getMaterialTemplateInputSchema>;

export type GetMaterialTemplateOutput = {
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



