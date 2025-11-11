import { Request, Response } from "express";
import ListActivitiesAsTeacher from "../../application/use-cases/Teacher/ListActivities";
import ListActivitiesAsStudent from "../../application/use-cases/Student/ListActivities";
import { listActivitiesInputSchema as listActivitiesInputSchemaAsTeacher } from "../../application/use-cases/Teacher/ListActivities/dto";
import { listActivitiesInputSchema as listActivitiesInputSchemaAsStudent } from "../../application/use-cases/Student/ListActivities/dto";
import ListAllTeacherActivities from "../../application/use-cases/Teacher/ListAllTeacherActivities";

export default class ListActivitiesController {
  constructor(private readonly listActivitiesAsTeacher: ListActivitiesAsTeacher, private readonly listActivitiesAsStudent: ListActivitiesAsStudent, private readonly listAllTeacherActivities: ListAllTeacherActivities) { }

  async handle(req: Request, res: Response) {
    console.log('list activities controller');

    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    if (req.account.role === 'TEACHER') {
      if (!req.query.classroom_id) {
        const result = await this.listAllTeacherActivities.execute({ teacher_id: req.account.id });
        return res.status(200).json(result);
      }

      const validatedInput = listActivitiesInputSchemaAsTeacher.parse({
        classroom_id: req.query.classroom_id,
      });
      const result = await this.listActivitiesAsTeacher.execute(validatedInput);
      return res.status(200).json(result);
    } else {
      const validatedInput = listActivitiesInputSchemaAsStudent.parse({
        student_id: req.account.id,
      });
      const result = await this.listActivitiesAsStudent.execute(validatedInput);
      return res.status(200).json(result);
    }
  }
}