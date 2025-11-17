import { Request, Response } from 'express';
import ListMaterialAssignments from '../../application/use-cases/ListMaterialAssignments';
import { listMaterialAssignmentsInputSchema } from '../../application/use-cases/ListMaterialAssignments/dto';

export default class ListMaterialAssignmentsController {
  constructor(private readonly listMaterialAssignments: ListMaterialAssignments) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = listMaterialAssignmentsInputSchema.parse(req.query);
      const result = await this.listMaterialAssignments.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error listing material assignments:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
