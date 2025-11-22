import { z } from 'zod';

export const deleteStudentInputSchema = z.object({
  id: z.string().min(1, 'Student ID is required'),
});

export type DeleteStudentInput = z.infer<typeof deleteStudentInputSchema>;

export type DeleteStudentOutput = {
  id: string;
};
