require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ JWT validation middleware
const checkJwt = auth({
  audience: process.env.ASGARDEO_AUDIENCE,
  issuerBaseURL: process.env.ASGARDEO_ISSUER,
  tokenSigningAlg: "RS256"
});

// ✅ RBAC Middleware - Check for admin role
const requireAdmin = (req, res, next) => {
  const groups = req.auth?.groups || [];
  if (groups.includes("admin")) {
    next();
  } else {
    res.status(403).json({ 
      error: "Access denied. Admin role required.",
      yourRoles: groups 
    });
  }
};

// ✅ Public endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to User & Identity Service API",
    team: "Team 1",
    endpoints: {
      public: [
        "GET / - This welcome message"
      ],
      protected: [
        "GET /api/user/profile - Get authenticated user info",
        "GET /api/user/roles - Get user roles"
      ],
      admin: [
        "GET /api/admin/dashboard - Admin-only endpoint"
      ]
    }
  });
});

// ✅ Protected endpoint - Get user profile
app.get("/api/user/profile", checkJwt, (req, res) => {
  res.json({
    message: "✅ User profile retrieved",
    userId: req.auth.sub,
    email: req.auth.email || "N/A",
    username: req.auth.username || "N/A",
    tokenInfo: req.auth
  });
});

// ✅ Protected endpoint - Get user roles
app.get("/api/user/roles", checkJwt, (req, res) => {
  const groups = req.auth?.groups || [];
  res.json({
    userId: req.auth.sub,
    roles: groups,
    isAdmin: groups.includes("admin"),
    isUser: groups.includes("user")
  });
});

// ✅ ADMIN ONLY - Dashboard endpoint
app.get("/api/admin/dashboard", checkJwt, requireAdmin, (req, res) => {
  res.json({
    message: "✅ Admin access granted",
    adminUser: req.auth.sub,
    roles: req.auth.groups,
    serverInfo: {
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform
    }
  });
});

// ✅ Protected endpoint - Test authentication (for microservice communication)
app.get("/api/protected", checkJwt, (req, res) => {
  res.json({
    message: "✅ Authentication successful",
    authenticatedUser: req.auth.sub,
    tokenValid: true
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 User & Identity Service running on http://localhost:${PORT}`);
  console.log(`📝 Team 1: Authentication & RBAC Demo`);
});
