import { Request, Response } from 'express';
import ListActivityTemplates from '../../application/use-cases/ListActivityTemplates';
import { listActivityTemplatesInputSchema } from '../../application/use-cases/ListActivityTemplates/dto';

export default class ListActivityTemplatesController {
  constructor(private readonly listActivityTemplates: ListActivityTemplates) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = listActivityTemplatesInputSchema.parse(req.query);
      const result = await this.listActivityTemplates.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error listing activity templates:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
