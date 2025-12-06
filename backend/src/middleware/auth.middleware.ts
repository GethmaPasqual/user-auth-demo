import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { authConfig } from '../config/auth.config';

/**
 * JWT Validation Middleware
 * Verifies the JWT token from Asgardeo
 */
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: authConfig.jwksUri
  }) as any,
  audience: authConfig.audience,
  issuer: authConfig.issuer,
  algorithms: [...authConfig.algorithms]
});

/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the user has the required role
 * @param role - The required role (e.g., 'admin')
 */
export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        message: 'Unauthorized: No authentication data found',
        requiredRole: role
      });
      return;
    }

    // Handle both string and array formats for roles
    let roles: string[] = [];
    
    if (typeof req.auth.roles === 'string') {
      roles = req.auth.roles.split(',').map(r => r.trim());
    } else if (Array.isArray(req.auth.roles)) {
      roles = req.auth.roles;
    }

    // Check if user has the required role (case-insensitive)
    const hasRole = roles.some(r => r.toLowerCase() === role.toLowerCase());
    
    if (hasRole) {
      console.log(`✅ Role Check Passed: User has '${role}' role`);
      next();
    } else {
      res.status(403).json({ 
        message: `Forbidden: Requires ${role} role`,
        yourRoles: roles,
        requiredRole: role
      });
    }
  };
};
