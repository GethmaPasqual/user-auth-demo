# 🚀 Quick Start Guide - Connected Microservices

**Get both services running in 5 minutes!**

---

## ✅ Prerequisites Check

```bash
# Check Node.js (need v18+)
node --version

# Check npm or pnpm
npm --version
# or
pnpm --version

# Check Docker (optional, for database)
docker --version
```

---

## 🏃 Fast Setup (Copy & Paste)

### Step 1: Install All Dependencies

```bash
# Navigate to project root
cd /home/dasith-112541/Documents/gethma

# Install Auth Backend
cd user-auth-demo/backend
npm install

# Install Auth Frontend
cd ../frontend
npm install

# Install Task Service
cd ../../task-service-master
npm install  # This installs express-jwt and jwks-rsa
```

### Step 2: Start Database

```bash
# From task-service-master directory
cd /home/dasith-112541/Documents/gethma/task-service-master

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Wait 10 seconds for database to be ready
sleep 10

# Run migrations
npm run migration:run
```

### Step 3: Start All Services

Open **4 terminal windows**:

#### Terminal 1: Auth Backend
```bash
cd /home/dasith-112541/Documents/gethma/user-auth-demo/backend
npm run dev

# ✅ Should see: "Server running on http://localhost:8080"
```

#### Terminal 2: Task Service
```bash
cd /home/dasith-112541/Documents/gethma/task-service-master
npm run dev:local

# ✅ Should see: "Task Service running on port 4000"
# ✅ Should see: "Task gRPC server running on port 50052"
```

#### Terminal 3: Frontend
```bash
cd /home/dasith-112541/Documents/gethma/user-auth-demo/frontend
npm run dev

# ✅ Should see: "Local: http://localhost:3000"
```

#### Terminal 4: Test/Development
```bash
# Keep this free for testing commands
```

---

## 🧪 Verify Everything Works

### Test 1: Check All Services Are Running

```bash
# Check Auth Backend
curl http://localhost:8080/api/public
# Expected: {"message":"This is a public endpoint"}

# Check Task Service
curl http://localhost:4000/health
# Expected: {"status":"ok"}

# Check Frontend
curl http://localhost:3000
# Expected: HTML content
```

### Test 2: Login and Get Token

1. Open browser: http://localhost:3000
2. Click "Sign In with Asgardeo"
3. Login with:
   - **Admin:** admin@demo.com
   - **User:** user@demo.com
4. After login, open browser console (F12)
5. Run: `localStorage.getItem('access_token')`
6. Copy the token

### Test 3: Test Task API with Token

```bash
# Replace YOUR_TOKEN with the token from step 2
TOKEN="YOUR_TOKEN_HERE"

# Test authenticated request
curl http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected: {"success":true,"data":[]}
```

### Test 4: Create a Task

```bash
curl -X POST http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Task",
    "description": "Testing the integration",
    "priority": "high",
    "status": "todo"
  }'

# Expected: {"success":true,"data":{...task details...}}
```

---

## 🎯 Access Points

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | Main app |
| **Auth API** | http://localhost:8080 | Auth endpoints |
| **Task API** | http://localhost:4000 | Task endpoints |
| **Database** | postgresql://localhost:5432/taskdb | Data storage |
| **gRPC** | localhost:50052 | Task gRPC |

---

## 👥 Test Users

| Email | Password | Role | Can Delete Tasks |
|-------|----------|------|-----------------|
| admin@demo.com | (Set in Asgardeo) | Admin | ✅ Yes |
| user@demo.com | (Set in Asgardeo) | User | ❌ No |

---

## 🔧 Common Issues & Fixes

### Issue: "Port already in use"

```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8080 | xargs kill -9  # Auth backend
lsof -ti:4000 | xargs kill -9  # Task service
lsof -ti:5432 | xargs kill -9  # PostgreSQL
```

### Issue: "Cannot find module 'express-jwt'"

```bash
cd /home/dasith-112541/Documents/gethma/task-service-master
npm install
# or
pnpm install
```

### Issue: Database connection failed

```bash
# Restart PostgreSQL
cd /home/dasith-112541/Documents/gethma/task-service-master
docker-compose restart postgres

# Check if running
docker ps | grep postgres

# View logs
docker logs task-service-postgres
```

### Issue: JWT validation fails

**Solutions:**
- Token expired? Login again to get new token
- Check `.env` has correct JWT configuration
- Verify Asgardeo is accessible
- Clear browser cache and localStorage

### Issue: CORS errors

Update `/task-service-master/src/app.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
```

---

## 🛑 Stop Everything

```bash
# Stop all Node processes
pkill -f node

# Stop Docker containers
cd /home/dasith-112541/Documents/gethma/task-service-master
docker-compose down
```

---

## 📊 Architecture Summary

```
Frontend (3000) ─────┐
                     ├──> Auth Service (8080) ──> Asgardeo
                     │
                     └──> Task Service (4000) ──> PostgreSQL
                                               └──> RabbitMQ
                                               └──> gRPC (50052)
```

---

## 📚 Next Steps

Once everything is running:

1. ✅ **Explore the APIs** - See `ARCHITECTURE_DIAGRAMS.md`
2. ✅ **Understand the flow** - See `HOW_SERVICES_CONNECT.md`
3. ✅ **Full integration details** - See `MICROSERVICES_INTEGRATION.md`
4. ✅ **Task service guide** - See `task-service-master/INTEGRATION_GUIDE.md`

---

## ✨ Success Checklist

- [ ] All dependencies installed
- [ ] PostgreSQL running
- [ ] Auth backend running on 8080
- [ ] Task service running on 4000
- [ ] Frontend running on 3000
- [ ] Can login via Asgardeo
- [ ] Token stored in localStorage
- [ ] Can create tasks
- [ ] Can view tasks
- [ ] Unauthenticated requests are rejected

---

## 🆘 Need Help?

**Check the detailed documentation:**
- Full integration plan: `MICROSERVICES_INTEGRATION.md`
- How services connect: `HOW_SERVICES_CONNECT.md`
- Architecture diagrams: `ARCHITECTURE_DIAGRAMS.md`
- Task service guide: `task-service-master/INTEGRATION_GUIDE.md`

**Common commands:**
```bash
# View logs
cd task-service-master
docker-compose logs -f postgres

# Restart service
npm run dev:local

# Check what's running
lsof -i :3000,8080,4000,5432
```

---

**You're all set! 🎉**

The microservices are now connected and communicating through JWT authentication!
