require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");

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
  res.json({
    message: "✅ Access granted",
    user: req.auth // user info decoded from token
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
