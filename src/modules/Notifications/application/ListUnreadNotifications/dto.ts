import { z } from 'zod';

export const listUnreadNotificationsInputSchema = z.object({
  account_id: z.string().min(1, 'Account ID is required'),
});

export type ListUnreadNotificationsInput = z.infer<typeof listUnreadNotificationsInputSchema>;

export type ListUnreadNotificationsOutput = {
  id: string;
  account_id: string;
  message: string;
  url: string | null;
}[];  