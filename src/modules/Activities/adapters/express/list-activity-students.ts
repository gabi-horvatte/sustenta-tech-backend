import { Request, Response } from "express";
import ListActivityStudents from "../../application/use-cases/Teacher/ListActivityStudents";
import { listActivityStudentsInputSchema } from "../../application/use-cases/Teacher/ListActivityStudents/dto";
import GetActivityStudent from '../../application/use-cases/Student/GetActivityStudent';
import { getActivityStudentInputSchema } from '../../application/use-cases/Student/GetActivityStudent/dto';

export default class ListActivityStudentsController {
  constructor(
    private readonly listActivityStudents: ListActivityStudents,
    private readonly getActivityStudent: GetActivityStudent
  ) { }

  async handle(req: Request, res: Response) {

    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    if (req.account.role === 'TEACHER') {

      const validatedInput = listActivityStudentsInputSchema.parse({
        activity_id: req.params.activity_id,
      });
      const result = await this.listActivityStudents.execute(validatedInput);
      return res.status(200).json(result);
    } else {
      const validatedInput = getActivityStudentInputSchema.parse({
        activity_id: req.params.activity_id,
        student_id: req.account.id,
      });
      const result = await this.getActivityStudent.execute(validatedInput);
      return res.status(200).json(result);
    }
  }
}