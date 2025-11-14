# API Testing Guide with Swagger

## 📚 Overview

This guide shows you how to test all API endpoints using **Swagger UI** - an interactive API documentation and testing tool.

## 🚀 Quick Start

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 4000
📚 API Documentation: http://localhost:4000/api-docs
```

### Step 2: Open Swagger UI
Open your browser and go to:
```
http://localhost:4000/api-docs
```

You'll see an interactive API documentation interface with all available endpoints.

## 🔐 Authentication Setup

Most endpoints require a JWT token from Asgardeo. Here's how to get and use it:

### Method 1: Get Token from Frontend (Easiest)

1. **Start the frontend**:
   ```bash
   cd frontend
   npm start
   ```

2. **Login** at `http://localhost:3000`

3. **Open Browser Console** (F12) and run:
   ```javascript
   // Get access token
   const token = await window.asgardeo.getAccessToken();
   console.log(token);
   ```

4. **Copy the token** that appears in console

### Method 2: Get Token from Asgardeo Directly

1. Login to Asgardeo Console
2. Go to your application
3. Use the "Try It" feature to get a token
4. Copy the access token

### Using Token in Swagger

1. Click the **"Authorize" button** (🔒 icon) at the top right of Swagger UI
2. Paste your token in the "Value" field:
   ```
   Bearer YOUR_JWT_TOKEN_HERE
   ```
   Or just paste the token without "Bearer " - Swagger adds it automatically
3. Click **"Authorize"**
4. Click **"Close"**

Now all your API requests will include the authentication token! 🎉

## 📋 Testing Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Health Check
- **Endpoint**: `GET /`
- **Purpose**: Check if server is running
- **Steps**:
  1. Find the `Health` section in Swagger
  2. Click `GET /`
  3. Click "Try it out"
  4. Click "Execute"
- **Expected Response**:
  ```json
  {
    "message": "🚀 Server is running!",
    "endpoints": {
      "protected": "/api/protected",
      "swagger": "/api-docs"
    }
  }
  ```

### Authenticated Endpoints (Require JWT Token)

#### 2. Protected Endpoint
- **Endpoint**: `GET /api/protected`
- **Purpose**: Basic authentication test
- **Required**: Valid JWT token
- **Steps**:
  1. Make sure you've authorized (see Authentication Setup above)
  2. Find `Authentication` section
  3. Click `GET /api/protected`
  4. Click "Try it out"
  5. Click "Execute"
- **Expected Response (200 OK)**:
  ```json
  {
    "message": "✅ Access granted",
    "user": {
      "userId": "user-123",
      "email": "user@example.com",
      "username": "john_doe",
      "roles": ["admin"],
      "fullName": "John Doe",
      "isAdmin": true
    }
  }
  ```

#### 3. Check User Role
- **Endpoint**: `GET /api/check-role`
- **Purpose**: See your current roles and permissions
- **Required**: Valid JWT token
- **Steps**:
  1. Find `Authentication` section
  2. Click `GET /api/check-role`
  3. Click "Try it out"
  4. Click "Execute"
- **Expected Response**:
  ```json
  {
    "success": true,
    "userId": "user-123",
    "username": "john_doe",
    "email": "user@example.com",
    "roles": ["admin", "user"],
    "isAdmin": true,
    "hasUserRole": true,
    "hasViewerRole": false
  }
  ```

#### 4. Get Current User Info
- **Endpoint**: `GET /api/user/me`
- **Purpose**: Get your user information
- **Required**: Valid JWT token
- **Steps**:
  1. Find `User` section
  2. Click `GET /api/user/me`
  3. Click "Try it out"
  4. Click "Execute"

#### 5. Get User Profile
- **Endpoint**: `GET /api/user/profile`
- **Purpose**: Get detailed user profile with preferences
- **Required**: JWT token with 'user' or 'admin' role
- **Steps**:
  1. Find `User` section
  2. Click `GET /api/user/profile`
  3. Click "Try it out"
  4. Click "Execute"
