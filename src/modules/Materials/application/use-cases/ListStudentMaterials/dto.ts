import { Material } from '@/modules/Materials/datasource/model';
import { z } from 'zod';

export const listStudentMaterialsInputSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
});

export type ListStudentMaterialsInput = z.infer<typeof listStudentMaterialsInputSchema>;

export type ListStudentMaterialsOutput = Material[];