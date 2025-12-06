# Backend Architecture

## TypeScript Express Backend
Asgardeo JWT authentication with role-based access control.

## Stack
- **TypeScript** - Type safety
- **Express.js** - Web framework  
- **express-jwt** - JWT middleware
- **jwks-rsa** - JWKS client
- **CORS** - Frontend integration

## Structure
\`\`\`
src/
├── config/         # Configuration files
├── middleware/     # Auth & error handlers
├── routes/         # API endpoints
├── types/          # TypeScript definitions
└── server.ts       # Main entry point
\`\`\`

## Authentication Flow
1. Frontend gets JWT from Asgardeo
2. Sends request with \`Authorization: Bearer <token>\`
3. Backend validates using Asgardeo JWKS
4. Extracts user data (email, roles, name)
5. Checks roles if required
6. Returns response

## Endpoints

### Public
- \`GET /health\` - Health check
- \`GET /api/public\` - No auth needed

### Protected
- \`GET /api/private\` - JWT required
- \`GET /api/admin\` - JWT + admin role

## Middleware

**checkJwt**: Validates JWT tokens  
**checkRole**: Validates user roles  
**errorHandler**: Centralized errors

## Configuration
\`src/config/auth.config.ts\`:
- Asgardeo JWKS URI
- Client ID & issuer
- Server port & CORS origin

## Integration
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- CORS enabled for seamless communication
