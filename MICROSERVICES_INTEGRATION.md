# 🔗 Microservices Integration Plan

**Date:** December 6, 2025  
**Author:** Integration Documentation  
**Status:** Implementation Guide

---

## 📋 Executive Summary

This document outlines the integration strategy for connecting the **User Authentication Service** (user-auth-demo) with the **Task Management Service** (task-service-master) to create a unified, secure microservices architecture.

---

## 🎯 Current State

### Service 1: User-Auth-Demo (Authentication Service)
- **Location:** `/home/dasith-112541/Documents/gethma/user-auth-demo`
- **Purpose:** JWT-based authentication using Asgardeo OAuth 2.0
- **Ports:** 
  - Frontend: 3000
  - Backend: 8080
- **Status:** ✅ Fully functional
- **Authentication:** Asgardeo OAuth 2.0 with RS256 JWT tokens

### Service 2: Task-Service-Master (Task Management)
- **Location:** `/home/dasith-112541/Documents/gethma/task-service-master`
- **Purpose:** Task CRUD operations with project integration
- **Ports:**
  - REST API: 3000
  - gRPC Server: 50052
- **Status:** ⚠️ No authentication implemented
- **Database:** PostgreSQL
- **Messaging:** RabbitMQ for event publishing

---

## 🏗️ Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                      │
│                        Port: 3000                                │
│  • Login via Asgardeo                                            │
│  • Stores JWT token                                              │
│  • Makes API calls with Authorization header                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP + JWT Token
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐           ┌────────────────────┐
│  Auth Service     │           │  Task Service      │
│  Port: 8080       │           │  Port: 4000        │ (Changed from 3000)
├───────────────────┤           ├────────────────────┤
│ ✓ JWT Validation  │           │ ✓ JWT Validation   │ (NEW)
│ ✓ RBAC            │           │ ✓ Protected Routes │ (NEW)
│ ✓ User Info       │           │ ✓ User Context     │ (NEW)
│                   │           │ ✓ Task CRUD        │
│                   │           │ ✓ gRPC Server      │
│                   │           │ ✓ Event Publishing │
└─────────┬─────────┘           └─────────┬──────────┘
          │                               │
          ▼                               ▼
┌──────────────────┐           ┌──────────────────┐
│    Asgardeo      │           │   PostgreSQL     │
│  OAuth Provider  │           │    Database      │
└──────────────────┘           └──────────────────┘
                                        │
                               ┌────────┴────────┐
                               │                 │
                               ▼                 ▼
                    ┌──────────────┐  ┌──────────────┐
                    │  RabbitMQ    │  │  Project     │
                    │  Events      │  │  Service     │
                    │              │  │  (gRPC)      │
                    └──────────────┘  └──────────────┘
```

---

## 🔧 Implementation Steps

### Phase 1: Update Task Service Port ✅
**Why:** Avoid port conflict with frontend (both using 3000)

- Change Task Service from port 3000 → 4000
- Update configuration files
- Update documentation

### Phase 2: Add JWT Authentication to Task Service ✅
**What:** Implement the same JWT validation used in Auth Service

**Files to Create/Modify:**
1. `task-service-master/src/middlewares/auth.middleware.ts` - JWT validation
2. `task-service-master/src/types/express.d.ts` - TypeScript types
3. `task-service-master/src/routes/task.routes.ts` - Protect routes
4. `task-service-master/package.json` - Add dependencies

**New Dependencies:**
```json
{
  "express-jwt": "^8.4.1",
  "jwks-rsa": "^3.1.0"
}
```

### Phase 3: Integrate User Context ✅
**What:** Extract user information from JWT and use in task operations

**Features:**
- Auto-assign tasks to logged-in user
- Filter tasks by user
- Track task ownership
- Audit trail with user information

### Phase 4: Update Frontend Integration ✅
**What:** Configure frontend to communicate with both services

**API Endpoints:**
```javascript
// Auth endpoints → Port 8080
http://localhost:8080/api/public
http://localhost:8080/api/private
http://localhost:8080/api/admin

