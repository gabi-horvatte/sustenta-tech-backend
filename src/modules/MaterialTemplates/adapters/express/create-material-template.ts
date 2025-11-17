import { Request, Response } from 'express';
import CreateMaterialTemplate from '../../application/use-cases/CreateMaterialTemplate';
import { createMaterialTemplateInputSchema } from '../../application/use-cases/CreateMaterialTemplate/dto';

export default class CreateMaterialTemplateController {
  constructor(private readonly createMaterialTemplate: CreateMaterialTemplate) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = createMaterialTemplateInputSchema.parse(req.body);
      const result = await this.createMaterialTemplate.execute(input);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating material template:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
