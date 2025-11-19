# 🔐 Team 1 – User & Identity Service

## Project Overview
Authentication and Identity Service demonstration using React frontend and Express.js backend, secured with Asgardeo for JWT-based authentication and Role-Based Access Control (RBAC).

## 🎯 Team 1 Objectives

1. ✅ **Evaluate feasibility** of using Asgardeo (Free/Sample Plan) for authentication
2. ✅ **Integrate Asgardeo** with React and Node.js
3. ✅ **Implement RBAC** for role-based access control
4. ✅ **Determine method** to share authentication between microservices

## ✅ What's Included

### Frontend (React + Vite)
- ✅ Asgardeo authentication integration (@asgardeo/auth-react)
- ✅ Protected routes with React Router
- ✅ Sign-in and Dashboard pages
- ✅ User profile and role display
- ✅ RBAC testing interface
- ✅ JWT token management

### Backend (Express.js)
- ✅ JWT token validation middleware
- ✅ User profile endpoints
- ✅ Role extraction from JWT
- ✅ RBAC middleware implementation
- ✅ Admin-only protected endpoints
- ✅ CORS enabled

## 📦 Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Configuration

### Backend `.env` file
Update `/backend/.env` with your Asgardeo credentials:

```env
ASGARDEO_ISSUER=https://api.asgardeo.io/t/YOUR_ORG_NAME/oauth2/token
ASGARDEO_AUDIENCE=YOUR_CLIENT_ID
PORT=4000
```

### Frontend Asgardeo Config
Update `/frontend/src/index.jsx`:

```javascript
const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG_NAME",
  scope: ["openid", "profile", "email"]
};
```

## 🏃 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
node server.js
```
Backend runs on: `http://localhost:4000`

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

## 🔑 API Endpoints

### Public
- `GET /` - Welcome message with endpoint documentation

### Protected (Requires JWT)
- `GET /api/user/profile` - Get authenticated user profile
- `GET /api/user/roles` - Get user roles and RBAC info
- `GET /api/protected` - Test authentication

### Admin Only (Requires JWT + admin role)
- `GET /api/admin/dashboard` - Admin-only endpoint

## 🧪 Testing

### Test Authentication
1. Navigate to `http://localhost:3000`
2. Click "Sign In with Asgardeo"
3. Login with your Asgardeo account
4. You'll be redirected to the Dashboard

### Test User Profile
- View your user information (email, username, user ID)
- See your assigned roles

### Test RBAC (Role-Based Access Control)
1. Click "Test Admin Endpoint" button on dashboard
2. **If you have admin role**: ✅ Access granted
3. **If you don't have admin role**: ❌ 403 Forbidden

To assign admin role:
1. Go to Asgardeo Console
2. Navigate to **User Management** → **Users**
3. Select your user → **Roles** tab
4. Assign `admin` role

## 📚 Documentation

See `TEAM1_GUIDE.md` for comprehensive documentation:
- Asgardeo feasibility analysis
- Complete React integration guide
- Complete Node.js integration guide
- RBAC implementation details
- Microservice authentication strategy
- JWT token explanation

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite 7
- React Router 6
- Axios
- @asgardeo/auth-react

**Backend:**
- Express.js
- express-oauth2-jwt-bearer (JWT validation)
- CORS
- dotenv

**Authentication:**
- Asgardeo (Identity Provider)
- JWT Tokens
- Role-Based Access Control

## 📁 Project Structure

```
user-auth-demo/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SignIn.jsx           # Login page
│   │   │   └── Dashboard.jsx        # Protected dashboard with RBAC demo
│   │   ├── styles/
│   │   │   ├── SignIn.css
│   │   │   └── Dashboard.css
│   │   ├── App.jsx                  # Router + Protected routes
│   │   └── index.jsx                # Asgardeo config
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    ├── server.js                    # Express API + JWT validation + RBAC
    ├── .env                         # Asgardeo credentials
    └── package.json
```

## 🔒 Security Features

✅ **JWT Token Validation** - All protected routes validate tokens  
✅ **Role-Based Access Control** - Admin endpoints require admin role  
✅ **Token Expiration** - Automatic validation of token expiry  
✅ **Signature Verification** - Ensures tokens are from Asgardeo  
✅ **CORS Protection** - Controlled cross-origin access  

## 📊 Team 1 Achievements

### 1. Asgardeo Feasibility ✅
- **Confirmed**: Free plan supports our requirements
- **Features verified**: RBAC, JWT, unlimited users (with MAU limits)
- **Conclusion**: Suitable for development and small-scale production

### 2. React Integration ✅
- **SDK**: @asgardeo/auth-react successfully integrated
- **Features**: Login, Logout, Protected Routes, Token Management
- **Result**: Seamless authentication flow

### 3. Node.js Integration ✅
- **Middleware**: express-oauth2-jwt-bearer validates JWT automatically
- **User Extraction**: `req.auth.sub` provides user ID
- **Result**: Secure API endpoints

### 4. RBAC Implementation ✅
- **Method**: JWT `groups` claim contains user roles
- **Middleware**: Custom `requireAdmin` middleware checks roles
- **Result**: Working admin-only endpoints

### 5. Microservice Authentication ✅
- **Method**: JWT Token Propagation
- **How**: Forward JWT token between services
- **Benefits**: Stateless, secure, scalable
- **Result**: Ready for microservice architecture

## 🐛 Troubleshooting

### Frontend won't start
- Make sure you're using Node.js v14+
- Run `npm install` in the frontend directory

### Backend JWT validation fails
- Check `.env` file configuration
- Verify Asgardeo issuer URL and audience
- Ensure token is being sent in Authorization header

### CORS errors
- Backend must include `app.use(cors())`
- Check frontend is running on port 3000

### Admin endpoint returns 403
- User must have `admin` role in Asgardeo
- Configure Asgardeo to include `groups` in JWT token:
  1. Go to Applications → Your App → User Attributes
  2. Add `groups` to Access Token

## 🚀 Next Steps

1. **Add Database** - Store user data and preferences
2. **Implement Refresh Tokens** - Better UX with automatic token refresh
3. **Add More Roles** - moderator, viewer, etc.
4. **Microservice Demo** - Create second service to demonstrate JWT propagation
5. **Deploy** - Deploy to production (Vercel + Railway)

## 📞 Support

For detailed explanations, see:
- `TEAM1_GUIDE.md` - Comprehensive implementation guide
- [Asgardeo Docs](https://wso2.com/asgardeo/docs/)
- [Express JWT Docs](https://github.com/auth0/express-oauth2-jwt-bearer)

---
