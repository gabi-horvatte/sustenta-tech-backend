import { ActivityStudent } from '@/modules/Activities/datasource/ActivityStudent/model';
import { z } from 'zod';

export const listStudentActivitiesInputSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
});

export type ListStudentActivitiesInput = z.infer<typeof listStudentActivitiesInputSchema>;

export type ListStudentActivitiesOutput = (Omit<ActivityStudent, 'created_at' | 'updated_at'> & { activity_name: string, expires_at: Date, description: string, activity_template_id: string })[];