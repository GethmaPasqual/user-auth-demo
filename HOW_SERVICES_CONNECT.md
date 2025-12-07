# 🔗 How the Microservices Connect - Quick Reference

**Last Updated:** December 6, 2025

---

## 📊 System Overview

You have **TWO microservices** that are now **INTEGRATED** through shared JWT authentication:

### 1️⃣ User-Auth-Demo (Authentication Service)
- **Location:** `user-auth-demo/`
- **Purpose:** User authentication and authorization
- **Ports:** 
  - Frontend: **3000**
  - Backend: **8080**
- **Technology:** React + Express + Asgardeo OAuth 2.0

### 2️⃣ Task-Service-Master (Task Management Service)
- **Location:** `task-service-master/`
- **Purpose:** Task CRUD operations
- **Ports:**
  - REST API: **4000**
  - gRPC: **50052**
- **Technology:** Express + PostgreSQL + RabbitMQ + gRPC

---

## 🔗 How They Connect

```
┌──────────────────────────────────────────────────────────────────┐
│                    React Frontend                                 │
│                    http://localhost:3000                          │
│                                                                   │
│  1. User logs in via Asgardeo                                    │
│  2. Receives JWT token                                           │
│  3. Stores token in localStorage                                 │
│  4. Makes API calls with: Authorization: Bearer <token>          │
└────────────────────┬─────────────────────────────────────────────┘
                     │
        ┌────────────┴───────────────┐
        │                            │
        ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│  Auth Backend    │         │  Task Service    │
│  Port: 8080      │         │  Port: 4000      │
├──────────────────┤         ├──────────────────┤
│ GET /api/public  │         │ GET /api/v1/tasks│
│ GET /api/private │         │ POST /api/v1/tasks│
│ GET /api/admin   │         │ PATCH /api/v1/tasks/:id│
│                  │         │ DELETE /api/v1/tasks/:id│
├──────────────────┤         ├──────────────────┤
│ ✓ Issues JWTs    │         │ ✓ Validates JWTs │
│ ✓ Validates JWTs │         │ ✓ Extracts user  │
│ ✓ RBAC checks    │         │ ✓ RBAC checks    │
└────────┬─────────┘         └─────────┬────────┘
         │                             │
         ▼                             ▼
┌──────────────────┐         ┌──────────────────┐
│    Asgardeo      │         │   PostgreSQL     │
│  OAuth Provider  │         │    Database      │
│                  │         │   + RabbitMQ     │
└──────────────────┘         └──────────────────┘
```

---

## 🔐 Authentication Flow (Step-by-Step)

### Step 1: User Login
```
User opens: http://localhost:3000
        ↓
Clicks "Sign In with Asgardeo"
        ↓
Redirected to Asgardeo login page
        ↓
Enters credentials (admin@demo.com or user@demo.com)
        ↓
Asgardeo validates and issues JWT token
        ↓
Redirected back to frontend with token
        ↓
Frontend stores token in localStorage
```

### Step 2: Making API Calls
```javascript
// Frontend stores token
localStorage.setItem('access_token', token);

// All API calls include token
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Call Auth Service
fetch('http://localhost:8080/api/private', { headers });

// Call Task Service
fetch('http://localhost:4000/api/v1/tasks', { headers });
```

### Step 3: JWT Validation (Both Services)
```
Request arrives with Authorization header
        ↓
Extract JWT token
        ↓
Validate using Asgardeo public keys (JWKS)
        ↓
Check: Signature, Expiration, Audience, Issuer
        ↓
Extract user info: sub (ID), email, roles
        ↓
Attach to request: req.auth
        ↓
Process request with user context
```

---

## 📡 API Endpoints

### Auth Service (Port 8080)

| Endpoint | Auth Required | Role Required | Description |
|----------|--------------|---------------|-------------|
| `GET /api/public` | ❌ No | - | Public endpoint |
| `GET /api/private` | ✅ Yes | - | Requires valid JWT |
| `GET /api/admin` | ✅ Yes | Admin | Admin-only endpoint |

### Task Service (Port 4000)

| Endpoint | Auth Required | Role Required | Description |
|----------|--------------|---------------|-------------|
| `GET /health` | ❌ No | - | Health check |
| `GET /api/v1/tasks` | ✅ Yes | - | List all tasks |
| `POST /api/v1/tasks` | ✅ Yes | - | Create task |
| `GET /api/v1/tasks/:id` | ✅ Yes | - | Get task by ID |
| `PATCH /api/v1/tasks/:id` | ✅ Yes | - | Update task |
| `DELETE /api/v1/tasks/:id` | ✅ Yes | **Admin** | Delete task |

---

## 🔑 Shared Configuration (Asgardeo)

Both services use **THE SAME** Asgardeo configuration:

```javascript
{
  jwksUri: "https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks",
  audience: "KYEfJzks5uXRratlXxNpS9dvpRQa",
  issuer: "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  algorithms: ["RS256"]
}
```

This ensures:
- ✅ Both services trust the same JWT tokens
- ✅ Same user can access both services with one login
- ✅ Consistent authentication across microservices

---

## 🧩 What Was Changed

### ✅ Task Service Updates

1. **Port Changed:** 3000 → **4000** (avoid conflict with frontend)
2. **Dependencies Added:** `express-jwt` + `jwks-rsa`
3. **Auth Middleware Created:** `/src/middlewares/auth.middleware.ts`
4. **Routes Protected:** All task routes require JWT authentication
5. **RBAC Added:** Delete operation restricted to admins
6. **TypeScript Types:** Extended Express Request with JWT types
7. **Configuration:** Added JWT config to `.env` and `config/index.ts`

