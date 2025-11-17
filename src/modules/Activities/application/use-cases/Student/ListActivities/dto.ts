import { z } from 'zod';

export const listActivitiesInputSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
});

export type ListActivitiesInput = z.infer<typeof listActivitiesInputSchema>;

export type ListActivitiesOutput = {
  id: string;
  name: string;
  description: string;
  activity_template_id: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
  completed_at: Date | null;
}[];