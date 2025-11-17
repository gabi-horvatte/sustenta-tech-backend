import { z } from 'zod';

export const listMaterialAssignmentsInputSchema = z.object({
  classroom_id: z.string().optional(),
  assigned_by: z.string().optional(),
});

export type ListMaterialAssignmentsInput = z.infer<typeof listMaterialAssignmentsInputSchema>;

export type ListMaterialAssignmentsOutput = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  material_type: string;
  expires_at: Date;
  created_at: Date;
  classroom_id: string;
  classroom_name: string;
}[];
