import { Request, Response } from "express";
import ListStudentActivities from "../../application/use-cases/Student/ListStudentActivities";
import { listStudentActivitiesInputSchema } from '../../application/use-cases/Student/ListStudentActivities/dto';

export default class ListStudentActivitiesController {
  constructor(
    private readonly listStudentActivities: ListStudentActivities,
  ) { }

  async handle(req: Request, res: Response) {

    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    if (req.account.role === 'STUDENT') {
      const result = await this.listStudentActivities.execute({
        student_id: req.account.id,
      });
      return res.status(200).json(result);
    } else {
      const validatedInput = listStudentActivitiesInputSchema.parse({
        student_id: req.query.student_id,
      });
      const result = await this.listStudentActivities.execute(validatedInput);
      return res.status(200).json(result);
    }
  }
}