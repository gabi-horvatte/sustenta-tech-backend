import { z } from 'zod';

export const getActivityTemplateInputSchema = z.object({
  id: z.string().min(1),
});

export type GetActivityTemplateInput = z.infer<typeof getActivityTemplateInputSchema>;

export type GetActivityTemplateOutput = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: Date;
  questions: {
    id: string;
    question_text: string;
    question_order: number;
    options: {
      id: string;
      option_text: string;
      option_order: number;
      is_correct: boolean;
    }[];
  }[];
};
