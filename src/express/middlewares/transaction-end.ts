import { NextFunction, Request, Response } from "express";

// Regular middleware for successful transactions
export const transactionEndMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.debug('Transaction end middleware - committing');
  const client = req.dbClient;

  try {
    await client.query("COMMIT");
  } catch (caughtError) {
    console.error('Error committing transaction:', caughtError);
  } finally {
    client.release();
    next();
  }
};

// Error middleware for failed transactions
export const transactionErrorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.debug('Transaction error middleware - rolling back');
  const client = req.dbClient;

  try {
    await client.query("ROLLBACK");
  } catch (caughtError) {
    console.error('Error rolling back transaction:', caughtError);
  } finally {
    client.release();
    next(error);
  }
};
