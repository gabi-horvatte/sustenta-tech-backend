import { Request, Response } from 'express';
import AssignMaterial from '../../application/use-cases/AssignMaterial';
import { assignMaterialInputSchema } from '../../application/use-cases/AssignMaterial/dto';

export default class AssignMaterialController {
  constructor(private readonly assignMaterial: AssignMaterial) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = assignMaterialInputSchema.parse(req.body);
      const result = await this.assignMaterial.execute(input);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error assigning material:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
