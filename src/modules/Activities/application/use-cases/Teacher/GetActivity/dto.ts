import { z } from 'zod';

export const getActivityInputSchema = z.object({
  id: z.string().min(1, 'Activity ID is required'),
});

export type GetActivityInput = z.infer<typeof getActivityInputSchema>;

export type GetActivityOutput = {
  id: string;
  name: string;
  description: string;
  activity_template_id: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
} | null;