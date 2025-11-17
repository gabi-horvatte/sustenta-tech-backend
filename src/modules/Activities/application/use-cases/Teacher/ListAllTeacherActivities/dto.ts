import { z } from 'zod';

export const listAllTeacherActivitiesInputSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher ID is required'),
});

export type ListAllTeacherActivitiesInput = z.infer<typeof listAllTeacherActivitiesInputSchema>;

export type ListAllTeacherActivitiesOutput = {
  id: string;
  name: string;
  description: string;
  activity_template_id: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}[];