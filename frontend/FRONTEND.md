# Frontend - React + Vite with Asgardeo

## Features

- **OAuth 2.0 Login/Logout**: Using @asgardeo/auth-react SDK
- **Protected Routes**: React Router integration
- **API Integration**: Calls to backend with JWT tokens using Axios
- **Role Display**: Shows user roles from token
- **Responsive UI**: Modern, gradient-based design
- **Centralized API Service**: Clean axios-based API client

## Running the App

```bash
npm run dev
```

App will start on `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run preview
```

## How Authentication Works

1. **Home Page**: Unauthenticated users are redirected to `/home`
2. **Sign In**: User clicks "Sign In with Asgardeo" button
3. **OAuth Redirect**: Redirected to Asgardeo's secure login page
4. **Authentication**: User authenticates with Asgardeo credentials
5. **Callback**: Asgardeo redirects back to app with authorization code
6. **Token Exchange**: SDK exchanges code for access token (PKCE flow)
7. **Token Storage**: Access token and ID token stored in sessionStorage
8. **Role Extraction**: User role extracted from ID token (`roles` claim)
9. **Auto-Redirect**: Automatic redirect to `/user` or `/admin` based on role

## API Integration Example

Using Axios for HTTP requests:

```javascript
import { apiService } from './services/api'

const token = await getAccessToken()

// Public endpoint (no auth)
const publicData = await apiService.getPublic()

// Private endpoint (auth required)
const privateData = await apiService.getPrivate(token)

// Admin endpoint (auth + role required)
const adminData = await apiService.getAdmin(token)
```

### Error Handling
```javascript
try {
  const data = await apiService.getAdmin(token)
} catch (error) {
  if (error.response) {
    // Server error (4xx, 5xx)
    console.log('Status:', error.response.status)
    console.log('Data:', error.response.data)
  } else if (error.request) {
    // No response from server
    console.log('Network error')
  } else {
    console.log('Error:', error.message)
  }
}
```

## Routes

- `/` - Root redirect (auto-redirects based on authentication state)
  - Not authenticated → `/home`
  - Authenticated with user role → `/user`
  - Authenticated with admin role → `/admin`
- `/home` - Home page with OAuth 2.0 sign-in (unauthenticated users)
- `/user` - Protected user dashboard (requires authentication)
- `/admin` - Protected admin dashboard (requires authentication + admin role)
- `*` - Fallback route (redirects to `/`)

## Configuration

Asgardeo configuration is in `src/main.jsx`:

```javascript
const config = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "KYE72a5xuVRatXXeIq5StkpRQ0a",
  baseUrl: "https://api.asgardeo.io/t/testforfinalproject",
  scope: ["openid", "profile", "email", "groups", "roles"]
}
```

---

## Page Components

### Home Page (`/pages/Home/Home.jsx`)

**Purpose**: Landing page for unauthenticated users with OAuth 2.0 sign-in

**Features**:
- Clean, modern UI with gradient background
- Feature showcase (OAuth 2.0, RBAC, JWT, Microservices)
- "Sign In with Asgardeo" button
- Auto-redirect if user is already authenticated
- Loading overlay during OAuth redirect

**Component Details**:
```jsx
import Home from './pages/Home/Home'

<Home />
```

**CSS Classes**:
- `.home-container` - Main container with gradient background
- `.home-card` - White card with rounded corners
- `.home-header` - Gradient header section
- `.home-content` - Main content area
- `.home-button` - Sign-in button
- `.loading-overlay` - Loading state overlay

**Behavior**:
- If `state.isAuthenticated === true`, redirects to `/` (which redirects to role-based dashboard)
- Clicking "Sign In with Asgardeo" triggers `signIn()` from Asgardeo SDK
- Shows loading overlay when `state.isLoading === true`

### User Page (`/pages/UserPage/UserPage.jsx`)
- Protected route (requires authentication)
- Displays user's first name and last name from JWT token
- Shows user email and roles
- Access to user-specific data from backend `/api/private`

### Admin Page (`/pages/AdminPage/AdminPage.jsx`)
- Protected route (requires authentication + admin role)
- Displays admin's first name and last name from JWT token
- Shows admin email and roles
- Access to admin-specific data from backend `/api/admin`

---

## Styling

### Home Page Styles

The Home page uses a modern gradient theme with these key features:

**Colors**:
- Primary gradient: `#667eea` → `#764ba2`
- White card background
- Dark text on white, white text on gradient

**Layout**:
- Centered card layout
- Responsive padding
- Box shadow for depth
- Rounded corners (16px radius)

**Animations**:
- Smooth transitions on button hover
- Loading spinner during OAuth redirect

**Customization**:
You can customize the Home page by editing `/pages/Home/Home.css`:

```css
.home-container {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

.home-header {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

.home-button {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

