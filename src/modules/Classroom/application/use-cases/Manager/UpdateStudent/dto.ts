import { z } from "zod";

export const updateStudentInputSchema = z.object({
  id: z.string().min(1, 'Student ID is required'),
  classroom_id: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.email('Invalid email format').optional(),
  phone: z.string().optional(),
  birth_date: z.date().or(z.string().transform((str) => new Date(str))).optional(),
});

export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;

export type UpdateStudentOutput = {
  id: string;
  classroom_id: string;
  code: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: Date;
};
