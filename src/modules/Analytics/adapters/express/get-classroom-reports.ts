import { Request, Response } from 'express';
import { getClassroomReportsInputSchema } from '../../application/use-cases/GetClassroomReports/dto';
import GetClassroomReports from '../../application/use-cases/GetClassroomReports';

export default class GetClassroomReportsController {
  constructor(private readonly getClassroomReports: GetClassroomReports) {}

  async handle(req: Request, res: Response): Promise<void> {
    const input = getClassroomReportsInputSchema.parse({
      teacher_id: req.query.teacher_id,
      classroom_id: req.query.classroom_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    });

    const result = await this.getClassroomReports.execute(input);

    res.json(result);
  }
}
