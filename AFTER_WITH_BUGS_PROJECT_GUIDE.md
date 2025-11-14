# Team 1 – User & Identity Service Project Guide

**Project:** User Authentication & Authorization with Asgardeo  
**Tech Stack:** React (Frontend) + Node.js/Express (Backend) + Asgardeo (Identity Provider)

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Task Breakdown](#task-breakdown)
6. [Technical Investigation Guide](#technical-investigation-guide)
7. [Deliverables](#deliverables)
8. [Resources](#resources)

---

## 🎯 Project Overview

### Objectives
1. ✅ Evaluate feasibility of using Asgardeo (Free/Sample Plan) for authentication
2. ✅ Integrate Asgardeo with React and Node.js
3. 🔧 Implement role-based access control (RBAC) for users
4. 🔧 Share authentication between microservices

### Current Status
- ✅ Basic React frontend with Asgardeo login/logout
- ✅ Express backend with JWT validation setup
- ⚠️ RBAC implementation needed
- ⚠️ Microservices authentication strategy needed

---

## 📁 Project Structure

```
user-auth-demo/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   └── server.js          # Main server (JWT validation)
│   ├── config/
│   │   ├── .env               # Backend environment variables
│   │   └── .env.example       # Example configuration
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── App.js             # Main component with auth
│   │   ├── asgardeoConfig.js  # Asgardeo configuration
│   │   └── index.js           # App entry with AuthProvider
│   ├── public/
│   ├── config/
│   │   └── .env               # Frontend environment variables
│   ├── package.json
│   └── README.md
│
├── PROJECT_GUIDE.md           # This file
└── README.md                  # Main project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ (recommended v16 or v18)
- npm or yarn
- Asgardeo account (free tier)
- Git

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd user-auth-demo
git checkout dasith/file-structure
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configure backend/config/.env
# Add your Asgardeo credentials:
# ASGARDEO_AUDIENCE=your_audience
# ASGARDEO_ISSUER=https://api.asgardeo.io/t/YOUR_ORG
# PORT=4000

npm start
```
Backend runs on: **http://localhost:4000**

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Update frontend/src/asgardeoConfig.js or frontend/src/index.js
# with your Asgardeo Client ID

npm start
```
Frontend runs on: **http://localhost:3000**

#### 4. Asgardeo Configuration
1. Go to [Asgardeo Console](https://console.asgardeo.io)
2. Create a **Single Page Application (SPA)**
3. Add to **Allowed Origins**: `http://localhost:3000`
4. Add to **Redirect URLs**: `http://localhost:3000`
5. Copy the **Client ID**
6. Update `frontend/src/index.js` with your Client ID

---

## 🗺️ Implementation Roadmap

### Phase 1: Research & Evaluation (Week 1)
**Goal:** Understand Asgardeo capabilities and limitations

#### Tasks:
- [ ] Review Asgardeo free tier documentation
- [ ] Test user creation and management
- [ ] Analyze JWT token structure
- [ ] Document API rate limits
- [ ] Test authentication flow

#### Deliverables:
- Feasibility report document
- Asgardeo setup guide
- JWT token analysis

---

### Phase 2: RBAC Implementation (Week 2)
**Goal:** Implement role-based access control

#### Tasks:
- [ ] Create roles in Asgardeo (admin, user, viewer)
- [ ] Assign roles to test users
- [ ] Configure Asgardeo to include roles in JWT
- [ ] Create backend middleware for role checking
- [ ] Create frontend components for role-based UI
- [ ] Test role enforcement

#### File Structure to Create:
```
backend/src/
├── middleware/
│   ├── auth.js              # JWT validation middleware
│   └── roleCheck.js         # Role-based access middleware
├── routes/
│   ├── admin.routes.js      # Admin-only endpoints
│   ├── user.routes.js       # User endpoints
│   └── public.routes.js     # Public endpoints
└── utils/
    └── tokenValidator.js    # Token utilities

frontend/src/
├── components/
│   ├── ProtectedRoute.js    # Role-based route guard
│   ├── AdminPanel.js        # Admin dashboard
│   └── UserDashboard.js     # User dashboard
└── utils/
    ├── roleChecker.js       # Role utility functions
    └── api.js               # API client with auth headers
```

#### Deliverables:
- RBAC middleware implementation
- Role-based UI components
- RBAC testing documentation

---

### Phase 3: Microservices Authentication (Week 3)
**Goal:** Enable authentication sharing across multiple services

#### Tasks:
- [ ] Design microservices authentication architecture
- [ ] Implement JWT validation in separate services
- [ ] Test token sharing between services
- [ ] Measure performance and latency
- [ ] Create shared authentication library
- [ ] Document token refresh flow

#### Architecture Options:

**Option 1: Distributed JWT Validation (Recommended)**
```
Frontend → JWT Token
    ↓
    ├─→ Service 1 (validates JWT independently)
    ├─→ Service 2 (validates JWT independently)
    └─→ Service 3 (validates JWT independently)
```
**Pros:** Stateless, scalable, no single point of failure  
**Cons:** Each service needs validation logic

**Option 2: API Gateway Pattern**
```
Frontend → API Gateway (validates JWT)
                ↓
    ├─→ Service 1 (trusts gateway)
    ├─→ Service 2 (trusts gateway)
    └─→ Service 3 (trusts gateway)
```
**Pros:** Centralized auth, simpler services  
**Cons:** Gateway is single point of failure

**Option 3: Token Introspection**
```
Frontend → Service → Asgardeo (validate token)
```
**Pros:** Most secure, real-time validation  
**Cons:** Higher latency, more API calls

#### Deliverables:
- Microservices authentication architecture document
- Shared auth library/module
- Performance testing results

---

### Phase 4: Integration & Testing (Week 4)
**Goal:** Complete integration and testing

#### Tasks:
- [ ] End-to-end authentication testing
- [ ] RBAC testing across all routes
- [ ] Load testing with multiple users
- [ ] Security testing (token tampering, etc.)
- [ ] Documentation completion
- [ ] Demo preparation

#### Deliverables:
- Complete test report
- Final documentation
- Demo presentation

---

## 📋 Task Breakdown

### 1. Asgardeo Feasibility Evaluation

#### Investigation Points:
- **Free Tier Limits:**
  - ✓ Maximum users supported (500 for free tier)
  - ✓ API rate limits
  - ✓ Token expiration settings
  - ✓ Custom domain support
  - ✓ Social login options

- **Features Available:**
  - ✓ OAuth 2.0 / OpenID Connect
  - ✓ Single Sign-On (SSO)
  - ✓ Multi-factor Authentication (MFA)
  - ✓ Role-based access control
  - ✓ User management APIs

#### Documentation to Create:
- `docs/ASGARDEO_EVALUATION.md` - Detailed evaluation report
- `docs/ASGARDEO_SETUP.md` - Step-by-step setup guide

---

### 2. React & Node.js Integration

#### Frontend (React) Implementation:

**Already Implemented:**
- ✅ `@asgardeo/auth-react` package
- ✅ AuthProvider wrapper
- ✅ Login/Logout functionality
- ✅ User profile display

**To Implement:**
```javascript
// Example: Protected Route Component
import { useAuthContext } from "@asgardeo/auth-react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { state } = useAuthContext();
  const userRoles = state?.idToken?.groups || [];
  
  if (!state.isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  if (requiredRole && !userRoles.includes(requiredRole)) {
    return <div>Access Denied</div>;
  }
  
  return children;
};
```

#### Backend (Node.js) Implementation:

**Already Implemented:**
- ✅ `express-oauth2-jwt-bearer` for JWT validation
- ✅ Basic protected endpoint

**To Implement:**
```javascript
// Example: Role-based middleware
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRoles = req.auth.permissions || [];
    
    if (!userRoles.includes(requiredRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
app.get('/api/admin', checkJwt, checkRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});
```

---

### 3. Role-Based Access Control (RBAC)

#### Step-by-Step Implementation:

**Step 1: Configure Roles in Asgardeo**
1. Login to Asgardeo Console
2. Go to **User Management** → **Roles**
3. Create roles:
   - `admin` - Full access
   - `user` - Standard access
   - `viewer` - Read-only access
4. Go to **Applications** → Your App → **User Attributes**
5. Enable **groups** claim to be included in ID token

**Step 2: Backend Middleware**
Create `backend/src/middleware/roleCheck.js`:
```javascript
const requireRole = (role) => {
  return (req, res, next) => {
    const roles = req.auth?.permissions || [];
    
    if (!roles.includes(role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `Requires ${role} role`
      });
    }
    
    next();
  };
};

const requireAnyRole = (allowedRoles) => {
  return (req, res, next) => {
    const roles = req.auth?.permissions || [];
    const hasRole = allowedRoles.some(role => roles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        error: 'Access denied',
        message: `Requires one of: ${allowedRoles.join(', ')}`
      });
    }
    
    next();
  };
};

module.exports = { requireRole, requireAnyRole };
```

**Step 3: Frontend Role Checking**
Create `frontend/src/utils/roleChecker.js`:
```javascript
export const hasRole = (userRoles, requiredRole) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return userRoles.includes(requiredRole);
};

export const hasAnyRole = (userRoles, requiredRoles) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return requiredRoles.some(role => userRoles.includes(role));
};

export const hasAllRoles = (userRoles, requiredRoles) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  return requiredRoles.every(role => userRoles.includes(role));
};
```

**Step 4: Testing**
- Create test users with different roles
- Test access to protected routes
- Verify proper error messages
- Test role changes propagation

---

### 4. Microservices Authentication

#### Shared Authentication Strategy:

**Approach 1: Shared JWT Validation Middleware (Recommended)**

Create a shared npm package or copy this module:

```javascript
// shared-auth/index.js
const { auth } = require('express-oauth2-jwt-bearer');

const createAuthMiddleware = (config) => {
  return auth({
    audience: config.audience,
    issuerBaseURL: config.issuer,
    tokenSigningAlg: 'RS256'
  });
};

const extractUserInfo = (req) => {
  return {
    userId: req.auth?.sub,
    email: req.auth?.email,
    roles: req.auth?.permissions || [],
    username: req.auth?.username
  };
};

module.exports = { createAuthMiddleware, extractUserInfo };
```

**Usage in Each Microservice:**
```javascript
const { createAuthMiddleware } = require('./shared-auth');

const checkJwt = createAuthMiddleware({
  audience: process.env.ASGARDEO_AUDIENCE,
  issuer: process.env.ASGARDEO_ISSUER
});

app.use('/api', checkJwt);
```

#### Service Communication:

**Option A: JWT Forwarding**
```javascript
// Service A calls Service B with user's JWT
const callServiceB = async (userToken, data) => {
  const response = await fetch('http://service-b/api/resource', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

**Option B: Service-to-Service Token**
```javascript
// Service A gets its own token to call Service B
const getServiceToken = async () => {
  // Implement OAuth2 client credentials flow
  // Asgardeo supports M2M (machine-to-machine) authentication
};
```

---

## 📊 Deliverables

### Week 1: Research Deliverables
- [ ] **Asgardeo Evaluation Report**
  - Free tier capabilities analysis
  - Feature comparison with alternatives
  - Limitations and workarounds
  
- [ ] **Setup Documentation**
  - Step-by-step Asgardeo configuration
  - Application registration guide
  - Environment setup instructions

- [ ] **JWT Token Analysis**
  - Token structure documentation
  - Claims available
  - Token lifecycle (expiration, refresh)

### Week 2: RBAC Deliverables
- [ ] **RBAC Implementation**
  - Backend middleware code
  - Frontend role-checking utilities
  - Protected routes examples
  
- [ ] **RBAC Documentation**
  - `docs/RBAC_GUIDE.md`
  - Role definitions
  - Permission matrix
  - Testing procedures

- [ ] **Demo Application**
  - Admin dashboard (admin role only)
  - User dashboard (user role)
  - Viewer access (read-only)

### Week 3: Microservices Deliverables
- [ ] **Authentication Architecture**
  - `docs/MICROSERVICES_AUTH.md`
  - Architecture diagrams
  - Decision rationale
  
- [ ] **Shared Auth Library**
  - Reusable authentication module
  - Usage documentation
  - Example implementations

- [ ] **Performance Analysis**
  - Token validation benchmarks
  - Latency measurements
  - Scalability assessment

### Week 4: Final Deliverables
- [ ] **Complete Documentation**
  - All technical docs updated
  - API documentation
  - Deployment guide
  
- [ ] **Test Results**
  - Unit test reports
  - Integration test results
  - Security test findings
  
- [ ] **Demo Presentation**
  - Working demo with all features
  - Presentation slides
  - Video walkthrough (optional)

---

## 🔍 Technical Investigation Guide

### Key Questions to Answer

#### 1. Asgardeo Feasibility
- ❓ **Q:** Does the free tier support all required features?
  - **Test:** Create application, add users, test features
  - **Document:** Feature checklist, limitations found
  
- ❓ **Q:** What are the API rate limits?
  - **Test:** Make multiple API calls, measure limits
  - **Document:** Rate limit numbers, throttling behavior
  
- ❓ **Q:** How does token refresh work?
  - **Test:** Wait for token expiration, test refresh
  - **Document:** Refresh flow, configuration options

#### 2. RBAC Implementation
- ❓ **Q:** How are roles included in JWT tokens?
  - **Test:** Decode JWT, inspect claims
  - **Document:** Token structure, claim names
  
- ❓ **Q:** Can we create custom roles?
  - **Test:** Create various role configurations
  - **Document:** Role creation process, limitations
  
- ❓ **Q:** How quickly do role changes propagate?
  - **Test:** Change user role, measure update time
  - **Document:** Propagation timing, caching behavior

#### 3. Microservices Authentication
- ❓ **Q:** Should we validate tokens centrally or distributed?
  - **Research:** Compare approaches, pros/cons
  - **Test:** Implement both, measure performance
  - **Document:** Recommendation with justification
  
- ❓ **Q:** How to handle token expiration across services?
  - **Test:** Simulate token expiration scenarios
  - **Document:** Error handling strategy
  
- ❓ **Q:** Do we need service-to-service authentication?
  - **Research:** M2M authentication in Asgardeo
  - **Test:** Implement client credentials flow
  - **Document:** Implementation guide

---

## 📚 Resources

### Asgardeo Documentation
- [Asgardeo Official Docs](https://wso2.com/asgardeo/docs/)
- [React Integration Guide](https://wso2.com/asgardeo/docs/guides/authentication/add-login-to-single-page-app/)
- [Node.js Integration](https://wso2.com/asgardeo/docs/guides/authentication/add-login-to-nodejs-app/)
- [RBAC in Asgardeo](https://wso2.com/asgardeo/docs/guides/users/manage-roles/)

### Libraries & SDKs
- [@asgardeo/auth-react](https://github.com/asgardeo/asgardeo-auth-react-sdk)
- [express-oauth2-jwt-bearer](https://www.npmjs.com/package/express-oauth2-jwt-bearer)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - For JWT decoding

### Additional Reading
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [OpenID Connect](https://openid.net/connect/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Microservices Security Patterns](https://microservices.io/patterns/security/access-token.html)

---

## 🤝 Team Collaboration

### Roles & Responsibilities
- **Lead Developer:** Architecture decisions, code review
- **Frontend Developer:** React components, RBAC UI
- **Backend Developer:** API endpoints, middleware
- **DevOps/Tester:** Testing, documentation

### Communication
- Daily standups to track progress
- Weekly demo of completed features
- Document decisions in `docs/DECISIONS.md`

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/rbac-implementation

# Make changes, commit
git add .
git commit -m "feat: add role-based middleware"

# Push and create PR
git push origin feature/rbac-implementation
```

---

## ✅ Success Criteria

### Must Have:
- ✅ Users can login/logout with Asgardeo
- ✅ JWT tokens are validated on backend
- ✅ RBAC implemented with at least 2 roles
- ✅ Multiple services can validate tokens

### Nice to Have:
- 🎯 Social login integration
- 🎯 Multi-factor authentication
- 🎯 Token refresh without page reload
- 🎯 Centralized user management dashboard

---

## 📞 Support & Help

### Getting Stuck?
1. Check Asgardeo documentation
2. Review this guide's examples
3. Check existing code in `backend/` and `frontend/`
4. Ask team members
5. Asgardeo community forums

### Common Issues:
- **CORS errors:** Check Asgardeo allowed origins
- **Token validation fails:** Verify issuer and audience
- **Roles not in token:** Check Asgardeo app configuration
- **Node version issues:** Use Node v16 or v18

---

**Last Updated:** November 14, 2025  
**Project Branch:** `dasith/file-structure`  
**Team:** Team 1 - User & Identity Service