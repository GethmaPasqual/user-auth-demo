import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import logger from '../utils/logger';

/**
 * JWT Validation Middleware
 * Verifies the JWT token from Asgardeo
 */
export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth.jwksUri,
  }) as any,
  audience: config.auth.audience,
  issuer: config.auth.issuer,
  algorithms: [...config.auth.algorithms],
  requestProperty: 'auth',
});

/**
 * Optional JWT Middleware
 * Validates JWT if present, but doesn't fail if missing
 */
export const optionalJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth.jwksUri,
  }) as any,
  audience: config.auth.audience,
  issuer: config.auth.issuer,
  algorithms: [...config.auth.algorithms],
  requestProperty: 'auth',
  credentialsRequired: false,
});

/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the user has the required role
 * @param role - The required role (e.g., 'admin')
 */
export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      logger.warn('RBAC check failed: No authentication data found');
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No authentication data found',
        requiredRole: role,
      });
      return;
    }

    // Handle both string and array formats for roles
    let roles: string[] = [];

    if (typeof req.auth.roles === 'string') {
      roles = req.auth.roles.split(',').map((r: string) => r.trim());
    } else if (Array.isArray(req.auth.roles)) {
      roles = req.auth.roles;
    }

    // Check if user has the required role (case-insensitive)
    const hasRole = roles.some((r) => r.toLowerCase() === role.toLowerCase());

    if (hasRole) {
      logger.info(`✅ Role Check Passed: User has '${role}' role`);
      next();
    } else {
      logger.warn(
        `❌ Role Check Failed: User does not have '${role}' role. User roles: ${roles.join(', ')}`,
      );
      res.status(403).json({
        success: false,
        message: `Forbidden: Requires '${role}' role`,
        requiredRole: role,
        userRoles: roles,
      });
    }
  };
};

/**
 * Extract User ID from JWT
 * Helper middleware to extract and attach user ID to request
 */
export const extractUserId = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.auth && req.auth.sub) {
    req.userId = req.auth.sub;
    logger.debug(`User ID extracted: ${req.userId}`);
  }
  next();
};

/**
 * User ownership check
 * Verifies that the authenticated user owns the resource
 * Used for validating access to specific resources
 */
export const checkOwnership = (getUserIdFromResource: (req: Request) => Promise<string>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth || !req.auth.sub) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: Authentication required',
        });
        return;
      }

      const resourceOwnerId = await getUserIdFromResource(req);
      const currentUserId = req.auth.sub;

      // Check if user is admin (can access any resource)
      const roles = Array.isArray(req.auth.roles)
        ? req.auth.roles
        : typeof req.auth.roles === 'string'
          ? req.auth.roles.split(',').map((r: string) => r.trim())
          : [];

      const isAdmin = roles.some((r: string) => r.toLowerCase() === 'admin');

      if (isAdmin || resourceOwnerId === currentUserId) {
        next();
      } else {
        logger.warn(`Access denied: User ${currentUserId} attempted to access resource owned by ${resourceOwnerId}`);
        res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to access this resource',
        });
      }
    } catch (error) {
      logger.error('Ownership check failed:', error);
      next(error);
    }
  };
};
