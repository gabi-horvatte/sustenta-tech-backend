import { z } from 'zod';

export const completeMaterialAssignmentInputSchema = z.object({
  id: z.string().min(1, 'Material ID is required'),
  student_id: z.string().min(1, 'Student ID is required'),
});

export type CompleteMaterialAssignmentInput = z.infer<typeof completeMaterialAssignmentInputSchema>;

export type CompleteMaterialAssignmentOutput = {
  id: string;
  student_id: string;
  completed_at: Date;
};