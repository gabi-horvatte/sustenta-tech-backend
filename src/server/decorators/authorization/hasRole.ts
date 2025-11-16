import { Request, Response, NextFunction } from "express";
import { Account } from "../../../modules/Authentication/datasource/Account/model";

/**
 * Decorator that verifies if the authenticated account has the required role
 * @param requiredRole The role required to access the endpoint
 * @returns Method decorator
 */
export function hasRole(requiredRole: Account['role']) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next?: NextFunction) {
      try {
        // Check if account exists in res.locals
        if (!req.account) {
          console.error("Authentication required. No account found in request context.");
          return res.status(401).json({
            message: "Authentication required. No account found in request context."
          });
        }

        const account = req.account;

        // Check if account has the required role
        if (account.role !== requiredRole) {
          return res.status(403).json({
            message: `Access denied. Required role: ${requiredRole}, but account has role: ${account.role}`
          });
        }

        // If role check passes, proceed with the original method
        return await method.call(this, req, res, next);
      } catch (error) {
        // Handle any errors that occur during role verification
        if (next) {
          next(error);
        } else {
          console.error(error);
          return res.status(500).json({
            message: "Internal server error during role verification"
          });
        }
      }
    };

    return descriptor;
  };
}

export default hasRole;
