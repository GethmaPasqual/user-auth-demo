const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from React app (http://localhost:3000)
app.use(express.json());

// --- 1. JWT Validation Middleware ---
// This 'bouncer' checks every token
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    // This JWKS URL is from your provided endpoint list
    jwksUri: "https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks"
  }),
  // This audience is your Client ID
  audience: "KYEfJzks5uXRratlXxNpS9dvpRQa",
  // This issuer is the Base URL
  issuer: "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  algorithms: ["RS256"] // Asgardeo uses RS256
});

// --- 2. RBAC (Role Check) Middleware ---
// This 'VIP list' checks for specific roles
const checkRole = (role) => {
  return (req, res, next) => {
    // The token data is in req.auth (added by checkJwt)
    // Your screenshot shows 'Roles' are available. Let's check them.
    const roles = req.auth.roles || [];

    // Your screenshot shows a role named "Admin"
    if (roles.includes(role)) {
      next(); // User has the role, proceed
    } else {
      res.status(403).json({ 
        message: "Forbidden: Requires admin role",
        yourRoles: roles 
      });
    }
  };
};

// --- 3. API Endpoints ---

// Public: No 'checkJwt' middleware
app.get('/api/public', (req, res) => {
  res.json({ 
    message: "This is a public endpoint. Anyone can see this.",
    timestamp: new Date().toISOString()
  });
});

// Private: Requires a valid token (Task 2)
app.get('/api/private', checkJwt, (req, res) => {
  // If we get here, checkJwt passed
  res.json({ 
    message: "This is a private endpoint. You are logged in!",
    user: req.auth.sub || req.auth.preferred_username,
    tokenData: req.auth
  });
});

// Admin: Requires valid token AND 'Admin' role (Task 3)
app.get('/api/admin', checkJwt, checkRole('Admin'), (req, res) => {
  // If we get here, both checkJwt and checkRole('Admin') passed
  res.json({ 
    message: "This is an ADMIN-ONLY endpoint. Welcome, admin!",
    user: req.auth.sub || req.auth.preferred_username,
    roles: req.auth.roles,
    tokenData: req.auth
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ 
      error: 'Invalid token or unauthorized',
      message: err.message 
    });
  } else {
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

// --- 4. Start Server ---
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Express server listening on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /api/public (No auth required)`);
  console.log(`   - GET /api/private (JWT required)`);
  console.log(`   - GET /api/admin (JWT + Admin role required)`);
});
