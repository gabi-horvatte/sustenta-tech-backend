import { Request, Response } from "express";
import CompleteMaterialAssignment from '../../application/use-cases/CompleteMaterialAssignment';
import { completeMaterialAssignmentInputSchema } from '../../application/use-cases/CompleteMaterialAssignment/dto';
import hasRole from '@/express/decorators/authorization/hasRole';

export default class CompleteMaterialController {
  constructor(private readonly completeMaterialAssignment: CompleteMaterialAssignment) { }

  @hasRole('STUDENT')
  async handle(req: Request, res: Response) {
    const validatedInput = completeMaterialAssignmentInputSchema.parse({
      id: req.params.id,
      student_id: req.account?.id,
    });
    const result = await this.completeMaterialAssignment.execute(validatedInput);
    res.status(200).json(result);
  }
}