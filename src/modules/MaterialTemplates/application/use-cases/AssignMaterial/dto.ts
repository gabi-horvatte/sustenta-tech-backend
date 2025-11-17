import { z } from 'zod';

export const assignMaterialInputSchema = z.object({
  material_template_id: z.string().min(1),
  classroom_id: z.string().min(1),
  assigned_by: z.string().min(1),
  expires_at: z.string().datetime(),
});

export type AssignMaterialInput = z.infer<typeof assignMaterialInputSchema>;

export type AssignMaterialOutput = {
  id: string;
  material_template_id: string;
  classroom_id: string;
  assigned_by: string;
  expires_at: Date;
  created_at: Date;
};
