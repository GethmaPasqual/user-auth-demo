/**
 * Extended Express Request type with JWT authentication data
 */
declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub?: string; // User ID
        email?: string;
        username?: string;
        given_name?: string;
        family_name?: string;
        roles?: string | string[];
        aud?: string;
        iss?: string;
        exp?: number;
        iat?: number;
        [key: string]: any;
      };
      userId?: string; // Extracted user ID for convenience
    }
  }
}

export {};
