import { z } from 'zod';

export const listStudentMaterialsInputSchema = z.object({
  student_id: z.string().min(1),
});

export type ListStudentMaterialsInput = z.infer<typeof listStudentMaterialsInputSchema>;

export type ListStudentMaterialsOutput = {
  assignment_id: string;
  material_id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  thumbnail: string | null;
  material_type: string;
  expires_at: Date;
  completed_at: Date | null;
}[];
