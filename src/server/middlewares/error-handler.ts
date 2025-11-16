import { AuthenticationError } from '@/errors';
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from "zod";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.debug('Error handler');
  if (!err) {
    next();
    return;
  }

  console.log(err);
  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation error", details: err.issues });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({ message: "Authentication required" });
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).json({ message: "Invalid token" });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};