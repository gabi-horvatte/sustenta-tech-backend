import { z } from 'zod';

export const editActivityInputSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  activity_template_id: z.string().optional().nullable(),
  classroom_id: z.string().optional().nullable(),
  teacher_id: z.string().optional().nullable(),
  expires_at: z.date().or(z.iso.datetime()).or(z.iso.date()).optional().nullable(),
});

export type EditActivityInput = z.infer<typeof editActivityInputSchema>;

export type EditActivityOutput = {
  id: string;
  name: string;
  description: string;
  activity_template_id: string;
  classroom_id: string;
  teacher_id: string;
  expires_at: Date;
};