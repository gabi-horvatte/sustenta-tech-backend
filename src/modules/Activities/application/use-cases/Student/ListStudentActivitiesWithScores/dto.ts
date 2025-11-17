import { z } from 'zod';

export const listStudentActivitiesWithScoresInputSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
});

export type ListStudentActivitiesWithScoresInput = z.infer<typeof listStudentActivitiesWithScoresInputSchema>;

export type ListStudentActivitiesWithScoresOutput = {
  id: string;
  activity_id: string;
  student_id: string;
  completed_at: Date | null;
  activity_name: string;
  expires_at: Date;
  description: string;
  activity_template_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
}[];
