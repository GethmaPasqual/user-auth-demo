# Asgardeo Role Configuration Guide

## Step 1: Create Roles in Asgardeo Console

1. **Login to Asgardeo**
   - Go to https://console.asgardeo.io/
   - Login with your credentials

2. **Navigate to Roles**
   - Click on "User Management" → "Roles"
   - Click "New Role"

3. **Create the following roles:**
   
   **Admin Role:**
   - Role Name: `admin` or `Administrator`
   - Permissions: Full access
   
   **User Role:**
   - Role Name: `user` or `User`
   - Permissions: Standard user access
   
   **Viewer Role:**
   - Role Name: `viewer` or `Viewer`
   - Permissions: Read-only access

## Step 2: Assign Roles to Users

1. Go to "User Management" → "Users"
2. Select a user
3. Click "Assign Roles"
4. Add appropriate role (admin/user/viewer)

## Step 3: Configure Application to Include Roles in Token

1. **Go to your Application**
   - Navigate to "Applications" in Asgardeo console
   - Select your application

2. **Configure User Attributes**
   - Go to "User Attributes" tab
   - Enable "Groups" claim to be sent in the ID token and access token
   - Enable "Roles" claim if available

3. **Add Custom Claims (if needed)**
   - Go to "Advanced" → "OIDC Scopes"
   - Create custom scope for roles if needed
   - Map role attributes to token claims

## Step 4: Update Your Application Configuration

### Update backend/.env
```env
# If roles are in 'groups' claim
ROLE_CLAIM=groups

# Or if roles are in 'permissions' claim
ROLE_CLAIM=permissions
```

## Step 5: Test Role Configuration

### Test in Backend
```bash
# Get token from Asgardeo login
# Then test endpoints:

# Should work for all authenticated users
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/check-role

# Should work only for users with 'admin' role
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/admin/dashboard

# Should work for users with 'user' or 'admin' role
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/user/profile
```

## Step 6: Verify JWT Token Contains Roles

Use https://jwt.io/ to decode your access token and verify it contains:
- `groups` array with role names
- OR `permissions` array with role names
- OR custom claim you configured

Example JWT payload:
```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "groups": ["admin"],  // ← Roles should appear here
  "iss": "https://api.asgardeo.io/t/yourorg",
  "aud": "your-client-id"
}
```

## Troubleshooting

### Roles not appearing in token?
1. Check application configuration in Asgardeo
2. Verify user has roles assigned
3. Ensure "groups" or "roles" claim is enabled
4. Try re-login to get fresh token

### 403 Forbidden errors?
1. Check token at jwt.io
2. Verify role names match exactly (case-sensitive)
3. Check backend console for role extraction logs
4. Verify middleware is applied correctly

## Role Hierarchy

```
admin → Full access to all endpoints
  ├── /api/admin/dashboard
  ├── /api/admin/users
  ├── /api/user/profile
  └── /api/protected

user → Standard user access
  ├── /api/user/profile
  └── /api/protected

viewer → Read-only access
  └── /api/protected
```

## Important Notes

- Role names are **case-sensitive**
- Backend checks for both variations (e.g., 'admin' OR 'Administrator')
- Frontend falls back to email/username check if backend role check fails
- Always test with actual tokens from Asgardeo
