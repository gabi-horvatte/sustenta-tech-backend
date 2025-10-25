import { Request, Response } from "express";
import { getStudentInputSchema } from "../../../application/use-cases/GetStudent/dto";
import GetStudent from '@/modules/Classroom/application/use-cases/GetStudent';

export default class GetStudentController {
  constructor(private readonly getStudent: GetStudent) { }

  async handle(req: Request, res: Response) {

    const validatedInput = getStudentInputSchema.parse({
      student_id: req.params.student_id,
    });
    const result = await this.getStudent.execute(validatedInput);
    if (!result)
      return res.status(404).json({ message: 'Student not found' });

    res.status(200).json(result);
  }
}