require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const { requireRole, requireAdmin, requireUser } = require("./middleware/roleCheck");
const { getUserInfo, hasRole, isAdmin } = require("./utils/authUtils");

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

// ✅ Middleware to validate JWT Access Tokens issued by Asgardeo
const checkJwt = auth({
  audience: process.env.ASGARDEO_AUDIENCE,
  issuerBaseURL: process.env.ASGARDEO_ISSUER,
  tokenSigningAlg: "RS256"
});

// ✅ Public endpoint (no authentication)
app.get("/", (req, res) => {
  res.send("Welcome to the backend API. Use /api/protected to test authentication.");
});

// ✅ Protected endpoint (requires valid token)
app.get("/api/protected", checkJwt, (req, res) => {
  const userInfo = getUserInfo(req);
  res.json({
    message: "✅ Access granted",
    user: userInfo
  });
});

// ✅ Get current user information
app.get("/api/user/me", checkJwt, (req, res) => {
  const userInfo = getUserInfo(req);
  res.json({
    success: true,
    user: userInfo
  });
});

// ✅ Admin only endpoint
app.get("/api/admin/dashboard", checkJwt, requireAdmin, (req, res) => {
  res.json({
    message: "✅ Welcome to Admin Dashboard",
    stats: {
      totalUsers: 156,
      activeUsers: 89,
      newUsers: 12,
      apiCalls: 2547
    }
  });
});

// ✅ Admin only - Get all users
app.get("/api/admin/users", checkJwt, requireAdmin, (req, res) => {
  res.json({
    message: "✅ Admin access - User list",
    users: [
      { id: 1, username: "admin", email: "admin@example.com", role: "admin" },
      { id: 2, username: "user1", email: "user1@example.com", role: "user" },
      { id: 3, username: "viewer1", email: "viewer@example.com", role: "viewer" }
    ]
  });
});

// ✅ User endpoint (requires user or admin role)
app.get("/api/user/profile", checkJwt, requireUser, (req, res) => {
  const userInfo = getUserInfo(req);
  res.json({
    message: "✅ User profile access granted",
    profile: {
      ...userInfo,
      preferences: {
        theme: "light",
        notifications: true
      }
    }
  });
});

// ✅ Role check endpoint
app.get("/api/check-role", checkJwt, (req, res) => {
  const userInfo = getUserInfo(req);
  res.json({
    success: true,
    userId: userInfo.userId,
    username: userInfo.username,
    email: userInfo.email,
    roles: userInfo.roles,
    isAdmin: userInfo.isAdmin,
    hasUserRole: hasRole(req, 'user'),
    hasViewerRole: hasRole(req, 'viewer')
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
