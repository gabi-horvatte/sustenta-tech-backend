import { Request, Response } from "express";
import ListUnreadNotifications from "../../application/ListUnreadNotifications";
import { listUnreadNotificationsInputSchema } from '../../application/ListUnreadNotifications/dto';

export default class ListUnreadNotificationsController {
  constructor(private readonly listUnreadNotifications: ListUnreadNotifications) { }

  async handle(req: Request, res: Response) {
    if (!req.account)
      return res.status(401).json({ message: "Authentication required. No account found in request context." });

    const validatedInput = listUnreadNotificationsInputSchema.parse({
      account_id: req.account.id,
    });
    const result = await this.listUnreadNotifications.execute(validatedInput);
    res.status(200).json(result);
  }
}