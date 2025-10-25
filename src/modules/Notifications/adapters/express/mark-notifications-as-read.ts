import { Request, Response } from "express";
import MarkNotificationsAsRead from '../../application/MarkNotificationsAsRead';
import { MarkNotificationsAsReadInput, markNotificationsAsReadInputSchema } from '../../application/MarkNotificationsAsRead/dto';

export default class MarkNotificationsAsReadController {
  constructor(private readonly markNotificationsAsRead: MarkNotificationsAsRead) { }

  async handle(req: Request, res: Response) {
    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    const input: MarkNotificationsAsReadInput = {
      ...req.body,
      account_id: req.account.id,
    };
    const validatedInput = markNotificationsAsReadInputSchema.parse(input);
    const result = await this.markNotificationsAsRead.execute(validatedInput);
    res.status(200).json(result);
  }
}