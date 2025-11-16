import { Request, Response } from "express";
import EditActivity from "../../application/use-cases/Teacher/EditActivity";
import { EditActivityInput, editActivityInputSchema } from "../../application/use-cases/Teacher/EditActivity/dto";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class EditActivityController {
  constructor(private readonly editActivity: EditActivity) { }

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const input: EditActivityInput = {
      ...req.body,
      id: req.params.activity_id,
    };
    const validatedInput = editActivityInputSchema.parse(input);
    const result = await this.editActivity.execute(validatedInput);
    res.status(200).json(result);
  }
}