# Microservices Architecture - Authentication Sharing Demo

## Overview

This project demonstrates how **multiple microservices share the same JWT authentication** from Asgardeo, allowing seamless authentication across different services without re-login.

## Architecture

```
┌─────────────────┐
│   Asgardeo      │
│ (Identity Provider) │
│  Issues JWT Token   │
└────────┬────────┘
         │ Token (once)
         ▼
┌─────────────────┐
│   Frontend      │
│  (React App)    │
│  Port 3000      │
└────────┬────────┘
         │ Same token to all services
         │
    ┌────┴────┬────────────┬────────────┐
    ▼         ▼            ▼            ▼
┌────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│Main API│ │  User   │ │Analytics │ │  More    │
│Service │ │ Service │ │ Service  │ │ Services │
│Port    │ │ Port    │ │ Port     │ │  ...     │
│4000    │ │ 4001    │ │ 4002     │ │          │
└────────┘ └─────────┘ └──────────┘ └──────────┘
     │         │            │            │
     └─────────┴────────────┴────────────┘
              All validate same JWT
```

## Services

### 1. Main API Service (Port 4000)
- Role-based access control
- Admin endpoints
- User management
- Primary authentication gateway

### 2. User Service (Port 4001)
- User profiles
- User activities
- Preferences management
- Uses same JWT token

### 3. Analytics Service (Port 4002)
- Dashboard statistics
- User analytics
- System metrics (admin only)
- Event tracking

## How Token Sharing Works

### Step 1: User Logs In
```javascript
// Frontend - User clicks "Login"
// Redirects to Asgardeo
// Asgardeo returns JWT token
const token = await getAccessToken();
```

### Step 2: Token Used Across All Services
```javascript
// Same token works for ALL services
const headers = { 'Authorization': `Bearer ${token}` };

// Main API
fetch('http://localhost:4000/api/protected', { headers });

// User Service
fetch('http://localhost:4001/api/user-service/profile', { headers });

// Analytics Service
fetch('http://localhost:4002/api/analytics-service/stats', { headers });
```

### Step 3: Each Service Validates Independently
```javascript
// Every service has same JWT validation
const checkJwt = auth({
  audience: process.env.AUDIENCE,      // Same
  issuerBaseURL: process.env.ISSUER,   // Same
  tokenSigningAlg: "RS256"             // Same
});

// Each service independently verifies:
// ✓ Token signature is valid
// ✓ Token is not expired
// ✓ Token issuer matches Asgardeo
// ✓ Token audience matches app
```

## Running the Microservices

### Terminal 1: Main API Service
```bash
cd backend
npm start
# Runs on http://localhost:4000
```

### Terminal 2: User Service
```bash
cd backend/services/user-service
node server.js
# Runs on http://localhost:4001
```

### Terminal 3: Analytics Service
```bash
cd backend/services/analytics-service
node server.js
# Runs on http://localhost:4002
```

### Terminal 4: Frontend
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

## Testing Token Sharing

### 1. Login and Get Token
```bash
# Login via frontend at http://localhost:3000
# Open browser console and get token:
const token = await window.asgardeo.getAccessToken();
console.log(token);
```

### 2. Test All Services with Same Token
```bash
# Test Main API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/check-role

# Test User Service
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4001/api/user-service/profile

# Test Analytics Service
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4002/api/analytics-service/stats
```

### 3. Verify All Services Accept Same Token
✅ All services should respond with user data  
✅ No re-login required  
✅ Each service validates token independently

## API Endpoints

### Main API Service (4000)
- `GET /api/protected` - Basic auth check
- `GET /api/check-role` - Get user roles
- `GET /api/admin/dashboard` - Admin only
- `GET /api/user/profile` - User/Admin

### User Service (4001)
- `GET /api/user-service/health` - Health check
- `GET /api/user-service/profile` - User profile (auth required)
- `GET /api/user-service/activities` - User activities (auth required)
- `POST /api/user-service/preferences` - Update preferences (auth required)

### Analytics Service (4002)
- `GET /api/analytics-service/health` - Health check
- `GET /api/analytics-service/stats` - Dashboard stats (auth required)
- `GET /api/analytics-service/user/:userId` - User analytics (auth required)
- `GET /api/analytics-service/metrics` - System metrics (admin only)
- `POST /api/analytics-service/track` - Track event (auth required)

## Key Benefits

### 1. Single Sign-On (SSO)
- User logs in **once**
- Token works across **all services**
- No multiple logins needed

### 2. Decentralized Validation
- Each service **independently validates** token
- No dependency on central auth service
- Services can scale independently

### 3. Security
- Token signed by Asgardeo (trusted issuer)
- Each service verifies signature
- Token expiration enforced
- Role-based access control

### 4. Scalability
- Add new services easily
- Same JWT validation code
- No token synchronization needed

## Configuration

All services use the same `.env` configuration:

```env
# backend/config/.env
AUDIENCE=your-app-client-id
ISSUER=https://api.asgardeo.io/t/yourorg
```

## Security Considerations

### ✅ What's Secure
- JWT signed by Asgardeo (RS256)
- Each service validates signature
- Token expiration enforced
- HTTPS in production (required)

### ⚠️ Important Notes
- Never share the Asgardeo client secret
- Use HTTPS in production
- Set appropriate token expiration
- Implement rate limiting
- Log authentication attempts

## Adding More Services

To add a new service:

1. **Create service folder**
```bash
mkdir backend/services/new-service
```

2. **Copy JWT validation**
```javascript
const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER,
  tokenSigningAlg: "RS256"
});
```

3. **Add endpoints**
```javascript
app.get("/api/new-service/endpoint", checkJwt, (req, res) => {
  // Access user info from req.auth
  res.json({ user: req.auth });
});
```

4. **Run on different port**
```javascript
const PORT = 4003; // Next available port
app.listen(PORT, () => {
  console.log(`Service running on ${PORT}`);
});
```

## Troubleshooting

### Token Not Working?
- Check all services use same AUDIENCE and ISSUER
- Verify token hasn't expired (check at jwt.io)
- Ensure CORS is enabled for frontend

### 401 Unauthorized?
- Token might be expired
- Check Authorization header format: `Bearer TOKEN`
- Verify Asgardeo configuration

### 403 Forbidden?
- User doesn't have required role
- Check role names match exactly
- Verify roles are in token (jwt.io)

## Demo Flow

1. **Start all services** (4 terminals)
2. **Visit** http://localhost:3000
3. **Login** via Asgardeo
4. **Frontend automatically**:
   - Gets token from Asgardeo
   - Sends to Main API (4000)
   - Sends to User Service (4001)
   - Sends to Analytics Service (4002)
5. **All services** validate same token
6. **User sees** combined data from all services

This demonstrates how **modern microservices architecture** shares authentication without coupling services together! 🚀
