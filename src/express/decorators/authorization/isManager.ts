import { Request, Response, NextFunction } from "express";
/**
 * Decorator that verifies if the authenticated account is a manager (TEACHER with manager privileges)
 * @returns Method decorator
 */
export function isManager() {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next?: NextFunction) {
      // Check if account exists in res.locals
      if (!req.account) {
        return res.status(401).json({
          message: "Authentication required. No account found in request context."
        });
      }

      const account = req.account;

      // Check if account has the required role and manager privileges
      if (account.role !== 'TEACHER' || !account.manager) {
        return res.status(403).json({
          message: `Access denied. Required role: TEACHER with manager privileges, but account has role: ${account.role}${account.role === 'TEACHER' && 'manager' in account ? ` (manager: ${account.manager})` : ''}`
        });
      }

      // If role check passes, proceed with the original method
      return await originalMethod.call(this, req, res, next);
    };

    return descriptor;
  };
}

export default isManager;
