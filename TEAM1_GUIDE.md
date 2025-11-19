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
2. [Asgardeo Application Configuration](#2-asgardeo-application-configuration)
3. [React Integration](#3-react-integration-with-asgardeo)
4. [Node.js Integration](#4-nodejs-integration-with-asgardeo)
5. [Role-Based Access Control](#5-role-based-access-control-rbac)
6. [Microservice Authentication](#6-microservice-authentication-sharing)
7. [Running the Project](#7-running-the-project)

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

## 2. Asgardeo Application Configuration

### Overview

When you register an application in Asgardeo, you need to configure various OIDC (OpenID Connect) settings to ensure proper authentication flow. This section covers all essential configurations.

### 2.1 Basic Settings

#### Client Credentials

When your application is registered in Asgardeo, you receive:
- **Client ID**: Unique identifier for your application
- **Client Secret**: Secret key for confidential clients (not for public clients like SPAs)

**For this project:**
```env
CLIENT_ID=YOUR_CLIENT_ID_HERE
CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE (Backend only)
```

**Important Notes:**
- ✅ React SPA should **not** use client secret (it's a public client)
- ✅ Backend Node.js API can use client secret for server-to-server communication
- ✅ Store credentials in `.env` file, never commit to version control

#### Allowed Grant Types

Grant types determine how your application communicates with the token service.

**For Team 1 Project:**

| Grant Type | Purpose | Used In |
|------------|---------|---------|
| **Code** ✅ | OAuth2 Authorization Code flow | React frontend |
| **Refresh Token** ✅ | Get new access tokens without re-login | React frontend |
| **Client Credentials** | Machine-to-machine authentication | Optional (backend-to-backend) |

**Not Recommended:**
- ❌ **Implicit**: Security concerns, deprecated
- ❌ **Password**: Exposes user credentials to client

**Configuration:**
1. Login to Asgardeo Console
2. Go to **Applications** → Your App
3. Navigate to **Protocol** tab
4. Under **Allowed grant types**, select:
   - ✅ Code
   - ✅ Refresh Token

#### Authorized Redirect URLs

These URLs determine where Asgardeo redirects users after login and logout.

**For Development:**
```
http://localhost:3000
http://localhost:3000/
```

**For Production:**
```
https://yourdomain.com
https://yourdomain.com/dashboard
```

**Important:**
- The `redirect_uri` in login request **must exactly match** one of these URLs
- The `post_logout_redirect_uri` in logout request **must exactly match** one of these URLs
- Multiple URLs can be registered

**Configuration:**
1. Go to **Protocol** tab in your Asgardeo application
2. Add URLs under **Authorized redirect URLs**
3. Click **Update**

#### Allowed Origins

Enable CORS (Cross-Origin Resource Sharing) to allow your React app to call Asgardeo APIs.

**For Development:**
```
http://localhost:3000
```

**For Production:**
```
https://yourdomain.com
```

**What This Enables:**
- ✅ Token endpoint access
- ✅ JWKS endpoint access  
- ✅ UserInfo endpoint access
- ✅ Other Asgardeo APIs

### 2.2 Advanced Settings

#### Proof Key for Code Exchange (PKCE)

PKCE adds security to the authorization code flow by preventing authorization code interception attacks.

**Recommended Configuration:**
- ✅ **Mandatory**: Enable this for all applications
- ❌ **Support Plain Transform Algorithm**: Disable (not secure for production)

**How PKCE Works:**
1. Client generates `code_verifier` (random string)
2. Client creates `code_challenge` = SHA256(code_verifier)
3. Client sends `code_challenge` in authorization request
4. Client sends `code_verifier` in token request
5. Server verifies: SHA256(code_verifier) == code_challenge

**Sample Authorization Request:**
```
https://api.asgardeo.io/t/YOUR_ORG/oauth2/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=http://localhost:3000
  &scope=openid profile email
  &code_challenge=CHALLENGE_HERE
  &code_challenge_method=S256
```

**Sample Token Request:**
```bash
curl -X POST https://api.asgardeo.io/t/YOUR_ORG/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=http://localhost:3000" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "code_verifier=VERIFIER_HERE"
```

**Note:** `@asgardeo/auth-react` SDK handles PKCE automatically!

#### Client Authentication

For applications using a client secret, this determines how the client authenticates.

**Available Methods:**

| Method | Description | Use Case |
|--------|-------------|----------|
| **Client Secret Basic** | Credentials in Authorization header | Default, widely supported |
| **Client Secret Post** | Credentials in request body | Alternative to Basic |
| **Private Key JWT** | JWT signed with private key | High security, no secrets transmitted |
| **Mutual TLS** | TLS certificate-based | Highest security, enterprise |

**For This Project:**
- React frontend: **None** (public client)
- Backend API: **Client Secret Basic** (if using client credentials grant)

#### Public Client

✅ **React SPA is a Public Client**

Public clients cannot securely store secrets because:
- Source code is visible to users
- DevTools can inspect all JavaScript
- No secure backend storage

**Security Measures for Public Clients:**
1. ✅ Use **Code** grant type (not Implicit or Password)
2. ✅ Enable **PKCE** (Mandatory)
3. ✅ No client secret in frontend code
4. ✅ Short access token expiry times
5. ✅ Implement refresh token rotation

### 2.3 Token Configuration

#### Access Token Type

Asgardeo supports two token types:

**1. JWT (Recommended)**
- Self-contained, verifiable
- Contains user info (sub, email, roles)
- No need to call introspection endpoint
- Can be validated locally

**Example JWT Access Token:**
```json
{
  "sub": "user-12345",
  "aud": "YOUR_CLIENT_ID",
  "scope": "openid profile",
  "groups": ["user", "admin"],
  "exp": 1700000000,
  "iat": 1699996400
}
```

**2. Opaque**
- Plain text token (random string)
- Requires introspection endpoint call
- More control over revocation

**For This Project:** Use **JWT** for stateless architecture

#### Access Token Attributes

For JWT tokens, you can specify which user attributes are included.

**Common Attributes:**
- `sub` (User ID) - Always included
- `email` - User email address
- `username` - Username
- `groups` - User roles (for RBAC)
- `given_name` - First name
- `family_name` - Last name

**Configuration:**
1. Go to **User Attributes** tab
2. Select attributes to include in access token
3. These appear in JWT payload

#### Token Expiry Times

**Recommended Values:**

| Token Type | Default | Recommended | Purpose |
|------------|---------|-------------|---------|
| User Access Token | 3600s (1h) | 900s (15m) | Short-lived for security |
| Application Access Token | 3600s (1h) | 3600s (1h) | Backend services |
| ID Token | 3600s (1h) | 3600s (1h) | User authentication |
| Refresh Token | 86400s (24h) | 86400s (24h) | Token renewal |

**Configuration:**
1. Go to **Protocol** → **Access Token** section
2. Set **User access token expiry time**: `900` (15 minutes)
3. Set **Refresh token expiry time**: `86400` (24 hours)

#### Token Binding

Token binding securely links tokens to client devices to prevent theft.

**Available Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| **none** | No binding | Default, least secure |
| **cookie** | Binds to secure cookie | Web applications |
| **sso-session** | Binds to browser session | Single sign-on |
| **certificate** | Binds to TLS certificate | Enterprise, high security |

**For This Project:**
- Development: **none**
- Production: **sso-session** or **cookie**

#### Refresh Token Configuration

**Renew Refresh Token:**
- ✅ **Enabled**: Issues new refresh token on each use (more secure)
- ❌ **Disabled**: Reuses same refresh token until expiry

**For This Project:** Enable for production

### 2.4 ID Token Configuration

#### Audience

By default, the client ID is added as the audience. You can add additional audiences.

**Example ID Token:**
```json
{
  "aud": ["YOUR_CLIENT_ID", "additional-audience"],
  "sub": "user-12345",
  "email": "user@example.com",
  "iss": "https://api.asgardeo.io/t/YOUR_ORG/oauth2/token",
  "exp": 1700000000,
  "iat": 1699996400
}
```

#### Encryption

Enable ID token encryption for additional security.

**Requirements:**
1. Upload application certificate (`.pem` format)
2. Select encryption algorithm (RSA-OAEP recommended)
3. Select encryption method (A128GCM recommended)

**For This Project:** Optional, not required for development

### 2.5 User Attributes Configuration

Control which user attributes are included in tokens based on requested scopes.

**Configuration Steps:**

1. **Go to User Attributes Tab**
2. **Configure Profile Scope:**
   - ✅ First Name (`given_name`)
   - ✅ Last Name (`family_name`)
   - ✅ Email (`email`)
   - ✅ Username (`username`)

3. **Configure Custom Attributes:**
   - Add `groups` for RBAC
   - Add custom claims as needed

**Important:** Attributes are only included if:
- The attribute is configured for the scope
- The scope is requested in the authorization request
- The user has a value for that attribute

### 2.6 Complete Configuration Checklist

**Basic Configuration:**
- [ ] Client ID and Secret obtained
- [ ] Allowed grant types: Code, Refresh Token
- [ ] Authorized redirect URLs added
- [ ] Allowed origins configured

**Security Configuration:**
- [ ] PKCE set to Mandatory
- [ ] Public client enabled (for React)
- [ ] Token binding configured
- [ ] Short access token expiry (15 minutes)

**Token Configuration:**
- [ ] Access token type: JWT
- [ ] Access token attributes selected
- [ ] Refresh token renewal enabled
- [ ] Token expiry times configured

**User Attributes:**
- [ ] Profile scope attributes configured
- [ ] `groups` claim added for RBAC
- [ ] First name and last name included

**Testing:**
- [ ] Login flow works
- [ ] Logout flow works
- [ ] Refresh token flow works
- [ ] RBAC roles appear in JWT

### 2.7 Asgardeo Server Endpoints

When configuring your application, you'll need to use specific Asgardeo server endpoints for authentication operations.

#### Standard OIDC Endpoints

**For Organization: `testforfinalproject`**

| Endpoint | URL | Purpose |
|----------|-----|---------|
| **Issuer** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/token` | Token issuer identifier |
| **Discovery** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/token/.well-known/openid-configuration` | Auto-discover all endpoints |
| **Authorize** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/authorize` | Start login flow |
| **Token** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/token` | Exchange code for tokens |
| **UserInfo** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/userinfo` | Get user profile |
| **Introspection** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/introspect` | Validate opaque tokens |
| **JWKS** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks` | Public keys for JWT validation |
| **Revoke** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/revoke` | Revoke access/refresh tokens |
| **Logout** | `https://api.asgardeo.io/t/testforfinalproject/oidc/logout` | End user session |
| **PAR** | `https://api.asgardeo.io/t/testforfinalproject/oauth2/par` | Pushed Authorization Request |

#### Mutual TLS (mTLS) Endpoints

For applications using mTLS client authentication or certificate token binding:

| Endpoint | URL | Purpose |
|----------|-----|---------|
| **PAR (mTLS)** | `https://mtls.asgardeo.io/t/testforfinalproject/oauth2/par` | Pushed Authorization with mTLS |
| **Token (mTLS)** | `https://mtls.asgardeo.io/t/testforfinalproject/oauth2/token` | Token exchange with mTLS |

**Note:** To use mTLS endpoints, configure certificate-based authentication in the Protocol tab of your Asgardeo application.

#### Usage in Configuration

**React Frontend (`frontend/src/asgardeoConfig.js`):**
```javascript
const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io",
  scope: ["openid", "profile", "email"]
};
```

**Backend Environment (`.env`):**
```env
ASGARDEO_ISSUER=https://api.asgardeo.io/t/testforfinalproject/oauth2/token
ASGARDEO_AUDIENCE=YOUR_CLIENT_ID
ASGARDEO_JWKS_URI=https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks
```

**Discovery Endpoint:**
The discovery endpoint provides complete metadata about all available endpoints. You can fetch it to auto-configure your application:

```bash
curl https://api.asgardeo.io/t/testforfinalproject/oauth2/token/.well-known/openid-configuration
```

**Sample Response:**
```json
{
  "issuer": "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  "authorization_endpoint": "https://api.asgardeo.io/t/testforfinalproject/oauth2/authorize",
  "token_endpoint": "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  "userinfo_endpoint": "https://api.asgardeo.io/t/testforfinalproject/oauth2/userinfo",
  "jwks_uri": "https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks",
  "revocation_endpoint": "https://api.asgardeo.io/t/testforfinalproject/oauth2/revoke",
  "end_session_endpoint": "https://api.asgardeo.io/t/testforfinalproject/oidc/logout",
  "response_types_supported": ["code", "id_token", "token"],
  "grant_types_supported": ["authorization_code", "refresh_token", "client_credentials"],
  "code_challenge_methods_supported": ["plain", "S256"]
}
```

---

## 3. React Integration with Asgardeo

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
