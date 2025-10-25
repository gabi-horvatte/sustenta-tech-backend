import { Student } from '@/modules/Classroom/datasource/Student/model';
import { z } from "zod";

export const getStudentInputSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
});

export type GetStudentInput = z.infer<typeof getStudentInputSchema>;

export type GetStudentOutput = Student | null;
