import { Request, Response } from "express";
import DeleteActivityTemplate from "../../application/use-cases/DeleteActivityTemplate";
import { deleteActivityTemplateInputSchema } from "../../application/use-cases/DeleteActivityTemplate/dto";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class DeleteActivityTemplateController {
  constructor(private readonly deleteActivityTemplate: DeleteActivityTemplate) {}

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const validatedInput = deleteActivityTemplateInputSchema.parse({
      id: req.params.id,
    });

    const result = await this.deleteActivityTemplate.execute(validatedInput);
    res.status(200).json(result);
  }
}

