import z from 'zod';

export const getClassroomListInputSchema = z.object({
  teacher_id: z.string().min(1, 'Teacher ID is required'),
});

export type GetClassroomListInput = z.infer<typeof getClassroomListInputSchema>;