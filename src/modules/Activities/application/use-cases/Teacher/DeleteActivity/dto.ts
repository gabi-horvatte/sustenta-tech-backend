import { z } from 'zod';

export const deleteActivityInputSchema = z.object({
  id: z.string().min(1, 'Id is required'),
});

export type DeleteActivityInput = z.infer<typeof deleteActivityInputSchema>;

export type DeleteActivityOutput = {
  id: string;
};