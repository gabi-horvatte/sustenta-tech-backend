import { z } from 'zod';

export const getMaterialAssignmentDetailInputSchema = z.object({
  assignment_id: z.string().min(1),
});

export type GetMaterialAssignmentDetailInput = z.infer<typeof getMaterialAssignmentDetailInputSchema>;

export type GetMaterialAssignmentDetailOutput = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  material_type: string;
  expires_at: Date;
  created_at: Date;
  classroom_name: string;
  students: {
    id: string;
    name: string;
    last_name: string;
    completed_at: Date | null;
  }[];
} | null;