- **Expected Response (200 OK)**:
  ```json
  {
    "message": "✅ User profile access granted",
    "profile": {
      "userId": "user-123",
      "email": "user@example.com",
      "roles": ["user"],
      "preferences": {
        "theme": "light",
        "notifications": true
      }
    }
  }
  ```
- **Error Response (403 Forbidden)** if you don't have required role:
  ```json
  {
    "error": "Access Denied",
    "message": "This endpoint requires one of the following roles: user, User, admin, Administrator"
  }
  ```

### Admin-Only Endpoints (Require Admin Role)

#### 6. Admin Dashboard
- **Endpoint**: `GET /api/admin/dashboard`
- **Purpose**: Get admin dashboard statistics
- **Required**: JWT token with 'admin' role
- **Steps**:
  1. Make sure you're logged in as admin
  2. Find `Admin` section
  3. Click `GET /api/admin/dashboard`
  4. Click "Try it out"
  5. Click "Execute"
- **Expected Response (200 OK)**:
  ```json
  {
    "message": "✅ Welcome to Admin Dashboard",
    "stats": {
      "totalUsers": 156,
      "activeUsers": 89,
      "newUsers": 12,
      "apiCalls": 2547
    }
  }
  ```
- **Error Response (403 Forbidden)** if not admin:
  ```json
  {
    "error": "Access Denied",
    "message": "This endpoint requires one of the following roles: admin, Administrator",
    "yourRoles": ["user"]
  }
  ```

#### 7. Get All Users (Admin)
- **Endpoint**: `GET /api/admin/users`
- **Purpose**: Get list of all users
- **Required**: JWT token with 'admin' role
- **Steps**:
  1. Find `Admin` section
  2. Click `GET /api/admin/users`
  3. Click "Try it out"
  4. Click "Execute"
- **Expected Response**:
  ```json
  {
    "message": "✅ Admin access - User list",
    "users": [
      { "id": 1, "username": "admin", "email": "admin@example.com", "role": "admin" },
      { "id": 2, "username": "user1", "email": "user1@example.com", "role": "user" },
      { "id": 3, "username": "viewer1", "email": "viewer@example.com", "role": "viewer" }
    ]
  }
  ```

## 🎯 Common Testing Scenarios

### Scenario 1: Test as Regular User

1. **Login** with regular user account (email: `user@example.com`)
2. **Get token** from browser console
3. **Authorize** in Swagger with the token
4. **Test these endpoints** (should work):
   - ✅ `GET /api/protected`
   - ✅ `GET /api/check-role`
   - ✅ `GET /api/user/me`
   - ✅ `GET /api/user/profile`
5. **Test admin endpoints** (should fail with 403):
   - ❌ `GET /api/admin/dashboard`
   - ❌ `GET /api/admin/users`

### Scenario 2: Test as Admin

1. **Login** with admin account (email: `admin@example.com`)
2. **Get token** from browser console
3. **Authorize** in Swagger with the token
4. **Test all endpoints** (should all work):
   - ✅ `GET /api/protected`
   - ✅ `GET /api/check-role`
   - ✅ `GET /api/user/me`
   - ✅ `GET /api/user/profile`
   - ✅ `GET /api/admin/dashboard`
   - ✅ `GET /api/admin/users`

### Scenario 3: Test Without Authentication

1. **Clear authorization** (click 🔒 icon → "Logout")
2. **Try protected endpoints** (should fail with 401):
   - ❌ `GET /api/protected`
   - ❌ `GET /api/check-role`
   - ❌ `GET /api/user/me`

## 📊 Understanding Response Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Token valid but insufficient permissions (wrong role) |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Something went wrong on server |

## 🔍 Swagger UI Features

### 1. Try It Out
- Click "Try it out" button to enable the form
- Fill in any parameters
- Click "Execute" to send the request

