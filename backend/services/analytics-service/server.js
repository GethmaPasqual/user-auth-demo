require("dotenv").config({ path: "../../config/.env" });
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

// JWT validation middleware for Analytics Service
const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER,
  tokenSigningAlg: "RS256"
});

// ====== ANALYTICS SERVICE ENDPOINTS ======

// Health check
app.get("/api/analytics-service/health", (req, res) => {
  res.json({
    service: "Analytics Service",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Get dashboard statistics
app.get("/api/analytics-service/stats", checkJwt, (req, res) => {
  res.json({
    message: "✅ Analytics Service - Statistics Retrieved",
    service: "Analytics Service",
    stats: {
      totalUsers: 1247,
      activeUsers: 892,
      newUsersToday: 34,
      apiCallsToday: 15678,
      averageResponseTime: "124ms",
      errorRate: "0.3%"
    },
    generatedAt: new Date().toISOString()
  });
});

// Get user analytics
app.get("/api/analytics-service/user/:userId", checkJwt, (req, res) => {
  const { userId } = req.params;
  
  res.json({
    message: "✅ Analytics Service - User Analytics Retrieved",
    service: "Analytics Service",
    userId: userId,
    analytics: {
      totalSessions: 45,
      totalTimeSpent: "12h 34m",
      averageSessionDuration: "16m 48s",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
      popularFeatures: [
        { feature: "Dashboard", usage: 89 },
        { feature: "Profile", usage: 67 },
        { feature: "Settings", usage: 34 }
      ]
    }
  });
});

// Get system metrics
app.get("/api/analytics-service/metrics", checkJwt, (req, res) => {
  const roles = req.auth?.permissions || req.auth?.groups || [];
  const isAdmin = roles.some(r => r.toLowerCase() === 'admin' || r.toLowerCase() === 'administrator');
  
  if (!isAdmin) {
    return res.status(403).json({
      error: "Access Denied",
      message: "Admin role required for system metrics",
      service: "Analytics Service"
    });
  }
  
  res.json({
    message: "✅ Analytics Service - System Metrics Retrieved",
    service: "Analytics Service",
    metrics: {
      cpuUsage: "45%",
      memoryUsage: "62%",
      diskSpace: "78%",
      networkTraffic: "1.2 GB/day",
      activeConnections: 234,
      queuedJobs: 12
    },
    timestamp: new Date().toISOString()
  });
});

// Track event
app.post("/api/analytics-service/track", checkJwt, (req, res) => {
  const { event, metadata } = req.body;
  const userId = req.auth?.sub;
  
  res.json({
    message: "✅ Analytics Service - Event Tracked",
    service: "Analytics Service",
    tracked: {
      userId: userId,
      event: event,
      metadata: metadata,
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Analytics Service Error:", err);
  res.status(err.status || 500).json({
    error: err.message,
    service: "Analytics Service"
  });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`📊 Analytics Service running on port ${PORT}`);
  console.log(`📍 Service URL: http://localhost:${PORT}`);
});
