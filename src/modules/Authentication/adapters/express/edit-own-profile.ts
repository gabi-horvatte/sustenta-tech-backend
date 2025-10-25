import { Request, Response } from "express";
import { ZodError } from "zod";
import EditOwnProfile from "../../application/use-cases/EditOwnProfile";
import { editOwnProfileInputSchema } from "../../application/use-cases/EditOwnProfile/dto";

export default class EditOwnProfileController {
  constructor(private readonly editOwnProfile: EditOwnProfile) { }

  async handle(req: Request, res: Response) {
    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    const validatedInput = editOwnProfileInputSchema.parse({
      ...req.body,
      id: req.account.id,
    });
    const result = await this.editOwnProfile.execute(validatedInput);
    res.status(200).json(result);
  }
}