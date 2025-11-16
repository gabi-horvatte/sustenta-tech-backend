import { Request, Response } from "express";
import ListClassroomStudents from "../../../application/use-cases/Teacher/ListClassroomStudents";
import { listClassroomStudentsInputSchema } from "../../../application/use-cases/Teacher/ListClassroomStudents/dto";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class ListClassroomStudentsController {
  constructor(private readonly listClassroomStudents: ListClassroomStudents) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const teacher_id = req.account?.id;
    if (!teacher_id)
      return res.status(401).json({ message: "Authentication required. No teacher id found in request context." });

    const validatedInput = listClassroomStudentsInputSchema.parse({
      classroom_id: req.query.classroom_id,
      teacher_id,
      manager: 'manager' in req.account! ? req.account.manager : false,
    });

    const result = await this.listClassroomStudents.execute(validatedInput);
    res.status(200).json(result);
  }
}