import { z } from 'zod';

export const editOwnProfileInputSchema = z.object({
  id: z.string().min(1, 'Id is required'),
  name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone is required'),
  birth_date: z.date(),
});

export type EditOwnProfileInput = z.infer<typeof editOwnProfileInputSchema>;

export type EditOwnProfileOutput = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: Date;
};