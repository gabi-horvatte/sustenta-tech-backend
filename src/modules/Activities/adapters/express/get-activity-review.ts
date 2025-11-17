import { Request, Response } from 'express';
import GetActivityReview from '../../application/use-cases/GetActivityReview';
import { getActivityReviewInputSchema } from '../../application/use-cases/GetActivityReview/dto';

export default class GetActivityReviewController {
  constructor(private readonly getActivityReview: GetActivityReview) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const input = getActivityReviewInputSchema.parse({
        activity_id: req.params.activity_id,
        student_id: req.query.studentId,
      });
      
      const result = await this.getActivityReview.execute(input);
      
      if (!result) {
        res.status(404).json({ error: 'Activity review not found or student has not completed the activity' });
        return;
      }
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting activity review:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
