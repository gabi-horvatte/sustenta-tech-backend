import { z } from "zod";

export const deleteClassroomInputSchema = z.object({
  id: z.string().min(1, 'Id is required'),
});

export type DeleteClassroomInput = z.infer<typeof deleteClassroomInputSchema>;

export type DeleteClassroomOutput = {
  id: string;
}