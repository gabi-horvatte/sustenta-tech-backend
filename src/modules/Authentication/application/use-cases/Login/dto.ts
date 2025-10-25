import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string('Password is required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export type LoginOutput = {
  access_token: string;
};

export class AccountNotFoundError extends Error {
  constructor() {
    super('Account not found');
  }
}