import { z } from 'zod';

export const markNotificationsAsReadInputSchema = z.object({
  ids: z.array(z.string().min(1, 'ID is required')),
  account_id: z.string().min(1, 'Account ID is required'),
});

export type MarkNotificationsAsReadInput = z.infer<typeof markNotificationsAsReadInputSchema>;

export type MarkNotificationsAsReadOutput = {
  ids: string[];
};  