// Task endpoints → Port 4000
http://localhost:4000/api/v1/tasks
http://localhost:4000/api/v1/tasks/:id
http://localhost:4000/api/v1/tasks/statistics
```

### Phase 5: Event-Driven Integration (Optional) 🔄
**What:** Services communicate via RabbitMQ events

**Potential Events:**
- `user.created` → Create user profile in Task Service
- `user.deleted` → Cleanup user's tasks
- `task.assigned` → Notify user via Auth Service
- `role.changed` → Update task permissions

---

## 🔒 Security Implementation

### JWT Token Flow
```
1. User logs in via Asgardeo
   ↓
2. Frontend receives JWT token
   ↓
3. Frontend stores token (localStorage/sessionStorage)
   ↓
4. All API calls include: Authorization: Bearer <token>
   ↓
5. Both services validate token using JWKS
   ↓
6. Extract user info (sub, email, roles)
   ↓
7. Process request with user context
```

### Protected Endpoints

#### Auth Service (Already Implemented)
- `GET /api/public` - ❌ No auth required
- `GET /api/private` - ✅ Requires valid JWT
- `GET /api/admin` - ✅ Requires JWT + Admin role

#### Task Service (To Be Implemented)
- `GET /api/v1/health` - ❌ No auth required
- `GET /api/v1/tasks` - ✅ Requires valid JWT
- `POST /api/v1/tasks` - ✅ Requires valid JWT
- `GET /api/v1/tasks/:id` - ✅ Requires valid JWT (own tasks only)
- `PATCH /api/v1/tasks/:id` - ✅ Requires valid JWT (own tasks only)
- `DELETE /api/v1/tasks/:id` - ✅ Requires valid JWT + Admin role
- `GET /api/v1/tasks/statistics` - ✅ Requires valid JWT

---

## 📊 Data Flow Examples

### Example 1: Create Task
```
1. User authenticated in frontend
2. User fills task form
3. Frontend sends POST request:
   POST http://localhost:4000/api/v1/tasks
   Headers: {
     Authorization: Bearer eyJhbGc...
   }
   Body: {
     title: "Complete documentation",
     description: "Write API docs",
     priority: "high"
   }

4. Task Service validates JWT
5. Extracts user_id from token (sub claim)
6. Creates task with assigned_to = user_id
7. Publishes task.created event to RabbitMQ
8. Returns created task to frontend
```

### Example 2: Get User's Tasks
```
1. User opens Tasks page
2. Frontend requests user's tasks:
   GET http://localhost:4000/api/v1/tasks?assignedTo=me
   Headers: {
     Authorization: Bearer eyJhbGc...
   }

3. Task Service validates JWT
4. Extracts user_id from token
5. Queries database for tasks where assigned_to = user_id
6. Returns filtered tasks
```

### Example 3: Admin Deletes Any Task
```
1. Admin user authenticated
2. Admin requests task deletion:
   DELETE http://localhost:4000/api/v1/tasks/123
   Headers: {
     Authorization: Bearer eyJhbGc...
   }

