import { Request, Response } from "express";
import CreateStudent from "../../../application/use-cases/Manager/CreateStudent";
import { createStudentInputSchema } from "../../../application/use-cases/Manager/CreateStudent/dto";

export default class CreateStudentController {
  constructor(private readonly createStudent: CreateStudent) { }

  async handle(req: Request, res: Response) {
    const validatedInput = createStudentInputSchema.parse(req.body);
    const result = await this.createStudent.execute(validatedInput);
    res.status(201).json(result);
  }
}