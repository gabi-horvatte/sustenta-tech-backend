import { Request, Response } from 'express';
import SubmitStudentAnswers from '../../application/use-cases/SubmitStudentAnswers';
import { submitStudentAnswersInputSchema } from '../../application/use-cases/SubmitStudentAnswers/dto';

export default class SubmitStudentAnswersController {
  constructor(private readonly submitStudentAnswers: SubmitStudentAnswers) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = submitStudentAnswersInputSchema.parse({
        ...req.body,
        activity_id: req.params.activity_id,
      });
      const result = await this.submitStudentAnswers.execute(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error submitting student answers:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
