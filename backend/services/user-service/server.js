require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// JWT validation middleware for User Service
const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER,
  tokenSigningAlg: "RS256"
});

// ====== USER SERVICE ENDPOINTS ======

// Health check
app.get("/api/user-service/health", (req, res) => {
  res.json({
    service: "User Service",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Get user profile
app.get("/api/user-service/profile", checkJwt, (req, res) => {
  const userId = req.auth?.sub;
  const email = req.auth?.email;
  
  res.json({
    message: "✅ User Service - Profile Retrieved",
    service: "User Service",
    user: {
      id: userId,
      email: email,
      username: req.auth?.username || req.auth?.preferred_username,
      roles: req.auth?.permissions || req.auth?.groups || [],
      profile: {
        bio: "Full-stack developer passionate about web technologies",
        location: "San Francisco, CA",
        joinedDate: "2024-01-15"
      }
    }
  });
});

// Get user activities
app.get("/api/user-service/activities", checkJwt, (req, res) => {
  const userId = req.auth?.sub;
  
  res.json({
    message: "✅ User Service - Activities Retrieved",
    service: "User Service",
    userId: userId,
    activities: [
      {
        id: 1,
        action: "Logged in",
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.100"
      },
      {
        id: 2,
        action: "Updated profile",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        ipAddress: "192.168.1.100"
      },
      {
        id: 3,
        action: "Changed password",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        ipAddress: "192.168.1.105"
      }
    ]
  });
});

// Update user preferences
app.post("/api/user-service/preferences", checkJwt, (req, res) => {
  const userId = req.auth?.sub;
  const preferences = req.body;
  
  res.json({
    message: "✅ User Service - Preferences Updated",
    service: "User Service",
    userId: userId,
    updatedPreferences: {
      ...preferences,
      updatedAt: new Date().toISOString()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("User Service Error:", err);
  res.status(err.status || 500).json({
    error: err.message,
    service: "User Service"
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
  console.log(`📍 Service URL: http://localhost:${PORT}`);
});
