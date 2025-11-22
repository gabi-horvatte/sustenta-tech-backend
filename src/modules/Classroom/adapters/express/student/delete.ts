import { Request, Response } from "express";
import DeleteStudent from "../../../application/use-cases/Manager/DeleteStudent";
import { deleteStudentInputSchema } from "../../../application/use-cases/Manager/DeleteStudent/dto";

export default class DeleteStudentController {
  constructor(private readonly deleteStudent: DeleteStudent) {}

  async handle(req: Request, res: Response) {
    const validatedInput = deleteStudentInputSchema.parse({
      id: req.params.student_id,
    });

    const result = await this.deleteStudent.execute(validatedInput);
    res.status(200).json(result);
  }
}
