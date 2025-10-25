import { z } from "zod";

export const completeActivityInputSchema = z.object({
  activity_id: z.string().min(1, 'Activity ID is required'),
  student_id: z.string().min(1, 'Student ID is required'),
});

export type CompleteActivityInput = z.infer<typeof completeActivityInputSchema>;

export type CompleteActivityOutput = {
  id: string;
  student_id: string;
  completed_at: Date;
};