import { z } from 'zod';

export const updateActivityTemplateInputSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(z.object({
    id: z.string().optional(), // Optional for new questions
    question_text: z.string().min(1),
    question_order: z.number().min(1),
    options: z.array(z.object({
      id: z.string().optional(), // Optional for new options
      option_text: z.string().min(1),
      option_order: z.number().min(1),
      is_correct: z.boolean()
    })).min(2).max(6)
  })).min(1)
});

export type UpdateActivityTemplateInput = z.infer<typeof updateActivityTemplateInputSchema>;

export type UpdateActivityTemplateOutput = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
};
