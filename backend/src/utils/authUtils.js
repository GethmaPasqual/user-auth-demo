// Extract user information from JWT token
const getUserInfo = (req) => {
  return {
    userId: req.auth?.sub,
    email: req.auth?.email,
    username: req.auth?.username || req.auth?.preferred_username,
    roles: req.auth?.permissions || req.auth?.groups || [],
    fullName: req.auth?.name,
    isAdmin: (req.auth?.permissions || req.auth?.groups || []).some(
      role => role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator'
    )
  };
};

// Check if user has specific role
const hasRole = (req, roleName) => {
  const roles = req.auth?.permissions || req.auth?.groups || [];
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
