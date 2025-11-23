import { z } from 'zod';

export const deleteActivityTemplateInputSchema = z.object({
  id: z.string().min(1, 'Activity template ID is required'),
});

export type DeleteActivityTemplateInput = z.infer<typeof deleteActivityTemplateInputSchema>;

export type DeleteActivityTemplateOutput = {
  id: string;
};
