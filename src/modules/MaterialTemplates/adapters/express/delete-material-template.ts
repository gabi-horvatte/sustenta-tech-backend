import { Request, Response } from "express";
import DeleteMaterialTemplate from "../../application/use-cases/DeleteMaterialTemplate";
import { deleteMaterialTemplateInputSchema } from "../../application/use-cases/DeleteMaterialTemplate/dto";
import hasRole from '@/server/decorators/authorization/hasRole';

export default class DeleteMaterialTemplateController {
  constructor(private readonly deleteMaterialTemplate: DeleteMaterialTemplate) {}

  @hasRole('TEACHER')
  async handle(req: Request, res: Response) {
    const validatedInput = deleteMaterialTemplateInputSchema.parse({
      id: req.params.id,
    });

    const result = await this.deleteMaterialTemplate.execute(validatedInput);
    res.status(200).json(result);
  }
}
