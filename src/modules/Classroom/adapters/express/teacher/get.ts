import { Request, Response } from "express";
import GetTeacher from "../../../application/use-cases/Teacher/GetTeacher";
import { getTeacherInputSchema } from "../../../application/use-cases/Teacher/GetTeacher/dto";
import hasRole from '@/express/decorators/authorization/hasRole';

export default class GetTeacherController {
  constructor(private readonly getTeacher: GetTeacher) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const validatedInput = getTeacherInputSchema.parse({
      teacher_id: req.params.teacher_id,
    });
    const result = await this.getTeacher.execute(validatedInput);
    if (!result)
      return res.status(404).json({ message: 'Teacher not found' });

    res.status(200).json(result);
  }
}