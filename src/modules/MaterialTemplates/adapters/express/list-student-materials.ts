import { Request, Response } from 'express';
import ListStudentMaterials from '../../application/use-cases/ListStudentMaterials';
import { listStudentMaterialsInputSchema } from '../../application/use-cases/ListStudentMaterials/dto';

export default class ListStudentMaterialsController {
  constructor(private readonly listStudentMaterials: ListStudentMaterials) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = listStudentMaterialsInputSchema.parse({
        student_id: req.query.student_id || req.params.student_id,
      });
      const result = await this.listStudentMaterials.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error listing student materials:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