3. Task Service validates JWT
4. Checks user roles for 'admin'
5. If admin: allows deletion
6. If not admin: checks if user owns task
7. Publishes task.deleted event
8. Returns success
```

---

## 🔐 Authentication Configuration

### Shared Asgardeo Config
Both services use the same configuration:

```typescript
{
  jwksUri: "https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks",
  audience: "KYEfJzks5uXRratlXxNpS9dvpRQa",
  issuer: "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  algorithms: ["RS256"]
}
```

### JWT Token Claims
```json
{
  "sub": "user-unique-id",
  "email": "user@example.com",
  "username": "user@example.com",
  "given_name": "John",
  "family_name": "Doe",
  "roles": "admin,user",
  "aud": "KYEfJzks5uXRratlXxNpS9dvpRQa",
  "iss": "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
  "exp": 1701878400,
  "iat": 1701874800
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- JWT middleware validation
- Role checking logic
- User context extraction

### Integration Tests
- End-to-end authentication flow
- Task creation with user context
- Role-based access control
- Cross-service communication

### Test Scenarios
1. ✅ Unauthenticated user cannot access protected routes
2. ✅ Authenticated user can create tasks
3. ✅ User can only view/edit own tasks
4. ✅ Admin can view/edit all tasks
5. ✅ Invalid JWT is rejected
6. ✅ Expired JWT is rejected
7. ✅ Token with wrong audience is rejected

---

## 🚀 Deployment Considerations

### Environment Variables

#### Task Service (.env)
```bash
# Server
PORT=4000
GRPC_PORT=50052
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskdb
DB_USER=taskuser
DB_PASSWORD=taskpass

# Authentication (NEW)
JWT_JWKS_URI=https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks
JWT_AUDIENCE=KYEfJzks5uXRratlXxNpS9dvpRQa
JWT_ISSUER=https://api.asgardeo.io/t/testforfinalproject/oauth2/token

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin123@localhost:5672

# Project Service
PROJECT_SERVICE_GRPC_URL=localhost:50051
```

### Docker Compose Updates
```yaml
version: '3.8'

services:
  auth-backend:
    build: ./user-auth-demo/backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production

  task-service:
    build: ./task-service-master
    ports:
      - "4000:4000"
      - "50052:50052"
    environment:
      - NODE_ENV=production
      - PORT=4000
    depends_on:
      - postgres
      - rabbitmq

  frontend:
    build: ./user-auth-demo/frontend
    ports:
      - "3000:3000"
    depends_on:
      - auth-backend
      - task-service
```

---

## 📈 Future Enhancements

### Phase 6: API Gateway (Optional)
- Centralized routing
- Rate limiting
- Request logging
- Single entry point

### Phase 7: Service Mesh (Advanced)
- Istio/Linkerd integration
- Advanced traffic management
- Service-to-service encryption

### Phase 8: Observability
- Distributed tracing (Jaeger)
- Centralized logging (ELK Stack)
- Metrics (Prometheus + Grafana)

---

## 📝 Migration Checklist

- [x] Document current architecture
- [ ] Update Task Service port to 4000
- [ ] Install JWT dependencies in Task Service
- [ ] Create auth middleware for Task Service
- [ ] Add TypeScript types for JWT
- [ ] Protect Task Service routes
- [ ] Update frontend API configuration
- [ ] Test authentication flow
- [ ] Test task creation with user context
- [ ] Test role-based access control
- [ ] Update documentation
- [ ] Deploy to development environment
- [ ] Conduct integration testing
- [ ] Deploy to production

---

## 🆘 Troubleshooting

### Common Issues

**Issue 1: JWT validation fails**
- Check JWKS URI is accessible
- Verify audience and issuer match Asgardeo config
- Check token expiration

**Issue 2: Port conflicts**
- Ensure Task Service uses port 4000
- Verify frontend is on port 3000
- Check Auth Service is on port 8080

**Issue 3: CORS errors**
- Add frontend origin to CORS config in both services
- Ensure preflight requests are handled

**Issue 4: User context not available**
- Check JWT middleware is applied before route handlers
- Verify token includes 'sub' claim
- Check TypeScript types for req.auth

---

## 📚 References

- [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
- [express-jwt Documentation](https://github.com/auth0/express-jwt)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Microservices Patterns](https://microservices.io/patterns/)

---

## ✅ Success Criteria

Integration is complete when:

1. ✅ User can log in via Asgardeo
2. ✅ User can create tasks with automatic assignment
3. ✅ User can only view/edit own tasks
4. ✅ Admin can manage all tasks
5. ✅ All API calls are authenticated
6. ✅ JWT tokens are properly validated
7. ✅ Services run on different ports without conflicts
8. ✅ Frontend communicates with both services seamlessly
9. ✅ Events are published to RabbitMQ
10. ✅ All tests pass

---

**Last Updated:** December 6, 2025  
**Next Review:** After implementation completion
