import { Request, Response } from "express";
import DeleteActivity from "../../application/use-cases/Teacher/DeleteActivity";
import { DeleteActivityInput, deleteActivityInputSchema } from "../../application/use-cases/Teacher/DeleteActivity/dto";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class DeleteActivityController {
  constructor(private readonly deleteActivity: DeleteActivity) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const input: DeleteActivityInput = {
      id: req.params.activity_id,
    };

    const validatedInput = deleteActivityInputSchema.parse(input);
    const result = await this.deleteActivity.execute(validatedInput);
    res.status(200).json(result);
  }
}