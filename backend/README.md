# Backend - User Authentication API

This is the backend API server for the User Authentication Demo application with **Swagger API Documentation**.

## 🚀 Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Create `.env` file** in `config/` folder:
```env
ASGARDEO_AUDIENCE=your-asgardeo-client-id
ASGARDEO_ISSUER=https://api.asgardeo.io/t/yourorg
FRONTEND_URL=http://localhost:3000
PORT=4000
```

3. **Start the server**:
```bash
npm start
```

4. **Access Swagger API Docs**:
```
http://localhost:4000/api-docs
```

## 📚 API Documentation

Interactive API documentation is available via **Swagger UI** at:
```
http://localhost:4000/api-docs
```

### Features:
- 🔍 Browse all API endpoints
- 🧪 Test APIs directly from browser
- 🔐 Built-in authentication with JWT tokens
- 📖 Detailed request/response examples
- 📊 Schema definitions and models

## 🔐 API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /api-docs` - Swagger documentation

### Authentication Endpoints
- `GET /api/protected` - Basic auth check (requires JWT)
- `GET /api/check-role` - Get user roles and permissions (requires JWT)
- `GET /api/user/me` - Get current user info (requires JWT)

### User Endpoints
- `GET /api/user/profile` - Get user profile (requires user/admin role)

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard stats (requires admin role)
- `GET /api/admin/users` - Get all users (requires admin role)

## 🧪 Testing APIs with Swagger

### Step 1: Start Server
```bash
npm start
```

### Step 2: Get JWT Token
1. Login to frontend at `http://localhost:3000`
2. Open browser console (F12)
3. Run: `const token = await window.asgardeo.getAccessToken()`
4. Copy the token

### Step 3: Authorize in Swagger
1. Go to `http://localhost:4000/api-docs`
2. Click **"Authorize"** button (🔒 icon)
3. Paste your token
4. Click **"Authorize"** then **"Close"**

### Step 4: Test Endpoints
1. Click on any endpoint
2. Click **"Try it out"**
3. Click **"Execute"**
4. See the response!

📖 **Full Testing Guide**: See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

## 🏗️ Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT Authentication** - express-oauth2-jwt-bearer
- **Asgardeo Integration** - OAuth 2.0/OIDC
- **Swagger UI** - API documentation
- **Swagger JSDoc** - API annotations
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js              # Main server with Swagger annotations
│   ├── config/
│   │   └── swagger.js         # Swagger configuration
│   ├── middleware/
│   │   └── roleCheck.js       # RBAC middleware
│   └── utils/
│       └── authUtils.js       # JWT utilities
├── config/
│   └── .env                   # Environment variables
├── package.json
├── README.md
└── API_TESTING_GUIDE.md      # Comprehensive testing guide
```

## 🔒 Role-Based Access Control (RBAC)

The API implements role-based access control:

| Role | Access |
|------|--------|
| **Admin** | All endpoints |
| **User** | User endpoints + auth endpoints |
| **Viewer** | Auth endpoints only |
| **Public** | Health check only |

## 🛠️ Development

### Run Development Server
```bash
npm start
```

The server runs on **port 4000** by default.

### View Logs
Server logs show:
- 🚀 Server status
- 📚 Swagger documentation URL
- 🔐 Authentication attempts
- ❌ Errors and failures

### Update API Documentation
Add Swagger annotations above your endpoints in `server.js`:

```javascript
/**
 * @swagger
 * /api/example:
 *   get:
 *     summary: Example endpoint
 *     tags: [Example]
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/api/example', (req, res) => {
  res.json({ message: 'Example' });
});
```

## 🧪 Testing

### Manual Testing with Swagger
Visit `http://localhost:4000/api-docs` and use the interactive interface.

### cURL Testing
```bash
# Get token first from frontend
TOKEN="your-jwt-token"

# Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/protected

# Test admin endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:4000/api/admin/dashboard
```

### Automated Testing
See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) for comprehensive testing scenarios.

## 🐛 Troubleshooting

### Swagger not loading?
- Check server is running: `npm start`
- Verify port 4000 is available
- Clear browser cache

### 401 Unauthorized errors?
- Token might be expired
- Get fresh token from frontend
- Check Authorization header format

### 403 Forbidden errors?
- User doesn't have required role
- Check roles with `/api/check-role`
- Configure roles in Asgardeo

## 📚 Related Documentation

- **API Testing Guide**: [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
- **Asgardeo Setup**: [../ASGARDEO_ROLES_SETUP.md](../ASGARDEO_ROLES_SETUP.md)
- **Microservices**: [../MICROSERVICES_GUIDE.md](../MICROSERVICES_GUIDE.md)
- **Project Guide**: [../PROJECT_GUIDE.md](../PROJECT_GUIDE.md)

## 🎯 Next Steps

1. ✅ Start backend server
2. ✅ Open Swagger UI
3. ✅ Get JWT token from frontend
4. ✅ Authorize in Swagger
5. ✅ Test all endpoints
6. ✅ Try different user roles
7. ✅ Check error responses

Happy Testing! 🚀
