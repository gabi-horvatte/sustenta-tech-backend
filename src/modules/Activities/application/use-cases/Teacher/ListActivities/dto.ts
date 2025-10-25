import { z } from 'zod';

export const listActivitiesInputSchema = z.object({
  classroom_id: z.string().min(1, 'Classroom ID is required'),
});

export type ListActivitiesInput = z.infer<typeof listActivitiesInputSchema>;

export type ListActivitiesOutput = {
  id: string;
  name: string;
  description: string;
  url: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
}[];