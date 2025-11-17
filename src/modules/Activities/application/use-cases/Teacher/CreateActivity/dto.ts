import { z } from 'zod';

export const createActivityInputSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  activity_template_id: z.string().min(1, 'Activity template ID is required'),
  classroom_id: z.string().min(1, 'Classroom ID is required'),
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  expires_at: z.date().or(z.iso.datetime()).or(z.iso.date()),
});

export type CreateActivityInput = z.infer<typeof createActivityInputSchema>;

export type CreateActivityOutput = {
  id: string;
  name: string;
  description: string;
  activity_template_id: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
};