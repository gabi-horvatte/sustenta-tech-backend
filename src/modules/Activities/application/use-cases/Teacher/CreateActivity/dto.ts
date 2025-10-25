import { z } from 'zod';

export const createActivityInputSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().min(1, 'Url is required'),
  classroom_id: z.string().min(1, 'Classroom ID is required'),
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  expires_at: z.date().or(z.iso.datetime()).or(z.iso.date()),
});

export type CreateActivityInput = z.infer<typeof createActivityInputSchema>;

export type CreateActivityOutput = {
  id: string;
  name: string;
  description: string;
  url: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
};