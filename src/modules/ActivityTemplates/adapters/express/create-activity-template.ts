import { Request, Response } from 'express';
import CreateActivityTemplate from '../../application/use-cases/CreateActivityTemplate';
import { createActivityTemplateInputSchema } from '../../application/use-cases/CreateActivityTemplate/dto';

export default class CreateActivityTemplateController {
  constructor(private readonly createActivityTemplate: CreateActivityTemplate) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = createActivityTemplateInputSchema.parse(req.body);
      const result = await this.createActivityTemplate.execute(input);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating activity template:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
