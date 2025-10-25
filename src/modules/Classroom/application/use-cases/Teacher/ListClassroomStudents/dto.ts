import { z } from "zod";
import { Student } from "../../../../datasource/Student/model";
import { Account } from '@/modules/Authentication/datasource/Account/model';

export const listClassroomStudentsInputSchema = z.object({
  classroom_id: z.string().min(1, 'Classroom ID is required'),
  teacher_id: z.string().min(1, 'Teacher ID is required'),
});

export type ListClassroomStudentsInput = z.infer<typeof listClassroomStudentsInputSchema>;

export const listClassroomStudentsOutputSchema = z.array(z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  birth_date: z.date(),
}));

export type ListClassroomStudentsOutput = z.infer<typeof listClassroomStudentsOutputSchema>;