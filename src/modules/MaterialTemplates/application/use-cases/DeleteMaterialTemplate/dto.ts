import { z } from 'zod';

export const deleteMaterialTemplateInputSchema = z.object({
  id: z.string().min(1, 'Material template ID is required'),
});

export type DeleteMaterialTemplateInput = z.infer<typeof deleteMaterialTemplateInputSchema>;

export type DeleteMaterialTemplateOutput = {
  id: string;
};


