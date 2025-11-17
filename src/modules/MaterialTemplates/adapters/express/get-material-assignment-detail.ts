import { Request, Response } from 'express';
import GetMaterialAssignmentDetail from '../../application/use-cases/GetMaterialAssignmentDetail';
import { getMaterialAssignmentDetailInputSchema } from '../../application/use-cases/GetMaterialAssignmentDetail/dto';

export default class GetMaterialAssignmentDetailController {
  constructor(private readonly getMaterialAssignmentDetail: GetMaterialAssignmentDetail) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = getMaterialAssignmentDetailInputSchema.parse({
        assignment_id: req.params.assignment_id,
      });
      const result = await this.getMaterialAssignmentDetail.execute(input);
      
      if (!result) {
        res.status(404).json({ error: 'Material assignment not found' });
        return;
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting material assignment detail:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
