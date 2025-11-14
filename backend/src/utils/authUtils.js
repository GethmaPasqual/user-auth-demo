// Extract user information from JWT token
const getUserInfo = (req) => {
  const auth = req.auth || {};
  const permissions = auth.permissions || auth.groups || [];
  
  return {
    userId: auth.sub,
    email: auth.email,
    username: auth.username || auth.preferred_username,
    roles: permissions,
    fullName: auth.name,
    isAdmin: permissions.some(
      role => role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator'
    )
  };
};

// Check if user has specific role
const hasRole = (req, roleName) => {
  const auth = req.auth || {};
  const roles = auth.permissions || auth.groups || [];
  return roles.some(role => role.toLowerCase() === roleName.toLowerCase());
};

// Check if user is admin
const isAdmin = (req) => {
  return hasRole(req, 'admin') || hasRole(req, 'administrator');
};

module.exports = {
  getUserInfo,
  hasRole,
  isAdmin
};
