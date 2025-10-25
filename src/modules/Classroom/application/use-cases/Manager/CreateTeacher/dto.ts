import { z } from 'zod';

export const createTeacherInputSchema = z.object({
  id: z.string().optional().nullable(),
  manager: z.boolean(),
  name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone is required'),
  birth_date: z.date().or(z.iso.date()),
});

export type CreateTeacherInput = z.infer<typeof createTeacherInputSchema>;

export type CreateTeacherOutput = {
  id: string;
  manager: boolean;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: Date;
};