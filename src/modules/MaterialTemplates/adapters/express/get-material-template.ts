import { Request, Response } from 'express';
import GetMaterialTemplate from '../../application/use-cases/GetMaterialTemplate';
import { getMaterialTemplateInputSchema } from '../../application/use-cases/GetMaterialTemplate/dto';

export default class GetMaterialTemplateController {
  constructor(private readonly getMaterialTemplate: GetMaterialTemplate) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = getMaterialTemplateInputSchema.parse({ id: req.params.id });
      const result = await this.getMaterialTemplate.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting material template:', error);
      if (error instanceof Error && error.message === 'Material template not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
  }
}



