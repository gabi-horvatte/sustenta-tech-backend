import { Request, Response } from "express";
import CompleteActivity from "../../application/use-cases/Student/CompleteActivity";
import hasRole from '@/server/decorators/authorization/hasRole';
import { completeActivityInputSchema } from '../../application/use-cases/Student/CompleteActivity/dto';

export default class CompleteActivityController {
  constructor(private readonly completeActivity: CompleteActivity) { }

  @hasRole('STUDENT')
  async handle(req: Request, res: Response) {
    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    const validatedInput = completeActivityInputSchema.parse({
      activity_id: req.params.activity_id,
      student_id: req.account.id,
    });

    const result = await this.completeActivity.execute(validatedInput);
    res.status(200).json(result);
  }
}