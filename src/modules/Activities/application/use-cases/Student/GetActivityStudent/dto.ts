import { ActivityStudent } from '@/modules/Activities/datasource/ActivityStudent/model';
import { z } from 'zod';

export const getActivityStudentInputSchema = z.object({
  activity_id: z.string().min(1, 'Activity ID is required'),
  student_id: z.string().min(1, 'Student ID is required'),
});

export type GetActivityStudentInput = z.infer<typeof getActivityStudentInputSchema>;

export type GetActivityStudentOutput = ActivityStudent | null;