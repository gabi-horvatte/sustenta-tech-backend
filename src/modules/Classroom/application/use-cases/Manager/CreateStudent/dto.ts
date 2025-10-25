import { z } from "zod";

export const createStudentInputSchema = z.object({
  id: z.string().optional().nullable(),
  classroom_id: z.string().min(1, 'Classroom ID is required'),
  name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone is required'),
  birth_date: z.date('Birth date is required').or(z.iso.date()),
  code: z.string().min(1, 'Code is required'),
});

export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export type CreateStudentOutput = {
  id: string;
  classroom_id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: Date;
  code: string;
};
