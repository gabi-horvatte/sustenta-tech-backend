import { Request, Response } from "express";
import UpdateStudent from "../../../application/use-cases/Manager/UpdateStudent";
import { updateStudentInputSchema } from "../../../application/use-cases/Manager/UpdateStudent/dto";

export default class UpdateStudentController {
  constructor(private readonly updateStudent: UpdateStudent) {}

  async handle(req: Request, res: Response) {
    const validatedInput = updateStudentInputSchema.parse({
      ...req.body,
      id: req.params.student_id,
    });
    const result = await this.updateStudent.execute(validatedInput);
    res.status(200).json(result);
  }
}
