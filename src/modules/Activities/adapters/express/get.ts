import { Request, Response } from "express";
import GetActivity from "../../application/use-cases/Teacher/GetActivity";
import { getActivityInputSchema } from "../../application/use-cases/Teacher/GetActivity/dto";

export default class GetActivityController {
  constructor(private readonly getActivity: GetActivity) { }

  async handle(req: Request, res: Response) {
    const validatedInput = getActivityInputSchema.parse({
      id: req.params.activity_id,
    });
    const result = await this.getActivity.execute(validatedInput);
    if (!result) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(result);
  }
}