### 2. View Response
After executing:
- See the **Response Code** (200, 401, 403, etc.)
- View **Response Body** (the JSON data returned)
- Check **Response Headers**
- See **Request Duration**

### 3. Models/Schemas
- Click on schemas to see data structure
- Expand to see all properties
- See examples

### 4. Copy cURL Command
- After executing a request, you can copy the cURL command
- Use it in terminal for automated testing

Example:
```bash
curl -X 'GET' \
  'http://localhost:4000/api/check-role' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## 🧪 Advanced Testing

### Testing Different Roles

1. **Create test users** in Asgardeo with different roles:
   - admin@example.com → admin role
   - user@example.com → user role
   - viewer@example.com → viewer role

2. **Login with each user** and get their token

3. **Test each endpoint** with different tokens to verify RBAC

### Testing Token Expiration

1. Get a token
2. Wait for it to expire (default: 1 hour)
3. Try using expired token
4. Should get 401 Unauthorized

### Testing Invalid Tokens

1. Modify a few characters in your token
2. Try using the modified token
3. Should get 401 Unauthorized

## 🛠️ Troubleshooting

### "Failed to fetch" Error
**Problem**: Cannot connect to backend  
**Solution**: Make sure backend is running on port 4000

### 401 Unauthorized
**Problem**: Token is invalid or expired  
**Solutions**:
- Get a fresh token
- Check token is properly copied (no extra spaces)
- Verify token includes "Bearer " prefix (or let Swagger add it)

### 403 Forbidden
**Problem**: You don't have required role  
**Solutions**:
- Check your roles with `GET /api/check-role`
- Login with account that has required role
- Configure roles in Asgardeo (see `ASGARDEO_ROLES_SETUP.md`)

### Swagger Not Loading
**Problem**: Can't access http://localhost:4000/api-docs  
**Solutions**:
- Check backend is running: `npm start` in backend folder
- Verify port 4000 is not blocked
- Try clearing browser cache

## 📝 Testing Checklist

Before considering testing complete, verify:

- [ ] Health check works without authentication
- [ ] Can authenticate with valid token
- [ ] Protected endpoint works with valid token
- [ ] Admin endpoints work with admin token
- [ ] Admin endpoints fail with non-admin token
- [ ] All endpoints fail with invalid token
- [ ] All endpoints fail without token
- [ ] Role check shows correct roles
- [ ] User profile returns correct data

## 🚀 Microservices Testing

To test the complete microservices setup:

### Start All Services
```bash
# Terminal 1: Main API
cd backend
npm start
# Swagger: http://localhost:4000/api-docs

# Terminal 2: User Service
cd backend/services/user-service
npm start
# Available at: http://localhost:4001

# Terminal 3: Analytics Service
cd backend/services/analytics-service
npm start
# Available at: http://localhost:4002
```

### Test Token Sharing
Use the same JWT token across all services:

1. Get token from Asgardeo
2. Test Main API endpoints
3. Test User Service endpoints
4. Test Analytics Service endpoints
5. All should accept the same token ✅

## 💡 Best Practices

1. **Always test with fresh tokens** - don't use expired tokens
2. **Test both success and failure cases** - verify proper error handling
3. **Check response data** - make sure data is correct, not just status code
4. **Test role-based access** - verify users can only access what they should
5. **Document your tests** - note what works and what doesn't

## 📚 Additional Resources

- **Swagger Documentation**: https://swagger.io/docs/
- **JWT Debugger**: https://jwt.io/
- **Asgardeo Docs**: https://wso2.com/asgardeo/docs/
- **Project Guide**: See `PROJECT_GUIDE.md`
- **Microservices Guide**: See `MICROSERVICES_GUIDE.md`
- **Asgardeo Setup**: See `ASGARDEO_ROLES_SETUP.md`

---

## 🎉 You're Ready!

You now have everything you need to test your APIs using Swagger. Start with the health check, then move to authenticated endpoints, and finally test the role-based access control.

Happy Testing! 🚀
