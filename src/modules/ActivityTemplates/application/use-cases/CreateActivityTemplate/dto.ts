import { z } from 'zod';

export const createActivityTemplateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  created_by: z.string().min(1),
  questions: z.array(z.object({
    question_text: z.string().min(1),
    question_order: z.number().min(1),
    options: z.array(z.object({
      option_text: z.string().min(1),
      option_order: z.number().min(1),
      is_correct: z.boolean()
    })).min(2).max(6)
  })).min(1)
});

export type CreateActivityTemplateInput = z.infer<typeof createActivityTemplateInputSchema>;

export type CreateActivityTemplateOutput = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: Date;
};
