import { Request, Response, NextFunction } from "express";
import CreateTeacher from "../../../application/use-cases/Manager/CreateTeacher";
import { createTeacherInputSchema } from "../../../application/use-cases/Manager/CreateTeacher/dto";
import isManager from '@/express/decorators/authorization/isManager';

export default class CreateTeacherController {
  constructor(private readonly createTeacher: CreateTeacher) { }

  @isManager()
  async handle(req: Request, res: Response, next: NextFunction) {
    const validatedInput = createTeacherInputSchema.parse(req.body);
    const result = await this.createTeacher.execute(validatedInput);
    res.status(201).json(result);
  }
}