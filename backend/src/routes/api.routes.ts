import { Router, Request, Response } from 'express';
import { checkJwt, checkRole } from '../middleware/auth.middleware';

const router = Router();

/**
 * Public endpoint - No authentication required
 */
router.get('/public', (_req: Request, res: Response) => {
  res.json({ 
    message: "This is a public endpoint. Anyone can see this.",
    timestamp: new Date().toISOString()
  });
});

/**
 * Private endpoint - Requires valid JWT token
 */
router.get('/private', checkJwt, (req: Request, res: Response) => {
  if (!req.auth) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Normalize roles to array format for response
  let roles: string[] = [];
  if (typeof req.auth.roles === 'string') {
    roles = req.auth.roles.split(',').map(r => r.trim());
  } else if (Array.isArray(req.auth.roles)) {
    roles = req.auth.roles;
  }
  
  res.json({ 
    message: "This is a private endpoint. You are logged in!",
    user: req.auth.sub || req.auth.preferred_username,
    username: req.auth.username,
    email: req.auth.email,
    roles: roles,
    tokenData: req.auth
  });
});

/**
 * Admin endpoint - Requires valid JWT token AND admin role
 */
router.get('/admin', checkJwt, checkRole('admin'), (req: Request, res: Response) => {
  if (!req.auth) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Normalize roles to array format for response
  let roles: string[] = [];
  if (typeof req.auth.roles === 'string') {
    roles = req.auth.roles.split(',').map(r => r.trim());
  } else if (Array.isArray(req.auth.roles)) {
    roles = req.auth.roles;
  }
  
  res.json({ 
    message: "This is an ADMIN-ONLY endpoint. Welcome, admin!",
    user: req.auth.sub || req.auth.preferred_username,
    username: req.auth.username,
    email: req.auth.email,
    roles: roles,
    tokenData: req.auth
  });
});

export default router;
