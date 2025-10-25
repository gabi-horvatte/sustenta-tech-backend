import { Request, Response } from "express";
import Login from "../../application/use-cases/Login";
import { AccountNotFoundError, loginInputSchema } from "../../application/use-cases/Login/dto";

export default class LoginController {
  constructor(private readonly login: Login) { }

  async handle(req: Request, res: Response) {
    const validatedInput = loginInputSchema.parse(
      req.body,
    );
    try {
      const result = await this.login.execute(validatedInput);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof AccountNotFoundError)
        return res.status(401).json({ message: 'Account not found' });

      throw error;
    }
  }
}