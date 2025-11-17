import { Request, Response } from 'express';
import ListMaterialTemplates from '../../application/use-cases/ListMaterialTemplates';
import { listMaterialTemplatesInputSchema } from '../../application/use-cases/ListMaterialTemplates/dto';

export default class ListMaterialTemplatesController {
  constructor(private readonly listMaterialTemplates: ListMaterialTemplates) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = listMaterialTemplatesInputSchema.parse(req.query);
      const result = await this.listMaterialTemplates.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error listing material templates:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
