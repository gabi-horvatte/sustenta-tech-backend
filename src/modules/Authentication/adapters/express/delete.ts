import { Request, Response } from "express";
import DeleteAccount from "../../application/use-cases/DeleteAccount";
import { DeleteAccountInput, deleteAccountInputSchema } from "../../application/use-cases/DeleteAccount/dto";
import isManager from '@/server/decorators/authorization/isManager';

export default class DeleteAccountController {
  constructor(private readonly deleteAccount: DeleteAccount) { }

  @isManager()
  async handle(req: Request, res: Response) {
    const input: DeleteAccountInput = {
      id: req.params.account_id,
    };
    const validatedInput = deleteAccountInputSchema.parse(input);
    const result = await this.deleteAccount.execute(validatedInput);
    res.status(200).json(result);
  }
}