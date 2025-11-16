import { pool } from '@/database/pool';
import { NextFunction, Request, Response } from "express";

export const transactionStartMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.debug('Starting transaction');
    const client = await pool.connect();
    await client.query("BEGIN");
    req.dbClient = client;
    next();
  } catch (error) {
    console.error('Error starting transaction:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};