import { Material } from '@/modules/Materials/datasource/model';
import { z } from 'zod';

export const getStudentMaterialInputSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  type: z.enum(['article', 'video']),
});

export type GetStudentMaterialInput = z.infer<typeof getStudentMaterialInputSchema>;

export type GetStudentMaterialOutput = Material | null;