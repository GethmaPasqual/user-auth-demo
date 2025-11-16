# Team 1 - User & Identity Service (Frontend)

## Overview
React SPA demonstrating Asgardeo authentication, role-based access control (RBAC), and JWT token handling for microservices integration.

## Features
- ✅ Asgardeo OpenID Connect (OIDC) authentication
- ✅ JWT access token with user attributes
- ✅ Role-Based Access Control (RBAC) with groups claim
- ✅ Protected routes with React Router
- ✅ Token-based API communication
- ✅ Admin endpoint testing

## Tech Stack
- **React** 18.3.1
- **Vite** 7.2.2 (Build tool)
- **@asgardeo/auth-react** 5.4.3 (Authentication SDK)
- **React Router DOM** (Client-side routing)
- **Axios** (HTTP client)

## Configuration

### Current Asgardeo Settings
- **Client ID**: `KYEfJzks5uXRratlXxNpS9dvpRQa`
- **Base URL**: `https://api.asgardeo.io/t/testforfinalproject`
- **Redirect URL**: `http://localhost:3000`
- **Scope**: `openid profile`

### Update Configuration (if needed)
Edit `src/index.jsx`:
```javascript
const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG",
  scope: ["openid", "profile"]
};
```

## Installation & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will run on **http://localhost:3000**

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── SignIn.jsx          # Login page
│   │   └── Dashboard.jsx       # Protected dashboard with user info & RBAC
│   ├── styles/
│   │   ├── SignIn.css          # Sign-in page styles
│   │   └── Dashboard.css       # Dashboard styles
│   ├── App.jsx                 # Root component with routing
│   ├── index.jsx               # Entry point with AuthProvider
│   └── main.jsx                # Vite entry
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies & scripts
```

## Authentication Flow

1. **User visits app** → Redirected to SignIn page
2. **Click "Sign In with Asgardeo"** → Redirected to Asgardeo login
3. **User authenticates** → Asgardeo redirects back with authorization code
4. **SDK exchanges code for tokens** → JWT access token & ID token received
5. **User redirected to Dashboard** → Protected route with user info & roles
6. **API calls include JWT** → Backend validates token and checks roles

## Access Token Attributes

The JWT access token includes:
- `sub` - User ID
- `email` - User email address
- `username` - Username
- `groups` - User roles (for RBAC)
- `aud` - Audience (client ID)
- `iss` - Issuer (Asgardeo)
- `exp` - Expiration timestamp
- `iat` - Issued at timestamp

**View Token Attributes:**
Open browser console (F12) after signing in to see decoded JWT payload.

## Role-Based Access Control (RBAC)

User roles are included in the `groups` claim of the JWT access token.

**Example:**
```json
{
  "sub": "user-12345",
  "email": "user@example.com",
  "groups": ["user", "admin"],
  "aud": "KYEfJzks5uXRratlXxNpS9dvpRQa",
  "iss": "https://api.asgardeo.io/t/testforfinalproject/oauth2/token"
}
```

**Dashboard Features:**
- Displays user roles as badges
- Tests admin-only endpoint
- Shows appropriate messages based on user role

## API Integration

All API calls to the backend include the JWT access token:

```javascript
const token = await getAccessToken();
const response = await axios.get("http://localhost:4000/api/user/roles", {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Asgardeo Setup (For New Applications)

1. **Go to [Asgardeo Console](https://console.asgardeo.io)**
2. **Create Application** → Select **Single Page Application**
3. **Configure Protocol Settings:**
   - Allowed grant types: `Code`, `Refresh Token`
   - Authorized redirect URLs: `http://localhost:3000`
   - Allowed origins: `http://localhost:3000`
   - Enable **PKCE** (Mandatory)
   - Mark as **Public Client**
4. **Configure User Attributes:**
   - Add `groups` to access token attributes
   - Include `email`, `username`, `given_name`, `family_name`
5. **Copy Client ID** → Update in `src/index.jsx`

## Troubleshooting

**Issue: "Cannot initialize local storage" error**
- Already fixed in `package.json` with `NODE_OPTIONS='--localstorage-file=/tmp/.localstorage'`

**Issue: CORS errors**
- Ensure `http://localhost:3000` is added to **Allowed Origins** in Asgardeo

**Issue: Redirect loop**
- Verify **Authorized redirect URLs** in Asgardeo match exactly: `http://localhost:3000`

**Issue: No roles in JWT**
- Check **User Attributes** tab in Asgardeo
- Ensure `groups` claim is added to access token
- Assign roles to test users in Asgardeo Console

**Issue: Token validation fails**
- Ensure backend `.env` has correct `ASGARDEO_ISSUER` and `ASGARDEO_AUDIENCE`

## Team 1 Objectives

This frontend demonstrates:
1. ✅ **Asgardeo Feasibility** - Free plan supports SPA authentication
2. ✅ **React Integration** - `@asgardeo/auth-react` SDK implementation
3. ✅ **RBAC** - Groups claim in JWT enables role-based features
4. ✅ **Microservices Auth** - JWT token propagation to backend APIs

## Additional Documentation

- **TEAM1_GUIDE.md** - Comprehensive Team 1 implementation guide
- **OIDC_CONFIGURATION_REFERENCE.md** - Complete Asgardeo OIDC settings reference
- **README.md** (root) - Quick start for entire project

## Resources

- [Asgardeo Documentation](https://wso2.com/asgardeo/docs/)
- [@asgardeo/auth-react SDK](https://github.com/asgardeo/asgardeo-auth-react-sdk)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
