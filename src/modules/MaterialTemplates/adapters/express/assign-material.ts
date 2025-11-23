import { Request, Response } from 'express';
import AssignMaterial from '../../application/use-cases/AssignMaterial';
import { assignMaterialInputSchema } from '../../application/use-cases/AssignMaterial/dto';
import hasRole from '@/server/decorators/authorization/hasRole';

export default class AssignMaterialController {
  constructor(private readonly assignMaterial: AssignMaterial) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = assignMaterialInputSchema.parse({
        ...req.body,
        assigned_by: req.body.assigned_by || req.account?.id,
      });
      const result = await this.assignMaterial.execute(input);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error assigning material:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
