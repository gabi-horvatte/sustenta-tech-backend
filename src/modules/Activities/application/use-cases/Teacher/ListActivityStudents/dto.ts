import { ActivityStudent } from '@/modules/Activities/datasource/ActivityStudent/model';
import { z } from 'zod';

export const listActivityStudentsInputSchema = z.object({
  activity_id: z.string().min(1, 'Activity IDs are required'),
});

export type ListActivityStudentsInput = z.infer<typeof listActivityStudentsInputSchema>;

export type ListActivityStudentsOutput = (Omit<ActivityStudent, 'created_at' | 'updated_at'> & { student_name: string })[];