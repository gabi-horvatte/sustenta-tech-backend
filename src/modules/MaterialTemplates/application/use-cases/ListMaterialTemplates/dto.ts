import { z } from 'zod';

export const listMaterialTemplatesInputSchema = z.object({
  created_by: z.string().optional(),
});

export type ListMaterialTemplatesInput = z.infer<typeof listMaterialTemplatesInputSchema>;

export type ListMaterialTemplatesOutput = {
  id: string;
  name: string;
  description: string;
  authors: string;
  url: string;
  thumbnail: string | null;
  material_type: string;
  created_by: string;
  created_at: Date;
}[];
