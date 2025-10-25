import { Teacher } from '@/modules/Classroom/datasource/Teacher/model';
import { z } from "zod";

export const getTeacherInputSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher ID is required'),
});

export type GetTeacherInput = z.infer<typeof getTeacherInputSchema>;

export type GetTeacherOutput = Teacher | null;
