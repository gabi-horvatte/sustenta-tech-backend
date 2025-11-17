import { Request, Response } from 'express';
import CompleteMaterial from '../../application/use-cases/CompleteMaterial';
import { completeMaterialInputSchema } from '../../application/use-cases/CompleteMaterial/dto';

export default class CompleteMaterialController {
  constructor(private readonly completeMaterial: CompleteMaterial) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = completeMaterialInputSchema.parse({
        material_assignment_id: req.params.assignment_id,
        student_id: req.body.student_id,
      });
      const result = await this.completeMaterial.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error completing material:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
