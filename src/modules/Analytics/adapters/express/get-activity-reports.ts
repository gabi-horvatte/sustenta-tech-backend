import { Request, Response } from 'express';
import { getActivityReportsInputSchema } from '../../application/use-cases/GetActivityReports/dto';
import GetActivityReports from '../../application/use-cases/GetActivityReports';

export default class GetActivityReportsController {
  constructor(private readonly getActivityReports: GetActivityReports) {}

  async handle(req: Request, res: Response): Promise<void> {
    const input = getActivityReportsInputSchema.parse({
      teacher_id: req.query.teacher_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    });

    const result = await this.getActivityReports.execute(input);

    res.json(result);
  }
}
