import { Request, Response } from 'express';
import UpdateActivityTemplate from '../../application/use-cases/UpdateActivityTemplate';
import { updateActivityTemplateInputSchema } from '../../application/use-cases/UpdateActivityTemplate/dto';

export default class UpdateActivityTemplateController {
  constructor(private readonly updateActivityTemplate: UpdateActivityTemplate) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = updateActivityTemplateInputSchema.parse({
        id: req.params.id,
        ...req.body
      });
      const result = await this.updateActivityTemplate.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error updating activity template:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
