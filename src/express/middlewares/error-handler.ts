import { NextFunction, Request, Response } from "express";
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
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};