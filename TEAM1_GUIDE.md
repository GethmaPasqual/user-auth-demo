# Team 1 – User & Identity Service

## 🎯 Project Objectives

This project demonstrates the implementation of a User & Identity Service using Asgardeo for authentication. The focus areas are:

1. ✅ **Evaluate feasibility of Asgardeo (Free/Sample Plan)**
2. ✅ **Integrate Asgardeo with React and Node.js**
3. ✅ **Implement Role-Based Access Control (RBAC)**
4. ✅ **Determine authentication sharing between microservices**

---

## 📋 Table of Contents

1. [Asgardeo Feasibility Analysis](#1-asgardeo-feasibility-analysis)
2. [React Integration](#2-react-integration-with-asgardeo)
3. [Node.js Integration](#3-nodejs-integration-with-asgardeo)
4. [Role-Based Access Control](#4-role-based-access-control-rbac)
5. [Microservice Authentication](#5-microservice-authentication-sharing)
6. [Running the Project](#6-running-the-project)

---

## 1. Asgardeo Feasibility Analysis

### ✅ Is Asgardeo Free Plan Suitable?

**Answer: YES**

#### Free Plan Features:
- ✅ **Unlimited Users** (with MAU limits)
- ✅ **Role-Based Access Control (RBAC)**
- ✅ **JWT Token-based Authentication**
- ✅ **Social Login** (Google, Facebook, GitHub)
- ✅ **Multi-Factor Authentication (MFA)**
- ✅ **SDK Support** (@asgardeo/auth-react, @asgardeo/auth-spa)
- ✅ **API Access** (REST APIs for user management)
- ✅ **Custom Domains** (Limited)
- ✅ **Email Templates Customization**

#### Limitations:
- Monthly Active Users (MAU) cap
- Limited API calls per month
- Basic support only (Community forum)
- Limited customization options

#### Recommendation:
**Perfect for:**
- Development and testing
- Small to medium projects
- POC and MVP development
- Learning and experimentation

**Upgrade when:**
- Production deployment with >1000 MAU
- Need for SLA guarantees
- Require premium support
- Need advanced customization

### Comparison with Alternatives

| Feature | Asgardeo Free | Auth0 Free | Firebase Auth |
|---------|---------------|------------|---------------|
| MAU Limit | 1,000-5,000 | 7,500 | Unlimited |
| RBAC | ✅ Yes | ✅ Yes | Limited |
| Social Login | ✅ Yes | ✅ Yes | ✅ Yes |
| MFA | ✅ Yes | ✅ Yes | ✅ Yes |
| Custom Domains | Limited | ❌ No | ✅ Yes |
| JWT Tokens | ✅ Yes | ✅ Yes | ✅ Yes |

**Verdict:** Asgardeo Free Plan is highly suitable for Team 1's requirements.

---

## 2. React Integration with Asgardeo

### Installation

```bash
npm install @asgardeo/auth-react
```

### Configuration

**File:** `frontend/src/index.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "@asgardeo/auth-react";
import App from "./App.jsx";

const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG_NAME",
  scope: ["openid", "profile", "email"]
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### Authentication Hooks

```jsx
import { useAuthContext } from "@asgardeo/auth-react";

function MyComponent() {
  const { 
    state,              // { isAuthenticated, isLoading, ... }
    signIn,             // Function to initiate login
    signOut,            // Function to logout
    getAccessToken,     // Get JWT token
    getBasicUserInfo    // Get user profile
  } = useAuthContext();

  // Check if user is authenticated
  if (state.isAuthenticated) {
    // User is logged in
  }
}
```

### Protected Routes

**File:** `frontend/src/App.jsx`

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

export default function App() {
  const { state } = useAuthContext();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={state?.isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} 
        />
        <Route 
          path="/dashboard" 
          element={state?.isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}
```

### Fetching User Data

```jsx
const { getBasicUserInfo, getAccessToken } = useAuthContext();

// Get user profile
const userInfo = await getBasicUserInfo();
console.log(userInfo); // { email, username, sub, ... }

// Get JWT token for API calls
const token = await getAccessToken();
console.log(token); // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 3. Node.js Integration with Asgardeo

### Installation

```bash
npm install express express-oauth2-jwt-bearer dotenv cors
```

### Environment Configuration

**File:** `backend/.env`

```env
ASGARDEO_ISSUER=https://api.asgardeo.io/t/YOUR_ORG_NAME/oauth2/token
ASGARDEO_AUDIENCE=YOUR_CLIENT_ID
PORT=4000
```

### JWT Validation Middleware

**File:** `backend/server.js`

```javascript
require("dotenv").config();
const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");

const app = express();

// JWT Validation Middleware
const checkJwt = auth({
  audience: process.env.ASGARDEO_AUDIENCE,
  issuerBaseURL: process.env.ASGARDEO_ISSUER,
  tokenSigningAlg: "RS256"
});

// Public endpoint (no auth required)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to User & Identity Service" });
});

// Protected endpoint (requires JWT)
app.get("/api/user/profile", checkJwt, (req, res) => {
  res.json({
    userId: req.auth.sub,
    email: req.auth.email,
    tokenInfo: req.auth
  });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
```

### How JWT Validation Works

1. **Client sends request** with JWT in `Authorization` header:
   ```
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Middleware validates token**:
   - ✅ Checks signature (ensures token is from Asgardeo)
   - ✅ Checks expiration (`exp` claim)
   - ✅ Checks audience (`aud` claim)
   - ✅ Checks issuer (`iss` claim)

3. **If valid**: Request proceeds, `req.auth` contains decoded token
4. **If invalid**: Returns `401 Unauthorized`

### Accessing User Information

```javascript
app.get("/api/user/profile", checkJwt, (req, res) => {
  // Extract user ID from JWT
  const userId = req.auth.sub;
  
  // Extract email from JWT
  const email = req.auth.email;
  
  // Extract roles from JWT
  const roles = req.auth.groups || [];
  
  res.json({ userId, email, roles });
});
```

---

## 4. Role-Based Access Control (RBAC)

### Configuring Roles in Asgardeo

#### Step 1: Create Roles
1. Login to **Asgardeo Console**
2. Navigate to: **User Management** → **Roles**
3. Create roles: `user`, `admin`, `moderator`, etc.

#### Step 2: Configure Token Claims
1. Go to: **Applications** → Your App → **User Attributes**
2. Add `groups` to the **ID Token** and **Access Token**
3. This ensures roles are included in the JWT

#### Step 3: Assign Roles to Users
1. Navigate to: **User Management** → **Users**
2. Select a user → **Roles** tab
3. Assign roles (e.g., `admin`, `user`)

### JWT Token with Roles

When a user with roles logs in, the JWT token contains:

```json
{
  "sub": "user-12345",
  "email": "admin@example.com",
  "groups": ["user", "admin"],
  "exp": 1700000000
}
```

### Implementing RBAC Middleware

**File:** `backend/server.js`

```javascript
// RBAC Middleware - Check for admin role
const requireAdmin = (req, res, next) => {
  const groups = req.auth?.groups || [];
  
  if (groups.includes("admin")) {
    next(); // User has admin role, proceed
  } else {
    res.status(403).json({ 
      error: "Access denied. Admin role required.",
      yourRoles: groups 
    });
  }
};

// Admin-only endpoint
app.get("/api/admin/dashboard", checkJwt, requireAdmin, (req, res) => {
  res.json({
    message: "Admin access granted",
    adminUser: req.auth.sub
  });
});
```

### Generic RBAC Middleware

```javascript
// Check for any role
const requireRole = (role) => {
  return (req, res, next) => {
    const groups = req.auth?.groups || [];
    
    if (groups.includes(role)) {
      next();
    } else {
      res.status(403).json({ 
        error: `Access denied. ${role} role required.` 
      });
    }
  };
};

// Usage:
app.get("/api/moderator/panel", checkJwt, requireRole("moderator"), (req, res) => {
  res.json({ message: "Moderator access" });
});
```

### Testing RBAC

**Test 1: User without admin role**
```bash
GET /api/admin/dashboard
Authorization: Bearer <user_token>

Response: 403 Forbidden
{
  "error": "Access denied. Admin role required.",
  "yourRoles": ["user"]
}
```

**Test 2: User with admin role**
```bash
GET /api/admin/dashboard
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "message": "Admin access granted",
  "adminUser": "admin-12345"
}
```

---

## 5. Microservice Authentication Sharing

### Challenge

In a microservice architecture:
- **Service A** (User Service) validates user authentication
- **Service B** (Order Service) needs to know who the user is
- **Service C** (Payment Service) needs to verify user identity

**How do we share authentication across services?**

### Solution: JWT Token Propagation

#### Method 1: Forward the JWT Token

**Service A calls Service B:**

```javascript
// Service A (User Service)
app.get("/api/user/orders", checkJwt, async (req, res) => {
  const userId = req.auth.sub;
  
  // Get the original JWT token from the request
  const token = req.headers.authorization;
  
  // Forward the token to Service B
  const response = await axios.get(
    `http://order-service:5000/api/orders`,
    {
      headers: {
        Authorization: token // Pass the same JWT
      }
    }
  );
  
  res.json(response.data);
});
```

**Service B validates the same JWT:**

```javascript
// Service B (Order Service)
const checkJwt = auth({
  audience: process.env.ASGARDEO_AUDIENCE,
  issuerBaseURL: process.env.ASGARDEO_ISSUER,
  tokenSigningAlg: "RS256"
});

app.get("/api/orders", checkJwt, (req, res) => {
  const userId = req.auth.sub; // Same user ID as Service A
  
  // Fetch orders for this user
  const orders = getOrdersByUserId(userId);
  res.json(orders);
});
```

#### Benefits of JWT Token Propagation:
✅ **No re-authentication needed**  
✅ **Same user context across all services**  
✅ **Stateless** - no session sharing required  
✅ **Scalable** - works with any number of services  
✅ **Secure** - each service validates the token independently  

#### Method 2: Service-to-Service Authentication

For backend-only communication (no user context):

```javascript
// Service A gets a machine-to-machine token
const getServiceToken = async () => {
  const response = await axios.post(
    "https://api.asgardeo.io/t/YOUR_ORG/oauth2/token",
    {
      grant_type: "client_credentials",
      client_id: "SERVICE_CLIENT_ID",
      client_secret: "SERVICE_CLIENT_SECRET"
    }
  );
  return response.data.access_token;
};

// Use service token for inter-service communication
const serviceToken = await getServiceToken();
await axios.get(`http://analytics-service:6000/api/stats`, {
  headers: {
    Authorization: `Bearer ${serviceToken}`
  }
});
```

### Architecture Diagram

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │ JWT Token
       ▼
┌─────────────────────────────────────────┐
│     Service A (User Service)            │
│  - Validates JWT                        │
│  - Extracts user ID (req.auth.sub)      │
└──────┬──────────────────────────────────┘
       │ Forward JWT Token
       ▼
┌─────────────────────────────────────────┐
│     Service B (Order Service)           │
│  - Validates JWT (same token)           │
│  - Uses same user ID                    │
└──────┬──────────────────────────────────┘
       │ Forward JWT Token
       ▼
┌─────────────────────────────────────────┐
│     Service C (Payment Service)         │
│  - Validates JWT (same token)           │
│  - Uses same user ID                    │
└─────────────────────────────────────────┘
```

### Best Practices

1. **Always validate tokens** in each microservice
2. **Don't trust incoming requests** without validation
3. **Use HTTPS** for all inter-service communication
4. **Set short token expiration** times (15-60 minutes)
5. **Implement token refresh** mechanism
6. **Log authentication failures** for security monitoring

---

## 6. Running the Project

### Prerequisites
- Node.js v14+ installed
- Asgardeo account created
- Application registered in Asgardeo

### Setup

#### 1. Backend Configuration
```bash
cd backend
npm install

# Edit .env file with your Asgardeo credentials
ASGARDEO_ISSUER=https://api.asgardeo.io/t/YOUR_ORG/oauth2/token
ASGARDEO_AUDIENCE=YOUR_CLIENT_ID
PORT=4000
```

#### 2. Frontend Configuration
```bash
cd frontend
npm install

# Edit src/index.jsx with your Asgardeo config
const config = {
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG",
  ...
};
```

### Running

**Terminal 1 (Backend):**
```bash
cd backend
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Testing

1. **Navigate to** `http://localhost:3000`
2. **Click** "Sign In with Asgardeo"
3. **Login** with your Asgardeo credentials
4. **View** user profile and roles
5. **Test** admin endpoint to verify RBAC

### API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` | GET | Public | Welcome message |
| `/api/user/profile` | GET | JWT | Get user profile |
| `/api/user/roles` | GET | JWT | Get user roles |
| `/api/admin/dashboard` | GET | JWT + Admin | Admin-only endpoint |

---

## 📚 Summary

### Team 1 Objectives Achieved

#### ✅ 1. Asgardeo Feasibility
- **Confirmed**: Free plan is suitable
- **Features**: RBAC, JWT, Social Login, MFA
- **Limitations**: MAU cap, limited support

#### ✅ 2. React Integration
- **SDK**: @asgardeo/auth-react
- **Features**: Login/Logout, Protected Routes, Token Management
- **Hooks**: useAuthContext(), getAccessToken()

#### ✅ 3. Node.js Integration
- **Middleware**: express-oauth2-jwt-bearer
- **Features**: JWT Validation, User ID Extraction
- **Security**: Automatic signature verification

#### ✅ 4. RBAC Implementation
- **Method**: JWT groups claim
- **Middleware**: Custom role-checking middleware
- **Testing**: Admin-only endpoints

#### ✅ 5. Microservice Authentication
- **Method**: JWT Token Propagation
- **Benefits**: Stateless, Scalable, Secure
- **Alternative**: Service-to-Service tokens

---

## 🎓 Key Learnings

1. **Asgardeo** is a powerful, free Identity-as-a-Service platform
2. **JWT tokens** enable stateless authentication across services
3. **RBAC** can be implemented via JWT claims (groups)
4. **Microservices** can share authentication by forwarding JWT tokens
5. **Security** is maintained as each service validates independently

---

## 📞 Resources

- [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
- [@asgardeo/auth-react SDK](https://github.com/asgardeo/asgardeo-auth-react-sdk)
- [Express OAuth2 JWT Bearer](https://github.com/auth0/express-oauth2-jwt-bearer)
- [JWT.io - Token Debugger](https://jwt.io/)

---

**Team 1 – User & Identity Service** ✅
