import { z } from "zod";

export const editClassroomInputSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type EditClassroomInput = z.infer<typeof editClassroomInputSchema>;

export type EditClassroomOutput = {
  id: string;
  name: string;
  description: string;
}