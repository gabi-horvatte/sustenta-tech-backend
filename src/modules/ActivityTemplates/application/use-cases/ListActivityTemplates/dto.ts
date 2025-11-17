import { z } from 'zod';

export const listActivityTemplatesInputSchema = z.object({
  created_by: z.string().optional(),
});

export type ListActivityTemplatesInput = z.infer<typeof listActivityTemplatesInputSchema>;

export type ListActivityTemplatesOutput = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: Date;
  question_count: number;
}[];
