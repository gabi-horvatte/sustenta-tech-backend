import { Account } from '@/modules/Authentication/datasource/Account/model';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.debug('Authentication middleware');
  if (req.path === "/login") {
    next();
    return;
  }

  try {
    console.debug('Authentication middleware', { headers: req.headers });
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: "Authentication required. No token found in request context." });

    const account = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & (Account & ({ role: 'STUDENT' } | { role: 'TEACHER', manager: boolean }));
    req.account = account;
    next();
    return;
  } catch (error) {
    next(error);
  }
};