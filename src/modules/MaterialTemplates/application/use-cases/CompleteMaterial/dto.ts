import { z } from 'zod';

export const completeMaterialInputSchema = z.object({
  material_assignment_id: z.string().min(1),
  student_id: z.string().min(1),
});

export type CompleteMaterialInput = z.infer<typeof completeMaterialInputSchema>;

export type CompleteMaterialOutput = {
  id: string;
  material_assignment_id: string;
  student_id: string;
  completed_at: Date;
};
