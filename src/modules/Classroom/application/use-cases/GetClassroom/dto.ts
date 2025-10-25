import { Classroom } from '@/modules/Classroom/datasource/Classroom/model';
import { z } from 'zod';

export const getClassroomInputSchema = z.object({
  id: z.string().min(1, 'Classroom ID is required'),
});

export type GetClassroomInput = z.infer<typeof getClassroomInputSchema>;

export type GetClassroomOutput = Classroom | null;