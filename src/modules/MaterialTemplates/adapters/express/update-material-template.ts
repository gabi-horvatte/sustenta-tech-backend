import { Request, Response } from 'express';
import UpdateMaterialTemplate from '../../application/use-cases/UpdateMaterialTemplate';
import { updateMaterialTemplateInputSchema } from '../../application/use-cases/UpdateMaterialTemplate/dto';

export default class UpdateMaterialTemplateController {
  constructor(private readonly updateMaterialTemplate: UpdateMaterialTemplate) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = updateMaterialTemplateInputSchema.parse({
        id: req.params.id,
        ...req.body
      });
      const result = await this.updateMaterialTemplate.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error updating material template:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}


