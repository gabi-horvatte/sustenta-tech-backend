import { Request, Response } from 'express';
import { getMaterialReportsInputSchema } from '../../application/use-cases/GetMaterialReports/dto';
import GetMaterialReports from '../../application/use-cases/GetMaterialReports';

export default class GetMaterialReportsController {
  constructor(private readonly getMaterialReports: GetMaterialReports) {}

  async handle(req: Request, res: Response): Promise<void> {
    const input = getMaterialReportsInputSchema.parse({
      teacher_id: req.query.teacher_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    });

    const result = await this.getMaterialReports.execute(input);

    res.json(result);
  }
}