### Files Modified/Created:
```
task-service-master/
├── src/
│   ├── config/index.ts              (✏️ Modified - Added auth config)
│   ├── middlewares/
│   │   └── auth.middleware.ts       (✨ NEW - JWT validation)
│   ├── routes/task.routes.ts        (✏️ Modified - Protected routes)
│   └── types/express.d.ts           (✏️ Modified - JWT types)
├── .env                             (✏️ Modified - Port + JWT config)
├── .env.example                     (✨ NEW)
├── docker-compose.yml               (✏️ Modified - Port 4000)
├── package.json                     (✏️ Modified - Added dependencies)
├── README.md                        (✏️ Modified - Updated docs)
└── INTEGRATION_GUIDE.md             (✨ NEW - How to use)
```

---

## 🚀 How to Run (Complete Setup)

### Option 1: Run Everything Locally

#### Terminal 1 - Auth Backend
```bash
cd user-auth-demo/backend
npm install
npm run dev
# Running on http://localhost:8080
```

#### Terminal 2 - Task Service
```bash
cd task-service-master
npm install  # This will install express-jwt and jwks-rsa
npm run migration:run  # Setup database
npm run dev:local
# Running on http://localhost:4000
```

#### Terminal 3 - Frontend
```bash
cd user-auth-demo/frontend
npm install
npm run dev
# Running on http://localhost:3000
```

#### Terminal 4 - Database (if not running)
```bash
cd task-service-master
docker-compose up -d postgres
```

### Option 2: Docker Compose (Task Service Only)

```bash
cd task-service-master
docker-compose up -d
# Task service + PostgreSQL running
```

Then run Auth Service and Frontend manually.

---

## 🧪 Testing the Integration

### Test 1: Unauthenticated Access (Should Fail)
```bash
# Try without token
curl http://localhost:4000/api/v1/tasks

# Expected Response:
# 401 Unauthorized - No authorization token was found
```

### Test 2: Get JWT Token
```bash
# 1. Open browser: http://localhost:3000
# 2. Login with Asgardeo
# 3. Open browser console (F12)
# 4. Type: localStorage.getItem('access_token')
# 5. Copy the token
```

### Test 3: Authenticated Access (Should Succeed)
```bash
# Replace YOUR_TOKEN with actual token from step 2
curl http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected Response:
# { "success": true, "data": [...] }
```

### Test 4: Create Task
```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing integration",
    "priority": "high",
    "status": "todo"
  }'

# Expected Response:
# { "success": true, "data": { "id": "...", "title": "Test Task", ... } }
```

### Test 5: Admin-Only Delete
```bash
# With ADMIN token - should work
curl -X DELETE http://localhost:4000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"

# With USER token - should fail with 403
curl -X DELETE http://localhost:4000/api/v1/tasks/TASK_ID \
  -H "Authorization: Bearer USER_TOKEN"
```

---

## 🎯 Key Concepts

### 1. **Single Sign-On (SSO)**
- User logs in **once** via Asgardeo
- Gets **one JWT token**
- Can access **both services** with the same token

### 2. **Stateless Authentication**
- No session storage needed
- Token contains all user info
- Services validate independently

### 3. **Microservices Independence**
- Each service validates JWT independently
- No direct service-to-service auth calls
- Services can scale separately

### 4. **Shared Trust**
- Both services trust Asgardeo
- Asgardeo's public keys validate tokens
- Consistent security across services

---

## 📚 Documentation Links

- **Main Integration Plan:** `/MICROSERVICES_INTEGRATION.md`
- **Task Service Integration Guide:** `/task-service-master/INTEGRATION_GUIDE.md`
- **Task Service README:** `/task-service-master/README.md`
- **Auth Service README:** `/user-auth-demo/README.md`

---

## 🔧 Troubleshooting

### Problem: "Cannot find module 'express-jwt'"
```bash
cd task-service-master
npm install
# or
pnpm install
```

### Problem: Port 4000 already in use
```bash
# Kill the process
lsof -ti:4000 | xargs kill -9

# Or change port in .env
PORT=4001
```

### Problem: JWT validation fails
- Check token hasn't expired (default 1 hour)
- Verify JWKS URI is accessible
- Ensure audience/issuer match in both services

### Problem: "Forbidden: Requires 'admin' role"
- Login with admin user (admin@demo.com)
- Or remove checkRole middleware for testing

---

## ✅ Success Checklist

Connection is successful when:

- [ ] Frontend runs on port 3000
- [ ] Auth backend runs on port 8080
- [ ] Task service runs on port 4000
- [ ] Can login via Asgardeo
- [ ] Token stored in localStorage
- [ ] Can create tasks with token
- [ ] Can view tasks with token
- [ ] Admin can delete tasks
- [ ] Regular user cannot delete tasks
- [ ] Unauthenticated requests are rejected

---

## 🎉 Summary

**You now have TWO microservices connected via JWT authentication:**

1. **Auth Service** handles login and issues JWT tokens
2. **Task Service** validates those same JWT tokens
3. **Frontend** uses one token to access both services
4. **Asgardeo** is the single source of truth for authentication
5. **RBAC** works across both services (admin/user roles)

The architecture is **stateless**, **scalable**, and follows **microservices best practices**!

---

**Need help?** Check the detailed guides:
- Setup: `task-service-master/INTEGRATION_GUIDE.md`
- Architecture: `MICROSERVICES_INTEGRATION.md`
