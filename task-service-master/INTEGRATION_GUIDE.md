# 🔗 Task Service Integration Guide

## Quick Start - Connect to Auth Service

### Prerequisites
1. ✅ User-Auth-Demo running on port 8080
2. ✅ PostgreSQL running on port 5432
3. ✅ RabbitMQ running on port 5672 (optional)

### Step 1: Install Dependencies
```bash
cd /home/dasith-112541/Documents/gethma/task-service-master
npm install
# or
pnpm install
```

### Step 2: Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# The .env file is already configured with:
# - Port 4000 (avoiding conflict with frontend)
# - JWT authentication pointing to Asgardeo
# - Database connection
```

### Step 3: Start Database
```bash
# Using Docker Compose (recommended)
docker-compose up -d postgres

# Or use your own PostgreSQL instance
```

### Step 4: Run Migrations
```bash
npm run migration:run
# or
pnpm migration:run
```

### Step 5: Start the Service
```bash
# Development mode with hot reload
npm run dev:local
# or
pnpm dev:local

# The service will start on http://localhost:4000
```

---

## 🔐 Authentication Flow

### How It Works
1. **User logs in** via Asgardeo in the frontend
2. **Frontend receives JWT token** from Asgardeo
3. **Frontend makes API calls** to Task Service with `Authorization: Bearer <token>` header
4. **Task Service validates JWT** using Asgardeo's public keys (JWKS)
5. **User information extracted** from JWT token (user ID, email, roles)
6. **Request processed** with user context

### Example API Call
```javascript
// Frontend code
const token = localStorage.getItem('access_token');

fetch('http://localhost:4000/api/v1/tasks', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 📡 API Endpoints

### Authentication Status
All endpoints require JWT authentication except `/health`

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/health` | GET | ❌ No | - | Health check |
| `/api/v1/tasks` | GET | ✅ Yes | Any | Get all user's tasks |
| `/api/v1/tasks` | POST | ✅ Yes | Any | Create new task |
| `/api/v1/tasks/:id` | GET | ✅ Yes | Any | Get task by ID |
| `/api/v1/tasks/:id` | PATCH | ✅ Yes | Any | Update task |
| `/api/v1/tasks/:id` | DELETE | ✅ Yes | Admin | Delete task |

### Example Requests

#### Create Task
```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete documentation",
    "description": "Write API integration guide",
    "priority": "high",
    "status": "todo"
  }'
```

#### Get All Tasks
```bash
curl http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Task
```bash
curl -X PATCH http://localhost:4000/api/v1/tasks/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress"
  }'
```

#### Delete Task (Admin Only)
```bash
curl -X DELETE http://localhost:4000/api/v1/tasks/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Testing the Integration

### Test 1: Unauthenticated Request (Should Fail)
```bash
curl http://localhost:4000/api/v1/tasks
# Expected: 401 Unauthorized
```

### Test 2: Authenticated Request (Should Succeed)
```bash
# First, get token from frontend after login
# Then use it in the request
curl http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer eyJhbGc..."
# Expected: 200 OK with tasks list
```

### Test 3: Admin Delete (Admin User)
```bash
# Admin user can delete tasks
curl -X DELETE http://localhost:4000/api/v1/tasks/123 \
  -H "Authorization: Bearer ADMIN_TOKEN"
# Expected: 204 No Content
```

### Test 4: Regular User Delete (Should Fail)
```bash
# Regular user cannot delete tasks
curl -X DELETE http://localhost:4000/api/v1/tasks/123 \
  -H "Authorization: Bearer USER_TOKEN"
# Expected: 403 Forbidden
```

---

## 🏗️ Frontend Integration

### Update API Configuration

Create or update `frontend/src/services/api/taskService.js`:

```javascript
import api from './index';

const TASK_API_BASE = 'http://localhost:4000/api/v1';

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get(`${TASK_API_BASE}/tasks`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post(`${TASK_API_BASE}/tasks`, taskData);
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id) => {
    const response = await api.get(`${TASK_API_BASE}/tasks/${id}`);
    return response.data;
  },

  // Update task
  updateTask: async (id, updates) => {
    const response = await api.patch(`${TASK_API_BASE}/tasks/${id}`, updates);
    return response.data;
  },

  // Delete task (admin only)
  deleteTask: async (id) => {
    const response = await api.delete(`${TASK_API_BASE}/tasks/${id}`);
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get(`${TASK_API_BASE}/tasks/statistics`);
    return response.data;
  }
};
```

---

## 🔍 Troubleshooting

### Issue: "Cannot find module 'express-jwt'"
**Solution:**
```bash
cd task-service-master
npm install
# or
pnpm install
```

### Issue: JWT validation fails
**Solution:**
- Verify JWKS URI is accessible: https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks
- Check audience and issuer in .env match Asgardeo config
- Ensure token is not expired

### Issue: Port 4000 already in use
**Solution:**
```bash
# Find and kill the process
lsof -ti:4000 | xargs kill -9

# Or change port in .env
PORT=4001
```

### Issue: Database connection failed
**Solution:**
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Check if running
docker ps | grep postgres
```

### Issue: CORS errors
**Solution:**
Update `task-service-master/src/app.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Port 3000)                 │
│  • User logs in via Asgardeo                            │
│  • Stores JWT token in localStorage                     │
│  • Includes token in all API requests                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Authorization: Bearer <JWT>
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌────────────────┐    ┌──────────────────┐
│  Auth Service  │    │  Task Service    │
│  Port: 8080    │    │  Port: 4000      │
├────────────────┤    ├──────────────────┤
│ • User login   │    │ • JWT validation │
│ • JWT issue    │    │ • Task CRUD      │
│ • User info    │    │ • User context   │
│ • RBAC         │    │ • RBAC checks    │
└────────┬───────┘    └─────────┬────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌──────────────────┐
│   Asgardeo      │    │   PostgreSQL     │
│ OAuth Provider  │    │    Database      │
└─────────────────┘    └──────────────────┘
```

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env` file)
- [ ] Database running (PostgreSQL)
- [ ] Migrations executed (`npm run migration:run`)
- [ ] Task Service running on port 4000
- [ ] Auth Service running on port 8080
- [ ] Frontend running on port 3000
- [ ] Can create tasks with authentication
- [ ] Can view tasks with authentication
- [ ] Admin can delete tasks
- [ ] Regular users cannot delete tasks

---

## 🚀 Next Steps

1. **Create a Tasks Page** in the frontend
2. **Add task filtering** by status, priority
3. **Implement real-time updates** using WebSockets
4. **Add notifications** when tasks are assigned
5. **Integrate with Project Service** for project-based tasks

---

**Documentation Complete!** 🎉

For more details, see:
- Main Integration Plan: `/home/dasith-112541/Documents/gethma/MICROSERVICES_INTEGRATION.md`
- Task Service README: `task-service-master/README.md`
- Auth Service README: `user-auth-demo/README.md`
