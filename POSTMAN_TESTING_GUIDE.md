# Backend API Testing with Postman

This guide shows how to test the Team 1 User & Identity Service backend endpoints using Postman.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Your JWT Token](#getting-your-jwt-token)
3. [Testing Endpoints in Postman](#testing-endpoints-in-postman)
4. [Available Endpoints](#available-endpoints)
5. [Step-by-Step Testing Guide](#step-by-step-testing-guide)
6. [Expected Responses](#expected-responses)
7. [Troubleshooting](#troubleshooting)
8. [Postman Collection Export](#postman-collection-export)

---

## Prerequisites

**1. Install Postman**
- Download from: https://www.postman.com/downloads/
- Or use Postman Web: https://web.postman.com/

**2. Start Backend Server**
```bash
cd backend
node server.js
```

Server should be running on: `http://localhost:4000`

**3. Start Frontend & Sign In**
```bash
cd frontend
npm run dev
```

Go to `http://localhost:3000` and sign in to get a valid JWT token.

---

## Getting Your JWT Token

### Method 1: From Browser Console (Recommended)

1. **Sign in to the React app** at `http://localhost:3000`
2. **Open Browser DevTools**:
   - Press `F12` OR
   - Right-click → Inspect → Console tab
3. **Find the token in console logs**:
   - Look for `=== ACCESS TOKEN ===`
   - Copy the long token string (starts with `eyJ...`)

**Example:**
```
=== ACCESS TOKEN ===
Raw Token: eyJ4NXQiOiJxR0dOdGhiWE00ejZoejM1NzlGRDBXamlQT2MiLCJraWQiOiJaV...
```

Copy the entire token after `Raw Token:`

### Method 2: From Dashboard Component

The Dashboard component automatically logs the JWT token to the console. Just sign in and check the console.

### Method 3: Using getAccessToken() Manually

Open browser console after signing in and run:
```javascript
// In browser console
const token = await window.authContext.getAccessToken();
console.log(token);
```

---

## Testing Endpoints in Postman

### Basic Setup

**1. Create New Request**
- Click `New` → `HTTP Request`
- Or use `Ctrl + N` (Windows/Linux) or `Cmd + N` (Mac)

**2. Set Request Method**
- Select `GET` from the dropdown

**3. Enter URL**
- Example: `http://localhost:4000/api/user/profile`

**4. Add Authorization Header** (for protected endpoints)
- Go to **Headers** tab
- Add new header:
  - **Key**: `Authorization`
  - **Value**: `Bearer YOUR_JWT_TOKEN_HERE`

**Important:** There must be a space between `Bearer` and the token!

**5. Send Request**
- Click the blue **Send** button
- View response in the bottom panel

---

## Available Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | ❌ No | API information |
| `/api/user/profile` | GET | ✅ JWT | Get authenticated user profile |
| `/api/user/roles` | GET | ✅ JWT | Get user roles from JWT |
| `/api/admin/dashboard` | GET | ✅ JWT + Admin Role | Admin-only endpoint |
| `/api/protected` | GET | ✅ JWT | Basic authentication test |

---

## Step-by-Step Testing Guide

### Test 1: Public Endpoint (No Authentication)

**Endpoint:** `GET http://localhost:4000/`

**Steps:**
1. Create new request
2. Method: `GET`
3. URL: `http://localhost:4000/`
4. Click **Send**

**Expected Response (200 OK):**
```json
{
  "message": "Welcome to User & Identity Service API",
  "team": "Team 1",
  "endpoints": {
    "public": [
      "GET / - This welcome message"
    ],
    "protected": [
      "GET /api/user/profile - Get authenticated user info",
      "GET /api/user/roles - Get user roles"
    ],
    "admin": [
      "GET /api/admin/dashboard - Admin-only endpoint"
    ]
  }
}
```

---

### Test 2: User Profile (JWT Required)

**Endpoint:** `GET http://localhost:4000/api/user/profile`

**Steps:**
1. Create new request
2. Method: `GET`
3. URL: `http://localhost:4000/api/user/profile`
4. Go to **Headers** tab
5. Add header:
   - Key: `Authorization`
   - Value: `Bearer eyJ4NXQiOiJxR0dOdGhiWE0...` (your actual token)
6. Click **Send**

**Expected Response (200 OK):**
```json
{
  "message": "✅ User profile retrieved",
  "userId": "4e0fb0e3-7e35-4abe-b3ee-6938e5009787",
  "email": "admin@demo.com",
  "username": "admin@demo.com",
  "tokenInfo": {
    "sub": "4e0fb0e3-7e35-4abe-b3ee-6938e5009787",
    "aut": "APPLICATION_USER",
    "iss": "https://api.asgardeo.io/t/testforfinalproject/oauth2/token",
    "given_name": "Admin",
    "client_id": "KYEfJzks5uXRratlXxNpS9dvpRQa",
    "aud": "KYEfJzks5uXRratlXxNpS9dvpRQa",
    "scope": "openid profile",
    "exp": 1763269645,
    "iat": 1763266045,
    "family_name": "User",
    "email": "admin@demo.com",
    "username": "admin@demo.com"
  }
}
```

**Without Token (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

### Test 3: User Roles (JWT Required)

**Endpoint:** `GET http://localhost:4000/api/user/roles`

**Steps:**
1. Create new request
2. Method: `GET`
3. URL: `http://localhost:4000/api/user/roles`
4. Headers tab → Add:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`
5. Click **Send**

**Expected Response (200 OK):**
```json
{
  "userId": "4e0fb0e3-7e35-4abe-b3ee-6938e5009787",
  "roles": ["user", "admin"],
  "isAdmin": true,
  "isUser": true
}
```

**If no groups claim in JWT:**
```json
{
  "userId": "4e0fb0e3-7e35-4abe-b3ee-6938e5009787",
  "roles": [],
  "isAdmin": false,
  "isUser": false
}
```

---

### Test 4: Admin Dashboard (JWT + Admin Role Required)

**Endpoint:** `GET http://localhost:4000/api/admin/dashboard`

**Steps:**
1. Create new request
2. Method: `GET`
3. URL: `http://localhost:4000/api/admin/dashboard`
4. Headers tab → Add:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`
5. Click **Send**

**Expected Response (200 OK) - With Admin Role:**
```json
{
  "message": "✅ Admin access granted",
  "adminUser": "4e0fb0e3-7e35-4abe-b3ee-6938e5009787",
  "roles": ["user", "admin"],
  "serverInfo": {
    "uptime": 1234.567,
    "nodeVersion": "v25.2.0",
    "platform": "linux"
  }
}
```

**Without Admin Role (403 Forbidden):**
```json
{
  "error": "Access denied. Admin role required.",
  "yourRoles": ["user"]
}
```

---

### Test 5: Protected Endpoint (JWT Required)

**Endpoint:** `GET http://localhost:4000/api/protected`

**Steps:**
1. Create new request
2. Method: `GET`
3. URL: `http://localhost:4000/api/protected`
4. Headers tab → Add:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`
5. Click **Send**

**Expected Response (200 OK):**
```json
{
  "message": "✅ Authentication successful",
  "authenticatedUser": "4e0fb0e3-7e35-4abe-b3ee-6938e5009787",
  "tokenValid": true
}
```

---

## Expected Responses

### Success Responses

**200 OK** - Request successful
```json
{
  "message": "✅ Success message",
  "data": { ... }
}
```

### Error Responses

**401 Unauthorized** - No token or invalid token
```json
{
  "error": "Unauthorized"
}
```

**403 Forbidden** - Valid token but insufficient permissions
```json
{
  "error": "Access denied. Admin role required.",
  "yourRoles": ["user"]
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

---

## Troubleshooting

### Issue: "Unauthorized" Error

**Possible Causes:**
1. Missing `Authorization` header
2. Token expired (tokens expire in 1 hour)
3. Typo in `Bearer` keyword
4. Missing space between `Bearer` and token
5. Backend not running

**Solutions:**
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Get a fresh token (sign in again)
- Verify backend is running on port 4000
- Check for extra spaces or line breaks in token

### Issue: "Access denied. Admin role required"

**Cause:** User doesn't have admin role

**Solution:**
1. Go to Asgardeo Console
2. Navigate to **User Management** → **Groups**
3. Create an `admin` group
4. Assign your user to the `admin` group
5. Configure `groups` claim in **User Attributes**
6. Sign out and sign in again to get new token

### Issue: "Cannot connect" / "Network Error"

**Cause:** Backend server not running

**Solution:**
```bash
cd backend
node server.js
```

Verify it's running on `http://localhost:4000`

### Issue: Token Expired

**Symptoms:**
- Was working, now getting 401 errors
- Token older than 1 hour

**Solution:**
- Sign in to React app again
- Copy the new token from browser console
- Update Authorization header in Postman

### Issue: CORS Error (only if testing from browser)

Postman doesn't have CORS restrictions. If testing from browser:
- Ensure `http://localhost:3000` is in Allowed Origins (Asgardeo Console)

---

## Postman Collection Export

### Creating a Collection

**1. Create New Collection**
- Click **Collections** in sidebar
- Click **+** or **Create Collection**
- Name: `Team 1 - User & Identity Service`

**2. Add Requests to Collection**
- Drag existing requests into the collection OR
- Click **...** next to collection → **Add Request**

**3. Use Collection Variables**

Set up a variable for the base URL:
- Click collection → **Variables** tab
- Add variable:
  - Variable: `baseUrl`
  - Initial Value: `http://localhost:4000`
  - Current Value: `http://localhost:4000`

Now use `{{baseUrl}}` in your requests:
- `{{baseUrl}}/api/user/profile`
- `{{baseUrl}}/api/user/roles`

**4. Set Up Authorization for Collection**

- Click collection → **Authorization** tab
- Type: `Bearer Token`
- Token: `YOUR_JWT_TOKEN`

All requests in the collection will inherit this auth.

### Sample Collection Structure

```
📁 Team 1 - User & Identity Service
  ├── 📄 Get API Info (Public)
  ├── 📄 Get User Profile
  ├── 📄 Get User Roles
  ├── 📄 Admin Dashboard
  └── 📄 Test Protected Endpoint
```

### Export Collection

1. Right-click collection → **Export**
2. Select **Collection v2.1** (recommended)
3. Save as `Team1_UserIdentityService.postman_collection.json`
4. Share with team members

### Import Collection

1. Click **Import** button
2. Select the `.json` file
3. Collection appears in sidebar

---

## Quick Reference Card

**Base URL:** `http://localhost:4000`

**Authorization Header Format:**
```
Authorization: Bearer eyJ4NXQiOiJxR0dOdGhiWE0...
```

**Endpoints:**

| Endpoint | Auth | Role | Response Code |
|----------|------|------|---------------|
| `GET /` | ❌ | - | 200 |
| `GET /api/user/profile` | ✅ | Any | 200 |
| `GET /api/user/roles` | ✅ | Any | 200 |
| `GET /api/admin/dashboard` | ✅ | Admin | 200 / 403 |
| `GET /api/protected` | ✅ | Any | 200 |

**Common Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

---

## Testing Workflow

**Recommended Testing Order:**

1. ✅ **Test Public Endpoint** (`/`)
   - Verify backend is running
   - No authentication needed

2. ✅ **Get JWT Token**
   - Sign in to React app
   - Copy token from browser console

3. ✅ **Test User Profile** (`/api/user/profile`)
   - Verify JWT validation works
   - Check user data in response

4. ✅ **Test User Roles** (`/api/user/roles`)
   - Verify RBAC configuration
   - Check if groups claim present

5. ✅ **Test Admin Endpoint** (`/api/admin/dashboard`)
   - If you have admin role: expect 200
   - If you don't: expect 403

6. ✅ **Test Protected Endpoint** (`/api/protected`)
   - Basic auth test

---

## Additional Tips

### Tip 1: Save Requests

Click **Save** after creating a request to reuse it later.

### Tip 2: Use Environments

Create environments for different setups:
- **Development**: `http://localhost:4000`
- **Staging**: `https://staging-api.yourdomain.com`
- **Production**: `https://api.yourdomain.com`

### Tip 3: Use Pre-request Scripts

Auto-refresh tokens using Postman's pre-request scripts.

### Tip 4: Use Tests

Add tests to verify responses:
```javascript
// In Tests tab
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has message", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
});
```

### Tip 5: View Response Time

Check the response time in Postman to monitor API performance.

---

## Summary

**To test an endpoint:**
1. Start backend server
2. Sign in to React app
3. Copy JWT token from console
4. Create request in Postman
5. Add `Authorization: Bearer TOKEN` header
6. Send request
7. Verify response

**Common Issues:**
- Forgot `Bearer` keyword
- Token expired (get new one)
- Backend not running
- Missing admin role

---

**Document Version:** 1.0  
**Last Updated:** November 16, 2025  
**Project:** Team 1 - User & Identity Service
