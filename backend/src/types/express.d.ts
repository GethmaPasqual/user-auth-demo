import { Request } from 'express';

/**
 * JWT Token Data from Asgardeo
 */
export interface JWTPayload {
  sub: string;
  aut: string;
  binding_type: string;
  roles: string | string[];
  iss: string;
  given_name?: string;
  family_name?: string;
  client_id: string;
  aud: string;
  nbf: number;
  azp: string;
  org_id: string;
  scope: string;
  exp: number;
  org_name: string;
  iat: number;
  binding_ref: string;
  jti: string;
  email: string;
  username: string;
  preferred_username?: string;
  org_handle: string;
}

/**
 * Extend Express Request to include auth property
 */
declare global {
  namespace Express {
    interface Request {
      auth?: JWTPayload;
    }
  }
}
