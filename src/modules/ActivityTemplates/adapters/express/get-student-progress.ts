import { Request, Response } from 'express';
import GetStudentProgress from '../../application/use-cases/GetStudentProgress';
import { getStudentProgressInputSchema } from '../../application/use-cases/GetStudentProgress/dto';

export default class GetStudentProgressController {
  constructor(private readonly getStudentProgress: GetStudentProgress) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = getStudentProgressInputSchema.parse({
        activity_id: req.params.activity_id,
        student_id: req.query.student_id,
      });
      const result = await this.getStudentProgress.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting student progress:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
