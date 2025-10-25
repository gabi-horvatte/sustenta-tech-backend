import { z } from 'zod';

export const deleteAccountInputSchema = z.object({
  id: z.string().min(1, 'Id is required'),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountInputSchema>;

export type DeleteAccountOutput = {
  id: string;
};