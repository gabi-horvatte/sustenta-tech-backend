import { Request, Response } from 'express';
import ListStudentActivitiesWithScores from '../../application/use-cases/Student/ListStudentActivitiesWithScores';
import { listStudentActivitiesWithScoresInputSchema } from '../../application/use-cases/Student/ListStudentActivitiesWithScores/dto';

export default class ListStudentActivitiesWithScoresController {
  constructor(private readonly listStudentActivitiesWithScores: ListStudentActivitiesWithScores) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = listStudentActivitiesWithScoresInputSchema.parse({
        student_id: req.query.student_id,
      });
      const result = await this.listStudentActivitiesWithScores.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error listing student activities with scores:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
