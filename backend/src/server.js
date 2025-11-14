require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { requireRole, requireAdmin, requireUser } = require("./middleware/roleCheck");
const { getUserInfo, hasRole, isAdmin } = require("./utils/authUtils");

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'User Auth API Docs'
}));

// ✅ Middleware to validate JWT Access Tokens issued by Asgardeo
const checkJwt = auth({
  audience: process.env.ASGARDEO_AUDIENCE,
  issuerBaseURL: process.env.ASGARDEO_ISSUER,
  tokenSigningAlg: "RS256"
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to the backend API"
 */
app.get("/", (req, res) => {
  res.send("Welcome to the backend API. Use /api/protected to test authentication.");
});

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Protected endpoint - requires valid JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Access granted"
 *                 user:
 *                   $ref: '#/components/schemas/UserInfo'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/protected", checkJwt, (req, res) => {
  const userInfo = getUserInfo(req);
  res.json({
    message: "✅ Access granted",
    user: userInfo
  });
});

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/UserInfo'
 *       401:
 *         description: Unauthorized
 */
app.get("/api/user/me", checkJwt, (req, res) => {
  const userInfo = getUserInfo(req);
  res.json({
    success: true,
    user: userInfo
  });
});

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Welcome to Admin Dashboard"
 *                 stats:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "✅ Admin access - User list"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       403:
 *         description: Forbidden - Admin role required
 */
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

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile (User or Admin role required)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         theme:
 *                           type: string
 *                         notifications:
 *                           type: boolean
 *       403:
 *         description: Forbidden - User or Admin role required
 */
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

/**
 * @swagger
 * /api/check-role:
 *   get:
 *     summary: Check user roles and permissions
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 userId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["admin", "user"]
 *                 isAdmin:
 *                   type: boolean
 *                 hasUserRole:
 *                   type: boolean
 *                 hasViewerRole:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
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
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});
