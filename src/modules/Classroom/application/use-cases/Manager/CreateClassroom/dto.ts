import { z } from "zod";

export const createClassroomInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateClassroomInput = z.infer<typeof createClassroomInputSchema>;

export type CreateClassroomOutput = {
  id: string;
  name: string;
  description: string;
}