import { z } from 'zod';

export const getStudentProgressInputSchema = z.object({
  activity_id: z.string().min(1),
  student_id: z.string().optional(),
});

export type GetStudentProgressInput = z.infer<typeof getStudentProgressInputSchema>;

export type GetStudentProgressOutput = {
  activity_id: string;
  activity_name: string;
  students: {
    student_id: string;
    student_name: string;
    completed_at: Date | null;
    total_questions: number;
    correct_answers: number;
    score_percentage: number;
  }[];
};
