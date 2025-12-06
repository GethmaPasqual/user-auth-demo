# Express TypeScript Backend

TypeScript-based Express.js backend with Asgardeo JWT authentication and RBAC.

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

Server: **http://localhost:8080**

## 📁 Structure

\`\`\`
src/
├── config/auth.config.ts       # Asgardeo configuration
├── middleware/
│   ├── auth.middleware.ts      # JWT & RBAC
│   └── error.middleware.ts     # Error handling
├── routes/api.routes.ts        # API endpoints
├── types/express.d.ts          # TypeScript types
└── server.ts                   # Main app
\`\`\`

## 📝 Commands

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Development (auto-reload) |
| \`npm run build\` | Compile TypeScript |
| \`npm start\` | Run production build |
| \`npm run typecheck\` | Type checking |

## 📡 API Endpoints

| Endpoint | Auth | Role | Description |
|----------|------|------|-------------|
| \`GET /health\` | ❌ | - | Health check |
| \`GET /api/public\` | ❌ | - | Public data |
| \`GET /api/private\` | ✅ | - | User data |
| \`GET /api/admin\` | ✅ | admin | Admin data |

## 🔐 Authentication

- **Provider**: Asgardeo
- **Client ID**: KYEfJzks5uXRratlXxNpS9dvpRQa
- **Algorithm**: RS256
- **JWKS**: https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks

## 🧪 Testing

\`\`\`bash
# Public
curl http://localhost:8080/api/public

# Private (with JWT)
curl -H "Authorization: Bearer TOKEN" http://localhost:8080/api/private

# Admin (with admin JWT)
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:8080/api/admin
\`\`\`

## 🛠️ Tech Stack

- TypeScript
- Express.js
- express-jwt
- jwks-rsa
- CORS

## 🔧 Configuration

Edit \`src/config/auth.config.ts\`:
- Server port (default: 8080)
- CORS origin (default: http://localhost:3000)

## 🔗 Frontend Connection

- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- CORS pre-configured
