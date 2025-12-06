import { Request, Response, NextFunction } from 'express';

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err);

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ 
      error: 'Invalid token or unauthorized',
      message: err.message 
    });
    return;
  }

  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
};
