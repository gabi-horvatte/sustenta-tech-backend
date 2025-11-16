import { Request, Response } from "express";
import CreateActivity from "../../application/use-cases/Teacher/CreateActivity";
import { createActivityInputSchema } from "../../application/use-cases/Teacher/CreateActivity/dto";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class CreateActivityController {
  constructor(private readonly createActivity: CreateActivity) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const validatedInput = createActivityInputSchema.parse(req.body);
    const result = await this.createActivity.execute(validatedInput);
    res.status(200).json(result);
  }
}